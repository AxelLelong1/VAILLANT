package fr.epita.assistants.myide.domain.service;

import fr.epita.assistants.myide.domain.entity.IDENode;
import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.utils.Logger;


import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.file.Files;
import java.nio.file.Path;


import static fr.epita.assistants.myide.presentation.rest.MyIdeEndpoint.currProject;
import static fr.epita.assistants.myide.presentation.rest.MyIdeEndpoint.ps;

public class IDENodeService implements NodeService {
    @Override
    public Node update(Node node, int from, int to, byte[] insertedContent)
    {
        if (!node.isFile())
            throw new RuntimeException("Update: node is a Folder");
        RandomAccessFile file;
        try {
            file = new RandomAccessFile(node.getPath().toFile(), "rw");

            file.seek(to);
            byte[] after = new byte[(int)(file.length() - to)];
            file.read(after);

            file.seek(from);
            file.write(insertedContent);
            file.write(after);
            file.close();
            return node;
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    private static boolean deleteDirectory(File directory) {
        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isFile()) {
                    boolean returnValue = file.delete();
                    if (!returnValue)
                        return false;
                } else if (file.isDirectory()) {
                    deleteDirectory(file);
                }
            }
        }
        return directory.delete();
    }
    public Node search(Node curr, Path path)
    {
        if (path.compareTo(curr.getPath()) == 0) {
            return curr;
        }
        for (Node n: curr.getChildren()) {
            if (path.startsWith(n.getPath())) {
                return search(n, path);
            }
        }
        return null;
    }
    @Override
    public boolean delete(Node node)
    {
        boolean returnValue = true;
        if (node.isFile())
            returnValue = node.getPath().toFile().delete();
        else if (node.isFolder())
            returnValue = deleteDirectory(node.getPath().toFile());
        if (returnValue) {
            IDENode n = (IDENode) node;
            Node parent = n.getParent();
            if (parent != null)
                parent.getChildren().remove(node);
        }
        return returnValue;
    }
    @Override
    public Node create(Node folder, String name, Node.Type type) {
        Logger.log("Attempt to create a new node");
        File f = new File(folder.getPath().toString() + "/" + name);
        Logger.log("new file will be at " + f.getPath());
        try {
            if ((type == Node.Types.FILE && f.createNewFile()) || (type == Node.Types.FOLDER && f.mkdir()))
            {
                IDENode node = new IDENode(f.toPath(), folder);
                folder.getChildren().add(node);
                return node;
            }
            else
                throw new RuntimeException("Create: file already exists");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Node move(Node nodeToMove, Node destinationFolder) {
        try {
            // Move the files
            Path f = nodeToMove.getPath();
            Path dst = destinationFolder.getPath();
            if (destinationFolder.isFolder())
                dst = Path.of(destinationFolder.getPath().toString() + "/" + f.getFileName().toString());
            Files.move(f, dst);

            // Delete the node
            IDENode n = (IDENode)nodeToMove;
            Node parent = n.getParent();
            if (parent != null)
                parent.getChildren().remove(nodeToMove);

            // Build the new node
            //String new_path = destinationFolder.getPath().toString() + nodeToMove.getPath().getFileName().toString();
            String new_path = dst.toString();
            Node dstNode = null;
            if (destinationFolder.isFile())
            {
                Path path = destinationFolder.getPath().getParent();
                dstNode = ((IDENodeService) ps.getNodeService()).search(currProject.getRootNode(), path);
            }
            Node new_node = new IDENode(new_path, dstNode);
            if (dstNode != null)
                dstNode.getChildren().add(new_node);
            return new_node;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Node save(Node node, String content)
    {
        if (!node.isFile())
            throw new RuntimeException("Save: node is a Folder");
        FileWriter file;
        try {
            file = new FileWriter(node.getPath().toFile());

            file.write(content);
            file.close();
            return node;
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String content(Node node)
    {
        if (!node.isFile())
            throw new RuntimeException("Content: node is a Folder");
        try {
            return Files.readString(node.getPath());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

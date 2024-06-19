package fr.epita.assistants.myide.presentation.rest;

import fr.epita.assistants.MyIde;
import fr.epita.assistants.myide.NodeHandler.IDENode;
import fr.epita.assistants.myide.NodeHandler.IDENodeService;
import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.service.ProjectService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import fr.epita.assistants.myide.utils.Logger;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Path("/api")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MyIdeEndpoint {
    private static final ProjectService ps = MyIde.init(null);
    private static Project currProject;

    private static final List<Node> filesOpened = new ArrayList<>();

    private static Response logRespOk(String message)
    {
        Logger.log(message);
        return Response.ok(message).build();
    }
    private static Response logRespErr(int status, String message)
    {
        Logger.logError(message);
        return Response.status(status, message).build();
    }
    @GET @Path("/hello")
    public Response helloWorld()
    {
        Logger.log("Saying hello !");
        return Response.ok("Hello World !").build();
    }

    @POST @Path("/open/project")
    public Response openProj(PathRequest req) {
        if (req == null || req.path() == null)
            return logRespErr(400, "Project is null");
        String ProjectPath = req.path();
        Logger.log("Opening project " + ProjectPath);

        java.nio.file.Path path = Paths.get(ProjectPath).toAbsolutePath();
        if (!Files.exists(path))
            return logRespErr(400, "Project doesn't exist");
        currProject = ps.load(path);
        return logRespOk("Project opened");
    }
    @POST @Path("/open/file")
    public Response openFile(PathRequest req) {
        if (req == null || req.path() == null)
            return logRespErr(400, "File is null");
        String FilePath = req.path();
        Logger.log("Opening file " + FilePath);
        java.nio.file.Path path = Paths.get(FilePath).toAbsolutePath();
        if (!Files.exists(path))
            return logRespErr(400, "File doesn't exist");
        if (currProject != null)
        {
            Node file = ((IDENodeService)ps.getNodeService()).search(currProject.getRootNode(), path);
            if (file != null)
            {
                filesOpened.add(file);
                return logRespOk("File opened");
            }
        }
        filesOpened.add(new IDENode(FilePath));
        return logRespOk("File opened");
    }

    @POST @Path("/create/file")
    public Response createFile(PathRequest req) {
        if (req == null || req.path() == null)
            return logRespErr(400, "File is null");
        String FilePath = req.path();
        Logger.log("Creating new file " + FilePath);
        java.nio.file.Path path = Paths.get(FilePath).toAbsolutePath();
        java.nio.file.Path parentPath = path.getParent();
        String name = path.getFileName().toString();
        if (currProject != null)
        {
            Node parentNode = ((IDENodeService)ps.getNodeService()).search(currProject.getRootNode(), parentPath);
            if (parentNode != null)
            {
                if (parentNode.isFile())
                    return logRespErr(400, "Incorrect Path");
                Node file;
                try {
                    file = (ps.getNodeService()).create(parentNode, name, Node.Types.FILE);
                } catch (Exception e) {
                    return logRespErr(400, "Folder already exists");
                }
                if (file!= null)
                {
                    filesOpened.add(file);
                    return logRespOk("File created");
                }
                return logRespErr(400, "File cannot be created");
            }
        }
        Node file = new IDENode(path);
        File f = new File(path.toString());

        try {
            if (!f.createNewFile())
                return logRespErr(400, "File already exists");
        } catch (Exception e) {
            return logRespErr(400, "File cannot be created");
        }

        filesOpened.add(file);
        return logRespOk("File created");
    }

    @POST @Path("/create/folder")
    public Response createFolder(PathRequest req) {
        if (req == null || req.path() == null)
            return logRespErr(400, "Folder is null");
        String FolderPath = req.path();
        Logger.log("Creating new folder " + FolderPath);

        java.nio.file.Path path = Paths.get(FolderPath).toAbsolutePath();
        java.nio.file.Path parentPath = path.getParent();
        String name = path.getFileName().toString();
        if (currProject != null)
        {
            Node parentNode = ((IDENodeService)ps.getNodeService()).search(currProject.getRootNode(), parentPath);
            if (parentNode != null)
            {
                if (parentNode.isFile())
                    return logRespErr(400, "Incorrect Path");
                Node file;
                try {
                    file = (ps.getNodeService()).create(parentNode, name, Node.Types.FOLDER);
                } catch (Exception e) {
                    return logRespErr(400, "Folder already exists");
                }
                if (file!= null)
                    return logRespOk("Folder created");
                return logRespErr(400, "Folder cannot be created");
            }
        }
        File f = new File(path.toString());
        try {
            if (!f.mkdir())
                return logRespErr(400, "Folder already exists");
        } catch (Exception e) {
            return logRespErr(400, "Folder cannot be created");
        }
        return logRespOk("Folder created");
    }

    @POST @Path("/delete/file")
    public Response deleteFile(PathRequest req) {
        if (req == null || req.path() == null)
            return logRespErr(400, "File is null");
        String FilePath = req.path();
        Logger.log("Deleting file " + FilePath);
        java.nio.file.Path path = Paths.get(FilePath).toAbsolutePath();
        if (currProject != null)
        {
            Node node = ((IDENodeService)ps.getNodeService()).search(currProject.getRootNode(), path);
            if (node!= null)
            {
                if (ps.getNodeService().delete(node)) {
                    filesOpened.remove(node);
                    return logRespOk("File deleted");
                }
                else
                    return logRespErr(400, "File cannot be deleted");
            }
        }
        if (path.toFile().delete()) {
            for (Node node : filesOpened) {
                if (node.getPath().compareTo(path) == 0) {
                    filesOpened.remove(node);
                    break;
                }
            }
            return logRespOk("File deleted");
        }
        return logRespErr(400, "File cannot be deleted");
    }

    private boolean deleteDirectory(File directory) {
        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isFile()) {
                    for (Node node : filesOpened) {
                        if (node.getPath().compareTo(file.toPath()) == 0) {
                            filesOpened.remove(node);
                            break;
                        }
                    }
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
    @POST @Path("/delete/folder")
    public Response deleteFolder(PathRequest req) {
        if (req == null || req.path() == null)
            return logRespErr(400, "Folder is null");
        String FilePath = req.path();
        Logger.log("Deleting folder " + FilePath);
        java.nio.file.Path path = Paths.get(FilePath).toAbsolutePath();
        if (currProject != null) {
            Node node = ((IDENodeService) ps.getNodeService()).search(currProject.getRootNode(), path);
            if (node != null) {
                for (Node n : filesOpened) {
                    if (n.getPath().startsWith(path)) {
                        filesOpened.remove(node);
                        break;
                    }
                }
                if (ps.getNodeService().delete(node)) {
                    return logRespOk("Folder deleted");
                } else
                    return logRespErr(400, "Folder cannot be deleted");
            }
        }
        if (deleteDirectory(path.toFile())) {
            return logRespOk("Folder deleted");
        }
        return logRespErr(400, "Folder cannot be deleted");
    }

    @POST @Path("/move")
    public Response move(MoveRequest req) {
        if (req == null || req.src() == null || req.dst() == null)
            return logRespErr(400, "srcPath and/or dstPath are null");
        String srcPath = req.src();
        String dstPath = req.dst();
        Logger.log("moving " + srcPath + " to " + dstPath);
        java.nio.file.Path path = Paths.get(srcPath).toAbsolutePath();
        java.nio.file.Path path1 = Paths.get(dstPath).toAbsolutePath();
        if (currProject != null) {
            Node srcNode = ((IDENodeService) ps.getNodeService()).search(currProject.getRootNode(), path);
            Node dstNode = ((IDENodeService) ps.getNodeService()).search(currProject.getRootNode(), path1);
            if (srcNode != null && dstNode != null) {
                try {
                    ps.getNodeService().move(srcNode, dstNode);
                    return logRespOk("File moved");
                }
                catch (Exception e) {
                    return logRespErr(400, "File cannot be moved");
                }
            } else
                return logRespErr(400, "File is not in the project");
        }
        return logRespErr(400, "We haven't open the project");
    }

    @POST @Path("/update")
    public Response update(UpdateRequest req) {
        if (req == null || req.path() == null || req.content() == null || req.to() == null || req.from() == null || req.from() < 0 || req.to() < req.from() || req.to() > req.content().length())
            return logRespErr(400, "File null");
        String FilePath = req.path();
        String content = req.content();
        Integer from = req.from();
        Integer to = req.to();
        Logger.log("updating " + FilePath);
        java.nio.file.Path path = Paths.get(FilePath).toAbsolutePath();
        Node node = null;
        if (currProject != null)
            node = ((IDENodeService) ps.getNodeService()).search(currProject.getRootNode(), path);
        if (node == null)
            node = new IDENode(path);
        try {
            ps.getNodeService().update(node, from, to, content.getBytes());
            return logRespOk("File updated successfully");
        }
        catch (Exception e) {
            return logRespErr(400, "File cannot be updated");
        }
    }

    @POST @Path("/execFeature")
    public Response execFeature(FeatureRequest req) {
        if (req == null || req.feature() == null || req.params() == null || req.project() == null)
            return logRespErr(400, "File null");
        String feature = req.feature();
        List<String> params = req.params();
        String project = req.project();
        Logger.log("executing " + feature + " on " + project);
        Project p = ps.load(Paths.get(project).toAbsolutePath());
        Feature.Type type;
        try {
            type = Mandatory.Features.Git.valueOf(feature);
        }
        catch (Exception e) {
            try {
                type = Mandatory.Features.Any.valueOf(feature);
            }
            catch (Exception es) {
                try {
                    type = Mandatory.Features.Maven.valueOf(feature);
                }
                catch (Exception ex) {
                    return logRespErr(400, "Bad feature");
                }
            }
        }
        Feature.ExecutionReport report = ps.execute(p, type, params);
        if (report.isSuccess())
            return logRespOk("Feature executed successfully");
        return logRespErr(500, "Feature execution failed");
    }
}
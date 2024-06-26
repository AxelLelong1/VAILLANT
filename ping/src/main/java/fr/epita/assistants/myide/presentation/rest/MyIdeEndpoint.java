package fr.epita.assistants.myide.presentation.rest;

import fr.epita.assistants.MyIde;
import fr.epita.assistants.myide.domain.entity.*;
import fr.epita.assistants.myide.domain.entity.report.SearchFeatureReport;
import fr.epita.assistants.myide.domain.service.IDENodeService;
import fr.epita.assistants.myide.domain.service.ProjectService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import fr.epita.assistants.myide.utils.Logger;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Path("/api")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MyIdeEndpoint {
    public static final ProjectService ps = MyIde.init(new MyIde.Configuration(Paths.get("tempFolder/indexFile"), Paths.get("tempFolder")));
    public static Project currProject;

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
    public static String convertTreeToJson(Node root)
    {
        StringBuilder jsonBuilder = new StringBuilder();
        convertNodeToJson(root, jsonBuilder, 0);
        return jsonBuilder.toString();
    }

    private static void convertNodeToJson(Node node, StringBuilder jsonBuilder, int indentLevel) {
        addIndentation(jsonBuilder, indentLevel);
        jsonBuilder.append("{\n");
        addIndentation(jsonBuilder, indentLevel + 1);
        jsonBuilder.append("\"name\": \"").append(node.getPath().getFileName());
        if (node.isFolder())
            jsonBuilder.append("\",\n");
        else
            jsonBuilder.append("\"\n");
        if (node.isFolder()) {
            addIndentation(jsonBuilder, indentLevel + 1);
            jsonBuilder.append("\"children\": [\n");
            List<Node> children = node.getChildren();
            for (int i = 0; i < children.size(); i++) {
                convertNodeToJson(children.get(i), jsonBuilder, indentLevel + 2);
                if (i < children.size() - 1) {
                    jsonBuilder.append(",\n");
                }
            }
            jsonBuilder.append("\n");
            addIndentation(jsonBuilder, indentLevel + 1);
            jsonBuilder.append("]\n");
        }
        addIndentation(jsonBuilder, indentLevel);
        jsonBuilder.append("}");
    }

    private static void addIndentation(StringBuilder jsonBuilder, int indentLevel)
    {
        for (int i = 0; i < indentLevel; i++)
        {
            jsonBuilder.append(" ");
        }
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
        String res = convertTreeToJson(currProject.getRootNode());
        Logger.log("Project opened " + ProjectPath);
        return Response.ok(res).build();
    }
    
    @POST @Path("/open/file")
    public Response openFile(PathRequest req) {
        if (req == null || req.path() == null)
            return logRespErr(400, "File is null");
        String FilePath = req.path();
        Logger.log("Opening file " + FilePath);
        java.nio.file.Path path = Paths.get(FilePath).toAbsolutePath();
        if (!Files.exists(path))
            return logRespErr(400, "File doesn't exist "  + FilePath);
        if (currProject != null)
        {
            Node file = ((IDENodeService)ps.getNodeService()).search(currProject.getRootNode(), path);
            if (file != null)
            {
                for (Node node : filesOpened) {
                    if (node.getPath().compareTo(path) == 0) {
                        filesOpened.remove(node);
                        break;
                    }
                }
                filesOpened.add(file);
                return logRespOk("File opened " + FilePath);
            }
        }
        for (Node node : filesOpened) {
            if (node.getPath().compareTo(path) == 0) {
                filesOpened.remove(node);
                break;
            }
        }
        filesOpened.add(new IDENode(FilePath));
        return logRespOk("File opened "  + FilePath);
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
                    return logRespErr(400, "Incorrect Path " + FilePath);
                Node file;
                try {
                    file = (ps.getNodeService()).create(parentNode, name, Node.Types.FILE);
                } catch (Exception e) {
                    return logRespErr(400, "File already exists " + FilePath);
                }
                if (file!= null)
                {
                    filesOpened.add(file);
                    return logRespOk("File created " + FilePath);
                }
                return logRespErr(400, "File cannot be created " + FilePath);
            }
        }
        Node file = new IDENode(path);
        File f = new File(path.toString());

        try {
            if (!f.createNewFile())
                return logRespErr(400, "File already exists " + FilePath);
        } catch (Exception e) {
            return logRespErr(400, "File cannot be created " + FilePath);
        }

        filesOpened.add(file);
        return logRespOk("File created " + FilePath);
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
                    return logRespErr(400, "Incorrect Path " + FolderPath);
                Node file;
                try {
                    file = (ps.getNodeService()).create(parentNode, name, Node.Types.FOLDER);
                } catch (Exception e) {
                    return logRespErr(400, "Folder already exists " + FolderPath);
                }
                if (file!= null)
                    return logRespOk("Folder created " + FolderPath);
                return logRespErr(400, "Folder cannot be created " + FolderPath);
            }
        }
        File f = new File(path.toString());
        try {
            if (!f.mkdir())
                return logRespErr(400, "Folder already exists " + FolderPath);
        } catch (Exception e) {
            return logRespErr(400, "Folder cannot be created " + FolderPath);
        }
        return logRespOk("Folder created " + FolderPath);
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
                    return logRespOk("File deleted " + FilePath);
                }
                else
                    return logRespErr(400, "File cannot be deleted " + FilePath);
            }
        }
        if (path.toFile().delete()) {
            for (Node node : filesOpened) {
                if (node.getPath().compareTo(path) == 0) {
                    filesOpened.remove(node);
                    break;
                }
            }
            return logRespOk("File deleted " + FilePath);
        }
        return logRespErr(400, "File cannot be deleted " + FilePath);
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
                    return logRespOk("Folder deleted " + FilePath);
                } else
                    return logRespErr(400, "Folder cannot be deleted " + FilePath);
            }
        }
        if (deleteDirectory(path.toFile())) {
            return logRespOk("Folder deleted " + FilePath);
        }
        return logRespErr(400, "Folder cannot be deleted " + FilePath);
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
            if (srcNode != null) {
                if (dstNode == null)
                {
                    Node parent = ((IDENodeService) ps.getNodeService()).search(currProject.getRootNode(), path1.getParent());
                    dstNode = new IDENode(path1, parent);
                }
                try {
                    ps.getNodeService().move(srcNode, dstNode);
                    return logRespOk("File moved from " + req.src() + " to " + req.dst());
                }
                catch (Exception e) {
                    return logRespErr(400, "File cannot be moved from " + req.src() + " to " + req.dst());
                }

            }/* else
                return logRespErr(400, "File is not in the project from " + req.src() + " to " + req.dst());*/
        }
        try {
            Files.move(path, path1);
        } catch (Exception e)
        {
            return logRespErr(400, "File cannot be move (not in the proj) from " + req.src() + " to " + req.dst());
        }
        return logRespOk("We haven't open the project from " + req.src() + " to " + req.dst());
    }

    @POST @Path("/update")
    public Response update(UpdateRequest req) {
        if (req == null || req.path() == null || req.content() == null || req.to() == null || req.from() == null)
            return logRespErr(400, "File null");
        String FilePath = req.path();
        String content = req.content();
        Integer from = req.from();
        Integer to = req.to();
        Logger.log("updating " + FilePath + " from " + from + " to " + to + " with " + content);
        java.nio.file.Path path = Paths.get(FilePath).toAbsolutePath();
        Node node = null;
        if (currProject != null)
            node = ((IDENodeService) ps.getNodeService()).search(currProject.getRootNode(), path);
        if (node == null)
            node = new IDENode(path);
        try {
            ps.getNodeService().update(node, from, to, content.getBytes());
            return logRespOk("File updated successfully " + FilePath + " from " + from + " to " + to + " with " + content);
        }
        catch (Exception e) {
            return logRespErr(400, "File cannot be updated " + FilePath + " from " + from + " to " + to + " with " + content);
        }
    }

    @POST @Path("/execFeature")
    public Response execFeature(FeatureRequest req) {
        if (req == null || req.feature() == null || req.params() == null || req.project() == null)
            return logRespErr(400, "File null");
        String feature = req.feature();
        List<String> params = req.params();
        String project = req.project();
        Logger.log("executing " + feature + " on " + project + ", params : " + params);
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
                    return logRespErr(400, "Bad feature " + feature + " on " + project + ", params : " + params);
                }
            }
        }
        if (currProject == null)
            return logRespErr(400, "Project not opened " + feature + " on " + project + ", params : " + params);
        Feature.ExecutionReport report = ps.execute(p, type, params);
        if (report.isSuccess()) {
            StringBuilder output = new StringBuilder();
            if (type == Mandatory.Features.Any.SEARCH)
            {
                SearchFeatureReport sr = (SearchFeatureReport) report;
                for (String str: sr.getPaths())
                    output.append(str).append("\n");
            }
            return Response.ok(new ExecFeatureResponse("Feature " + feature + " executed: " + report.isSuccess(), output.toString())).build();
        }
        return logRespErr(500, "Feature execution failed " + feature + " on " + project + ", params : " + params);
    }

    @POST @Path("/save")
    public Response save(SaveRequest req) {
        if (req == null || req.content() == null || req.path() == null)
            return logRespErr(400, "File null");
        String content = req.content();
        java.nio.file.Path path = java.nio.file.Path.of(req.path()).toAbsolutePath();
        Logger.log("saving " +  path + " with content :\n  " + content);
        Node node = null;
        if (currProject != null)
            node = ((IDENodeService) ps.getNodeService()).search(currProject.getRootNode(), path);
        if (node == null)
            node = new IDENode(path);
        try {
            ((IDENodeService)ps.getNodeService()).save(node, content);
            return logRespOk("File saved successfully " + path + " with " + content);
        }
        catch (Exception e) {
            return logRespErr(400, "File cannot be saved " + path + " with " + content);
        }
    }

    @POST @Path("/content")
    public Response content(PathRequest req) {
        if (req == null  || req.path() == null)
            return logRespErr(400, "File null");
        java.nio.file.Path path = java.nio.file.Path.of(req.path()).toAbsolutePath();
        Logger.log("reading " +  path);
        if (!Files.exists(path))
            return logRespErr(400, "File does not exist " + req.path());
        Node node = null;
        if (currProject != null)
            node = ((IDENodeService) ps.getNodeService()).search(currProject.getRootNode(), path);
        if (node == null)
            node = new IDENode(path);
        try {
            String content = ((IDENodeService)ps.getNodeService()).content(node);
            Logger.log("File read successfully " + path);
            return Response.ok(content).build();
        }
        catch (Exception e) {
            return logRespErr(400, "File cannot be read " + path);
        }
    }

    @POST @Path("/saveAs")
    public Response saveAs(SaveAsRequest req) {
        if (req == null || req.content() == null || req.path() == null || req.newPath() == null)
            return logRespErr(400, "File null");
        String content = req.content();
        java.nio.file.Path path = java.nio.file.Path.of(req.path()).toAbsolutePath();
        if (!Files.exists(path))
            return logRespErr(400, "File does not exist " + req.path());
        java.nio.file.Path new_path = java.nio.file.Path.of(req.newPath()).toAbsolutePath();
        Logger.log("saving " +  path + " with content :\n  " + content + "\nas : " + req.newPath());
        java.nio.file.Path parentPath = path.getParent();
        String name = path.getFileName().toString();
        if (currProject != null)
        {
            Node parentNode = ((IDENodeService)ps.getNodeService()).search(currProject.getRootNode(), parentPath);
            if (parentNode != null)
            {
                if (parentNode.isFile())
                    return logRespErr(400, "Incorrect Path " + new_path);
                Node file;
                try {
                    file = (ps.getNodeService()).create(parentNode, name, Node.Types.FILE);
                } catch (Exception e) {
                    return logRespErr(400, "File already exists " + new_path);
                }
                if (file!= null)
                {
                    filesOpened.add(file);
                    try {
                        ((IDENodeService)ps.getNodeService()).save(file, content);
                        return logRespOk("File saved successfully " + path + " with " + content + "\nas : " + req.newPath());
                    }
                    catch (Exception e) {
                        return logRespErr(400, "File cannot be saved " + new_path);
                    }

                }
                return logRespErr(400, "File cannot be created " + new_path);
            }
        }
        Node file = new IDENode(new_path);
        File f = new File(new_path.toString());

        try {
            if (!f.createNewFile())
                return logRespErr(400, "File already exists " + new_path);
            filesOpened.add(file);
            ((IDENodeService)ps.getNodeService()).save(file, content);
            return logRespOk("File saved successfully " + path + " with " + content + "\nas : " + req.newPath());
        } catch (Exception e) {
            return logRespErr(400, "File cannot be created " + new_path);
        }
    }

    @GET @Path("/getOpenFiles")
    public Response getOpenedFiles() {
        Logger.log("Fetching list of opened files");
        List<String> openedFilesPaths = new ArrayList<>();
        for (Node file : filesOpened) {
            openedFilesPaths.add(file.getPath().toString());
        }
        Logger.log("List of opened files : " + filesOpened.size() + " elements : "+ openedFilesPaths);
        return Response.ok(openedFilesPaths).build();
    }

    @POST @Path("/compile")
    public Response compileRubyCode(PathRequest req) {
        if (req == null  || req.path() == null)
            return logRespErr(400, "File null");
        String path = req.path();
        Logger.log("executing ruby code");
        try {
            // Exécuter la commande Ruby
            ProcessBuilder processBuilder = new ProcessBuilder("ruby", path);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            // Lire la sortie et les erreurs d'exécution
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            process.waitFor();
            int errorCount = 0;
            // Compter le nombre d'erreurs dans l'output
            if (output.toString().toLowerCase().contains("error") || output.toString().toLowerCase().contains("exception")) {
                errorCount++;
            }
            Logger.log("compile successfully");
            return Response.ok(new CompileResponse(output.toString(), errorCount, process.exitValue())).build();
        } catch (Exception e) {
            return logRespErr(400, "File cannot be compile");
        }
    }

    @POST @Path("/execute-command")
    public Response executeCommand(CommandRequest req)
    {
        if (req == null || req.command() == null)
            return logRespErr(400, "Command is null");
        String command = req.command();
        Logger.log("Executing command: " + command);

        StringBuilder output = new StringBuilder();
        try {
            Process process = Runtime.getRuntime().exec(command);
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            while ((line = errorReader.readLine()) != null) {
                output.append(line).append("\n");
            }

            process.waitFor();
        } catch (Exception e) {
            return logRespErr(500, "Command execution failed: " + e.getMessage());
        }

        Logger.log("Command output: " + output.toString());
        return Response.ok(new CommandResponse(output.toString())).build();
    }

    @GET @Path("/getAspects")
    public Response getAspects()
    {
        if (currProject != null) {
            Set<Aspect> aspects = currProject.getAspects();
            ArrayList<String> aspectsStr = new ArrayList<>();
            for (Aspect a : aspects) {
                Logger.log(a.toString());
                aspectsStr.add(a.getType().toString());
            }
            return Response.ok(new AspectsResponse(aspectsStr.toString())).build();
        }
        return Response.ok(new AspectsResponse("")).build();
    }

    @POST @Path("/isfolder")
    public Response isfolder(PathRequest req)
    {
        if (req == null || req.path() == null)
            return logRespErr(400, "Path is null");
        /*if (Files.exists(Paths.get(req.path())))
            return logRespErr(400, "Does not exists");*/
        if (Files.isDirectory(Paths.get(req.path())))
            return Response.ok(new IsFolderResponse(true)).build();
        return Response.ok(new IsFolderResponse(false)).build();
    }
}
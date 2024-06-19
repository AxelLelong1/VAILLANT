package fr.epita.assistants.myide.domain.entity.Features.MAVEN;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Features.FeaturesHolder;
import fr.epita.assistants.myide.domain.entity.Project;

import java.io.IOException;
import java.util.List;

public class MavenFeatures extends FeaturesHolder {

    public Feature.ExecutionReport exec_cmd(Project project, List<String> command)
    {
        ProcessBuilder pb = new ProcessBuilder(command);

        pb.directory(project.getRootNode().getPath().toFile());
        pb.redirectErrorStream(true);

        Process process = null;
        int exitcode = -1;

        try {
            process = pb.start();
            exitcode = process.waitFor();
        } catch (IOException | InterruptedException e) {
            return FalseReport();
        }
        return exitcode == 0 ? TrueReport() : FalseReport();
    }

}

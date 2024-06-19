package fr.epita.assistants.myide.domain.entity.Features.MAVEN;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;

import java.util.List;

public class MavenEXEC extends  MavenFeatures implements Feature {


    @Override
    public ExecutionReport execute(Project project, Object... params) {
        List<String> command = List.of("mvn", "exec");
        return exec_cmd(project, command);
    }

    @Override
    public Type type() {
        return Mandatory.Features.Maven.EXEC;
    }
}

package fr.epita.assistants.myide.domain.service;

import fr.epita.assistants.MyIde;
import fr.epita.assistants.myide.domain.entity.IDEProject;
import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Project;

import java.nio.file.Path;

public class IDEProjectService implements ProjectService {

    private final NodeService nodeService;
    private final MyIde.Configuration configuration;

    public IDEProjectService(MyIde.Configuration configuration) {
        this.nodeService = new IDENodeService();
        this.configuration = configuration;
    }

    @Override
    public Project load(Path root) {
        return new IDEProject(root);
    }

    @Override
    public Feature.ExecutionReport execute(Project project, Feature.Type featureType, Object... params) {
        return ((IDEProject)project).manager.executeFeature(project, featureType, params);
    }

    @Override
    public NodeService getNodeService() {
        return nodeService;
    }

    public MyIde.Configuration getConfiguration() { return configuration; }

}

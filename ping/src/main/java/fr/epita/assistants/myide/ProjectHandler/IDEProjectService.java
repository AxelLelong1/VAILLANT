package fr.epita.assistants.myide.ProjectHandler;

import fr.epita.assistants.myide.NodeHandler.IDENodeService;
import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.service.NodeService;
import fr.epita.assistants.myide.domain.service.ProjectService;
import fr.epita.assistants.myide.utils.Logger;

import java.nio.file.Path;

public class IDEProjectService implements ProjectService {

    private final NodeService nodeService;

    public IDEProjectService() {
        this.nodeService = new IDENodeService();
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
}

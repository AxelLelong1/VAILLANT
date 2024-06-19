package fr.epita.assistants.myide.domain.entity.Features.ANY;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.service.NodeService;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class AnyCLEANUP extends AnyFeatures implements Feature {
    /**
     * Remove all nodes of trash files.
     * Trash files are listed, line by line,
     * in a ".myideignore" file at the root of the project.
     */

    @Override
    public Feature.ExecutionReport execute(Project project, Object... params) {
        BufferedReader reader;
        NodeService service = (NodeService) params[0];

        try {
            reader = new BufferedReader(new FileReader(project.getRootNode().getPath().toString() + ".myideignore"));
            String line = reader.readLine();

            while (line != null) {
                ArrayList<Node> nodes = searchNode(project.getRootNode(), line);
                if (!nodes.isEmpty())
                {
                    for (Node n : nodes)
                        service.delete(n);
                }
                line = reader.readLine();
            }
            reader.close();
        } catch (IOException e) {
            return FalseReport();
        }
        return TrueReport();
    }

    @Override
    public Feature.Type type() {
        return Mandatory.Features.Any.CLEANUP;
    }
}

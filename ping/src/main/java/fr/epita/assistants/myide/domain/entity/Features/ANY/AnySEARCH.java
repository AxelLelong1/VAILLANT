package fr.epita.assistants.myide.domain.entity.Features.ANY;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Features.FeaturesHolder;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.entity.report.SearchFeatureReport;
import fr.epita.assistants.myide.domain.service.NodeService;

import java.io.*;
import java.util.ArrayList;
import java.util.Scanner;

public class AnySEARCH extends AnyFeatures implements Feature {
    /**
     * Fulltext search over project files.
     */

    private ArrayList<Node> _execute(Node parent, String text)
    {

        ArrayList<Node> nodes = new ArrayList<Node>();
        for(Node n : parent.getChildren())
        {
            if (n.isFolder())
                nodes.addAll(_execute(n, text));
            else
            {
                final Scanner scanner;
                try {
                    scanner = new Scanner(n.getPath().toFile());
                } catch (FileNotFoundException e) {
                    continue;
                }
                while (scanner.hasNextLine()) {
                    final String line = scanner.nextLine();
                    if(line.contains(text)) {
                        nodes.add(n);
                    }
                }
            }
        }
        return nodes;
    }
    @Override
    public Feature.ExecutionReport execute(Project project, Object... params) {
        String text = (String) params[0];
        ArrayList<Node> nodes = _execute(project.getRootNode(), text);
        return new SearchFeatureReport(nodes, !nodes.isEmpty());
    }

    @Override
    public Feature.Type type() {
        return Mandatory.Features.Any.SEARCH;
    }
}

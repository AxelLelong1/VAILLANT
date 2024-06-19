package fr.epita.assistants.myide.domain.entity.Features.ANY;

import fr.epita.assistants.myide.domain.entity.Features.FeaturesHolder;
import fr.epita.assistants.myide.domain.entity.Node;

import java.util.ArrayList;

public class AnyFeatures extends FeaturesHolder {
    protected static ArrayList<Node> searchNode(Node parent, String target)
    {
        ArrayList<Node> nodes = new ArrayList<Node>();
        for(Node n : parent.getChildren())
        {
            if (n.getPath().getFileName().toString().compareTo(target) == 0)
                nodes.add(n);
            if (n.isFolder())
                nodes.addAll(searchNode(n, target));
        }
        return nodes;
    }
}

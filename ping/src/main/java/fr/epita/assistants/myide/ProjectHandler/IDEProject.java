package fr.epita.assistants.myide.ProjectHandler;

import fr.epita.assistants.myide.NodeHandler.IDENode;
import fr.epita.assistants.myide.domain.IDEentity.IDEAspect;
import fr.epita.assistants.myide.domain.entity.*;
import fr.epita.assistants.myide.domain.entity.Features.FeatureImpl;
import fr.epita.assistants.myide.domain.entity.Features.GIT.GitADD;
import fr.epita.assistants.myide.domain.entity.Features.GIT.GitCOMMIT;
import fr.epita.assistants.myide.domain.entity.Features.GIT.GitPULL;
import fr.epita.assistants.myide.domain.entity.Features.GIT.GitPUSH;
import fr.epita.assistants.myide.utils.Logger;

import java.nio.file.Path;
import java.util.*;

public class IDEProject implements Project {
    Set<Aspect> aspects;
    Node root;
    public FeatureImpl manager;


    public IDEProject(Path rootNode)
    {
        this.aspects = new HashSet<Aspect>();
        this.root = new IDENode(rootNode);
        boolean g = false;
        boolean m = false;

        this.aspects.add(new IDEAspect(Mandatory.Aspects.ANY));
        if(Path.of(this.root.getPath().toString() + "/pom.xml").toFile().exists()) {
            this.aspects.add(new IDEAspect(Mandatory.Aspects.MAVEN));
            m = true;
        }
        if(Path.of(this.root.getPath().toString() + "/.git").toFile().exists()) {
            this.aspects.add(new IDEAspect(Mandatory.Aspects.GIT));
            g = true;
        }

        manager = new FeatureImpl(g,m,true);
    }

    @Override
    public Node getRootNode() {
        return this.root;
    }

    @Override
    public Set<Aspect> getAspects() {
        return this.aspects;
    }

    @Override
    public Optional<Feature> getFeature(Feature.Type featureType) {
        return aspects.stream()
                .map(Aspect::getFeatureList)
                .flatMap(List::stream)
                .filter(f -> f.type().equals(featureType))
                .findFirst();
    }
}

package fr.epita.assistants.myide.domain.entity.Features;
import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Features.ANY.AnyCLEANUP;
import fr.epita.assistants.myide.domain.entity.Features.ANY.AnyDIST;
import fr.epita.assistants.myide.domain.entity.Features.ANY.AnySEARCH;
import fr.epita.assistants.myide.domain.entity.Mandatory;

import fr.epita.assistants.myide.domain.entity.Features.GIT.*;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.utils.Logger;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class FeatureImpl {
    private final Map<Feature.Type, Feature> featureMap = new HashMap<>();

    public FeatureImpl(boolean git, boolean maven, boolean any) {
        if (any) {
            featureMap.put(Mandatory.Features.Any.DIST, new AnyDIST());
            featureMap.put(Mandatory.Features.Any.CLEANUP, new AnyCLEANUP());
            featureMap.put(Mandatory.Features.Any.SEARCH, new AnySEARCH());
        }

        if (git) {
            featureMap.put(Mandatory.Features.Git.ADD, new GitADD());
            featureMap.put(Mandatory.Features.Git.COMMIT, new GitCOMMIT());
            featureMap.put(Mandatory.Features.Git.PULL, new GitPULL());
            featureMap.put(Mandatory.Features.Git.PUSH, new GitPUSH());
        }

        if (maven) {
            featureMap.put(Mandatory.Features.Maven.CLEAN, null);
            featureMap.put(Mandatory.Features.Maven.COMPILE, null);
            featureMap.put(Mandatory.Features.Maven.EXEC, null);
            featureMap.put(Mandatory.Features.Maven.INSTALL, null);
            featureMap.put(Mandatory.Features.Maven.TEST, null);
            featureMap.put(Mandatory.Features.Maven.PACKAGE, null);
            featureMap.put(Mandatory.Features.Maven.TREE, null);
            ;
        }
    }

    public Feature.ExecutionReport executeFeature(Project project, Feature.Type featureType,Object... params) {
        @NotNull Optional<Feature> feature = project.getFeature(featureType);
        if (feature.isEmpty()) {
            Logger.logError("Feature not implemented: " + featureType);
            return null;
        }
        return feature.get().execute(project, params);
    }
}

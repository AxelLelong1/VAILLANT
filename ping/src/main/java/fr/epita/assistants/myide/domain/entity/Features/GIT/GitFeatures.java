package fr.epita.assistants.myide.domain.entity.Features.GIT;

import fr.epita.assistants.myide.domain.entity.Features.FeaturesHolder;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.utils.Logger;
import org.eclipse.jgit.api.*;
import java.io.File;
import java.io.IOException;

public class GitFeatures extends FeaturesHolder {

    protected static Git findRepo(Project project) {
        Git git = null;
        try {
            git = Git.open(new File(project.getRootNode().getPath().toString() + "/.git"));
        } catch (IOException e) {
            Logger.logError("Git: Could not find .git directory");
            throw new RuntimeException(e); //should not happen
        }
        return git;
    }
}

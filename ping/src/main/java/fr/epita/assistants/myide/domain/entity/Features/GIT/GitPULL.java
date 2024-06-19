package fr.epita.assistants.myide.domain.entity.Features.GIT;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.utils.Logger;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.ApplicationPath;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.PullCommand;
import org.eclipse.jgit.api.errors.GitAPIException;


public class GitPULL extends GitFeatures implements Feature {
    @Override
    public ExecutionReport execute(Project project, Object... params) {
        Git git = findRepo(project);
        PullCommand pull = git.pull();
        try {
            pull.call();
        } catch (GitAPIException e) {
            Logger.logError("Git: Could not pull");
            return FalseReport();
        }
        Logger.log("Git: Succesfully pulled");
        return TrueReport();
    }

    @Override
    public Type type() {
        return Mandatory.Features.Git.PULL;
    }
}

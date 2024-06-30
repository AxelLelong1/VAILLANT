package fr.epita.assistants.myide.domain.entity.Features.GIT;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.utils.Logger;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.PushCommand;
import org.eclipse.jgit.api.Status;
import org.eclipse.jgit.api.StatusCommand;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;

public class GitPUSH extends GitFeatures implements Feature {
    @Override
    public ExecutionReport execute(Project project, Object... params) {
        Git git = findRepo(project);
        PushCommand push = git.push();
        /*try {
            Status status = git.status().call();
            if (status.getAdded().isEmpty() &&
                    !status.hasUncommittedChanges() &&
                    status.getUntracked().isEmpty() &&
                    status.getChanged().isEmpty() &&
                    status.getModified().isEmpty() &&
                    status.getRemoved().isEmpty())
            {
                Logger.logError("Git: Cannot push because already up to date");
                return FalseReport();
            }
        } catch (GitAPIException e) {
            Logger.logError("Git: could not get status");
            return FalseReport();
        }*/
        try {
            push.call();
        } catch (GitAPIException e) {
            Logger.logError("Git: Could not push");
            return FalseReport();
        }
        Logger.log("Git: Succesfully pushed");
        return TrueReport();
    }

    @Override
    public Type type() {
        return Mandatory.Features.Git.PUSH;
    }
}

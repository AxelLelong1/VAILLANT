package fr.epita.assistants.myide.domain.entity.Features.GIT;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.utils.Logger;
import org.eclipse.jgit.api.CommitCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;

public class GitCOMMIT extends GitFeatures implements Feature {
    @Override
    public ExecutionReport execute(Project project, Object... params) {
        Git git = findRepo(project);
        CommitCommand commit = git.commit();
        commit.setMessage(params[0].toString());
        try {
            commit.call();
        } catch (GitAPIException e) {
            Logger.logError("Git: Could not commit");
            return FalseReport();
        }
        Logger.log("Git: Succesfully commited");
        return TrueReport();
    }

    @Override
    public Type type() {
        return Mandatory.Features.Git.COMMIT;
    }
}

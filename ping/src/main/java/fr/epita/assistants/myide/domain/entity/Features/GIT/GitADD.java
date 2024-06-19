package fr.epita.assistants.myide.domain.entity.Features.GIT;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.utils.Logger;
import org.eclipse.jgit.api.AddCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;

public class GitADD extends GitFeatures implements Feature {
    @Override
    public ExecutionReport execute(Project project, Object... params) {
        Git git = findRepo(project);
        AddCommand add = git.add();
        add.addFilepattern(params[0].toString());
        try {
            add.call();
        } catch (GitAPIException e) {
            Logger.logError("Git: Could not add");
            return FalseReport();
        }
        Logger.log("Git: Succesfully added");
        return TrueReport();
    }

    @Override
    public Type type() {
        return Mandatory.Features.Git.ADD;
    }
}

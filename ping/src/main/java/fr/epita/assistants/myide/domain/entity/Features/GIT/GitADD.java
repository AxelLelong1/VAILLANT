package fr.epita.assistants.myide.domain.entity.Features.GIT;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.utils.Logger;
import org.eclipse.jgit.api.AddCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.Status;
import org.eclipse.jgit.api.errors.GitAPIException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GitADD extends GitFeatures implements Feature {
    @Override
    public ExecutionReport execute(Project project, Object... params) {
        Git git = findRepo(project);
        AddCommand add = git.add();
        try {
            for (Object param : params) // To verify
                add.addFilepattern(param.toString());

            add.call();

            Status status = git.status().call();
            Object[] added = status.getAdded().toArray();
            for (Object param : params)
            {
                Pattern pattern = Pattern.compile(param.toString());
                int i = 0;
                while (i < added.length) {
                    Matcher matcher = pattern.matcher(added[i].toString());
                    if (matcher.find())
                        break;
                    i++;
                }
                if (i == added.length) {
                    Logger.logError("Git: File not added: " + param.toString());
                    return FalseReport();
                }
            }
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

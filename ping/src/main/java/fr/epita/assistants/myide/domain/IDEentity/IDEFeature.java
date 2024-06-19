package fr.epita.assistants.myide.domain.IDEentity;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Project;

public class IDEFeature implements Feature {
    @Override
    public ExecutionReport execute(Project project, Object... params) {
        return null;
    }

    @Override
    public Type type() {
        return null;
    }
}

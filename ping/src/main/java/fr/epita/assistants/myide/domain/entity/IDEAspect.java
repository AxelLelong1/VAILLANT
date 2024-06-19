package fr.epita.assistants.myide.domain.entity;

import fr.epita.assistants.myide.domain.entity.Aspect;
import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Features.ANY.AnyCLEANUP;
import fr.epita.assistants.myide.domain.entity.Features.ANY.AnyDIST;
import fr.epita.assistants.myide.domain.entity.Features.ANY.AnySEARCH;
import fr.epita.assistants.myide.domain.entity.Features.GIT.GitADD;
import fr.epita.assistants.myide.domain.entity.Features.GIT.GitCOMMIT;
import fr.epita.assistants.myide.domain.entity.Features.GIT.GitPULL;
import fr.epita.assistants.myide.domain.entity.Features.GIT.GitPUSH;
import fr.epita.assistants.myide.domain.entity.Mandatory;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class IDEAspect implements Aspect {
    private Type type;

    public IDEAspect(Type type)
    {
        this.type = type;
    }
    @Override
    public Type getType() {
        return this.type;
    }

    @Override
    public @NotNull List<Feature> getFeatureList() {
        if(type == Mandatory.Aspects.GIT)
        {
            List<Feature> f = new ArrayList<>();
            f.add(new GitADD());
            f.add(new GitPULL());
            f.add(new GitPUSH());
            f.add(new GitCOMMIT());
            return f;
        }
        if(type == Mandatory.Aspects.ANY)
        {
            List<Feature> f = new ArrayList<>();
            f.add(new AnySEARCH());
            f.add(new AnyDIST());
            f.add(new AnyCLEANUP());
            return f;
        }

        return Collections.emptyList();
    }
}

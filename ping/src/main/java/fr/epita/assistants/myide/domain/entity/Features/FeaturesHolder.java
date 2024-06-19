package fr.epita.assistants.myide.domain.entity.Features;

import fr.epita.assistants.myide.domain.entity.Feature;

public class FeaturesHolder {
    protected static Feature.ExecutionReport TrueReport()
    {
        return () -> true;
    }

    protected static Feature.ExecutionReport FalseReport()
    {
        return () -> false;
    }
}

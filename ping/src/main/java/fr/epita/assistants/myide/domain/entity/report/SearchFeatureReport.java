package fr.epita.assistants.myide.domain.entity.report;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Node;

import javax.naming.directory.SearchResult;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * @param searchResult All file node where the query have been found.
 * @param isSuccess  Is the report successful.
 */
public record SearchFeatureReport(@NotNull List<Node> searchResult, @NotNull List<String> pathsResult,  boolean isSuccess) implements Feature.ExecutionReport {
    public List<Node> getResults() {
        return searchResult;
    }
    public List<String> getPaths() {
        return pathsResult;
    }
}
package fr.epita.assistants.myide.presentation.rest;

import java.util.List;


public record FeatureRequest(String feature, List<String> params, String project) {
}

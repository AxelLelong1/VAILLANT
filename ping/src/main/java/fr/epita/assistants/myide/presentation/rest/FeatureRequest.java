package fr.epita.assistants.myide.presentation.rest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;


public record FeatureRequest(String feature, List<String> params, String project) {
}

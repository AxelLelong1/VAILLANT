package fr.epita.assistants.myide.presentation.rest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

public record UpdateRequest(String path, Integer from, Integer to, String content) {
}

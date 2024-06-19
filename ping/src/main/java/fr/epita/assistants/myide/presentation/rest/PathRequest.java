package fr.epita.assistants.myide.presentation.rest;

import jakarta.json.bind.annotation.JsonbProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

public record PathRequest(String path) {
}

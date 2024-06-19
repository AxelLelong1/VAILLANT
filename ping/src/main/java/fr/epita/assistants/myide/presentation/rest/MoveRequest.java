package fr.epita.assistants.myide.presentation.rest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

public record MoveRequest(String src, String dst) {
}

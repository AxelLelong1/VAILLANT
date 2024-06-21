package fr.epita.assistants.myide.presentation.rest;

public record SaveAsRequest(String path, String content, String newPath) {
}

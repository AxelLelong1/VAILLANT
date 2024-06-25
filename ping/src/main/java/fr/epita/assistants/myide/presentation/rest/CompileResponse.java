package fr.epita.assistants.myide.presentation.rest;

public record CompileResponse(String output, int nb_errors, int exitValue) {
}

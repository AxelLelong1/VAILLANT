package fr.epita.assistants.myide.presentation.rest;

public record UpdateRequest(String path, Integer from, Integer to, String content) {
}

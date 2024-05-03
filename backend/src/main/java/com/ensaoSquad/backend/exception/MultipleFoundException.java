package com.ensaoSquad.backend.exception;

public class MultipleFoundException extends RuntimeException {
    public MultipleFoundException(String message) {
        super(message);
    }
}

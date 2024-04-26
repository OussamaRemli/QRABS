package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.exception.RessourceNotFoundException;
import com.ensaoSquad.backend.exception.UploadExcelException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UploadExcelException.class)
    public ResponseEntity<Object> handleStudentUploadException(UploadExcelException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RessourceNotFoundException.class)
    public ResponseEntity<Object> handleRessourceNotFoundException(RessourceNotFoundException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
}


package com.ensaoSquad.backend.exception;


public class UploadExcelException extends RuntimeException {
    public UploadExcelException(String message) {
        super(message);
    }

    public UploadExcelException(String message, Throwable cause) {
        super(message, cause);
    }
}



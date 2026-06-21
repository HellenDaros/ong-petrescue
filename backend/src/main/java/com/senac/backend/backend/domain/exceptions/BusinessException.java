package com.senac.backend.backend.domain.exceptions;

public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}

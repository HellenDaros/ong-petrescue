package com.senac.backend.backend.infra.exception;

import com.senac.backend.backend.domain.exceptions.BusinessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<String> handleBusinessException(
            BusinessException ex) {

        return ResponseEntity.badRequest()
                .body(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(
            IllegalArgumentException ex) {

        return ResponseEntity.badRequest()
                .body(ex.getMessage());
    }
}

package com.senac.backend.backend.infra.exception;

import com.senac.backend.backend.domain.exceptions.BusinessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
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

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException ex) {

        return ResponseEntity.badRequest()
                .body("Requisição inválida. Verifique os valores enviados.");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex) {

        return ResponseEntity.badRequest()
                .body("Dados inválidos. Verifique o tamanho e o conteúdo dos campos enviados.");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(
            IllegalArgumentException ex) {

        return ResponseEntity.badRequest()
                .body(ex.getMessage());
    }
}

package com.senac.backend.backend.domain.valueobjects;

public class CNPJ {
    private String cnpj;

    public CNPJ() {
        this.cnpj = "";
    }

    public CNPJ(String cnpj) {
        if (cnpj == null || !isValid(cnpj)) {
            throw new IllegalArgumentException("CNPJ Inválido!");
        }
        this.cnpj = cnpj;
    }

    private boolean isValid(String cnpj) {

        String cnpjTratado = cnpj.replaceAll("[^0-9]", "");

        if (cnpjTratado.length() != 14 || cnpjTratado.matches("(\\d)\\1{13}")) {
            return false;
        }

        return validarDigitosVerificadores(cnpjTratado);
    }

    private boolean validarDigitosVerificadores(String cnpj) {

        int[] pesosPrimeiroDigito = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] pesosSegundoDigito = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

        int soma = 0;

        // Primeiro dígito verificador
        for (int i = 0; i < 12; i++) {
            soma += Character.getNumericValue(cnpj.charAt(i)) * pesosPrimeiroDigito[i];
        }

        int resto = soma % 11;
        int primeiroDigito = (resto < 2) ? 0 : 11 - resto;

        if (primeiroDigito != Character.getNumericValue(cnpj.charAt(12))) {
            return false;
        }

        soma = 0;

        // Segundo dígito verificador
        for (int i = 0; i < 13; i++) {
            soma += Character.getNumericValue(cnpj.charAt(i)) * pesosSegundoDigito[i];
        }

        resto = soma % 11;
        int segundoDigito = (resto < 2) ? 0 : 11 - resto;

        return segundoDigito == Character.getNumericValue(cnpj.charAt(13));
    }

    private String getNumeros() {
        return this.cnpj.replaceAll("[^0-9]", "");
    }

    @Override
    public String toString() {
        return cnpj.replaceAll("\\D", "")
                .replaceAll("(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})",
                        "$1.$2.$3/$4-$5");
    }
}

package com.senac.backend.backend.domain.valueobjects;

import com.senac.backend.backend.domain.exceptions.BusinessException;

public class Celular {

    private String celular;

    public Celular(){
        this.celular="";
    }

    public Celular(String celular){
        if(celular == null || !isValid(celular)) {
            throw new BusinessException("Celular inválido.");
        }
        this.celular = celular;
    }

    private boolean isValid(String celular){

        String celularTratado = celular.replaceAll("[^0-9]","");

        if(celularTratado.length() != 11 || celularTratado.matches("(\\d)\\1{10}")){
            return false;
        }

        int ddd = Integer.parseInt(celularTratado.substring(0, 2));
        if (ddd < 11 || ddd > 99) {
            return false;
        }

        return celularTratado.charAt(2) == '9';
    }

    private String getNumeros(){
        return this.celular.replaceAll("[^0-9]","");
    }

    @Override
    public String toString()
    {
        return celular.replaceAll("\\D", "")
                .replaceAll("(\\d{2})(\\d{5})(\\d{4})", "($1) $2-$3");
    }
}

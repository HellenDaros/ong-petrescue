package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.enuns.EnumConfirmacao;
import com.senac.backend.backend.domain.enuns.EnumEspecieAnimal;
import com.senac.backend.backend.domain.enuns.EnumPorte;
import com.senac.backend.backend.domain.enuns.EnumSexo;

public record AnimalRequest(

        String nameAnimal,

        String raca,

        EnumSexo sexo,

        String idade,

        String urlFoto,

        EnumPorte porte,

        String corPelagem,

        EnumConfirmacao castrado,

        EnumConfirmacao vermifugado,

        EnumConfirmacao vacinado,

        String vacinadoDescricao,

        EnumEspecieAnimal especie,

        String nameDoador

) {
}

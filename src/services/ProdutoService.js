const ProdutoRepository = require("../repositories/ProdutoRepository");

class ProdutoService {
    prepararSabor(sabor) {
        return {
            nome: sabor.nome?.trim() || "",
            categoria: sabor.categoria?.trim() || "Tradicional",
            descricao: sabor.descricao?.trim() || "",
            imagem: sabor.imagem?.trim() || "",
            preco_pix: sabor.preco_pix !== undefined && sabor.preco_pix !== ""
                ? Number(sabor.preco_pix)
                : null,
            ativo: Number(sabor.ativo),
        };
    }

    validarSabor(sabor) {
        if (!sabor.nome || sabor.nome.trim() === "") {
            return { valido: false, mensagem: "Informe o nome do sabor." };
        }

        return { valido: true };
    }

    async listarSabores() {
        return await ProdutoRepository.listarSabores();
    }

    async salvarSabor(sabor) {
        const validacao = this.validarSabor(sabor);

        if (!validacao.valido) {
            return { sucesso: false, mensagem: validacao.mensagem };
        }

        const saborSalvo = await ProdutoRepository.salvarSabor(this.prepararSabor(sabor));

        return {
            sucesso: true,
            mensagem: "Sabor cadastrado com sucesso.",
            sabor: saborSalvo,
        };
    }

    async atualizarSabor(sabor) {
        const saborAtualizado = await ProdutoRepository.atualizarSabor({
            id: Number(sabor.id),
            ...this.prepararSabor(sabor),
        });

        return {
            sucesso: true,
            mensagem: "Sabor atualizado com sucesso.",
            sabor: saborAtualizado,
        };
    }

    async inativarSabor(id) {
        await ProdutoRepository.inativarSabor(Number(id));

        return {
            sucesso: true,
            mensagem: "Sabor inativado com sucesso.",
        };
    }

    async excluirSabor(id) {
        const usos = await ProdutoRepository.contarUsosSabor(Number(id));

        if (usos > 0) {
            return {
                sucesso: false,
                mensagem: "Este sabor já está em uso (em preços ou pedidos) e não pode ser excluído. Use Inativar.",
            };
        }

        await ProdutoRepository.excluirSabor(Number(id));

        return {
            sucesso: true,
            mensagem: "Sabor excluído com sucesso.",
        };
    }

    prepararCombo(combo) {
        return {
            nome: combo.nome?.trim() || "",
            descricao: combo.descricao?.trim() || "",
            preco_pix_dinheiro: Number(combo.preco_pix_dinheiro) || 0,
            imagem: combo.imagem?.trim() || "",
            ativo: Number(combo.ativo),
        };
    }

    validarCombo(combo) {
        if (!combo.nome || combo.nome.trim() === "") {
            return {
                valido: false,
                mensagem: "Informe o nome do combo.",
            };
        }

        if (!combo.preco_pix_dinheiro || Number(combo.preco_pix_dinheiro) <= 0) {
            return {
                valido: false,
                mensagem: "Informe o preço do combo.",
            };
        }

        return { valido: true };
    }

    async listarCombos() {
        return await ProdutoRepository.listarCombos();
    }

    async salvarCombo(combo) {
        const validacao = this.validarCombo(combo);

        if (!validacao.valido) {
            return {
                sucesso: false,
                mensagem: validacao.mensagem,
            };
        }

        const comboSalvo = await ProdutoRepository.salvarCombo(
            this.prepararCombo(combo)
        );

        return {
            sucesso: true,
            mensagem: "Combo cadastrado com sucesso.",
            combo: comboSalvo,
        };
    }

    async atualizarCombo(combo) {
        const comboAtualizado = await ProdutoRepository.atualizarCombo({
            id: Number(combo.id),
            ...this.prepararCombo(combo),
        });

        return {
            sucesso: true,
            mensagem: "Combo atualizado com sucesso.",
            combo: comboAtualizado,
        };
    }

    async inativarCombo(id) {
        await ProdutoRepository.inativarCombo(Number(id));

        return {
            sucesso: true,
            mensagem: "Combo inativado com sucesso.",
        };
    }

    async excluirCombo(id) {
        const usos = await ProdutoRepository.contarUsosCombo(Number(id));

        if (usos > 0) {
            return {
                sucesso: false,
                mensagem: "Este combo já foi usado em pedidos e não pode ser excluído. Use Inativar.",
            };
        }

        await ProdutoRepository.excluirCombo(Number(id));

        return {
            sucesso: true,
            mensagem: "Combo excluído com sucesso.",
        };
    }

    prepararTamanho(tamanho) {
        return {
            nome: tamanho.nome?.trim() || "",
            fatias: Number(tamanho.fatias) || 0,
            ativo: Number(tamanho.ativo),
        };
    }

    validarTamanho(tamanho) {
        if (!tamanho.nome || tamanho.nome.trim() === "") {
            return { valido: false, mensagem: "Informe o nome do tamanho." };
        }

        return { valido: true };
    }

    async listarTamanhos() {
        return await ProdutoRepository.listarTamanhos();
    }

    async salvarTamanho(tamanho) {
        const validacao = this.validarTamanho(tamanho);

        if (!validacao.valido) {
            return { sucesso: false, mensagem: validacao.mensagem };
        }

        const tamanhoSalvo = await ProdutoRepository.salvarTamanho(this.prepararTamanho(tamanho));

        return {
            sucesso: true,
            mensagem: "Tamanho cadastrado com sucesso.",
            tamanho: tamanhoSalvo,
        };
    }

    async atualizarTamanho(tamanho) {
        const tamanhoAtualizado = await ProdutoRepository.atualizarTamanho({
            id: Number(tamanho.id),
            ...this.prepararTamanho(tamanho),
        });

        return {
            sucesso: true,
            mensagem: "Tamanho atualizado com sucesso.",
            tamanho: tamanhoAtualizado,
        };
    }

    async inativarTamanho(id) {
        await ProdutoRepository.inativarTamanho(Number(id));

        return {
            sucesso: true,
            mensagem: "Tamanho inativado com sucesso.",
        };
    }

    async excluirTamanho(id) {
        const usos = await ProdutoRepository.contarUsosTamanho(Number(id));

        if (usos > 0) {
            return {
                sucesso: false,
                mensagem: "Este tamanho já está em uso (em preços ou pedidos) e não pode ser excluído. Use Inativar.",
            };
        }

        await ProdutoRepository.excluirTamanho(Number(id));

        return {
            sucesso: true,
            mensagem: "Tamanho excluído com sucesso.",
        };
    }

    prepararBebida(bebida) {
        return {
            nome: bebida.nome?.trim() || "",
            categoria: bebida.categoria?.trim() || "Refrigerante",
            volume: bebida.volume?.trim() || "",
            preco: Number(bebida.preco) || 0, // ← linha nova (corrige o NOT NULL)
            imagem: bebida.imagem?.trim() || "",
            ativo: Number(bebida.ativo),
        };
    }

    validarBebida(bebida) {
        if (!bebida.nome || bebida.nome.trim() === "") {
            return { valido: false, mensagem: "Informe o nome da bebida." };
        }

        return { valido: true };
    }

    async listarBebidas() {
        return await ProdutoRepository.listarBebidas();
    }

    async salvarBebida(bebida) {
        const validacao = this.validarBebida(bebida);

        if (!validacao.valido) {
            return { sucesso: false, mensagem: validacao.mensagem };
        }

        const bebidaSalva = await ProdutoRepository.salvarBebida(this.prepararBebida(bebida));

        return {
            sucesso: true,
            mensagem: "Bebida cadastrada com sucesso.",
            bebida: bebidaSalva,
        };
    }

    async atualizarBebida(bebida) {
        const bebidaAtualizada = await ProdutoRepository.atualizarBebida({
            id: Number(bebida.id),
            ...this.prepararBebida(bebida),
        });

        return {
            sucesso: true,
            mensagem: "Bebida atualizada com sucesso.",
            bebida: bebidaAtualizada,
        };
    }

    async inativarBebida(id) {
        await ProdutoRepository.inativarBebida(Number(id));

        return {
            sucesso: true,
            mensagem: "Bebida inativada com sucesso.",
        };
    }

    async excluirBebida(id) {
        const usos = await ProdutoRepository.contarUsosBebida(Number(id));

        if (usos > 0) {
            return {
                sucesso: false,
                mensagem: "Esta bebida já foi usada em pedidos e não pode ser excluída. Use Inativar.",
            };
        }

        await ProdutoRepository.excluirBebida(Number(id));

        return {
            sucesso: true,
            mensagem: "Bebida excluída com sucesso.",
        };
    }

    prepararAdicional(adicional) {
        return {
            nome: adicional.nome?.trim() || "",
            preco: Number(adicional.preco) || 0,
            ativo: Number(adicional.ativo),
        };
    }

    validarAdicional(adicional) {
        if (!adicional.nome || adicional.nome.trim() === "") {
            return {
                sucesso: false,
                mensagem: "Informe o nome do adicional.",
            };
        }

        return {
            sucesso: true,
        };
    }

    async listarAdicionais() {
        return await ProdutoRepository.listarAdicionais();
    }

    async salvarAdicional(adicional) {
        const validacao = this.validarAdicional(adicional);

        if (!validacao.sucesso) {
            return validacao;
        }

        const adicionalSalvo = await ProdutoRepository.salvarAdicional(
            this.prepararAdicional(adicional)
        );

        return {
            sucesso: true,
            mensagem: "Adicional cadastrado com sucesso.",
            adicional: adicionalSalvo,
        };
    }

    async atualizarAdicional(adicional) {
        const adicionalAtualizado = await ProdutoRepository.atualizarAdicional({
            id: Number(adicional.id),
            ...this.prepararAdicional(adicional),
        });

        return {
            sucesso: true,
            mensagem: "Adicional atualizado com sucesso.",
            adicional: adicionalAtualizado,
        };
    }

    async inativarAdicional(id) {
        await ProdutoRepository.inativarAdicional(Number(id));

        return {
            sucesso: true,
            mensagem: "Adicional inativado com sucesso.",
        };
    }

    async excluirAdicional(id) {
        const usos = await ProdutoRepository.contarUsosAdicional(Number(id));

        if (usos > 0) {
            return {
                sucesso: false,
                mensagem: "Este adicional já foi usado em pedidos e não pode ser excluído. Use Inativar.",
            };
        }

        await ProdutoRepository.excluirAdicional(Number(id));

        return {
            sucesso: true,
            mensagem: "Adicional excluído com sucesso.",
        };
    }

    async listarPrecosCategoria() {
        return await ProdutoRepository.listarPrecosCategoria();
    }

    async salvarPrecoCategoria(preco) {
        if (!preco.tamanho_id || !preco.tipo_pizza) {
            return { sucesso: false, mensagem: "Selecione o tamanho e o tipo de pizza." };
        }

        if (!preco.preco_pix || preco.preco_pix <= 0) {
            return { sucesso: false, mensagem: "Informe o preço Pix/Dinheiro." };
        }

        const novoPreco = await ProdutoRepository.salvarPrecoCategoria(preco);
        return { sucesso: true, mensagem: "Preço cadastrado com sucesso.", preco: novoPreco };
    }

    async atualizarPrecoCategoria(preco) {
        if (!preco.tamanho_id || !preco.tipo_pizza) {
            return { sucesso: false, mensagem: "Selecione o tamanho e o tipo de pizza." };
        }

        if (!preco.preco_pix || preco.preco_pix <= 0) {
            return { sucesso: false, mensagem: "Informe o preço Pix/Dinheiro." };
        }

        await ProdutoRepository.atualizarPrecoCategoria(preco);
        return { sucesso: true, mensagem: "Preço atualizado com sucesso.", preco };
    }

    async excluirPrecoCategoria(id) {
        await ProdutoRepository.excluirPrecoCategoria(id);
        return { sucesso: true, mensagem: "Preço excluído com sucesso." };
    }

    async obterAcrescimoCartao() {
        const valor = await ProdutoRepository.obterConfiguracao("acrescimo_cartao");
        return { sucesso: true, valor: Number(valor) || 0 };
    }

    async salvarAcrescimoCartao(valor) {
        if (valor === undefined || valor === null || Number(valor) < 0) {
            return { sucesso: false, mensagem: "Informe um valor de acréscimo válido." };
        }

        await ProdutoRepository.salvarConfiguracao("acrescimo_cartao", String(Number(valor)));
        return { sucesso: true, mensagem: "Acréscimo do cartão atualizado com sucesso." };
    }
}

module.exports = new ProdutoService();
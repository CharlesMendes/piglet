class FluxoCaixa {
    constructor({ id, data, saldoAtual, documentoOFX }) {
        this.id = id;
        this.data = data;
        this.saldoAtual = saldoAtual;
        this.documentoOFX = documentoOFX;
    }
}

module.exports = FluxoCaixa;
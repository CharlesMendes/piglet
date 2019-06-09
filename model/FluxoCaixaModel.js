const Mongoose = require('mongoose');

class FluxoCaixaModel {
    static getModelFluxoCaixa() {
        // para trabalhar com mongoose, precisamos definir
        // nossos Schemas (nosso mapeamento da base de dados)
        const fluxoCaixaSchema = new Mongoose.Schema({
            id: {
                type: Number,
                required: true
            },
            insertDate: {
                type: Date,
                default: new Date()
            },
            data: {
                type: Date,
                required: true
            },
            saldoAtual: {
                type: Number,
                required: true
            },
            documentoOFX: {
                type: String,
                required: false
            }
        });

        // Definimos um model collection para nosso documento
        const fluxoCaixaModel = Mongoose.model('fluxoCaixa', fluxoCaixaSchema);

        return fluxoCaixaModel;
    }
}

module.exports = FluxoCaixaModel;

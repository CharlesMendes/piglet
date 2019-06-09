const Mongoose = require('mongoose');

class PDVModel {
    static getModelPDV() {
        // para trabalhar com mongoose, precisamos definir
        // nossos Schemas (nosso mapeamento da base de dados)
        const pdvSchema = new Mongoose.Schema({
            id: {
                type: Number,
                required: true
            },
            insertDate: {
                type: Date,
                default: new Date()
            },
            razaoSocial: {
                type: String,
                required: true
            },
            totalEC: {
                type: Number,
                required: false
            },
            totalProdutosCancelados: {
                type: Number,
                required: false
            },
            totalProdutosContratados: {
                type: Number,
                required: false
            },
            saldoAtual: {
                type: Number,
                required: false
            }
        });

        // Definimos um model collection para nosso documento
        const pdvModel = Mongoose.model('pdv', pdvSchema);

        return pdvModel;
    }
}

module.exports = PDVModel;

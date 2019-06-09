const Mongoose = require('mongoose');

class IFModel {
    static getModelIF() {
        // para trabalhar com mongoose, precisamos definir
        // nossos Schemas (nosso mapeamento da base de dados)
        const ifSchema = new Mongoose.Schema({
            ispb: {
                type: Number,
                required: true
            },
            insertDate: {
                type: Date,
                default: new Date()
            },
            nome: {
                type: String,
                required: true
            },
            totalPDV: {
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
        const ifModel = Mongoose.model('if', ifSchema);

        return ifModel;
    }
}

module.exports = IFModel;

const Mongoose = require('mongoose');

class ProdutoFinanceiroModel {
    static getModelProdutoFinanceiro() {
        // para trabalhar com mongoose, precisamos definir
        // nossos Schemas (nosso mapeamento da base de dados)
        const produtoFinanceiroSchema = new Mongoose.Schema({
            id: {
                type: Number,
                required: true
            },
            insertDate: {
                type: Date,
                default: new Date()
            },
            ispb: {
                type: Number,
                required: true
            },
            nome: {
                type: String,
                required: true
            },
            urlImagem: {
                type: String,
                required: true
            },
            categoria: {
                type: String,
                required: true
            },
            taxa: {
                type: Number,
                required: true
            },
            valor: {
                type: Number,
                required: true
            }
        });

        // Definimos um model collection para nosso documento
        const produtoFinanceiroModel = Mongoose.model('produtoFinanceiro', produtoFinanceiroSchema);

        return produtoFinanceiroModel;
    }
}

module.exports = ProdutoFinanceiroModel;

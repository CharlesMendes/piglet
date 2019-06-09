const Mongoose = require('mongoose');

class ECModel {
    static getModelEC() {
        // para trabalhar com mongoose, precisamos definir
        // nossos Schemas (nosso mapeamento da base de dados)
        const ecSchema = new Mongoose.Schema({
            cnpj: {
                type: String,
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
            idProdutoSelecionado: {
                type: Number,
                required: false
            },
            idFluxoCaixa: {
                type: Number,
                required: false
            },
            domicilioISPB: {
                type: Number,
                required: false
            },
            domicilioCOMPE: {
                type: Number,
                required: false
            },
            domicilioAgencia: {
                type: Number,
                required: false
            },
            domicilioContaCorrente: {
                type: Number,
                required: false
            }
        });

        // Definimos um model collection para nosso documento
        const ecModel = Mongoose.model('ec', ecSchema);

        return ecModel;
    }
}

module.exports = ECModel;

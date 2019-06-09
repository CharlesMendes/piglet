const Mongoose = require('mongoose');
Mongoose.connect(process.env.MONGO_URL);

const connection = Mongoose.connection;

connection.once('open', () => console.log('Base de dados, conectada MANOWWWWW'));
connection.once('error', () => console.error('Não foi possível conectar, VISHHHH'));

const { getModel } = require('./model/CarroModel');
const { getModelEC } = require('./model/ECModel');
const { getModelFluxoCaixa } = require('./model/FluxoCaixaModel');
const { getModelPDV } = require('./model/PDVModel');
const { getModelIF } = require('./model/IFModel');
const { getModelProdutoFinanceiro } = require('./model/ProdutoFinanceiroModel');

const model = getModel();
const modelEC = getModelEC();
const modelFluxoCaixa = getModelFluxoCaixa();
const modelPDV = getModelPDV();
const modelIF = getModelIF();
const modelProdutoFinanceiro = getModelProdutoFinanceiro();

class Database {

    //PDV
    static pdv_produtoCancelados({ skip, limit }) {
        
        let query = {};

        const resultado = modelPDV.find(query, { __v: 0 })
            .skip(skip)
            .limit(limit);
        return resultado;
    }

    static pdv_produtoCancelar(id) {
        const resultado = modelPDV.remove({ _id: id });
        return resultado;
    }

    static pdv_produtoContratados({ skip, limit }) {
        
        let query = {};

        const resultado = modelPDV.find(query, { __v: 0 })
            .skip(skip)
            .limit(limit);
        return resultado;
    }

    static pdv_produtoContratar(ec) {
        // o metodo save, caso o model possuir um _id, ele fará o update
        // para somente inserir
        const item = new modelEC(ec);
        const resultado = item.save();
        return resultado;
    }

    static pdv_produtoId(_id) {
        const resultado = modelProdutoFinanceiro.findOne({ _id }, { __v: 0 });
        return resultado;
    }

    static pdv_produtos({ skip, limit }) {
        
        let query = {};

        const resultado = modelProdutoFinanceiro.find(query, { __v: 0 })
            .skip(skip)
            .limit(limit);
        return resultado;
    }

    //EC
    static ec_detalheId(_id) {
        const resultado = modelEC.findOne({ _id }, { __v: 0 });
        return resultado;
    }

    static ec_salvarFluxoCaixa(fluxo) {
        // o metodo save, caso o model possuir um _id, ele fará o update
        // para somente inserir
        const item = new modelFluxoCaixa(fluxo);
        const resultado = item.save();
        return resultado;
    }

    static ec_fluxoCaixaId(_id) {
        const resultado = modelFluxoCaixa.findOne({ _id }, { __v: 0 });
        return resultado;
    }

    static ec_fluxoCaixa({ skip, limit }) {
        
        let query = {};

        const resultado = modelFluxoCaixa.find(query, { __v: 0 })
            .skip(skip)
            .limit(limit);
        return resultado;
    }

    //IF
    static if_produtoCancelados({ skip, limit }) {
        
        let query = {};

        const resultado = modelIF.find(query, { __v: 0 })
            .skip(skip)
            .limit(limit);
        return resultado;
    }

    static if_produtoContratados({ skip, limit }) {
        
        let query = {};

        const resultado = modelIF.find(query, { __v: 0 })
            .skip(skip)
            .limit(limit);
        return resultado;
    }

    static if_produtoIdEC(_id) {
        const resultado = modelPDV.findOne({ _id }, { __v: 0 });
        return resultado;
    }

    static if_produtos({ skip, limit }) {
        
        let query = {};

        const resultado = modelPDV.find(query, { __v: 0 })
            .skip(skip)
            .limit(limit);
        return resultado;
    }
}

module.exports = Database;
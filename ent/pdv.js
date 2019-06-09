class PDV {
    constructor({ id, razaoSocial, totalEC, totalProdutosCancelados, totalProdutosContratados, saldoAtual }) {
        this.id = id;
        this.razaoSocial = razaoSocial;
        this.totalEC = totalEC;
        this.totalProdutosCancelados = totalProdutosCancelados;
        this.totalProdutosContratados = totalProdutosContratados;
        this.saldoAtual = saldoAtual;
    }
}

module.exports = PDV;
class IF {
    constructor({ ispb, nome, totaPDV, totalProdutosCancelados, totalProdutosContratados, saldoAtual }) {
        this.ispb = ispb;
        this.nome = nome;
        this.totalPDV = totaPDV;
        this.totalProdutosCancelados = totalProdutosCancelados;
        this.totalProdutosContratados = totalProdutosContratados;
        this.saldoAtual = saldoAtual;
    }
}

module.exports = IF;
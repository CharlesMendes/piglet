class ProdutoFinanceiro {
    constructor({ id, ispb, nome, urlImagem, categoria, taxa, valor }) {
        this.id = id;
        this.ispb = ispb;
        this.nome = nome;
        this.urlImagem = urlImagem;
        this.categoria = categoria;
        this.taxa = taxa;
        this.valor = valor;
    }
}

module.exports = ProdutoFinanceiro;
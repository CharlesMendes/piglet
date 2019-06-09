class EC {
    constructor({ cnpj, razaoSocial, idProdutoSelecionado, idFluxoCaixa, domicilioISPB, domicilioCOMPE, domicilioAgencia, domicilioContaCorrente }) {
        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
        this.idProdutoSelecionado = idProdutoSelecionado;
        this.idFluxoCaixa = idFluxoCaixa;
        this.domicilioISPB = domicilioISPB;
        this.domicilioCOMPE = domicilioCOMPE;
        this.domicilioAgencia = domicilioAgencia;
        this.domicilioContaCorrente = domicilioContaCorrente;
    }
}

module.exports = EC;
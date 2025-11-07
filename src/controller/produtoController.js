const { produtoModel } = require('../models/produtoModel');

const produtoController = {
  /**
   * Retorna os produtos cadastrados
   * Rota GET /produtos/
   * @async
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Array<Object} Objeto contendo o resultado da consulta
   */
  selecionaTodos: async (req, res) => {
    try {
      const idProduto = Number(req.query.idProduto);
      let resultadoId;
      if (idProduto) {
        resultadoId = await produtoModel.selectById(idProduto);
        if (resultadoId.length === 0) {
          return res.status(200).json({ message: 'O id pesquisado não existe' })
        }
        return res.status(200).json({ message: 'Dados do ID fornecido', data: resultadoId});
      }
      const resultado = await produtoModel.selectAll();
      if (resultado.length === 0) {
        return res.status(200).json({ message: 'A consulta não retornou resultados' });
      }
      res.status(200).json({ data: resultado })

    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  incluiRegistro: async (req, res) => {
    try {

      const { descricao, valor } = req.body;

      if (!descricao || !valor || !isNaN(descricao) || isNaN(valor)) {
        res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' })
      }

      const resultado = await produtoModel.insert(descricao, valor);
      if (resultado.insertId === 0) {
        throw new Error("ocorreu um erro ao incluir o produto");
      }

      res.status(201).json({ message: 'Registro incluido com sucesso', data: resultado })

    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  alteraProduto: async (req, res) => {
    try {
      const idProduto = Number(req.params.idProduto);
      const { descricao, valor } = req.body;

      if (!idProduto || (!descricao && !valor) || (!isNaN(descricao) && isNaN(valor)) || typeof idProduto != 'number') {
        res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' })
      }

      const produtoAtual = await produtoModel.selectById(idProduto);
      if (produtoAtual.length === 0) {
        return res.status(200).json({ message: 'Produto não localizado' });
      }

      const novaDescricao = descricao ?? produtoAtual[0].nome_produto;
      const novoValor = valor ?? produtoAtual[0].valor;

      const resultUptade = await produtoModel.update(idProduto, novaDescricao, novoValor);

      if (resultUptade.affectedRows === 1 && resultUptade.changedRows === 0) {
        return res.status(200).json({ message: 'Não há alterações a serem realizadas' })
      }

      if (resultUptade.affectedRows === 1 && resultUptade.changedRows === 1) {
        res.status(200).json({ message: 'Registro alterado com sucesso' })
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  deleteProduto: async (req, res) => {
    try {
      const idProduto = Number(req.params.idProduto)

      if (!idProduto || !Number.isInteger(idProduto)) {
        return res.status(400).json({ message: 'Forneça um identificador válido' });
      }

      const produtoSelecionado = await produtoModel.selectById(idProduto);
      if (produtoSelecionado.length === 0) {
        return res.status(400).json({ message: 'Produto não localizado na base de dados' });
      }

      const resultadoDelete = await produtoModel.delete(idProduto)
      if (resultadoDelete.affectedRows === 0) {
        return res.status(200).json({ message: 'Ocorreu um erro ao excluir o produto' });
      }

      res.status(400).json({ message: 'Produto excluído com sucesso', data: resultadoDelete });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  }
}

module.exports = { produtoController };

const { clienteModel } = require('../models/clienteModel');

const clienteController = {

  selecionaTodosClientes: async (req, res) => {
    try {
      const resultado = await clienteModel.selectAllClientes();
      if (resultado.length === 0) {
        return res.status(200).json({ message: 'A consulta não retornou resultados' });
      }
      res.status(200).json({ data: resultado })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  novoCliente: async (req, res) => {
    try {
      const { nome, cpf } = req.body;

      if (!nome || !cpf || !isNaN(nome)) {
        return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
      }
      if (isNaN(cpf) || cpf.length != 11) {
        return res.status(400).json({ message: 'O CPF deve conter 11 números.' });
      }

      const verificaCpf = await clienteModel.buscarPorCpf(cpf)
      if (verificaCpf) {
        return res.status(409).json({ message: 'O CPF informado já existe no banco de dados.' });
      }

      const resultado = await clienteModel.insertCliente(nome, cpf);
      if (resultado.insertId === 0) {
        throw new Error("Ocorreu um erro ao incluir o cliente");
      }

      res.status(201).json({ message: 'Registro incluido com sucesso', data: resultado });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  alteraCliente: async (req, res) => {
    try {
      const id_cliente = Number(req.params.id_cliente);
      const { nome, cpf } = req.body;

      if (!id_cliente || (!nome && !cpf) || !isNaN(nome) || typeof id_cliente != 'number') {
        return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
      }
      if (cpf !== undefined) {
        if (isNaN(cpf) || cpf.length != 11) {
          return res.status(400).json({ message: 'O CPF deve conter 11 números.' });
        }

        const verificaCpf = await clienteModel.buscarPorCpf(cpf);
        if (verificaCpf) {
          return res.status(409).json({ message: 'O CPF informado já existe no banco de dados.' });
        }
      }


      const clienteAtual = await clienteModel.selectByCliente(id_cliente);
      if (clienteAtual.length === 0) {
        return res.status(200).json({ message: 'O cliente não foi localizado' });
      }

      const novoCliente = nome ?? clienteAtual[0].nome_cliente;
      const novoCpf = cpf ?? clienteAtual[0].cpf_cliente;

      const resultado = await clienteModel.updateCliente(id_cliente, novoCliente, novoCpf);
      if (resultado.affectedRows === 1 && resultado.changedRows === 0) {
        return res.status(200).json({ message: 'Não há alterações a serem realizadas' })
      }

      if (resultado.affectedRows === 1 && resultado.changedRows === 1) {
        res.status(200).json({ message: 'Registro alterado com sucesso' })
      }

      res.status(201).json({ message: 'Registro incluido com sucesso', data: resultado });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  deletaCliente: async (req, res) => {
      try {
        const id_cliente = Number(req.params.id_cliente)
  
        if (!id_cliente || !Number.isInteger(id_cliente)) {
          return res.status(400).json({ message: 'Forneça um ID válido' });
        }
  
        const clienteSelecionado = await clienteModel.selectByCliente(id_cliente);
        if (clienteSelecionado.length === 0) {
          return res.status(400).json({ message: 'Cliente não localizado na base de dados' });
        }
  
        const resultadoDelete = await clienteModel.deleteCliente(id_cliente)
        if (resultadoDelete.affectedRows === 0) {
          return res.status(200).json({ message: 'Ocorreu um erro ao excluir o produto' });
        }
  
        res.status(400).json({ message: 'Cliente excluído com sucesso', data: resultadoDelete });
  
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
      }
    }

}

module.exports = { clienteController };
const express = require('express');
const clienteRoutes = express.Router();
const { clienteController } = require('../controller/clienteController');

clienteRoutes.get('/clientes', clienteController.selecionaTodosClientes);
clienteRoutes.post('/clientes', clienteController.novoCliente);

module.exports = { clienteRoutes };
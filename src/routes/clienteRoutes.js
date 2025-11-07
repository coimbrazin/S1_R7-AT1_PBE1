const express = require('express');
const clienteRoutes = express.Router();
const { clienteController } = require('../controller/clienteController');

clienteRoutes.get('/clientes', clienteController.selecionaTodosClientes);
clienteRoutes.post('/clientes', clienteController.novoCliente);
clienteRoutes.put('/clientes/:id_cliente', clienteController.alteraCliente);
clienteRoutes.delete('/clientes/:id_cliente', clienteController.deletaCliente);

module.exports = { clienteRoutes };
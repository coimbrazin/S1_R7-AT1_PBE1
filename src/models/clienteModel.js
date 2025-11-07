const express = require('express');
const { pool } = require('../config/db')

const clienteModel = {
  selectAllClientes: async () => {
    const sql = 'SELECT * FROM clientes;';
    const [rows] = await pool.query(sql);
    return rows;
  },

  selectByCliente: async (pId) => {
    const sql = 'SELECT * FROM clientes WHERE id_cliente=?;';
    const values = [pId]
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  buscarPorCpf: async (pCpf) => {
    const sql = 'SELECT * FROM clientes WHERE cpf_cliente=?;';
    const values = [pCpf];
    const [rows] = await pool.query(sql, values);
    return rows[0];
  },

  insertCliente: async (pNomeCliente, pCpf) => {
    const sql = 'INSERT INTO clientes (nome_cliente, cpf_cliente) VALUES (?,?);';
    const values = [pNomeCliente, pCpf]
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  updateCliente: async (pIdCliente, pNomeCliente, pCpf) => {
    const sql = 'UPDATE clientes SET nome_cliente=?, cpf_cliente=? WHERE id_cliente=?;';
    const values = [pNomeCliente, pCpf, pIdCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  deleteCliente: async (pIdCliente) => {
    const sql = 'DELETE FROM clientes WHERE id_cliente=?;';
    const values = [pIdCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  }
}

module.exports = { clienteModel };
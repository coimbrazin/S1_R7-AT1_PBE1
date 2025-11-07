const express = require('express');
const { pool } = require('../config/db');

const produtoModel = {
  /**
   * Retorna todos os produtos cadastrados na tabela produtos
   * @async
   * @function selectAll
   * @returns {Promise<Array<Object} Retorna um array de objetos representa um produto
   * @example
   * const produtos = await produtoModel.selectAll;
   * console.log(produtos)
   * // Saída esperada
   * [
   *  {coluna1:"valorColuna1", coluna2:"valorColuna2"...}
   * ]
   */
  selectAll: async () => {
    const sql = 'SELECT * FROM produtos;';
    const [rows] = await pool.query(sql);
    return rows;
  },

  selectById: async (pId) => {
    const sql = 'SELECT * FROM produtos WHERE id_produto=?;';
    const values = [pId]
    const [rows] = await pool.query(sql, values);
    return rows; 
  },

  /**
   * Insere os produtos na base de dados
   * @async
   * @function insert
   * @param {string} pNomeProd Descrição do nome do produto que deve ser inserido no BDDS. Ex: 'Teclado'
   * @param {number} pValorProd Valor do produto que será inserido no BDDS. Ex.: 199.90
   * @returns {Promise<Object} Retorna um objeto contendo propriedades sobre o resultado da execução da query.
   * @example 
   * const result = await produtoModel.insert(paramA, paramB);
   *  "result": {
   * "fieldCount": 0,
     *      "affectedRows": 1,
     *      "insertId": 1,
     *      "info": "",
     *      "serverStatus": 2,
     *      "warningStatus": 0,
     *      "changedRows": 0
     * } 
    */
  insert: async (pNomeProd, pValorProd) => {
    const sql = 'INSERT INTO produtos (nome_produto, valor) VALUES (?,?);';
    const values = [pNomeProd, pValorProd]
    const [rows] = await pool.query(sql, values);
    return rows;
  },


  /**
   * 
   * @param {number} pId Usado para identificar qual produto deve ser alterado no BDDS.
   * @param {string} pDescricao Descrição do nome do produto que deve ser alterado no BDDS. Ex: 'Teclado'
   * @param {number} pValor Valor do produto que será alterado no BDDS. Ex.: 199.90
   * @returns 
   */
  update: async (pId, pDescricao, pValor) => {
    const sql = 'UPDATE produtos SET nome_produto=?, valor=? WHERE id_produto=?;';
    const values = [pDescricao, pValor, pId];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  delete: async (pId) => {
    const sql = 'DELETE FROM produtos WHERE id_produto=?;';
    const values = [pId];
    const [rows] = await pool.query(sql, values);
    return rows;
  }
}

module.exports = { produtoModel };

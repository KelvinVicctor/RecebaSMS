const express = require('express')
const app = express()
const router = express.Router()
app.use((req, res, next) => {
  // Permitir qualquer tipo de cabeçalho na resposta
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Chame next() para passar para o próximo middleware ou rota
  next();
});
module.exports = { app, router , express}



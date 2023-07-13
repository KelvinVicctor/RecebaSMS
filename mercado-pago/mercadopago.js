const mercadopago = require('mercadopago')
const dotenv = require('dotenv').config()

// Adicionar Credenciais
try {
  mercadopago.configure({
    access_token: process.env.MP_SECRET_KEY,
    sandbox: false
  })
  module.exports = mercadopago
}

catch (err) {
  console.log('Mercado Pago ' + err)
}

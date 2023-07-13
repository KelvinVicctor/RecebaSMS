const mercadopago = require('./mercadopago.js');

// Criar Checkout

function createCheckout(title_produto, unit_price_product, external_reference_id) {
  return new Promise((resolve, reject) => {
    const preference = {
      items: [{
        title: title_produto,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: parseFloat(unit_price_product)
      }],
      notification_url: 'https://recebasms.vercel.app/mercadopago/webhook',
      external_reference: external_reference_id
    };
    mercadopago.preferences.create(preference)
      .then(function(response) {
        resolve(response.body.init_point)
      })
      .catch(function(error) {
        reject(error)
        console.log(error)
      })
  })
}

module.exports = createCheckout;

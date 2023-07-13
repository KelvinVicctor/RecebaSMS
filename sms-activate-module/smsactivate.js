const { SMSActivate } = require('sms-activate-org')
const dotenv = require('dotenv').config()
const api = new SMSActivate(process.env.SMS_ACTIVATE_KEY)
const services_json = require('./services.json')
const axios = require('axios')

async function obter_saldo() {
  const saldo = await api.getBalance()
  return saldo
}

function obter_numero(service, country, operator) {
  return new Promise(async (resolve, reject) => {
    const service_code = services_json.find(item => item.name == service)
    if (service_code) {
      const number = await api.getNumber({
        service: service_code.code,
        country: country,
        operator: operator
      })
        .then(async (number) => {
          await number.ready()
          resolve(number)
        })
        .catch(err => {
          const log = 'Erro ao obter número nessa operadora'
          resolve(log)
          console.log(err)
        })
    }

  })
}

async function obter_lista_servicos() {
  return services_json
}

function cancelar_ativacao(activation_id, activation_status) {
  return new Promise(async (resolve, reject) => {
    const cancelar = await api.setStatus({
      id: activation_id,
      status: activation_status
    })
      .then(async (cancelar) => {
        resolve(cancelar)
      })
      .catch(err => {
        console.log(err)
      })
  })
}

function obter_quantidade_numeros(country, operator, service) {
  return new Promise((resolve, reject) => {
    const service_code = services_json.find(item => item.name == service)
    if (service_code) {
      axios.get('https://api.sms-activate.org/stubs/handler_api.php?api_key=' + process.env.SMS_ACTIVATE_KEY + '&action=getCountries')
        .then(response => {
          const data_json = response.data
          let foundId;
          const country_code = Object.values(data_json).forEach(item => {
            if (item.eng == country) {
              foundId = item.id
            }
          })
          if (foundId) {
            const Code = service_code.code
            axios.get('https://api.sms-activate.org/stubs/handler_api.php?api_key=' + process.env.SMS_ACTIVATE_KEY + '&action=getNumbersStatus&country=' + foundId + '&operator=' + operator)
              .then(response => {
                const data_json = response.data
                const value = data_json[Code + '_0']
                if (value == undefined) {
                  resolve('0' + ' Números Disponíveis')
                }
                else {
                  resolve(value + ' Números Disponíveis')
                }
              })
          }
        })
        .catch((err) => {
          resolve(false)
          console.log(err)
        })
    }

  })
}

function obterPrecoServico(country, service) {
  return new Promise((resolve, reject) => {
    const service_code = services_json.find(item => item.name == service)
    if (service_code) {
      axios.get('https://api.sms-activate.org/stubs/handler_api.php?api_key=' + process.env.SMS_ACTIVATE_KEY + '&action=getCountries')
        .then(response => {
          const data_json = response.data
          let foundId;
          const country_code = Object.values(data_json).forEach(item => {
            if (item.eng == country) {
              foundId = item.id
            }
          })
          if (foundId) {
            axios.get('https://api.sms-activate.org/stubs/handler_api.php?api_key=' + process.env.SMS_ACTIVATE_KEY + '&action=getTopCountriesByService&service=' + service_code.code)
              .then((response) => {
                const data_json_prices = response.data
                let country_code_price_value = null;
                for (const key in data_json_prices) {
                  if (data_json_prices.hasOwnProperty(key) && data_json_prices[key].country == foundId) {
                    country_code_price_value = data_json_prices[key]
                    break
                  }
                }
                if (country_code_price_value != null) {
                  resolve(country_code_price_value.retail_price)
                }
              })
          }
        })
        .catch((err) => {
          resolve(false)
          console.log(err)
        })
    }

  })
}

function obter_principais_paises(service) {
  return new Promise((resolve, reject) => {
    const service_code = services_json.find(item => item.name == service)
    if (service_code) {
      axios.get('https://api.sms-activate.org/stubs/handler_api.php?api_key=' + process.env.SMS_ACTIVATE_KEY + '&action=getCountries')
        .then(response => {
          var data_json_countries = response.data
          axios.get('https://api.sms-activate.org/stubs/handler_api.php?api_key=' + process.env.SMS_ACTIVATE_KEY + '&action=getTopCountriesByService&service=' + service_code.code)
            .then(response => {
              const data_json_top = response.data
              let result = []
              let content = []
              for (const key in data_json_top) {
                const item = data_json_top[key]
                const countryPrice = {
                  country_id: item.country,
                  retail_price: item.retail_price
                }
                result.push(countryPrice)
              }
              result.forEach(item => {
                const retail_price = item.retail_price
                Object.values(data_json_countries).forEach(item2 => {
                  if (item2.id == item.country_id) {
                    function converterRubloParaReal(valorRublo) {
                      var taxaCambio = 0.0590;
                      var valorReal = valorRublo * taxaCambio
                      return valorReal.toFixed(2)
                    }
                    var valorReal = converterRubloParaReal(retail_price)
                    if (service_code.code == 'tg' || service_code.code == 'wa') {
                      var acrescimo = parseFloat(valorReal) + (parseFloat(valorReal) * 50 / 100)
                    }
                    else {
                      var acrescimo = parseFloat(valorReal) + (parseFloat(valorReal) * 100 / 100)
                    }
                    content.push({ 'id': item2.eng, 'content': item2.eng + ' (Preço: ' + acrescimo.toFixed(2) + ' Creditos)' })
                  }
                })
              })
              resolve(content)
            })
            .catch(err => {
              resolve(false)
              console.log(err)
            })
        })
        .catch(err => {
          resolve(false)
          console.log(err)
        })
    }
  })

}

module.exports = {
  obter_saldo,
  obter_numero,
  obter_lista_servicos,
  cancelar_ativacao,
  obter_quantidade_numeros,
  obterPrecoServico,
  obter_principais_paises,
}



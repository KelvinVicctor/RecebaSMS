var sms_activate_base = '/sms-activate/'

// Obter Cookie - Funcao
function obter_cookie(cookie_name) {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookie_name + "=")) {
      return cookie.substring(cookie_name.length + 1)
    }
  }
  return "";

}

// Alterar numero virtual - Funcao
function alterar_numero_virtual(numero_virtual) {
  return new Promise((resolve, reject) => {
    fetch('/alterar/numero_virtual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'user_token': obter_cookie('user_token'),
        'numero_virtual': numero_virtual
      })
    })
      .then(response => response.text())
      .then(data => {
        resolve(data)
      })
      .catch(err => console.log(err))
  })
}

// Obter numero virtual - Funcao
function obter_numero_api(service, country, operator) {
  return new Promise((resolve, reject) => {
    fetch(sms_activate_base + 'getNumber', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'service': service,
        'country': country,
        'operator': operator
      })

    })
      .then(response => response.json())
      .then(data => {
        const activation_cost = data.activationCost
        const number = data.phoneNumber
        const activation_id = data.activationId
        resolve([activation_cost, number, activation_id])
      })
      .catch(err => console.log(err))
  })
}

// Cancelar ativacao - Funcao

function cancelar_ativacao(activation_id, activation_status) {
  fetch(sms_activate_base + 'setStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'

    },
    body: JSON.stringify({
      'id': activation_id,
      'status': activation_status
    })
  })
    .then(response => response.json())
    .then(data => {
      return data.code
    })
    .catch(err => console.log(err))
}

// Alterar Ativacao Preco - Funcao

function alterar_ativacao_preco(activation_cost) {
  return new Promise((resolve, reject) => {
    fetch('/alterar/ativacao_preco', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'user_token': obter_cookie('user_token'),
        'ativacao_preco': activation_cost
      })
    })
      .then(response => response.text())
      .then(data => {
        resolve(data)
      })
      .catch(err => console.log(err))
  })
}

// Alterar Ativacao Id - Funcao
function alterar_ativacao_id(activation_id) {
  return new Promise((resolve, reject) => {
    fetch('/alterar/ativacao_id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'user_token': obter_cookie('user_token'),
        'ativacao_id': activation_id
      })
    })
      .then(response => response.text())
      .then(data => {
        resolve(data)
      })
      .catch(err => console.log(err))
  })
}

// Consultar Numeros Disponiveis 
function consultar_numeros(country, operator, service) {
  return new Promise((resolve, reject) => {
    fetch(sms_activate_base + 'available_numbers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'country': country,
        'operator': operator,
        'service': service
      })
    })
      .then(response => response.text())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        resolve(false)
      })
  })
}

// Obter Precos dos Servicos
function obter_preco_servicos(country, service) {
  return new Promise((resolve, reject) => {
    fetch(sms_activate_base + 'getServicePrice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'country': country,
        'service': service
      })
    })
      .then(response => response.text())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        resolve(false)
        console.log(err)
      })
  })
}

// Script - Comprar Numeros
const selecionar_pais = document.querySelector('.selecionar_pais')
const selecionar_servico = document.querySelector('.selecionar_servico')
const selecionar_operadora = document.querySelector('.selecionar_operadora')
const btn_comprar_numero = document.querySelector('.btn.btn-success.btn-comprar')
btn_comprar_numero.addEventListener('click', () => {
  if (selecionar_pais.value == "" && selecionar_servico.value == "" && selecionar_operadora.value == "") {
    swal({
      title: "Erro!",
      text: "Selecione um país e um serviço e operadora!",
      icon: "error",
      button: "Ok",
      closeOnClickOutside: false
    })
  }
  else {
    fetch('/detalhes_usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'user_token': obter_cookie('user_token')
      })
    })
      .then(response => response.json())
      .then(data => {
        const creditos = data.creditos
        const numero_virtual = data.numero_virtual
        if (numero_virtual == 'Não Disponível') {
          consultar_numeros(selecionar_pais.value, selecionar_operadora.value, selecionar_servico.value)
            .then((data) => {
              var numeros_disponiveis = data
              if (data != "0 Números Disponíveis" && data != false) {
                obter_preco_servicos(selecionar_pais.value, selecionar_servico.value)
                  .then((data_precos) => {
                    swal({
                      title: "País: " + selecionar_pais.value,
                      icon: 'info',
                      text: "Servico: " + selecionar_servico.value + "\n" + "Operadora: " + selecionar_operadora.value + "\n" + "Preço: " + data_precos + '\n' + numeros_disponiveis,
                      buttons: {
                        cancel: 'Cancelar',
                        confirm: 'Receber SMS'
                      },
                      closeOnClickOutside: false
                    })
                      .then((value) => {
                        if (value) {
                          obter_numero_api(selecionar_servico.value, selecionar_pais.value, selecionar_operadora.value)
                            .then(data => {
                              if (data[1] != 'Operadora indisponível para criação do numero') {
                                function converterRubloParaReal(valorRublo) {
                                  var taxaCambio = 0.0590;
                                  var valorReal = valorRublo * taxaCambio
                                  return valorReal.toFixed(2)
                                }
                                var valorReal = converterRubloParaReal(data[0])
                                if(selecionar_servico.value == 'Telegram' || selecionar_servico.value == 'Whatsapp'){
                                  var valorRealAcrescimo = parseFloat(valorReal) + (parseFloat(valorReal) * 50 / 100)
                                }
                                else {
                                  var valorRealAcrescimo = parseFloat(valorReal) + (parseFloat(valorReal) * 100 / 100)
                                }
                                var activation_cost = valorRealAcrescimo.toFixed(2)
                                const number = data[1]
                                const activation_id = data[2]
                                if (parseFloat(creditos) <= 0.00 || parseFloat(creditos) < activation_cost) {
                                  swal({
                                    title: "Erro!",
                                    text: "Você não possui créditos suficientes para comprar este número!",
                                    icon: "error",
                                    button: "Ok",
                                    closeOnClickOutside: false
                                  })
                                  cancelar_ativacao(activation_id, 8)
                                }
                                else {
                                  swal({
                                    title: 'Processando...',
                                    text: 'Por favor aguarde!',
                                    icon: 'info',
                                    button: false,
                                    closeOnClickOutside: false,
                                    closeOnEsc: false,
                                    timer: 5000
                                  })
                                    .then(() => {
                                      alterar_numero_virtual(number)
                                        .then(data => {
                                          if (data == 'Numero Virtual Alterado Com Sucesso') {
                                            alterar_ativacao_preco(activation_cost)
                                              .then(data => {
                                                if (data == 'Preço de Ativação Alterado Com Sucesso') {
                                                  alterar_ativacao_id(activation_id)
                                                    .then(data => {
                                                      if (data == 'Id de Ativação Alterado Com Sucesso') {
                                                        swal({
                                                          title: "Numero Comprado com Sucesso!",
                                                          text: "Lembre-se o crédito só será descontado quando o número receber sms!",
                                                          icon: "success",
                                                          button: "Ok",
                                                          closeOnClickOutside: false
                                                        })
                                                          .then(() => {
                                                            swal({
                                                              title: number,
                                                              text: "Esse é o seu número virtual",
                                                              icon: "success",
                                                              button: "Receber SMS",
                                                              closeOnClickOutside: false
                                                            })
                                                              .then(() => {
                                                                var caixa_sms = document.querySelector('.caixa_sms')
                                                                var btn_button_atualizar = document.querySelector('.btn_button_atualizar')
                                                                var info_text = document.querySelector('.info-text')
                                                                info_text.textContent = 'Receber SMS'
                                                                var textarea_numero = document.querySelector('.numero-info')
                                                                var services_numbers = document.querySelector('.services_numbers')
                                                                var btn_button = document.querySelector('.btn_button')
                                                                caixa_sms.style.display = 'flex'
                                                                btn_button_atualizar.style.display = 'flex'
                                                                services_numbers.style.display = 'none'
                                                                btn_button.style.display = 'none'
                                                                textarea_numero.value = number

                                                              })
                                                          })
                                                      }
                                                    })
                                                    .catch(err => {
                                                      console.log('Alterar Ativacao Id: ' + err)
                                                      cancelar_ativacao(activation_id, 8)
                                                      swal({
                                                        title: "Erro!",
                                                        text: "Erro ao acesso do servidor, tente novamente!",
                                                        icon: "error",
                                                        button: "Ok",
                                                        closeOnClickOutside: false
                                                      })
                                                    })
                                                }
                                              })
                                              .catch(err => {
                                                console.log('Alterar Ativacao: ' + err)
                                                cancelar_ativacao(activation_id, 8)
                                                swal({
                                                  title: "Erro!",
                                                  text: "Erro ao acesso do servidor, tente novamente!",
                                                  icon: "error",
                                                  button: "Ok",
                                                  closeOnClickOutside: false
                                                })
                                              })
                                          }
                                          else {
                                            cancelar_ativacao(activation_id, 8)
                                            swal({
                                              title: "Erro!",
                                              text: "Erro ao acesso do servidor, tente novamente!",
                                              icon: "error",
                                              button: "Ok",
                                              closeOnClickOutside: false
                                            })
                                          }
                                        })
                                        .catch(err => {
                                          console.log('Alterar Numero: ' + err)
                                          cancelar_ativacao(activation_id, 8)
                                          swal({
                                            title: "Erro!",
                                            text: "Erro ao acesso do servidor, tente novamente!",
                                            icon: "error",
                                            button: "Ok",
                                            closeOnClickOutside: false
                                          })
                                        })
                                    })
                                }
                              }
                              else if (data[1] == 'Operadora indisponível para criação do numero') {
                                swal({
                                  title: "Erro!",
                                  text: "Operadora indisponível para criação do numero!",
                                  icon: "error",
                                  button: "Ok",
                                  closeOnClickOutside: false
                                })
                              }
                            })
                            .catch(err => {
                              console.log('Obter Numero: ' + err)
                              swal({
                                title: "Erro!",
                                text: "Erro ao acesso do servidor, tente novamente!",
                                icon: "error",
                                button: "Ok",
                                closeOnClickOutside: false
                              })
                            })
                        }
                      })
                  })
              }
              else if (data == "0 Números Disponíveis") {
                swal({
                  title: "País: " + selecionar_pais.value,
                  icon: 'info',
                  text: "Servico: " + selecionar_servico.value + "\n" + "Operadora: " + selecionar_operadora.value + "\n" + data,
                  button: 'Fechar',
                  closeOnClickOutside: false
                })
              }
              else if (data == false) {
                swal({
                  title: "Error!",
                  icon: 'error',
                  text: "Erro ao consultar a quantidade de números",
                  button: 'Fechar',
                  closeOnClickOutside: false
                })
              }
            })
            .catch(err => {
              console.log('Obter quantidade: ' + err)
              swal({
                title: "Erro!",
                text: "Erro ao acesso do servidor, tente novamente!",
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false
              })
            })
        }
        else {
          swal({
            title: "Erro!",
            text: 'Você já possui um número virtual! Para remover clique em "Remover Número"',
            icon: "error",
            button: "Remover Número",
            closeOnClickOutside: false
          })
            .then(async () => {
              await cancelar_ativacao(data.ativacao_id, 8)
              await alterar_numero_virtual('Não Disponível')
              await alterar_ativacao_preco("0.00")
              await alterar_ativacao_id("0")
              swal({
                title: "Número Antigo Removido Com Sucesso",
                text: "Seu número virtual antigo foi removido com sucesso" + "\n" + "Agora você poderá fazer sua compra",
                icon: "success",
                button: "Ok"
              })
            })
        }
      })
      .catch(err => {
        console.log('Detalhes do usuario: ' + err.stack)
        swal({
          title: "Erro!",
          text: "Erro ao acesso do servidor, tente novamente!",
          icon: "error",
          button: "ok",
          closeOnClickOutside: false
        })

      })
  }
})



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

const user_token = obter_cookie('user_token')

function obterSMS(activation_id) {
  return new Promise((resolve, reject) => {
    fetch('/sms-activate/getSMS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'activation_id': activation_id
      })
    })
      .then(response => response.text())
      .then((data) => {
        resolve(data)
      })
      .catch(err => {
        resolve(false)
      })
  })
}

function alterar_creditos(creditos, user_token) {
  return new Promise((resolve, reject) => {
    fetch('/alterar/creditos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'user_token': user_token,
        'creditos': creditos
      })
    })
      .then(response => response.text())
      .then((data) => {
        resolve(data)
      })
      .catch(err => {
        resolve(false)
      })
  })
}

function alterar_uso_creditos(uso_creditos, user_token) {
  return new Promise((resolve, reject) => {
    fetch('/alterar/uso_creditos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'user_token': user_token,
        'uso_creditos': uso_creditos
      })
    })
      .then(response => response.text())
      .then((data) => {
        resolve(data)
      })
      .catch(err => {
        resolve(false)
      })
  })
}

function alterar_sms_recebidos(sms_recebidos, user_token) {
  return new Promise((resolve, reject) => {
    fetch('/alterar/sms_recebidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'user_token': user_token,
        'sms_recebidos': sms_recebidos
      })
    })
      .then(response => response.text())
      .then((data) => {
        resolve(data)
      })
      .catch(err => {
        resolve(false)
      })
  })
}

function alterar_gastos_total(gastos,user_token) {
  return new Promise((resolve, reject) => {
    fetch('/alterar/gastos_total', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'gastos': gastos,
        'user_token': user_token,
      })
    })
      .then(response => response.text())
      .then((data) => {
        resolve(data)
      })
      .catch(err => {
        resolve(false)
      })
  })
}

function detalhes_usuario(token) {
  return new Promise((resolve, reject) => {
    fetch('/detalhes_usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'user_token': token
      })
    })
      .then(response => response.json())
      .then((data) => {
        resolve(data)
      })
      .catch(err => {
        console.log(err)
      })
  })
}
if (user_token) {
  const refresh_messages = document.querySelector('.btn.btn-success.btn-atualizar')
  refresh_messages.addEventListener('click', () => {
    detalhes_usuario(user_token)
      .then((data) => {
        var creditos_user = data.creditos
        var activation_preco = data.ativacao_preco
        var activation_id = data.ativacao_id
        var uso_creditos_user = data.uso_creditos
        var creditos_total = data.creditos_total
        var gastos_total = data.gastos_total
        obterSMS(activation_id)
          .then((data) => {
            console.log(data)
            if (data == 'STATUS_WAIT_CODE') {
              swal({
                title: "Esperando SMS!",
                text: "Nenhum SMS Recebido" + "\n\n" + "Caso o sms não chegue em 2 minutos " + "\n" + "Volte ao painel & solicite outro número" + "\n\n" + "Seus créditos só serão descontados" + "\n\n" + "Quando você receber o sms",
                icon: "info",
                button: "Ok",
                closeOnClickOutside: false
              })
            }
            if (data.includes("STATUS_OK")) {
              swal({
                title: "SMS Recebido!",
                text: "Você recebeu um sms",
                icon: "success",
                button: "Ok",
                closeOnClickOutside: false
              })
                .then(() => {
                  const textarea_codigo = document.querySelector('.caixa_sms .codigo-info')
                  textarea_codigo.value = 'Código do serviço: ' + '\n' + data.replace('STATUS_OK:', '')
                  const total = activation_preco
                  if (parseFloat(total) >= parseFloat(creditos_user)) {
                    alterar_creditos(0, user_token)
                      .then((data) => {
                        alterar_uso_creditos(100, user_token)
                          .then((data) => {
                            alterar_sms_recebidos(1, user_token)
                              .then((data) => {
                                console.log('')
                              })
                              .catch(err => console.log(err))
                          })
                          .catch(err => console.log(err))
                      })
                      .catch(err => console.log(err))
                  }
                  else {
                    const valor_gasto = parseFloat(gastos_total) + parseFloat(total)
                    let uso_total = (valor_gasto / parseFloat(creditos_total)) * 100
                    
                    alterar_creditos(parseFloat(creditos_user) - parseFloat(total), user_token)
                      .then((data) => {
                        
                        alterar_uso_creditos(uso_total, user_token)
                          .then((data) => {
                            alterar_sms_recebidos(1, user_token)
                              .then((data) => {
                                alterar_gastos_total(parseFloat(valor_gasto),user_token)
                                .then((data) => {})
                                .catch(err => console.log(err))
                              })
                              .catch(err => console.log(err))
                          })
                          .catch(err => console.log(err))
                      })
                      .catch(err => console.log(err))
                  }

                })
            }
          })
          .catch((err) => {
            swal({
              title: "Erro!",
              text: 'Erro ao obter sms',
              icon: "error",
              button: "Continuar",
              closeOnClickOutside: false
            })
            console.log(err)
          })
      })
      .catch(error => {
        console.log('Erro:', error)
        swal({
          title: "Erro!",
          text: 'Erro ao obter dados do seu usuário',
          icon: "error",
          button: "OK",
          closeOnClickOutside: false
        })
      })
  })
}

else {
  console.log('Valor do cookie não encontrado')
}
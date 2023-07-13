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

const sms_activate_base = '/sms-activate/'
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

const user_token = obter_cookie("user_token");
if (user_token) {
  fetch('/detalhes_usuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
    },
    body: JSON.stringify({
      'user_token': user_token
    })
  })
    .then(response => response.json())
    .then(data => {
      document.getElementsByClassName('creditos_value')[0].innerHTML = 'Créditos: ' + data.creditos
      document.querySelector('.creditos_valor_info span').style.color = '#76EB3C'
      document.getElementsByClassName('numero_virtual_text')[0].innerHTML = 'Numero Virtual: ' + data.numero_virtual
      document.getElementsByClassName('sms-recebidos-valor')[0].innerHTML = data.sms_recebidos
      document.getElementsByClassName('numero_virtual_text')[0].innerHTML = 'Numero Virtual: ' + data.numero_virtual
      document.getElementsByClassName('creditos_uso_valor')[0].innerHTML = data.uso_creditos + '%'
      var progress = document.querySelector('.container.creditos_info .uso-creditos-progresso')
      progress.value = data.uso_creditos
      progress.max = 100
      document.getElementsByClassName('conta_text')[0].innerHTML = data.conta
      if (data.creditos == 0) {
        document.querySelector('.creditos_valor_info span').style.color = 'red'
      }
      if (data.conta == null) {
        document.getElementsByClassName('conta_text')[0].innerHTML = "Nenhum"
      }

      if (data.numero_virtual != 'Não Disponível') {
        const deletar_numero = document.querySelector('.deletar_numero')
        deletar_numero.style.display = 'block'
        deletar_numero.addEventListener('click', () => {
          cancelar_ativacao(data.ativacao_id, 8)
          fetch('/alterar/numero_virtual', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
            },
            body: JSON.stringify({
              'user_token': obter_cookie('user_token'),
              'numero_virtual': 'Não Disponível'
            })
          })
            .then(response => response.text())
            .then(dados => {
              fetch('/alterar/ativacao_preco', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
                },
                body: JSON.stringify({
                  'user_token': obter_cookie('user_token'),
                  'ativacao_preco': '0.00'
                })
              })
                .then(response => response.text())
                .then(dados => {
                  fetch('/alterar/ativacao_id', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
                    },
                    body: JSON.stringify({
                      'user_token': obter_cookie('user_token'),
                      'ativacao_id': '0'
                    })
                  })
                    .then(response => response.text())
                    .then(dados => {
                      document.getElementsByClassName('numero_virtual_text')[0].innerHTML = 'Numero Virtual: Não Disponível'
                      deletar_numero.style.display = 'none'
                    })
                    .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        })

      }
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
}
else {
  console.log('Valor do cookie não encontrado')
}
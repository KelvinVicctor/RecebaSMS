var sms_activate_base = '/sms-activate/'
var array_service = []
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
const select_servico = document.querySelector('.selecionar_servico')

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
    if (data.conta == 'Crédito') {
      services = ['Whatsapp', 'Instagram', 'Uber', 'Tinder', 'TikTok/Douyin', 'Microsoft', 'facebook', 'Twitter', 'Telegram', 'Google,youtube,Gmail', 'Discord', 'Amazon', 'WeChat', 'Viber', 'vk.com', 'Snapchat',]

      for (let i = 0; i < services.length; i++) {
        const service_name = services[i]
        const option_criar = select_servico.appendChild(document.createElement('option'))
        option_criar.setAttribute('value', service_name)
        option_criar.innerHTML = service_name
      }
    }
    else if (data.conta == 'Promocional') {
      fetch(sms_activate_base + 'getServices', {
        method: 'GET',
        headers: {
          'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
        }
      })
        .then(response => response.json())
        .then(data_json_service => {
          for (let i = 0; i < Object.keys(data_json_service).length; i++) {
            const service_name = data_json_service[i]['name']
            array_service.push(service_name)
          }
          array_service.sort(function(a, b) {
            return a.localeCompare(b)
          })

          if (select_servico.className == 'selecionar_servico') {
            for (let i = 0; i < Object.keys(array_service).length; i++) {
              const array_servico_name = array_service[i]
              const option_criar = select_servico.appendChild(document.createElement('option'))
              option_criar.setAttribute('value', array_servico_name)
              option_criar.innerHTML = array_servico_name
            }
          }
        })
        .catch(err => { console.log(err) })
    }
    if (data.conta == null) {
      swal({
        title: 'Erro',
        text: 'Você não possui um plano, por favor, adquira um  para liberar os serviços.',
        icon: 'error',
        button: 'Ir para o painel',
        closeOnClickOutside: false
      })
        .then(() => {
          window.location.href = '/dashboard'
        })
    }
  })
  .catch(err => console.log(err))
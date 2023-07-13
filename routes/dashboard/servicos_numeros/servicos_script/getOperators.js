var sms_activate_base = '/sms-activate/'

function obter_operadoras(country) {
  return new Promise((resolve, reject) => {
    fetch(sms_activate_base + 'getOperators', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'country': country
      })
    })
      .then(response => response.json())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err)
        resolve(false)
      })
  })
}

const select_pais = document.querySelector('.selecionar_pais')
const selecionar_operadoras = document.querySelector('.selecionar_operadora')

// Como limpar select antes de selecionar
select_pais.addEventListener("change", function() {
  selecionar_operadoras.innerHTML = ""
  const qualquer_operadora = selecionar_operadoras.appendChild(document.createElement('option'))
  qualquer_operadora.setAttribute('value', "any")
  qualquer_operadora.innerHTML = "Qualquer Operadora"
  if (select_pais.value != "") {
    obter_operadoras(select_pais.value)
      .then((data) => {
        if (data != false) {
          const operadoras = data.countryOperators
          for (let i = 0; i < Object.keys(operadoras).length; i++) {
            const option_criar = selecionar_operadoras.appendChild(document.createElement('option'))
            option_criar.setAttribute('value', operadoras[i])
            option_criar.innerHTML = operadoras[i]
          }
        }
        else {
          swal({
            title: "Erro!",
            text: "Erro ao exibir operadoras",
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false
          })
        }
      })
      .catch((err) => {
        swal({
          title: "Erro!",
          text: "Erro ao exibir operadoras",
          icon: "error",
          button: "Ok",
          closeOnClickOutside: false
        })
      })
  }
})


var sms_activate_base = '/sms-activate/'

function obter_pais(service) {
  return new Promise((resolve, reject) => {
    fetch(sms_activate_base + 'getTopCountriesByService', {
      method: 'POST',
      headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'service': service
      })
    })
      .then(response => response.json())
      .then((data => {
        resolve(data)
      }))
      .catch(err => {
        console.log(err)
      })
  })
}

const select_servico_content = document.querySelector('.selecionar_servico')
const selecionar_pais_content = document.querySelector('.selecionar_pais')
select_servico_content.addEventListener("change", function() {
  selecionar_pais_content.innerHTML = ""
  const exibir_pais = selecionar_pais_content.appendChild(document.createElement('option'))
  exibir_pais.setAttribute('value', "Selecione_Pais")
  exibir_pais.setAttribute('disabled', 'selected')
  exibir_pais.innerHTML = "Recomendado usar o Brazil"
  if (select_servico_content.value != "") {
    obter_pais(select_servico_content.value)
      .then(response => {
        var array = response
        
        array.sort(function(a, b) {
          var idA = a.id.toUpperCase()
          var idB = b.id.toUpperCase()
          if(idA == 'BRAZIL'){
            return - 1
          }
          if(idB == 'BRAZIL'){
            return 1
          }
          if(idA < idB){
            return -1
          }
          else {
            return 1
          }
          return 0
        })
        
        for (let i = 0; i < Object.keys(array).length; i++) {
          const array_pais_dados = array[i]['content']
          const option_criar = selecionar_pais_content.appendChild(document.createElement('option'))
          option_criar.setAttribute('value', array[i]['id'])
          option_criar.innerHTML = array_pais_dados
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
})

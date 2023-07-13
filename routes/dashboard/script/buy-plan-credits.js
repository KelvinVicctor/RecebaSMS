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

function checkout(title, unit_price, id) {
  return new Promise((resolve, reject) => {
    fetch('/mercadopago/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
      },
      body: JSON.stringify({
        'title_produto': title,
        'unit_price': unit_price,
        'external_reference': id
      })
    })
      .then(response => response.text())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
  })
}

// Plano Promocional 
const promocional_button = document.querySelector('.plans_pricing_container .plan.mensal .plan_button')
promocional_button.addEventListener('click', () => {
  Swal.fire({
    title: 'Processando...',
    text: 'Por favor aguarde!',
    icon: 'info',
    timer: 5000,
    showCancelButton: false,
    showConfirmButton: false,
    showDenyButton: false,
    allowOutsideClick: false,
  })
    .then(() => {
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
            const plan_value = document.querySelector('.plans_pricing_container .plan.mensal .plan_price').textContent
            checkout("Plano Promocional", plan_value.replace('R$', '').replace(',', '.').trim(), data.email)
              .then(data => {
                window.location.href = data
              })
              .catch(err => {
                Swal.fire({
                  title: 'Erro ao processar o pagamento!',
                  icon: 'error',
                  text: 'Por favor realize uma nova compra!',
                  showCancelButton: false,
                  confirmButtonText: 'Continuar',
                  allowOutsideClick: false,
                  allowEscapeKey: false
                })
              })
          })
          .catch(err => console.log(err))
      }

    })
})


// Comprar Creditos
const creditos_button = document.querySelector('.plans_pricing_container .plan.credits .plan_button')
creditos_button.addEventListener('click', () => {
  const credits_value = document.querySelector('.plans_pricing_container .plan.credits .range_value')
  if (credits_value.textContent == '0 Creditos') {
    swal({
      title: 'Erro ao processar o pagamento',
      text: 'Por favor selecione a quantidade de créditos',
      icon: 'error',
      button: 'Ok',
      closeOnClickOutside: false
    })
  }
  else {
    Swal.fire({
      title: 'Processando...',
      text: 'Por favor aguarde!',
      icon: 'info',
      timer: 5000,
      showCancelButton: false,
      showConfirmButton: false,
      showDenyButton: false,
      allowOutsideClick: false,
    })
      .then(() => {
        const plan_value = document.querySelector('.plans_pricing_container .plan.credits .plan_price').textContent
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
              checkout(credits_value.textContent, plan_value.replace('R$', '').replace(',', '.').trim(), data.email)
                .then(data => {
                  window.location.href = data
                })
                .catch(err => {
                  Swal.fire({
                    title: 'Erro ao processar o pagamento!',
                    icon: 'error',
                    text: 'Por favor realize uma nova compra!',
                    showCancelButton: false,
                    confirmButtonText: 'Continuar',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                  })
                })
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
  }
})
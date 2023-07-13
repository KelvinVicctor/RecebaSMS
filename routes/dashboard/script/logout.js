const logout = document.querySelector('.menu .menu-item.sair');

function removerCookie(nome) {
  document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
}

logout.addEventListener('click', async function() {
  await removerCookie('user_token')
  swal({
    title: "Sucesso!",
    text: "Você foi deslogado com sucesso!",
    icon: "success",
    closeOnClickOutside: false
  })
    .then(() => {
      window.location.href = '/login'
    })
})

// Mobile

const logout_mobile = document.querySelector('.menu-mobile .menu-item.sair');


function removerCookie(nome) {
  document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
}

logout_mobile.addEventListener('click', async function() {
  document.querySelector('.menu-mobile').style.display = 'none'
  document.querySelector('.hamburguer_navbar span').textContent = "MENU"
  await removerCookie('user_token')
  swal({
    title: "Sucesso!",
    text: "Você foi deslogado com sucesso!",
    icon: "success",
    closeOnClickOutside: false
  })
    .then(() => {
      window.location.href = '/login'
    })
})

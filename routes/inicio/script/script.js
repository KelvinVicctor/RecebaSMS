// Script

// Navigation Bar Adiconar lista de Eventos
function addEventos() {
  var menumobile_ul = document.querySelector('.menu_tablet .menu_tablet_info ul')
  menumobile_ul.style.opacity = '1'
  if (menumobile_ul.style.display == 'block') {
    return menumobile_ul.style.display = 'none'
  }
  return menumobile_ul.style.display = 'block'
}

var menumobile_navbar = document.querySelector('.menu_tablet .menu_tablet_info i')
menumobile_navbar.addEventListener('click', (e) => {
  menumobile_navbar.style.backgroundColor = 'black'
  addEventos()
}) 
const credits_button = document.querySelectorAll('.plans_pricing .plans_pricing_container .plan.credits .values_button .values')
const credits_value = document.querySelector('.plans_pricing .plans_pricing_container .plan.credits .range_value')
const valor = document.querySelector('.plans_pricing .plans_pricing_container .plan.credits .plan_price')
credits_button.forEach(function(button) {
    button.addEventListener('click', function() {
        var value = this.getAttribute('value')
        credits_value.textContent = value + ' Créditos'
        valor.textContent = 'R$ ' + value + ',00'

    })
})
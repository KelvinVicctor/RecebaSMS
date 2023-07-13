const dotenv = require('dotenv').config()
const key = process.env.SMS_ACTIVATE_KEY
const services = require('./services.json')
const axios = require('axios')

const country = 'Brazil'
//axios.get('https://api.sms-activate.org/stubs/handler_api.php?api_key=' + key + '&action=getRentServicesAndCountries&rent_time=$time&operator=any&country=' + country)
//.then((response) => {
  //console.log(JSON.stringify(response.data))
//})



axios.get('https://api.sms-activate.org/stubs/handler_api.php?api_key=' + key + '&action=getOperators&country=' + country)
.then((response) => {
  console.log(JSON.stringify(response.data))
})
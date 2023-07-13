const { app , router , express } = require('../express_static')
const fs = require('fs')

// API inicio
// Caminho para pastas
app.use(express.static(__dirname + '/inicio/styles'))
app.use(express.static(__dirname + '/inicio/script'))
app.use(express.static(__dirname + '/inicio/src'))
app.use(express.static(__dirname + '/inicio/src/icones_bandeiras'))

// API Login
// Caminho para pastas
app.use(express.static(__dirname + '/login/styles'))
app.use(express.static(__dirname + '/login/login_script'))
app.use(express.static(__dirname + '/login/src'))

// API Cadastro
// Caminho para pastas
app.use(express.static(__dirname + '/registro/styles'))
app.use(express.static(__dirname + '/registro/registro_script'))
app.use(express.static(__dirname + '/registro/src'))

// API Recuperar conta
// Caminho para pastas
app.use(express.static(__dirname + '/recuperar_conta/styles'))
app.use(express.static(__dirname + '/recuperar_conta/recuperar_script'))
app.use(express.static(__dirname + '/recuperar_conta/src'))

// API Redefinir senha
// Caminho para pastas
app.use(express.static(__dirname + '/redefinir_senha/styles'))
app.use(express.static(__dirname + '/redefinir_senha/redefinir_senha_script'))


// API Dashboard
// Caminho para pastas
app.use(express.static(__dirname + '/dashboard/styles'))
app.use(express.static(__dirname + '/dashboard/script'))
app.use(express.static(__dirname + '/dashboard/src'))
app.use(express.static(__dirname + '/dashboard/support_email/styles'))
app.use(express.static(__dirname + '/dashboard/support_email/src'))
app.use(express.static(__dirname + '/dashboard/support_email/'))
app.use(express.static(__dirname + '/dashboard/src'))
app.use(express.static(__dirname + '/dashboard/styles'))
app.use(express.static(__dirname + '/dashboard/servicos_numeros/styles'))
app.use(express.static(__dirname + '/dashboard/servicos_numeros/servicos_script/'))
app.use(express.static(__dirname + '/dashboard/servicos_numeros/'))



const authenticate = (req, res, next) => {
    if(!req.cookies['user_token']){
        return res.redirect('/login')
    }
    next()
}

const resetar_authenticate = (req, res, next) => {
    if(!req.cookies['cookie_cache']){
        return res.status(404).send('<h1>Página não encontrada</h1>')
    }
    else {
        if(!req.query.token){
            return res.status(404).send('<h1>Página não encontrada</h1>')
        }
        else {
            if(req.cookies['cookie_cache'] != req.query.token){
                return res.status(404).send('<h1>Página não encontrada</h1>')
            }
            else {
                next()
            }
        }
    }
}

// Rotas
router.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).sendFile(__dirname + '/' + 'inicio' + '/' + 'index.html')
})

router.get('/login', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).sendFile(__dirname + '/' + 'login' + '/' + 'index.html')
})

router.get('/cadastro', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).sendFile(__dirname + '/' + 'registro' + '/' + 'index.html')
})

router.get('/redefinir/senha', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).sendFile(__dirname + '/' + 'recuperar_conta' + '/' + 'index.html')
})

router.get('/resetar-senha', resetar_authenticate, (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).sendFile(__dirname + '/' + 'redefinir_senha' + '/' + 'index.html')
})

router.get('/dashboard',authenticate,(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return  res.status(200).sendFile(__dirname + '/' + 'dashboard' + '/' + 'index.html')
})

module.exports = router
const { app } = require('./express_static')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const nodemailer = require('nodemailer')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const axios = require('axios')
const cpfCheck = require('cpf-check')
const checkout = require('./mercado-pago/createCheckout.js')
const { obter_saldo, obter_numero, obter_lista_servicos, cancelar_ativacao, obter_quantidade_numeros, obterPrecoServico, obter_principais_paises } = require('./sms-activate-module/smsactivate')


// Componentes
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }))


//Login 
app.post('/login', async (req, res) => {
  res.set({ 'Content-Type': 'application/json' })
  var token = req.header('Authorization')
  if (token == process.env.SECRET_KEY) {
    const bodyEmail = req.body['email']
    const bodyPassword = req.body['password']
    const checkEmail = 'SELECT * FROM users WHERE email = ' + '"' + bodyEmail + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkEmail, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        if (results.length == 0) {
          conexao_db.end((err) => {
            if (err) {
              console.log('Erro ao fechar conexao: ' + err)
            }
            else {
              console.log('Conexao Fechada')
            }
          })
          return res.status(404).send('Usuario e Senha Invalídos')

        }
        else {
          const userdbpassword = results.find(item => item)
          bcrypt.compare(bodyPassword, userdbpassword.password, (err, sucess) => {
            if (err) {
              console.log('Bcrypt Compare ' + err.stack)
              conexao_db.end((err) => {
                if (err) {
                  console.log('Erro ao fechar conexao: ' + err)
                }
                else {
                  console.log('Conexao Fechada')
                }
              })
              return res.status(500)


            }
            else {
              if (sucess) {
                const payload = { data: bodyEmail }
                const user_token = jwt.sign(payload, process.env.SECRET_KEY)
                res.cookie('user_token', user_token, { httpOnly: false, maxAge: 21600 * 1000 })
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                    return
                  }
                  else {
                    console.log('Conexao Fechada')
                    return
                  }
                })

                return res.status(200).send('Usuario Logado Com Sucesso')

              }
              else {
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(404).send('Usuario e Senha Invalídos')



              }
            }
          })
        }
      }
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }

})
// Registro
app.post('/registro', async (req, res) => {
  res.set({ 'Content-Type': 'application/json' })
  var token = req.header('Authorization')
  const bodyUser = req.body['username']
  const bodyPassword = req.body['password']
  const bodyEmail = req.body['email']
  const bodyCPF = req.body['cpf']
  if (token == process.env.SECRET_KEY) {
    const checkUsername = 'SELECT * FROM users WHERE username = ' + '"' + bodyUser + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkUsername, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)

      }
      else {
        if (results.length == 0) {
          const checkEmail = 'SELECT * FROM users WHERE email = ' + '"' + bodyEmail + '"'
          conexao_db.query(checkEmail, (err, results) => {
            if (err) {
              console.log('Mysql ' + err.stack)
              conexao_db.end((err) => {
                if (err) {
                  console.log('Erro ao fechar conexao: ' + err)
                }
                else {
                  console.log('Conexao Fechada')
                }
              })
              return res.status(500)
            }
            else {
              if (results.length == 0) {
                const hashPassword = bcrypt.hash(bodyPassword, 10)
                hashPassword.then((hash) => {
                  const createUser = 'INSERT INTO users VALUES' + '(' + '"' + bodyUser + '"' + ',' + '"' + bodyEmail + '"' + ',' + '"' + hash + '"' + ',' + 'NULL' + ')'
                  conexao_db.query(createUser, (err, result) => {
                    if (err) {
                      console.log('Mysql ' + err.stack)
                      conexao_db.end((err) => {
                        if (err) {
                          console.log('Erro ao fechar conexao: ' + err)
                        }
                        else {
                          console.log('Conexao Fechada')
                        }
                      })
                      return res.status(500)
                    }
                    else {
                      const payload = { data: bodyEmail }
                      const user_token = jwt.sign(payload, process.env.SECRET_KEY)
                      const add_user_details = 'INSERT INTO users_details VALUES' + '(' + '"' + bodyUser + '"' + ',' + '"' + bodyEmail + '"' + ',' + 0 + ',' + 0 + ',' + '"' + 'Não Disponível' + '"' + ',' + 0 + ',' + 'null' + ',' + 0 + ',' + 0 + ',' + '"' + bodyCPF + '"' + ',' + 0.00 + ',' + 0.00 + ')'
                      conexao_db.query(add_user_details, (err, result) => {
                        if (err) {
                          console.log('Mysql ' + err.stack)
                          conexao_db.end((err) => {
                            if (err) {
                              console.log('Erro ao fechar conexao: ' + err)
                            }
                            else {
                              console.log('Conexao Fechada')
                            }
                          })
                          return res.status(500)
                        }
                        else {
                          res.cookie('user_token', user_token, { httpOnly: false, maxAge: 21600 * 1000 })
                          conexao_db.end((err) => {
                            if (err) {
                              console.log('Erro ao fechar conexao: ' + err)
                            }
                            else {
                              console.log('Conexao Fechada')
                            }
                          })
                          return res.status(200).send('Usuario Cadastrado Com Sucesso')

                        }
                      })
                    }
                  })
                })
                hashPassword.catch((err) => {
                  console.log('Hash ' + err.stack)
                  conexao_db.end((err) => {
                    if (err) {
                      console.log('Erro ao fechar conexao: ' + err)
                    }
                    else {
                      console.log('Conexao Fechada')
                    }
                  })
                  return res.status(500)
                })

              }
              else {
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(409).send('Email Cadastrado')
              }
            }
          })
        }
        else {
          conexao_db.end((err) => {
            if (err) {
              console.log('Erro ao fechar conexao: ' + err)
            }
            else {
              console.log('Conexao Fechada')
            }
          })
          return res.status(409).send('Usuario já cadastrado')
        }
      }
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})
// Recuperar Senha
app.post('/recuperar_senha', async (req, res) => {
  res.set({ 'Content-Type': 'application/json' })
  var token = req.header('Authorization')
  const bodyEmail = req.body['email']
  if (token == process.env.SECRET_KEY) {
    const password_token = uuid.v4()
    const checkEmail = 'SELECT * FROM users WHERE email = ' + '"' + bodyEmail + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkEmail, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        if (results.length == 0) {
          conexao_db.end((err) => {
            if (err) {
              console.log('Erro ao fechar conexao: ' + err)
            }
            else {
              console.log('Conexao Fechada')
            }
          })
          return res.status(404).send('Email não cadastrado')
        }
        else {
          const updatePasswordToken = 'UPDATE users SET password_token = ' + '"' + password_token + '"' + 'WHERE email = ' + '"' + bodyEmail + '"'
          conexao_db.query(updatePasswordToken, (err, results) => {
            if (err) {
              console.log('Mysql ' + err.stack)
              conexao_db.end((err) => {
                if (err) {
                  console.log('Erro ao fechar conexao: ' + err)
                }
                else {
                  console.log('Conexao Fechada')
                }
              })
              return res.status(500)
            }
            else {
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD
                }
              });

              const mailOptions = {
                from: 'RecebaSMS Recuperação' + '<' + process.env.EMAIL + '>',
                to: bodyEmail,
                subject: 'RecebaSMS.com - Redefinição de Senha',
                text: 'Olá! você solicitou a redefinição de senha ' + '\n' + 'Para redefinir, clique neste link: https://recebasms.com/resetar-senha?token=' + password_token
              };

              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                  conexao_db.end((err) => {
                    if (err) {
                      console.log('Erro ao fechar conexao: ' + err)
                    }
                    else {
                      console.log('Conexao Fechada')
                    }
                  })
                  return res.status(500)
                } else {
                  console.log('Email enviado: ' + info.response);
                  res.cookie('cookie_cache', password_token, { httpOnly: false, maxAge: 30 * 60 * 1000 })
                  conexao_db.end((err) => {
                    if (err) {
                      console.log('Erro ao fechar conexao: ' + err)
                    }
                    else {
                      console.log('Conexao Fechada')
                    }
                  })
                  return res.status(200).send('Email Enviado')
                }
              });
            }
          })
        }
      }
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Verificar Token
app.post('/verificar_token', async (req, res) => {
  res.set({ 'Content-Type': 'application/json' })
  var token = req.header('Authorization')
  const bodyToken = req.body['token']
  if (token == process.env.SECRET_KEY) {
    const checkToken = 'SELECT * FROM users WHERE password_token = ' + '"' + bodyToken + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkToken, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        if (results.length == 0) {
          conexao_db.end((err) => {
            if (err) {
              console.log('Erro ao fechar conexao: ' + err)
            }
            else {
              console.log('Conexao Fechada')
            }
          })
          return res.status(404).send('Token do Usuario Invalído')
        }
        else {
          conexao_db.end((err) => {
            if (err) {
              console.log('Erro ao fechar conexao: ' + err)
            }
            else {
              console.log('Conexao Fechada')
            }
          })
          return res.status(200).send('Token do Usuario Valído')
        }
      }
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Redefinir Senha
app.post('/redefinir_senha', async (req, res) => {
  res.set({ 'Content-Type': 'application/json' })
  var token = req.header('Authorization')
  const newbodyPassword = req.body['password']
  const bodyToken = req.body['token']
  if (token == process.env.SECRET_KEY) {
    const checkToken = 'SELECT * FROM users WHERE password_token = ' + '"' + bodyToken + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkToken, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        if (results.length == 0) {
          conexao_db.end((err) => {
            if (err) {
              console.log('Erro ao fechar conexao: ' + err)
            }
            else {
              console.log('Conexao Fechada')
            }
          })
          return res.status(404).send('Token Invalído')
        }
        else {
          const hashPassword = bcrypt.hash(newbodyPassword, 10)
          hashPassword.then((hash) => {
            const updatePassword = 'UPDATE users SET password = ' + '"' + hash + '"' + 'WHERE password_token = ' + '"' + bodyToken + '"'
            conexao_db.query(updatePassword, (err, results) => {
              if (err) {
                console.log('Mysql ' + err.stack)
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(500)
              }
              else {
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(200).send('Senha Redefinida Com Sucesso')
              }
            })
          })
          hashPassword.catch((err) => {
            console.log('Hash ' + err.stack)
            conexao_db.end((err) => {
              if (err) {
                console.log('Erro ao fechar conexao: ' + err)
              }
              else {
                console.log('Conexao Fechada')
              }
            })
            return res.status(500)
          })
        }
      }
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Visualizar detalhes do usuario
app.post('/detalhes_usuario', async (req, res) => {
  res.set({ 'Content-Type': 'application/json' })
  var token = req.header('Authorization')
  const bodyuserToken = req.body['user_token']
  if (token == process.env.SECRET_KEY) {
    const decoded = jwt.decode(bodyuserToken)
    const useremail = decoded.data
    const checkUser = 'SELECT * FROM users WHERE email = ' + '"' + useremail + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()
    conexao_db.query(checkUser, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        const checkUserDetails = 'SELECT * FROM users_details WHERE email = ' + '"' + useremail + '"'
        conexao_db.query(checkUserDetails, (err, result) => {
          if (err) {
            console.log('Mysql ' + err.stack)
            conexao_db.end((err) => {
              if (err) {
                console.log('Erro ao fechar conexao: ' + err)
              }
              else {
                console.log('Conexao Fechada')
              }
            })
            return res.status(500)
          }
          else {
            const user_details = result.find(item => item)
            const user = results.find(item => item)
            const user_data = {
              'creditos': user_details.creditos,
              'numero_virtual': user_details.numero_virtual,
              'sms_recebidos': user_details.sms_recebidos,
              'uso_creditos': user_details.uso_creditos,
              'conta': user_details.conta,
              'ativacao_preco': user_details.ativacao_preco,
              'ativacao_id': user_details.ativacao_id,
              'cpf': user_details.cpf,
              'email': user_details.email,
              'creditos_total': user_details.creditos_total,
              'id': user_details.id,
              'gastos_total': user_details.gastos_total
            }
            conexao_db.end((err) => {
              if (err) {
                console.log('Erro ao fechar conexao: ' + err)
              }
              else {
                console.log('Conexao Fechada')
              }
            })
            return res.status(200).send(JSON.stringify(user_data))
          }
        })
      }
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Identificar CPF
app.post('/identificar_cpf', (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  const bodyCPF = req.body['cpf']
  if (token == process.env.SECRET_KEY) {
    if (cpfCheck.validate(bodyCPF)) {
      res.status(200).send('CPF Valído')
      return
    }
    else {
      res.status(404).send('CPF Invalído')
      return
    }
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Alterar dados usuario no banco de dados

// Alterar Creditos
app.post('/alterar/creditos', async (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  const bodyuserToken = req.body['user_token']
  const bodyCreditos = parseFloat(req.body['creditos'])
  if (token == process.env.SECRET_KEY) {
    const decoded = jwt.decode(bodyuserToken)
    const useremail = decoded.data
    const checkUser = 'SELECT * FROM users WHERE email = ' + '"' + useremail + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkUser, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })

        return res.status(500)
      }
      else {
        const user_details = results.find(item => item)
        const checkUserDetails = 'SELECT * FROM users_details WHERE email = ' + '"' + useremail + '"'
        conexao_db.query(checkUserDetails, (err, result) => {
          if (err) {
            console.log('Mysql ' + err.stack)
            conexao_db.end((err) => {
              if (err) {
                console.log('Erro ao fechar conexao: ' + err)
              }
              else {
                console.log('Conexao Fechada')
              }
            })
            console.log(err)
            return res.status(500)
          }
          else {
            const user_details = result.find(item => item)
            const updateCreditos = 'UPDATE users_details SET creditos = ' + '"' + bodyCreditos + '"' + 'WHERE email = ' + '"' + useremail + '"'
            conexao_db.query(updateCreditos, (err, result) => {
              if (err) {
                console.log('Mysql ' + err.stack)
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })

                return res.status(500)
              }
              else {
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })

                return res.status(200).send('Creditos Alterados Com Sucesso')
              }
            })
          }
        })
      }
    })

  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Alterar Creditos Total
app.post('/alterar/creditos_total', async (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  const bodyuserToken = req.body['user_token']
  const bodyCreditos = parseFloat(req.body['creditos'])
  if (token == process.env.SECRET_KEY) {
    const decoded = jwt.decode(bodyuserToken)
    const useremail = decoded.data
    const checkUser = 'SELECT * FROM users WHERE email = ' + '"' + useremail + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkUser, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        const user_details = results.find(item => item)
        const checkUserDetails = 'SELECT * FROM users_details WHERE email = ' + '"' + useremail + '"'
        conexao_db.query(checkUserDetails, (err, result) => {
          if (err) {
            console.log('Mysql ' + err.stack)
            conexao_db.end((err) => {
              if (err) {
                console.log('Erro ao fechar conexao: ' + err)
              }
              else {
                console.log('Conexao Fechada')
              }
            })
            return res.status(500)
          }
          else {
            const user_details = result.find(item => item)
            const updateCreditos = 'UPDATE users_details SET creditos_total = ' + '"' + bodyCreditos + '"' + 'WHERE email = ' + '"' + useremail + '"'
            conexao_db.query(updateCreditos, (err, result) => {
              if (err) {
                console.log('Mysql ' + err.stack)
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(500)
              }
              else {
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(200).send('Creditos Total Alterados Com Sucesso')
              }
            })
          }
        })
      }
    })

  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Alterar Gasto Total

app.post('/alterar/gastos_total', async (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  const bodyuserToken = req.body['user_token']
  const bodyGastos = parseFloat(req.body['gastos'])
  if (token == process.env.SECRET_KEY) {
    const decoded = jwt.decode(bodyuserToken)
    const useremail = decoded.data
    const checkUser = 'SELECT * FROM users WHERE email = ' + '"' + useremail + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkUser, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        const user_details = results.find(item => item)
        const checkUserDetails = 'SELECT * FROM users_details WHERE email = ' + '"' + useremail + '"'
        conexao_db.query(checkUserDetails, (err, result) => {
          if (err) {
            console.log('Mysql ' + err.stack)
            conexao_db.end((err) => {
              if (err) {
                console.log('Erro ao fechar conexao: ' + err)
              }
              else {
                console.log('Conexao Fechada')
              }
            })
            return res.status(500)
          }
          else {
            const user_details = result.find(item => item)
            const updateGastos = 'UPDATE users_details SET gastos_total = ' + '"' + bodyGastos + '"' + 'WHERE email = ' + '"' + useremail + '"'
            conexao_db.query(updateGastos, (err, result) => {
              if (err) {
                console.log('Mysql ' + err.stack)
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(500)
              }
              else {
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(200).send('Gastos Alterados Com Sucesso')
              }
            })
          }
        })
      }
    })

  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Alterar Sms Recebidos
app.post('/alterar/sms_recebidos', async (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  const bodyuserToken = req.body['user_token']
  const bodySmsRecebidos = req.body['sms_recebidos']
  if (token == process.env.SECRET_KEY) {
    const decoded = jwt.decode(bodyuserToken)
    const useremail = decoded.data
    const checkUser = 'SELECT * FROM users WHERE email = ' + '"' + useremail + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkUser, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        const user_details = results.find(item => item)
        const checkUserDetails = 'SELECT * FROM users_details WHERE email = ' + '"' + useremail + '"'
        conexao_db.query(checkUserDetails, (err, result) => {
          if (err) {
            console.log('Mysql ' + err.stack)
            conexao_db.end((err) => {
              if (err) {
                console.log('Erro ao fechar conexao: ' + err)
              }
              else {
                console.log('Conexao Fechada')
              }
            })
            return res.status(500)
          }
          else {
            const user_details = result.find(item => item)
            const updateSmsRecebidos = 'UPDATE users_details SET sms_recebidos = ' + '"' + bodySmsRecebidos + '"' + 'WHERE email = ' + '"' + useremail + '"'
            conexao_db.query(updateSmsRecebidos, (err, result) => {
              if (err) {
                console.log('Mysql ' + err.stack)
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(500)
              }
              else {
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(200).send('Sms Recebidos Alterados Com Sucesso')
              }
            })
          }
        })
      }
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Alterar Uso Creditos
app.post('/alterar/uso_creditos', async (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  const bodyuserToken = req.body['user_token']
  const bodyUsoCreditos = req.body['uso_creditos']
  if (token == process.env.SECRET_KEY) {
    const decoded = jwt.decode(bodyuserToken)
    const useremail = decoded.data
    const checkUser = 'SELECT * FROM users WHERE email = ' + '"' + useremail + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkUser, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        const user_details = results.find(item => item)
        const checkUserDetails = 'SELECT * FROM users_details WHERE email = ' + '"' + useremail + '"'
        conexao_db.query(checkUserDetails, (err, result) => {
          if (err) {
            console.log('Mysql ' + err.stack)
            conexao_db.end((err) => {
              if (err) {
                console.log('Erro ao fechar conexao: ' + err)
              }
              else {
                console.log('Conexao Fechada')
              }
            })
            return res.status(500)
          }
          else {
            const user_details = result.find(item => item)
            const updateUsoCreditos = 'UPDATE users_details SET uso_creditos = ' + '"' + bodyUsoCreditos + '"' + 'WHERE email = ' + '"' + useremail + '"'
            conexao_db.query(updateUsoCreditos, (err, result) => {
              if (err) {
                console.log('Mysql ' + err.stack)
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(500)
              }
              else {
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(200).send('Uso Creditos Alterados Com Sucesso')
              }
            })
          }
        })
      }
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Alterar Plano da Conta
app.post('/alterar/conta', async (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  const bodyuserToken = req.body['user_token']
  const bodyConta = req.body['conta']
  if (token == process.env.SECRET_KEY) {
    const decoded = jwt.decode(bodyuserToken)
    const useremail = decoded.data
    const checkUser = 'SELECT * FROM users WHERE email = ' + '"' + useremail + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkUser, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        const user_details = results.find(item => item)
        const checkUserDetails = 'SELECT * FROM users_details WHERE email = ' + '"' + useremail + '"'
        conexao_db.query(checkUserDetails, (err, result) => {
          if (err) {
            console.log('Mysql ' + err.stack)
            conexao_db.end((err) => {
              if (err) {
                console.log('Erro ao fechar conexao: ' + err)
              }
              else {
                console.log('Conexao Fechada')
              }
            })
            return res.status(500)
          }
          else {
            const user_details = result.find(item => item)
            const updateConta = 'UPDATE users_details SET conta = ' + '"' + bodyConta + '"' + 'WHERE email = ' + '"' + useremail + '"'
            conexao_db.query(updateConta, (err, result) => {
              if (err) {
                console.log('Mysql ' + err.stack)
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(500)
              }
              else {
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(200).send('Plano da Conta Alterado Com Sucesso')
              }
            })
          }
        })
      }
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Alterar Numero Virtual
app.post('/alterar/numero_virtual', async (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  const bodyuserToken = req.body['user_token']
  const bodyNumeroVirtual = req.body['numero_virtual']
  if (token == process.env.SECRET_KEY) {
    const decoded = jwt.decode(bodyuserToken)
    const useremail = decoded.data
    const checkUser = 'SELECT * FROM users WHERE email = ' + '"' + useremail + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkUser, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        const user_details = results.find(item => item)
        const checkUserDetails = 'SELECT * FROM users_details WHERE email = ' + '"' + useremail + '"'
        conexao_db.query(checkUserDetails, (err, result) => {
          if (err) {
            console.log('Mysql ' + err.stack)
            conexao_db.end((err) => {
              if (err) {
                console.log('Erro ao fechar conexao: ' + err)
              }
              else {
                console.log('Conexao Fechada')
              }
            })
            return res.status(500)
          }
          else {
            const user_details = result.find(item => item)
            const updateNumeroVirtual = 'UPDATE users_details SET numero_virtual = ' + '"' + bodyNumeroVirtual + '"' + 'WHERE email = ' + '"' + useremail + '"'
            conexao_db.query(updateNumeroVirtual, (err, result) => {
              if (err) {
                console.log('Mysql ' + err.stack)
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(500)
              }
              else {
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(200).send('Numero Virtual Alterado Com Sucesso')
              }
            })
          }
        })
      }
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Alterar Ativacao Preco
app.post('/alterar/ativacao_preco', async (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  const bodyuserToken = req.body['user_token']
  const bodyAtivacaoPreco = req.body['ativacao_preco']
  if (token == process.env.SECRET_KEY) {
    const decoded = jwt.decode(bodyuserToken)
    const useremail = decoded.data
    const checkUser = 'SELECT * FROM users WHERE email = ' + '"' + useremail + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkUser, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        const user_details = results.find(item => item)
        const checkUserDetails = 'SELECT * FROM users_details WHERE email = ' + '"' + useremail + '"'
        conexao_db.query(checkUserDetails, (err, result) => {
          if (err) {
            console.log('Mysql ' + err.stack)
            conexao_db.end((err) => {
              if (err) {
                console.log('Erro ao fechar conexao: ' + err)
              }
              else {
                console.log('Conexao Fechada')
              }
            })
            return res.status(500)
          }
          else {
            const user_details = result.find(item => item)
            const updateAtivacaoPreco = 'UPDATE users_details SET ativacao_preco = ' + '"' + bodyAtivacaoPreco + '"' + 'WHERE email = ' + '"' + useremail + '"'
            conexao_db.query(updateAtivacaoPreco, (err, result) => {
              if (err) {
                console.log('Mysql ' + err.stack)
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(500)
              }
              else {
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(200).send('Preço de Ativação Alterado Com Sucesso')
              }
            })
          }
        })
      }
    })


  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Alterar Ativacao id
app.post('/alterar/ativacao_id', async (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  const bodyuserToken = req.body['user_token']
  const bodyAtivacaoId = req.body['ativacao_id']
  if (token == process.env.SECRET_KEY) {
    const decoded = jwt.decode(bodyuserToken)
    const useremail = decoded.data
    const checkUser = 'SELECT * FROM users WHERE email = ' + '"' + useremail + '"'
    const createConnection = require('./db/conexao_db')
    const conexao_db = createConnection()

    conexao_db.query(checkUser, (err, results) => {
      if (err) {
        console.log('Mysql ' + err.stack)
        conexao_db.end((err) => {
          if (err) {
            console.log('Erro ao fechar conexao: ' + err)
          }
          else {
            console.log('Conexao Fechada')
          }
        })
        return res.status(500)
      }
      else {
        const user_details = results.find(item => item)
        const checkUserDetails = 'SELECT * FROM users_details WHERE email = ' + '"' + useremail + '"'
        conexao_db.query(checkUserDetails, (err, result) => {
          if (err) {
            console.log('Mysql ' + err.stack)
            conexao_db.end((err) => {
              if (err) {
                console.log('Erro ao fechar conexao: ' + err)
              }
              else {
                console.log('Conexao Fechada')
              }
            })
            return res.status(500)
          }
          else {
            const user_details = result.find(item => item)
            const updateAtivacaoId = 'UPDATE users_details SET ativacao_id = ' + '"' + bodyAtivacaoId + '"' + 'WHERE email = ' + '"' + useremail + '"'
            conexao_db.query(updateAtivacaoId, (err, result) => {
              if (err) {
                console.log('Mysql ' + err.stack)
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(500)
              }
              else {
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
                return res.status(200).send('Id de Ativação Alterado Com Sucesso')
              }
            })
          }
        })
      }
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Sms Activate 

// Obter Melhores Paises para Serviço
app.post('/sms-activate/getTopCountriesByService', (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  if (token == process.env.SECRET_KEY) {
    const service = req.body['service']
    obter_principais_paises(service)
      .then(data => {
        if (data != false) {
          return res.status(200).send(data)
        }
        else {
          return res.status(500).send({ 'Erro': 'Erro ao obter principais países' })
        }
      })
      .catch(err => {
        return res.status(500).send({ 'Erro': 'Erro ao obter principais países' })
      })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Obter Saldo
app.get('/sms-activate/getBalance', (req, res) => {
  var token = req.header('Authorization')
  if (token == process.env.SECRET_KEY) {
    const saldo = obter_saldo()
    saldo.then((saldo) => {
      res.status(200).send({
        'saldo': saldo
      })
      return
    })
    saldo.catch((err) => {
      console.log(err)
      res.status(500).send('Erro ao obter saldo, Tente novamente mais tarde')
      return
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Obter Lista de Serviços
app.get('/sms-activate/getServices', (req, res) => {
  var token = req.header('Authorization')
  if (token == process.env.SECRET_KEY) {
    const lista_servicos = obter_lista_servicos()
    lista_servicos.then((lista_servicos) => {
      res.status(200).send(lista_servicos)
      return
    })
    lista_servicos.catch((err) => {
      console.log(err)
      res.status(500).send('Erro ao obter lista de serviços, Tente novamente mais tarde')
      return
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Obter Numero
app.post('/sms-activate/getNumber', (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  if (token == process.env.SECRET_KEY) {
    const service = req.body['service']
    const country = req.body['country']
    const operator = req.body['operator']
    const number = obter_numero(service, country, operator)
    number.then((data) => {
      if (data == 'Erro ao obter número nessa operadora') {
        res.status(404).send({
          'activationCost': '',
          'phoneNumber': 'Operadora indisponível para criação do numero',
          'activationId': ''
        })
        return
      }

      else {
        res.status(200).send(JSON.stringify(data))
        return
      }

    })
    number.catch((err) => {
      console.log(err)
      res.status(500).send('Erro ao obter numero, Tente novamente mais tarde')
      return
    })


  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Obter Operadoras
app.post('/sms-activate/getOperators', (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  if (token == process.env.SECRET_KEY) {
    var country = req.body['country']
    axios.get('https://api.sms-activate.org/stubs/handler_api.php?api_key=' + process.env.SMS_ACTIVATE_KEY + '&action=getCountries')
      .then(response => {
        const data_json = response.data
        let foundId;
        const country_code = Object.values(data_json).forEach(item => {
          if (item.eng == country) {
            foundId = item.id
          }
        })
        if (foundId) {
          axios.get('https://api.sms-activate.org/stubs/handler_api.php?api_key=' + process.env.SMS_ACTIVATE_KEY + '&action=getOperators&country=' + foundId)
            .then((response) => {
              const data = response.data
              res.status(200).send({ "countryOperators": data['countryOperators'][foundId.toString()] })
            })
        }
      })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Consultar Numeros Disponiveis
app.post('/sms-activate/available_numbers', (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  if (token == process.env.SECRET_KEY) {
    const country = req.body['country']
    const operator = req.body['operator']
    const service = req.body['service']
    const quantidade_numeros = obter_quantidade_numeros(country, operator, service)
    quantidade_numeros.then((data) => {
      console.log(data)
      if (data != false) {
        return res.status(200).send(data)
      }
      else {
        return res.status(500).send('Erro ao obter quantidade de números')
      }
    })
      .catch((err) => {
        console.log(err)
        return res.status(500).send('Erro ao obter quantidade de números')
      })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Cancelar Ativação
app.post('/sms-activate/setStatus', (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  if (token == process.env.SECRET_KEY) {
    const activation_id = req.body['id']
    const activation_status = req.body['status']
    const cancelar = cancelar_ativacao(activation_id, activation_status)
    cancelar.then((data) => {
      res.status(200).send(JSON.stringify(data))
      return
    })
    cancelar.catch((err) => {
      res.status(500).send('Erro ao cancelar ativação, Tente novamente mais tarde')
      return
    })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Obter SMS 
app.post('/sms-activate/getSMS', (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  if (token == process.env.SECRET_KEY) {
    const activation_id = req.body['activation_id']
    axios.get('https://api.sms-activate.org/stubs/handler_api.php?api_key=' + process.env.SMS_ACTIVATE_KEY + '&action=getStatus&id=' + activation_id)
      .then(response => {
        return res.status(200).send(response.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Obter Precos do servicos
app.post('/sms-activate/getServicePrice', (req, res) => {
  var token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  if (token == process.env.SECRET_KEY) {
    const country = req.body['country']
    const service = req.body['service']
    const obter_preco_servico = obterPrecoServico(country, service)
    obter_preco_servico.then((data) => {
      function converterRubloParaReal(valorRublo) {
        var taxaCambio = 0.0590;
        var valorReal = valorRublo * taxaCambio
        return valorReal.toFixed(2)
      }
      var valorReal = converterRubloParaReal(data)
      if (service == 'Telegram' || service == 'Whatsapp') {
        var acrescimo = parseFloat(valorReal) + (parseFloat(valorReal) * 50 / 100)
      }
      else {
        var acrescimo = parseFloat(valorReal) + (parseFloat(valorReal) * 100 / 100)
      }
      res.status(200).send(acrescimo.toFixed(2) + ' Créditos')
    })
      .catch((err) => {
        res.status(500).send('Erro ao obter preço dos serviços')
        console.log(err)
      })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})

// Mercado Pago 

app.post('/mercadopago/checkout', (req, res) => {
  const token = req.header('Authorization')
  res.set({ 'Content-Type': 'application/json' })
  if (token == process.env.SECRET_KEY) {
    const title_produto = req.body['title_produto']
    const unit_price = req.body['unit_price']
    const external_reference_id = req.body['external_reference']
    checkout(title_produto, unit_price, external_reference_id)
      .then((data) => {
        return res.status(200).send(data)
      })
      .catch((err) => {
        return res.status(500).send(err)
      })
  }
  else {
    return res.status(401).send({ 'Erro': 'Token Invalído' })
  }
})


app.post('/mercadopago/webhook', async (req, res) => {
  const payload = req.body
  if (payload.type == 'payment' && payload.action == 'payment.updated') {
    await res.status(200).send('OK')

    axios.get('https://api.mercadopago.com/v1/payments/' + parseInt(payload.data.id), {
      headers: {
        'Authorization': 'Bearer ' + process.env.MP_SECRET_KEY
      }
    })
      .then(response => {
        const data = response.data
        if (data.status == 'approved') {
          if (data.description == "Plano Promocional") {
            const update_account = 'SELECT * FROM users_details WHERE email = ' + '"' + data.external_reference + '"'
            const createConnection = require('./db/conexao_db')
            const conexao_db = createConnection()
            conexao_db.query(update_account, (err, results) => {
              if (err) {
                console.log('Mysql ' + err.stack)
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
              }
              else {
                if (results.length == 0) {
                  conexao_db.end((err) => {
                    if (err) {
                      console.log('Erro ao fechar conexao: ' + err)
                    }
                    else {
                      console.log('Conexao Fechada')
                    }
                  })

                }
                else {
                  const info = results.find(item => item)
                  const creditos = parseFloat(info.creditos) + parseFloat(200.00)
                  const add_details = 'UPDATE users_details SET creditos = ' + parseFloat(creditos) + ', sms_recebidos = ' + 0.00 + ', uso_creditos = ' + 0.00 + ', conta = ' + '"' + 'Promocional' + '"' + ', creditos_total = ' + 0.00 + ', gastos_total = ' + 0.00 + ' WHERE email = ' + '"' + data.external_reference + '"'
                  conexao_db.query(add_details, (err, results) => {
                    if (err) {
                      console.log('Mysql ' + err.stack)
                      conexao_db.end((err) => {
                        if (err) {
                          console.log('Erro ao fechar conexao: ' + err)
                        }
                        else {
                          console.log('Conexao Fechada')
                        }
                      })
                    }
                    else {
                      conexao_db.end((err) => {
                        if (err) {
                          console.log('Erro ao fechar conexao: ' + err)
                        }
                        else {
                          console.log('Conexao Fechada')
                        }
                      })
                      console.log('Alteração de conta concluida')
                    }
                  })

                }
              }
            })
          }
          else {
            const update_account = 'SELECT * FROM users_details WHERE email = ' + '"' + data.external_reference + '"'
            const createConnection = require('./db/conexao_db')
            const conexao_db = createConnection()
            conexao_db.query(update_account, (err, results) => {
              if (err) {
                console.log('Mysql ' + err.stack)
                conexao_db.end((err) => {
                  if (err) {
                    console.log('Erro ao fechar conexao: ' + err)
                  }
                  else {
                    console.log('Conexao Fechada')
                  }
                })
              }
              else {
                if (results.length == 0) {
                  conexao_db.end((err) => {
                    if (err) {
                      console.log('Erro ao fechar conexao: ' + err)
                    }
                    else {
                      console.log('Conexao Fechada')
                    }
                  })

                }
                else {
                  const info = results.find(item => item)
                  const creditos = parseFloat(info.creditos) + parseFloat(data.description.replace('Créditos','').trim())
                  const add_details = 'UPDATE users_details SET creditos = ' + parseFloat(creditos) + ', sms_recebidos = ' + 0.00 + ', uso_creditos = ' + 0.00 + ', conta = ' + '"' + 'Crédito' + '"' + ', creditos_total = ' + 0.00 + ', gastos_total = ' + 0.00 + ' WHERE email = ' + '"' + data.external_reference + '"'
                  conexao_db.query(add_details, (err, results) => {
                    if (err) {
                      console.log('Mysql ' + err.stack)
                      conexao_db.end((err) => {
                        if (err) {
                          console.log('Erro ao fechar conexao: ' + err)
                        }
                        else {
                          console.log('Conexao Fechada')
                        }
                      })
                    }
                    else {
                      conexao_db.end((err) => {
                        if (err) {
                          console.log('Erro ao fechar conexao: ' + err)
                        }
                        else {
                          console.log('Conexao Fechada')
                        }
                      })
                      console.log('Alteração de conta concluida')
                    }
                  })

                }
              }
            })
          }
        
      }
      })
  }
  else {
    res.status(200).send('OK')
  }
})

const routes = require('./routes/router')
app.use('/', routes)
// Executar A API
app.listen()

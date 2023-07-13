const senha = document.querySelector('.redefinicao-container-info .redefinir_senha input[name="Senha"]')
const confirmarSenha = document.querySelector('.redefinicao-container-info .redefinir_senha input[name="confirme_senha"]')
const redefinir_botao = document.querySelector('.redefinicao-container-info .redefinir_senha button')

function verficar_input(){
    if(senha.value == "" || confirmarSenha.value == ""){
        swal({
            title: "Erro!",
            text: "Preencha todos os campos!",
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false
        })

        return swal
    }
    else {
        if(senha.value != confirmarSenha.value){
            swal({
                title: "Erro!",
                text: "As senhas não coincidem!",
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false
            })

            return swal
        }

        else {
            if(senha.value.length < 8 && confirmarSenha.value.length < 8){
                swal({
                    title: "Erro!",
                    text: "A senha deve ter no mínimo 8 caracteres!",
                    icon: "error",
                    button: "Ok",
                    closeOnClickOutside: false
                })
    
                return swal
            }

            else {
                return true
            }
        }
    }
}

function removerCookie(nome){
    document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
}

redefinir_botao.addEventListener('click', () => {
    if(verficar_input() == true){
        fetch('/redefinir_senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
            },
            body: JSON.stringify({
                'password': senha.value,
                'token': window.location.href.split('?')[1].split('=')[1]
            })
        })
        .then(res => res.text())
        .then(data => {
            if(data == 'Senha Redefinida Com Sucesso'){
                swal({
                    title: "Sucesso!",
                    text: data,
                    icon: "success",
                    button: "Ok",
                    closeOnClickOutside: false
                })
                .then(async () => {
                    await removerCookie('cookie_cache')
                    window.location.href = '/login'
                    
                })
            }
            else {
                swal({
                    title: "Erro!",
                    text: data,
                    icon: "error",
                    button: "Ok",
                    closeOnClickOutside: false
                })
            }
        })
        .catch(err => {
            console.log(err)
            swal({
                title: "Erro!", 
                text: "Ocorreu um erro ao redefinir a senha!",
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false
            })
        })
        

    }
})
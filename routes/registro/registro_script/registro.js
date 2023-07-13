const submit_button = document.querySelector('.registro-container-info .registro-form button');
const username = document.querySelector('.registro-container-info .registro-form input[name="username"]');
const email = document.querySelector('.registro-container-info .registro-form input[name="email"]');
const password = document.querySelector('.registro-container-info .registro-form input[name="senha"]');
const password_confirm = document.querySelector('.registro-container-info .registro-form input[name="confirmacao_de_senha"]');

function validar_email(user_email){
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(user_email);
}

function verificar_input(){
    if(username.value == "" || email.value == "" || password.value == "" || password_confirm.value == ""){
        swal({
            title: "Erro!",
            text: "Preencha todos os campos!",
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false
        })
        return swal;
    }
    else {
        if(password.value != password_confirm.value){
            swal({
                title: "Erro!",
                text: "As senhas não coincidem!",
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false
            })
            return swal;
        }

        else {
            if(password.value.length < 8){
                swal({
                    title: "Erro!",
                    text: "A senha deve conter no mínimo 8 caracteres!",
                    icon: "error",
                    button: "Ok",
                    closeOnClickOutside: false
                })
                return swal;
            }

            else {
                if(validar_email(email.value) == false){
                    swal({
                        title: "Erro!",
                        text: "Email inválido!",
                        icon: "error",
                        button: "Ok",
                        closeOnClickOutside: false
                    })
                    return swal;
                }
                return true;
            }
        }

    }
}

submit_button.addEventListener('click', () => {
    if(verificar_input() == true){
        var data = {
            username: username.value.toString(),
            email: email.value.toString(),
            password: password.value.toString(),
            cpf: "37425973294"
        }
        fetch('/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(api_data => {
            if(api_data == 'Usuario Cadastrado Com Sucesso'){
                window.location.href = "/dashboard";
            }
            else{
                swal({
                    title: "Erro!",
                    text: api_data,
                    icon: "error",
                    button: "Ok",
                    closeOnClickOutside: false
                })
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
           
})
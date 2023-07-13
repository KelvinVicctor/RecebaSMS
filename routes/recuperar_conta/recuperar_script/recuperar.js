const button_redefinir = document.querySelector('.recuperacao-container-info .recuperar_senha button');
const input_email = document.querySelector('.recuperacao-container-info .recuperar_senha input');

function validar_email(user_email){
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(user_email);
}

function verficar_input(){
    if(input_email.value == ''){
        swal({
            title: "Campo vazio!",
            text: "Por favor, preencha o campo de email!",
            icon: "warning",
            button: "Ok",
            closeOnClickOutside: false
        })
        return swal
    }

    else {
        if(validar_email(input_email.value) == false){
            swal({
                title: "Erro!",
                text: "Digite um email válido!",
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false
            })
            return swal;
        }
        return true;
    }
    
}

button_redefinir.addEventListener('click', () => {
    if(verficar_input() == true){
        fetch('/recuperar_senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'

            },
            body: JSON.stringify({
                email: input_email.value.toString()
            })
        })
        .then(response => response.text())
        .then(data => {
            if(data == 'Email não cadastrado'){
                swal({
                    title: "Erro!",
                    text: "Email não cadastrado!",
                    icon: "error",
                    button: "Ok",
                    closeOnClickOutside: false
                })
            }
            else if (data == 'Email Enviado'){
                swal({
                    title: "Sucesso!",
                    text: "Email enviado com sucesso!",
                    icon: "success",
                    button: "Ok",
                    closeOnClickOutside: false
                })
            }
        })
        .catch(err => console.log(err))
    }
})
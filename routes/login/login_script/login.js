const submit = document.querySelector('.form-login button');
const email = document.querySelector('.form-login input[name="email"]');
const password = document.querySelector('.form-login input[name="senha"]');

function verificar_input(){
    if(email.value == "" || password.value == ""){
        swal({
            title: "Erro!",
            text: "Preencha todos os campos!",
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false
        })
        return swal;
    }
    return true
}

submit.addEventListener('click', () => {
    if(verificar_input() == true){
        var data = {
            email: email.value.toString(),
            password: password.value.toString()
        }
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTU0NDczMCwiaWF0IjoxNjg1NTQ0NzMwfQ.vwaBZLxdHttu2vxdYBkzX91fW63AIDdstmd8yseCMFo'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(api_data => {
            if(api_data == 'Usuario Logado Com Sucesso'){
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
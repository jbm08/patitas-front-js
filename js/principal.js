
window.addEventListener('load', function () {

    //enviamos mensaje
    const msgSuccess = this.document.getElementById('mensaje');

    //obtenemos info en del localhost
    const result = JSON.parse(this.localStorage.getItem('result'));

    mostrarAlerta(result.nombreUsuario, msgSuccess)
    const btnCerrar = this.document.getElementById('btnCerrarSesion');

    btnCerrar.addEventListener('click', function () {
        //console.log(result);
        cerrarSesion(result.correoUsuario, msgSuccess)
    })
})

function mostrarAlerta(mensaje, msg) {
    msg.innerHTML = mensaje;
    msg.style.display = 'block';
}

function ocultarAlerta(msg) {
    msg.innerHTML = '';
    msg.style.display = 'none';
}

async function cerrarSesion(email, msg) {
    mostrarAlerta("Cerrando sesión...", msg)
    const url = 'http://localhost:8083/login/logout-async';
    const data = {
        email: email
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            mostrarAlerta('Error! Problema al cerrar sesion');
            throw new Error(`Error: ${response.statusText}`)
        }

        const result = await response.json();
        console.log('Respuesta del server', result);

        if (result.codigo == '00') {
            localStorage.removeItem('result');
            window.location.replace('index.html');
        } else {
            mostrarAlerta(result.mensaje, msg);
        }

    } catch (error) {
        console.error('Error: Problema en el servicio', error)
        mostrarAlerta('Error: Problema en el servicio', msg)
    }

    async function cerrarSesionEF(tipoDocumento, numeroDocumento, msg) {
        mostrarAlerta("Cerrando sesión...", msg);
        const url = 'http://localhost:8082/login/logout_ef';
    
        const data = {
            tipoDocumento,
            numeroDocumento
        };
    
        try {
            const response = await realizarPeticion(url, data);
            manejarRespuesta(response, msg);
        } catch (error) {
            console.error('Error: Problema en el servicio', error);
            mostrarAlerta('Error: Problema en el servicio', msg);
        }
    }
    
    async function realizarPeticion(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    
        if (!response.ok) {
            mostrarAlerta('Error: Problema al cerrar sesión de usuario');
            throw new Error(`Error: ${response.statusText}`);
        }
    
        return response.json();
    }
    
    function manejarRespuesta(result, msg) {
        console.log('Respuesta del servidor', result);
    
        if (result.codigo === '00') {
            localStorage.removeItem('result');
            localStorage.removeItem('tipodocumento');
            localStorage.removeItem('numerodocumento');
            window.location.replace('index.html');
        } else {
            console.error('Error: Problema en el servidor');
            mostrarAlerta("Error: Problema en el servidor", msg);
        }
    }
}


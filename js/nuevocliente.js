import { agregarCliente} from './basededatos.js'
import { actualizarContador} from './tablaDeClientes.js'

let clienteOBJ = {
    nombre: "",
    email: "",
    telefono: "",
    empresa: ""
}

document.addEventListener("DOMContentLoaded", () => {

    const inputNombre = document.querySelector("#nombre")
    const inputCorreo = document.querySelector("#email")
    const inputTelefono = document.querySelector("#telefono")
    const inputEmpresa = document.querySelector("#empresa")
    const formulario = document.querySelector("#formulario")
    const btnSubmit = document.querySelector('#formulario button[type = "submit"]')
    const spinner = document.querySelector("#spinner")

    btnSubmit.disabled = true
    btnSubmit.classList.add("opacity-50")

    // Obtén la cantidad actual de clientes almacenada en sessionStorage
    const cantidadClientesActual = sessionStorage.getItem('cantidadClientes') || 0;

    btnSubmit.addEventListener("click", () => {
        agregarClienteDB()

        // Actualiza la cantidad sumando 1
        const nuevaCantidadClientes = parseInt(cantidadClientesActual) + 1;

        actualizarContador(nuevaCantidadClientes);

        // Guarda la nueva cantidad en sessionStorage
        sessionStorage.setItem('cantidadClientes', nuevaCantidadClientes);

        window.location.href = 'index.html'
    })

    inputNombre.addEventListener("focus", resaltarCampoActivo)
    inputCorreo.addEventListener("focus", resaltarCampoActivo)
    inputTelefono.addEventListener("focus", resaltarCampoActivo)
    inputEmpresa.addEventListener("focus", resaltarCampoActivo)

    inputNombre.addEventListener("input", (e) => {
        quitarResaltadoCampo(e)
        validar(e)
    })

    inputCorreo.addEventListener("input", (e) => {
        quitarResaltadoCampo(e)
        validar(e)
    })

    inputTelefono.addEventListener("input", (e) => {
        quitarResaltadoCampo(e)
        validar(e)
    })

    inputEmpresa.addEventListener("input", (e) => {
        quitarResaltadoCampo(e)
        validar(e)
    })

    formulario.addEventListener("submit", activarSpinner)

    function agregarClienteDB() {
        const id = generarIdUnico()
    
        if (clienteOBJ.nombre !== "" && clienteOBJ.email !== "" && clienteOBJ.telefono !== "" && clienteOBJ.empresa !== "") {
            // Realiza una copia del objeto clienteOBJ con un id único
            let copiaClienteOBJ = { ...clienteOBJ, id }
    
            agregarCliente(copiaClienteOBJ)
    
            clienteOBJ.nombre = ""
            clienteOBJ.email = ""
            clienteOBJ.telefono = ""
            clienteOBJ.empresa = ""
            formulario.reset()
            comprobarFormulario()
    
            console.log("Añadiendo cliente a la base de datos:", copiaClienteOBJ)
        } else {
            console.error("No se pueden añadir clientes con campos vacíos.")
        }
    }
    
    function generarIdUnico() {
        const timestamp = Date.now()
        const numeroAleatorio = Math.floor(Math.random() * 10000)
        return `${timestamp}-${numeroAleatorio}`
    }

    function resaltarCampoActivo(e) {
        e.target.style.borderColor = "#3498db"
        e.target.style.boxShadow = "0 0 10px rgba(52, 152, 219, 0.7)"
    }

    function quitarResaltadoCampo(e) {
        e.target.style.borderColor = ""
        e.target.style.boxShadow = ""
    }

    // Función para activar el spinner e imitar un envío de formulario
    function activarSpinner(e) {
        e.preventDefault()
        spinner.classList.remove("hidden")
        spinner.classList.add("flex")

        setTimeout(() => {
            spinner.classList.add("hidden")
            spinner.classList.remove("flex")
            resetForm()

            // Diseñar y mostrar una alerta de éxito
            const alerta = document.createElement("p")
            alerta.classList.add("bg-green-500", "text-white", "text-center",
            "rounded-lg", "mt-10", "text-sm")
            alerta.textContent = "El mensaje se ha mandado con éxito"
            formulario.appendChild(alerta)

            setTimeout(() => {
                alerta.remove()
            }, 3000)

        }, 3000)

    }

    function resetForm() {
        clienteOBJ.nombre = ""
        clienteOBJ.email = ""
        clienteOBJ.telefono = ""
        clienteOBJ.empresa = ""
        formulario.reset()
        comprobarFormulario()
    }

    function validar(e) {
        if (e.target.value.trim() === "") {
            mostrarAlerta(`el campo ${e.target.id} es obligatorio`, e.target.parentElement)
            clienteOBJ[e.target.name] = ""
            comprobarFormulario()
            return 
        }
        if (e.target.id === "email" && !validarEmail(e.target.value)) {
            mostrarAlerta("El email no es válido", e.target.parentElement)
            clienteOBJ[e.target.name] = ""
            comprobarFormulario() 
            return 
        }
        if (e.target.id === "telefono" && !validarTelefono(e.target.value)) {
            mostrarAlerta("El teléfono no es válido", e.target.parentElement)
            clienteOBJ[e.target.name] = ""
            comprobarFormulario() 
            return 
        }
        if (e.target.id === "nombre" && !validarNombre(e.target.value)) {
            mostrarAlerta("El nombre no es válido", e.target.parentElement)
            clienteOBJ[e.target.name] = ""
            comprobarFormulario() 
            return 
        }
        if (e.target.id === "empresa" && !validarEmpresa(e.target.value)) {
            mostrarAlerta("La empresa cliente no es válida", e.target.parentElement)
            clienteOBJ[e.target.name] = ""
            comprobarFormulario() 
            return 
        }

        limpiarAlerta(e.target.parentElement)

        // Capitalizar y asignar el valor al objeto clienteOBJ
        clienteOBJ[e.target.name] = capitalizarNombreCompleto(e.target.value.trim())
        comprobarFormulario(clienteOBJ)        
    }

    function capitalizarNombreCompleto(nombreCompleto) {
        const palabras = nombreCompleto.split(' ')
        const nombreCapitalizado = palabras.map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)).join(' ')
        return nombreCapitalizado
    }

    // Función donde se verifica si el formulario está completo
    function comprobarFormulario() {
        const values = Object.values(clienteOBJ)

        const campoVacio = values.includes("")
        const formularioValido = values.every(value => value !== "")

        if (campoVacio || !formularioValido) {
            // Se deshabilita el botón de envío si el formulario no es válido
            btnSubmit.classList.add("opacity-50")
            btnSubmit.disabled = true
        } else {
            // Se habilita el botón de envío si el formulario es válido
            btnSubmit.classList.remove("opacity-50")
            btnSubmit.disabled = false
        }
    }

    function limpiarAlerta(referencia) {
        const alerta = referencia.querySelector(".bg-red-600")
        if (alerta) {
            alerta.remove()
        }
    }

    function mostrarAlerta(mensaje, referencia) {

        limpiarAlerta(referencia)
        const error = document.createElement("p")
        error.textContent = mensaje
        error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
        referencia.appendChild(error)
    }

    function validarEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        return regex.test(email)
    }

    function validarTelefono(telefono) {
        const regex = /^[0-9]{9}$/
        return regex.test(telefono)
    }

    function validarNombre(nombre) {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s']+$/
        const longitudMinima = 2
        const longitudMaxima = 50

        if (nombre.length < longitudMinima || nombre.length > longitudMaxima) {
            return false
        }

        return regex.test(nombre)
    }

    function validarEmpresa(empresa) {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s']+$/
        const longitudMinima = 2
        const longitudMaxima = 120

        if (empresa.length < longitudMinima || empresa.length > longitudMaxima) {
            return false
        }

        return regex.test(empresa)
    }
})

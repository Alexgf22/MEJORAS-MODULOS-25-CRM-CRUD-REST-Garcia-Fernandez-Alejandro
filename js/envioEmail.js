
document.addEventListener("DOMContentLoaded", () => {

    let historialDiv = document.querySelector("#historial")
    if (!historialDiv) {
        historialDiv = document.createElement("div")
        historialDiv.id = "historial"
        document.body.appendChild(historialDiv)
    }

    const emailOBJ = {
        email: "",
        asunto: "",
        mensaje: ""
    }

    cargarHistorial(emailOBJ)

    const inputEmail = document.querySelector("#email")
    const inputAsunto = document.querySelector("#asunto")
    const inputMensaje = document.querySelector("#mensaje")
    const formulario = document.querySelector("#formulario")
    const btnSubmit = document.querySelector('#formulario button[type="submit"]')
    const btnReset = document.querySelector('#formulario button[type="reset"]')
    const spinner = document.querySelector("#spinner")

    const params = new URLSearchParams(window.location.search)
    const clienteEmail = params.get('email')

    if (inputEmail && clienteEmail !== null && clienteEmail !== undefined) {
        inputEmail.value = decodeURIComponent(clienteEmail)
        emailOBJ.email = decodeURIComponent(clienteEmail)
        console.log("Email establecido:", inputEmail.value)
    }

    inputEmail.addEventListener("input", validar)
    inputAsunto.addEventListener("input", validar)
    inputMensaje.addEventListener("input", validar)
    formulario.addEventListener("submit", activarSpinner)
    btnReset.addEventListener("click", (e) => {
        e.preventDefault()
        resetForm()
    })

    function activarSpinner(e) {
        e.preventDefault()
        spinner.classList.remove("hidden")
        spinner.classList.add("flex")

        setTimeout(() => {
            spinner.classList.add("hidden")
            spinner.classList.remove("flex")

            if (emailOBJ.email && emailOBJ.asunto && emailOBJ.mensaje) {
                const mensaje = `<strong>Email:</strong> ${emailOBJ.email} - <strong>Asunto:</strong> ${emailOBJ.asunto} - <strong>Mensaje:</strong> ${emailOBJ.mensaje}`
                agregarAlHistorial(mensaje)
            }

            resetForm()

            const alerta = document.createElement("p")
            alerta.classList.add("bg-green-500", "text-white", "text-center", "rounded-lg", "mt-10", "text-sm")
            alerta.textContent = "El mensaje se ha mandado con éxito"
            formulario.appendChild(alerta)

            setTimeout(() => {
                alerta.remove()
            }, 3000)
        }, 3000)
    }

    function cargarHistorial(emailOBJ) {
        const historialDiv = document.querySelector("#historial")

        if (historialDiv) {
            const historial = JSON.parse(localStorage.getItem("historial")) || []

            historialDiv.innerHTML = '<h1 style="font-size: 24px;">Historial de Mensajes</h1>'

            historial.forEach((entrada) => {
                const entradaHistorial = document.createElement("p")
                entradaHistorial.innerHTML = entrada
                historialDiv.appendChild(entradaHistorial)
            })

            // Agregar la última entrada al historial si hay un mensaje actual
            if (emailOBJ.email && emailOBJ.asunto && emailOBJ.mensaje) {
                const mensaje = `<strong>Email:</strong> ${emailOBJ.email} - <strong>Asunto:</strong> ${emailOBJ.asunto} - <strong>Mensaje:</strong> ${emailOBJ.mensaje}`
                agregarAlHistorial(mensaje)
            }
        }
    }

    function agregarAlHistorial(entrada) {
        const historialDiv = document.querySelector("#historial")
        if (historialDiv) {
            const entradaHistorial = document.createElement("p")
            entradaHistorial.innerHTML = entrada
            historialDiv.appendChild(entradaHistorial)

            // Guardar el mensaje en localStorage
            const historial = JSON.parse(localStorage.getItem("historial")) || []
            historial.push(entrada)
            localStorage.setItem("historial", JSON.stringify(historial))
        }
    }

    function resetForm() {
        emailOBJ.email = ""
        emailOBJ.asunto = ""
        emailOBJ.mensaje = ""
        formulario.reset()
        comprobarFormulario()
    }

    function validar(e) {
        const campo = e.target
        const valor = campo.value.trim()
        const nombreCampo = campo.id

        if (valor === "") {
            mostrarAlerta(`El campo ${nombreCampo} es obligatorio`, campo.parentElement)
            emailOBJ[nombreCampo] = ""
        } else if (nombreCampo === "email" && !validarEmail(valor)) {
            mostrarAlerta("El email no es válido", campo.parentElement)
            emailOBJ[nombreCampo] = ""
        } else {
            limpiarAlerta(campo.parentElement)
            emailOBJ[nombreCampo] = valor.toLowerCase()
        }

        comprobarFormulario()
    }

    function comprobarFormulario() {
        const values = Object.values(emailOBJ)

        if (values.includes("")) {
            btnSubmit.classList.add("opacity-50")
            btnSubmit.disabled = true
        } else {
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
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
        return regex.test(email)
    }
})


document.addEventListener("DOMContentLoaded", () => {
    // Selectores
    const inputEmail = document.querySelector("#email")
    const inputAsunto = document.querySelector("#asunto")
    const inputMensaje = document.querySelector("#mensaje")
    const formulario = document.querySelector("#formulario")
    const btnSubmit = document.querySelector('#formulario button[type="submit"]')
    const btnReset = document.querySelector('#formulario button[type="reset"]')
    const spinner = document.querySelector("#spinner")

    // Objeto con el contenido del mensaje
    const emailOBJ = {
        email: "",
        asunto: "",
        mensaje: ""
    }

    // Obtener el correo del cliente desde la URL
    const params = new URLSearchParams(window.location.search)
    const clienteEmail = params.get('email')

    // Llenar el campo del email en el formulario
    if (inputEmail && clienteEmail !== null && clienteEmail !== undefined) {
        inputEmail.value = decodeURIComponent(clienteEmail)
        emailOBJ.email = decodeURIComponent(clienteEmail)
    }


    // Listeners
    inputEmail.addEventListener("input", validar)
    inputAsunto.addEventListener("input", validar)
    inputMensaje.addEventListener("input", validar)
    formulario.addEventListener("submit", activarSpinner)
    btnReset.addEventListener("click", (e) => {
        e.preventDefault()
        resetForm()
    })

    // Funciones
    function activarSpinner(e) {
        console.log("Función activarSpinner llamada")
        e.preventDefault()
        spinner.classList.remove("hidden")
        spinner.classList.add("flex")

        setTimeout(() => {
            spinner.classList.add("hidden")
            spinner.classList.remove("flex")

            resetForm()

            // Creamos una alerta para confirmar todo OK
            const alerta = document.createElement("p")
            alerta.classList.add("bg-green-500", "text-white", "text-center", "rounded-lg", "mt-10", "text-sm")
            alerta.textContent = "El mensaje se ha mandado con éxito"
            formulario.appendChild(alerta)

            setTimeout(() => {
                alerta.remove()
            }, 3000)
        }, 3000)
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
        console.log(values)

        // Activar botón
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

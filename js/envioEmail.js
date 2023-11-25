// Selectores y Listeners

document.addEventListener("DOMContentLoaded", () => {

    // Objeto con el contenido del mensaje
    emailOBJ = {
        email: "",
        asunto: "",
        mensaje: ""
    }

    // Selectores
    const inputEmail = document.querySelector("#email")
    const inputAsunto = document.querySelector("#asunto")
    const inputMensaje = document.querySelector("#mensaje")
    const formulario = document.querySelector("#formulario")
    const btnSubmit = document.querySelector('#formulario button[type = "submit"]')
    const btnReset = document.querySelector('#formulario button[type = "reset"]')
    const spinner = document.querySelector("#spinner")

    // Listeners

    // Si en vez de blur uso input me lo valida sobre la marcha
    inputEmail.addEventListener("blur", validar)
    inputAsunto.addEventListener("blur", validar)
    inputMensaje.addEventListener("blur", validar)
    formulario.addEventListener("submit", activarSpinner)
    btnReset.addEventListener("click", (e) => {
        e.preventDefault()
        resetForm()
    })


    // Funciones

    function activarSpinner(e) {
        e.preventDefault()
        spinner.classList.remove("hidden")
        spinner.classList.add("flex")
        
        setTimeout(() => {
            spinner.classList.add("hidden")
            spinner.classList.remove("flex")

            resetForm()

            // Creamos una alerta para confirmar todo OK
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
        emailOBJ.email = ""
        emailOBJ.asunto = ""
        emailOBJ.mensaje = ""
        formulario.reset()
        comprobarFormulario()

    }

    function validar(e) {
        if(e.target.value.trim() === "") {
            mostrarAlerta(`el campo ${e.target.id} es obligatorio`, e.target.parentElement)
            emailOBJ[e.target.name] = ""
            comprobarFormulario()
            return 
        }
        if (e.target.id === "email" && !validarEmail(e.target.value)) {
            mostrarAlerta("El email no es válido", e.target.parentElement)
            emailOBJ[e.target.name] = ""
            comprobarFormulario() 
            return 
        }

        limpiarAlerta(e.target.parentElement)

        emailOBJ[e.target.name] = e.target.value.trim().toLowerCase()
        comprobarFormulario(emailOBJ)
        //console.log(emailOBJ)
        
    }

    function comprobarFormulario() {
        const values = Object.values(emailOBJ)
        console.log(values)
        // Activar botón
        if (values.includes("")) {
            btnSubmit.classList.add("opacity-50")
            btnSubmit.disabled = true
            return // y se sale
        }
      
        btnSubmit.classList.remove("opacity-50")
        btnSubmit.disabled = false
        

    }

    function limpiarAlerta(referencia) {
        const alerta = referencia.querySelector(".bg-red-600")
        if (alerta) {
            alerta.remove()
        }
    }

    function mostrarAlerta(mensaje, referencia) {

        limpiarAlerta(referencia)

        console.log("Hubo un error...")
        const error = document.createElement("p")
        error.textContent = mensaje
        error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
        console.log(error)
        referencia.appendChild(error)
    }

    function validarEmail(email) {
        regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
        resultado = regex.test(email)
        return resultado
    }




})
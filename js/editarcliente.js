import { modificarCliente} from './basededatos.js'
import {mostrarToast} from './tablaDeClientes.js'

document.addEventListener("DOMContentLoaded", () => {

    const idCliente = obtenerIdClienteDesdeURL()
    const formulario = document.querySelector("#formulario")
    const spinner = document.querySelector("#spinner")

    // Obtener el orden actual almacenado en sessionStorage o usar 'nombre' como valor predeterminado
    const ordenActual = sessionStorage.getItem('ordenActual') || 'nombre'

    let contadorDeClientes = document.querySelector("#contadorClientes")

    // Se asigna la cantidad actual de clientes almacenada en sessionStorage
    let cantidadClientes = parseInt(sessionStorage.getItem('cantidadClientes')) || 0

    // Mostrar la cantidad actual de clientes en el elemento del contador
    contadorDeClientes.textContent = `(${cantidadClientes.toString()})`

    cargarDatosCliente(idCliente)

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault()

        const nuevoNombre = document.querySelector("#nombre").value
        const nuevoEmail = document.querySelector("#email").value
        const nuevoTelefono = document.querySelector("#telefono").value
        const nuevaEmpresa = document.querySelector("#empresa").value

        await modificarCliente(idCliente, nuevoNombre, nuevoEmail, nuevoTelefono, nuevaEmpresa)


        mostrarToast("Cliente editado correctamente", 'success')
        activarSpinner(e)
        setTimeout(() => {
            // Al terminar la edición, redirigir a la página principal manteniendo el orden actual
            window.location.href = `index.html?orden=${encodeURIComponent(ordenActual)}`
        }, 3000)
        
    })

    const nombreInput = document.querySelector("#nombre")
    const emailInput = document.querySelector("#email")
    const telefonoInput = document.querySelector("#telefono")
    const empresaInput = document.querySelector("#empresa")

    nombreInput.addEventListener("input", validarFormulario)
    emailInput.addEventListener("input", validarFormulario)
    telefonoInput.addEventListener("input", validarFormulario)
    empresaInput.addEventListener("input", validarFormulario)
    
    // Funciones
    function cargarDatosCliente(idCliente) {
        console.log('ID del Cliente:', idCliente)
        const request = indexedDB.open('MiBaseDeDatos', 1)
    
        request.onsuccess = function(event) {
            const db = event.target.result
            const transaction = db.transaction(['clientes'], 'readonly')
            const objectStore = transaction.objectStore('clientes')
            const request = objectStore.get(idCliente)
    
            request.onsuccess = function(event) {
                const cliente = event.target.result
                if (cliente) {
                    /* Si encuentra un cliente actualiza los valores de
                    los campos con las propiedades de dicho cliente 
                    */
                    document.querySelector("#nombre").value = cliente.nombre
                    document.querySelector("#email").value = cliente.email
                    document.querySelector("#telefono").value = cliente.telefono
                    document.querySelector("#empresa").value = cliente.empresa
                    document.querySelector("#id").value = cliente.id
                } else {
                    console.error('El cliente con ID ' + idCliente + ' no fue encontrado.')
                }
            }
    
            request.onerror = function(event) {
                console.error('Error al obtener el cliente:', event.target.errorCode)
            }
        }
    
        request.onerror = function(event) {
            console.error('Error al abrir la base de datos:', event.target.errorCode)
        }
    }

    function obtenerIdClienteDesdeURL() {
        const params = new URLSearchParams(window.location.search)
        const idCliente = params.get('id')
        console.log('ID del cliente desde URL:', idCliente)
        return idCliente
    }

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
    
    function validarFormulario() {
        const nuevoNombre = nombreInput.value.trim()
        const nuevoEmail = emailInput.value.trim()
        const nuevoTelefono = telefonoInput.value.trim()
        const nuevaEmpresa = empresaInput.value.trim()

        const nombreEsValido = validarNombre(nuevoNombre)
        const emailEsValido = validarEmail(nuevoEmail)
        const telefonoEsValido = validarTelefono(nuevoTelefono)
        const empresaEsValida = validarEmpresa(nuevaEmpresa)

        const formularioEsValido = nombreEsValido && emailEsValido && telefonoEsValido && empresaEsValida

        const btnGuardarCambios = document.querySelector('#formulario button[type="submit"]')

        if (!nombreEsValido) {
            mostrarAlerta("Nombre inválido", nombreInput.parentElement)
        } else {
            limpiarAlerta(nombreInput.parentElement)
        } 
        
        if (!emailEsValido) {
            mostrarAlerta("Email inválido", emailInput.parentElement)
        } else {
            limpiarAlerta(emailInput.parentElement)
        }
        
        if (!telefonoEsValido) {
            mostrarAlerta("Teléfono inválido", telefonoInput.parentElement)
        } else {
            limpiarAlerta(telefonoInput.parentElement)
        } 
        
        if (!empresaEsValida) {
            mostrarAlerta("Empresa inválida", empresaInput.parentElement)
        } else {
            limpiarAlerta(empresaInput.parentElement)
        } 
        
        if (formularioEsValido) {
            btnGuardarCambios.classList.remove("opacity-50")
            btnGuardarCambios.disabled = false
        } else {
            btnGuardarCambios.classList.add("opacity-50")
            btnGuardarCambios.disabled = true
        }
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

    function validarTelefono(telefono) {
        const regex = /^[0-9]{9}$/
        return regex.test(telefono)
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

    function validarEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        return regex.test(email)
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

})
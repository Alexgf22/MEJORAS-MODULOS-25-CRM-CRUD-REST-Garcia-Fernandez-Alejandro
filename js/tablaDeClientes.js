import { eliminarCliente } from './basededatos.js';

document.addEventListener("DOMContentLoaded", () => {
    const tablaDeClientes = document.querySelector("#listado-clientes");

    const ordenActual = localStorage.getItem('ordenActual') || 'nombre';

    cargarClientesDesdeDB(false, ordenActual);

    function cargarClientesDesdeDB(ordenado = false, campoOrdenacion) {
        const request = indexedDB.open('MiBaseDeDatos', 1);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(['clientes'], 'readonly');
            const objectStore = transaction.objectStore('clientes');

            let getAllRequest;

            if (ordenado) {
                // Asegúrate de que exista un índice para el campo de ordenación
                if (objectStore.indexNames.contains(campoOrdenacion)) {
                    const index = objectStore.index(campoOrdenacion);
                    getAllRequest = index.getAll();
                } else {
                    console.error(`Índice para ${campoOrdenacion} no encontrado.`);
                    return;
                }
            } else {
                getAllRequest = objectStore.getAll();
            }

            getAllRequest.onsuccess = function (event) {
                const clientes = event.target.result;

                limpiarHTML();

                if (clientes && clientes.length > 0) {
                    clientes.forEach(cliente => {
                        regresarClienteAlHtml(cliente);
                    });
                }
            };
        };

        request.onerror = function (event) {
            console.error('Error al abrir la base de datos:', event.target.errorCode);
        };

        // Si no está ordenado, mostrar el botón de ordenar
        if (!ordenado) {
            mostrarBotonesOrdenar();
        }

        // Guardar el orden actual en localStorage solo si está ordenado
        if (ordenado) {
            localStorage.setItem('ordenActual', campoOrdenacion);
        }
    }
    

    function regresarClienteAlHtml(cliente) {
        const filaExistente = document.querySelector(`tr[data-id="${cliente.id}"]`);

        if (filaExistente) {
            // Actualizar la fila existente en lugar de crear una nueva
            const nombreCliente = filaExistente.querySelector("td:first-child");
            const telefonoCliente = filaExistente.querySelector("td:nth-child(2)");
            const empresaCliente = filaExistente.querySelector("td:nth-child(3)");

            nombreCliente.textContent = cliente.nombre;
            telefonoCliente.textContent = cliente.telefono;
            empresaCliente.textContent = cliente.empresa;

            return;
        }

        console.log("Añadiendo cliente:", cliente);

        const fila = document.createElement("tr");
        fila.dataset.id = cliente.id;

        const nombreCliente = document.createElement("td");
        nombreCliente.textContent = cliente.nombre;
        fila.appendChild(nombreCliente);

        const telefonoCliente = document.createElement("td");
        telefonoCliente.textContent = cliente.telefono;
        fila.appendChild(telefonoCliente);

        const empresaCliente = document.createElement("td");
        empresaCliente.textContent = cliente.empresa;
        fila.appendChild(empresaCliente);

        const acciones = document.createElement("td");
        const contenedorBotones = document.createElement("div");

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar Cliente";

        botonEditar.classList.add("bg-teal-600", "mt-5", "p-2", "text-white", "uppercase", "font-bold");

        tablaDeClientes.addEventListener("click", (event) => {
            const boton = event.target;
            if (boton.tagName === "BUTTON") {
                const fila = boton.closest("tr");
                const clienteId = fila.dataset.id;

                if (boton.textContent === "Editar Cliente") {
                    const url = `editar-cliente.html?id=${clienteId}`;
                    window.location.href = url;
                } else if (boton.textContent === "Borrar Cliente") {
                    eliminarCliente(clienteId);
                    fila.remove();
                }
            }
        });

        const espacio = document.createTextNode(" ");

        const botonBorrar = document.createElement("button");
        botonBorrar.textContent = "Borrar Cliente";

        botonBorrar.classList.add("bg-teal-600", "mt-5", "p-2", "text-white", "uppercase", "font-bold");

        contenedorBotones.appendChild(botonEditar);
        contenedorBotones.appendChild(espacio);
        contenedorBotones.appendChild(botonBorrar);

        acciones.appendChild(contenedorBotones);
        fila.appendChild(acciones);

        if (tablaDeClientes) {
            tablaDeClientes.appendChild(fila);
        } else {
            console.error("No se pudo encontrar el elemento 'tablaDeClientes'.");
        }
    }

    function mostrarBotonesOrdenar() {
        const botonOrdenar = document.querySelector("#ordenar");
    
        if (botonOrdenar) {
            botonOrdenar.textContent = "Ordenar";
            botonOrdenar.classList.add("bg-teal-500", "text-white", "px-4", "py-2", "rounded");
    
            botonOrdenar.addEventListener("click", () => {
                const selectOrdenarPor = document.querySelector("#ordenarPor");
                const campoOrdenacion = selectOrdenarPor.value;
                cargarClientesDesdeDB(true, campoOrdenacion);  
            });
        }
    }

    function limpiarHTML() {
        while (tablaDeClientes.firstChild) {
            tablaDeClientes.removeChild(tablaDeClientes.firstChild);
        }
    }
});

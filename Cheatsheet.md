# IndexedDB: Configuración inicial

## Resumen de los aspectos clave de IndexedDB, desde la configuración inicial hasta operaciones avanzadas como transacciones y consultas

```javascript

// Abrir una base de datos
window.indexedDB.open('nombreDB', 1)

// Crear un almacén de objetos
const objectStore = db.createObjectStore('nombreAlmacen', { keyPath: 'clavePrimaria' })



// Iniciar una transacción de lectura
const transaction = db.transaction(['nombreAlmacen'], 'readonly')

// Iniciar una transacción de escritura
const transaction = db.transaction(['nombreAlmacen'], 'readwrite')




// Las operaciones de CRUD 

// Crear
objectStore.add({ clavePrimaria: valor })

// Leer
objectStore.get(clavePrimaria)

// Actualizar
objectStore.put({ clavePrimaria: valorActualizado })

// Eliminar
objectStore.delete(clavePrimaria)





// Crear un índice
objectStore.createIndex('nombreIndice', 'propiedad', { unique: false })




// Eventos y manejos de errores
request.onsuccess = (event) => {
  const db = event.target.result
  // Operaciones exitosas
};

request.onerror = (event) => {
  // Manejo de errores
};




//Versionamiento de bases de datos
request.onupgradeneeded = (event) => {
  const db = event.target.result
  // Actualizaciones de estructura aquí
};




// A continuación una consulta avanzada
const index = objectStore.index('nombreIndice')
const request = index.get('NombreCliente')

request.onsuccess = (event) => {
  const resultado = event.target.result
  // Procesar el resultado
}

```

## Expresión regular para nombre

Explicación: Esta expresión regular valida un nombre que puede contener letras (mayúsculas y minúsculas), acentos y apóstrofes. La longitud del nombre debe estar entre 2 y 50 caracteres.

Expresión regular: /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s']+$/

Ejemplo de uso:

```javascript

const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s']+$/
const nombre = "Florentino Perez"
const esValido = regexNombre.test(nombre); // Devuelve true

```

## Expresión regular para teléfono

Explicación: Esta expresión regular valida un número de teléfono que debe contener exactamente 9 dígitos.

Expresión regular: /^[0-9]{9}$/

Ejemplo de uso:

```javascript

const regexTelefono = /^[0-9]{9}$/
const telefono = "123456789"
const esValido = regexTelefono.test(telefono); // Devuelve true

```

## Expresión regular para empresa

Explicación: Esta expresión regular valida el nombre de una empresa que puede contener letras (mayúsculas y minúsculas), acentos y apóstrofes. La longitud del nombre de la empresa debe estar entre 2 y 120 caracteres.

Expresión regular: /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s']+$/

Ejemplo de uso:

```javascript

const regexEmpresa = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s']+$/
const empresa = "Oas Fund."
const esValida = regexEmpresa.test(empresa); // Devuelve true

```

## Expresión regular para email

Explicación: Esta expresión regular valida una dirección de correo electrónico. Acepta letras, números, guiones, puntos, guiones bajos y signos de más. Además, exige un punto seguido de al menos 2 y como máximo 10 letras al final del dominio.

Expresión regular: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

Ejemplo de uso:

```javascript

const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
const email = "juanito@gmail.com"
const esValido = regexEmail.test(email); // Devuelve true

```

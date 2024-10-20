
let productos = [];
let seleccionAcumulada = [];  // Aquí se almacenan los productos seleccionados de manera acumulativa

// Función para cargar productos usando AJAX con manejo de errores (try/catch)
function cargarProductos() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'JSON/productos.json', true);  // Solicitar el archivo JSON

    xhr.onload = function() {
        try {
            if (this.status === 200) {
                productos = JSON.parse(this.responseText);  // Convertir la respuesta a un objeto JavaScript
                mostrarProductos();  // Mostrar productos en el DOM
            } else {
                throw new Error('Error al cargar los productos: ' + this.status);
            }
        } catch (error) {
            console.error(error.message);
            alert('Hubo un error al cargar los productos. Intente más tarde.');
        }
    };

    xhr.onerror = function() {
        console.error('Error de conexión al intentar cargar el archivo JSON.');
        alert('No se pudo establecer una conexión. Verifique su red.');
    };

    xhr.send();  // Enviar la solicitud
}

// Función para mostrar productos en el DOM como cards
function mostrarProductos() {
    let container = document.getElementById('productosContainer');
    container.innerHTML = '';  // Limpiar el contenedor

    productos.forEach((producto, index) => {
        let card = `
            <div class="card">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="card-content">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p><strong>Precio:</strong> $${producto.precio}</p>
                    <p><strong>Categoría:</strong> ${producto.categoria}</p>
                    <label>
                        <input type="checkbox" class="producto" value="${producto.precio}" data-index="${index}">
                        Seleccionar
                    </label>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Función para capturar productos seleccionados en esta ronda
function capturarSeleccion() {
    let seleccionados = [];
    let checkboxes = document.querySelectorAll('.producto');
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            let index = checkbox.getAttribute('data-index');
            seleccionados.push(productos[index]);  // Agregar productos seleccionados
        }
    });
    
    return seleccionados;
}

// Función para acumular la selección anterior con la nueva selección
function acumularSeleccion(nuevaSeleccion) {
    seleccionAcumulada = seleccionAcumulada.concat(nuevaSeleccion);
}

// Función para calcular el costo total acumulado utilizando Lodash
function calcularCosto(seleccionados = []) {
    // Programación defensiva
    if (!Array.isArray(seleccionados)) {
        console.error("La selección debe ser un array.");
        return 0;
    }

    // Usar Lodash para sumar el costo total
    return _.sumBy(seleccionados, 'precio');
}

// Función para mostrar el resultado acumulado
function mostrarResultado(costoTotal) {
    let resultado = document.getElementById('resultado');
    if (costoTotal > 0) {
        resultado.textContent = `El costo total acumulado es: $${costoTotal}`;
    } else {
        resultado.textContent = "No has seleccionado ningún producto.";
    }
}

// Event listener para el botón de calcular usando jQuery
$('#calcularBtn').on('click', function() {
    let nuevaSeleccion = capturarSeleccion();  // Capturar los nuevos productos seleccionados
    acumularSeleccion(nuevaSeleccion);  // Acumular la nueva selección con la anterior
    let costoTotalAcumulado = calcularCosto(seleccionAcumulada);  // Calcular el costo total acumulado
    mostrarResultado(costoTotalAcumulado);  // Mostrar el resultado acumulado
});

// Cargar productos al iniciar
cargarProductos();

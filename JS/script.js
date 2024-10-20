
let productos = [];
let seleccionAcumulada = [];  


function cargarProductos() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'JSON/productos.json', true);  

    xhr.onload = function() {
        try {
            if (this.status === 200) {
                productos = JSON.parse(this.responseText);  
                mostrarProductos();  
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

    xhr.send();  
}


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


function capturarSeleccion() {
    let seleccionados = [];
    let checkboxes = document.querySelectorAll('.producto');
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            let index = checkbox.getAttribute('data-index');
            seleccionados.push(productos[index]);  
        }
    });
    
    return seleccionados;
}


function acumularSeleccion(nuevaSeleccion) {
    seleccionAcumulada = seleccionAcumulada.concat(nuevaSeleccion);
}


function calcularCosto(seleccionados = []) {
    
    if (!Array.isArray(seleccionados)) {
        console.error("La selección debe ser un array.");
        return 0;
    }

    
    return _.sumBy(seleccionados, 'precio');
}


function mostrarResultado(costoTotal) {
    let resultado = document.getElementById('resultado');
    if (costoTotal > 0) {
        resultado.textContent = `El costo total acumulado es: $${costoTotal}`;
    } else {
        resultado.textContent = "No has seleccionado ningún producto.";
    }
}


$('#calcularBtn').on('click', function() {
    let nuevaSeleccion = capturarSeleccion();  
    acumularSeleccion(nuevaSeleccion);  
    let costoTotalAcumulado = calcularCosto(seleccionAcumulada);  
    mostrarResultado(costoTotalAcumulado);  
});


cargarProductos();

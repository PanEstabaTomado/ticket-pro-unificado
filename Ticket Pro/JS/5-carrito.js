const listaCarrito = document.getElementById("lista-carrito");
const totalCarritoElemento = document.getElementById("total-carrito");
const cartCountElemento = document.getElementById("cart-count");
const btnProcesarPago = document.getElementById("btn-procesar-pago");
 

// Primero sonseguimos los datos del evento desde el localStorage y verificamos si tiene datos o no,
// Luego definimos el html que se cargara en el carrito junto a sus respectivos datos y funciones
function cargarDatos() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<li class='item-carrito'><p>Tu carrito está vacío.</p></li>";
        totalCarritoElemento.textContent = "$ 0";
        cartCountElemento.textContent = "0";
        return;
    }

    let contenidoHTML = "";
    let total = 0;
    let cantidadTotal = 0;

    for (let i = 0; i < carrito.length; i++) {
        let item = carrito[i];
        
        total += item.subtotal;
        cantidadTotal += item.cantidad;

        contenidoHTML += 
            `<li class="item-carrito">
                <div>
                    <strong>${item.tituloEvento}</strong>
                    <p>Ubicación: ${item.nombreSeccion}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                    <p>Precio Unitario: $${item.precioUnitario.toLocaleString('es-CL')}</p>
                </div>
                <div>
                    <p><strong>Subtotal: $${item.subtotal.toLocaleString('es-CL')}</strong></p>
                    <button class="btn-eliminar" data-index="${i}">Eliminar</button>
                </div>
            </li>
        `;
    }


    listaCarrito.innerHTML = contenidoHTML;
    totalCarritoElemento.textContent = "$ " + total.toLocaleString('es-CL');
    cartCountElemento.textContent = cantidadTotal;
}

// Evento para eliminar un ticket del carrito 
listaCarrito.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-eliminar")) {
        let index = e.target.getAttribute("data-index");
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        cargarDatos();
    }
});


// Evento para pagar los tickets seleccionados y limpiar el carrito 
btnProcesarPago.addEventListener("click", function() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega entradas antes de pagar.");
        return;
    }
    else {
    alert("Compra realizada con éxito!");
    localStorage.removeItem("carrito");
    cargarDatos();
    }
});

cargarDatos();
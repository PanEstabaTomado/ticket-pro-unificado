let valorContador = 0;
const limiteInferior = 0;

let total = 0;

const cantidadEntradas = document.querySelector("#numero");
const botonSumar = document.querySelector("#btn-sumar");
const botonRestar = document.querySelector("#btn-restar");
const totalPrecio = document.querySelector("#total-precio");
const btnComprar = document.querySelector("#btn-comprar");


function actualizarContador() {
    if (cantidadEntradas) {
        cantidadEntradas.textContent = valorContador;
    }
    calcularTotal();
}
    
botonSumar.addEventListener("click", function () {
    valorContador = valorContador + 1;
    actualizarContador();
});

botonRestar.addEventListener("click", function () {
    if (valorContador > limiteInferior) {
        valorContador = valorContador - 1;
        actualizarContador();
    }
});

//Funcion para calcular el total a pagar dependiendo de cuantas entradas seleccionemos 
function calcularTotal() {
    const total = valorContador * evento.secciones[0].precioSeccion;
    
    if (totalPrecio) {
        totalPrecio.textContent = `$ ${total.toLocaleString('es-CL')}`;
    }
}


// Evento para agregar entradas verifica que se seleccionen entradas y luego las almacena en el localStorage
btnComprar.addEventListener("click", function () {
    if (valorContador === 0) {
        alert("Debes seleccionar al menos 1 entrada.");
        return;
    }

    const seccionSeleccionada = evento.secciones[0];

    const itemCarrito = {
        idEvento: evento.id,
        tituloEvento: evento.titulo,
        nombreSeccion: seccionSeleccionada.nombre,
        precioUnitario: seccionSeleccionada.precioSeccion,
        cantidad: valorContador,
        subtotal: valorContador * seccionSeleccionada.precioSeccion
    };

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito.push(itemCarrito);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Se agregaron exitosamente las entradas al carrito.");
    window.location.href = "carrito.html";
});

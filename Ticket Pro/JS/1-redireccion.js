
//Redireccionamiento a evento.html 
document.addEventListener('DOMContentLoaded', () => {
    const botonAgregar = document.querySelectorAll('.btn-agregar');

    botonAgregar.forEach(function(btn) {
        btn.addEventListener('click', function(e){
            const id = btn.getAttribute('data-id');

            if (id) {
                window.location.href = `evento.html?id=${id}`;
            }
        });
    });
});


const carrito = document.querySelector('.carrito');

// Redireccionamiento al carrito desde el boton superior del header
if (carrito) {
    carrito.addEventListener('click', () => {
        window.location.href = 'carrito.html';
    });
};





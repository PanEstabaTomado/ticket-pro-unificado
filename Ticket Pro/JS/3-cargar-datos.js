
//Conseguimos el id del evento desde la URL
const urlParams = new URLSearchParams(window.location.search);
const idEvento = urlParams.get('id');
const secciones = document.getElementById('secciones');

//Buscamos el evento desde 2-datos.js y que coincida con el id de la URL
const evento = eventos.find(e => e.id === idEvento);

//Verificamos que el evento existe y lo cargamos en evento.html junto a las secciones
if (evento) {
    
    if (document.getElementById('titulo')) document.getElementById('titulo').textContent = evento.titulo;
    if (document.getElementById('tipo')) document.getElementById('tipo').textContent = evento.tipo;
    if (document.getElementById('fecha')) document.getElementById('fecha').textContent = evento.fecha;
    if (document.getElementById('hora')) document.getElementById('hora').textContent = evento.hora;
    if (document.getElementById('lugar')) document.getElementById('lugar').textContent = evento.lugar;
    if (document.getElementById('direccion')) document.getElementById('direccion').textContent = evento.direccion;
    if (document.getElementById('precio')) document.getElementById('precio').textContent = evento.precio;
    if (document.getElementById('categoria')) document.getElementById('categoria').textContent = evento.categoria;
    if (document.getElementById('duracion')) document.getElementById('duracion').textContent = evento.duracion;
    if (document.getElementById('estado')) document.getElementById('estado').textContent = evento.estado;
    if (document.getElementById('organizador')) document.getElementById('organizador').textContent = evento.organizador;
    if (document.getElementById('descripcion')) document.getElementById('descripcion').textContent = evento.descripcion;
    
    if (secciones) {
        evento.secciones.forEach(seccion => {
            const seccionDiv = document.createElement('div');
            seccionDiv.classList.add('seccion');
            seccionDiv.innerHTML = `
                <h3>${seccion.nombre}</h3>
                <p>Precio: $${seccion.precioSeccion.toLocaleString()}</p>
                <p>Capacidad: ${seccion.capacidad}</p>
            `;
            secciones.appendChild(seccionDiv);
        });
    }
}
else {
    alert("Evento no encontrado");
}


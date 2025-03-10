$document.addEventListener('DOMContentLoaded', () =>{
    const publicacionTextarea = document.getElementById('nuevaPublicacion');
    const btnPublicar = document.getElementById('btnPublicar');

    // Event Listener para nueva publicacion
    btnPublicar.addEventListener('click', crearPublicacion);

    // Cargar publicaciones iniciales
    cargarPublicaciones();
});

// Función para crear nueva publicación
function crearPublicacion(){
    const contenido = document.getElementById('nuevaPublicacion').value;
    if (!contenido.trim()){
        alert('Por favor, ingresa un contenido para tu publicación.');
        return;
    }

    const publicacion = {
        usuario: {
            nombre: 'Rodolfo Leija',
            matricula: '#1822271',
            foto: 'img/profilepic.png'
        },
        contenido: contenido,
        fecha: new Date(),
        likes: 0,
        comentarios: []
    };
}
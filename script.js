// Variables globales
let usuarioActual = 'Rodolfo Eduardo Leija Pauli';
let idUsuarioSolicitante = '1822271';
let llaveSecreta = '5653714b-385d-4ce5-82a2-06e084a51034';
let publicaciones = [];
let comentarios = {};

// función ready para cargar publicaciones recientes
$(document).ready(function() {
    cargarPublicaciones();
});

// función para cargar publicaciones 
function cargarPublicaciones(){
    let url = window.location.pathname.includes('perfil.html')
    ? `/api/Publicaciones/all/${idUsuarioSolicitante}/${idUsuaruioSolicitante}`
    : `/api/Publicaciones/all/${idUsuarioSolicitante}`;

    $.ajax({
        url: url,
        method: 'GET',
        success: function(response){ // Array de API 
            publicaciones = response;
            monstrarPublicaciones();
        },
        error: function(xhr, status, error){
            console.log("Error al cargar publicaciones: ", error);
        }
    });
}

// Mostrar publicaciones en el DOM
function mostrarPublicaciones(){
    let contenedor = $('.container.mt-4');
    contenedor.html(''); // Para limpiar el contenido

    // Sección para la creación de publicaciones
    let crearPub = $('.card.p-3.shadow-sm.mb-4').clone();
    contenedor.append(crearPub);
    $('#btnPublicar').on('click', crearPublicacion); // Evento para crear la publicación

    publicaciones.forEach(pub => {
        // Para formatear la fecha
        let fechaFormateada = new Date(pub.fechaCreacion).toLocaleString();

        let card = $(``)
    })
}
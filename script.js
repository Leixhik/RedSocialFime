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

        // formato de la publicacion (como en el html)
        let card = $(`
            <div class="card shadow-sm p-4 mb-4">
                <div class="d-flex align-items-center mb-3">
                    <img src="img/profilepic.png" alt="UserProfilePicture" class="rounded-circle me-3" style="width: 40px; height: 40px; object-fit: cover;">
                    <div class="flex-grow-1">
                        <h6 class="mb-0">${pub.nombre} #${pub.idUsuario}</h6>
                        <span class="text-muted">${fechaFormateada}</span>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i class="bi bi-gear"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><button class="dropdown-item" onclick="editarPublicacion(${pub.idPublicacion})">Editar</button></li>
                            <li><button class="dropdown-item text-danger" onclick="eliminarPublicacion(${pub.idPublicacion})">Eliminar</button></li>
                        </ul>
                    </div>
                </div>
                <p>${pub.contenido}</p>
                <div class="d-flex justify-content-between align-items-center mb-3">
                    // <button class="btn btn-outline-primary me-2" onclick="darMeGusta(${pub.idPublicacion})"
                        <i class="fas fa-thumbs-up"></i> Me gusta <span class="badge bg-secondary">${pub.cantidadComentarios || 0}</span>
                    </button>
                    <button class="btn btn-outline-secondary" onclick="mostrarComentarios(${pub.idPublicacion})">
                        <i class="fas fa-comment"></i> Comentar
                    </button>
                </div>
                <div id="comentarios-${pub.idPublicacion}" class="comment-section"></div>
                <div class="d-flex align-items-center mt-2">
                    <img src="img/profilepic.png" alt="UserProfilePicture" class="rounded-circle me-2" style="width: 32px; height: 32px; object-fit: cover;">
                    <textarea class="form-control flex-grow-1" rows="1" id="comentario-${pub.idPublicacion}" placeholder="Escribe un comentario..." style="resize: none;"></textarea>
                    <button class="btn btn-success ms-2" onclick="agregarComentario(${pub.idPublicacion})">Enviar</button>
                </div>
            </div>
            `);
            contenedor.append(card);
    });
}


// Variables globales
const idUsuarioSolicitante = 1822271;
const llaveSecreta = '5653714b-385d-4ce5-82a2-06e084a51034';
const urlDominio = "https://redsocial.luislepe.tech";
const ultimaPublicacion = {
    timestamp: 0
};

$(document).ready(function () {
    // Función 1 - Cargar publicaciones //Ya Jala
    function cargarPublicaciones() {
        $.ajax({
            url: urlDominio + `/api/Publicaciones/all/1822271`,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                // Limpiar contenedor para nuevos posts
                $('#posts-container').empty();

                // Verificar respuesta (si hay publicaciones)
                if (response.length > 0) {
                    // forEach para cada publicacion
                    $.each(response, function (index, post) {

                        // Determinar si una publicación es mía o ajena
                        const isMyPost = post.idUsuario === idUsuarioSolicitante;

                        // HTML de Posts ajenas y mias (metí un if para diferenciar las mías con isMyPost)
                        let postHTML = `
                            <div class="card mb-3 shadow-sm">
                                <div class="card-body">
                                            <div class="d-flex align-items-center justify-content-between mb-2">
                                            <h5 class="card-title mb-0">
                                                <a href="javascript:void(0)" onclick="verPublicacionIndividual(${post.idPublicacion})" class="text-decoration-none">
                                                    ${post.nombre}
                                                </a>
                                            </h5>
                                        </div>
                                    <h6 class="card-title mb-0">${post.idUsuario}</h6>
                                    <p class="card-text">${post.contenido}</p>
                                    <p class="text-muted small">${post.fechaCreacion}</p>
                                        <div class="d-flex gap-2">
                                        <button class="btn btn-outline-primary btn-sm" onclick="toggleLike(${post.idPublicacion}, this)">
                                            <i class="bi bi-hand-thumbs-up"></i>
                                            <span class="contador-likes">${post.cantidadLikes}</span> Me Gusta
                                        </button>
                                        <button class="btn btn-outline-secondary btn-sm" onclick="cargarComentarios(${post.idPublicacion})">
                                            <i class="bi bi-chat"></i> ${post.cantidadComentarios} Comentar
                                        </button>
                                    </div>
                                    <div class="comentarios-section mt-3" id="comentarios-section-${post.idPublicacion}">
                                        <div class="mb-3">
                                            <textarea class="form-control" id="nuevoComentario-${post.idPublicacion}" rows="2" placeholder="Escribe un comentario..."></textarea>
                                            <button class="btn btn-primary btn-sm mt-2" onclick="crearComentario(${post.idPublicacion}, $('#nuevoComentario-${post.idPublicacion}').val())">
                                                Comentar
                                            </button>
                                        </div>
                                        <div id="comentarios-${post.idPublicacion}">
                                            <!-- Aquí se cargarán los comentarios -->
                                        </div>
                                    </div>
                                `;
                        // Agregar los post al div del html 
                        $('#posts-container').append(postHTML);
                    });
                } else {
                    // En caso de no haber (casi imposible)
                    $('#posts-container').html('<p class="text-muted">No hay publicaciones para mostrar.</p>');
                }
            },
            error: function (error) {
                // Manejo de errores (por consola)
                $('#posts-container').html('<p class="text-danger">Error al cargar las publicaciones.</p>');
                console.log('Error en AJAX:', error);
            }
        });
    }

    // Llamamos a la función al cargar la página
    cargarPublicaciones();

    // Funcion 2 - Publicar un nuevo post // Jala pero también me da el error de .fail por alguna razón, no hallo que sea
    function crearPublicacion(publicacion) {
        $.ajax({
            url: urlDominio + `/api/Publicaciones`,
            method: "POST",
            dataType: "json",
            crossDomain: true,
            contentType: "application/json",
            data: JSON.stringify({
                idPublicacion: 0,
                idUsuario: idUsuarioSolicitante,
                llave_Secreta: llaveSecreta,
                contenido: publicacion
            }),
            success: function(result) {
                $("#nuevaPublicacion").val('');
                Swal.fire({
                    icon: 'success',
                    title: 'Publicación exitosa',
                    text: 'Tu publicación se ha creado con éxito.',
                    showConfirmButton: false,
                    timer: 1500
                });
                // Recargar las publicaciones después de crear una nueva
                miPublicacion();
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al publicar',
                    text: `Ocurrió un error al intentar publicar: ${error}`,
                });
            }
        });
    }
    $("#btnPublicar").on("click", function () {  // Ya jala
        const contenido = $("#nuevaPublicacion").val();
        const tiempoActual = Date.now();
        const tiempoTranscurrido = (tiempoActual - ultimaPublicacion.timestamp) / 1000;
    
        // Limites de Publicación y Límite de publicación por tiempo (1 minuto)
        if (contenido.trim().length < 3) {
            Swal.fire({
                icon: 'warning',
                title: 'Publicación muy corta',
                text: 'La publicación debe tener al menos 3 carácteres.',
            });
            return;
        }
    
        if (contenido.trim().length > 500) {
            Swal.fire({
                icon: 'warning',
                title: 'Publicación muy larga',
                text: 'La publicación no puede exceder los 50 carácteres.',
            });
            return;
        }
    
        if (tiempoTranscurrido <= 60) {
            const tiempoRestante = Math.ceil(60 - tiempoTranscurrido);
            Swal.fire({
                icon: 'warning',
                title: 'Espera un momento',
                text: `Debes esperar ${tiempoRestante} segundos antes de publicar nuevamente.`,
            });
            return;
        }
    
        crearPublicacion(contenido);
        ultimaPublicacion.timestamp = tiempoActual;
    });

    // Función 3 - Ver mis publicaciones en perfil + botón de editar y mandar a publicaciones.html // ya jala
    function miPublicacion() {
        let formHTML = `
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">Crear nueva publicación</h5>
                <div class="mb-3">
                    <textarea class="form-control" id="nuevaPublicacion" rows="3" placeholder="¿Qué estás pensando?"></textarea>
                </div>
                <button class="btn btn-success" id="btnPublicar">Publicar</button>
            </div>
        </div>
    `;
    $('#posts-container-mio').before(formHTML);

    // Vincular el evento click después de crear el botón
    $("#btnPublicar").off('click').on("click", function () {
        const contenido = $("#nuevaPublicacion").val();
        const tiempoActual = Date.now();
        const tiempoTranscurrido = (tiempoActual - ultimaPublicacion.timestamp) / 1000;
    
        if (contenido.trim().length < 3) {
            Swal.fire({
                icon: 'warning',
                title: 'Publicación muy corta',
                text: 'La publicación debe tener al menos 3 carácteres.',
            });
            return;
        }
    
        if (contenido.trim().length > 500) {
            Swal.fire({
                icon: 'warning',
                title: 'Publicación muy larga',
                text: 'La publicación no puede exceder los 50 carácteres.',
            });
            return;
        }
    
        if (tiempoTranscurrido <= 60) {
            const tiempoRestante = Math.ceil(60 - tiempoTranscurrido);
            Swal.fire({
                icon: 'warning',
                title: 'Espera un momento',
                text: `Debes esperar ${tiempoRestante} segundos antes de publicar nuevamente.`,
            });
            return;
        }
    
        crearPublicacion(contenido);
        ultimaPublicacion.timestamp = tiempoActual;
    });
        $.ajax({
            url: urlDominio + `/api/Publicaciones/all/1822271/1822271`,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                // Limpiar contenedor para nuevos posts
                $('#posts-container-mio').empty();

                // Verificar respuesta (si hay publicaciones)
                if (response.length > 0) {
                    // forEach para cada publicacion
                    $.each(response, function (index, post) {

                        // HTML para cada publicación
                        let postHTML = `
                            <div class="card mb-3 shadow-sm">
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <h5 class="card-title mb-0">
                                            <a href="javascript:void(0)" onclick="verPublicacionIndividual(${post.idPublicacion})" class="text-decoration-none">
                                                ${post.nombre}
                                            </a>
                                        </h5>
                                    </div>
                                    <h6 class="card-title mb-0">${post.idUsuario}</h6>
                                    <p class="card-text">${post.contenido}</p>
                                    <p class="text-muted small">${post.fechaCreacion}</p>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-outline-primary btn-sm" onclick="toggleLike(${post.idPublicacion}, this)">
                                            <i class="bi bi-hand-thumbs-up"></i>
                                            <span class="contador-likes">${post.cantidadLikes}</span> Me Gusta
                                        </button>
                                        <button class="btn btn-outline-secondary btn-sm" onclick="cargarComentarios(${post.idPublicacion})">
                                            <i class="bi bi-chat"></i> ${post.cantidadComentarios} Comentar
                                        </button>
                                    </div>
                                    <div class="comentarios-section mt-3" id="comentarios-section-${post.idPublicacion}">
                                        <div class="mb-3">
                                            <textarea class="form-control" id="nuevoComentario-${post.idPublicacion}" rows="2" placeholder="Escribe un comentario..."></textarea>
                                            <button class="btn btn-primary btn-sm mt-2" onclick="crearComentario(${post.idPublicacion}, $('#nuevoComentario-${post.idPublicacion}').val())">
                                                Comentar
                                            </button>
                                        </div>
                                        <div id="comentarios-${post.idPublicacion}">
                                            <!-- Aquí se cargarán los comentarios -->
                                        </div>
                                    </div>
                                `;
                        // Añadir publicacion al div
                        $('#posts-container-mio').append(postHTML);
                    });
                } else {
                    // En caso de no haber (casi imposible)
                    $('#posts-container-mio').html('<p class="text-muted">No hay publicaciones para mostrar.</p>');
                }
            },
            error: function (error) {
                // Manejo de errores (por consola)
                $('#posts-container').html('<p class="text-danger">Error al cargar las publicaciones.</p>');
                console.log('Error en AJAX:', error);
            }
        });
    }

    // Llamamos a la función al cargar la página
    miPublicacion();    
});

// Funcion 4 - Ejecuta la función editar // Ya jala
function editarPublicacion(idPublicacion) {
    // para guardar el ID de la publicación
    localStorage.setItem('editarPublicacionId', idPublicacion);
    // Para que me lleve a la pagina de editar publicacion
    window.location.href = 'publicaciones.html';
}

// función para cargar la publicación en la pagina de editar //YA JALOOO, le duré bastante a este
function cargarPublicacionParaEditar() {
    const idPublicacion = parseInt(localStorage.getItem('editarPublicacionId'));
    console.log('ID recuperado:', idPublicacion); // solo es para saber el ID

    if (idPublicacion) {
        $.ajax({
            url: urlDominio + `/api/Publicaciones/${idUsuarioSolicitante}/${idPublicacion}`,
            type: 'GET',
            dataType: 'json',
            success: function (post) {
                if (post) {
                    let editFormHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h3 class="card-title">Editar Publicación</h3>
                                <div class="card mb-3 shadow-sm">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center justify-content-between mb-2">
                                            <h5 class="card-title mb-0">${post.nombre}</h5>
                                            <div class="dropdown">
                                                <button class="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i class="bi"></i> Opciones
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li><a class="dropdown-item" href="#" onclick="mostrarFormularioEdicion('${post.contenido}', ${post.idPublicacion})">
                                                        <i class="bi bi-pencil"></i> Editar
                                                    </a></li>
                                                    <li><a class="dropdown-item text-danger" href="#" onclick="eliminarPublicacion(${post.idPublicacion})">
                                                        <i class="bi bi-trash"></i> Eliminar
                                                    </a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <h6 class="card-title mb-0">${post.idUsuario}</h6>
                                        <p class="card-text">${post.contenido}</p>
                                        <p class="text-muted small">${post.fechaCreacion}</p>
                                        <div id="formularioEdicion_${post.idPublicacion}" style="display: none;">
                                            <div class="mb-3">
                                                <textarea class="form-control" id="editContenido" rows="3">${post.contenido}</textarea>
                                            </div>
                                            <div class="d-flex gap-2">
                                                <button class="btn btn-primary" onclick="guardarEdicion(${post.idPublicacion})">
                                                    Guardar cambios
                                                </button>
                                                <button class="btn btn-secondary" onclick="cancelarEdicion(${post.idPublicacion})">
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    $('#posts-container-editar').html(editFormHTML);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se encontró la publicación'
                    });
                }
            },
            error: function (error) {
                console.log('Error loading post:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar la publicación para editar'
                });
            }
        });
    }
}

// Funcion 5 - Editar publicacion
function mostrarFormularioEdicion(contenido, idPublicacion) {
    $(`#formularioEdicion_${idPublicacion}`).show();
    $(`#editContenido`).val(contenido);
}

function cancelarEdicion(idPublicacion) {
    $(`#formularioEdicion_${idPublicacion}`).hide();
}

function eliminarPublicacion(idPublicacion) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: urlDominio + `/api/Publicaciones/${idPublicacion}`,
                method: 'DELETE',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    idPublicacion: idPublicacion,
                    idUsuario: idUsuarioSolicitante,
                    llave_Secreta: llaveSecreta
                }),
                success: function(response) {
                    Swal.fire(
                        '¡Eliminado!',
                        'La publicación ha sido eliminada.',
                        'success'
                    ).then(() => {
                        window.location.href = 'perfil.html';
                    });
                },
                error: function(error) {
                    Swal.fire(
                        'Error',
                        'No se pudo eliminar la publicación',
                        'error'
                    );
                }
            });
        }
    });
}

// Funcion 5.5 - Guardar cambios publicacion editada
function guardarEdicion(idPublicacion) {
    const nuevoContenido = $('#editContenido').val();

    if (nuevoContenido.trim() === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'El contenido no puede estar vacío'
        });
        return;
    }

    $.ajax({
        url: urlDominio + `/api/Publicaciones/${idPublicacion}`,
        method: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            idPublicacion: idPublicacion,
            idUsuario: idUsuarioSolicitante,
            llave_Secreta: llaveSecreta,
            contenido: nuevoContenido
        }),
        success: function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Publicación actualizada correctamente'
            }).then(() => {
                window.location.href = 'perfil.html';
            });
        },
        error: function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la publicación'
            });
        }
    });
}

// para cargar la publicación en la pagina de editar
if (window.location.pathname.includes('post.html')) {
    const idPublicacion = localStorage.getItem('verPublicacionId');
    if (idPublicacion) {
        $.ajax({
            url: urlDominio + `/api/Publicaciones/${idUsuarioSolicitante}/${idPublicacion}`,
            type: 'GET',
            dataType: 'json',
            success: function(post) {
                let postHTML = `
                    <div class="card mb-3 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <h5 class="card-title mb-0">
                                    <a href="javascript:void(0)" onclick="verPublicacionIndividual(${post.idPublicacion})" class="text-decoration-none">
                                        ${post.nombre}
                                    </a>
                                </h5>
                            </div>
                            <h6 class="card-title mb-0">${post.idUsuario}</h6>
                            <p class="card-text">${post.contenido}</p>
                            <p class="text-muted small">${post.fechaCreacion}</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-primary btn-sm" onclick="toggleLike(${post.idPublicacion}, this)">
                                    <i class="bi bi-hand-thumbs-up"></i>
                                    <span class="contador-likes">${post.cantidadLikes}</span> Me Gusta
                                </button>
                                <button class="btn btn-outline-secondary btn-sm" onclick="cargarComentarios(${post.idPublicacion})">
                                    <i class="bi bi-chat"></i> ${post.cantidadComentarios} Comentar
                                </button>
                            </div>
                            <div class="comentarios-section mt-3" id="comentarios-section-${post.idPublicacion}">
                                <div class="mb-3">
                                    <textarea class="form-control" id="nuevoComentario-${post.idPublicacion}" rows="2" placeholder="Escribe un comentario..."></textarea>
                                    <button class="btn btn-primary btn-sm mt-2" onclick="crearComentario(${post.idPublicacion}, $('#nuevoComentario-${post.idPublicacion}').val())">
                                        Comentar
                                    </button>
                                </div>
                                <div id="comentarios-${post.idPublicacion}">
                                    <!-- Aquí se cargarán los comentarios -->
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $('#post-individual-container').html(postHTML);
                cargarComentarios(post.idPublicacion);
            },
            error: function(error) {
                console.error('Error:', error);
                $('#post-individual-container').html('<p class="text-danger">Error al cargar la publicación.</p>');
            }
        });
    }
}

// Función 6 - Likes
function toggleLike(idPublicacion, button) {
    $.ajax({
        url: urlDominio + `/api/Likes`,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            idPublicacion: idPublicacion,
            idUsuario: idUsuarioSolicitante,
            llave_Secreta: llaveSecreta
        }),
        success: function(response) {
            const contadorLikes = $(button).find('.contador-likes');
            const icono = $(button).find('i');
            
            // Toggle del botón
            if ($(button).hasClass('btn-primary')) {
                $(button).removeClass('btn-primary').addClass('btn-outline-primary');
                icono.removeClass('bi-hand-thumbs-up-fill').addClass('bi-hand-thumbs-up');
                const likesActuales = parseInt(contadorLikes.text()) - 1;
                contadorLikes.text(likesActuales);
            } else {
                $(button).addClass('btn-primary').removeClass('btn-outline-primary');
                icono.addClass('bi-hand-thumbs-up-fill').removeClass('bi-hand-thumbs-up');
                const likesActuales = parseInt(contadorLikes.text()) + 1;
                contadorLikes.text(likesActuales);
            }
        },
        error: function(xhr) {
            if (xhr.status === 409) {
                $.ajax({
                    url: urlDominio + `/api/Likes`,
                    method: 'DELETE',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        idPublicacion: idPublicacion,
                        idUsuario: idUsuarioSolicitante,
                        llave_Secreta: llaveSecreta
                    }),
                    success: function() {
                        const contadorLikes = $(button).find('.contador-likes');
                        const icono = $(button).find('i');
                        
                        $(button).removeClass('btn-primary').addClass('btn-outline-primary');
                        icono.removeClass('bi-hand-thumbs-up-fill').addClass('bi-hand-thumbs-up');
                        const likesActuales = parseInt(contadorLikes.text()) - 1;
                        contadorLikes.text(likesActuales);
                    },
                    error: function() {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudo quitar el me gusta'
                        });
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo procesar el me gusta'
                });
            }
        }
    });
}

// Función 7 - Publicaciones con like se van a favoritos.
function cargarPublicacionesFavoritas() {
    $.ajax({
        url: urlDominio + `/api/Likes/${idUsuarioSolicitante}/${idUsuarioSolicitante}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            $('#posts-container-favoritos').empty();

            if (response.length > 0) {
                $.each(response, function(index, post) {
                    let postHTML = `
                        <div class="card mb-3 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                        <h5 class="card-title mb-0">
                                            <a href="javascript:void(0)" onclick="verPublicacionIndividual(${post.idPublicacion})" class="text-decoration-none">
                                                ${post.nombre}
                                            </a>
                                        </h5>
                                    </div>
                                <h6 class="card-title mb-0">${post.idUsuario}</h6>
                                <p class="card-text">${post.contenido}</p>
                                <p class="text-muted small">${post.fechaCreacion}</p>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-primary btn-sm" onclick="toggleLike(${post.idPublicacion}, this)">
                                        <i class="bi bi-hand-thumbs-up-fill"></i>
                                        <span class="contador-likes">${post.cantidadLikes}</span> Me Gusta
                                    </button>
                                    <button class="btn btn-outline-secondary btn-sm" onclick="toggleComentarios(${post.idPublicacion})">
                                        <i class="bi bi-chat"></i> ${post.cantidadComentarios} Comentar
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    $('#posts-container-favoritos').append(postHTML);
                });
            } else {
                $('#posts-container-favoritos').html('<p class="text-muted">No tienes publicaciones favoritas.</p>');
            }
        },
        error: function(error) {
            $('#posts-container-favoritos').html('<p class="text-danger">Error al cargar las publicaciones favoritas.</p>');
            console.log('Error en AJAX:', error);
        }
    });
}


if (window.location.pathname.includes('post.html')) {
    const idPublicacion = localStorage.getItem('verPublicacionId');
    if (idPublicacion) {
        $.ajax({
            url: urlDominio + `/api/Publicaciones/${idUsuarioSolicitante}/${idPublicacion}`,
            type: 'GET',
            dataType: 'json',
            success: function(post) {
                let postHTML = `
                    <div class="card mb-3 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <h5 class="card-title mb-0">
                                    <a href="javascript:void(0)" onclick="verPublicacionIndividual(${post.idPublicacion})" class="text-decoration-none">
                                        ${post.nombre}
                                    </a>
                                </h5>
                            </div>
                            <h6 class="card-title mb-0">${post.idUsuario}</h6>
                            <p class="card-text">${post.contenido}</p>
                            <p class="text-muted small">${post.fechaCreacion}</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-primary btn-sm" onclick="toggleLike(${post.idPublicacion}, this)">
                                    <i class="bi bi-hand-thumbs-up"></i>
                                    <span class="contador-likes">${post.cantidadLikes}</span> Me Gusta
                                </button>
                                <button class="btn btn-outline-secondary btn-sm" onclick="cargarComentarios(${post.idPublicacion})">
                                    <i class="bi bi-chat"></i> ${post.cantidadComentarios} Comentar
                                </button>
                            </div>
                            <div class="comentarios-section mt-3" id="comentarios-section-${post.idPublicacion}">
                                <div class="mb-3">
                                    <textarea class="form-control" id="nuevoComentario-${post.idPublicacion}" rows="2" placeholder="Escribe un comentario..."></textarea>
                                    <button class="btn btn-primary btn-sm mt-2" onclick="crearComentario(${post.idPublicacion}, $('#nuevoComentario-${post.idPublicacion}').val())">
                                        Comentar
                                    </button>
                                </div>
                                <div id="comentarios-${post.idPublicacion}">
                                    <!-- Aquí se cargarán los comentarios -->
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $('#post-individual-container').html(postHTML);
                cargarComentarios(post.idPublicacion);
            },
            error: function(error) {
                console.error('Error:', error);
                $('#post-individual-container').html('<p class="text-danger">Error al cargar la publicación.</p>');
            }
        });
    }
}

// Función 8 - Comentarios Publicos
function cargarComentarios(idPublicacion) {
    $.ajax({
        url: urlDominio + `/api/Comentarios/Publicacion/${idUsuarioSolicitante}/${idPublicacion}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            const comentariosContainer = $(`#comentarios-${idPublicacion}`);
            comentariosContainer.empty();

            if (response.length > 0) {
                $.each(response, function(index, comentario) {
                    const isMyComment = comentario.idUsuario === idUsuarioSolicitante;
                    let comentarioHTML = `
                            <div class="comentario mb-2 p-2 border-bottom">
                                <div class="d-flex justify-content-between">
                                    <strong>${comentario.nombre}</strong>
                                    ${isMyComment ? `
                                        <div class="btn-group">
                                            <button class="btn btn-sm btn-outline-primary" onclick="editarComentario(${comentario.idComentario})">
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarComentario(${comentario.idComentario}, ${idPublicacion})">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ` : ''}
                                </div>
                            <p class="mb-1">${comentario.contenido}</p>
                            <small class="text-muted">${comentario.fechaCreacion}</small>
                        </div>
                    `;
                    comentariosContainer.append(comentarioHTML);
                });
            } else {
                comentariosContainer.html('<p class="text-muted">No hay comentarios aún.</p>');
            }
        },
        error: function(error) {
            console.error('Error al cargar comentarios:', error);
        }
    });
}


// Funcion 9 - Crear comentario
function crearComentario(idPublicacion, contenido) {
    if (contenido.trim() === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'El comentario no puede estar vacío'
        });
        return;
    }

    $.ajax({
        url: urlDominio + '/api/Comentarios',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            idPublicacion: idPublicacion,
            idUsuario: idUsuarioSolicitante,
            llave_Secreta: llaveSecreta,
            contenido: contenido
        }),
        success: function(response) {
            Swal.fire({
                icon: 'success',
                title: 'Comentario publicado',
                showConfirmButton: false,
                timer: 1500
            });
            $(`#nuevoComentario-${idPublicacion}`).val('');
            cargarComentarios(idPublicacion);
        },
        error: function(error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo publicar el comentario'
            });
        }
    });
}

// Función 9 - Eliminar comentario
function eliminarComentario(idComentario, idPublicacion) {
    Swal.fire({
        title: '¿Eliminar comentario?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: urlDominio + `/api/Comentarios/${idComentario}`,
                method: 'DELETE',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    idComentario: idComentario,
                    idUsuario: idUsuarioSolicitante,
                    llave_Secreta: llaveSecreta
                }),
                success: function() {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: 'El comentario ha sido eliminado.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    cargarComentarios(idPublicacion);
                },
                error: function(error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo eliminar el comentario'
                    });
                    console.error('Error al eliminar:', error);
                }
            });
        }
    });
}

// Función 10 - Editar comentario
function editarComentario(idComentario) {
    $.ajax({
        url: urlDominio + `/api/Comentarios/${idUsuarioSolicitante}/${idComentario}`,
        type: 'GET',
        dataType: 'json',
        success: function(comentario) {
            Swal.fire({
                title: 'Editar comentario',
                input: 'textarea',
                inputValue: comentario.contenido,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                inputValidator: (value) => {
                    if (!value.trim()) {
                        return 'El comentario no puede estar vacío';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: urlDominio + `/api/Comentarios/${idComentario}`,
                        method: 'PUT',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            idComentario: idComentario,
                            idUsuario: idUsuarioSolicitante,
                            llave_Secreta: llaveSecreta,
                            contenido: result.value
                        }),
                        success: function() {
                            Swal.fire({
                                icon: 'success',
                                title: 'Comentario actualizado',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            cargarComentarios(comentario.idPublicacion);
                        },
                        error: function() {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'No se pudo actualizar el comentario'
                            });
                        }
                    });
                }
            });
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar el comentario'
            });
        }
    });
}

function verPublicacionIndividual(idPublicacion) {
    localStorage.setItem('verPublicacionId', idPublicacion);
    window.location.href = 'post.html';
}

// Cargar publicaciones favoritas al cargar la página de favoritos
if (window.location.pathname.includes('favoritos.html')) {
    cargarPublicacionesFavoritas();
}



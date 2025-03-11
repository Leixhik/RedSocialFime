// Variables globales
const idUsuarioSolicitante = 1822271;
const llaveSecreta = '5653714b-385d-4ce5-82a2-06e084a51034';
const urlDominio = "https://redsocial.luislepe.tech";

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
                                        <h5 class="card-title mb-0">${post.nombre}</h5>
                                        ${isMyPost ? `
                                            <div class="btn-group">
                                                <button class="btn btn-primary btn-sm" onclick="editarPublicacion(${post.idPublicacion})">
                                                    <i class="bi bi-pencil"></i> Editar
                                                </button>
                                            </div>
                                        ` : ''}
                                    </div>
                                    <h6 class="card-title mb-0">${post.idUsuario}</h6>
                                    <p class="card-text">${post.contenido}</p>
                                    <p class="text-muted small">${post.fechaCreacion}</p>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-outline-primary btn-sm">
                                            <i class="bi bi-hand-thumbs-up"></i>${post.cantidadLikes} Me Gusta
                                        </button>
                                        <button class="btn btn-outline-secondary btn-sm">
                                            <i class="bi bi-chat"></i>${post.cantidadComentarios} Comentar
                                        </button>
                                    </div>
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
            })
        }).done(function (result) {
            crearPublicacion(result);
            $("#nuevaPublicacion").val('');
            Swal.fire({
                icon: 'success',
                title: 'Publicación exitosa',
                text: 'Tu publicación se ha creado con éxito.',
            });
        }).fail(function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al publicar',
                text: `Ocurrió un error al intentar publicar: ${error}`,
            });
        });
    }
    $("#btnPublicar").on("click", function () {  // Ya jala, da el error de.fail con aviso de contenido vacío.
        const contenido = $("#nuevaPublicacion").val();
        if (contenido.trim() !== "") {
            crearPublicacion(contenido);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'No se puede publicar vacío',
                text: 'Ingresa un contenido para tu publicación.',
            });
        }
    });

    // Función 3 - Ver mis publicaciones en perfil + botón de editar y mandar a publicaciones.html // ya jala
    function miPublicacion() {
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
                                        <h5 class="card-title mb-0">${post.nombre}</h5>
                                        <div class="btn-group">
                                            <button class="btn btn-primary btn-sm" class= "btnEditar" onclick="editarPublicacion(${post.idPublicacion})">
                                                <i class="bi bi-pencil"></i> Editar
                                            </button>
                                        </div>
                                    </div>
                                    <h6 class="card-title mb-0">${post.idUsuario}</h6>
                                    <p class="card-text">${post.contenido}</p>
                                    <p class="text-muted small">${post.fechaCreacion}</p>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-outline-primary btn-sm">
                                            <i class="bi bi-hand-thumbs-up"></i> ${post.cantidadLikes} Me Gusta
                                        </button>
                                        <button class="btn btn-outline-secondary btn-sm">
                                            <i class="bi bi-chat"></i> ${post.cantidadComentarios} Comentar
                                        </button>
                                    </div>
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

// Funcion 4 - Editar Publicación
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
                                        <div class="btn-group">
                                            <button class="btn btn-primary btn-sm" class= "btnEditar" onclick="editarPublicacion(${post.idPublicacion})">
                                                <i class="bi bi-pencil"></i> Editar
                                            </button>
                                        </div>
                                    </div>
                                    <h6 class="card-title mb-0">${post.idUsuario}</h6>
                                    <p class="card-text">${post.contenido}</p>
                                    <p class="text-muted small">${post.fechaCreacion}</p>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-outline-primary btn-sm">
                                            <i class="bi bi-hand-thumbs-up"></i> ${post.cantidadLikes} Me Gusta
                                        </button>
                                        <button class="btn btn-outline-secondary btn-sm">
                                            <i class="bi bi-chat"></i> ${post.cantidadComentarios} Comentar
                                        </button>
                                    </div>
                                </div>
                            </div>
                                <button class="btn btn-primary" onclick="guardarEdicion(${post.idPublicacion})">
                                    Guardar cambios
                                </button>
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


// Funcion 4.5 - Guardar publicacion
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

// Add this at the end of your $(document).ready function
if (window.location.pathname.includes('publicaciones.html')) {
    cargarPublicacionParaEditar();
}

// funcion para likes
function like() {

}
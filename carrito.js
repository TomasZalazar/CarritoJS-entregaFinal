let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const gradient = `linear-gradient(to right, #007bff, var(--clr-main))`;

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}">Eliminar</button>
            `;

            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: gradient,
            borderRadius: "1rem",
            textTransform: "uppercase",
            fontSize: "1rem"
        },
        offset: {
            x: '5rem',
            y: '8rem'
        },
        onClick: function () { }
    }).showToast();

    const idBoton = e.currentTarget.id;
    const producto = productosEnCarrito.find((p) => p.id === idBoton);

    if (producto) {
        producto.cantidad > 1 ? (producto.cantidad -= 1) : productosEnCarrito.splice(productosEnCarrito.indexOf(producto), 1);
        cargarProductosCarrito();
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    }
}

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonColor: "#007bff",
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    });
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    mostrarFormulario();
}

function validarCampos(campos) {
    const camposRequeridos = {
        nombre: "Nombre",
        apellido: "Apellido",
        tarjeta: "Tarjeta de Crédito",
        fechaNacimiento: "Fecha de Nacimiento",
        telefono: "Teléfono"
    };

    const errores = [];

    for (const campo in camposRequeridos) {
        const valor = campos[campo].trim();

        if (valor === "") {
            errores.push(`Por favor, ingresa ${camposRequeridos[campo]}.`);
        }

        if (campo === "tarjeta") {
            const tarjetaLimpia = valor.replace(/[\s-]/g, '');
            const regexTarjeta = /^\d{16}$/;

            if (tarjetaLimpia.length !== 16 || !regexTarjeta.test(tarjetaLimpia)) {
                errores.push(`Por favor, ingresa una tarjeta válida de 16 dígitos en ${camposRequeridos[campo]}.`);
            }
        }

        if (campo === "telefono") {
            const regexTelefono = /^\d{10}$/;

            if (!regexTelefono.test(valor)) {
                errores.push(`Por favor, ingresa un número de teléfono válido de 10 dígitos en ${camposRequeridos[campo]}.`);
            }
        }
    }

    return errores;
}

function mostrarFormulario() {
    Swal.fire({
        title: 'Verificación de Datos',
        html:
            '<form id="verificacionDatos">' +
            '<label for="nombre">Nombre:</label>' +
            '<input type="text" id="nombre" class="swal2-input" required>' +

            '<label for="apellido">Apellido:</label>' +
            '<input type="text" id="apellido" class="swal2-input" required>' +

            '<label for="tarjeta">Tarjeta de Crédito:</label>' +
            '<input type="text" id="tarjeta" class="swal2-input" pattern="[0-9]{16}" title="Número de tarjeta de crédito válido (16 dígitos)" required>' +

            '<label for="fechaNacimiento">Fecha de Nacimiento:</label>' +
            '<input type="date" id="fechaNacimiento" class="swal2-input" required>' +

            '<label for="telefono">Teléfono:</label>' +
            '<input type="tel" id="telefono" class="swal2-input" pattern="[0-9]{10}" title="Número de teléfono válido (10 dígitos)" required>' +
            '</form>',
        focusConfirm: false,
        preConfirm: () => {
            return {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                tarjeta: document.getElementById('tarjeta').value,
                fechaNacimiento: document.getElementById('fechaNacimiento').value,
                telefono: document.getElementById('telefono').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const errores = validarCampos(result.value);

            if (errores.length === 0) {
                Swal.fire('¡Compra exitosa!', 'Datos verificados.', 'success');
                productosEnCarrito.length = 0;
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                cargarProductosCarrito();
                contenedorCarritoVacio.classList.add("disabled");
                contenedorCarritoProductos.classList.add("disabled");
                contenedorCarritoAcciones.classList.add("disabled");
                contenedorCarritoComprado.classList.remove("disabled");
            } else {
                Swal.fire({
                    title: 'Error en el formulario',
                    icon: 'error',
                    html: errores.join('<br>')
                });
            }
        }
    });
}
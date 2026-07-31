// ============================================
// CATÁLOGO DE PRODUCTOS
// Cada producto es un objeto con la info que necesita
// tanto el catálogo como el carrito.
// La categoría se usa para agrupar en secciones: fuertes, bebidas, postres
// ============================================
const productos = [
  {
    id: 1,
    nombre: "Risotto de trufa negra",
    descripcion: "Arroz arborio, trufa negra, parmesano 24 meses",
    precio: 68000,
    imagen: "/IMG/rissoto.png",
    categoria: "fuertes",
    estrellas: 3
  },
  {
    id: 2,
    nombre: "Solomillo Wellington",
    descripcion: "Solomillo de res, hojaldre, duxelles de champiñón",
    precio: 92000,
    imagen: "/IMG/solomillo.jpg",
    categoria: "fuertes",
    estrellas: 2
  },
  {
    id: 3,
    nombre: "Vino tinto reserva",
    descripcion: "Copa de vino tinto de la casa, cosecha seleccionada",
    precio: 35000,
    imagen: "/img/vino.jpg",
    categoria: "bebidas",
    estrellas: 1
  },
  {
    id: 4,
    nombre: "Agua mineral premium",
    descripcion: "Agua con gas importada, servida con limón",
    precio: 12000,
    imagen: "/img/agua.jpg",
    categoria: "bebidas",
    estrellas: 1
  },
  {
    id: 5,
    nombre: "Soufflé de chocolate",
    descripcion: "Soufflé tibio, centro líquido, helado de vainilla",
    precio: 32000,
    imagen: "/img/souffle.jpg",
    categoria: "postres",
    estrellas: 3
  },
  {
    id: 6,
    nombre: "Tarta de limón y merengue",
    descripcion: "Base crocante, crema de limón, merengue flambeado",
    precio: 28000,
    imagen: "/img/tarta.jpg",
    categoria: "postres",
    estrellas: 2
  }
];

// ============================================
// ESTADO DEL CARRITO
// Se carga desde localStorage al iniciar (o queda vacío si no hay nada guardado)
// Esta línea es la que hace que el carrito "persista" al recargar la página
// ============================================
let carrito = JSON.parse(localStorage.getItem("carritoMichelin")) || [];

// Guarda el estado actual del carrito en localStorage
// Se llama cada vez que el carrito cambia (agregar, quitar, cambiar cantidad)
function guardarCarrito() {
  localStorage.setItem("carritoMichelin", JSON.stringify(carrito));
}

// ============================================
// RENDERIZADO DINÁMICO DEL CATÁLOGO
// Agrupa los productos por categoría y genera el HTML de cada sección
// ============================================
function renderizarCatalogo() {
  const categorias = [
    { clave: "fuertes", titulo: "Fuertes" },
    { clave: "bebidas", titulo: "Bebidas" },
    { clave: "postres", titulo: "Postres" }
  ];

  categorias.forEach(function (cat) {
    const contenedor = document.getElementById("catalogo-" + cat.clave);
    if (!contenedor) return;

    const productosCategoria = productos.filter(function (p) {
      return p.categoria === cat.clave;
    });

    contenedor.innerHTML = productosCategoria
      .map(function (producto) {
        const estrellasHtml = "★".repeat(producto.estrellas);
        return `
          <article class="tarjeta-producto" aria-label="${producto.nombre}">
            <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
            <div class="tarjeta-producto-info">
              <span class="tarjeta-producto-estrellas" aria-hidden="true">${estrellasHtml}</span>
              <h3>${producto.nombre}</h3>
              <p class="tarjeta-producto-desc">${producto.descripcion}</p>
              <p class="tarjeta-producto-precio">$${formatearPrecio(producto.precio)}</p>
              <button class="btn-agregar" data-id="${producto.id}">
                Agregar al carrito
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  });
}

// ============================================
// LÓGICA DEL CARRITO
// ============================================

// Agrega un producto al carrito por su id.
// Si ya existe, aumenta la cantidad en vez de duplicar la fila.
function agregarAlCarrito(idProducto) {
  const producto = productos.find(function (p) {
    return p.id === idProducto;
  });
  if (!producto) return;

  const itemExistente = carrito.find(function (item) {
    return item.id === idProducto;
  });

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
  }

  guardarCarrito();
  renderizarCarrito();
  actualizarContadorCarrito();
  animarBotonCarrito();
}

// Elimina un producto completamente del carrito
function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter(function (item) {
    return item.id !== idProducto;
  });
  guardarCarrito();
  renderizarCarrito();
  actualizarContadorCarrito();
}

// Cambia la cantidad de un producto (+1 o -1)
// Si la cantidad llega a 0, el producto se elimina solo
function cambiarCantidad(idProducto, delta) {
  const item = carrito.find(function (i) {
    return i.id === idProducto;
  });
  if (!item) return;

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    eliminarDelCarrito(idProducto);
    return;
  }

  guardarCarrito();
  renderizarCarrito();
  actualizarContadorCarrito();
}

// Suma el total a pagar (precio x cantidad de cada item)
function calcularTotal() {
  return carrito.reduce(function (acumulado, item) {
    return acumulado + item.precio * item.cantidad;
  }, 0);
}

// Formatea números como precio en pesos, ej: 68000 -> "68.000"
function formatearPrecio(numero) {
  return numero.toLocaleString("es-CO");
}

// Dibuja el contenido del carrito dentro del drawer
function renderizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalEl = document.getElementById("carrito-total");
  if (!lista || !totalEl) return;

  if (carrito.length === 0) {
    lista.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío.</p>`;
    totalEl.textContent = "$0";
    return;
  }

  lista.innerHTML = carrito
    .map(function (item) {
      return `
        <div class="item-carrito" data-id="${item.id}">
          <img src="${item.imagen}" alt="${item.nombre}">
          <div class="item-carrito-info">
            <p class="item-carrito-nombre">${item.nombre}</p>
            <p class="item-carrito-precio">$${formatearPrecio(item.precio)}</p>
            <div class="item-carrito-cantidad">
              <button class="btn-restar" data-id="${item.id}" aria-label="Quitar uno">-</button>
              <span>${item.cantidad}</span>
              <button class="btn-sumar" data-id="${item.id}" aria-label="Agregar uno">+</button>
            </div>
          </div>
          <button class="btn-eliminar" data-id="${item.id}" aria-label="Eliminar producto">✕</button>
        </div>
      `;
    })
    .join("");

  totalEl.textContent = "$" + formatearPrecio(calcularTotal());
}

// Actualiza el número que aparece sobre el ícono del carrito en el navbar
function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;
  const totalItems = carrito.reduce(function (acc, item) {
    return acc + item.cantidad;
  }, 0);
  contador.textContent = totalItems;
  contador.style.display = totalItems > 0 ? "flex" : "none";
}

// Pequeña animación de feedback cuando se agrega un producto
function animarBotonCarrito() {
  const icono = document.getElementById("icono-carrito");
  if (!icono) return;
  icono.classList.add("carrito-pulso");
  setTimeout(function () {
    icono.classList.remove("carrito-pulso");
  }, 300);
}

// ============================================
// ABRIR / CERRAR EL DRAWER DEL CARRITO
// ============================================
function toggleCarrito() {
  const drawer = document.getElementById("drawer-carrito");
  const overlay = document.getElementById("overlay-carrito");
  const abierto = drawer.classList.toggle("abierto");
  overlay.classList.toggle("visible", abierto);
  drawer.setAttribute("aria-hidden", String(!abierto));
}

// ============================================
// INICIALIZACIÓN
// Usamos "delegación de eventos": en vez de poner un listener a cada
// botón (que se regeneran cada vez que se renderiza), escuchamos los
// clics en el documento y revisamos qué botón fue el que se presionó.
// Esto es clave porque los botones de agregar/quitar se crean dinámicamente.
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  renderizarCatalogo();
  renderizarCarrito();
  actualizarContadorCarrito();

  document.getElementById("icono-carrito").addEventListener("click", toggleCarrito);
  document.getElementById("cerrar-carrito").addEventListener("click", toggleCarrito);
  document.getElementById("overlay-carrito").addEventListener("click", toggleCarrito);

  document.addEventListener("click", function (evento) {
    const boton = evento.target;

    if (boton.classList.contains("btn-agregar")) {
      agregarAlCarrito(Number(boton.dataset.id));
    }
    if (boton.classList.contains("btn-eliminar")) {
      eliminarDelCarrito(Number(boton.dataset.id));
    }
    if (boton.classList.contains("btn-sumar")) {
      cambiarCantidad(Number(boton.dataset.id), 1);
    }
    if (boton.classList.contains("btn-restar")) {
      cambiarCantidad(Number(boton.dataset.id), -1);
    }
  });
});
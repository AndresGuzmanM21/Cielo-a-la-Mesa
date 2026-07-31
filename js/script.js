// Buscamos la hamburguesa
const hamburguesa = document.getElementById("hamburguesa");

// Buscamos el menu
const menuDesplegable = document.getElementById("menuDesplegable");


// Abrimos o cerramos el menu
hamburguesa.addEventListener("click", function () {

  menuDesplegable.classList.toggle("mostrar");

});


// Buscamos los enlaces del menu
const enlaces = document.querySelectorAll(".menu-desplegable a");


// Cerramos el menu despues de escoger una opcion
enlaces.forEach(function (enlace) {

  enlace.addEventListener("click", function () {

    menuDesplegable.classList.remove("mostrar");

  });

});
/**
 * Código para integrar la aplicación principal con la aplicación de procesamiento de imágenes
 * Este archivo debe copiarse y pegarse en el proyecto de la aplicación grande
 */

/**
 * Función onOpen para añadir opciones de menú en la aplicación grande
 * Llama a esta función desde tu función onOpen existente o úsala directamente
 */
function agregarMenuProcesadorImagenes() {
  var ui = SpreadsheetApp.getUi();
  
  // Crear un menú nuevo o añadir elementos a uno existente
  ui.createMenu('Herramientas Avanzadas')
    .addItem('Procesar Imagen de Cuadro', 'abrirProcesadorImagenes')
    .addItem('Convertir Tabla', 'abrirProcesadorImagenes')
    .addToUi();
  
  // Alternativa: añadir a un menú existente
  // var menu = ui.createMenu('Tu Menú Existente');
  // menu.addSeparator();
  // menu.addItem('Procesar Imagen de Cuadro', 'abrirProcesadorImagenes');
  // menu.addItem('Convertir Tabla', 'abrirProcesadorImagenes');
  // menu.addToUi();
}

/**
 * Función para abrir la aplicación de procesamiento de imágenes
 * Esta función simplemente abre la aplicación en una nueva ventana
 */
function abrirProcesadorImagenes() {
  // URL actualizada de la aplicación web implementada
  var url = "https://script.google.com/macros/s/AKfycby2Mc15xSV37hn6u2pusSSA6gV6Zun60rDdekHH8QjgHuFjUR7nL4NM7cSqOEbKi91jhg/exec";
  
  // Abrir la URL directamente
  var html = HtmlService.createHtmlOutput(
    '<script>' +
    'window.open("' + url + '", "_blank");' +
    '</script>'
  )
  .setWidth(1)
  .setHeight(1);
  
  // Mostrar un diálogo temporal
  SpreadsheetApp.getUi().showModalDialog(html, 'Abriendo Procesador de Imágenes...');
}

/**
 * Instrucciones de uso:
 * 
 * 1. Copia todo este código en tu proyecto de Apps Script de la aplicación grande
 * 2. Llama a la función 'agregarMenuProcesadorImagenes()' desde tu función onOpen existente
 * 3. Si prefieres integrar directamente, puedes copiar el contenido de las funciones en tus propios archivos
 * 
 * La primera vez que un usuario utilice esta función, deberá autorizar el acceso
 * Esto es normal para aplicaciones de Google Apps Script
 */ 
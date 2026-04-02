/**
 * CalculArgila - Gestor de Figuras de Arcila
 * Code.gs
 * 
 * Este script gestiona la creación y manipulación de datos en Google Sheets
 * para la aplicación CalculArgila. Incluye funciones para manejar grupos, etiquetas,
 * figuras, talleres y configuraciones.
 */

/**
 * Función que se ejecuta al abrir el libro de Google Sheets.
 * Añade un menú personalizado para acceder a CalculArgila.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('CalculArgila')
    .addItem('Abrir Gestor', 'showSidebar')
    .addItem('Inicializar Hojas', 'initializeSheets')
    .addSeparator()
    .addItem('Generar Ficha', 'showSidebar') // Usa el mismo sidebar
    .addToUi();
}

/**
 * Muestra la barra lateral de CalculArgila en Google Sheets.
 */
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Index') // Asegúrate de tener un archivo Index.html
      .setTitle('CalculArgila - Gestor de Figuras de Arcila')
      .setWidth(1200);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Función de inicialización para crear todas las hojas necesarias.
 * Puedes ejecutarla manualmente desde el menú "CalculArgila > Inicializar Hojas".
 */
function initializeSheets() {
  // Después
  const sheetNames = ['Grupos', 'Figuras', 'Config', 'Talleres'];
  sheetNames.forEach(sheetName => {
    getOrCreateSheet(sheetName);
  });
  
  Logger.log('Todas las hojas necesarias han sido inicializadas.');
  SpreadsheetApp.getUi().alert('Todas las hojas necesarias han sido inicializadas.');
}

/**
 * Obtiene o crea una hoja específica si no existe.
 * @param {string} sheetName - Nombre de la hoja.
 * @returns {Sheet} - Objeto de la hoja.
 */
function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);

    // Configurar encabezados según la hoja
    switch(sheetName) {
      case 'Figuras':
        sheet.appendRow(['ID', 'Nombre', 'Parte', 'Detalles', 'Datos', 'Fecha Creación', 'Peso Total']);
        break;

      case 'Grupos':
        sheet.appendRow(['Grupo', 'Parte']);
        break;
      case 'Config':
        sheet.appendRow(['Letra', 'Peso']);
        // Inicializar pesos si la hoja está vacía
        const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const pesosIniciales = [10, 15, 20, 25, 30, 35, 40, 45];
        letras.forEach((letra, index) => {
          sheet.appendRow([letra, pesosIniciales[index]]);
        });
        // Inicializar el número de barreja si no existe
        sheet.appendRow(['Barreja', 1]);
        break;
      case 'Talleres':
        sheet.appendRow(['Fecha', 'Escuela', 'Curso', 'Alumnos', 'Figura', 'Color Totales', 'Mezclas']);
        break;
      default:
        // No hacer nada para hojas no reconocidas
        break;
    }
  }

  return sheet;
}


/**
 * Obtiene los pesos asociados a cada letra desde la hoja "Config".
 * @param {string} letra - Letra de la que se desea obtener el peso.
 * @returns {number} - Peso de la letra.
 */
function getPesoLetra(letra) {
  const pesos = getLetterWeights();
  return pesos[letra] || 0;
}

/**
 * Obtiene los pesos actuales de las letras desde la hoja "Config".
 * @returns {Object} - Objeto con las letras y sus pesos.
 */
function getLetterWeights() {
  const sheet = getOrCreateSheet('Config');
  const data = sheet.getDataRange().getValues();
  const pesos = {};

  for (let i = 1; i < data.length; i++) {
    const letra = data[i][0];
    const peso = parseFloat(data[i][1]);
    if (letra && !isNaN(peso)) {
      pesos[letra] = peso;
    }
  }

  return pesos;
}

/**
 * Actualiza los pesos de las letras en la hoja "Config".
 * @param {Object} nuevosPesos - Objeto con las letras y sus nuevos pesos.
 */
function updateLetterWeights(nuevosPesos) {
  const sheet = getOrCreateSheet('Config');
  const data = sheet.getDataRange().getValues();

  // Actualizar cada letra con el nuevo peso
  for (let i = 1; i < data.length; i++) {
    const letra = data[i][0];
    if (nuevosPesos.hasOwnProperty(letra)) {
      const nuevoPeso = parseFloat(nuevosPesos[letra]);
      if (!isNaN(nuevoPeso)) {
        sheet.getRange(i + 1, 2).setValue(nuevoPeso);
      }
    }
  }
}

/**
 * Obtiene todos los grupos y sus etiquetas desde la hoja "Grupos".
 * @returns {Object} - Objeto con grupos como claves y arrays de etiquetas como valores.
 */
function getGroups() {
  const sheet = getOrCreateSheet('Grupos');
  const data = sheet.getDataRange().getValues();
  const groups = {};

  for (let i = 1; i < data.length; i++) {
    const groupName = data[i][0];
    const tagName = data[i][1];
    if (groupName) {
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      if (tagName) {
        groups[groupName].push(tagName);
      }
    }
  }

  return groups;
}

/**
 * Añade un nuevo grupo de etiquetas en la hoja "Grupos".
 * @param {string} groupName - Nombre del nuevo grupo.
 */
function addGroup(groupName) {
  if (!groupName) return;

  const sheet = getOrCreateSheet('Grupos');
  const data = sheet.getDataRange().getValues();

  // Verificar si el grupo ya existe
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === groupName) {
      // Grupo ya existe
      return;
    }
  }

  // Añadir el nuevo grupo con una fila vacía para las partes
  sheet.appendRow([groupName, '']);
}

/**
 * Añade una nueva etiqueta a un grupo específico.
 * @param {string} groupName - Nombre del grupo.
 * @param {string} tagName - Nombre de la etiqueta a añadir.
 */
function addTag(groupName, tagName) {
  if (!groupName || !tagName) return;

  const sheet = getOrCreateSheet('Grupos');
  const data = sheet.getDataRange().getValues();

  // Verificar si el grupo existe
  let groupExists = false;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === groupName) {
      groupExists = true;
      break;
    }
  }

  if (!groupExists) {
    // Si el grupo no existe, crearlo primero
    addGroup(groupName);
  }

  // Añadir la etiqueta al grupo
  sheet.appendRow([groupName, tagName]);
}

/**
 * Elimina un grupo y todas sus etiquetas asociadas.
 * @param {string} groupName - Nombre del grupo a eliminar.
 */
function deleteGroup(groupName) {
  try {
    const sheet = getOrCreateSheet('Grupos');
    const data = sheet.getDataRange().getValues();
    let rowsToDelete = [];
    
    // Encontrar todas las filas que pertenecen al grupo
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][0] === groupName) {
        rowsToDelete.push(i + 1); // +1 porque las filas en Sheets empiezan en 1
      }
    }
    
    // Eliminar las filas en orden descendente para no afectar los índices
    rowsToDelete.sort((a, b) => b - a).forEach(row => {
      sheet.deleteRow(row);
    });
    
    return true;
  } catch (error) {
    Logger.log('Error al eliminar grupo:', error.message);
    throw new Error('No se pudo eliminar el grupo: ' + error.message);
  }
}

/**
 * Elimina una etiqueta de un grupo específico.
 * @param {string} groupName - Nombre del grupo.
 * @param {string} tagName - Nombre de la etiqueta a eliminar.
 */
function removeTag(groupName, tagName) {
  if (!groupName || !tagName) return;

  const sheet = getOrCreateSheet('Grupos');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === groupName && data[i][1] === tagName) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

/**
 * Guarda o actualiza una figura en la hoja "Figuras".
 * @param {Object} data - Datos de la figura a guardar
 * @param {string} [existingId] - ID de la figura existente para actualizar
 * @returns {string} ID de la figura guardada
 */
function saveFigure(data, existingId = null) {
  try {
    if (!data || !Array.isArray(data.rows)) {
      throw new Error('Datos de figura inválidos');
    }

    const sheet = getOrCreateSheet('Figuras');
    const lastRow = sheet.getLastRow();
    
    // Preparar los datos de la fila
    const rowData = prepareRowData(data, existingId || ('F' + lastRow));

    if (existingId) {
      // Buscar y actualizar figura existente
      const values = sheet.getDataRange().getValues();
      for (let i = 1; i < values.length; i++) {
        if (values[i][0] === existingId) {
          sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
          return existingId;
        }
      }
      throw new Error('Figura no encontrada');
    } else {
      // Crear nueva figura
      sheet.appendRow(rowData);
      return rowData[0]; // Devolver el nuevo ID
    }
  } catch (error) {
    Logger.log('Error al guardar figura:', error);
    throw new Error('No se pudo guardar la figura: ' + error.message);
  }
}

/**
 * Prepara los datos de una fila para guardar
 * @param {Object} data - Datos de la figura
 * @param {string} figureId - ID de la figura
 * @returns {Array} Datos preparados para la fila
 */
function prepareRowData(data, figureId) {
  if (!data.rows || !Array.isArray(data.rows)) {
    throw new Error('Formato de datos inválido');
  }

  const rows = data.rows.map(row => ({
    part: row.part || '',
    details: row.details || '',
    color: row.color || 'blanco',
    units: row.units || '1',
    letters: {
      A: parseFloat(row.letters?.A || 0),
      B: parseFloat(row.letters?.B || 0),
      C: parseFloat(row.letters?.C || 0),
      D: parseFloat(row.letters?.D || 0),
      E: parseFloat(row.letters?.E || 0),
      F: parseFloat(row.letters?.F || 0),
      G: parseFloat(row.letters?.G || 0),
      H: parseFloat(row.letters?.H || 0)
    }
  }));

  const partes = rows.map(row => row.part).join('; ');
  const detalles = rows.map(row => row.details).join('; ');
  const jsonData = JSON.stringify(rows);

  return [
    figureId,
    data.name || 'Sin nombre',
    partes,
    detalles,
    jsonData,
    new Date(),
    calculateTotalWeight(rows)
  ];
}

function getFigureById(figureId) {
  try {
    const sheet = getOrCreateSheet('Figuras');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === figureId) {
        try {
          const rowsData = JSON.parse(data[i][4]);
          
          // Asegurar que cada fila mantenga sus valores decimales
          const rows = rowsData.map(row => ({
            part: row.part || '',
            details: row.details || '',
            color: row.color || 'blanco',
            units: parseFloat(row.units) || 1,
            letters: {
              "A": parseFloat(row.letters.A) || 0,
              "B": parseFloat(row.letters.B) || 0,
              "C": parseFloat(row.letters.C) || 0,
              "D": parseFloat(row.letters.D) || 0,
              "E": parseFloat(row.letters.E) || 0,
              "F": parseFloat(row.letters.F) || 0,
              "G": parseFloat(row.letters.G) || 0,
              "H": parseFloat(row.letters.H) || 0
            }
          }));

          return {
            id: data[i][0],
            name: data[i][1],
            rows: rows,
            fechaCreacion: data[i][5].toString(),
            pesoTotal: parseFloat(data[i][6]) || 0
          };

        } catch (e) {
          Logger.log('Error procesando datos:', e.message);
          throw e;
        }
      }
    }
    
    throw new Error('Figura no encontrada');
    
  } catch (error) {
    Logger.log('Error en getFigureById:', error.message);
    throw error;
  }
}

/**
 * Obtiene la lista de todas las figuras.
 * @returns {Array} Lista de figuras con ID y nombre.
 */
function getFigures() {
  try {
    const sheet = getOrCreateSheet('Figuras');
    const data = sheet.getDataRange().getValues();
    const figuras = [];
    
    // Empezar desde 1 para saltar encabezados
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][1]) {
        figuras.push({
          id: data[i][0],
          name: data[i][1]
        });
      }
    }
    
    Logger.log('Figuras recuperadas: ' + figuras.length);
    return figuras;
    
  } catch (error) {
    Logger.log('Error al obtener lista de figuras: ' + error.message);
    return [];
  }
}


function inspectFigure(figureId) {
  const sheet = getOrCreateSheet('Figuras');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === figureId) {
      Logger.log('=== INSPECCIÓN DETALLADA DE FIGURA ===');
      Logger.log('Fila: ' + i);
      Logger.log('ID: ' + data[i][0]);
      Logger.log('Nombre: ' + data[i][1]);
      Logger.log('Parte: ' + data[i][2]);
      Logger.log('Detalles: ' + data[i][3]);
      Logger.log('Datos (columna E): ' + data[i][4]);
      Logger.log('Fecha: ' + data[i][5]);
      Logger.log('Peso: ' + data[i][6]);
      
      // Intentar validar el JSON
      try {
        if (data[i][4]) {
          const jsonData = JSON.parse(data[i][4]);
          Logger.log('JSON válido. Estructura:');
          Logger.log(JSON.stringify(jsonData, null, 2));
        } else {
          Logger.log('NO HAY DATOS JSON EN LA COLUMNA');
        }
      } catch (e) {
        Logger.log('ERROR AL PARSEAR JSON: ' + e.message);
      }
      return;
    }
  }
  Logger.log('Figura no encontrada');
}

function debugSheetData() {
  const sheet = getOrCreateSheet('Figuras');
  const data = sheet.getDataRange().getValues();
  
  Logger.log('=== CONTENIDO DE LA HOJA FIGURAS ===');
  data.forEach((row, index) => {
    Logger.log(`Fila ${index}:
` + 
      `  ID: ${row[0]}
` + 
      `  Nombre: ${row[1]}
` + 
      `  Parte: ${row[2]}
` + 
      `  Detalles: ${row[3]}
` + 
      `  Datos JSON: ${row[4]}
` + 
      `  ---
`);
  });
}
/**
 * Genera una ficha de figura
 * @param {Object} data - Datos de la figura
 * @returns {HtmlOutput} Página HTML de la ficha
 */
function generarFichaFigura(data) {
  const template = HtmlService.createTemplateFromFile('FichaFigura');
  template.figura = data;
  return template.evaluate()
      .setTitle('Ficha de Figura - ' + data.name)
      .getContent();
}
/**
 * Calcula el peso total de una figura
 * @param {Array} rows - Filas de datos de la figura
 * @returns {number} - Peso total calculado
 */
function calculateTotalWeight(rows) {
  let totalWeight = 0;
  rows.forEach(row => {
    const units = parseInt(row.units) || 0;
    let rowWeight = 0;
    for (const letter in row.letters) {
      rowWeight += (row.letters[letter] || 0) * getPesoLetra(letter);
    }
    totalWeight += rowWeight * units;
  });
  return parseFloat(totalWeight.toFixed(2));
}

/**
 * Guarda los datos de talleres en la hoja "Talleres".
 * @param {Object} data - Datos de talleres a guardar.
 */
function saveTalleres(data) {
  try {
    const sheet = getOrCreateSheet('Talleres');
    const now = new Date(); // Crear la fecha en el backend
    
    // Preparar la fila para añadir
    const rowData = [
      now,                                     // Fecha
      data.schoolName,                         // Escuela
      data.courseName,                         // Curso
      parseInt(data.studentCount) || 0,        // Alumnos (como número)
      data.figureName,                         // Figura
      JSON.stringify(data.colorTotals),        // Color Totales
      JSON.stringify(data.mezclas)             // Mezclas
    ];
    
    // Añadir la nueva fila
    sheet.appendRow(rowData);
    
    // Formatear la fecha en la primera columna
    const lastRow = sheet.getLastRow();
    const dateCell = sheet.getRange(lastRow, 1);
    dateCell.setNumberFormat('dd/mm/yyyy hh:mm');
    
    // Ajustar el ancho de las columnas para mejor visibilidad
    sheet.autoResizeColumns(1, 7);
    
  } catch (error) {
    Logger.log('Error al guardar talleres:', error.message);
    throw new Error('No se pudo guardar los datos de talleres: ' + error.message);
  }
}

/**
 * Incrementa el número de barreja en la hoja "Config".
 * @returns {number} - Nuevo número de barreja.
 */
function incrementBarrejaNumber() {
  const sheet = getOrCreateSheet('Config');
  const data = sheet.getDataRange().getValues();
  let currentNumber = 1; // Número inicial

  // Buscar la última barreja y obtener el siguiente número
  for (let i = 1; i < data.length; i++) {
    const letra = data[i][0];
    if (letra === 'Barreja') {
      const numero = parseInt(data[i][1]) || 0;
      if (numero >= currentNumber) {
        currentNumber = numero + 1;
      }
    }
  }

  // Añadir o actualizar el número de barreja
  let barrejaRow = null;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'Barreja') {
      barrejaRow = i + 1;
      break;
    }
  }

  if (barrejaRow) {
    sheet.getRange(barrejaRow, 2).setValue(currentNumber);
  } else {
    // Si no existe, añadir una nueva fila para Barreja
    sheet.appendRow(['Barreja', currentNumber]);
  }

  return currentNumber;
}

/**
 * Obtiene el número actual de barreja desde la hoja "Config".
 * @returns {number} - Número actual de barreja.
 */
function getCurrentBarrejaNumber() {
  const sheet = getOrCreateSheet('Config');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'Barreja') {
      return parseInt(data[i][1]) || 1;
    }
  }

  // Si no existe, iniciar en 1
  sheet.appendRow(['Barreja', 1]);
  return 1;
}

function testFigureData(figureId) {
  const sheet = getOrCreateSheet('Figuras');
  const data = sheet.getDataRange().getValues();
  
  Logger.log('=== Test de Datos de Figura ===');
  Logger.log('Total de filas en la hoja: ' + data.length);
  Logger.log('Buscando figura con ID: ' + figureId);
  
  // Mostrar todas las filas para debugging
  data.forEach((row, index) => {
    Logger.log(`Fila ${index}:
` + 
      `ID: "${row[0]}"
` + 
      `Nombre: "${row[1]}"
` + 
      `Parte: "${row[2]}"
` + 
      `Detalles: "${row[3]}"
` + 
      `JSON: "${row[4]}"
` + 
      `---
`);
  });
  
  // Buscar la figura específica
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === figureId) {
      Logger.log('Encontrada figura en fila ' + i);
      try {
        const jsonData = JSON.parse(data[i][4]);
        Logger.log('JSON parseado correctamente:');
        Logger.log(JSON.stringify(jsonData, null, 2));
      } catch (e) {
        Logger.log('Error al parsear JSON: ' + e.message);
      }
      return;
    }
  }
  Logger.log('Figura no encontrada');
}

function test() {
  testFigureData('F1');
}
function debugFigure(figureId) {
  const sheet = getOrCreateSheet('Figuras');
  const data = sheet.getDataRange().getValues();
  
  Logger.log('=== DEBUG FIGURA ===');
  Logger.log('Buscando ID:', figureId);
  Logger.log('Total filas:', data.length);
  
  // Mostrar encabezados
  Logger.log('Encabezados:', data[0].join(', '));
  
  // Mostrar datos de cada fila
  data.forEach((row, index) => {
    if (index > 0) {  // Saltar encabezados
      Logger.log(`
Fila ${index}:
ID: "${row[0]}"
Nombre: "${row[1]}"
Parte: "${row[2]}"
Detalles: "${row[3]}"
JSON: "${row[4]}"`);
    }
  });
  
  // Intentar obtener la figura
  const figura = getFigureById(figureId);
  Logger.log('
Resultado de getFigureById:');
  Logger.log(JSON.stringify(figura, null, 2));
}

function testDebug() {
  debugFigure('F2');
}

// Constantes
const FOLDER_ID = '1_AXATW7deSiZe2Rgk-NWpLK3Ayk14QYm'; // Reemplazar con el ID real de la carpeta
const IMAGE_FOLDER_NAME = 'CalculArgila_Imagenes';

/**
 * Guarda una imagen en una carpeta específica de Google Drive.
 * @param {Blob|string} imageData - Blob de imagen o string en base64
 * @returns {Object} Objeto con la información de la imagen guardada
 */
function saveImage(imageData, customName) {
  try {
    // ID de la carpeta específica donde quieres guardar las imágenes
    const FOLDER_ID = '1_AXATW7deSiZe2Rgk-NWpLK3Ayk14QYm'; // Pon aquí el ID de tu carpeta
    
    // Obtener la carpeta específica
    const folder = DriveApp.getFolderById(FOLDER_ID);

    // Convertir el blob si viene como base64
    let imageBlob = imageData;
    if (typeof imageData === 'string' && imageData.indexOf('base64,') !== -1) {
      const base64Data = imageData.split('base64,')[1];
      imageBlob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'image/jpeg');
    }

    // Generar nombre del archivo
    const timestamp = new Date().getTime();
    const fileName = customName ? 
      `${customName}_${timestamp}.jpg` : 
      `figura_${timestamp}.jpg`;

    // Guardar archivo con el nombre personalizado
    const file = folder.createFile(imageBlob.setName(fileName));
    
    // Establecer permisos
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const fileId = file.getId();
    const publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    
    return {
      success: true,
      url: publicUrl,
      id: fileId,
      name: fileName
    };
  } catch (error) {
    Logger.log('Error al guardar la imagen: ' + error.message);
    throw new Error('Error al guardar la imagen: ' + error.message);
  }
}

/**
 * Obtiene la URL de visualización de una imagen por su ID
 * @param {string} fileId - ID del archivo en Google Drive
 * @returns {string} URL de visualización directa
 */
function getImageUrl(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } catch (error) {
    console.error('Error al obtener URL de imagen:', error);
    throw new Error(`Error al obtener URL de imagen: ${error.message}`);
  }
}

// Add to Code.gs

/**
 * Guarda una ficha como HTML en Google Drive
 * @param {Object} data Datos de la ficha
 * @returns {Object} Información del archivo guardado
 */
function guardarFichaHTML(data) {
  try {
    const folder = DriveApp.getFolderById(data.folderId);
    
    // Sanitize filename
    const filename = `Ficha_${data.nombre.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    
    // Add required meta tags and CSS to make it self-contained
    const fullHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha: ${data.nombre}</title>
    <style>
    ${data.styles}
    </style>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    ${data.html}
</body>
</html>`;

    // Create the file in Drive
    const htmlFile = folder.createFile(filename, fullHTML, 'text/html');
    htmlFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return {
      success: true,
      fileId: htmlFile.getId(),
      fileName: htmlFile.getName(),
      url: htmlFile.getUrl()
    };

  } catch (error) {
    Logger.log('Error al guardar ficha HTML:', error);
    throw new Error('No se pudo guardar la ficha HTML: ' + error.message);
  }
}

/**
 * Comparte una ficha HTML con un email específico
 * @param {Object} data Datos para compartir
 * @returns {Object} Resultado de la operación
 */
function compartirFichaHTML(data) {
  try {
    const folder = DriveApp.getFolderById(data.folderId);
    const files = folder.getFilesByName(`Ficha_${data.figuraNombre.replace(/[^a-zA-Z0-9]/g, '_')}.html`);
    
    if (!files.hasNext()) {
      throw new Error('No se encontró la ficha HTML');
    }
    
    const file = files.next();
    file.addViewer(data.email);
    const url = file.getUrl();
    
    // Enviar email con el link
    const subject = `Ficha de figura compartida: ${data.figuraNombre}`;
    const body = `
      Se ha compartido contigo la ficha de la figura "${data.figuraNombre}".
      
      Puedes acceder a la ficha aquí: ${url}
      
      Este es un mensaje automático, por favor no respondas a este email.
    `;
    
    MailApp.sendEmail(data.email, subject, body);
    
    return {
      success: true,
      url: url
    };
  } catch (error) {
    Logger.log('Error al compartir ficha HTML:', error);
    throw new Error('No se pudo compartir la ficha: ' + error.message);
  }
}

/**
 * Elimina una figura por su ID
 * @param {string} figureId - ID de la figura a eliminar
 * @returns {Object} Resultado de la operación
 */
function deleteFigure(figureId) {
  try {
    const sheet = getOrCreateSheet('Figuras');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === figureId) {
        sheet.deleteRow(i + 1);
        return {
          success: true,
          message: 'Figura eliminada correctamente'
        };
      }
    }
    
    throw new Error('Figura no encontrada');
    
  } catch (error) {
    Logger.log('Error al eliminar figura:', error.message);
    return {
      success: false,
      message: 'Error al eliminar la figura: ' + error.message
    };
  }
}

/**
 * Función doGet para desplegar CalculArgila como una aplicación web.
 * @param {Object} e - Objeto de evento de la solicitud GET.
 * @returns {HtmlOutput} - Salida HTML para la aplicación web.
 */
function doGet(e) {
  if (e.parameter.page === 'camera') {
    var template = HtmlService.createTemplateFromFile('CamaraPage');
    template.scriptUrl = ScriptApp.getService().getUrl();
    return template.evaluate()
      .setTitle('CalculArgila - Cámara')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  }
  
  // Retornar la página principal (Index)
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('CalculArgila - Gestor de Figuras de Arcila')
      .setWidth(1200)
      .setHeight(800)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Obtiene los datos de los talleres para la calculadora.
 * @returns {Array} Lista de objetos de taller.
 */
function getTalleresData() {
  try {
    const sheet = getOrCreateSheet('Talleres');
    const data = sheet.getDataRange().getValues();
    const talleres = [];
    
    // Empezar desde 1 para saltar encabezados
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] && data[i][2]) { // Asegurarse de que escuela y curso no estén vacíos
        talleres.push({
          id: `taller_${i}`,
          escuela: data[i][1],
          actividad: data[i][2],
          alumnos: data[i][3],
          figuras: data[i][4] 
        });
      }
    }
    return talleres;
  } catch (error) {
    Logger.log('Error en getTalleresData: ' + error.message);
    return [];
  }
}

/**
 * Busca figuras en la hoja "Figuras" cuyo nombre contenga una parte específica.
 * @param {string} namePart - La parte del nombre a buscar (ej: "JC1").
 * @returns {Array} - Un array de objetos de figura encontrados.
 */
function getFiguresByNamePart(namePart) {
  try {
    const sheet = getOrCreateSheet('Figuras');
    const data = sheet.getDataRange().getValues();
    const figures = [];
    
    for (let i = 1; i < data.length; i++) {
      const figureName = data[i][1]; // Columna "Nombre"
      if (figureName && figureName.includes(namePart)) {
        const figure = getFigureById(data[i][0]);
        if (figure) {
          figures.push(figure);
        }
      }
    }
    return figures;
  } catch (error) {
    Logger.log('Error en getFiguresByNamePart: ' + error.message);
    return [];
  }
}


/**
 * Calcula los materiales totales para un taller específico.
 * @param {Object} tallerData - Datos del taller seleccionado.
 * @returns {Object} - Objeto con los totales de color o un error.
 */
function calculateMaterialesTaller(tallerData) {
  try {
    const studentCount = parseInt(tallerData.alumnos);
    if (isNaN(studentCount) || studentCount <= 0) {
      throw new Error('Número de alumnos no válido.');
    }

    const activityMap = {
      'HC1': 'JC1',
      'HC2': 'JC2'
    };
    const activity = tallerData.actividad;
    const searchNamePart = activityMap[activity] || activity;

    const figuresToProcess = getFiguresByNamePart(searchNamePart);

    if (figuresToProcess.length === 0) {
      return { error: `No se encontraron figuras que contengan "${searchNamePart}" en su nombre.` };
    }

    const colorTotals = {};
    const weights = getLetterWeights();

    figuresToProcess.forEach(figure => {
      if (!figure.rows) return;

      figure.rows.forEach(row => {
        const color = row.color.toLowerCase();
        let totalAmountForColor = 0;

        for (const letter in row.letters) {
          const amount = parseFloat(row.letters[letter]) || 0;
          const weight = weights[letter] || 0;
          totalAmountForColor += amount * weight;
        }
        
        totalAmountForColor *= (parseFloat(row.units) || 1);

        if (!colorTotals[color]) {
          colorTotals[color] = 0;
        }
        colorTotals[color] += totalAmountForColor;
      });
    });

    for (const color in colorTotals) {
      colorTotals[color] *= studentCount;
    }

    return { colorTotals: colorTotals };

  } catch (error) {
    Logger.log('Error en calculateMaterialesTaller: ' + error.message);
    return { error: error.message };
  }
}
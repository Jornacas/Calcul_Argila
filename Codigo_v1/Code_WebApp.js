/**
 * CalculArgila - Web App para Convertidor JumpingClay
 * Code_WebApp.gs
 * 
 * Este script sirve el convertidor como una web app independiente
 * para evitar problemas de contexto y dependencias externas.
 */

/**
 * Función principal que se ejecuta cuando se accede a la web app
 */
function doGet() {
  try {
    // Cargar el HTML optimizado
    const htmlTemplate = HtmlService.createTemplateFromFile('SheetClayConverter_WebApp');
    
    // Configurar la web app
    const htmlOutput = htmlTemplate.evaluate()
      .setTitle('Convertidor JumpingClay - Eixos Creativa')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .addMetaTag('charset', 'UTF-8');
    
    return htmlOutput;
  } catch (error) {
    console.error('Error en doGet:', error);
    
    // Fallback: mostrar página de error
    return HtmlService.createHtmlOutput(`
      <html>
        <head>
          <title>Error - Convertidor JumpingClay</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
            .error { color: red; margin: 20px 0; }
            .retry { background: #2196F3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
          </style>
        </head>
        <body>
          <h1>Error en el Convertidor</h1>
          <div class="error">
            Ha ocurrido un error al cargar la aplicación.<br>
            Por favor, intenta recargar la página.
          </div>
          <button class="retry" onclick="window.location.reload()">Reintentar</button>
        </body>
      </html>
    `);
  }
}

/**
 * Función para probar la aplicación localmente
 */
function testWebApp() {
  try {
    const url = ScriptApp.getService().getUrl();
    console.log('URL de la Web App:', url);
    
    // Mostrar la URL en un diálogo
    const ui = SpreadsheetApp.getUi();
    ui.alert(
      'URL de la Web App',
      `La URL de tu web app es:\n\n${url}\n\nCópiala y pégala en tu navegador para probarla.`,
      ui.ButtonSet.OK
    );
    
    return url;
  } catch (error) {
    console.error('Error obteniendo URL:', error);
    const ui = SpreadsheetApp.getUi();
    ui.alert(
      'Error',
      'No se pudo obtener la URL de la web app. Asegúrate de que esté desplegada como web app.',
      ui.ButtonSet.OK
    );
    return null;
  }
}

/**
 * Función para desplegar la web app
 */
function deployWebApp() {
  try {
    // Verificar si ya existe un servicio
    let service;
    try {
      service = ScriptApp.getService();
      console.log('Servicio existente encontrado:', service.getUrl());
    } catch (e) {
      // Crear nuevo servicio si no existe
      service = ScriptApp.createService('Convertidor JumpingClay');
      console.log('Nuevo servicio creado');
    }
    
    // Configurar el servicio
    service.setDescription('Convertidor de tablas JumpingClay para Google Sheets');
    service.setTitle('Convertidor JumpingClay');
    
    // Desplegar
    const deployment = service.deploy();
    console.log('Web app desplegada:', deployment.getUrl());
    
    // Mostrar información al usuario
    const ui = SpreadsheetApp.getUi();
    ui.alert(
      'Web App Desplegada',
      `La web app ha sido desplegada exitosamente.\n\nURL: ${deployment.getUrl()}\n\nPuedes usar esta URL para acceder al convertidor desde cualquier navegador.`,
      ui.ButtonSet.OK
    );
    
    return deployment.getUrl();
  } catch (error) {
    console.error('Error desplegando web app:', error);
    const ui = SpreadsheetApp.getUi();
    ui.alert(
      'Error',
      `No se pudo desplegar la web app:\n${error.message}`,
      ui.ButtonSet.OK
    );
    return null;
  }
}

/**
 * Función para añadir menú de herramientas
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('CalculArgila')
    .addItem('Abrir Convertidor Web', 'openWebApp')
    .addSeparator()
    .addItem('Desplegar Web App', 'deployWebApp')
    .addItem('Obtener URL', 'testWebApp')
    .addToUi();
}

/**
 * Función para abrir la web app en una nueva ventana
 */
function openWebApp() {
  try {
    const url = ScriptApp.getService().getUrl();
    
    // Crear HTML que abra la URL en nueva ventana
    const html = HtmlService.createHtmlOutput(`
      <script>
        window.open('${url}', '_blank');
        google.script.host.close();
      </script>
    `)
    .setWidth(1)
    .setHeight(1);
    
    // Mostrar diálogo temporal
    SpreadsheetApp.getUi().showModalDialog(html, 'Abriendo Convertidor...');
  } catch (error) {
    console.error('Error abriendo web app:', error);
    const ui = SpreadsheetApp.getUi();
    ui.alert(
      'Error',
      'No se pudo abrir la web app. Asegúrate de que esté desplegada.',
      ui.ButtonSet.OK
    );
  }
}

/**
 * Función para verificar el estado de la web app
 */
function checkWebAppStatus() {
  try {
    const service = ScriptApp.getService();
    const url = service.getUrl();
    const isActive = service.isActive();
    
    console.log('Estado de la Web App:');
    console.log('  URL:', url);
    console.log('  Activa:', isActive);
    
    const ui = SpreadsheetApp.getUi();
    ui.alert(
      'Estado de la Web App',
      `URL: ${url}\nActiva: ${isActive ? 'Sí' : 'No'}`,
      ui.ButtonSet.OK
    );
    
    return { url, isActive };
  } catch (error) {
    console.error('Error verificando estado:', error);
    const ui = SpreadsheetApp.getUi();
    ui.alert(
      'Error',
      'No se pudo verificar el estado de la web app.',
      ui.ButtonSet.OK
    );
    return null;
  }
} 
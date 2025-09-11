# CalculArgila - Convertidor JumpingClay

## Descripción General

CalculArgila es una aplicación web diseñada para facilitar la creación de fichas de figuras de JumpingClay. La aplicación permite a los usuarios introducir datos sobre las partes, colores y unidades de una figura en una tabla interactiva. Luego, genera una cadena de texto formateada que se puede pegar directamente en una hoja de cálculo de Google Sheets para su posterior procesamiento.

La aplicación está construida con Google Apps Script, lo que permite una integración perfecta con Google Sheets. Se puede acceder a ella como una aplicación web independiente o abrirla directamente desde un menú personalizado en Google Sheets.

## Características Principales

- **Interfaz de Tabla Interactiva:** Los usuarios pueden añadir, eliminar y modificar filas en una tabla para especificar los detalles de cada parte de la figura.
- **Entrada de Datos Flexible:** Los datos se pueden introducir manualmente en la tabla o pegar desde una hoja de cálculo existente en un área de texto para un procesamiento rápido.
- **Generación de Fichas:** La aplicación genera una cadena de texto que contiene el código de la figura, el nombre, las partes, los detalles, una representación JSON de las especificaciones y la fecha de creación.
- **Portapapeles:** La cadena de texto generada se puede copiar fácilmente al portapapeles con un solo clic.
- **Integración con Google Sheets:** La aplicación se puede desplegar como una aplicación web de Google Apps Script y se puede acceder a ella a través de un menú personalizado en Google Sheets.

## Estructura del Proyecto

El proyecto se encuentra en el directorio `Codigo_v1` y consta de los siguientes archivos principales:

- **`Code_WebApp.js`:** Contiene el código de Google Apps Script del lado del servidor. Este archivo se encarga de servir la aplicación web, crear el menú personalizado en Google Sheets y gestionar el despliegue de la aplicación.
- **`SheetClayConverter_WebApp.html`:** Contiene el HTML y el JavaScript del lado del cliente de la aplicación. Este archivo define la interfaz de usuario y la lógica para la manipulación de datos y la generación de la ficha.
- **`appsscript.json`:** El archivo de manifiesto de Google Apps Script, que define la configuración del proyecto.
- **`INSTRUCCIONES_SOLUCION.md`:** Un archivo de markdown que contiene instrucciones sobre cómo desplegar y utilizar la aplicación.

## Cómo Utilizar

1. **Desplegar la Aplicación Web:**
   - Abre el proyecto en el editor de Google Apps Script.
   - Ejecuta la función `deployWebApp()` desde el editor.
   - Autoriza la aplicación si se te solicita.
   - Copia la URL de la aplicación web generada.

2. **Acceder a la Aplicación:**
   - Abre la URL de la aplicación web en tu navegador.
   - O bien, abre la hoja de cálculo de Google Sheets asociada y utiliza el menú "CalculArgila" para abrir la aplicación.

3. **Introducir Datos:**
   - Introduce el código y el nombre de la figura en los campos correspondientes.
   - Añade filas a la tabla para cada parte de la figura, especificando la parte, los detalles, el color, las unidades y las cantidades de las letras.
   - Alternativamente, pega los datos de una tabla existente en el área de texto "Cargar Datos de Tabla" y haz clic en "Cargar Tabla".

4. **Generar y Copiar la Ficha:**
   - Haz clic en el botón "Generar Ficha" para generar la cadena de texto de salida.
   - Haz clic en el botón "Copiar al Portapapeles" para copiar la cadena de texto.
   - Pega la cadena de texto en tu hoja de cálculo de Google Sheets.

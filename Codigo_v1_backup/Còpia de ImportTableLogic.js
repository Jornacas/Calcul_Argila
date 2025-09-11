
function loadImportTableModal() {
  const html = HtmlService.createHtmlOutputFromFile('ImportTable').getContent();
  return html;
}

function processImportedTable(data) {
  const rows = data.trim().split('\n');
  const parsedData = rows.map(row => row.split('\t'));
  return createHtmlTable(parsedData);
}

function createHtmlTable(data) {
  let html = '<table>';
  data.forEach(row => {
    html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
  });
  html += '</table>';
  return html;
}

function insertProcessedTable() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const tableData = getSessionData(); // Supone que los datos procesados se guardan en una sesión.
  tableData.forEach(row => sheet.appendRow(row));
}

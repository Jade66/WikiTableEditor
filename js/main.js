(function() {
  var testTable;
  
  function outputAsWiki(){
    var wikiString = testTable.toWikiString();
    document.getElementById('outputArea').value = wikiString;
  }
  
  function outputAsHtmlTable() {
    var el = document.getElementById('tableContainer');
    while(el.firstChild){
      el.removeChild(el.firstChild);
    }
    var tableElement = testTable.toTableElement();
    el.appendChild(tableElement);
  }
  
  function updateFromTable() {
    var table = document.querySelector('#tableContainer table');
    testTable.fromTableElement(table);
    outputAsWiki();
  }
  
  function updateFromWiki() {
    var wikiString = document.getElementById('outputArea').value;
    testTable.fromWikiString(wikiString);
    outputAsHtmlTable();
  }
  
  function addRow() {
    testTable.addRows(1);
    outputAsHtmlTable();
    outputAsWiki();
  }
  
  function addColumn() {
    testTable.addColumns(1);
    outputAsHtmlTable();
    outputAsWiki();
  }
  
  function handleInputChange(e) {
    if(event.target.classList && event.target.classList.contains('wiki-table-input')) {
      updateFromTable();
    }
  }
  
  function createWikiTable() {
    var rows = Number(document.querySelector('#numberOfRows').value);
    var columns = Number(document.querySelector('#numberOfColumns').value);
    var borders = document.querySelector('#bordersCheckbox').checked;
    var headers = document.querySelector('#headersCheckbox').checked;
    var sortable = document.querySelector('#sortableCheckbox').checked;
    var data = [];
    for(var currentRow = 0; currentRow < rows; currentRow++) {
      var rowData = [];
      for(var currentColumn = 0; currentColumn < columns; currentColumn++){
        rowData.push('');
      }
      data.push(rowData);
    }
    testTable = new jadeGeek.WikiTable({
      numberOfRows: rows,
      numberOfColumns: columns,
      hasBorders : borders,
      hasHeaders : headers,
      isSortable : sortable,
      data : data
    });
    outputAsWiki();
    outputAsHtmlTable();
  }
  
  document.getElementById('createWikiTable').addEventListener('click', createWikiTable);
  document.getElementById('addRow').addEventListener('click', addRow);
  document.getElementById('addColumn').addEventListener('click', addColumn);
  document.getElementById('outputArea').addEventListener('change', updateFromWiki);
  document.getElementById('outputArea').addEventListener('input', updateFromWiki);
  document.getElementById('tableContainer').addEventListener('input', handleInputChange);
  
  createWikiTable();
  
  document.getElementById('numberOfRows').focus();
  document.getElementById('numberOfRows').select();
})();
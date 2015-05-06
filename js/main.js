(function(window) {
  "use strict";
  var document = window.document;
  var jadeGeek = window.jadeGeek;
  var wikiTable;

  function outputAsWiki(){
    var wikiString = wikiTable.toWikiString();
    document.getElementById("outputArea").value = wikiString;
  }

  function outputAsHtmlTable() {
    var el = document.getElementById("tableContainer");
    while(el.firstChild){
      el.removeChild(el.firstChild);
    }
    var tableElement = wikiTable.toTableElement();
    el.appendChild(tableElement);
  }

  function updateFromTable() {
    var table = document.querySelector("#tableContainer table");
    wikiTable.fromTableElement(table);
    outputAsWiki();
  }

  function updateFromWiki() {
    var wikiString = document.getElementById("outputArea").value;
    wikiTable.fromWikiString(wikiString);
    outputAsHtmlTable();
  }

  function addRow() {
    wikiTable.addRows(1);
    outputAsHtmlTable();
    outputAsWiki();
  }

  function addColumn() {
    wikiTable.addColumns(1);
    outputAsHtmlTable();
    outputAsWiki();
  }

  function handleInputChange(event) {
    if(event.target.classList && event.target.classList.contains("wiki-table-input")) {
      updateFromTable();
    }
  }

  function handleFocusChange(event) {
    if(event.target.classList && event.target.classList.contains("wiki-table-input")) {
      var range = document.createRange();
      range.selectNodeContents(event.target);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  function handleKeydown(event) {
    var target = event.target;
    if(target.classList && target.classList.contains("wiki-table-input")) {
      if(event.which && event.altKey) {
        switch(event.which) {
          case 37: //Left Arrow
            if(target.previousSibling) {
              target.previousSibling.focus();
            }
            break;
          case 38: //Up Arrow
            if(target.rowIndex > 0) {
              var id = "R" + (target.rowIndex - 1) + "C" + target.columnIndex;
              document.getElementById(id).focus();
            }
            break;
          case 39: //Right Arrow
            if(target.nextSibling) {
              target.nextSibling.focus();
            }
            break;
          case 40: //Down Arrow
            if(target.rowIndex < wikiTable.numberOfRows - 1) {
              var elementId = "R" + (target.rowIndex + 1) + "C" + target.columnIndex;
              document.getElementById(elementId).focus();
            }
            break;
          default:
        }
      }
    }
  }

  function createWikiTable() {
    var rows = Number(document.querySelector("#numberOfRows").value);
    var columns = Number(document.querySelector("#numberOfColumns").value);
    var borders = document.querySelector("#bordersCheckbox").checked;
    var headers = document.querySelector("#headersCheckbox").checked;
    var sortable = document.querySelector("#sortableCheckbox").checked;
    var data = [];
    for(var currentRow = 0; currentRow < rows; currentRow++) {
      var rowData = [];
      for(var currentColumn = 0; currentColumn < columns; currentColumn++){
        rowData.push("");
      }
      data.push(rowData);
    }
    wikiTable = new jadeGeek.WikiTable({
      numberOfRows: rows,
      numberOfColumns: columns,
      hasBorders: borders,
      hasHeaders: headers,
      isSortable: sortable,
      data: data
    });
    outputAsWiki();
    outputAsHtmlTable();
  }

  document.getElementById("createWikiTable").addEventListener("click", createWikiTable);
  document.getElementById("addRow").addEventListener("click", addRow);
  document.getElementById("addColumn").addEventListener("click", addColumn);
  document.getElementById("outputArea").addEventListener("change", updateFromWiki);
  document.getElementById("outputArea").addEventListener("input", updateFromWiki);
  document.getElementById("tableContainer").addEventListener("input", handleInputChange);
  document.getElementById("tableContainer").addEventListener("focusin", handleFocusChange);
  document.getElementById("tableContainer").addEventListener("keydown", handleKeydown);

  createWikiTable();

  document.getElementById("numberOfRows").focus();
  document.getElementById("numberOfRows").select();
})(window);

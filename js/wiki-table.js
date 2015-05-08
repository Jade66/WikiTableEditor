(function(window){
  "use strict";
  var document = window.document;
  window.jadeGeek = window.jadeGeek || {};
  window.jadeGeek.WikiTable = function(providedOptions){

    var setOptionsFromWikiString = function(wikiString, wikiTable) {
      var rows = wikiString.split("\n");
      wikiTable.numberOfRows = (rows.length - 2) / 2;
      wikiTable.numberOfColumns = rows[rows.length - 2].split(/\|+/).length - 1;
      wikiTable.hasBorders = wikiString.indexOf("wikitable") > -1;
      wikiTable.isSortable = wikiString.indexOf("sortable") > -1;
      wikiTable.hasHeaders = wikiString.indexOf("!!") > -1;
    };

    var fromWikiString = function(wikiString){
      wikiString = wikiString.trim();

      setOptionsFromWikiString(wikiString, this);
      this.data = [];

      var textRows = wikiString.split("\n");

      var currentTextRow;

      for(currentTextRow = 2; currentTextRow < textRows.length; currentTextRow += 2) {
        var delimiter = /\|+/;
        if(this.hasHeaders && currentTextRow === 2) {
          delimiter = /\!+/;
        }
        var values = textRows[currentTextRow].split(delimiter);
        //Parsing sticks an extra blank value at the beginning.  Remove it.
        values.shift();
        this.data.push(values);
      }
    };

    var setOptionsFromTableElement = function(tableElement, wikiTable) {
      wikiTable.numberOfRows = tableElement.querySelectorAll("tr").length;
      wikiTable.numberOfColumns = tableElement.querySelector("tr").childNodes.length;
      wikiTable.hasHeaders = !!tableElement.querySelector("th");
    };

    var fromTableElement = function(tableElement){
      setOptionsFromTableElement(tableElement, this);
      this.data = [];
      var tableRows = tableElement.querySelectorAll("tr");
      for(var currentRow = 0; currentRow < tableRows.length; currentRow++) {
        var cells;
        if(this.hasHeaders && currentRow === 0) {
          cells = tableRows[currentRow].querySelectorAll("th");
        } else {
          cells = tableRows[currentRow].querySelectorAll("td");
        }

        var rowData = [];
        for(var currentColumn = 0; currentColumn < this.numberOfColumns; currentColumn++) {
          rowData[currentColumn] = cells[currentColumn].innerText;
        }
        this.data.push(rowData);
      }
    };

    var toTableElement = function(){
      var table = document.createElement("table");
      table.classList.add("wiki-table");
      var currentRow = 0, currentColumn = 0;

      if(this.hasHeaders) {
        table.appendChild(document.createElement("thead"));
      }
      table.appendChild(document.createElement("tbody"));

      for(; currentRow < this.numberOfRows; currentRow++) {
        var rowContainer;
        if(this.hasHeaders && currentRow === 0) {
          rowContainer = table.querySelector("thead");
        } else {
          rowContainer = table.querySelector("tbody");
        }
        var row = document.createElement("tr");

        for(currentColumn = 0; currentColumn < this.numberOfColumns; currentColumn++) {
          var cell;
          if(this.hasHeaders && currentRow === 0) {
            cell = document.createElement("th");
            if(this.isSortable) {
              cell.classList.add("sortable");
            }
          } else {
            cell = document.createElement("td");
          }
          if(!this.hasBorders) {
            cell.classList.add("no-border");
          }
          cell.classList.add("wiki-table-input");
          cell.contentEditable = true;
          cell.id = "R" + currentRow + "C" + currentColumn;
          cell.columnIndex = currentColumn;
          cell.rowIndex = currentRow;
          cell.innerText = this.data[currentRow][currentColumn] || " ";
          row.appendChild(cell);
        }

        rowContainer.appendChild(row);
      }
      return table;
    };

    var toWikiString = function(){
      var wikiString = "{|";
      var classString = "";
      if(this.hasBorders) {
          classString += "wikitable ";
      }
      if(this.isSortable) {
          classString += "sortable";
      }
      if (classString) {
          wikiString += " class=\"" + classString + "\"";
      }
      wikiString += "\n";

      var currentRow = 0, currentColumn = 0;

      for(currentRow = 0; currentRow < this.numberOfRows; currentRow++) {
        var delimiter = "|";
        if(this.hasHeaders && currentRow === 0) {
          delimiter = "!";
        }

        wikiString += "|-\n";
        for(currentColumn = 0; currentColumn < this.numberOfColumns; currentColumn++) {
          wikiString += delimiter + " " + (this.data[currentRow][currentColumn] || "");
          if(currentColumn < this.numberOfColumns - 1) {
            wikiString += " " + delimiter;
          }
        }
        wikiString += "\n";
      }
      wikiString += "|}";
      return wikiString;
    };
    
    var setNumberOfRows = function(newRowCount) {
      if(newRowCount > this.numberOfRows) {
        this.addRows(newRowCount - this.numberOfRows);
      } else {
        this.removeRows(this.numberOfRows - newRowCount);
      }
    };
    
    var removeRows = function(numberToRemove) {
      var newRowCount = this.numberOfRows - numberToRemove;
      if(newRowCount <= 0) {
        this.data = [];
        this.numberOfRows = 0;
      } else {
        this.data.length = newRowCount;
        this.numberOfRows = newRowCount;
      }
    };

    var addRows = function(numberToAdd) {
      this.numberOfRows += numberToAdd;
      for(var i = 0; i < numberToAdd; i++) {
        var rowData = [];
        for(var columnIndex = 0; columnIndex < this.numberOfColumns; columnIndex++) {
          rowData.push("");
        }
        this.data.push(rowData);
      }
    };

    var setNumberOfColumns = function(newColumnCount) {
      if(newColumnCount > this.numberOfColumns) {
        this.addColumns(newColumnCount - this.numberOfColumns);
      } else {
        this.removeColumns(this.numberOfColumns - newColumnCount);
      }
    };
    
    var addColumns = function(numberToAdd) {
      this.numberOfColumns += numberToAdd;
      for(var rowIndex in this.data) {
        for(var i = 0; i < numberToAdd; i++) {
          this.data[rowIndex].push("");
        }
      }
    };
    
    var removeColumns = function(numberToRemove) {
      var newColumnCount = this.numberOfColumns - numberToRemove;
      if(newColumnCount <= 0) {
        this.data = [];
        this.numberOfColumns = 0;
      } else {
        for(var row of this.data) {
          row.length = newColumnCount;
        }
        this.numberOfColumns = newColumnCount;
      }
    };
    

    //Default options
    var instance = {
      id: "mw-wiki-table",
      numberOfRows: 3,
      numberOfColumns: 3,
      hasBorders: true,
      hasHeaders: true,
      isSortable: false,
      data: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
      ],
      fromWikiString: fromWikiString,
      fromTableElement: fromTableElement,
      toTableElement: toTableElement,
      toWikiString: toWikiString,
      addRows: addRows,
      removeRows: removeRows,
      addColumns: addColumns,
      removeColumns: removeColumns,
      setNumberOfRows: setNumberOfRows,
      setNumberOfColumns: setNumberOfColumns
    };

    //Now override the defaults with any passed-in options.
    instance = window.jadeGeek.utils.extendObject(instance, providedOptions);
    return instance;
  };
})(window);

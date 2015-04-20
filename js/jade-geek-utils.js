(function(window){
  "use strict";
  window.jadeGeek = window.jadeGeek || {};
  var jg = window.jadeGeek;

  jg.utils = window.jadeGeek.utils || {};

  //Basic extend function
  jg.utils.extendObject = function(destination, source) {
    destination = destination || {};
    if(source) {
      for (var property in source) {
        destination[property] = source[property];
      }
    }
    return destination;
  };

  function getNestedValue(source, propertyPath) {
    var currentValue = source;
    var pathParts = propertyPath.split(".");
    for(var i in pathParts) {
      currentValue = currentValue[pathParts[i]];
      if(!currentValue) {
        return null;
      }
      if(i === pathParts.length - 1) {
        return currentValue;
      }
    }
  }

  jg.utils.flattenObject = function(source, config) {
    var destination = {};
    for(var propertyName in config) {
      destination[propertyName] = getNestedValue(source, config[propertyName]);
    }
    return destination;
  };

})(window);

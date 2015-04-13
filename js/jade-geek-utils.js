(function(){
  window.jadeGeek = window.jadeGeek || {};
  window.jadeGeek.utils = window.jadeGeek.utils || {};
  
  //Basic extend function
  window.jadeGeek.utils.extendObject = function(destination,source) {
    destination = destination || {};
    if(source) {
      for (var property in source) {
        destination[property] = source[property];
      }
    }
    return destination;
  };
})();
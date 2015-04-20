/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
 (function(chrome){
   "use strict";
   chrome.app.runtime.onLaunched.addListener(function() {
     chrome.app.window.create(
       "index.html",
       {
         id: "mainWindow",
         bounds: {width: 800, height: 600}
       }
     );
   });
 })(chrome);

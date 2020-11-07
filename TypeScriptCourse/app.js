"use strict";
//USING OTHER LIBRARIES WITH TYPESCRIPT - E.G. JQUERY
//npm install --save jquery
exports.__esModule = true;
require("jQuery");
//use system.js to manage dependencies in index.html
// map: {
//     "jQuery": 'node_modules/jquery/dist/jquery.min.js'
//   },
$('#app').css({ 'background-color': 'red' });
// Typescript definition files can be written manually, but for this example we can download written definition files - DefinitelyTyped jquery
// DefinitelyTyped contains many Typescript definitions for popular javascript libraries
// For this example we will simply install the types: npm install --save-dev @types/jquery

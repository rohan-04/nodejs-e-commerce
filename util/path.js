const path = require('path');

// process(deprecated)/require - is global variable comes with nodejs so no need to import it
// main - it will refer to the main module that started our application here (app.js)
// filename - this will give filename in which file it was use
module.exports = path.dirname(require.main.filename);

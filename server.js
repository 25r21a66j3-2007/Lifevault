// Root server.js forwarder to server/server.js
const path = require('path');
process.chdir(path.join(__dirname, 'server'));
require(path.join(__dirname, 'server', 'server.js'));

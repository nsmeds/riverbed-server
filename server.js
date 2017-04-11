const http = require('http');
const app = require('./server/app');
const port = process.env.PORT || 5000;
require('./server/setup-mongoose');

const server = http.createServer(app);

server.listen(port, () => {
    console.log('Server running on port: ', server.address().port);
});
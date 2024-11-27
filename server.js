const http = require("http");
const http2 = require('http2');
const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const serve = require('koa-static');

// Create a new Koa application
const app = new Koa();

app.use(serve(path.join(__dirname, 'public')));


// Define middleware for handling requests
// app.use(async ctx => {
//   if (ctx.path === '/test') {
//     ctx.body = 'Hello, HTTP/2 with Koa and HTTPS!';
//   } else {
//     ctx.status = 404;
//     ctx.body = 'Not Found';
//   }
// });

const http1Server = http.createServer(app.callback());
http1Server.listen(8080, () => {
  console.log("HTTP/1.1 server running on http://localhost:8080");
});

// Load SSL/TLS certificates
const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.crt'))
};

// Create an HTTP/2 server
const server = http2.createSecureServer(serverOptions, app.callback());

server.listen(8443, () => {
  console.log('HTTP/2 server running on https://localhost:8443');
});
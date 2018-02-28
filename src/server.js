// server.js
// routes traffic and sends data to necessary files

// Requires
const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// take data and send to jsonHandler
const postData = (request, response, parsedURL) => {
  const res = response;
  const body = [];

  // error log
  request.on('error', (err) => {
    console.dir(err);
    jsonHandler.clientError(request, response);
  });

  // grab data
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // end upload
  request.on('end', () => {
    const bodyStr = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyStr);

    if (parsedURL.pathname === '/addImg') {
      // pass to the add user function
      jsonHandler.handleImg(request, res, bodyParams);
    }
  });
};

// Route requests based on type
const onRequest = (request, response) => {
  console.log(request.url);
  console.log(request.method);

  const parsedURL = url.parse(request.url);

  // check request method
  switch (request.method) {
    case 'HEAD':
      if (parsedURL.pathname === '/getUsers') {
        jsonHandler.getImgMeta(request, response);
      } else {
        jsonHandler.notFoundMeta(request, response);
      }
      break;
    case 'GET':
      if (parsedURL.pathname === '/') {
        // homepage, send index
        htmlHandler.getIndex(request, response);
      } else if (parsedURL.pathname === '/style.css') {
        htmlHandler.getStyle(request, response);
      } else if (parsedURL.pathname === '/getImgs') {
        jsonHandler.getImgs(request, response);
      } else {
        // if not found, 404
        jsonHandler.notFound(request, response);
      }
      break;
    case 'POST':
      if (parsedURL.pathname === '/addImg') {
        postData(request, response, parsedURL);
      } else {
        jsonHandler.notFound(request, response);
      }
      break;
    default:
      // send 404 in any other case
      jsonHandler.notFound(request, response);
  }
};


http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

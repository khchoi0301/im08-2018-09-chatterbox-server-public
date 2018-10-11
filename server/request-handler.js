/*************************************************************
*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
**************************************************************/

const fs = require('fs');
fs.writeFileSync('./data.txt', '{ "results": [] }')

var requestHandler = function (request, response) {

  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
  // console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var statusCode = 200;
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'text/plain';
  response.writeHead(statusCode, headers);

  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  if (request.method === 'OPTIONS') {
    response.end();
  }

  if (request.method === 'GET' && request.url === '/classes/messages') {

    fs.accessSync('./data.txt', (err) => {   // data.txt.없을경우
      if (err && err.code === 'ENOENT') {
        fs.writeFileSync('./data.txt', '{ "results": [] }')
      }
    })


    var result = fs.readFileSync('./data.txt', 'utf8') || '{ "results": [] }'
    response.end(result);



  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    var statusCode = 201;
    var postdata = ''

    request.on('data', function (data) {
      postdata = postdata + data
    })

    request.on('end', function () {
      var fsmsg = fs.readFileSync('./data.txt', 'utf8') || '{ "results": [] }'
      fsmsg = JSON.parse(fsmsg).results
      fsmsg.push(JSON.parse(postdata))
      var result = JSON.stringify({ results: fsmsg })

      fs.writeFileSync('./data.txt', result)
      response.writeHead(statusCode, headers);
      response.end(result);
    })

  } else if ((request.method === 'GET') && request.url === '/') {
    headers['Content-Type'] = 'text/html';
    const home = fs.readFileSync('./client/index.html', { encoding: 'utf8' })
    var statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(home);

  } else if ((request.method === 'GET') && request.url === '/styles/styles.css') {
    headers['Content-Type'] = 'text/css';
    const home = fs.readFileSync('./client/styles/styles.css', { encoding: 'utf8' })
    var statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(home);

  } else if ((request.method === 'GET') && request.url === '/scripts/app.js') {
    headers['Content-Type'] = 'text/js';
    const home = fs.readFileSync('./client/scripts/app.js', { encoding: 'utf8' })
    var statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(home);

  } else {
    // console.log('404method', request.method, request.url)
    var statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('404 Error');
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};


module.exports = { requestHandler }
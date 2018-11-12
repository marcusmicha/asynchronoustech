// ./handles.js
// const content = '<!DOCTYPE html>' +
// '<html>' +
// '    <head>' +
// '        <meta charset="utf-8" />' +
// '        <title>ECE AST</title>' +
// '    </head>' + 
// '    <body>' +
// '         <p>Hello World !</p>' +
// '    </body>' +
// '</html>'

const url = require('url')
const qs = require('querystring')

module.exports = {
    serverHandle: function (req, res) {
        const route = url.parse(req.url)
        const path = route.pathname 
        const params = qs.parse(route.query)


        res.writeHead(200, {'Content-Type': 'text/plain'});
        // res.end(content);
        if (path === '/hello' && 'name' in params) {
            res.write('Hello ' + params['name'])
            res.end()
          } else {
            res.write('Hello anonymous')
            res.end()
          }
    } 
  }
  
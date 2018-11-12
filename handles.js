// ./handles.js

const url = require('url')
const qs = require('querystring')
const defaultContent = '<p style="text-align: center;">Hi everyone</p>'
+'<p style="text-align: center;">This application lets you display the name of anyone.</p>'
+'<p style="text-align: center;">You will have more details if you try with "<em>Michael</em>"</p>'
+'<p style="text-align: center;">Enjoy !</p>'

const nameContent = '<p style="text-align: center;">Bonjour, je m\'appelle Michael.</p>'
+'<p style="text-align: center;">Je suis &eacute;tudiant en 5e ann&eacute;e &agrave; l\'ECE Paris.</p>'
+'<p style="text-align: center;">J\'aime l\'informatique, l\'aventure et pratique le short track</p>'
+'<p style="text-align: center;">&Agrave; bient&ocirc;t !</p>'


module.exports = {
    serverHandle: function (req, res) {
        const route = url.parse(req.url)
        const path = route.pathname 
        const params = qs.parse(route.query)

        // res.end(content);
        if (path == '/') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(defaultContent);
            res.end();
        }
        else if (path === '/hello' && 'name' in params) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('Hello ' + params['name']);
            if (params['name'] === "michael" || params['name'] === "Michael")
                res.write(nameContent);
            res.end();
        }
        else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404, Not Found');
            res.end();
          }
    } 
  }
  
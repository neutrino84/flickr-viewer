
var express = require('express'),
    app = express();

    // configure layout engine
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');

    // configure hooks
    app.use(express.favicon('/public/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.static(__dirname + '/public'));

    // configure default route
    app.get('/', function(req, res) {
      res.render('index', {
        title: 'FlickViewr'
      });
    });
    
    app.listen(3000);

    console.log('listening on port 3000');

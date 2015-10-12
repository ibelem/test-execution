/* global process */

var express = require('express'), app = express(); 
var bodyParser = require('body-parser'); 
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose'); 
var uuid = require('uuid');
var port = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost:27017/testexecution');

var XWalk = require('./app/models/crosswalkversion');

// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
	Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

app.get('/', function(req, res) {
	res.send('Welcome to the home page!');
});

var apiRouter = express.Router();

apiRouter.use(function(req, res, next) {
	console.log('somebody just came to');
	next();
});

apiRouter.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

apiRouter.route('/xwalkversion')
	// create a XWalk (accessed at POST http://localhost:8080/api/xwalkversion)
	.post(function(req, res) {
		var xwalk = new XWalk();
		xwalk.branchname = req.body.branchname;
		xwalk.branchversion = req.body.branchversion;
		xwalk.builddate = req.body.builddate;
		// save the XWalk and check for errors
		xwalk.save(function(err) {
			if(err) {
				console.log(err);
				if (err.code == 11000)
					return res.json({ success: false, message: 'Same record already exists. '});
			}
			else {
				return res.send(err);
			}
			res.json({ message: 'crosswalkversion created!' });
		})
  })

	.get(function(req, res) {
		XWalk.find(function(err, xwalk) {
			if (err) 
				res.send(err);
			// return the users
			res.json(xwalk);
		});
	})	
	
apiRouter.route('/xwalkversion/:id')
	// get the user with that id
	// (accessed at GET http://localhost:8080/api/xwalkversion/:id)
	.get(function(req, res) {
		console.log(req.params.id);
		XWalk.findById(req.params.id, function(err, xwalk) {
			if (err) 
				res.send(err);
			// return that user
			res.json(xwalk);
		});
	})
	
  .put(function(req, res) {
	  // use our user model to find the user we want
		// http://127.0.0.1:8080/api/xwalkversion/561b54867be9f3725b2ac8f6
		XWalk.findById(req.params.id, function(err, xwalk) {
			if (err) res.send(err);
			//update the users info only if its new
			if (req.body.branchname) xwalk.branchname = req.body.branchname;
			if (req.body.branchversion) xwalk.branchversion = req.body.branchversion;
			if (req.body.builddate) xwalk.builddate = req.body.builddate;
			// save the user
			xwalk.save(function(err) {
				if (err) res.send(err);
					// return a message
					res.json({ message: 'XWalk updated!' });
			});
		});
	})
	
	.delete(function(req, res) {
		XWalk.remove({
			_id: req.params.id
		}, function(err, xwalk) {
		if (err) return res.send(err);
			res.json({ message: 'Successfully deleted' });
		});
	});

app.use('/api', apiRouter);

app.listen(port);
console.log('Magic happens on port ' + port);
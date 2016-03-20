var cool = require('cool-ascii-faces');
var express = require('express');
var pg = require('pg');
var app = express();
var Twitter = require('twitter-node-client').Twitter;
var https = require('https');
var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'twitterAndStrava',
  streams: [
    {
      level: 'info',
      // stream: process.stdout,
      path: './myAppInfo.log'            // log INFO and above to stdout
    },
    {
      level: 'error',
      path: './myAppErrors.log'  // log ERROR and above to a file
    }
  ]
});
var qs = require('qs');

var error = function (err, response, body) {
    // console.log('ERROR [%s]', err);
    return err;
};
var success = function (data) {
    // console.log(JSON.stringify(data, null, 2));
    console.log(typeof data);
    console.log(data.statuses);
};

var config = {
       "consumerKey": "xyUPXQu2SEcOsxWlkT0Lf502z",
       "consumerSecret": "jSX68nEnziiL6sqOlNx6RgygEWvyjpPANSZg4ocH3pfc7N7Nxv",
       "accessToken": "23732632-UBDfIaeMkLoRVWhJFAOYWproZV1WxlQDGGAHzkWLV",
       "accessTokenSecret": "QgDPaGbue2TcBDjmVUZ1M5U29q1hyCkim9iytGDZGbTt6",
       "callBackUrl": "127.0.0.1:5000"
   };

var twitter = new Twitter(config);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
 response.render('pages/index');
//  var result = '';
//  var times = process.env.TIMES || 5;
//  for (var i=0; i < times; i++)
//	result += cool();
//  response.send(result);

});

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

app.get('/cool', function(request, response){
response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/twitter', function(request, response){
//super agent
//https://github.com/mzabriskie/axios
//https://api.twitter.com/1.1/search/tweets.json?q=%23freebandnames&since_id=24012619984051000&max_id=250126199840518145&result_type=mixed&count=4

	twitter.getSearch({'q':'#feelthebern', 'geocode': '33.520796,-86.802709,100mi','count': 10}, 
		function(error){
			var errObj = JSON.parse(error);
	},  function(success){
			var successObj = JSON.parse(success);
			log.info(successObj.statuses[0].text);
			// var statusesAsTexts = .map or something like that
			// response.render('pages/twitter', {results: statusesAsTexts});
			// need to map all statuses array text to values and log'em out for now; render when I get the map working
	});
	// twitter.getUserTimeline({ screen_name: 'mcsharps', count: '10'}, error, success);
});

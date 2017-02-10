/**
 * See: https://github.com/ethereum/wiki/wiki/JavaScript-API
 */

var express = require('express'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    balances        = require('./modules/balances'),
    app = express();

app.use(express.static(__dirname + '/web')); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(methodOverride());      // simulate DELETE and PUT
var port = process.argv[2] || 3000;
app.listen(port);

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', function (req, res) {
  res.send('Hello World');
});

// http://localhost:3000/getBalances
app.get('/getBalances', balances.getBalances);








/*
Main id: 0x70d4026a14547FdfE38e8b75F5113Bb0efBEAFb0
Main balance: 11,478.26993322
Account 2 hash: 0x3c40bff0BBF7a9cb82f9577633b1B60D51fb4c7E
Account 2 balance: 999.99731644 
Account 3 hash: 0x2a204B66A11d442E0B412a2119B870F76A69c9AC
Account 3 balance: 1000
*/







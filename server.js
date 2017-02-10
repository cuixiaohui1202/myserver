var express = require('express');
var app = express();
var account2Coinbase = '0x3c40bff0BBF7a9cb82f9577633b1B60D51fb4c7E';
var account3Coinbase = '0x2a204B66A11d442E0B412a2119B870F76A69c9AC';

// https://github.com/ethereum/wiki/wiki/JavaScript-API

app.use(express.static(__dirname + '/web')); 
app.get('/', function (req, res) {
  res.send('Hello World');
});

var port = process.argv[2] || 3000;
app.listen(port);

var Web3 = require('web3');
var web3 = new Web3();

if (typeof web3 !== 'undefined') {
  console.log('web3 is defined');
} else {
  console.log('web3 is undefined');
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

web3.setProvider(new web3.providers.HttpProvider());

monitorBalances();

console.log('app listening on port ' + port);


/*
Main id: 0x70d4026a14547FdfE38e8b75F5113Bb0efBEAFb0
Main balance: 11,478.26993322
Account 2 hash: 0x3c40bff0BBF7a9cb82f9577633b1B60D51fb4c7E
Account 2 balance: 999.99731644 
Account 3 hash: 0x2a204B66A11d442E0B412a2119B870F76A69c9AC
Account 3 balance: 1000
*/


function monitorBalances() {
  var mainCoinbase = web3.eth.coinbase;
  var originalMainBalance = watchBalance('Main Account', mainCoinbase, 0);
  var originalAccount2Balance = watchBalance('Account 2', account2Coinbase, 0);
  var originalAccount3Balance = watchBalance('Account 3', account3Coinbase, 0);

  web3.eth.filter('latest').watch(function() {
    watchBalance('Main Account', mainCoinbase, originalMainBalance);
    watchBalance('Account 2', account2Coinbase, originalAccount2Balance);
    watchBalance('Account 3', account3Coinbase, originalAccount3Balance);
  });
}

function watchBalance(description, coinbase, originalBalance) {
      var currentBalance = web3.fromWei(web3.eth.getBalance(coinbase));

      console.log(description + ' current: ' + currentBalance.toFixed(2));
      console.log(description + ' difference: ' + (currentBalance - originalBalance).toFixed(2));
      return currentBalance;
}

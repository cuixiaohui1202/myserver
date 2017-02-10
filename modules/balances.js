/**
 * Main id: 0x70d4026a14547FdfE38e8b75F5113Bb0efBEAFb0
 * Main balance: 11,478.26993322
 * Account 2 hash: 0x3c40bff0BBF7a9cb82f9577633b1B60D51fb4c7E
 * Account 2 balance: 999.99731644 
 * Account 3 hash: 0x2a204B66A11d442E0B412a2119B870F76A69c9AC
 * Account 3 balance: 1000
*/
var Web3 = require('web3');
var web3 = new Web3();
var acc2Hash = '0x3c40bff0BBF7a9cb82f9577633b1B60D51fb4c7E';
var acc3Hash = '0x2a204B66A11d442E0B412a2119B870F76A69c9AC';

exports.getBalances = function(req, res, nex) {
    if (typeof web3 !== 'undefined') {
        console.log('web3 is defined');
    } else {
        console.log('web3 is undefined');
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    web3.setProvider(new web3.providers.HttpProvider());
    var json = get();
    console.log('getBalances() = ' + json);

    res.send(json);
}

var monitor = function() {
  var originalMainBalance = watchBalance('Main Account', mainHash, 0);
  var originalAccount2Balance = watchBalance('Account 2', acc2Hash, 0);
  var originalAccount3Balance = watchBalance('Account 3', acc3Hash, 0);

  web3.eth.filter('latest').watch(function() {
    watchBalance('Main Account', mainCoinbase, originalMainBalance);
    watchBalance('Account 2', account2Coinbase, originalAccount2Balance);
    watchBalance('Account 3', account3Coinbase, originalAccount3Balance);
  });
}

var get = function() {
    return JSON.stringify(getAccounts());
}

var watchBalance = function(description, hash, originalBalance) {
    var currentBalance = web3.fromWei(web3.eth.getBalance(hash));
    console.log(description + ' current: ' + currentBalance.toFixed(2));
    console.log(description + ' difference: ' + (currentBalance - originalBalance).toFixed(2));
    return currentBalance;
}

var getAccounts = function() {
    var accountObject = {};
    var accounts = [];
    accountObject.accounts = accounts;

    var mainHash = web3.eth.coinbase
    addAccount(accountObject, "Main Account", mainHash);
    addAccount(accountObject, "Account 2", acc2Hash);
    addAccount(accountObject, "Account 3", acc3Hash);

    console.log(JSON.stringify(accountObject));
    return accountObject;
}

var addAccount = function(accountObject, name, hash) {
    var acc = {
        "name": name,
        "hash": hash,
        "wei": getBalanceInWei(hash),
        "ether": getBalanceInEther(hash).toFixed(2)
    };

    accountObject.accounts.push(acc);
}

var getBalanceInWei = function(hash) {
    return web3.eth.getBalance(hash);
}

var getBalanceInEther = function(hash) {
    return web3.fromWei(web3.eth.getBalance(hash));
}
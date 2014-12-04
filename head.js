var yhr = require('./main.js');

module.exports = function(uri,headers){
  return yhr('HEAD',uri,headers);
};


var yhr = require('./main.js');

module.exports = function(uri,data,headers,bin){
  return yhr('POST',uri,headers,data,bin);
};


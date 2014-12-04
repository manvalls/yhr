var yhr = require('./main.js');

module.exports = function(uri,headers,bin){
  return yhr('GET',uri,headers,null,bin);
};


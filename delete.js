var yhr = require('./main.js');

module.exports = function(uri,headers,bin){
  return yhr('DELETE',uri,headers,null,bin);
};


var yhr = require('./main.js');

module.exports = function(uri,data,headers,bin){
  return yhr('PUT',uri,headers,data,bin);
};


var yhr = require('./main.js');

module.exports = function(uri,opt){
  return yhr('GET',uri,null,opt);
};


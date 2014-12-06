var yhr = require('./main.js');

module.exports = function(uri,data,opt){
  return yhr('POST',uri,data,opt);
};


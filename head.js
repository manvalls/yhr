var yhr = require('./main.js');

module.exports = function(uri,opt){
  return yhr('HEAD',uri,null,opt);
};


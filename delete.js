var yhr = require('./main.js');

module.exports = function(uri,opt){
  return yhr('DELETE',uri,null,opt);
};


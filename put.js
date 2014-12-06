var yhr = require('./main.js');

module.exports = function(uri,data,opt){
  return yhr('PUT',uri,data,opt);
};


var Yielded = require('vz.yielded'),
    Su = require('vz.rand').Su,
    
    yielded = Su();

function onLoad(){
  
  if(!this.responseType || this.responseType != 'text') this[yielded].value = this.response;
  else if(this.getResponseHeader('Content-Type').indexOf('application/json') != -1){
    try{ this[yielded].value = JSON.parse(this.response); }
    catch(e){ this[yielded].error = e; }
  }else this[yielded].value = this.response;
  
}

function onError(e){
  this[yielded].error = e;
}

module.exports = function(method,uri,headers,body,bin){
  var xhr = new XMLHttpRequest(),
      keys = Object.keys(headers = headers || {}),
      yd = new Yielded(),
      i;
  
  xhr.open(method,uri,true);
  
  if(bin) xhr.responseType = bin === true?'arraybuffer':bin;
  else xhr.responseType = 'text';
  
  xhr.onload = onLoad;
  xhr.onerror = onError;
  
  for(i = 0;i < keys.length;i++) xhr.setRequestHeader(keys[i],headers[keys[i]]);
  
  if(body && !headers['Content-Type']){
    body = new Blob([JSON.stringify(body)]);
    xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
    xhr.setRequestHeader('Content-Length',body.size);
  }
  
  xhr.send(body);
};


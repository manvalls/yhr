var Yielded = require('vz.yielded'),
    Su = require('vz.rand').Su,
    
    ctRE = /([^;]+)(?:.*charset=(.*)(;.*)?)?/,
    yielded = Su();

function onLoad(){
  var m,ct,txt,e;
  
  switch(Math.floor(this.status/100)){
    case 5: return this[yielded].error = new Error('Server error ' + this.status);
    case 4: return this[yielded].error = new Error('Client error ' + this.status);
  }
  
  ct = this.getResponseHeader('Content-Type');
  if(!ct){
    e = new TypeError('Blank content type');
    e.response = this.response;
    this[yielded].error = e;
    return;
  }
  
  m = ctRE.match(ct);
  
  switch(m[0]){
    case 'application/json':
      txt = new Uint8Array(this.response);
      
      try{
        txt = (new TextDecoder(m[1] || 'utf-8')).decode(txt);
        this[yielded].value = JSON.parse(txt);
      }catch(e){
        e.response = this.response;
        this[yielded].error = e;
      }
      
      break;
    default:
      
      e = new TypeError('Unsupported content type');
      e.response = this.response;
      this[yielded].error = e;
      
      break;
  }
  
}

function onError(e){
  this[yielded].error = e;
}

module.exports = function(method,uri,body,opt){
  var xhr = new XMLHttpRequest(),
      headers = (opt = opt || {}).headers || {},
      keys,
      yd = new Yielded(),
      i;
  
  xhr[yielded] = yd;
  xhr.onload = onLoad;
  xhr.onerror = onError;
  
  xhr.open(method,uri,true);
  
  xhr.responseType = 'arraybuffer';
  
  headers['Accept-Charset'] = headers['Accept-Charset'] || 'utf-8';
  headers['Accept'] = headers['Accept'] || 'application/json';
  
  keys = Object.keys(headers);
  for(i = 0;i < keys.length;i++) xhr.setRequestHeader(keys[i],headers[keys[i]]);
  
  if(body && !headers['Content-Type']){
    body = new Blob([JSON.stringify(body)]);
    xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
    xhr.setRequestHeader('Content-Length',body.size);
  }
  
  xhr.send(body);
  
  return yd;
};


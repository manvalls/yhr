var Yielded = require('vz.yielded'),
    Su = require('vz.rand').Su,
    utf8bts = require('utf8bts'),
    
    ctRE = /([^;]+)(?:.*charset=(.*)(;.*)?)?/,
    utf8 = /utf-?8/i,
    yielded = Su();

function onLoad(){
  var m,ct,txt;
  
  switch(Math.floor(this.status/100)){
    case 5: return this[yielded].error = new Error('Server error ' + this.status);
    case 4: return this[yielded].error = new Error('Client error ' + this.status);
  }
  
  ct = this.getResponseHeader('Content-Type');
  if(!ct) return this[yielded].value = this.response; // Unknown
  
  m = ctRE.match(ct);
  if(!m[1].match(utf8)) return this[yielded].value = this.response; // Unsupported
  
  switch(m[0]){
    case 'application/json':
      txt = new Uint8Buffer(this.response);
      txt = utf8bts(txt);
      
      try{ this[yielded].value = JSON.parse(txt); }
      catch(e){ this[yielded].error = e; }
      break;
    default:
      this[yielded].value = this.response; // Unsupported
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


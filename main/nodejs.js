var Yielded = require('vz.yielded'),
    Su = require('vz.rand').Su,
    
    yielded = Su(),
    options = Su(),
    args = Su(),
    
    body = Su(),
    
    ctRE = /([^;]+)(?:.*charset=(.*)(;.*)?)?/,
    
    http = require('http'),
    https = require('https'),
    zlib = require('zlib'),
    url = require('url');

function onEnd(){
  var m,e;
  
  if(!this.headers['content-type']){
    e = new TypeError('Blank content type');
    e.response = this[body];
    this[yielded].error = e;
  }else{
    m = this.headers['content-type'].match(ctRE);
    
    switch(m[1]){
      case 'application/json':
        
        try{ this[yielded].value = JSON.parse(this[body].toString(m[2] || 'utf8')); }
        catch(e){
          e.response = this[body];
          this[yielded].error = e;
        }
        
        break;
      default:
        
        e = new TypeError('Unsupported content type');
        e.response = this[body];
        this[yielded].error = e;
        
        break;
    }
  }
  
}

function onData(data){
  this[body] = Buffer.concat([this[body],data]);
}

function onTimeout(){
  this.abort();
  this[yielded].error = new Error('Request timed out');
}

function onError(e){
  this[yielded].error = e;
}

function onResponse(res){
  var ds;
  
  if(this[args][0] == 'HEAD'){
    this[yielded].value = res.headers;
    return;
  }
  
  if(res.headers.location){
    this[args][1] = res.headers.location;
    module.exports.apply(this,this[args]);
    return;
  }
  
  switch(Math.floor(res.statusCode/100)){
    case 5: return this[yielded].error = new Error('Server error ' + res.statusCode);
    case 4: return this[yielded].error = new Error('Client error ' + res.statusCode);
  }
  
  switch(res.headers['content-encoding']){
    case 'gzip':
      ds = zlib.createGunzip();
      ds.headers = res.headers;
      res.pipe(ds);
      
      res = ds;
      break;
      
    case 'deflate':
      ds = zlib.createInflate();
      ds.headers = res.headers;
      res.pipe(ds);
      
      res = ds;
      break;
  }
  
  res[yielded] = this[yielded];
  res[binary] = this[binary];
  res[body] = new Buffer(0);
  
  res.on('data',onData);
  res.on('end',onEnd);
  res.on('error',onError);
}

module.exports = function(method,uri,body,opt){
  var req,
      headers = (opt = opt || {}).headers;
  
  headers = headers || {};
  
  if(body && !headers['Content-Type']){
    body = new Buffer(JSON.stringify(body),'utf8');
    headers['Content-Type'] = 'application/json; charset=utf-8';
    headers['Content-Length'] = body.length;
  }
  
  headers['User-Agent'] = headers['User-Agent'] || 'nodejs/' + process.version;
  headers['Accept-Encoding'] = headers['Accept-Encoding'] || 'gzip, deflate';
  headers['Accept-Charset'] = headers['Accept-Charset'] || 'utf-8';
  headers['Accept'] = headers['Accept'] || 'application/json';
  
  uri = url.parse(uri);
  uri.method = method;
  uri.headers = headers;
  
  if(uri.protocol == 'https:') req = https.request(uri);
  else req = http.request(uri);
  
  req[args] = arguments;
  req[yielded] = this[yielded] || new Yielded();
  req[options] = opt;
  
  if(opt.timeout) req.setTimeout(opt.timeout);
  
  req.on('response',onResponse);
  req.on('error',onError);
  req.on('timeout',onTimeout);
  
  req.end(body);
  
  return req[yielded];
};


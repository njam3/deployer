var spawn = require('cross-spawn-async');

module.exports = function(command,args,opts,cb) {
  if (typeof opts === "function") { 
    cb = opts;
    opts = {};
  }
  if (!opts.stdio) opts.stdio = 'inherit';
  var error;
  var process = spawn(command, args, opts);
  process.on('error',function(err) {
    error = err
  });
  process.on('close',function(code,signal) {
    cb(error,code,signal);
  });
}
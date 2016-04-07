var fs = require('fs');
var spawn = require('./spawn');

module.exports = function(cb) {
  var key = process.env.RSA_PK.match(/.{1,64}/g).join('\n');
  var pk = '-----BEGIN RSA PRIVATE KEY-----\n'+key+'\n-----END RSA PRIVATE KEY-----';
  fs.writeFile(process.env.RSA_NAME,pk,function() {
    spawn('ssh-add',[process.env.RSA_NAME],function() {
      cb();
    });
  });
}
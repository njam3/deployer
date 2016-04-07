require('dotenv').config({silent: true});
var github = require('githubhook')({port: process.env.PORT, path: process.env.PATH});
var createPK = require('./src/createPK');
var Repo = require('./src/Repo');
var repos = [
  {repo: "prj-hammer-raindance", branch: "master", command: "release", folder: "release/", pass: process.env.PASS, server: process.env.SERVER}
];

createPK(function() {
  repos = repos.map(function(cur) {
    return new Repo(cur);
  })
  github.on('push', function (event, repo, ref, data) {
    repos.forEach(function() {
      cur.check(event,repo,ref,data);
    });
  });
  github.listen();
});

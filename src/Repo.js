var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var spawn = require('./spawn');

var Repo = function(data) {
  if (!(this instanceof Repo)) return new Repo(data);
  this.initializing = false;
  this.initialized = false;
  this.updating = false;
  this.waiting = false;
  this.data = data;
  this.dir = path.join(process.env.BASE,this.data.repo);
  this.init();
};
Repo.prototype.init = function() {
  fs.exists(this.dir,function(exists) {
    if (!exists) {
      this.initializing = true;
      mkdirp(this.dir,function() {
        spawn('git',['clone','-b',this.data.branch,'--single-branch','git@github.com:Jam3/'+this.data.repo+'.git',this.dir],function() {
          this.initializing = false;
          this.initialized = true;
          if (this.waiting) this.update();
        }.bind(this));
      }.bind(this));
    }
  }.bind(this));
};
Repo.prototype.check = function(event,repo,ref,data) {
  if (repo===this.data.repo && ref.indexOf(this.data.branch)>-1) {
    this.update();
  }
};
Repo.prototype.update = function() {
  if (!this.initialized) {
    if (this.initializing) {
      this.waiting = false;
    } else {
      this.init();
    }
  } else {
    if (this.updating) {
      this.waiting = true;
    } else {
      this.waiting = false;
      this.doUpdate();
    }
  }
};
Repo.prototype.doUpdate = function() {
  this.updating = true;
  spawn('git',['reset','--hard','HEAD'],{cwd: this.dir},function() {
    spawn('git',['pull'],{cwd: this.dir},function() {
      spawn('npm',['i'],{cwd: this.dir},function() {
        spawn('npm',['run',this.data.command],{cwd: this.dir},function() {
          spawn('sshpass',['-p',this.data.pass],function() {
            return;
            spawn('rsync',['-rPz',process.env.BUILD_FOLDER,process.env.RSYNC_SERVER],{cwd: 'repo/'+process.env.REPO},function() {
              this.updating = false;
              if (this.waiting) this.update();
            }.bind(this));
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }.bind(this));
};
module.exports = Repo;
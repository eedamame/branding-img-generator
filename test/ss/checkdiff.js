var exec = require('child_process').exec,
    child,
    fs = require("fs");

// 設定項目
var config = require("./config.js"),
    data = config.data,
    diffDir = config.diffDir;

data.forEach(function(url) {
  child = exec('identify -format "%[mean]" test/ss/images/' + diffDir + url.name + '_diff.jpg',
  function (error, stdout, stderr) {
    //console.log('stdout: ' + stdout);
    //console.log('stderr: ' + stderr);
    if(stdout > 0) {
      console.log('変更があります: ' + url.name);
      exec('opener ' + 'test/ss/images/' + diffDir + url.name + '_diff.jpg');
    }
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
});

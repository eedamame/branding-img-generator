var exec = require('child_process').exec,
    child,
    fs = require("fs");

// 設定項目
var config = require("./config.js"),
    data = config.data;
    beforeDomain = config.beforeDomain,
    afterDomain = config.afterDomain,
    beforeDir = config.beforeDir,
    afterDir = config.afterDir,
    diffDir = config.diffDir;

exec('mkdir ' + __dirname + '/images/' + diffDir);

data.forEach(function(url) {
  child = exec('composite -compose difference test/ss/images/' + beforeDir + url.name + '.png test/ss/images/' + afterDir + url.name + '.png test/ss/images/' + diffDir + url.name + '_diff.jpg',
  function (error, stdout, stderr) {
    console.log('CREATE DIFF FILE: ' + 'test/ss/images/' + diffDir + url.name + '_diff.jpg');
    //console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
});

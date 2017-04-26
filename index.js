'use strict'

// tools
const postcss = require('postcss');
const util = require('util');
const fs = require('fs');
const glob = require('glob');
const express = require('express');
const multer = require('multer');
const webshot = require('webshot');
const _ = require('underscore');

// cron
const exec = require('child_process').exec;
const cronJob = require('cron').CronJob;


const upload = multer({ dest: 'assets/uploads'}).single('logo');

// server
const app = express();
const server = app.listen(3000, function() {
  console.log("Node.js is listening to PORT:" + server.address().port);
  console.log("check -> http://localhost:" + server.address().port);
});


/* =============================================================================
   views
============================================================================= */

// View EngineにEJSを指定。
app.set('view engine', 'ejs');
// assetsディレクトリ内を静的ファイルとして使用する
app.use(express.static('assets'));

/* ----------------------------------------------
   初回画面の表示
---------------------------------------------- */
app.get("/", function(req, res, next){
  res.render("index", {logo:
    {
      filename: '/images/logo.png'
    }
  });
});


/* ----------------------------------------------
   アップ済の画像の参照
---------------------------------------------- */
app.get("/logo/:id", function(req, res, next){
  var logodata = {
    filename : '/uploads/' + req.params.id
  };
  res.render("brandimage", {logo: logodata});
});


/* ----------------------------------------------
   404
---------------------------------------------- */
app.use(function(req, res, next) {
  //res.status(404).send('Sorry cant find that!');
  res.status(404).render("404");
});


/* =============================================================================
   画像アップロード
============================================================================= */
app.post('/logoup', function (req, res) {
  upload(req, res, function(err) {
    if(err) {
      res.send("Failed to write " + req.file.destination + " with " + err);
    } else {
      //res.send("uploaded " + req.file.originalname + " as " + req.file.filename + " Size: " + req.file.size);
      //req.file.filename = '/uploads/' + req.file.filename;
      //res.render("index", {logo: req.file});
      res.redirect('/logo/' + req.file.filename);
    }
  });
});


/* =============================================================================
   スクリーンショット
============================================================================= */
app.get('/ss/:id', function(req, res, next){
  const locate = req.protocol + '://' + req.headers.host;
  const options = {
    renderDelay: 7000,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36"
  };
  console.log('locate: ', locate);
  webshot(locate + '/logo/' + req.params.id, 'ss.png', options,
    function(err) {
      if(err) {
        console.log(err);
      }
      //res.attachment();
    }
  );
});


/* =============================================================================
   一定期間後の画像ファイルを削除
============================================================================= */
const cronTime = '35 0 * * *';
//const cronTime = '30 00 * * *';
const deleteDays = 7; // ここに指定した日数より前にアップされた画像を削除する

const job = new cronJob({
  //実行したい日時 or crontab書式
  cronTime: cronTime
 
  //指定時に実行したい関数
  , onTick: function() {
    //console.log('onTick!');
    exec('find ./assets/uploads/ -mtime +' + deleteDays + ' | xargs rm -rf', (err, stdout, stderr) => {
      if (err) { console.log(err); }
      console.log(stdout);
    });
  }
 
  //ジョブの完了または停止時に実行する関数 
  , onComplete: function() {
    //console.log('onComplete!')
  }
 
  // コンストラクタを終する前にジョブを開始するかどうか
  , start: false
   
  //タイムゾーン
  , timeZone: "Asia/Tokyo"
})

//console.log('job status', job.running); // job status undefined

job.start();

//console.log('job status', job.running);

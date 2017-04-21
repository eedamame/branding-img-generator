'use strict'

// tools
const postcss = require('postcss');
const util = require('util');
const fs = require('fs');
const glob = require('glob');
const express = require('express');
const multer = require('multer');
const _ = require('underscore');

const upload = multer({ dest: 'assets/uploads'}).single('logo');

// server
const app = express();
const server = app.listen(3000, function() {
  console.log("Node.js is listening to PORT:" + server.address().port);
  console.log("check -> http://localhost:" + server.address().port);
});

let selectorList = []; // セレクタ情報突っ込む配列
let numberingList = []; // 重複カウント含む配列
let targetFileList = []; // 使用するcssファイル名を突っ込む配列

const targetFiles = './precheckitem/*.css';

glob( targetFiles, function(err, files) {
  files.forEach(function(file) {
    const css = fs.readFileSync(file);
    const root = postcss.parse(css);
    targetFileList.push(file);

    root.walk(function (rule) {
      const slct = rule.selector;
      if(slct) {
        let ruleItem;
        let thisAtRule = '';
        if(rule.parent.type === 'atrule') {
          thisAtRule = rule.parent.name + ' ' + rule.parent.params;// nameで、'media' とかが入る。params で、指定の内容が入る 'only screen and (min-width:768px)' とか
        }
        // 複数セレクタの場合は、分割する
        if(slct.match(/,/)) {
          const splitSelectors = slct.split(',');
          for(let i = 0; i<splitSelectors.length; i++) {
            ruleItem = {
              'selector': splitSelectors[i].toString().trim(),
              'line': rule.source.start.line,
              'file': file,
              'atrule': thisAtRule,
              'repeatNum': 1
            }
            selectorList.push(ruleItem);
          }
        } else {
          ruleItem = {
            'selector': rule.selector.toString().trim(),
            'line': rule.source.start.line,
            'file': file,
            'atrule': thisAtRule,
            'repeatNum': 1
          }
          selectorList.push(ruleItem);
        }
      }
    });
  })

  // セレクタ名でグルーピングしたオブジェクト
  let groupBySelector = _.groupBy(selectorList, 'selector')

  // ここでセレクタが重複するやつがあるかチェックして、repeatNumの値を調整する
  selectorList.forEach(function(listitem) {
    listitem.repeatNum = groupBySelector[listitem.selector].length;
    numberingList.push(listitem);
  });

  let returnData = {
    files: targetFileList,
    selectors: numberingList
  };


  /* =============================================================================
     API
  ============================================================================= */

  // セレクターリストを取得するAPI
  app.get("/api/css/selector", function(req, res, next){
      //res.json(selectorList);
      res.json(returnData);
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


  /* =============================================================================
     画像アップロード
  ============================================================================= */
  app.post('/logoup', function (req, res) {
    upload(req, res, function() {
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

});

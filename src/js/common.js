require('es6-promise').polyfill();
const axios = require('axios');

// dropされた画像のアップロード
const logoFileInput = document.getElementById('logoform__input--file');
const frm = new FormData();

/* =============================================================================
   DnDでのファイル読み込み
============================================================================= */
const dropArea = document.getElementById('area-dropimage');
const dropTxtIntro = document.getElementById('area-dropimage__text--intro');

dropArea.addEventListener('dragover', function(e) {
  e.preventDefault();
}, false);

dropArea.addEventListener('drop', function(e) {
  e.preventDefault();
  e.stopPropagation();

  var file;
  const dataTransfer = e.dataTransfer;

  // fileが存在しているときだけ処理する
  if ( dataTransfer.files.length !== 0) {
    file = dataTransfer.files;
    fileReader(file);
  }
}, false);


/* ----------------------------------------------
   ファイルを読み込む
---------------------------------------------- */
function fileReader(files) {
  reader = new FileReader();
  // ファイルの読み込み
  reader.readAsDataURL(files[0]);
  // ファイルの読み込み完了時の処理
  reader.addEventListener('load', function(e) {
    // reader.resultにdataURIで画像のデータが入っている
    const dropImg = document.createElement('img');
    dropImg.setAttribute('src', reader.result);

    // 読み込んだら、サムネイルを表示
    //dropArea.innerHTML = '';
    //dropArea.appendChild(dropImg);
    
    document.querySelector('body').classList.add('is-dropimage');
    //dropTxtIntro.innerHTML = '';
    document.getElementById('area-dropimage').appendChild(dropImg);

    const logoform = document.getElementById('logoform');

    // input type=file に追加
    logoFileInput.files = files;
    frm.append("logo", files[0]);

  }, false);
}

// dropされた画像のアップロード
const uploadBtnDropImg = document.getElementById('area-dropimage__submit--dropimage');
uploadBtnDropImg.addEventListener('click', function(e) {
  //e.preventDefault();
  axios.post('/droplogoup', frm)
  .then(function(res){
    console.log('axios res: ', res.data);
    window.location.href = '/logo/' + res.data;
  });
}, false);


//app.post('/logoup', function (req, res) {
//  upload(req, res, function(err) {
//    if(err) {
//      res.send("Failed to write " + req.file.destination + " with " + err);
//    } else {
//      //res.send("uploaded " + req.file.originalname + " as " + req.file.filename + " Size: " + req.file.size);
//      //req.file.filename = '/uploads/' + req.file.filename;
//      //res.render("index", {logo: req.file});
//      res.redirect('/logo/' + req.file.filename);
//    }
//  });
//});





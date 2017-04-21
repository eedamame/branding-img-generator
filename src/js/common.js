/* =============================================================================
   DnDでのファイル読み込み
============================================================================= */
const dropArea = document.getElementById('area-dropimage');

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
    dropArea.innerHTML = '';
    dropArea.appendChild(dropImg);

    const logoform = document.getElementById('logoform');

    // input type=file を削除
    const logoFileInput = document.getElementById('logoform__input--file');
    logoFileInput.files = files;

  }, false);
}

// 比較前の状態を表示するURL
var beforeDomain = ''; // ex) https://www.google.co.jp/
// 比較後の状態を表示するURL
var afterDomain = ''; // ex) https://local.google.co.jp/
// 比較前のキャプチャを入れるディレクトリ
var beforeDir = ''; // ex) '160215_before'
// 比較後のキャプチャを入れるディレクトリ
var afterDir = ''; // ex) '160215_after'
// YYMMDDではないディレクトリ名を使いたい場合はここにユニークな文字列を入れる。既にあった場合は上書き
var dirId = '';
// デバイスの指定（スマホ: 'sp'、タブレット： 'tablet'、指定なしの場合はpc）
var device = '';
// ユーザーエージェントを独自に指定したい場合は下記に入力
//var customUserAgent = '';
// デバイス指定でのウィンドウサイズ以外のサイズを指定したい場合は下記に入力
/*
var customViewportSize = {
  width: 640,
  height: 320
}
*/

/*
 * キャプチャをとるページリスト
 * name: 画像名
 * url: ドメインの後のurl
 */
var urlList = [
  {"name": "01_toppage", "url": ''},
//  {"name": "02_このサイトについて", "url": 'about/'},
//  {"name": "03_会社概要", "url": 'company/'},
  {"name": "04_プライバシーポリシー", "url": 'privacy/'}
]
/*
 * settings: オプションの指定
 * http://phantomjs.org/api/webpage/property/settings.html
 *   userAgent: ユーザーエージェントの指定（スマホなど）
 */
//module.exports.settings = {
//  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25'
//}

/* ========================================================================================================
 * 編集箇所ここまで
 ======================================================================================================== */


/*
 * ユニークなディレクトリ名にするためのid
 * 指定がなければ、実行時のYYYYMMDD
 * 同じIDの場合は上書きされる
 */
if(dirId !== '') {
  dirId = dirId;
} else {
  var now = new Date();
  var dirId = String(now.getFullYear()) + String((now.getMonth() + 1)) + String(now.getDate()); 
}

/*
 * 比較したいキャプチャを指定する場合。
 */
if(beforeDir) {
  module.exports.beforeTarget = true;
} else {
  module.exports.beforeTarget = false;
  var beforeDir = dirId + "_before"
}

/*
 * 比較するディレクトリを2つとも指定したい場合
 * 比較だけする
 */
if(afterDir) {
  module.exports.afterTarget = true;
} else {
  module.exports.afterTarget = false;
  var afterDir = dirId + "_after"
}

/*
 * デバイス
 * sp: スマホ　tablet: タブレット　指定なし: pc
 */
switch(device){
  case 'sp':
    var viewportSize = {
      width: 320,
      height: 568
    }
    var ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A405 Safari/600.1.4';
    break;
  case 'tablet':
    var viewportSize = {
      width: 768,
      height: 1024
    }
    var ua = 'Mozilla/5.0 (iPad; CPU OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A405 Safari/600.1.4';
    break;
  default:
    var viewportSize = {
      width: 1280,
      height: 900
    }
    var ua = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.63 Safari/537.36';
    var device = 'pc';
    break;
}
if(typeof customUserAgent !== 'undefined') {
  ua = customUserAgent;
}
if(typeof customViewportSize !== 'undefined') {
  viewportSize = customViewportSize;
}

module.exports.beforeDomain = beforeDomain;
module.exports.beforeDir = beforeDir + '/';
module.exports.afterDomain = afterDomain;
module.exports.afterDir = afterDir + "/";
module.exports.diffDir = dirId + "_diff/";
module.exports.data = urlList;
module.exports.viewportSize = viewportSize;
module.exports.settings = {
  userAgent: ua
}

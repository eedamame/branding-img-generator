var fs = require("fs"),
    currentdir = fs.absolute("."),// phantomJSでのパスの取得
    LOAD_WAIT_TIME = 10000,
    index = 0;

// 設定項目
var config = require(currentdir + "/test/ss/config.js"),// phantomJSでのパスの取得
    data = config.data,
    beforeDomain = config.beforeDomain,
    afterDomain = config.afterDomain,
    beforeDir = config.beforeDir,
    afterDir = config.afterDir,
    viewportSize = config.viewportSize,
    settings = config.settings,
    beforeTarget = config.beforeTarget,
    afterTarget = config.afterTarget;

/*
 * doscreenshot
 * domain -> スクリーンショットをとるページのドメイン
 * dir -> 書き出し先のディレクトリ
 * callback -> コールバック関数
 */
var doScreenshot = function(domain, dir, callback) {

  scraper(data[index], domain, dir);

  function scraper(urlArray, domain, dir) {
    var webPage = require("webpage");
    var page = webPage.create();
    if(viewportSize) page.viewportSize = viewportSize;
    if(settings) page.settings = settings;

    console.info("opening URL:", domain + urlArray["url"]);
    // ページを開く
    page.open(domain + urlArray["url"], function(status) {
      console.log("open status:", status);
      // アクセスに成功
      if (status === "success") {
        page.evaluate(function() {
          document.body.bgColor = "white";
        });
        setTimeout(function() {
          takeScreenshot(page, urlArray, dir);
          exitIfLast(index, data);
        }, LOAD_WAIT_TIME);
      } else {
      // アクセスに失敗
        console.error("Error: couldn't open the page!");
        page.close();
        console.info("The page is closing! URL: " + urlArray["url"]);
        exitIfLast(index, data);
      }
    });

    page.onError = function(msg, trace) {
      var msgStack = ['ERROR: ' + msg];
      if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
          msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
        });
      }
      console.error(msgStack.join('\n'));
      console.error(msg);
    };

    page.onConsoleMessage = function(msg, lineNum, sourceId) {
      console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
    };

    page.onResourceError = function(resourceError) {
      page.reason = resourceError.errorString;
      console.log(page.reason);
    };
  }

  // スクリーンショットをとる
  function takeScreenshot(page, urlArray, dir) {
      var fileName =  urlArray["name"];
      page.render("test/ss/images/" + dir + fileName + ".png");
      console.info("rendered: test/ss/images/" + dir + fileName + ".png");
  }

  // 残りページ数をチェック、0の時かつcallbackがあれば、callback実行。
  // callbackがなければ、終了する。
  function exitIfLast(innerIndex, data) {
    console.info( parseInt(data.length - innerIndex-1), "more screenshots to go!");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    if (innerIndex === data.length-1) {
      if(callback) {
        index = 0;
        callback();
      } else {
        console.info("FINISH GET SCREENSHOTS");
        phantom.exit();
      }
    } else {
        index++;
        scraper(data[index], domain, dir);
    }
  }
}

/*
 * 比較ディレクトリを2つとも指定している場合はキャプチャ作成しないので、return
 * 比較対象ディレクトリがある場合は、キャプチャは現状のものだけ
 */
if(beforeTarget && afterTarget) {
  console.log('キャプチャの作成はしない');
  phantom.exit();
} else if(beforeTarget && !afterTarget) {
  doScreenshot(afterDomain, afterDir);
} else {
  doScreenshot(beforeDomain, beforeDir,
    // callback
    doScreenshot.bind(this, afterDomain, afterDir)
  );
}

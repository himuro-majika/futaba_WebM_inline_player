
## なにコレ
ブラウザ上で動くUserscriptです  

ふたば☆ちゃんねるWebM板のWebM動画をページ内でインラインで表示します。  

Firefox + [Greasemonkey](https://addons.mozilla.org/ja/firefox/addon/greasemonkey/),  
Chrome + [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo),  
Opera(ver.15+) + [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/)  
で動作確認済みです

※このUserscriptは[赤福Firefox SP](http://toshiakisp.github.io/akahuku-firefox-sp/)と[ふたクロ](http://futakuro.com/)に対応しています。


## 使い方
動画のサムネイルにマウスを乗せると動作します。  
ページ左上のボタンから設定変更できます  

## 更新履歴
* v1.4 2016-01-07
  - 設定画面追加
  - その他細かな修正
* v1.3 2016-01-03
  - デフォルトで4chan風の大きいサイズのプレイヤーに変更(ソース内設定 ``USE_FULLPLAYER`` を ``false`` にすると以前のミニサイズのプレーヤーを使用できます)
* v1.2 2015-12-30
  - ふたクロに対応
* v1.1 2015-12-30
  - デフォルトでループ再生するように
  - ページを開いた時のメモリ消費を改善
* v1.0 2015-12-29
  - 公開

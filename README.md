
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

## オプション設定  
* ループ再生
* ミュート状態で再生
* フルサイズプレーヤー(画面右上のスペースに表示される大きいサイズのプレーヤー)

  - 動画の下に再生時間を表示
  - 再生速度変更(実験的)
* ミニサイズプレーヤー(サムネ画像と置き換わる同サイズの小さいプレーヤー)
  - 自動再生を有効にする(マウスオーバーで即再生開始)
  - コントロールの表示

## 更新履歴
* v1.5 2016-01-09
  - オプションにフルプレーヤー使用時の再生速度コントロールを追加しました(実験的)  
	※ブラウザの種類・動画の内容によってうまく動かない場合があります
* v1.4.1 2016-01-07
  - 動作対象ページの指定が1ページ目以降で動作しない設定になっていたのを修正
* v1.4 2016-01-07
  - 設定画面追加
  - その他細かな修正
* v1.3 2016-01-03
  - デフォルトで4chan風の大きいサイズのプレイヤーに変更<del>(ソース内設定 ``USE_FULLPLAYER`` を ``false`` にすると以前のミニサイズのプレーヤーを使用できます)</del> →設定画面から変更できます
* v1.2 2015-12-30
  - ふたクロに対応
* v1.1 2015-12-30
  - デフォルトでループ再生するように
  - ページを開いた時のメモリ消費を改善
* v1.0 2015-12-29
  - 公開

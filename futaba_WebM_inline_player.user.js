// ==UserScript==
// @name        futaba WebM inline player
// @namespace   https://github.com/himuro-majika
// @description WebMをページ内で再生しちゃう
// @author      himuro_majika
// @include     http://may.2chan.net/webm/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @version     1.2
// @grant       none
// @run-at      document-idle
// @license     MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAPUExURYv4i2PQYy2aLUe0R////zorx9oAAAAFdFJOU/////8A+7YOUwAAAElJREFUeNqUj1EOwDAIQoHn/c88bX+2fq0kRsAoUXVAfwzCttWsDWzw0kNVWd2tZ5K9gqmMZB8libt4pSg6YlO3RnTzyxePAAMAzqMDgTX8hYYAAAAASUVORK5CYII=
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function ($) {
	/**
	 * 設定
	 */
	// ループ再生を有効にする
	var USE_LOOP = true;
	// 自動再生を有効にする
	var USE_AUTOPLAY = true;
	// コントロールを表示する
	var USE_CONTROLS = true;
	// ミュート状態で再生する
	var USE_MUTED = false;
	
	
	init();
	function init() {
		var AKAHUKU = false, FUTAKURO = false;
		// 赤福が有効か
		if ($("#akahuku_thumbnail").length) { AKAHUKU = true; }
		// ふたクロが有効か
		if ($("#master").length) { FUTAKURO = true; }
		getImgNodeThread();
		getImgNodeRes();
		if (AKAHUKU || FUTAKURO) {
			observeInserted();
		}
		// スレ画
		function getImgNodeThread() {
			var $sure_a = $("body > form > a > img");
			if (FUTAKURO) { // ふたクロ
				$sure_a = $("#master > a > img");
			}
			$sure_a.each(function() {
				replaceNode($(this));
			});
		}
		// レス画像
		function getImgNodeRes() {
			var $res_a = $(".rtd > a > img");
			$res_a.each(function() {
				replaceNode($(this));
			});
		}
		// 続きを読むで挿入される要素を監視
		function observeInserted() {
			var target = $("html > body > form[action]:not([enctype])").get(0);
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					var $nodes = $(mutation.addedNodes);
					replaceNodeInserted($nodes);
				});
			});
			observer.observe(target, { childList: true });
		}
		// 挿入されたレス
		function replaceNodeInserted($nodes) {
			var $res_inserted = $nodes.find("td > a > img");
			if (AKAHUKU) {
				if ($res_inserted.length) {
					replaceNode($res_inserted);
				}
			} else if (FUTAKURO) {
				$res_inserted.each(function(){
					replaceNode($(this));
				});
			}
		}
		// ノードの書き換え
		function replaceNode(node) {
			var href = node.parent().attr("href");
			if (!href.match(/\.webm$/)) {
				// 拡張子.webm以外
				return;
			}
			var width = node.attr("width");
			var height = node.attr("height");
			var $video;
			// マウスオーバーで読み込み
			node.hover(function(){
				if (USE_AUTOPLAY) {
					addFullPlayer();
				} else {
					addMiniPlayer();
				}
			},function(){
				if (USE_AUTOPLAY) {
					removeFullPlayer();
				}
			});
			// フルプレイヤー
			function addFullPlayer() {
				var $video_container = $(".GM_fwip_container_full");
				if ($video_container.length){
					$video_container.remove();
				}
				var offset = parseInt(node.offset().left) + parseInt(width);
				$video = $("<div>", {
					class: "GM_fwip_container_full",
					css: {
						"margin": "0 20px",
						"float": "left",
						"clear": "left",
						"position": "fixed",
						"top": "20px",
						"right": "0px",
						// "border": "5px solid #333",
						// "border-radius": "5px",
						"box-shadow": "0 0 10px 5px rgba(0,0,0,0.5)",
						"z-index": "2000000013",
					}
				}).append(
					$("<video>", {
						class: "GM_fwip_player",
						css: {
							"width": "auto",
							"height": "auto",
							"max-width": "calc(100vw - " + offset + "px - 40px)",
							"max-height": "calc(100vh - 40px)",
						},
					}).prop({
						// controls: USE_CONTROLS,
						autoplay: USE_AUTOPLAY,
						loop: USE_LOOP,
						muted: USE_MUTED,
						preload: true,
					}).append(
						$("<source>", {
							src: href,
							type: "video/webm",
						})
					)
				);
				node.parent().before($video);
			}
			// ミニプレイヤー
			function addMiniPlayer() {
				$video = $("<div>", {
					class: "GM_fwip_container_mini",
					css: {
						"margin": "0 20px",
						"float": "left",
						"clear": "left",
					}
				}).append(
					$("<video>", {
						class: "GM_fwip_player",
						css: {
							"width": width,
							"height": height,
						},
					}).prop({
						controls: USE_CONTROLS,
						autoplay: USE_AUTOPLAY,
						loop: USE_LOOP,
						muted: USE_MUTED,
					}).append(
						$("<source>", {
							src: href,
							type: "video/webm",
						})
					)
				);
				// サムネイル画像を隠す
				node.hide();
				node.parent().before($video);
			}
			function removeFullPlayer() {
				var $video_container = $(".GM_fwip_container_full");
				$video_container.remove();
			}
		}
	}

})(jQuery);

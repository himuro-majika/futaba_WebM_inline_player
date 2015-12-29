// ==UserScript==
// @name        futaba WebM inline player
// @namespace   https://github.com/himuro-majika
// @description WebMをページ内で再生しちゃう
// @author      himuro_majika
// @include     http://may.2chan.net/webm/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @version     1
// @grant       none
// @run-at      document-idle
// @license     MIT
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function ($) {
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
		// 挿入されたレスに属性を付加
		function replaceNodeInserted($nodes) {
			var $res_inserted = $nodes.find("td > a > img");
			if ($res_inserted.length) {
				replaceNode($res_inserted);
			}
		}
		// ノードの書き換え
		function replaceNode(node) {
			// console.log(node);
			var href = node.parent().attr("href");
			if (!href.match(/\.webm$/)) {
				// 拡張子.webm以外
				return;
			}
			var width = node.attr("width");
			var height = node.attr("height");
			var $video = $("<video>", {
				controls: "controls",
				// hspace: "20",
				class: "GM_fwip_player",
				css: {
					"width": width,
					"height": height,
					"margin": "0 20px",
					"float": "left",
					"clear": "left",
				},
			}).append(
				$("<source>", {
					src: href,
					type: "video/webm",
				})
			);
			// マウスオーバーで読み込み
			node.hover(function(){
				// サムネイル画像を隠す
				node.hide();
				// node.parent().attr("href","");
				// node.parent().append($video);
				node.parent().replaceWith($video);
			});
		}
	}
	
	

})(jQuery);

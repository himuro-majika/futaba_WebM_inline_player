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

	add_class_and_rel();
	// スレ内の画像にクラス、rel属性を付加する
	function add_class_and_rel() {
		var AKAHUKU = false, FUTAKURO = false, FUTABOARD = false;
		// 赤福が有効か
		if ($("#akahuku_thumbnail").length) { AKAHUKU = true; }
		// ふたクロが有効か
		if ($("#master").length) { FUTAKURO = true; }
		// futaboardか
		if ($("#threadsbox").length) { FUTABOARD = true; }
		add_class_and_rel_Thread();
		add_class_and_rel_Res();
		if (AKAHUKU || FUTAKURO) {
			observeInserted();
		}
		// スレ画
		function add_class_and_rel_Thread() {
			var $sure_a = $("body > form > a > img");
			if (FUTAKURO) { // ふたクロ
				$sure_a = $("#master > a > img");
			}
			if (FUTABOARD) { // futaboard
				$sure_a = $(".d7 > a > img");
			}
			$sure_a.each(function() {
				addAttr($(this));
			});
		}
		// レス画像
		function add_class_and_rel_Res() {
			//  var Start = new Date().getTime();//count parsing time
			var $res_a = $(".rtd > a > img");
			if (FUTABOARD) { // futaboard
				$res_a = $(".d6 > table img");
			}
			$res_a.each(function() {
				addAttr($(this));
			});
			//  console.log('Parsing : '+((new Date()).getTime()-Start) +'msec');//log parsing time
		}
		// 続きを読むで挿入される要素を監視
		function observeInserted() {
			var target = $("html > body > form[action]:not([enctype])").get(0);
			if (FUTABOARD) {
				target = $(".d6").get(0); // futaboard
			}
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					var $nodes = $(mutation.addedNodes);
					add_class_res_inserted($nodes);
				});
			});
			observer.observe(target, { childList: true });
		}
		// 挿入されたレスに属性を付加
		function add_class_res_inserted($nodes) {
			//  var Start = new Date().getTime();//count parsing time
			var $res_a_inserted = $nodes.find("td > a > img");
			addAttr($res_a_inserted);
			//  console.log('Parsing : '+((new Date()).getTime()-Start) +'msec');//log parsing time
		}
		// ノードにクラス、属性を付加
		function addAttr(node) {
			// console.log(node);
			var href = node.parent().attr("href");
			if (!href.match(/\.webm$/)) {
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
					"text-align": "left",
					"margin" : "0 20px",
				},
			}).append(
				$("<source>", {
					src: href,
					type: "video/webm",
					css: {
					}
				})
			);
			// サムネイル画像を隠す
			node.hide();
			node.parent().attr("href","");
			node.parent().append($video);
			
		}
		// ノードからfancyboxクラス、属性を削除
		function removeAttr(node) {
			node.removeClass("futaba_lightbox");
			node.attr("rel", "");
		}
	}
	
	

})(jQuery);

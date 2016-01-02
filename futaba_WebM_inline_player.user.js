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
	// フルサイズプレーヤーを有効にする(4chanライクな表示)
	var USE_FULLPLAYER = true;
	// ループ再生を有効にする
	var USE_LOOP = true;
	// 自動再生を有効にする(ミニサイズプレーヤー使用時)
	var USE_AUTOPLAY = false;
	// コントロールを表示する(ミニサイズプレーヤー使用時)
	var USE_CONTROLS = true;
	// ミュート状態で再生する
	var USE_MUTED = false;
	// フルサイズプレーヤーに時間を表示する
	var USE_TIME_DISPLAY = true;
	
	
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
			var timer;
			// マウスオーバーで読み込み
			node.hover(function(){
				if (USE_FULLPLAYER) {
					timer = setTimeout(function(){
						showFullPlayer();
					}, 300);
				} else {
					addMiniPlayer();
				}
			},function(){
				if (USE_FULLPLAYER) {
					clearTimeout(timer);
					hideFullPlayer();
				}
			});
			// ミニプレイヤー
			function addMiniPlayer() {
				var $videoContainer = $("<div>", {
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
				node.parent().before($videoContainer);
			}
			// フルプレイヤーを表示する
			function showFullPlayer() {
				hideFullPlayer();
				// サムネ右端のオフセット
				var offset = parseInt(node.offset().left) + parseInt(width);
				var $videoContainer = $("<div>", {
					class: "GM_fwip_container_full",
					css: {
						"background-color": "#000",
						"position": "fixed",
						"top": "20px",
						"right": "20px",
						// "border": "5px solid #333",
						// "border-radius": "5px",
						"box-shadow": "0 0 10px 5px rgba(0,0,0,0.5)",
						"z-index": "2000000013",
					}
				});
				var $videoPlayer = $("<video>", {
					class: "GM_fwip_player",
					css: {
						"width": "auto",
						"height": "auto",
						"max-width": $(window).width() - offset - 40,
						"max-height": $(window).height() - 40,
					},
				}).prop({
					autoplay: true,
					loop: USE_LOOP,
					muted: USE_MUTED,
					preload: true,
				}).append(
					$("<source>", {
						src: href,
						type: "video/webm",
						error: function() {
							// ソースの読み込み失敗イベント
							onerror();
						},
					})
				);
				$videoContainer.append($videoPlayer);
				if (USE_TIME_DISPLAY) {
					$videoPlayer.on("loadedmetadata", function(){
						// メタデータ読み込み完了イベント
						showDuration($(this).get(0));
					}).on("timeupdate", function() {
						// 再生位置変更イベント
						showCurrentTime($(this).get(0));
					});
					$videoContainer.append(
						$("<div>", {
							class: "GM_fwip_time_container",
							css: {
								"font-size": "6pt",
								"font-family": "arial,helvetica,sans-serif",
								postion: "relative",
								"text-align": "right",
								color: "#fff",
							}
						}).append(
							$("<span>", {
								class: "GM_fwip_time_current"
							})
						).append(
							$("<span>").text("/")
						).append(
							$("<span>", {
								class: "GM_fwip_time_duration",
							})
						)
					);
				}
				$("body").append($videoContainer);
				// 動画の長さを表示する
				function showDuration(video) {
					var webm_duration = parseTime(video.duration);
					$(".GM_fwip_time_duration").text(webm_duration);
				}
				// 再生時間を表示する
				function showCurrentTime(video) {
					var currenttime = parseTime(video.currentTime);
					$(".GM_fwip_time_current").text(currenttime);
				}
				// エラー表示
				function onerror() {
					$videoContainer.children().remove();
					$videoContainer.append(
						$("<p>", {
							text: "動画が読み込めませんでした",
							class: "GM_fwip_error",
							css: {
								"text-align": "center",
								"background-color": "#fff",
								"color": "#c00"
							}
						})
					);
				}
			}
			// フルプレーヤーを消す
			function hideFullPlayer() {
				var $container = $(".GM_fwip_container_full");
				if ($container.length) {
					$container.remove();
				}
			}
		}
		// 秒をhh:mm:ss形式で返す
		function parseTime(sec) {
			var date = new Date(0,0,0,0,0,sec);
			var time = 
				("0" + date.getHours()).slice( -2 ) + ":" +
				("0" + date.getMinutes()).slice( -2 ) + ":" +
				("0" + date.getSeconds()).slice( -2 );
			return time;
		}
	}

})(jQuery);

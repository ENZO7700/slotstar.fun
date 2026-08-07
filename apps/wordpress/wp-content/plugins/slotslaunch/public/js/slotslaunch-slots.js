!function (a) { "use strict"; var b = "starRating", c = function () { }, d = { totalStars: 5, useFullStars: !1, starShape: "straight", emptyColor: "lightgray", hoverColor: "orange", activeColor: "gold", ratedColor: "crimson", useGradient: !0, readOnly: !1, disableAfterRate: !0, baseUrl: !1, starGradient: { start: "#FEF7CD", end: "#FF9511" }, strokeWidth: 4, strokeColor: "black", initialRating: 0, starSize: 40, callback: c, onHover: c, onLeave: c }, e = function (c, e) { var f, g, h; this.element = c, this.$el = a(c), this.settings = a.extend({}, d, e), f = this.$el.data("rating") || this.settings.initialRating, h = this.settings.forceRoundUp ? Math.ceil : Math.round, g = (h(2 * f) / 2).toFixed(1), this._state = { rating: g }, this._uid = Math.floor(999 * Math.random()), e.starGradient || this.settings.useGradient || (this.settings.starGradient.start = this.settings.starGradient.end = this.settings.activeColor), this._defaults = d, this._name = b, this.init() }, f = { init: function () { this.renderMarkup(), this.addListeners(), this.initRating() }, addListeners: function () { this.settings.readOnly || (this.$stars.on("mouseover", this.hoverRating.bind(this)), this.$stars.on("mouseout", this.restoreState.bind(this)), this.$stars.on("click", this.handleRating.bind(this))) }, hoverRating: function (a) { var b = this.getIndex(a); this.paintStars(b, "hovered"), this.settings.onHover(b + 1, this._state.rating, this.$el) }, handleRating: function (a) { var b = this.getIndex(a), c = b + 1; this.applyRating(c, this.$el), this.executeCallback(c, this.$el), this.settings.disableAfterRate && this.$stars.off() }, applyRating: function (a) { var b = a - 1; this.paintStars(b, "rated"), this._state.rating = b + 1, this._state.rated = !0 }, restoreState: function (a) { var b = this.getIndex(a), c = this._state.rating || -1, d = this._state.rated ? "rated" : "active"; this.paintStars(c - 1, d), this.settings.onLeave(b + 1, this._state.rating, this.$el) }, getIndex: function (b) { var c = a(b.currentTarget), d = c.width(), e = a(b.target).attr("data-side"), f = this.settings.minRating; e = e ? e : this.getOffsetByPixel(b, c, d), e = this.settings.useFullStars ? "right" : e; var g = c.index() - ("left" === e ? .5 : 0); return g = .5 > g && b.offsetX < d / 4 ? -1 : g, g = f && f <= this.settings.totalStars && f > g ? f - 1 : g }, getOffsetByPixel: function (a, b, c) { var d = a.pageX - b.offset().left; return c / 2 >= d && !this.settings.useFullStars ? "left" : "right" }, initRating: function () { this.paintStars(this._state.rating - 1, "active") }, paintStars: function (b, c) { var d, e, f, g, h = this.settings; a.each(this.$stars, function (i, j) { d = a(j).find('[data-side="left"]'), e = a(j).find('[data-side="right"]'), f = g = b >= i ? c : "empty", f = i - b === .5 ? c : f, d.attr("class", "svg-" + f + "-" + this._uid), e.attr("class", "svg-" + g + "-" + this._uid); var k, l = b >= 0 ? Math.ceil(b) : 0; k = h.ratedColors && h.ratedColors.length && h.ratedColors[l] ? h.ratedColors[l] : this._defaults.ratedColor, "rated" === c && b > -1 && ((i <= Math.ceil(b) || 1 > i && 0 > b) && d.attr("style", "fill:" + k), b >= i && e.attr("style", "fill:" + k)) }.bind(this)) }, renderMarkup: function () { for (var a = this.settings, b = a.baseUrl ? location.href.split("#")[0] : "", c = '<div class="jq-star" style="width:' + a.starSize + "px;  height:" + a.starSize + 'px;"><svg version="1.0" class="jq-star-svg" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" ' + this.getSvgDimensions(a.starShape) + " stroke-width:" + a.strokeWidth + 'px;" xml:space="preserve"><style type="text/css">.svg-empty-' + this._uid + "{fill:url(" + b + "#" + this._uid + "_SVGID_1_);}.svg-hovered-" + this._uid + "{fill:url(" + b + "#" + this._uid + "_SVGID_2_);}.svg-active-" + this._uid + "{fill:url(" + b + "#" + this._uid + "_SVGID_3_);}.svg-rated-" + this._uid + "{fill:" + a.ratedColor + ";}</style>" + this.getLinearGradient(this._uid + "_SVGID_1_", a.emptyColor, a.emptyColor, a.starShape) + this.getLinearGradient(this._uid + "_SVGID_2_", a.hoverColor, a.hoverColor, a.starShape) + this.getLinearGradient(this._uid + "_SVGID_3_", a.starGradient.start, a.starGradient.end, a.starShape) + this.getVectorPath(this._uid, { starShape: a.starShape, strokeWidth: a.strokeWidth, strokeColor: a.strokeColor }) + "</svg></div>", d = "", e = 0; e < a.totalStars; e++)d += c; this.$el.append(d), this.$stars = this.$el.find(".jq-star") }, getVectorPath: function (a, b) { return "rounded" === b.starShape ? this.getRoundedVectorPath(a, b) : this.getSpikeVectorPath(a, b) }, getSpikeVectorPath: function (a, b) { return '<polygon data-side="center" class="svg-empty-' + a + '" points="281.1,129.8 364,55.7 255.5,46.8 214,-59 172.5,46.8 64,55.4 146.8,129.7 121.1,241 212.9,181.1 213.9,181 306.5,241 " style="fill: transparent; stroke: ' + b.strokeColor + ';" /><polygon data-side="left" class="svg-empty-' + a + '" points="281.1,129.8 364,55.7 255.5,46.8 214,-59 172.5,46.8 64,55.4 146.8,129.7 121.1,241 213.9,181.1 213.9,181 306.5,241 " style="stroke-opacity: 0;" /><polygon data-side="right" class="svg-empty-' + a + '" points="364,55.7 255.5,46.8 214,-59 213.9,181 306.5,241 281.1,129.8 " style="stroke-opacity: 0;" />' }, getRoundedVectorPath: function (a, b) { var c = "M520.9,336.5c-3.8-11.8-14.2-20.5-26.5-22.2l-140.9-20.5l-63-127.7 c-5.5-11.2-16.8-18.2-29.3-18.2c-12.5,0-23.8,7-29.3,18.2l-63,127.7L28,314.2C15.7,316,5.4,324.7,1.6,336.5S1,361.3,9.9,370 l102,99.4l-24,140.3c-2.1,12.3,2.9,24.6,13,32c5.7,4.2,12.4,6.2,19.2,6.2c5.2,0,10.5-1.2,15.2-3.8l126-66.3l126,66.2 c4.8,2.6,10,3.8,15.2,3.8c6.8,0,13.5-2.1,19.2-6.2c10.1-7.3,15.1-19.7,13-32l-24-140.3l102-99.4 C521.6,361.3,524.8,348.3,520.9,336.5z"; return '<path data-side="center" class="svg-empty-' + a + '" d="' + c + '" style="stroke: ' + b.strokeColor + '; fill: transparent; " /><path data-side="right" class="svg-empty-' + a + '" d="' + c + '" style="stroke-opacity: 0;" /><path data-side="left" class="svg-empty-' + a + '" d="M121,648c-7.3,0-14.1-2.2-19.8-6.4c-10.4-7.6-15.6-20.3-13.4-33l24-139.9l-101.6-99 c-9.1-8.9-12.4-22.4-8.6-34.5c3.9-12.1,14.6-21.1,27.2-23l140.4-20.4L232,164.6c5.7-11.6,17.3-18.8,30.2-16.8c0.6,0,1,0.4,1,1 v430.1c0,0.4-0.2,0.7-0.5,0.9l-126,66.3C132,646.6,126.6,648,121,648z" style="stroke: ' + b.strokeColor + '; stroke-opacity: 0;" />' }, getSvgDimensions: function (a) { return "rounded" === a ? 'width="550px" height="500.2px" viewBox="0 146.8 550 500.2" style="enable-background:new 0 0 550 500.2;' : 'x="0px" y="0px" width="305px" height="305px" viewBox="60 -62 309 309" style="enable-background:new 64 -59 305 305;' }, getLinearGradient: function (a, b, c, d) { var e = "rounded" === d ? 500 : 250; return '<linearGradient id="' + a + '" gradientUnits="userSpaceOnUse" x1="0" y1="-50" x2="0" y2="' + e + '"><stop  offset="0" style="stop-color:' + b + '"/><stop  offset="1" style="stop-color:' + c + '"/> </linearGradient>' }, executeCallback: function (a, b) { var c = this.settings.callback; c(a, b) } }, g = { unload: function () { var c = "plugin_" + b, d = a(this), e = d.data(c).$stars; e.off(), d.removeData(c).remove() }, setRating: function (c, d) { var e = "plugin_" + b, f = a(this), g = f.data(e); c > g.settings.totalStars || 0 > c || (d && (c = Math.round(c)), g.applyRating(c)) }, getRating: function () { var c = "plugin_" + b, d = a(this), e = d.data(c); return e._state.rating }, resize: function (c) { var d = "plugin_" + b, e = a(this), f = e.data(d), g = f.$stars; return 1 >= c || c > 200 ? void console.error("star size out of bounds") : (g = Array.prototype.slice.call(g), void g.forEach(function (b) { a(b).css({ width: c + "px", height: c + "px" }) })) }, setReadOnly: function (c) { var d = "plugin_" + b, e = a(this), f = e.data(d); c === !0 ? f.$stars.off("mouseover mouseout click") : (f.settings.readOnly = !1, f.addListeners()) } }; a.extend(e.prototype, f), a.fn[b] = function (c) { if (!a.isPlainObject(c)) { if (g.hasOwnProperty(c)) return g[c].apply(this, Array.prototype.slice.call(arguments, 1)); a.error("Method " + c + " does not exist on " + b + ".js") } return this.each(function () { a.data(this, "plugin_" + b) || a.data(this, "plugin_" + b, new e(this, c)) }) } }(jQuery, window, document);
/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
!function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto) }(function (a) { var b, c, d, e, f, g, h = "Close", i = "BeforeClose", j = "AfterClose", k = "BeforeAppend", l = "MarkupParse", m = "Open", n = "Change", o = "mfp", p = "." + o, q = "mfp-ready", r = "mfp-removing", s = "mfp-prevent-close", t = function () { }, u = !!window.jQuery, v = a(window), w = function (a, c) { b.ev.on(o + a + p, c) }, x = function (b, c, d, e) { var f = document.createElement("div"); return f.className = "mfp-" + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), c && f.appendTo(c)), f }, y = function (c, d) { b.ev.triggerHandler(o + c, d), b.st.callbacks && (c = c.charAt(0).toLowerCase() + c.slice(1), b.st.callbacks[c] && b.st.callbacks[c].apply(b, a.isArray(d) ? d : [d])) }, z = function (c) { return c === g && b.currTemplate.closeBtn || (b.currTemplate.closeBtn = a(b.st.closeMarkup.replace("%title%", b.st.tClose)), g = c), b.currTemplate.closeBtn }, A = function () { a.magnificPopup.instance || (b = new t, b.init(), a.magnificPopup.instance = b) }, B = function () { var a = document.createElement("p").style, b = ["ms", "O", "Moz", "Webkit"]; if (void 0 !== a.transition) return !0; for (; b.length;)if (b.pop() + "Transition" in a) return !0; return !1 }; t.prototype = { constructor: t, init: function () { var c = navigator.appVersion; b.isLowIE = b.isIE8 = document.all && !document.addEventListener, b.isAndroid = /android/gi.test(c), b.isIOS = /iphone|ipad|ipod/gi.test(c), b.supportsTransition = B(), b.probablyMobile = b.isAndroid || b.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), d = a(document), b.popupsCache = {} }, open: function (c) { var e; if (c.isObj === !1) { b.items = c.items.toArray(), b.index = 0; var g, h = c.items; for (e = 0; e < h.length; e++)if (g = h[e], g.parsed && (g = g.el[0]), g === c.el[0]) { b.index = e; break } } else b.items = a.isArray(c.items) ? c.items : [c.items], b.index = c.index || 0; if (b.isOpen) return void b.updateItemHTML(); b.types = [], f = "", c.mainEl && c.mainEl.length ? b.ev = c.mainEl.eq(0) : b.ev = d, c.key ? (b.popupsCache[c.key] || (b.popupsCache[c.key] = {}), b.currTemplate = b.popupsCache[c.key]) : b.currTemplate = {}, b.st = a.extend(!0, {}, a.magnificPopup.defaults, c), b.fixedContentPos = "auto" === b.st.fixedContentPos ? !b.probablyMobile : b.st.fixedContentPos, b.st.modal && (b.st.closeOnContentClick = !1, b.st.closeOnBgClick = !1, b.st.showCloseBtn = !1, b.st.enableEscapeKey = !1), b.bgOverlay || (b.bgOverlay = x("bg").on("click" + p, function () { b.close() }), b.wrap = x("wrap").attr("tabindex", -1).on("click" + p, function (a) { b._checkIfClose(a.target) && b.close() }), b.container = x("container", b.wrap)), b.contentContainer = x("content"), b.st.preloader && (b.preloader = x("preloader", b.container, b.st.tLoading)); var i = a.magnificPopup.modules; for (e = 0; e < i.length; e++) { var j = i[e]; j = j.charAt(0).toUpperCase() + j.slice(1), b["init" + j].call(b) } y("BeforeOpen"), b.st.showCloseBtn && (b.st.closeBtnInside ? (w(l, function (a, b, c, d) { c.close_replaceWith = z(d.type) }), f += " mfp-close-btn-in") : b.wrap.append(z())), b.st.alignTop && (f += " mfp-align-top"), b.fixedContentPos ? b.wrap.css({ overflow: b.st.overflowY, overflowX: "hidden", overflowY: b.st.overflowY }) : b.wrap.css({ top: v.scrollTop(), position: "absolute" }), (b.st.fixedBgPos === !1 || "auto" === b.st.fixedBgPos && !b.fixedContentPos) && b.bgOverlay.css({ height: d.height(), position: "absolute" }), b.st.enableEscapeKey && d.on("keyup" + p, function (a) { 27 === a.keyCode && b.close() }), v.on("resize" + p, function () { b.updateSize() }), b.st.closeOnContentClick || (f += " mfp-auto-cursor"), f && b.wrap.addClass(f); var k = b.wH = v.height(), n = {}; if (b.fixedContentPos && b._hasScrollBar(k)) { var o = b._getScrollbarSize(); o && (n.marginRight = o) } b.fixedContentPos && (b.isIE7 ? a("body, html").css("overflow", "hidden") : n.overflow = "hidden"); var r = b.st.mainClass; return b.isIE7 && (r += " mfp-ie7"), r && b._addClassToMFP(r), b.updateItemHTML(), y("BuildControls"), a("html").css(n), b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo || a(document.body)), b._lastFocusedEl = document.activeElement, setTimeout(function () { b.content ? (b._addClassToMFP(q), b._setFocus()) : b.bgOverlay.addClass(q), d.on("focusin" + p, b._onFocusIn) }, 16), b.isOpen = !0, b.updateSize(k), y(m), c }, close: function () { b.isOpen && (y(i), b.isOpen = !1, b.st.removalDelay && !b.isLowIE && b.supportsTransition ? (b._addClassToMFP(r), setTimeout(function () { b._close() }, b.st.removalDelay)) : b._close()) }, _close: function () { y(h); var c = r + " " + q + " "; if (b.bgOverlay.detach(), b.wrap.detach(), b.container.empty(), b.st.mainClass && (c += b.st.mainClass + " "), b._removeClassFromMFP(c), b.fixedContentPos) { var e = { marginRight: "" }; b.isIE7 ? a("body, html").css("overflow", "") : e.overflow = "", a("html").css(e) } d.off("keyup" + p + " focusin" + p), b.ev.off(p), b.wrap.attr("class", "mfp-wrap").removeAttr("style"), b.bgOverlay.attr("class", "mfp-bg"), b.container.attr("class", "mfp-container"), !b.st.showCloseBtn || b.st.closeBtnInside && b.currTemplate[b.currItem.type] !== !0 || b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach(), b.st.autoFocusLast && b._lastFocusedEl && a(b._lastFocusedEl).focus(), b.currItem = null, b.content = null, b.currTemplate = null, b.prevHeight = 0, y(j) }, updateSize: function (a) { if (b.isIOS) { var c = document.documentElement.clientWidth / window.innerWidth, d = window.innerHeight * c; b.wrap.css("height", d), b.wH = d } else b.wH = a || v.height(); b.fixedContentPos || b.wrap.css("height", b.wH), y("Resize") }, updateItemHTML: function () { var c = b.items[b.index]; b.contentContainer.detach(), b.content && b.content.detach(), c.parsed || (c = b.parseEl(b.index)); var d = c.type; if (y("BeforeChange", [b.currItem ? b.currItem.type : "", d]), b.currItem = c, !b.currTemplate[d]) { var f = b.st[d] ? b.st[d].markup : !1; y("FirstMarkupParse", f), f ? b.currTemplate[d] = a(f) : b.currTemplate[d] = !0 } e && e !== c.type && b.container.removeClass("mfp-" + e + "-holder"); var g = b["get" + d.charAt(0).toUpperCase() + d.slice(1)](c, b.currTemplate[d]); b.appendContent(g, d), c.preloaded = !0, y(n, c), e = c.type, b.container.prepend(b.contentContainer), y("AfterChange") }, appendContent: function (a, c) { b.content = a, a ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[c] === !0 ? b.content.find(".mfp-close").length || b.content.append(z()) : b.content = a : b.content = "", y(k), b.container.addClass("mfp-" + c + "-holder"), b.contentContainer.append(b.content) }, parseEl: function (c) { var d, e = b.items[c]; if (e.tagName ? e = { el: a(e) } : (d = e.type, e = { data: e, src: e.src }), e.el) { for (var f = b.types, g = 0; g < f.length; g++)if (e.el.hasClass("mfp-" + f[g])) { d = f[g]; break } e.src = e.el.attr("data-mfp-src"), e.src || (e.src = e.el.attr("href")) } return e.type = d || b.st.type || "inline", e.index = c, e.parsed = !0, b.items[c] = e, y("ElementParse", e), b.items[c] }, addGroup: function (a, c) { var d = function (d) { d.mfpEl = this, b._openClick(d, a, c) }; c || (c = {}); var e = "click.magnificPopup"; c.mainEl = a, c.items ? (c.isObj = !0, a.off(e).on(e, d)) : (c.isObj = !1, c.delegate ? a.off(e).on(e, c.delegate, d) : (c.items = a, a.off(e).on(e, d))) }, _openClick: function (c, d, e) { var f = void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick; if (f || !(2 === c.which || c.ctrlKey || c.metaKey || c.altKey || c.shiftKey)) { var g = void 0 !== e.disableOn ? e.disableOn : a.magnificPopup.defaults.disableOn; if (g) if (a.isFunction(g)) { if (!g.call(b)) return !0 } else if (v.width() < g) return !0; c.type && (c.preventDefault(), b.isOpen && c.stopPropagation()), e.el = a(c.mfpEl), e.delegate && (e.items = d.find(e.delegate)), b.open(e) } }, updateStatus: function (a, d) { if (b.preloader) { c !== a && b.container.removeClass("mfp-s-" + c), d || "loading" !== a || (d = b.st.tLoading); var e = { status: a, text: d }; y("UpdateStatus", e), a = e.status, d = e.text, b.preloader.html(d), b.preloader.find("a").on("click", function (a) { a.stopImmediatePropagation() }), b.container.addClass("mfp-s-" + a), c = a } }, _checkIfClose: function (c) { if (!a(c).hasClass(s)) { var d = b.st.closeOnContentClick, e = b.st.closeOnBgClick; if (d && e) return !0; if (!b.content || a(c).hasClass("mfp-close") || b.preloader && c === b.preloader[0]) return !0; if (c === b.content[0] || a.contains(b.content[0], c)) { if (d) return !0 } else if (e && a.contains(document, c)) return !0; return !1 } }, _addClassToMFP: function (a) { b.bgOverlay.addClass(a), b.wrap.addClass(a) }, _removeClassFromMFP: function (a) { this.bgOverlay.removeClass(a), b.wrap.removeClass(a) }, _hasScrollBar: function (a) { return (b.isIE7 ? d.height() : document.body.scrollHeight) > (a || v.height()) }, _setFocus: function () { (b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus() }, _onFocusIn: function (c) { return c.target === b.wrap[0] || a.contains(b.wrap[0], c.target) ? void 0 : (b._setFocus(), !1) }, _parseMarkup: function (b, c, d) { var e; d.data && (c = a.extend(d.data, c)), y(l, [b, c, d]), a.each(c, function (c, d) { if (void 0 === d || d === !1) return !0; if (e = c.split("_"), e.length > 1) { var f = b.find(p + "-" + e[0]); if (f.length > 0) { var g = e[1]; "replaceWith" === g ? f[0] !== d[0] && f.replaceWith(d) : "img" === g ? f.is("img") ? f.attr("src", d) : f.replaceWith(a("<img>").attr("src", d).attr("class", f.attr("class"))) : f.attr(e[1], d) } } else b.find(p + "-" + c).html(d) }) }, _getScrollbarSize: function () { if (void 0 === b.scrollbarSize) { var a = document.createElement("div"); a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(a), b.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a) } return b.scrollbarSize } }, a.magnificPopup = { instance: null, proto: t.prototype, modules: [], open: function (b, c) { return A(), b = b ? a.extend(!0, {}, b) : {}, b.isObj = !0, b.index = c || 0, this.instance.open(b) }, close: function () { return a.magnificPopup.instance && a.magnificPopup.instance.close() }, registerModule: function (b, c) { c.options && (a.magnificPopup.defaults[b] = c.options), a.extend(this.proto, c.proto), this.modules.push(b) }, defaults: { disableOn: 0, key: null, midClick: !1, mainClass: "", preloader: !0, focus: "", closeOnContentClick: !1, closeOnBgClick: !0, closeBtnInside: !0, showCloseBtn: !0, enableEscapeKey: !0, modal: !1, alignTop: !1, removalDelay: 0, prependTo: null, fixedContentPos: "auto", fixedBgPos: "auto", overflowY: "auto", closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>', tClose: "Close (Esc)", tLoading: "Loading...", autoFocusLast: !0 } }, a.fn.magnificPopup = function (c) { A(); var d = a(this); if ("string" == typeof c) if ("open" === c) { var e, f = u ? d.data("magnificPopup") : d[0].magnificPopup, g = parseInt(arguments[1], 10) || 0; f.items ? e = f.items[g] : (e = d, f.delegate && (e = e.find(f.delegate)), e = e.eq(g)), b._openClick({ mfpEl: e }, d, f) } else b.isOpen && b[c].apply(b, Array.prototype.slice.call(arguments, 1)); else c = a.extend(!0, {}, c), u ? d.data("magnificPopup", c) : d[0].magnificPopup = c, b.addGroup(d, c); return d }; var C, D, E, F = "inline", G = function () { E && (D.after(E.addClass(C)).detach(), E = null) }; a.magnificPopup.registerModule(F, { options: { hiddenClass: "hide", markup: "", tNotFound: "Content not found" }, proto: { initInline: function () { b.types.push(F), w(h + "." + F, function () { G() }) }, getInline: function (c, d) { if (G(), c.src) { var e = b.st.inline, f = a(c.src); if (f.length) { var g = f[0].parentNode; g && g.tagName && (D || (C = e.hiddenClass, D = x(C), C = "mfp-" + C), E = f.after(D).detach().removeClass(C)), b.updateStatus("ready") } else b.updateStatus("error", e.tNotFound), f = a("<div>"); return c.inlineElement = f, f } return b.updateStatus("ready"), b._parseMarkup(d, {}, c), d } } }); var H, I = "ajax", J = function () { H && a(document.body).removeClass(H) }, K = function () { J(), b.req && b.req.abort() }; a.magnificPopup.registerModule(I, { options: { settings: null, cursor: "mfp-ajax-cur", tError: '<a href="%url%">The content</a> could not be loaded.' }, proto: { initAjax: function () { b.types.push(I), H = b.st.ajax.cursor, w(h + "." + I, K), w("BeforeChange." + I, K) }, getAjax: function (c) { H && a(document.body).addClass(H), b.updateStatus("loading"); var d = a.extend({ url: c.src, success: function (d, e, f) { var g = { data: d, xhr: f }; y("ParseAjax", g), b.appendContent(a(g.data), I), c.finished = !0, J(), b._setFocus(), setTimeout(function () { b.wrap.addClass(q) }, 16), b.updateStatus("ready"), y("AjaxContentAdded") }, error: function () { J(), c.finished = c.loadError = !0, b.updateStatus("error", b.st.ajax.tError.replace("%url%", c.src)) } }, b.st.ajax.settings); return b.req = a.ajax(d), "" } } }); var L, M = function (c) { if (c.data && void 0 !== c.data.title) return c.data.title; var d = b.st.image.titleSrc; if (d) { if (a.isFunction(d)) return d.call(b, c); if (c.el) return c.el.attr(d) || "" } return "" }; a.magnificPopup.registerModule("image", { options: { markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>', cursor: "mfp-zoom-out-cur", titleSrc: "title", verticalFit: !0, tError: '<a href="%url%">The image</a> could not be loaded.' }, proto: { initImage: function () { var c = b.st.image, d = ".image"; b.types.push("image"), w(m + d, function () { "image" === b.currItem.type && c.cursor && a(document.body).addClass(c.cursor) }), w(h + d, function () { c.cursor && a(document.body).removeClass(c.cursor), v.off("resize" + p) }), w("Resize" + d, b.resizeImage), b.isLowIE && w("AfterChange", b.resizeImage) }, resizeImage: function () { var a = b.currItem; if (a && a.img && b.st.image.verticalFit) { var c = 0; b.isLowIE && (c = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)), a.img.css("max-height", b.wH - c) } }, _onImageHasSize: function (a) { a.img && (a.hasSize = !0, L && clearInterval(L), a.isCheckingImgSize = !1, y("ImageHasSize", a), a.imgHidden && (b.content && b.content.removeClass("mfp-loading"), a.imgHidden = !1)) }, findImageSize: function (a) { var c = 0, d = a.img[0], e = function (f) { L && clearInterval(L), L = setInterval(function () { return d.naturalWidth > 0 ? void b._onImageHasSize(a) : (c > 200 && clearInterval(L), c++, void (3 === c ? e(10) : 40 === c ? e(50) : 100 === c && e(500))) }, f) }; e(1) }, getImage: function (c, d) { var e = 0, f = function () { c && (c.img[0].complete ? (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("ready")), c.hasSize = !0, c.loaded = !0, y("ImageLoadComplete")) : (e++, 200 > e ? setTimeout(f, 100) : g())) }, g = function () { c && (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("error", h.tError.replace("%url%", c.src))), c.hasSize = !0, c.loaded = !0, c.loadError = !0) }, h = b.st.image, i = d.find(".mfp-img"); if (i.length) { var j = document.createElement("img"); j.className = "mfp-img", c.el && c.el.find("img").length && (j.alt = c.el.find("img").attr("alt")), c.img = a(j).on("load.mfploader", f).on("error.mfploader", g), j.src = c.src, i.is("img") && (c.img = c.img.clone()), j = c.img[0], j.naturalWidth > 0 ? c.hasSize = !0 : j.width || (c.hasSize = !1) } return b._parseMarkup(d, { title: M(c), img_replaceWith: c.img }, c), b.resizeImage(), c.hasSize ? (L && clearInterval(L), c.loadError ? (d.addClass("mfp-loading"), b.updateStatus("error", h.tError.replace("%url%", c.src))) : (d.removeClass("mfp-loading"), b.updateStatus("ready")), d) : (b.updateStatus("loading"), c.loading = !0, c.hasSize || (c.imgHidden = !0, d.addClass("mfp-loading"), b.findImageSize(c)), d) } } }); var N, O = function () { return void 0 === N && (N = void 0 !== document.createElement("p").style.MozTransform), N }; a.magnificPopup.registerModule("zoom", { options: { enabled: !1, easing: "ease-in-out", duration: 300, opener: function (a) { return a.is("img") ? a : a.find("img") } }, proto: { initZoom: function () { var a, c = b.st.zoom, d = ".zoom"; if (c.enabled && b.supportsTransition) { var e, f, g = c.duration, j = function (a) { var b = a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"), d = "all " + c.duration / 1e3 + "s " + c.easing, e = { position: "fixed", zIndex: 9999, left: 0, top: 0, "-webkit-backface-visibility": "hidden" }, f = "transition"; return e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d, b.css(e), b }, k = function () { b.content.css("visibility", "visible") }; w("BuildControls" + d, function () { if (b._allowZoom()) { if (clearTimeout(e), b.content.css("visibility", "hidden"), a = b._getItemToZoom(), !a) return void k(); f = j(a), f.css(b._getOffset()), b.wrap.append(f), e = setTimeout(function () { f.css(b._getOffset(!0)), e = setTimeout(function () { k(), setTimeout(function () { f.remove(), a = f = null, y("ZoomAnimationEnded") }, 16) }, g) }, 16) } }), w(i + d, function () { if (b._allowZoom()) { if (clearTimeout(e), b.st.removalDelay = g, !a) { if (a = b._getItemToZoom(), !a) return; f = j(a) } f.css(b._getOffset(!0)), b.wrap.append(f), b.content.css("visibility", "hidden"), setTimeout(function () { f.css(b._getOffset()) }, 16) } }), w(h + d, function () { b._allowZoom() && (k(), f && f.remove(), a = null) }) } }, _allowZoom: function () { return "image" === b.currItem.type }, _getItemToZoom: function () { return b.currItem.hasSize ? b.currItem.img : !1 }, _getOffset: function (c) { var d; d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem); var e = d.offset(), f = parseInt(d.css("padding-top"), 10), g = parseInt(d.css("padding-bottom"), 10); e.top -= a(window).scrollTop() - f; var h = { width: d.width(), height: (u ? d.innerHeight() : d[0].offsetHeight) - g - f }; return O() ? h["-moz-transform"] = h.transform = "translate(" + e.left + "px," + e.top + "px)" : (h.left = e.left, h.top = e.top), h } } }); var P = "iframe", Q = "//about:blank", R = function (a) { if (b.currTemplate[P]) { var c = b.currTemplate[P].find("iframe"); c.length && (a || (c[0].src = Q), b.isIE8 && c.css("display", a ? "block" : "none")) } }; a.magnificPopup.registerModule(P, { options: { markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>', srcAction: "iframe_src", patterns: { youtube: { index: "youtube.com", id: "v=", src: "//www.youtube.com/embed/%id%?autoplay=1" }, vimeo: { index: "vimeo.com/", id: "/", src: "//player.vimeo.com/video/%id%?autoplay=1" }, gmaps: { index: "//maps.google.", src: "%id%&output=embed" } } }, proto: { initIframe: function () { b.types.push(P), w("BeforeChange", function (a, b, c) { b !== c && (b === P ? R() : c === P && R(!0)) }), w(h + "." + P, function () { R() }) }, getIframe: function (c, d) { var e = c.src, f = b.st.iframe; a.each(f.patterns, function () { return e.indexOf(this.index) > -1 ? (this.id && (e = "string" == typeof this.id ? e.substr(e.lastIndexOf(this.id) + this.id.length, e.length) : this.id.call(this, e)), e = this.src.replace("%id%", e), !1) : void 0 }); var g = {}; return f.srcAction && (g[f.srcAction] = e), b._parseMarkup(d, g, c), b.updateStatus("ready"), d } } }); var S = function (a) { var c = b.items.length; return a > c - 1 ? a - c : 0 > a ? c + a : a }, T = function (a, b, c) { return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c) }; a.magnificPopup.registerModule("gallery", { options: { enabled: !1, arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', preload: [0, 2], navigateByImgClick: !0, arrows: !0, tPrev: "Previous (Left arrow key)", tNext: "Next (Right arrow key)", tCounter: "%curr% of %total%" }, proto: { initGallery: function () { var c = b.st.gallery, e = ".mfp-gallery"; return b.direction = !0, c && c.enabled ? (f += " mfp-gallery", w(m + e, function () { c.navigateByImgClick && b.wrap.on("click" + e, ".mfp-img", function () { return b.items.length > 1 ? (b.next(), !1) : void 0 }), d.on("keydown" + e, function (a) { 37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next() }) }), w("UpdateStatus" + e, function (a, c) { c.text && (c.text = T(c.text, b.currItem.index, b.items.length)) }), w(l + e, function (a, d, e, f) { var g = b.items.length; e.counter = g > 1 ? T(c.tCounter, f.index, g) : "" }), w("BuildControls" + e, function () { if (b.items.length > 1 && c.arrows && !b.arrowLeft) { var d = c.arrowMarkup, e = b.arrowLeft = a(d.replace(/%title%/gi, c.tPrev).replace(/%dir%/gi, "left")).addClass(s), f = b.arrowRight = a(d.replace(/%title%/gi, c.tNext).replace(/%dir%/gi, "right")).addClass(s); e.click(function () { b.prev() }), f.click(function () { b.next() }), b.container.append(e.add(f)) } }), w(n + e, function () { b._preloadTimeout && clearTimeout(b._preloadTimeout), b._preloadTimeout = setTimeout(function () { b.preloadNearbyImages(), b._preloadTimeout = null }, 16) }), void w(h + e, function () { d.off(e), b.wrap.off("click" + e), b.arrowRight = b.arrowLeft = null })) : !1 }, next: function () { b.direction = !0, b.index = S(b.index + 1), b.updateItemHTML() }, prev: function () { b.direction = !1, b.index = S(b.index - 1), b.updateItemHTML() }, goTo: function (a) { b.direction = a >= b.index, b.index = a, b.updateItemHTML() }, preloadNearbyImages: function () { var a, c = b.st.gallery.preload, d = Math.min(c[0], b.items.length), e = Math.min(c[1], b.items.length); for (a = 1; a <= (b.direction ? e : d); a++)b._preloadItem(b.index + a); for (a = 1; a <= (b.direction ? d : e); a++)b._preloadItem(b.index - a) }, _preloadItem: function (c) { if (c = S(c), !b.items[c].preloaded) { var d = b.items[c]; d.parsed || (d = b.parseEl(c)), y("LazyLoad", d), "image" === d.type && (d.img = a('<img class="mfp-img" />').on("load.mfploader", function () { d.hasSize = !0 }).on("error.mfploader", function () { d.hasSize = !0, d.loadError = !0, y("LazyLoadError", d) }).attr("src", d.src)), d.preloaded = !0 } } } }); var U = "retina"; a.magnificPopup.registerModule(U, { options: { replaceSrc: function (a) { return a.src.replace(/\.\w+$/, function (a) { return "@2x" + a }) }, ratio: 1 }, proto: { initRetina: function () { if (window.devicePixelRatio > 1) { var a = b.st.retina, c = a.ratio; c = isNaN(c) ? c() : c, c > 1 && (w("ImageHasSize." + U, function (a, b) { b.img.css({ "max-width": b.img[0].naturalWidth / c, width: "100%" }) }), w("ElementParse." + U, function (b, d) { d.src = a.replaceSrc(d, c) })) } } } }), A() });
/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function (b, c) { var $ = b.jQuery || b.Cowboy || (b.Cowboy = {}), a; $.throttle = a = function (e, f, j, i) { var h, d = 0; if (typeof f !== "boolean") { i = j; j = f; f = c } function g() { var o = this, m = +new Date() - d, n = arguments; function l() { d = +new Date(); j.apply(o, n) } function k() { h = c } if (i && !h) { l() } h && clearTimeout(h); if (i === c && m > e) { l() } else { if (f !== true) { h = setTimeout(i ? k : l, i === c ? e - m : e) } } } if ($.guid) { g.guid = j.guid = j.guid || $.guid++ } return g }; $.debounce = function (d, e, f) { return f === c ? a(d, e, false) : a(d, f, e !== false) } })(this); (function ($) {
    'use strict';

    let sl_promo_popup_timer = null;
    const sl_init_promo_popup = function () {
        if (sl_promo_popup_timer) {
            clearTimeout(sl_promo_popup_timer);
            sl_promo_popup_timer = null;
        }
        if (!$('.sl-popup').length) {
            return;
        }
        $('.sl-close-popup').off('click.slPromoPopup').on('click.slPromoPopup', function () {
            $('.sl-popup').fadeOut();
        });
        const delaySec = parseInt($('.sl-popup').data('trigger'), 10);
        const delayMs = (isNaN(delaySec) ? 0 : delaySec) * 1000;
        sl_promo_popup_timer = setTimeout(function () {
            $('.sl-popup').fadeIn();
            sl_promo_popup_timer = null;
        }, delayMs);
    };

    const sl_check_grid = function () {
        const grid_width = jQuery('.slotsl-grid').width();
        jQuery('.slotsl-grid').removeClass('sl-grid-2 sl-grid-3 sl-grid-4');
        if (grid_width > 600 && grid_width < 768) {
            jQuery('.slotsl-grid').addClass('sl-grid-2');
        }
        if (grid_width > 768 && grid_width < 950) {
            jQuery('.slotsl-grid').addClass('sl-grid-3');
        }

        if (grid_width > 950) {
            jQuery('.slotsl-grid').addClass(slotsl.grid);
        }
    }
    const sl_init_standalone_urls = () => {
        if (slotsl.single_page == '1') {
            $(document).off('click.slStandalone', '.slotsl-url');
            if (slotsl.single_popup == '1') {
                $(document).on('click.slStandalone', '.slotsl-url', function (e) {
                    e.preventDefault();
                    const sid = $(this).data('sid');
                    sl_load_game_popup(sid);
                });
            } else {
                $(document).on('click.slStandalone', '.slotsl-url', function (e) {
                    e.preventDefault();
                    const sid = $(this).data('sid');
                    if (!history.state || history.state.sid !== sid) {
                        history.pushState({ sid: sid }, $(this).text(), $(this).data('url'))
                    }
                    sl_load_game(sid);
                });
            }
        }
    }
    sl_check_grid();
    $(window).on('resize', sl_check_grid);
    $('.slots-select-providers,#slots-sort,.slots-select-themes,.slots-select-types,.sl-filters ').on('change', function () {
        const container = $(this).closest('.slotsl-container');
        // $('.'+$(this).attr('class')).val($(this).val())
        $(container).find('#slotsl-filters').submit();
    });
    const sl_load_game_popup = function (game_id) {
        $.get(slotsl.ajax_url, { action: 'slotsl_game_url', sid: game_id })
            .done(function (data) {
                if (data.success) {
                    const payload = data.data;
                    const url = typeof payload === 'string' ? payload : payload.url;
                    $('#sl-single-game-popup iframe').attr('src', url);
                    $('#sl-single-game-popup .sl-popup').remove();
                    if (payload && payload.popup_html) {
                        $('#sl-single-game-popup').append(payload.popup_html);
                    }
                    $('#sl-single-game-popup').css('display', 'flex');
                    $('.slotsl-container').css('filter', 'blur(3px)');
                    sl_init_promo_popup();
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert('Something wrong happened. Try refreshing the page.')
            });
        $('#sl-single-game-popup').on('click', function (e) {
            if ($(e.target).closest('.sl-popup').length) {
                return;
            }
            if (!$(e.target).is('iframe') && !$(e.target).closest('iframe').length) {
                e.preventDefault();
                if (sl_promo_popup_timer) {
                    clearTimeout(sl_promo_popup_timer);
                    sl_promo_popup_timer = null;
                }
                $('#sl-single-game-popup .sl-popup').hide();
                $('.slotsl-container').css('filter', 'none');
                $('#sl-single-game-popup').css('display', 'none');
                $('#sl-single-game-popup iframe').attr('src', '');
            }
        });
    }
    const sl_load_game = function (game_id) {
        $.get(slotsl.ajax_url, { action: 'slotsl_load_single', sid: game_id })
            .done(function (data) {
                if (data.success) {
                    if ($('.sl-single-game-container').length) {
                        $('.sl-single-game-container').replaceWith(data.data);
                    } else {
                        $('.slotsl-container').replaceWith(data.data);
                    }
                    sl_init_ratings();
                    sl_init_broken_form();
                    sl_init_click();
                    sl_init_fullscreen();
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                alert('Something wrong happened. Try refreshing the page.')
            });
    }
    const sl_init_broken_form = function () {
        $('.sl-broken-link').magnificPopup({
            type: 'inline',
            midClick: false
        });
        $('#sl-broken-link-form').on('submit', function (e) {
            e.preventDefault();
            $('#sl-broken-submit').attr('disabled', true);
            $('#sl-broken-submit').css('opacity', '0.2');
            $.post(slotsl.api + 'broken-link', $(this).serialize())
                .done(function (data) {
                    $('#sl-broken-link-form').html('<p style="align:center">Thanks for your feedback, we will try to resolve it as soon as possible!</p>').hide().fadeIn();
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    $.magnificPopup.close();
                    $('#sl-broken-submit').attr('disabled', false);
                    $('#sl-broken-submit').css('opacity', '1');
                });
        });
    }
    if (slotsl.single_page == '1') {
        const hash = window.location.hash.substr(7);
        if (window.location.hash.includes('slot=') && hash) {
            sl_load_game(hash);
        }
        sl_init_standalone_urls();
        $(window).on('popstate', function (event) {
            // Check if URL contains a hash
            if (window.location.hash) {
                return; // Do nothing if it's a hash link
            }
            if (event.originalEvent.state && event.originalEvent.state.sid) {
                sl_load_game(event.originalEvent.state.sid);
            } else {
                window.location.href = slotsl.lobby_url;
            }
        });
    }


    const sl_launch_game = (button) => {
        const placeholder = button.closest('.sl-placeholder');
        const iframe = placeholder.prev('.sl-responsive-iframe');
        iframe.attr('src', iframe.data('src'));

        setTimeout(function () {
            placeholder.fadeOut();
        }, 1500);
        sl_init_promo_popup();
    }
    const sl_init_click = () => {
        $('.sl-placeholder').on('click', 'button,a,.sl-gamethumb', function (e) {
            if (!$(this).hasClass('sl-play-for-real') && !$(this).hasClass('sl-coming-soon')) {
                e.preventDefault();
                $(this).attr('disabled', true);
                sl_launch_game($(this));
            }
        });
    };

    const sl_init_ratings = function () {
        $('.sl-rating_votes').each(function () {
            const rating_votes = $(this);
            if (parseInt(rating_votes.data('votes')) > 0) {
                const rating = rating_votes.prev(".sl-rating_stars").starRating({
                    initialRating: rating_votes.data('rating'),
                    starSize: 20,
                    useGradient: false,
                    activeColor: '#ffde03',
                    hoverColor: '#ffde03',
                    strokeWidth: 0,
                    callback: function (currentRating) {
                        $.post(slotsl.api + 'rating/' + rating_votes.data('gid') + '?rating=' + currentRating)
                            .done(function (data) {
                                rating_votes.prevAll('.sl-rating_text').html('Thanks for voting!').hide().fadeIn();
                                rating_votes.find('span').text(parseInt($('.sl-rating_votes').data('votes') + 1)).hide().fadeIn();
                                rating.starRating('setRating', data.rating, true);
                            })
                            .fail(function (jqXHR, textStatus, errorThrown) {
                                alert('You already voted today.')
                            });
                    }
                })
            } else {
                const settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": slotsl.api + 'rating/' + rating_votes.data('gid'),
                    "method": "GET",
                    "headers": {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    }
                };
                $.ajax(settings).done(function (response) {
                    rating_votes.attr('data-votes', response.total);
                    rating_votes.find('span').text(response.total);
                    const rating = rating_votes.prev(".sl-rating_stars").starRating({
                        initialRating: response.rating,
                        starSize: 20,
                        useGradient: false,
                        activeColor: '#ffde03',
                        hoverColor: '#ffde03',
                        strokeWidth: 0,
                        callback: function (currentRating) {
                            $.post(slotsl.api + 'rating/' + rating_votes.data('gid') + '?rating=' + currentRating)
                                .done(function (data) {
                                    rating_votes.prevAll('.sl-rating_text').html('Thanks for voting!').hide().fadeIn();
                                    rating_votes.find('span').text(parseInt($('.sl-rating_votes').data('votes') + 1)).hide().fadeIn();
                                    rating.starRating('setRating', data.rating, true);
                                })
                                .fail(function (jqXHR, textStatus, errorThrown) {
                                    alert('You already voted today.')
                                });
                        }
                    })
                    // ld-json
                    if (parseInt(response.total) > 0) {
                        sl_json.aggregateRating.ratingValue = response.rating;
                        sl_json.aggregateRating.ratingCount = response.total;
                        let newJson = JSON.stringify(sl_json);
                        const script = document.createElement('script');
                        script.setAttribute('type', 'application/ld+json');
                        script.setAttribute('id', 'sl-json');
                        script.textContent = newJson;
                        document.head.appendChild(script);
                    }
                    $.ajax({
                        'url': slotsl.ajax_url,
                        'method': 'POST',
                        'dataType': 'json',
                        'data': { action: 'slotsl_save_rating', rating: response, slot_id: rating_votes.data('slotid') },
                        'error': function (response) {
                            console.log(response.error);
                        }
                    });
                })
            }

        })
    }
    const sl_init_fullscreen = () => {
        $('a.sl-fullscreen').on('click', function (e) {
            e.preventDefault();
            const container = $(this).closest('.sl-container').find('.sl-slots');
            $('.sl-close-fullscreen').show();
            sl_FullScreen(container[0]);
        });

        $('a.sl-close-fullscreen').on('click', function (e) {
            e.preventDefault();
            sl_cancelFullScreen();
        });
    }
    const sl_cancelFullScreen = () => {
        var el = document;
        var requestMethod = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen || el.webkitExitFullscreen;
        if (requestMethod) { // cancel full screen.
            requestMethod.call(el);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        } else {
            $('.sl-container').append($('.sl-slots'));
            $('.sl-slots').removeClass('sl-fullscreen-mobile');
        }
        $('.sl-close-fullscreen').hide();
        // for mobile
        $('.sl-slots').removeClass('sl-fullscreen-mobile');
        $('.sl-slots').removeClass('sl-fullscreen-mode');
    }

    const sl_FullScreen = (el) => {

        $('.sl-slots').addClass('sl-fullscreen-mode');

        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) { // Safari
            el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) { // IE11
            el.msRequestFullscreen();
        } else if (el.mozRequestFullScreen) { // Firefox
            el.mozRequestFullScreen();
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            const wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        } else {
            // Fallback for mobile devices that don't support programmatic full screen
            $('.sl-slots').addClass('sl-fullscreen-mobile');
            $('#slotsl-fullscreen-placeholder').append($('.sl-slots'));
        }
    }

    $(document).ready(function () {
        sl_init_click();
        sl_init_fullscreen();
        if ($('.sl-rating_votes').length) {
            sl_init_ratings();
            sl_init_broken_form();
        }
        $('.slotsl-container').each(function () {
            const container = $(this);
            container.find('.slotsl-select').each(function () {
                const choices = new Choices($(this)[0]);
                $(this).data('inst', choices);
            });

            container.find('input#sl-name').on('input', $.debounce(500, function (e) {
                if ($(this).data('search') == 'providers') {
                    slgames.loadProviders({
                        'name': e.target.value,
                    });
                } else {
                    $('.sl_total_viewed').data('viewed', 0)
                    slgames.loadGames({
                        'name': e.target.value,
                    }, container);
                }
            }));
        });
        $('.slotsl-container').each(function () {
            const container = $(this);
            container.find('#slotsl-filters').on('submit', function (e) {
                e.preventDefault();
                container.find('.sl_total_viewed').data('viewed', 0)
                slgames.loadGames({}, container);
                container.find('#slotsl-load-more').data('data-viewed', false);
            });
        });
        $('.sl-mobile-filter-button').on('click', function (e) {
            $(this).toggleClass('clicked');
            $('.sl-mobile-filters').toggleClass('show-filters');
        });
        $('.slotsl-load-more-btn').on('click', function (e) {
            e.preventDefault();
            const container = $(this).closest('.slotsl-container');
            $('.slotsl-load-more-btn').attr('disabled', true).addClass('active');
            let page = parseInt($(container).find('.sl_total_viewed').data('viewed')) / parseInt($(container).find('.sl_total_viewed').data('per-page'));
            page = page === 0 ? 1 : page;
            slgames.loadGames({
                'page': page + 1,
                'append': true
            }, container);
        });
        $('.slotsl-load-more-btn-providers').on('click', function (e) {
            e.preventDefault();
            const container = $(this).closest('.slotsl-container');
            $('.slotsl-load-more-btn-providers').attr('disabled', true).addClass('active');
            let page = parseInt($('.sl_total_viewed').data('viewed')) / parseInt($('.sl_total_viewed').data('per-page'));
            page = page === 0 ? 1 : page;
            slgames.loadProviders({
                'page': page + 1,
                'append': true
            }, container);
        });
        $('.slotsl-container').each(function () {
            let filters = JSON.parse(sessionStorage.getItem('sl_filters_' + $(this).find('#slotsl-filters').data('id')));
            if (!slotsl.remember_filters) {
                filters = 0;
            }
            let submit = false;
            if (filters && filters.search.length) {
                $(this).find('input#sl-name').val(filters.search);
                submit = true;
            }
            if (filters && filters.provider) {
                $(this).find('.slots-select-providers').val(filters.provider);
                $(this).find('.slotsl-select').each(function () {
                    $(this).data('inst').setChoiceByValue(filters.provider);
                });
                submit = true;
            }
            if (filters && filters.theme) {
                $(this).find('.slots-select-themes').val(filters.theme);
                submit = true;
            }
            if (filters && filters.type) {
                $(this).find('.slots-select-types').val(filters.type);
                submit = true;
            }
            if (filters && filters.filters.includes('megaways')) {
                $(this).find('#sl-megaways').attr('checked', 1);
                submit = true;
            }
            if (filters && filters.sort) {
                $(this).find('#slots-sort').val(filters.sort);
                submit = true;
            }
            // hack to display all the slots already viewed on refresh
            if (filters && filters.viewed) {
                $(this).find('.slotsl-load-more-btn').data('viewed', filters.viewed);
                submit = true;
                filters.viewed = null;
                sessionStorage.setItem('sl_filters_' + $(this).find('#slotsl-filters').data('id'), JSON.stringify(filters));
            }

            if (submit) {
                $(this).find('.sl_total_viewed').data('viewed', 0);
                slgames.loadGames({
                    'per_page': parseInt($(this).find('.slotsl-load-more-btn').data('viewed')) ?? 0,
                }, $(this));
            }
        });

    });
    const current_provider = function () {

        let sel_provider = $('.slots-select-providers').val()
        if ((!sel_provider || !sel_provider.length) && $('.slots-select-providers').data('providers')) {
            sel_provider = $('.slots-select-providers').data('providers');
        }
        return sel_provider;
    }

    const SLGames = function () {
        var self = this;

        this.getAjaxArgs = (options) => {
            //console.log('getting query data');
            return {
                'action': 'sl_get_slots',
                'sl-page': options.page ? options.page : 1,
                'sl-provider': options.provider ? options.provider : '',
                'sl-theme': options.theme ? options.theme : '',
                'sl-type': options.type ? options.type : '',
                'sl-sort': options.sort ? options.sort : '',
                'sl-name': options.name ? options.name : '',
                'sl-filter': options.filters ? options.filters : '',
                'per_page': options.per_page ? options.per_page : '',
            };
        };
        this.showLoader = () => {
            $('.slotsl-grid').hide();
            $('.slotsl-loader').addClass('visible');
        };

        this.hideLoader = () => {
            $('.slotsl-grid').fadeIn();
            $('.slotsl-loader').removeClass('visible');
            $('.slotsl-load-more-btn').attr('disabled', false).removeClass('active');
            $('.slotsl-load-more-btn-providers').attr('disabled', false).removeClass('active');
        };
        this.loadProviders = (options, callback) => {
            if (!options.append) {
                this.showLoader();
            }
            if (!options) {
                const options = {};
            }
            const args = this.getAjaxArgs(options);

            $.get(slotsl.ajax_url, {
                'action': 'sl_get_providers',
                'sl-name': options.name ? options.name : '',
                'offset': $('.sl_total_viewed').data('viewed'),
                'per_page': parseInt($('.sl_total_viewed').data('per-page')),
            })
                .done(function (res) {
                    let $html = '';
                    self.hideLoader();
                    if (res.success) {
                        const index_url = $('.slotsl-grid').data('url');
                        $.each(res.data.providers, function (key, provider) {
                            $html += self.mapHtmlProviders(provider, index_url);
                        });
                        if (options.append) {
                            $('.slotsl-grid').append($html);
                        } else {
                            $('.slotsl-grid').html($html);
                        }

                        const total_viewed = parseInt($('.sl_total_viewed').data('viewed')) + $(res.data.providers).length
                        const total_games = res.data.total;
                        $('.sl_total_found').text(total_games);
                        $('.sl_total_viewed').text(total_viewed);
                        $('.sl_total_viewed').data('viewed', total_viewed)
                        $('.slotsl-progress-bar-fill').css('width', ((total_viewed * 100) / total_games) + '%');

                        if (total_games == total_viewed) {
                            $('.slotsl-load-more-btn-providers').hide()
                        } else {
                            $('.slotsl-load-more-btn-providers').show()
                        }
                    }
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    self.hideLoader();
                    alert('Something wrong happened. Try refreshing the page.')
                });

        };
        this.mapHtmlProviders = (provider, index_url) => {
            let html = '<div class="slotsl-game"><div class="slotsl-thumb">';
            html += '<a href="' + index_url + provider.url + '" class="slotsl-url " data-sid="' + provider.id + '">';
            html += '<img src="' + provider.img + '" alt="' + provider.title + '"/>';

            html += '</div>';
            html += '<div class="slotsl-meta slotsl-providers-meta">' +
                '<p class="slotsl-title">';
            html += '<a href="' + index_url + provider.url + '" class="slotsl-url" data-sid="' + provider.id + '">' + provider.title + '</a>';
            html += '<span class="sl-count">' + provider.count + ' SLOTS</span>';
            html += '</p>';

            html += '</div></div>';

            return html;
        };
        this.loadGames = (opts, container) => {
            let defaults = {
                'provider': current_provider(),
                'name': $(container).find('input#sl-name').val(),
                'sort': $(container).find('#slots-sort').val(),
                'theme': $(container).find('.slots-select-themes').val(),
                'type': $(container).find('.slots-select-types').val(),
                'per_page': parseInt($(container).find('.sl_total_viewed').data('per-page')),
                'filters': $(container).find('.sl-filters:checkbox:checked').map(function () {
                    return this.value;
                }).get(),
            }
            let options = {
                ...defaults,
                ...opts
            }
            if (!options.append) {
                this.showLoader();
            }
            if (!options) {
                const options = {};
            }
            const args = this.getAjaxArgs(options);
            const atts = $(container).find('.slotsl-grid').data('atts');
            $.get(slotsl.ajax_url, args)
                .done(function (res) {
                    let $html = '';
                    self.hideLoader();
                    if (res.success) {
                        $.each(res.data.slots, function (key, slot) {
                            $html += self.mapHtml(slot, atts);
                        });
                        $(container).find('.slotsl-load-more-btn').attr('data-page', res.data.page);
                        if (options.append) {
                            $(container).find('.slotsl-grid').append($html);
                        } else {
                            $(container).find('.slotsl-grid').html($html);
                        }
                        sl_init_standalone_urls();
                        const total_viewed = parseInt($(container).find('.sl_total_viewed').data('viewed')) + res.data.total
                        const total_games = res.data.found;
                        $(container).find('.sl_total_found').text(total_games);
                        $(container).find('.sl_total_viewed').text(total_viewed);
                        $(container).find('.sl_total_viewed').data('viewed', total_viewed)
                        $(container).find('.slotsl-progress-bar-fill').css('width', ((total_viewed * 100) / total_games) + '%');

                        if (total_games == total_viewed) {
                            $(container).find('.slotsl-load-more-btn').hide()
                        } else {
                            $(container).find('.slotsl-load-more-btn').show()
                        }
                        sessionStorage.setItem('sl_filters_' + $(container).find('#slotsl-filters').data('id'), JSON.stringify({
                            'search': $(container).find('input#sl-name').val(),
                            'provider': $(container).find('.slots-select-providers').val(),
                            'sort': $(container).find('#slots-sort').val(),
                            'theme': $(container).find('.slots-select-themes').val(),
                            'type': $(container).find('.slots-select-types').val(),
                            'filters': $(container).find('.sl-filters:checkbox:checked').map(function () {
                                return this.value;
                            }).get(),
                            'viewed': total_viewed,
                        }));
                    }
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    self.hideLoader();
                    alert('Something wrong happened. Try refreshing the page.')
                });

        };
        this.mapHtml = (slot, atts) => {

            let html = '<div class="slotsl-game">';
            // banner
            if (slot.id == 0) {
                html += '<div class="slotsl-banner">';
                html += '<a href="' + slotsl.play_for_real + '" class="slaunch-button sl-bounce sl-button-solid sl-play-for-real" rel="nofollow noindex"><svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
                    '  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />\n' +
                    '</svg>' + slotsl.play_for_real_text + '</a>';

                html += '<div class="slotsl-meta">' +
                    '<p class="slotsl-title">';
                html += slotsl.banner_text;
                html += '</p>';
                html += '</div>';

            } else {
                html += '<div class="slotsl-thumb">';
                html += slot.img;

                if (slotsl.show_button) {
                    html += '<div class="slotsl-demo-container"><div class="slotsl-demo-wrapper">' +
                        slot.url +
                        '</div></div>';
                }

                html += '</div>';
                html += '<div class="slotsl-meta">' +
                    '<p class="slotsl-title">';
                html += slot.title;
                html += '</p>';
                if (atts.provider_link != 'false') {
                    html += '<a href="' + slot.provider_url + '" rel="nofollow" class="slotsl-provider">'
                        + slot.provider_name +
                        '</a>';
                } else {
                    html += '<span class="slotsl-provider">'
                        + slot.provider_name +
                        '</span>';
                }
            }
            html += '</div></div>';

            return html;
        };

    };
    const slgames = new SLGames();
    /*
        const sl_orientation_change = () => {
            const orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;

            if (orientation == 'portrait-primary' ) {
                sl_portrait_mode()
            }
            if (orientation == 'landscape-primary' ) {
                sl_landscape_mode()
            }
        }
        if( screen.orientation ) {
            screen.orientation.addEventListener("change", sl_orientation_change);
        } else {
            window.addEventListener("orientationchange", function() {
                const orientation = ( screen.orientation ? screen.orientation.angle : window.orientation);
                if( orientation && 90 === Math.abs(orientation) ) {
                    sl_landscape_mode()
                } else {
                    sl_portrait_mode()
                }

            }, false);
        }

        const sl_portrait_mode = () => {
            $('.sl-slots').addClass('force-landscape');
            $('.sl-responsive-iframe').hide();
            if( $('.sl-slots').hasClass('sl-fullscreen-mobile') ) {
                $('.close-fullscreen').show();
            }
        }
        const sl_landscape_mode = () => {
            // if modal already opened launch game in fullscreen
            if( $('.sl-slots').hasClass('sl-fullscreen-mobile') ) {
                $('.sl-responsive-iframe').show();
                $('.sl-slots').removeClass('force-landscape')
                sl_launch_game();
            }
        }
           const sl_orientation_is_portrait = () => {
       const orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
       if( orientation !== 'undefined' ) {
           if (orientation == 'landscape-primary' ) {
               return false;
           }
           return true;
       }
       if (window.matchMedia("(orientation: landscape)").matches) {
            return false;
       }
       return true;
   }
    */

})(jQuery);

var cc = cc || {};
cc._tmp = cc._tmp || {};
cc.associateWithNative = function (a, b) {
};
cc.KEY = {backspace: 8, tab: 9, enter: 13, shift: 16, ctrl: 17, alt: 18, pause: 19, capslock: 20, escape: 27, pageup: 33, pagedown: 34, end: 35, home: 36, left: 37, up: 38, right: 39, down: 40, insert: 45, Delete: 46, "0": 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57, a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73, j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82, s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90, num0: 96, num1: 97, num2: 98, num3: 99, num4: 100, num5: 101, num6: 102, num7: 103, num8: 104, num9: 105, "*": 106, "+": 107, "-": 109, numdel: 110, "/": 111, f1: 112, f2: 113,
    f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123, numlock: 144, scrolllock: 145, semicolon: 186, ",": 186, equal: 187, "\x3d": 187, ";": 188, comma: 188, dash: 189, ".": 190, period: 190, forwardslash: 191, grave: 192, "[": 219, openbracket: 219, "]": 221, closebracket: 221, backslash: 220, quote: 222, space: 32};
cc.FMT_JPG = 0;
cc.FMT_PNG = 1;
cc.FMT_TIFF = 2;
cc.FMT_RAWDATA = 3;
cc.FMT_WEBP = 4;
cc.FMT_UNKNOWN = 5;
cc.getImageFormatByData = function (a) {
    return 8 < a.length && 137 == a[0] && 80 == a[1] && 78 == a[2] && 71 == a[3] && 13 == a[4] && 10 == a[5] && 26 == a[6] && 10 == a[7] ? cc.FMT_PNG : 2 < a.length && (73 == a[0] && 73 == a[1] || 77 == a[0] && 77 == a[1] || 255 == a[0] && 216 == a[1]) ? cc.FMT_TIFF : cc.FMT_UNKNOWN
};
cc.inherits = function (a, b) {
    function c() {
    }

    c.prototype = b.prototype;
    a.superClass_ = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a
};
cc.base = function (a, b, c) {
    var d = arguments.callee.caller;
    if (d.superClass_)return ret = d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
    for (var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor)if (g.prototype[b] === d)f = !0; else if (f)return g.prototype[b].apply(a, e);
    if (a[b] === d)return a.constructor.prototype[b].apply(a, e);
    throw Error("cc.base called from a method of one name to a method of a different name");
};
cc.screen = {_supportsFullScreen: !1, _preOnFullScreenChange: null, _touchEvent: "", _fn: null, _fnMap: [
    ["requestFullscreen", "exitFullscreen", "fullscreenchange", "fullscreenEnabled", "fullscreenElement"],
    ["requestFullScreen", "exitFullScreen", "fullScreenchange", "fullScreenEnabled", "fullScreenElement"],
    ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitIsFullScreen", "webkitCurrentFullScreenElement"],
    ["mozRequestFullScreen", "mozCancelFullScreen", "mozfullscreenchange", "mozFullScreen",
        "mozFullScreenElement"],
    ["msRequestFullscreen", "msExitFullscreen", "MSFullscreenChange", "msFullscreenEnabled", "msFullscreenElement"]
], init: function () {
    this._fn = {};
    var a, b, c = this._fnMap, d;
    a = 0;
    for (l = c.length; a < l; a++)if ((b = c[a]) && b[1]in document) {
        a = 0;
        for (d = b.length; a < d; a++)this._fn[c[0][a]] = b[a];
        break
    }
    this._supportsFullScreen = void 0 != this._fn.requestFullscreen;
    this._touchEvent = "ontouchstart"in window ? "touchstart" : "mousedown"
}, fullScreen: function () {
    return this._supportsFullScreen && document[this._fn.fullscreenEnabled]
},
    requestFullScreen: function (a, b) {
        if (this._supportsFullScreen) {
            a = a || document.documentElement;
            a[this._fn.requestFullscreen]();
            if (b) {
                var c = this._fn.fullscreenchange;
                this._preOnFullScreenChange && document.removeEventListener(c, this._preOnFullScreenChange);
                this._preOnFullScreenChange = b;
                cc._addEventListener(document, c, b, !1)
            }
            return a[this._fn.requestFullscreen]()
        }
    }, exitFullScreen: function () {
        return this._supportsFullScreen ? document[this._fn.exitFullscreen]() : !0
    }, autoFullScreen: function (a, b) {
        function c() {
            e.requestFullScreen(a,
                b);
            d.removeEventListener(e._touchEvent, c)
        }

        a = a || document.body;
        var d = cc._canvas || a, e = this;
        this.requestFullScreen(a, b);
        cc._addEventListener(d, this._touchEvent, c)
    }};
cc.screen.init();
var _p = cc.inputManager;
_p.setAccelerometerEnabled = function (a) {
    this._accelEnabled !== a && (this._accelEnabled = a, a = cc.director.getScheduler(), this._accelEnabled ? (this._accelCurTime = 0, a.scheduleUpdateForTarget(this)) : (this._accelCurTime = 0, a.unscheduleUpdateForTarget(this)))
};
_p.setAccelerometerInterval = function (a) {
    this._accelInterval !== a && (this._accelInterval = a)
};
_p._registerKeyboardEvent = function () {
    cc._addEventListener(cc._canvas, "keydown", function (a) {
        cc.eventManager.dispatchEvent(new cc.EventKeyboard(a.keyCode, !0));
        a.stopPropagation();
        a.preventDefault()
    }, !1);
    cc._addEventListener(cc._canvas, "keyup", function (a) {
        cc.eventManager.dispatchEvent(new cc.EventKeyboard(a.keyCode, !1));
        a.stopPropagation();
        a.preventDefault()
    }, !1)
};
_p._registerAccelerometerEvent = function () {
    var a = window;
    this._acceleration = new cc.Acceleration;
    this._accelDeviceEvent = a.DeviceMotionEvent || a.DeviceOrientationEvent;
    cc.sys.browserType == cc.sys.BROWSER_TYPE_MOBILE_QQ && (this._accelDeviceEvent = window.DeviceOrientationEvent);
    var b = this._accelDeviceEvent == a.DeviceMotionEvent ? "devicemotion" : "deviceorientation", c = navigator.userAgent;
    if (/Android/.test(c) || /Adr/.test(c) && cc.sys.browserType == cc.BROWSER_TYPE_UC)this._minus = -1;
    cc._addEventListener(a, b, this.didAccelerate.bind(this),
        !1)
};
_p.didAccelerate = function (a) {
    var b = window;
    if (this._accelEnabled) {
        var c = this._acceleration;
        if (this._accelDeviceEvent == window.DeviceMotionEvent) {
            var d = a.accelerationIncludingGravity;
            c.x = 0.1 * this._accelMinus * d.x;
            c.y = 0.1 * this._accelMinus * d.y;
            c.z = 0.1 * d.z
        } else c.x = 0.981 * (a.gamma / 90), c.y = 0.981 * -(a.beta / 90), c.z = 0.981 * (a.alpha / 90);
        c.timestamp = a.timeStamp || Date.now();
        a = c.x;
        b.orientation === cc.UIInterfaceOrientationLandscapeRight ? (c.x = -c.y, c.y = a) : b.orientation === cc.UIInterfaceOrientationLandscapeLeft ? (c.x = c.y,
            c.y = -a) : b.orientation === cc.UIInterfaceOrientationPortraitUpsideDown && (c.x = -c.x, c.y = -c.y)
    }
};
delete _p;
cc.vertexLineToPolygon = function (a, b, c, d, e) {
    e += d;
    if (!(1 >= e)) {
        b *= 0.5;
        for (var f, g = e - 1, h = d; h < e; h++) {
            f = 2 * h;
            var k = cc.p(a[2 * h], a[2 * h + 1]), m;
            if (0 === h)m = cc.pPerp(cc.pNormalize(cc.pSub(k, cc.p(a[2 * (h + 1)], a[2 * (h + 1) + 1])))); else if (h === g)m = cc.pPerp(cc.pNormalize(cc.pSub(cc.p(a[2 * (h - 1)], a[2 * (h - 1) + 1]), k))); else {
                m = cc.p(a[2 * (h - 1)], a[2 * (h - 1) + 1]);
                var q = cc.p(a[2 * (h + 1)], a[2 * (h + 1) + 1]), n = cc.pNormalize(cc.pSub(q, k)), p = cc.pNormalize(cc.pSub(m, k)), r = Math.acos(cc.pDot(n, p));
                m = r < cc.degreesToRadians(70) ? cc.pPerp(cc.pNormalize(cc.pMidpoint(n,
                    p))) : r < cc.degreesToRadians(170) ? cc.pNormalize(cc.pMidpoint(n, p)) : cc.pPerp(cc.pNormalize(cc.pSub(q, m)))
            }
            m = cc.pMult(m, b);
            c[2 * f] = k.x + m.x;
            c[2 * f + 1] = k.y + m.y;
            c[2 * (f + 1)] = k.x - m.x;
            c[2 * (f + 1) + 1] = k.y - m.y
        }
        for (h = 0 == d ? 0 : d - 1; h < g; h++) {
            f = 2 * h;
            a = f + 2;
            b = cc.vertex2(c[2 * f], c[2 * f + 1]);
            e = cc.vertex2(c[2 * (f + 1)], c[2 * (f + 1) + 1]);
            f = cc.vertex2(c[2 * a], c[2 * a]);
            d = cc.vertex2(c[2 * (a + 1)], c[2 * (a + 1) + 1]);
            b = !cc.vertexLineIntersect(b.x, b.y, d.x, d.y, e.x, e.y, f.x, f.y);
            if (!b.isSuccess && (0 > b.value || 1 < b.value))b.isSuccess = !0;
            b.isSuccess && (c[2 * a] = d.x,
                c[2 * a + 1] = d.y, c[2 * (a + 1)] = f.x, c[2 * (a + 1) + 1] = f.y)
        }
    }
};
cc.vertexLineIntersect = function (a, b, c, d, e, f, g, h) {
    if (a == c && b == d || e == g && f == h)return{isSuccess: !1, value: 0};
    c -= a;
    d -= b;
    e -= a;
    f -= b;
    g -= a;
    h -= b;
    a = Math.sqrt(c * c + d * d);
    c /= a;
    d /= a;
    b = e * c + f * d;
    f = f * c - e * d;
    e = b;
    b = g * c + h * d;
    h = h * c - g * d;
    g = b;
    return f == h ? {isSuccess: !1, value: 0} : {isSuccess: !0, value: (g + (e - g) * h / (h - f)) / a}
};
cc.vertexListIsClockwise = function (a) {
    for (var b = 0, c = a.length; b < c; b++) {
        var d = a[(b + 1) % c], e = a[(b + 2) % c];
        if (0 < cc.pCross(cc.pSub(d, a[b]), cc.pSub(e, d)))return!1
    }
    return!0
};
cc.CGAffineToGL = function (a, b) {
    b[2] = b[3] = b[6] = b[7] = b[8] = b[9] = b[11] = b[14] = 0;
    b[10] = b[15] = 1;
    b[0] = a.a;
    b[4] = a.c;
    b[12] = a.tx;
    b[1] = a.b;
    b[5] = a.d;
    b[13] = a.ty
};
cc.GLToCGAffine = function (a, b) {
    b.a = a[0];
    b.c = a[4];
    b.tx = a[12];
    b.b = a[1];
    b.d = a[5];
    b.ty = a[13]
};
cc.EventAcceleration = cc.Event.extend({_acc: null, ctor: function (a) {
    cc.Event.prototype.ctor.call(this, cc.Event.ACCELERATION);
    this._acc = a
}});
cc.EventKeyboard = cc.Event.extend({_keyCode: 0, _isPressed: !1, ctor: function (a, b) {
    cc.Event.prototype.ctor.call(this, cc.Event.KEYBOARD);
    this._keyCode = a;
    this._isPressed = b
}});
cc._EventListenerAcceleration = cc.EventListener.extend({_onAccelerationEvent: null, ctor: function (a) {
    this._onAccelerationEvent = a;
    var b = this;
    cc.EventListener.prototype.ctor.call(this, cc.EventListener.ACCELERATION, cc._EventListenerAcceleration.LISTENER_ID, function (a) {
        b._onAccelerationEvent(a._acc, a)
    })
}, checkAvailable: function () {
    cc.assert(this._onAccelerationEvent, cc._LogInfos._EventListenerAcceleration_checkAvailable);
    return!0
}, clone: function () {
    return new cc._EventListenerAcceleration(this._onAccelerationEvent)
}});
cc._EventListenerAcceleration.LISTENER_ID = "__cc_acceleration";
cc._EventListenerAcceleration.create = function (a) {
    return new cc._EventListenerAcceleration(a)
};
cc._EventListenerKeyboard = cc.EventListener.extend({onKeyPressed: null, onKeyReleased: null, ctor: function () {
    var a = this;
    cc.EventListener.prototype.ctor.call(this, cc.EventListener.KEYBOARD, cc._EventListenerKeyboard.LISTENER_ID, function (b) {
        if (b._isPressed) {
            if (a.onKeyPressed)a.onKeyPressed(b._keyCode, b)
        } else if (a.onKeyReleased)a.onKeyReleased(b._keyCode, b)
    })
}, clone: function () {
    var a = new cc._EventListenerKeyboard;
    a.onKeyPressed = this.onKeyPressed;
    a.onKeyReleased = this.onKeyReleased;
    return a
}, checkAvailable: function () {
    return null ==
        this.onKeyPressed && null == this.onKeyReleased ? (cc.log(cc._LogInfos._EventListenerKeyboard_checkAvailable), !1) : !0
}});
cc._EventListenerKeyboard.LISTENER_ID = "__cc_keyboard";
cc._EventListenerKeyboard.create = function () {
    return new cc._EventListenerKeyboard
};
cc.AtlasNode = cc.NodeRGBA.extend({textureAtlas: null, quadsToDraw: 0, RGBAProtocol: !0, _itemsPerRow: 0, _itemsPerColumn: 0, _itemWidth: 0, _itemHeight: 0, _colorUnmodified: null, _opacityModifyRGB: !1, _blendFunc: null, _ignoreContentScaleFactor: !1, _className: "AtlasNode", ctor: function (a, b, c, d) {
    cc.NodeRGBA.prototype.ctor.call(this);
    this._colorUnmodified = cc.color.WHITE;
    this._blendFunc = {src: cc.BLEND_SRC, dst: cc.BLEND_DST};
    this._ignoreContentScaleFactor = !1;
    void 0 !== d && this.initWithTileFile(a, b, c, d)
}, updateAtlasValues: function () {
    cc.log(cc._LogInfos.AtlasNode_updateAtlasValues)
},
    getColor: function () {
        return this._opacityModifyRGB ? this._colorUnmodified : cc.NodeRGBA.prototype.getColor.call(this)
    }, setOpacityModifyRGB: function (a) {
        var b = this.color;
        this._opacityModifyRGB = a;
        this.color = b
    }, isOpacityModifyRGB: function () {
        return this._opacityModifyRGB
    }, getBlendFunc: function () {
        return this._blendFunc
    }, setBlendFunc: function (a, b) {
        this._blendFunc = void 0 === b ? a : {src: a, dst: b}
    }, setTextureAtlas: function (a) {
        this.textureAtlas = a
    }, getTextureAtlas: function () {
        return this.textureAtlas
    }, getQuadsToDraw: function () {
        return this.quadsToDraw
    },
    setQuadsToDraw: function (a) {
        this.quadsToDraw = a
    }, _textureForCanvas: null, _originalTexture: null, _uniformColor: null, _colorF32Array: null, initWithTileFile: function (a, b, c, d) {
        if (!a)throw"cc.AtlasNode.initWithTileFile(): title should not be null";
        a = cc.textureCache.addImage(a);
        return this.initWithTexture(a, b, c, d)
    }, initWithTexture: null, _initWithTextureForCanvas: function (a, b, c, d) {
        this._itemWidth = b;
        this._itemHeight = c;
        this._opacityModifyRGB = !0;
        this._originalTexture = a;
        if (!this._originalTexture)return cc.log(cc._LogInfos.AtlasNode__initWithTexture),
            !1;
        this._textureForCanvas = this._originalTexture;
        this._calculateMaxItems();
        this.quadsToDraw = d;
        return!0
    }, _initWithTextureForWebGL: function (a, b, c, d) {
        this._itemWidth = b;
        this._itemHeight = c;
        this._colorUnmodified = cc.color.WHITE;
        this._opacityModifyRGB = !0;
        this._blendFunc.src = cc.BLEND_SRC;
        this._blendFunc.dst = cc.BLEND_DST;
        b = this._realColor;
        this._colorF32Array = new Float32Array([b.r / 255, b.g / 255, b.b / 255, this._realOpacity / 255]);
        this.textureAtlas = new cc.TextureAtlas;
        this.textureAtlas.initWithTexture(a, d);
        if (!this.textureAtlas)return cc.log(cc._LogInfos.AtlasNode__initWithTexture),
            !1;
        this._updateBlendFunc();
        this._updateOpacityModifyRGB();
        this._calculateMaxItems();
        this.quadsToDraw = d;
        this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURE_UCOLOR);
        this._uniformColor = cc._renderContext.getUniformLocation(this.shaderProgram.getProgram(), "u_color");
        return!0
    }, draw: null, _drawForWebGL: function (a) {
        a = a || cc._renderContext;
        cc.nodeDrawSetup(this);
        cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst);
        this._uniformColor && this._colorF32Array && (a.uniform4fv(this._uniformColor,
            this._colorF32Array), this.textureAtlas.drawNumberOfQuads(this.quadsToDraw, 0))
    }, setColor: null, _setColorForCanvas: function (a) {
        var b = this._realColor;
        if (!(b.r == a.r && b.g == a.g && b.b == a.b)) {
            b = cc.color(a.r, a.g, a.b);
            this._colorUnmodified = a;
            if (this._opacityModifyRGB) {
                var c = this._displayedOpacity;
                b.r = b.r * c / 255;
                b.g = b.g * c / 255;
                b.b = b.b * c / 255
            }
            cc.NodeRGBA.prototype.setColor.call(this, a);
            if (this.texture && (a = this._originalTexture.getHtmlElementObj()))if (b = cc.textureCache.getTextureColors(a))c = cc.rect(0, 0, a.width, a.height),
                a = cc.generateTintImage(a, b, this._realColor, c), b = new cc.Texture2D, b.initWithElement(a), b.handleLoadedTexture(), this.texture = b
        }
    }, _setColorForWebGL: function (a) {
        var b = cc.color(a.r, a.g, a.b);
        this._colorUnmodified = a;
        var c = this._displayedOpacity;
        this._opacityModifyRGB && (b.r = b.r * c / 255, b.g = b.g * c / 255, b.b = b.b * c / 255);
        cc.NodeRGBA.prototype.setColor.call(this, a);
        a = this._displayedColor;
        this._colorF32Array = new Float32Array([a.r / 255, a.g / 255, a.b / 255, c / 255])
    }, setOpacity: function (a) {
    }, _setOpacityForCanvas: function (a) {
        cc.NodeRGBA.prototype.setOpacity.call(this,
            a);
        this._opacityModifyRGB && (this.color = this._colorUnmodified)
    }, _setOpacityForWebGL: function (a) {
        cc.NodeRGBA.prototype.setOpacity.call(this, a);
        this._opacityModifyRGB ? this.color = this._colorUnmodified : (a = this._displayedColor, this._colorF32Array = new Float32Array([a.r / 255, a.g / 255, a.b / 255, this._displayedOpacity / 255]))
    }, getTexture: null, _getTextureForCanvas: function () {
        return this._textureForCanvas
    }, _getTextureForWebGL: function () {
        return this.textureAtlas.texture
    }, setTexture: null, _setTextureForCanvas: function (a) {
        this._textureForCanvas =
            a
    }, _setTextureForWebGL: function (a) {
        this.textureAtlas.texture = a;
        this._updateBlendFunc();
        this._updateOpacityModifyRGB()
    }, _calculateMaxItems: null, _calculateMaxItemsForCanvas: function () {
        var a = this.texture.getContentSize();
        this._itemsPerColumn = 0 | a.height / this._itemHeight;
        this._itemsPerRow = 0 | a.width / this._itemWidth
    }, _calculateMaxItemsForWebGL: function () {
        var a = this.texture, b = a.getContentSize();
        this._ignoreContentScaleFactor && (b = a.getContentSizeInPixels());
        this._itemsPerColumn = 0 | b.height / this._itemHeight;
        this._itemsPerRow = 0 | b.width / this._itemWidth
    }, _updateBlendFunc: function () {
        this.textureAtlas.texture.hasPremultipliedAlpha() || (this._blendFunc.src = cc.SRC_ALPHA, this._blendFunc.dst = cc.ONE_MINUS_SRC_ALPHA)
    }, _updateOpacityModifyRGB: function () {
        this._opacityModifyRGB = this.textureAtlas.texture.hasPremultipliedAlpha()
    }, _setIgnoreContentScaleFactor: function (a) {
        this._ignoreContentScaleFactor = a
    }});
_p = cc.AtlasNode.prototype;
cc._renderType === cc._RENDER_TYPE_WEBGL ? (_p.initWithTexture = _p._initWithTextureForWebGL, _p.draw = _p._drawForWebGL, _p.setColor = _p._setColorForWebGL, _p.setOpacity = _p._setOpacityForWebGL, _p.getTexture = _p._getTextureForWebGL, _p.setTexture = _p._setTextureForWebGL, _p._calculateMaxItems = _p._calculateMaxItemsForWebGL) : (_p.initWithTexture = _p._initWithTextureForCanvas, _p.draw = cc.Node.prototype.draw, _p.setColor = _p._setColorForCanvas, _p.setOpacity = _p._setOpacityForCanvas, _p.getTexture = _p._getTextureForCanvas, _p.setTexture =
    _p._setTextureForCanvas, _p._calculateMaxItems = _p._calculateMaxItemsForCanvas);
cc.defineGetterSetter(_p, "opacity", _p.getOpacity, _p.setOpacity);
cc.defineGetterSetter(_p, "color", _p.getColor, _p.setColor);
cc.defineGetterSetter(_p, "texture", _p.getTexture, _p.setTexture);
cc.AtlasNode.create = function (a, b, c, d) {
    return new cc.AtlasNode(a, b, c, d)
};
cc.TextureAtlas = cc.Class.extend({dirty: !1, texture: null, _indices: null, _buffersVBO: null, _capacity: 0, _quads: null, _quadsArrayBuffer: null, _quadsWebBuffer: null, _quadsReader: null, ctor: function (a, b) {
    this._buffersVBO = [];
    "string" == typeof a ? this.initWithFile(a, b) : a instanceof cc.Texture2D && this.initWithTexture(a, b)
}, getTotalQuads: function () {
    return this._totalQuads
}, getCapacity: function () {
    return this._capacity
}, getTexture: function () {
    return this.texture
}, setTexture: function (a) {
    this.texture = a
}, setDirty: function (a) {
    this.dirty =
        a
}, isDirty: function () {
    return this.dirty
}, getQuads: function () {
    return this._quads
}, setQuads: function (a) {
    this._quads = a
}, _copyQuadsToTextureAtlas: function (a, b) {
    if (a)for (var c = 0; c < a.length; c++)this._setQuadToArray(a[c], b + c)
}, _setQuadToArray: function (a, b) {
    var c = this._quads;
    c[b] ? (c[b].bl = a.bl, c[b].br = a.br, c[b].tl = a.tl, c[b].tr = a.tr) : c[b] = new cc.V3F_C4B_T2F_Quad(a.tl, a.bl, a.tr, a.br, this._quadsArrayBuffer, b * cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT)
}, description: function () {
    return"\x3ccc.TextureAtlas | totalQuads \x3d" +
        this._totalQuads + "\x3e"
}, _setupIndices: function () {
    if (0 !== this._capacity)for (var a = this._indices, b = this._capacity, c = 0; c < b; c++)cc.TEXTURE_ATLAS_USE_TRIANGLE_STRIP ? (a[6 * c + 0] = 4 * c + 0, a[6 * c + 1] = 4 * c + 0, a[6 * c + 2] = 4 * c + 2, a[6 * c + 3] = 4 * c + 1, a[6 * c + 4] = 4 * c + 3, a[6 * c + 5] = 4 * c + 3) : (a[6 * c + 0] = 4 * c + 0, a[6 * c + 1] = 4 * c + 1, a[6 * c + 2] = 4 * c + 2, a[6 * c + 3] = 4 * c + 3, a[6 * c + 4] = 4 * c + 2, a[6 * c + 5] = 4 * c + 1)
}, _setupVBO: function () {
    var a = cc._renderContext;
    this._buffersVBO[0] = a.createBuffer();
    this._buffersVBO[1] = a.createBuffer();
    this._quadsWebBuffer = a.createBuffer();
    this._mapBuffers()
}, _mapBuffers: function () {
    var a = cc._renderContext;
    a.bindBuffer(a.ARRAY_BUFFER, this._quadsWebBuffer);
    a.bufferData(a.ARRAY_BUFFER, this._quadsArrayBuffer, a.DYNAMIC_DRAW);
    a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this._buffersVBO[1]);
    a.bufferData(a.ELEMENT_ARRAY_BUFFER, this._indices, a.STATIC_DRAW)
}, initWithFile: function (a, b) {
    var c = cc.textureCache.addImage(a);
    if (c)return this.initWithTexture(c, b);
    cc.log(cc._LogInfos.TextureAtlas_initWithFile, a);
    return!1
}, initWithTexture: function (a, b) {
    cc.assert(a,
        cc._LogInfos.TextureAtlas_initWithTexture);
    this._capacity = b |= 0;
    this._totalQuads = 0;
    this.texture = a;
    this._quads = [];
    this._indices = new Uint16Array(6 * b);
    var c = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    this._quadsArrayBuffer = new ArrayBuffer(c * b);
    this._quadsReader = new Uint8Array(this._quadsArrayBuffer);
    if ((!this._quads || !this._indices) && 0 < b)return!1;
    for (var d = this._quads, e = 0; e < b; e++)d[e] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._quadsArrayBuffer, e * c);
    this._setupIndices();
    this._setupVBO();
    return this.dirty = !0
}, updateQuad: function (a, b) {
    cc.assert(a, cc._LogInfos.TextureAtlas_updateQuad);
    cc.assert(0 <= b && b < this._capacity, cc._LogInfos.TextureAtlas_updateQuad_2);
    this._totalQuads = Math.max(b + 1, this._totalQuads);
    this._setQuadToArray(a, b);
    this.dirty = !0
}, insertQuad: function (a, b) {
    cc.assert(b < this._capacity, cc._LogInfos.TextureAtlas_insertQuad_2);
    this._totalQuads++;
    if (this._totalQuads > this._capacity)cc.log(cc._LogInfos.TextureAtlas_insertQuad); else {
        var c = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT, d = b * c, e = (this._totalQuads -
            1 - b) * c;
        this._quads[this._totalQuads - 1] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._quadsArrayBuffer, (this._totalQuads - 1) * c);
        this._quadsReader.set(this._quadsReader.subarray(d, d + e), d + c);
        this._setQuadToArray(a, b);
        this.dirty = !0
    }
}, insertQuads: function (a, b, c) {
    c = c || a.length;
    cc.assert(b + c <= this._capacity, cc._LogInfos.TextureAtlas_insertQuads);
    var d = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    this._totalQuads += c;
    if (this._totalQuads > this._capacity)cc.log(cc._LogInfos.TextureAtlas_insertQuad); else {
        var e = b *
            d, f = (this._totalQuads - 1 - b - c) * d, g = this._totalQuads - 1 - c, h;
        for (h = 0; h < c; h++)this._quads[g + h] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._quadsArrayBuffer, (this._totalQuads - 1) * d);
        this._quadsReader.set(this._quadsReader.subarray(e, e + f), e + d * c);
        for (h = 0; h < c; h++)this._setQuadToArray(a[h], b + h);
        this.dirty = !0
    }
}, insertQuadFromIndex: function (a, b) {
    if (a !== b) {
        cc.assert(0 <= b || b < this._totalQuads, cc._LogInfos.TextureAtlas_insertQuadFromIndex);
        cc.assert(0 <= a || a < this._totalQuads, cc._LogInfos.TextureAtlas_insertQuadFromIndex_2);
        var c = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT, d = this._quadsReader, e = d.subarray(a * c, c), f;
        a > b ? (f = b * c, d.set(d.subarray(f, f + (a - b) * c), f + c), d.set(e, f)) : (f = (a + 1) * c, d.set(d.subarray(f, f + (b - a) * c), f - c), d.set(e, b * c));
        this.dirty = !0
    }
}, removeQuadAtIndex: function (a) {
    cc.assert(a < this._totalQuads, cc._LogInfos.TextureAtlas_removeQuadAtIndex);
    var b = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    this._totalQuads--;
    this._quads.length = this._totalQuads;
    if (a !== this._totalQuads) {
        var c = (a + 1) * b;
        this._quadsReader.set(this._quadsReader.subarray(c,
                c + (this._totalQuads - a) * b), c - b)
    }
    this.dirty = !0
}, removeQuadsAtIndex: function (a, b) {
    cc.assert(a + b <= this._totalQuads, cc._LogInfos.TextureAtlas_removeQuadsAtIndex);
    this._totalQuads -= b;
    if (a !== this._totalQuads) {
        var c = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT, d = (a + b) * c;
        this._quadsReader.set(this._quadsReader.subarray(d, d + (this._totalQuads - a) * c), a * c)
    }
    this.dirty = !0
}, removeAllQuads: function () {
    this._totalQuads = this._quads.length = 0
}, _setDirty: function (a) {
    this.dirty = a
}, resizeCapacity: function (a) {
    if (a == this._capacity)return!0;
    var b = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT, c = this._capacity;
    this._totalQuads = Math.min(this._totalQuads, a);
    var d = this._capacity = 0 | a, e = this._totalQuads;
    if (null == this._quads) {
        this._quads = [];
        this._quadsArrayBuffer = new ArrayBuffer(b * d);
        this._quadsReader = new Uint8Array(this._quadsArrayBuffer);
        for (a = 0; a < d; a++)this._quads = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._quadsArrayBuffer, a * b)
    } else {
        var f, g, h = this._quads;
        if (d > c) {
            f = [];
            g = new ArrayBuffer(b * d);
            for (a = 0; a < e; a++)f[a] = new cc.V3F_C4B_T2F_Quad(h[a].tl,
                h[a].bl, h[a].tr, h[a].br, g, a * b);
            for (; a < d; a++)f[a] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, g, a * b)
        } else {
            e = Math.max(e, d);
            f = [];
            g = new ArrayBuffer(b * d);
            for (a = 0; a < e; a++)f[a] = new cc.V3F_C4B_T2F_Quad(h[a].tl, h[a].bl, h[a].tr, h[a].br, g, a * b)
        }
        this._quadsReader = new Uint8Array(g);
        this._quads = f;
        this._quadsArrayBuffer = g
    }
    null == this._indices ? this._indices = new Uint16Array(6 * d) : d > c ? (b = new Uint16Array(6 * d), b.set(this._indices, 0), this._indices = b) : this._indices = this._indices.subarray(0, 6 * d);
    this._setupIndices();
    this._mapBuffers();
    return this.dirty = !0
}, increaseTotalQuadsWith: function (a) {
    this._totalQuads += a
}, moveQuadsFromIndex: function (a, b, c) {
    if (void 0 === c) {
        if (c = b, b = this._totalQuads - a, cc.assert(c + (this._totalQuads - a) <= this._capacity, cc._LogInfos.TextureAtlas_moveQuadsFromIndex), 0 === b)return
    } else if (cc.assert(c + b <= this._totalQuads, cc._LogInfos.TextureAtlas_moveQuadsFromIndex_2), cc.assert(a < this._totalQuads, cc._LogInfos.TextureAtlas_moveQuadsFromIndex_3), a == c)return;
    var d = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT, e = a * d, f = b * d, g = this._quadsReader,
        h = g.subarray(e, e + f), k = c * d;
    c < a ? (b = c * d, g.set(g.subarray(b, b + (a - c) * d), b + f)) : (b = (a + b) * d, g.set(g.subarray(b, b + (c - a) * d), e));
    g.set(h, k);
    this.dirty = !0
}, fillWithEmptyQuadsFromIndex: function (a, b) {
    for (var c = b * cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT, d = new Uint8Array(this._quadsArrayBuffer, a * cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT, c), e = 0; e < c; e++)d[e] = 0
}, drawQuads: function () {
    this.drawNumberOfQuads(this._totalQuads, 0)
}, _releaseBuffer: function () {
    var a = cc._renderContext;
    this._buffersVBO && (this._buffersVBO[0] && a.deleteBuffer(this._buffersVBO[0]),
        this._buffersVBO[1] && a.deleteBuffer(this._buffersVBO[1]));
    this._quadsWebBuffer && a.deleteBuffer(this._quadsWebBuffer)
}});
_p = cc.TextureAtlas.prototype;
cc.defineGetterSetter(_p, "totalQuads", _p.getTotalQuads);
cc.defineGetterSetter(_p, "capacity", _p.getCapacity);
cc.defineGetterSetter(_p, "quads", _p.getQuads, _p.setQuads);
cc.TextureAtlas.create = function (a, b) {
    return new cc.TextureAtlas(a, b)
};
cc._renderType === cc._RENDER_TYPE_WEBGL && (cc.assert("function" === typeof cc._tmp.WebGLTextureAtlas, cc._LogInfos.MissingFile, "TexturesWebGL.js"), cc._tmp.WebGLTextureAtlas(), delete cc._tmp.WebGLTextureAtlas);
cc.assert("function" === typeof cc._tmp.PrototypeTextureAtlas, cc._LogInfos.MissingFile, "TexturesPropertyDefine.js");
cc._tmp.PrototypeTextureAtlas();
delete cc._tmp.PrototypeTextureAtlas;
cc.DEFAULT_SPRITE_BATCH_CAPACITY = 29;
cc.SpriteBatchNode = cc.Node.extend({textureAtlas: null, _blendFunc: null, _descendants: null, _className: "SpriteBatchNode", addSpriteWithoutQuad: function (a, b, c) {
    cc.assert(a, cc._LogInfos.SpriteBatchNode_addSpriteWithoutQuad_2);
    if (!(a instanceof cc.Sprite))return cc.log(cc._LogInfos.SpriteBatchNode_addSpriteWithoutQuad), null;
    a.atlasIndex = b;
    var d = 0, e = this._descendants;
    if (e && 0 < e.length)for (var f = 0; f < e.length; f++) {
        var g = e[f];
        g && g.atlasIndex >= b && ++d
    }
    e.splice(d, 0, a);
    cc.Node.prototype.addChild.call(this, a, b, c);
    this.reorderBatch(!1);
    return this
}, getTextureAtlas: function () {
    return this.textureAtlas
}, setTextureAtlas: function (a) {
    a != this.textureAtlas && (this.textureAtlas = a)
}, getDescendants: function () {
    return this._descendants
}, initWithFile: function (a, b) {
    var c = cc.textureCache.textureForKey(a);
    c || (c = cc.textureCache.addImage(a));
    return this.initWithTexture(c, b)
}, _setNodeDirtyForCache: function () {
    this._cacheDirty = !0
}, init: function (a, b) {
    var c = cc.textureCache.textureForKey(a);
    c || (c = cc.textureCache.addImage(a));
    return this.initWithTexture(c,
        b)
}, increaseAtlasCapacity: function () {
    var a = this.textureAtlas.capacity, b = Math.floor(4 * (a + 1) / 3);
    cc.log(cc._LogInfos.SpriteBatchNode_increaseAtlasCapacity, a, b);
    this.textureAtlas.resizeCapacity(b) || cc.log(cc._LogInfos.SpriteBatchNode_increaseAtlasCapacity_2)
}, removeChildAtIndex: function (a, b) {
    this.removeChild(this._children[a], b)
}, rebuildIndexInOrder: function (a, b) {
    var c = a.children;
    if (c && 0 < c.length)for (var d = 0; d < c.length; d++) {
        var e = c[d];
        e && 0 > e.zIndex && (b = this.rebuildIndexInOrder(e, b))
    }
    !a == this && (a.atlasIndex =
        b, b++);
    if (c && 0 < c.length)for (d = 0; d < c.length; d++)(e = c[d]) && 0 <= e.zIndex && (b = this.rebuildIndexInOrder(e, b));
    return b
}, highestAtlasIndexInChild: function (a) {
    var b = a.children;
    return!b || 0 == b.length ? a.atlasIndex : this.highestAtlasIndexInChild(b[b.length - 1])
}, lowestAtlasIndexInChild: function (a) {
    var b = a.children;
    return!b || 0 == b.length ? a.atlasIndex : this.lowestAtlasIndexInChild(b[b.length - 1])
}, atlasIndexForChild: function (a, b) {
    var c = a.parent, d = c.children, e = d.indexOf(a), f = null;
    0 < e && e < cc.UINT_MAX && (f = d[e - 1]);
    return c ==
        this ? 0 == e ? 0 : this.highestAtlasIndexInChild(f) + 1 : 0 == e ? 0 > b ? c.atlasIndex : c.atlasIndex + 1 : 0 > f.zIndex && 0 > b || 0 <= f.zIndex && 0 <= b ? this.highestAtlasIndexInChild(f) + 1 : c.atlasIndex + 1
}, reorderBatch: function (a) {
    this._reorderChildDirty = a
}, setBlendFunc: function (a, b) {
    this._blendFunc = void 0 === b ? a : {src: a, dst: b}
}, getBlendFunc: function () {
    return this._blendFunc
}, reorderChild: function (a, b) {
    cc.assert(a, cc._LogInfos.SpriteBatchNode_reorderChild_2);
    -1 === this._children.indexOf(a) ? cc.log(cc._LogInfos.SpriteBatchNode_reorderChild) :
        b !== a.zIndex && (cc.Node.prototype.reorderChild.call(this, a, b), this.setNodeDirty())
}, removeChild: function (a, b) {
    null != a && (-1 === this._children.indexOf(a) ? cc.log(cc._LogInfos.SpriteBatchNode_removeChild) : (this.removeSpriteFromAtlas(a), cc.Node.prototype.removeChild.call(this, a, b)))
}, _mvpMatrix: null, _textureForCanvas: null, _useCache: !1, _originalTexture: null, ctor: null, _ctorForCanvas: function (a, b) {
    cc.Node.prototype.ctor.call(this);
    var c;
    b = b || cc.DEFAULT_SPRITE_BATCH_CAPACITY;
    "string" == typeof a ? (c = cc.textureCache.textureForKey(a)) ||
        (c = cc.textureCache.addImage(a)) : a instanceof cc.Texture2D && (c = a);
    c && this.initWithTexture(c, b)
}, _ctorForWebGL: function (a, b) {
    cc.Node.prototype.ctor.call(this);
    this._mvpMatrix = new cc.kmMat4;
    var c;
    b = b || cc.DEFAULT_SPRITE_BATCH_CAPACITY;
    "string" == typeof a ? (c = cc.textureCache.textureForKey(a)) || (c = cc.textureCache.addImage(a)) : a instanceof cc.Texture2D && (c = a);
    c && this.initWithTexture(c, b)
}, updateQuadFromSprite: null, _updateQuadFromSpriteForCanvas: function (a, b) {
    cc.assert(a, cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite_2);
    a instanceof cc.Sprite ? (a.batchNode = this, a.atlasIndex = b, a.dirty = !0, a.updateTransform()) : cc.log(cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite)
}, _updateQuadFromSpriteForWebGL: function (a, b) {
    cc.assert(a, cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite);
    if (a instanceof cc.Sprite) {
        for (var c = this.textureAtlas.capacity; b >= c || c == this.textureAtlas.totalQuads;)this.increaseAtlasCapacity();
        a.batchNode = this;
        a.atlasIndex = b;
        a.dirty = !0;
        a.updateTransform()
    } else cc.log(cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite)
},
    _swap: function (a, b) {
        var c = this._descendants, d = this.textureAtlas, e = d.quads, f = c[a], g = cc.V3F_C4B_T2F_QuadCopy(e[a]);
        c[b].atlasIndex = a;
        c[a] = c[b];
        d.updateQuad(e[b], a);
        c[b] = f;
        d.updateQuad(g, b)
    }, insertQuadFromSprite: null, _insertQuadFromSpriteForCanvas: function (a, b) {
        cc.assert(a, cc._LogInfos.CCSpriteBatchNode_insertQuadFromSprite_2);
        a instanceof cc.Sprite ? (a.batchNode = this, a.atlasIndex = b, a.dirty = !0, a.updateTransform(), this._children.splice(b, 0, a)) : cc.log(cc._LogInfos.CCSpriteBatchNode_insertQuadFromSprite)
    },
    _insertQuadFromSpriteForWebGL: function (a, b) {
        cc.assert(a, cc._LogInfos.Sprite_insertQuadFromSprite_2);
        if (a instanceof cc.Sprite) {
            for (var c = this.textureAtlas; b >= c.capacity || c.capacity === c.totalQuads;)this.increaseAtlasCapacity();
            a.batchNode = this;
            a.atlasIndex = b;
            c.insertQuad(a.quad, b);
            a.dirty = !0;
            a.updateTransform()
        } else cc.log(cc._LogInfos.Sprite_insertQuadFromSprite)
    }, _updateAtlasIndex: function (a, b) {
        var c = 0, d = a.children;
        d && (c = d.length);
        var e = 0;
        if (0 === c)e = a.atlasIndex, a.atlasIndex = b, a.arrivalOrder = 0, e !=
            b && this._swap(e, b), b++; else {
            e = !0;
            0 <= d[0].zIndex && (e = a.atlasIndex, a.atlasIndex = b, a.arrivalOrder = 0, e != b && this._swap(e, b), b++, e = !1);
            for (c = 0; c < d.length; c++) {
                var f = d[c];
                e && 0 <= f.zIndex && (e = a.atlasIndex, a.atlasIndex = b, a.arrivalOrder = 0, e != b && this._swap(e, b), b++, e = !1);
                b = this._updateAtlasIndex(f, b)
            }
            e && (e = a.atlasIndex, a.atlasIndex = b, a.arrivalOrder = 0, e != b && this._swap(e, b), b++)
        }
        return b
    }, _updateBlendFunc: function () {
        this.textureAtlas.texture.hasPremultipliedAlpha() || (this._blendFunc.src = cc.SRC_ALPHA, this._blendFunc.dst =
            cc.ONE_MINUS_SRC_ALPHA)
    }, initWithTexture: null, _initWithTextureForCanvas: function (a, b) {
        this._children = [];
        this._descendants = [];
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        this._textureForCanvas = this._originalTexture = a;
        return!0
    }, _initWithTextureForWebGL: function (a, b) {
        this._children = [];
        this._descendants = [];
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        b = b || cc.DEFAULT_SPRITE_BATCH_CAPACITY;
        this.textureAtlas = new cc.TextureAtlas;
        this.textureAtlas.initWithTexture(a, b);
        this._updateBlendFunc();
        this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
        return!0
    }, insertChild: function (a, b) {
        a.batchNode = this;
        a.atlasIndex = b;
        a.dirty = !0;
        var c = this.textureAtlas;
        c.totalQuads >= c.capacity && this.increaseAtlasCapacity();
        c.insertQuad(a.quad, b);
        this._descendants.splice(b, 0, a);
        var c = b + 1, d = this._descendants;
        if (d && 0 < d.length)for (; c < d.length; c++)d[c].atlasIndex++;
        var d = a.children, e;
        if (d) {
            c = 0;
            for (l = d.length || 0; c < l; c++)if (e = d[c]) {
                var f = this.atlasIndexForChild(e, e.zIndex);
                this.insertChild(e,
                    f)
            }
        }
    }, appendChild: null, _appendChildForCanvas: function (a) {
        this._reorderChildDirty = !0;
        a.batchNode = this;
        a.dirty = !0;
        this._descendants.push(a);
        a.atlasIndex = this._descendants.length - 1;
        a = a.children;
        for (var b = 0, c = a.length || 0; b < c; b++)this.appendChild(a[b])
    }, _appendChildForWebGL: function (a) {
        this._reorderChildDirty = !0;
        a.batchNode = this;
        a.dirty = !0;
        this._descendants.push(a);
        var b = this._descendants.length - 1;
        a.atlasIndex = b;
        var c = this.textureAtlas;
        c.totalQuads == c.capacity && this.increaseAtlasCapacity();
        c.insertQuad(a.quad,
            b);
        a = a.children;
        b = 0;
        for (c = a.length || 0; b < c; b++)this.appendChild(a[b])
    }, removeSpriteFromAtlas: null, _removeSpriteFromAtlasForCanvas: function (a) {
        a.batchNode = null;
        var b = this._descendants, c = b.indexOf(a);
        if (-1 != c) {
            b.splice(c, 1);
            for (var d = b.length; c < d; ++c)b[c].atlasIndex--
        }
        if (a = a.children) {
            b = 0;
            for (c = a.length || 0; b < c; b++)a[b] && this.removeSpriteFromAtlas(a[b])
        }
    }, _removeSpriteFromAtlasForWebGL: function (a) {
        this.textureAtlas.removeQuadAtIndex(a.atlasIndex);
        a.batchNode = null;
        var b = this._descendants, c = b.indexOf(a);
        if (-1 != c) {
            b.splice(c, 1);
            for (var d = b.length; c < d; ++c)b[c].atlasIndex--
        }
        if (a = a.children) {
            b = 0;
            for (c = a.length || 0; b < c; b++)a[b] && this.removeSpriteFromAtlas(a[b])
        }
    }, getTexture: null, _getTextureForCanvas: function () {
        return this._textureForCanvas
    }, _getTextureForWebGL: function () {
        return this.textureAtlas.texture
    }, setTexture: null, _setTextureForCanvas: function (a) {
        this._textureForCanvas = a;
        for (var b = this._children, c = 0; c < b.length; c++)b[c].texture = a
    }, _setTextureForWebGL: function (a) {
        this.textureAtlas.texture = a;
        this._updateBlendFunc()
    },
    visit: null, _visitForCanvas: function (a) {
        var b = a || cc._renderContext;
        if (this._visible) {
            b.save();
            this.transform(a);
            var c = this._children;
            if (c) {
                this.sortAllChildren();
                for (a = 0; a < c.length; a++)c[a] && c[a].visit(b)
            }
            b.restore()
        }
    }, _visitForWebGL: function (a) {
        a = a || cc._renderContext;
        if (this._visible) {
            cc.kmGLPushMatrix();
            var b = this.grid;
            b && b.isActive() && (b.beforeDraw(), this.transformAncestors());
            this.sortAllChildren();
            this.transform(a);
            this.draw(a);
            b && b.isActive() && b.afterDraw(this);
            cc.kmGLPopMatrix();
            this.arrivalOrder =
                0
        }
    }, addChild: null, _addChildForCanvas: function (a, b, c) {
        cc.assert(null != a, cc._LogInfos.CCSpriteBatchNode_addChild_3);
        a instanceof cc.Sprite ? (b = null == b ? a.zIndex : b, c = null == c ? a.tag : c, cc.Node.prototype.addChild.call(this, a, b, c), this.appendChild(a), this.setNodeDirty()) : cc.log(cc._LogInfos.CCSpriteBatchNode_addChild)
    }, _addChildForWebGL: function (a, b, c) {
        cc.assert(null != a, cc._LogInfos.Sprite_addChild_6);
        a instanceof cc.Sprite ? a.texture != this.textureAtlas.texture ? cc.log(cc._LogInfos.Sprite_addChild_5) : (b = null ==
            b ? a.zIndex : b, c = null == c ? a.tag : c, cc.Node.prototype.addChild.call(this, a, b, c), this.appendChild(a), this.setNodeDirty()) : cc.log(cc._LogInfos.Sprite_addChild_4)
    }, removeAllChildren: null, _removeAllChildrenForCanvas: function (a) {
        var b = this._descendants;
        if (b && 0 < b.length)for (var c = 0, d = b.length; c < d; c++)b[c] && (b[c].batchNode = null);
        cc.Node.prototype.removeAllChildren.call(this, a);
        this._descendants.length = 0
    }, _removeAllChildrenForWebGL: function (a) {
        var b = this._descendants;
        if (b && 0 < b.length)for (var c = 0, d = b.length; c <
            d; c++)b[c] && (b[c].batchNode = null);
        cc.Node.prototype.removeAllChildren.call(this, a);
        this._descendants.length = 0;
        this.textureAtlas.removeAllQuads()
    }, sortAllChildren: null, _sortAllChildrenForCanvas: function () {
        if (this._reorderChildDirty) {
            var a, b = 0, c = this._children, d = c.length, e;
            for (a = 1; a < d; a++) {
                var f = c[a], b = a - 1;
                for (e = c[b]; 0 <= b && (f._localZOrder < e._localZOrder || f._localZOrder == e._localZOrder && f.arrivalOrder < e.arrivalOrder);)c[b + 1] = e, b -= 1, e = c[b];
                c[b + 1] = f
            }
            0 < c.length && this._arrayMakeObjectsPerformSelector(c,
                cc.Node.StateCallbackType.sortAllChildren);
            this._reorderChildDirty = !1
        }
    }, _sortAllChildrenForWebGL: function () {
        if (this._reorderChildDirty) {
            var a = this._children, b, c = 0, d = a.length, e;
            for (b = 1; b < d; b++) {
                var f = a[b], c = b - 1;
                for (e = a[c]; 0 <= c && (f._localZOrder < e._localZOrder || f._localZOrder == e._localZOrder && f.arrivalOrder < e.arrivalOrder);)a[c + 1] = e, c -= 1, e = a[c];
                a[c + 1] = f
            }
            if (0 < a.length) {
                this._arrayMakeObjectsPerformSelector(a, cc.Node.StateCallbackType.sortAllChildren);
                for (b = c = 0; b < a.length; b++)c = this._updateAtlasIndex(a[b],
                    c)
            }
            this._reorderChildDirty = !1
        }
    }, draw: null, _drawForWebGL: function () {
        0 !== this.textureAtlas.totalQuads && (this._shaderProgram.use(), this._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4(), this._arrayMakeObjectsPerformSelector(this._children, cc.Node.StateCallbackType.updateTransform), cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst), this.textureAtlas.drawQuads())
    }});
_p = cc.SpriteBatchNode.prototype;
cc._renderType === cc._RENDER_TYPE_WEBGL ? (_p.ctor = _p._ctorForWebGL, _p.updateQuadFromSprite = _p._updateQuadFromSpriteForWebGL, _p.insertQuadFromSprite = _p._insertQuadFromSpriteForWebGL, _p.initWithTexture = _p._initWithTextureForWebGL, _p.appendChild = _p._appendChildForWebGL, _p.removeSpriteFromAtlas = _p._removeSpriteFromAtlasForWebGL, _p.getTexture = _p._getTextureForWebGL, _p.setTexture = _p._setTextureForWebGL, _p.visit = _p._visitForWebGL, _p.addChild = _p._addChildForWebGL, _p.removeAllChildren = _p._removeAllChildrenForWebGL,
    _p.sortAllChildren = _p._sortAllChildrenForWebGL, _p.draw = _p._drawForWebGL) : (_p.ctor = _p._ctorForCanvas, _p.updateQuadFromSprite = _p._updateQuadFromSpriteForCanvas, _p.insertQuadFromSprite = _p._insertQuadFromSpriteForCanvas, _p.initWithTexture = _p._initWithTextureForCanvas, _p.appendChild = _p._appendChildForCanvas, _p.removeSpriteFromAtlas = _p._removeSpriteFromAtlasForCanvas, _p.getTexture = _p._getTextureForCanvas, _p.setTexture = _p._setTextureForCanvas, _p.visit = _p._visitForCanvas, _p.removeAllChildren = _p._removeAllChildrenForCanvas,
    _p.addChild = _p._addChildForCanvas, _p.sortAllChildren = _p._sortAllChildrenForCanvas, _p.draw = cc.Node.prototype.draw);
cc.defineGetterSetter(_p, "texture", _p.getTexture, _p.setTexture);
cc.defineGetterSetter(_p, "descendants", _p.getDescendants);
cc.SpriteBatchNode.create = function (a, b) {
    return new cc.SpriteBatchNode(a, b)
};
cc.configuration = {ERROR: 0, STRING: 1, INT: 2, DOUBLE: 3, BOOLEAN: 4, _maxTextureSize: 0, _maxModelviewStackDepth: 0, _supportsPVRTC: !1, _supportsNPOT: !1, _supportsBGRA8888: !1, _supportsDiscardFramebuffer: !1, _supportsShareableVAO: !1, _maxSamplesAllowed: 0, _maxTextureUnits: 0, _GlExtensions: "", _valueDict: {}, _inited: !1, _init: function () {
    var a = this._valueDict;
    a["cocos2d.x.version"] = cc.ENGINE_VERSION;
    a["cocos2d.x.compiled_with_profiler"] = !1;
    a["cocos2d.x.compiled_with_gl_state_cache"] = cc.ENABLE_GL_STATE_CACHE;
    this._inited = !0
}, getMaxTextureSize: function () {
    return this._maxTextureSize
}, getMaxModelviewStackDepth: function () {
    return this._maxModelviewStackDepth
}, getMaxTextureUnits: function () {
    return this._maxTextureUnits
}, supportsNPOT: function () {
    return this._supportsNPOT
}, supportsPVRTC: function () {
    return this._supportsPVRTC
}, supportsETC: function () {
    return!1
}, supportsS3TC: function () {
    return!1
}, supportsATITC: function () {
    return!1
}, supportsBGRA8888: function () {
    return this._supportsBGRA8888
}, supportsDiscardFramebuffer: function () {
    return this._supportsDiscardFramebuffer
},
    supportsShareableVAO: function () {
        return this._supportsShareableVAO
    }, checkForGLExtension: function (a) {
        return-1 < this._GlExtensions.indexOf(a)
    }, getValue: function (a, b) {
        this._inited || this._init();
        var c = this._valueDict;
        return c[a] ? c[a] : b
    }, setValue: function (a, b) {
        this._valueDict[a] = b
    }, dumpInfo: function () {
        0 === cc.ENABLE_GL_STATE_CACHE && (cc.log(""), cc.log(cc._LogInfos.configuration_dumpInfo), cc.log(""))
    }, gatherGPUInfo: function () {
        if (cc._renderType !== cc._RENDER_TYPE_CANVAS) {
            this._inited || this._init();
            var a = cc._renderContext,
                b = this._valueDict;
            b["gl.vendor"] = a.getParameter(a.VENDOR);
            b["gl.renderer"] = a.getParameter(a.RENDERER);
            b["gl.version"] = a.getParameter(a.VERSION);
            this._GlExtensions = "";
            for (var c = a.getSupportedExtensions(), d = 0; d < c.length; d++)this._GlExtensions += c[d] + " ";
            this._maxTextureSize = a.getParameter(a.MAX_TEXTURE_SIZE);
            b["gl.max_texture_size"] = this._maxTextureSize;
            this._maxTextureUnits = a.getParameter(a.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
            b["gl.max_texture_units"] = this._maxTextureUnits;
            this._supportsPVRTC = this.checkForGLExtension("GL_IMG_texture_compression_pvrtc");
            b["gl.supports_PVRTC"] = this._supportsPVRTC;
            this._supportsNPOT = !1;
            b["gl.supports_NPOT"] = this._supportsNPOT;
            this._supportsBGRA8888 = this.checkForGLExtension("GL_IMG_texture_format_BGRA888");
            b["gl.supports_BGRA8888"] = this._supportsBGRA8888;
            this._supportsDiscardFramebuffer = this.checkForGLExtension("GL_EXT_discard_framebuffer");
            b["gl.supports_discard_framebuffer"] = this._supportsDiscardFramebuffer;
            this._supportsShareableVAO = this.checkForGLExtension("vertex_array_object");
            b["gl.supports_vertex_array_object"] =
                this._supportsShareableVAO;
            cc.checkGLErrorDebug()
        }
    }, loadConfigFile: function (a) {
        this._inited || this._init();
        var b = cc.loader.getRes(a);
        if (!b)throw"Please load the resource first : " + a;
        cc.assert(b, cc._LogInfos.configuration_loadConfigFile_2, a);
        if (b = b.data)for (var c in b)this._valueDict[c] = b[c]; else cc.log(cc._LogInfos.configuration_loadConfigFile, a)
    }};
cc.Camera = cc.Class.extend({_eyeX: null, _eyeY: null, _eyeZ: null, _centerX: null, _centerY: null, _centerZ: null, _upX: null, _upY: null, _upZ: null, _dirty: null, _lookupMatrix: null, ctor: function () {
    this._lookupMatrix = new cc.kmMat4;
    this.restore()
}, description: function () {
    return"\x3cCCCamera | center \x3d(" + this._centerX + "," + this._centerY + "," + this._centerZ + ")\x3e"
}, setDirty: function (a) {
    this._dirty = a
}, isDirty: function () {
    return this._dirty
}, restore: function () {
    this._eyeX = this._eyeY = 0;
    this._eyeZ = cc.Camera.getZEye();
    this._upX =
        this._centerX = this._centerY = this._centerZ = 0;
    this._upY = 1;
    this._upZ = 0;
    cc.kmMat4Identity(this._lookupMatrix);
    this._dirty = !1
}, locate: function () {
    if (this._dirty) {
        var a = new cc.kmVec3, b = new cc.kmVec3, c = new cc.kmVec3;
        cc.kmVec3Fill(a, this._eyeX, this._eyeY, this._eyeZ);
        cc.kmVec3Fill(b, this._centerX, this._centerY, this._centerZ);
        cc.kmVec3Fill(c, this._upX, this._upY, this._upZ);
        cc.kmMat4LookAt(this._lookupMatrix, a, b, c);
        this._dirty = !1
    }
    cc.kmGLMultMatrix(this._lookupMatrix)
}, setEyeXYZ: function (a, b, c) {
    this.setEye(a, b,
        c)
}, setEye: function (a, b, c) {
    this._eyeX = a;
    this._eyeY = b;
    this._eyeZ = c;
    this._dirty = !0
}, setCenterXYZ: function (a, b, c) {
    this.setCenter(a, b, c)
}, setCenter: function (a, b, c) {
    this._centerX = a;
    this._centerY = b;
    this._centerZ = c;
    this._dirty = !0
}, setUpXYZ: function (a, b, c) {
    this.setUp(a, b, c)
}, setUp: function (a, b, c) {
    this._upX = a;
    this._upY = b;
    this._upZ = c;
    this._dirty = !0
}, getEyeXYZ: function (a, b, c) {
    return{x: this._eyeX, y: this._eyeY, z: this._eyeZ}
}, getEye: function () {
    return{x: this._eyeX, y: this._eyeY, z: this._eyeZ}
}, getCenterXYZ: function (a, b, c) {
    return{x: this._centerX, y: this._centerY, z: this._centerZ}
}, getCenter: function () {
    return{x: this._centerX, y: this._centerY, z: this._centerZ}
}, getUpXYZ: function (a, b, c) {
    return{x: this._upX, y: this._upY, z: this._upZ}
}, getUp: function () {
    return{x: this._upX, y: this._upY, z: this._upZ}
}, _DISALLOW_COPY_AND_ASSIGN: function (a) {
}});
cc.Camera.getZEye = function () {
    return cc.FLT_EPSILON
};
cc.PI2 = 2 * Math.PI;
cc.DrawingPrimitiveCanvas = cc.Class.extend({_cacheArray: [], _renderContext: null, ctor: function (a) {
    this._renderContext = a
}, drawPoint: function (a, b) {
    b || (b = 1);
    var c = cc.view.getScaleX(), d = cc.view.getScaleY(), d = cc.p(a.x * c, a.y * d);
    this._renderContext.beginPath();
    this._renderContext.arc(d.x, -d.y, b * c, 0, 2 * Math.PI, !1);
    this._renderContext.closePath();
    this._renderContext.fill()
}, drawPoints: function (a, b, c) {
    if (null != a) {
        c || (c = 1);
        b = this._renderContext;
        var d = cc.view.getScaleX(), e = cc.view.getScaleY();
        b.beginPath();
        for (var f =
            0, g = a.length; f < g; f++)b.arc(a[f].x * d, -a[f].y * e, c * d, 0, 2 * Math.PI, !1);
        b.closePath();
        b.fill()
    }
}, drawLine: function (a, b) {
    var c = this._renderContext, d = cc.view.getScaleX(), e = cc.view.getScaleY();
    c.beginPath();
    c.moveTo(a.x * d, -a.y * e);
    c.lineTo(b.x * d, -b.y * e);
    c.closePath();
    c.stroke()
}, drawRect: function (a, b) {
    this.drawLine(cc.p(a.x, a.y), cc.p(b.x, a.y));
    this.drawLine(cc.p(b.x, a.y), cc.p(b.x, b.y));
    this.drawLine(cc.p(b.x, b.y), cc.p(a.x, b.y));
    this.drawLine(cc.p(a.x, b.y), cc.p(a.x, a.y))
}, drawSolidRect: function (a, b, c) {
    a = [a,
        cc.p(b.x, a.y), b, cc.p(a.x, b.y)];
    this.drawSolidPoly(a, 4, c)
}, drawPoly: function (a, b, c, d) {
    d = d || !1;
    if (null != a) {
        if (3 > a.length)throw Error("Polygon's point must greater than 2");
        var e = a[0];
        b = this._renderContext;
        var f = cc.view.getScaleX(), g = cc.view.getScaleY();
        b.beginPath();
        b.moveTo(e.x * f, -e.y * g);
        for (var e = 1, h = a.length; e < h; e++)b.lineTo(a[e].x * f, -a[e].y * g);
        c && b.closePath();
        d ? b.fill() : b.stroke()
    }
}, drawSolidPoly: function (a, b, c) {
    this.setDrawColor(c.r, c.g, c.b, c.a);
    this.drawPoly(a, b, !0, !0)
}, drawCircle: function (a, b, c, d, e) {
    e = e || !1;
    d = this._renderContext;
    var f = cc.view.getScaleX(), g = cc.view.getScaleY();
    d.beginPath();
    d.arc(0 | a.x * f, 0 | -(a.y * g), b * f, -c, -(c - 2 * Math.PI), !1);
    e && d.lineTo(0 | a.x * f, 0 | -(a.y * g));
    d.stroke()
}, drawQuadBezier: function (a, b, c, d) {
    for (var e = this._cacheArray, f = e.length = 0, g = 0; g < d; g++) {
        var h = Math.pow(1 - f, 2) * a.x + 2 * (1 - f) * f * b.x + f * f * c.x, k = Math.pow(1 - f, 2) * a.y + 2 * (1 - f) * f * b.y + f * f * c.y;
        e.push(cc.p(h, k));
        f += 1 / d
    }
    e.push(cc.p(c.x, c.y));
    this.drawPoly(e, d + 1, !1, !1)
}, drawCubicBezier: function (a, b, c, d, e) {
    for (var f = this._cacheArray,
             g = f.length = 0, h = 0; h < e; h++) {
        var k = Math.pow(1 - g, 3) * a.x + 3 * Math.pow(1 - g, 2) * g * b.x + 3 * (1 - g) * g * g * c.x + g * g * g * d.x, m = Math.pow(1 - g, 3) * a.y + 3 * Math.pow(1 - g, 2) * g * b.y + 3 * (1 - g) * g * g * c.y + g * g * g * d.y;
        f.push(cc.p(k, m));
        g += 1 / e
    }
    f.push(cc.p(d.x, d.y));
    this.drawPoly(f, e + 1, !1, !1)
}, drawCatmullRom: function (a, b) {
    this.drawCardinalSpline(a, 0.5, b)
}, drawCardinalSpline: function (a, b, c) {
    cc._renderContext.strokeStyle = "rgba(255,255,255,1)";
    var d = this._cacheArray;
    d.length = 0;
    for (var e, f, g = 1 / a.length, h = 0; h < c + 1; h++)f = h / c, 1 == f ? (e = a.length - 1, f = 1) :
        (e = 0 | f / g, f = (f - g * e) / g), e = cc.CardinalSplineAt(cc.getControlPointAt(a, e - 1), cc.getControlPointAt(a, e - 0), cc.getControlPointAt(a, e + 1), cc.getControlPointAt(a, e + 2), b, f), d.push(e);
    this.drawPoly(d, c + 1, !1, !1)
}, drawImage: function (a, b, c, d, e) {
    switch (arguments.length) {
        case 2:
            this._renderContext.drawImage(a, b.x, -(b.y + a.height));
            break;
        case 3:
            this._renderContext.drawImage(a, b.x, -(b.y + c.height), c.width, c.height);
            break;
        case 5:
            this._renderContext.drawImage(a, b.x, b.y, c.width, c.height, d.x, -(d.y + e.height), e.width, e.height);
            break;
        default:
            throw Error("Argument must be non-nil");
    }
}, drawStar: function (a, b, c) {
    a = a || this._renderContext;
    b *= cc.view.getScaleX();
    c = "rgba(" + (0 | c.r) + "," + (0 | c.g) + "," + (0 | c.b);
    a.fillStyle = c + ",1)";
    var d = b / 10;
    a.beginPath();
    a.moveTo(-b, b);
    a.lineTo(0, d);
    a.lineTo(b, b);
    a.lineTo(d, 0);
    a.lineTo(b, -b);
    a.lineTo(0, -d);
    a.lineTo(-b, -b);
    a.lineTo(-d, 0);
    a.lineTo(-b, b);
    a.closePath();
    a.fill();
    var e = a.createRadialGradient(0, 0, d, 0, 0, b);
    e.addColorStop(0, c + ", 1)");
    e.addColorStop(0.3, c + ", 0.8)");
    e.addColorStop(1, c + ", 0.0)");
    a.fillStyle = e;
    a.beginPath();
    a.arc(0, 0, b - d, 0, cc.PI2, !1);
    a.closePath();
    a.fill()
}, drawColorBall: function (a, b, c) {
    a = a || this._renderContext;
    b *= cc.view.getScaleX();
    c = "rgba(" + (0 | c.r) + "," + (0 | c.g) + "," + (0 | c.b);
    var d = a.createRadialGradient(0, 0, b / 10, 0, 0, b);
    d.addColorStop(0, c + ", 1)");
    d.addColorStop(0.3, c + ", 0.8)");
    d.addColorStop(0.6, c + ", 0.4)");
    d.addColorStop(1, c + ", 0.0)");
    a.fillStyle = d;
    a.beginPath();
    a.arc(0, 0, b, 0, cc.PI2, !1);
    a.closePath();
    a.fill()
}, fillText: function (a, b, c) {
    this._renderContext.fillText(a, b, -c)
},
    setDrawColor: function (a, b, c, d) {
        this._renderContext.fillStyle = "rgba(" + a + "," + b + "," + c + "," + d / 255 + ")";
        this._renderContext.strokeStyle = "rgba(" + a + "," + b + "," + c + "," + d / 255 + ")"
    }, setPointSize: function (a) {
    }, setLineWidth: function (a) {
        this._renderContext.lineWidth = a * cc.view.getScaleX()
    }});
cc.DrawingPrimitiveWebGL = cc.Class.extend({_renderContext: null, _initialized: !1, _shader: null, _colorLocation: -1, _colorArray: null, _pointSizeLocation: -1, _pointSize: -1, ctor: function (a) {
    null == a && (a = cc._renderContext);
    if (!a instanceof WebGLRenderingContext)throw"Can't initialise DrawingPrimitiveWebGL. context need is WebGLRenderingContext";
    this._renderContext = a;
    this._colorArray = new Float32Array([1, 1, 1, 1])
}, lazy_init: function () {
    this._initialized || (this._shader = cc.shaderCache.programForKey(cc.SHADER_POSITION_UCOLOR),
        this._colorLocation = this._renderContext.getUniformLocation(this._shader.getProgram(), "u_color"), this._pointSizeLocation = this._renderContext.getUniformLocation(this._shader.getProgram(), "u_pointSize"), this._initialized = !0)
}, drawInit: function () {
    this._initialized = !1
}, drawPoint: function (a) {
    this.lazy_init();
    var b = this._renderContext;
    this._shader.use();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
    b.uniform4fv(this._colorLocation,
        this._colorArray);
    this._shader.setUniformLocationWith1f(this._pointSizeLocation, this._pointSize);
    var c = b.createBuffer();
    b.bindBuffer(b.ARRAY_BUFFER, c);
    b.bufferData(b.ARRAY_BUFFER, new Float32Array([a.x, a.y]), b.STATIC_DRAW);
    b.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, b.FLOAT, !1, 0, 0);
    b.drawArrays(b.POINTS, 0, 1);
    b.deleteBuffer(c);
    cc.incrementGLDraws(1)
}, drawPoints: function (a, b) {
    if (a && 0 != a.length) {
        this.lazy_init();
        var c = this._renderContext;
        this._shader.use();
        this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
        c.uniform4fv(this._colorLocation, this._colorArray);
        this._shader.setUniformLocationWith1f(this._pointSizeLocation, this._pointSize);
        var d = c.createBuffer();
        c.bindBuffer(c.ARRAY_BUFFER, d);
        c.bufferData(c.ARRAY_BUFFER, this._pointsToTypeArray(a), c.STATIC_DRAW);
        c.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, c.FLOAT, !1, 0, 0);
        c.drawArrays(c.POINTS, 0, a.length);
        c.deleteBuffer(d);
        cc.incrementGLDraws(1)
    }
}, _pointsToTypeArray: function (a) {
    for (var b = new Float32Array(2 *
        a.length), c = 0; c < a.length; c++)b[2 * c] = a[c].x, b[2 * c + 1] = a[c].y;
    return b
}, drawLine: function (a, b) {
    this.lazy_init();
    var c = this._renderContext;
    this._shader.use();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
    c.uniform4fv(this._colorLocation, this._colorArray);
    var d = c.createBuffer();
    c.bindBuffer(c.ARRAY_BUFFER, d);
    c.bufferData(c.ARRAY_BUFFER, this._pointsToTypeArray([a, b]), c.STATIC_DRAW);
    c.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION,
        2, c.FLOAT, !1, 0, 0);
    c.drawArrays(c.LINES, 0, 2);
    c.deleteBuffer(d);
    cc.incrementGLDraws(1)
}, drawRect: function (a, b) {
    this.drawLine(cc.p(a.x, a.y), cc.p(b.x, a.y));
    this.drawLine(cc.p(b.x, a.y), cc.p(b.x, b.y));
    this.drawLine(cc.p(b.x, b.y), cc.p(a.x, b.y));
    this.drawLine(cc.p(a.x, b.y), cc.p(a.x, a.y))
}, drawSolidRect: function (a, b, c) {
    a = [a, cc.p(b.x, a.y), b, cc.p(a.x, b.y)];
    this.drawSolidPoly(a, 4, c)
}, drawPoly: function (a, b, c) {
    this.lazy_init();
    b = this._renderContext;
    this._shader.use();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
    b.uniform4fv(this._colorLocation, this._colorArray);
    var d = b.createBuffer();
    b.bindBuffer(b.ARRAY_BUFFER, d);
    b.bufferData(b.ARRAY_BUFFER, this._pointsToTypeArray(a), b.STATIC_DRAW);
    b.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, b.FLOAT, !1, 0, 0);
    c ? b.drawArrays(b.LINE_LOOP, 0, a.length) : b.drawArrays(b.LINE_STRIP, 0, a.length);
    b.deleteBuffer(d);
    cc.incrementGLDraws(1)
}, drawSolidPoly: function (a, b, c) {
    this.lazy_init();
    c && this.setDrawColor(c.r, c.g, c.b, c.a);
    b = this._renderContext;
    this._shader.use();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
    b.uniform4fv(this._colorLocation, this._colorArray);
    c = b.createBuffer();
    b.bindBuffer(b.ARRAY_BUFFER, c);
    b.bufferData(b.ARRAY_BUFFER, this._pointsToTypeArray(a), b.STATIC_DRAW);
    b.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, b.FLOAT, !1, 0, 0);
    b.drawArrays(b.TRIANGLE_FAN, 0, a.length);
    b.deleteBuffer(c);
    cc.incrementGLDraws(1)
}, drawCircle: function (a, b, c, d, e) {
    this.lazy_init();
    var f = 1;
    e && f++;
    var g = 2 * Math.PI / d;
    if (e = new Float32Array(2 * (d + 2))) {
        for (var h = 0; h <= d; h++) {
            var k = h * g, m = b * Math.cos(k + c) + a.x, k = b * Math.sin(k + c) + a.y;
            e[2 * h] = m;
            e[2 * h + 1] = k
        }
        e[2 * (d + 1)] = a.x;
        e[2 * (d + 1) + 1] = a.y;
        a = this._renderContext;
        this._shader.use();
        this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
        a.uniform4fv(this._colorLocation, this._colorArray);
        b = a.createBuffer();
        a.bindBuffer(a.ARRAY_BUFFER, b);
        a.bufferData(a.ARRAY_BUFFER,
            e, a.STATIC_DRAW);
        a.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, a.FLOAT, !1, 0, 0);
        a.drawArrays(a.LINE_STRIP, 0, d + f);
        a.deleteBuffer(b);
        cc.incrementGLDraws(1)
    }
}, drawQuadBezier: function (a, b, c, d) {
    this.lazy_init();
    for (var e = new Float32Array(2 * (d + 1)), f = 0, g = 0; g < d; g++)e[2 * g] = Math.pow(1 - f, 2) * a.x + 2 * (1 - f) * f * b.x + f * f * c.x, e[2 * g + 1] = Math.pow(1 - f, 2) * a.y + 2 * (1 - f) * f * b.y + f * f * c.y, f += 1 / d;
    e[2 * d] = c.x;
    e[2 * d + 1] = c.y;
    a = this._renderContext;
    this._shader.use();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
    a.uniform4fv(this._colorLocation, this._colorArray);
    b = a.createBuffer();
    a.bindBuffer(a.ARRAY_BUFFER, b);
    a.bufferData(a.ARRAY_BUFFER, e, a.STATIC_DRAW);
    a.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, a.FLOAT, !1, 0, 0);
    a.drawArrays(a.LINE_STRIP, 0, d + 1);
    a.deleteBuffer(b);
    cc.incrementGLDraws(1)
}, drawCubicBezier: function (a, b, c, d, e) {
    this.lazy_init();
    for (var f = new Float32Array(2 * (e + 1)), g = 0, h = 0; h < e; h++)f[2 * h] = Math.pow(1 - g, 3) * a.x + 3 * Math.pow(1 - g, 2) * g * b.x + 3 * (1 - g) * g * g * c.x + g * g * g * d.x, f[2 * h + 1] = Math.pow(1 - g, 3) * a.y + 3 * Math.pow(1 -
        g, 2) * g * b.y + 3 * (1 - g) * g * g * c.y + g * g * g * d.y, g += 1 / e;
    f[2 * e] = d.x;
    f[2 * e + 1] = d.y;
    a = this._renderContext;
    this._shader.use();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
    a.uniform4fv(this._colorLocation, this._colorArray);
    b = a.createBuffer();
    a.bindBuffer(a.ARRAY_BUFFER, b);
    a.bufferData(a.ARRAY_BUFFER, f, a.STATIC_DRAW);
    a.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, a.FLOAT, !1, 0, 0);
    a.drawArrays(a.LINE_STRIP, 0, e + 1);
    a.deleteBuffer(b);
    cc.incrementGLDraws(1)
},
    drawCatmullRom: function (a, b) {
        this.drawCardinalSpline(a, 0.5, b)
    }, drawCardinalSpline: function (a, b, c) {
        this.lazy_init();
        for (var d = new Float32Array(2 * (c + 1)), e, f, g = 1 / a.length, h = 0; h < c + 1; h++)f = h / c, 1 == f ? (e = a.length - 1, f = 1) : (e = 0 | f / g, f = (f - g * e) / g), e = cc.CardinalSplineAt(cc.getControlPointAt(a, e - 1), cc.getControlPointAt(a, e), cc.getControlPointAt(a, e + 1), cc.getControlPointAt(a, e + 2), b, f), d[2 * h] = e.x, d[2 * h + 1] = e.y;
        a = this._renderContext;
        this._shader.use();
        this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
        a.uniform4fv(this._colorLocation, this._colorArray);
        b = a.createBuffer();
        a.bindBuffer(a.ARRAY_BUFFER, b);
        a.bufferData(a.ARRAY_BUFFER, d, a.STATIC_DRAW);
        a.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, a.FLOAT, !1, 0, 0);
        a.drawArrays(a.LINE_STRIP, 0, c + 1);
        a.deleteBuffer(b);
        cc.incrementGLDraws(1)
    }, setDrawColor: function (a, b, c, d) {
        this._colorArray[0] = a / 255;
        this._colorArray[1] = b / 255;
        this._colorArray[2] = c / 255;
        this._colorArray[3] = d / 255
    }, setPointSize: function (a) {
        this._pointSize =
            a * cc.contentScaleFactor()
    }, setLineWidth: function (a) {
        this._renderContext.lineWidth && this._renderContext.lineWidth(a)
    }});
cc.HashElement = cc.Class.extend({actions: null, target: null, actionIndex: 0, currentAction: null, currentActionSalvaged: !1, paused: !1, hh: null, ctor: function () {
    this.actions = [];
    this.target = null;
    this.actionIndex = 0;
    this.currentAction = null;
    this.paused = this.currentActionSalvaged = !1;
    this.hh = null
}});
cc.ActionManager = cc.Class.extend({_hashTargets: null, _arrayTargets: null, _currentTarget: null, _currentTargetSalvaged: !1, _searchElementByTarget: function (a, b) {
    for (var c = 0; c < a.length; c++)if (b == a[c].target)return a[c];
    return null
}, ctor: function () {
    this._hashTargets = {};
    this._arrayTargets = [];
    this._currentTarget = null;
    this._currentTargetSalvaged = !1
}, addAction: function (a, b, c) {
    if (!a)throw"cc.ActionManager.addAction(): action must be non-null";
    if (!b)throw"cc.ActionManager.addAction(): action must be non-null";
    var d =
        this._hashTargets[b.__instanceId];
    d || (d = new cc.HashElement, d.paused = c, d.target = b, this._hashTargets[b.__instanceId] = d, this._arrayTargets.push(d));
    this._actionAllocWithHashElement(d);
    d.actions.push(a);
    a.startWithTarget(b)
}, removeAllActions: function () {
    for (var a = this._arrayTargets, b = 0; b < a.length; b++) {
        var c = a[b];
        c && this.removeAllActionsFromTarget(c.target, !0)
    }
}, removeAllActionsFromTarget: function (a, b) {
    if (null != a) {
        var c = this._hashTargets[a.__instanceId];
        c && (-1 !== c.actions.indexOf(c.currentAction) && !c.currentActionSalvaged &&
            (c.currentActionSalvaged = !0), c.actions.length = 0, this._currentTarget == c && !b ? this._currentTargetSalvaged = !0 : this._deleteHashElement(c))
    }
}, removeAction: function (a) {
    if (null != a) {
        var b = a.getOriginalTarget();
        if (b = this._hashTargets[b.__instanceId])for (var c = 0; c < b.actions.length; c++) {
            if (b.actions[c] == a) {
                b.actions.splice(c, 1);
                break
            }
        } else cc.log(cc._LogInfos.ActionManager_removeAction)
    }
}, removeActionByTag: function (a, b) {
    a == cc.ACTION_TAG_INVALID && cc.log(cc._LogInfos.ActionManager_addAction);
    cc.assert(b, cc._LogInfos.ActionManager_addAction);
    var c = this._hashTargets[b.__instanceId];
    if (c)for (var d = c.actions.length, e = 0; e < d; ++e) {
        var f = c.actions[e];
        if (f && f.getTag() === a && f.getOriginalTarget() == b) {
            this._removeActionAtIndex(e, c);
            break
        }
    }
}, getActionByTag: function (a, b) {
    a == cc.ACTION_TAG_INVALID && cc.log(cc._LogInfos.ActionManager_getActionByTag);
    var c = this._hashTargets[b.__instanceId];
    if (c) {
        if (null != c.actions)for (var d = 0; d < c.actions.length; ++d) {
            var e = c.actions[d];
            if (e && e.getTag() === a)return e
        }
        cc.log(cc._LogInfos.ActionManager_getActionByTag_2, a)
    }
    return null
},
    numberOfRunningActionsInTarget: function (a) {
        return(a = this._hashTargets[a.__instanceId]) ? a.actions ? a.actions.length : 0 : 0
    }, pauseTarget: function (a) {
        if (a = this._hashTargets[a.__instanceId])a.paused = !0
    }, resumeTarget: function (a) {
        if (a = this._hashTargets[a.__instanceId])a.paused = !1
    }, pauseAllRunningActions: function () {
        for (var a = [], b = this._arrayTargets, c = 0; c < b.length; c++) {
            var d = b[c];
            d && !d.paused && (d.paused = !0, a.push(d.target))
        }
        return a
    }, resumeTargets: function (a) {
        if (a)for (var b = 0; b < a.length; b++)a[b] && this.resumeTarget(a[b])
    },
    purgeSharedManager: function () {
        cc.director.getScheduler().unscheduleUpdateForTarget(this)
    }, _removeActionAtIndex: function (a, b) {
        b.actions[a] == b.currentAction && !b.currentActionSalvaged && (b.currentActionSalvaged = !0);
        b.actions.splice(a, 1);
        b.actionIndex >= a && b.actionIndex--;
        0 == b.actions.length && (this._currentTarget == b ? this._currentTargetSalvaged = !0 : this._deleteHashElement(b))
    }, _deleteHashElement: function (a) {
        a && (delete this._hashTargets[a.target.__instanceId], cc.arrayRemoveObject(this._arrayTargets, a), a.actions =
            null, a.target = null)
    }, _actionAllocWithHashElement: function (a) {
        null == a.actions && (a.actions = [])
    }, update: function (a) {
        for (var b = this._arrayTargets, c, d = 0; d < b.length; d++) {
            c = this._currentTarget = b[d];
            if (!c.paused)for (c.actionIndex = 0; c.actionIndex < c.actions.length; c.actionIndex++)if (c.currentAction = c.actions[c.actionIndex], c.currentAction) {
                c.currentActionSalvaged = !1;
                c.currentAction.step(a * (c.currentAction._speedMethod ? c.currentAction._speed : 1));
                if (c.currentActionSalvaged)c.currentAction = null; else if (c.currentAction.isDone()) {
                    c.currentAction.stop();
                    var e = c.currentAction;
                    c.currentAction = null;
                    this.removeAction(e)
                }
                c.currentAction = null
            }
            this._currentTargetSalvaged && 0 === c.actions.length && this._deleteHashElement(c)
        }
    }});
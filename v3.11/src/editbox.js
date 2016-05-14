cc.DOM = {};
cc.DOM._addMethods = function (node) {
    for (var funcs in cc.DOM.methods) {
	    node[funcs] = cc.DOM.methods[funcs];
    }
	cc.defineGetterSetter(node, "x", node.getPositionX, node.setPositionX);
	cc.defineGetterSetter(node, "y", node.getPositionY, node.setPositionY);
	cc.defineGetterSetter(node, "width", node._getWidth, node._setWidth);
	cc.defineGetterSetter(node, "height", node._getHeight, node._setHeight);
	cc.defineGetterSetter(node, "anchorX", node._getAnchorX, node._setAnchorX);
	cc.defineGetterSetter(node, "anchorY", node._getAnchorY, node._setAnchorY);
	cc.defineGetterSetter(node, "scale", node.getScale, node.setScale);
	cc.defineGetterSetter(node, "scaleX", node.getScaleX, node.setScaleX);
	cc.defineGetterSetter(node, "scaleY", node.getScaleY, node.setScaleY);
	cc.defineGetterSetter(node, "rotation", node.getRotation, node.setRotation);
 	cc.defineGetterSetter(node, "skewX", node.getSkewX, node.setSkewX);
	cc.defineGetterSetter(node, "skewY", node.getSkewY, node.setSkewY);
	cc.defineGetterSetter(node, "visible", node.isVisible, node.setVisible);
	cc.defineGetterSetter(node, "parent", node.getParent, node.setParent);
	cc.defineGetterSetter(node, "opacity", node.getOpacity, node.setOpacity);
};
cc.DOM.methods = {
    setPosition:function (x, y) {
        if (y === undefined) {
	        this._position.x = x.x;
	        this._position.y = x.y;
        } else {
	        this._position.x = x;
	        this._position.y = y;
        }
        this.setNodeDirty();
        this.dom.translates(this._position.x, -this._position.y);
    },
    setPositionY:function (y) {
        this._position.y = y;
        this.setNodeDirty();
        this.dom.translates(this._position.x, -this._position.y);
    },
    setPositionX:function (x) {
        this._position.x = x;
        this.setNodeDirty();
        this.dom.translates(this._position.x, -this._position.y);
    },
    setScale:function (scale, scaleY) {
        this._scaleX = scale;
        this._scaleY = scaleY || scale;
        this.setNodeDirty();
        this.dom.resize(this._scaleX, this._scaleY);
    },
    setScaleX:function (x) {
        this._scaleX = x;
        this.setNodeDirty();
        this.dom.resize(this._scaleX, this._scaleY);
    },
    setScaleY:function (y) {
        this._scaleY = y;
        this.setNodeDirty();
        this.dom.resize(this._scaleX, this._scaleY);
    },
    setAnchorPoint:function (point, y) {
        var cmd = this._renderCmd;
        var locAnchorPoint = this._anchorPoint;
        if (y === undefined) {
	        locAnchorPoint.x = point.x;
	        locAnchorPoint.y = point.y;
        } else {
	        locAnchorPoint.x = point;
	        locAnchorPoint.y = y;
        }
        var locAPP = cmd._anchorPointInPoints, locSize = this._contentSize;
        locAPP.x = locSize.width * locAnchorPoint.x;
        locAPP.y = locSize.height * locAnchorPoint.y;
        this.dom.style[cc.$.pfx + 'TransformOrigin'] = '' + locAPP.x + 'px ' + -locAPP.y + 'px';
        if (this.ignoreAnchor) {
            this.dom.style.marginLeft = 0;
            this.dom.style.marginBottom = 0;
        } else {
            this.dom.style.marginLeft = (this.isToggler) ? 0 : -locAPP.x + 'px';
            this.dom.style.marginBottom = -locAPP.y + 'px';
        }
        this.setNodeDirty();
    },
	_setAnchorX:function (x) {
		var locAnchorPoint = this._anchorPoint;
        var cmd = this._renderCmd;
		if (x === locAnchorPoint.x)
			return;
		locAnchorPoint.x = x;
		var locAPP = cmd._anchorPointInPoints, locSize = this._contentSize;
		locAPP.x = locSize.width * locAnchorPoint.x;
		this.dom.style[cc.$.pfx + 'TransformOrigin'] = '' + locAPP.x + 'px ' + -locAPP.y + 'px';
		if (this.ignoreAnchor) {
			this.dom.style.marginLeft = 0;
			this.dom.style.marginBottom = 0;
		} else {
			this.dom.style.marginLeft = (this.isToggler) ? 0 : -locAPP.x + 'px';
		}
		this.setNodeDirty();
	},
	_setAnchorY:function (y) {
		var locAnchorPoint = this._anchorPoint;
        var cmd = this._renderCmd;
		if (y === locAnchorPoint.y)
			return;
		locAnchorPoint.y = y;
		var locAPP = cmd._anchorPointInPoints, locSize = this._contentSize;
		locAPP.y = locSize.height * locAnchorPoint.y;
		this.dom.style[cc.$.pfx + 'TransformOrigin'] = '' + locAPP.x + 'px ' + -locAPP.y + 'px';
		if (this.ignoreAnchor) {
			this.dom.style.marginLeft = 0;
			this.dom.style.marginBottom = 0;
		} else {
			this.dom.style.marginBottom = -locAPP.y + 'px';
		}
		this.setNodeDirty();
	},
    setContentSize:function (size, height) {
        var cmd = this._renderCmd;
        var locContentSize = this._contentSize;
        if (height === undefined) {
	        locContentSize.width = size.width;
	        locContentSize.height = size.height;
        } else {
	        locContentSize.width = size;
	        locContentSize.height = height;
        }
        var locAPP = cmd._anchorPointInPoints, locAnchorPoint = this._anchorPoint;
        locAPP.x = locContentSize.width * locAnchorPoint.x;
        locAPP.y = locContentSize.height * locAnchorPoint.y;
        this.dom.width = locContentSize.width;
        this.dom.height = locContentSize.height;
        this.setAnchorPoint(this.getAnchorPoint());
        if (this.canvas) {
            this.canvas.width = locContentSize.width;
            this.canvas.height = locContentSize.height;
        }
        this.setNodeDirty();
        this.redraw();
    },
	_setWidth:function (width) {
		var locContentSize = this._contentSize;
        var cmd = this._renderCmd;
		if (width === locContentSize.width)
			return;
		locContentSize.width = width;
		var locAPP = cmd._anchorPointInPoints, locAnchorPoint = this._anchorPoint;
		locAPP.x = locContentSize.width * locAnchorPoint.x;
		this.dom.width = locContentSize.width;
		this.anchorX = locAnchorPoint.x;
		if (this.canvas) {
			this.canvas.width = locContentSize.width;
		}
		this.setNodeDirty();
		this.redraw();
	},
	_setHeight:function (height) {
		var locContentSize = this._contentSize;
        var cmd = this._renderCmd;
		if (height === locContentSize.height)
			return;
		locContentSize.height = height;
		var locAPP = cmd._anchorPointInPoints, locAnchorPoint = this._anchorPoint;
		locAPP.y = locContentSize.height * locAnchorPoint.y;
		this.dom.height = locContentSize.height;
		this.anchorY = locAnchorPoint.y;
		if (this.canvas) {
			this.canvas.height = locContentSize.height;
		}
		this.setNodeDirty();
		this.redraw();
	},
    setRotation:function (newRotation) {
        if (this._rotation === newRotation)
            return;
        this._rotationX = this._rotationY = newRotation;
        this.setNodeDirty();
        this.dom.rotate(newRotation);
    },
    setSkewX:function (x) {
        this._skewX = x;
        this.setNodeDirty();
        this.dom.setSkew(this._skewX, this._skewY);
    },
    setSkewY:function (y) {
        this._skewY = y;
        this.setNodeDirty();
        this.dom.setSkew(this._skewX, this._skewY);
    },
    setVisible:function (x) {
        this._visible = x;
        this.setNodeDirty();
        if (this.dom)
            this.dom.style.display = (x) ? 'block' : 'none';
    },
    _setLocalZOrder:function (z) {
        this._localZOrder = z;
        this.setNodeDirty();
        if (this.dom)
            this.dom.zIndex = z;
    },
    setParent:function (p) {
        this._parent = p;
        if (p !== null) {
            p.setAnchorPoint(p.getAnchorPoint());
            this.setNodeDirty();
            cc.DOM.parentDOM(this);
        }
    },
    resume:function () {
        this.getScheduler().resumeTarget(this);
        this.getActionManager().resumeTarget(this);
        cc.eventManager.resumeTarget(this);
        if (this.dom && !this.dom.parentNode) {
            if (!this.getParent()) {
                if(this.dom.id === ""){
                    cc.DOM._createEGLViewDiv(this);
                }else{
                    this.dom.appendTo(cc.container);
                }
            } else {
                cc.DOM.parentDOM(this);
            }
        }
        if (this.dom)
            this.dom.style.visibility = "visible";
    },
    pause:function () {
        this.getScheduler().pauseTarget(this);
        this.getActionManager().pauseTarget(this);
        cc.eventManager.pauseTarget(this);
        if (this.dom) {
            this.dom.style.visibility = 'hidden';
        }
    },
    cleanup:function () {
        this.stopAllActions();
        this.unscheduleAllCallbacks();
        cc.eventManager.removeListeners(this);
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node._stateCallbackType.cleanup);
        if (this.dom) {
            this.dom.remove();
        }
    },
    setOpacity:function (o) {
        this._opacity = o;
        this.dom.style.opacity = o / 255;
    },
    redraw:function () {
        if (this.isSprite) {
            var tmp = this._children;
            this._children = [];
            cc.Sprite.prototype.visit.call(this, this.ctx);
            this._children = tmp;
        }
        else {
            cc.Sprite.prototype.visit.call(this, this.ctx);
        }
    }
};
cc.DOM._resetEGLViewDiv = function(){
    var div = cc.$("#EGLViewDiv");
    if(div){
        var view = cc.view;
        var designSize = view.getDesignResolutionSize();
        var viewPortRect = view.getViewPortRect();
        var screenSize = view.getFrameSize();
	    var pixelRatio = view.getDevicePixelRatio();
        var designSizeWidth = designSize.width, designSizeHeight = designSize.height;
        if((designSize.width === 0) && (designSize.height === 0)){
            designSizeWidth = screenSize.width;
            designSizeHeight = screenSize.height;
        }
        var viewPortWidth = viewPortRect.width/pixelRatio;
        if((viewPortRect.width === 0) && (viewPortRect.height === 0)){
            viewPortWidth = screenSize.width;
        }
        div.style.position = 'absolute';
        div.style.width = designSizeWidth + "px";
        div.style.maxHeight = designSizeHeight + "px";
        div.style.margin = 0;
        div.resize(view.getScaleX()/pixelRatio, view.getScaleY()/pixelRatio);
        if (view.getResolutionPolicy() === view._rpNoBorder) {
            div.style.left = (view.getFrameSize().width - designSizeWidth)/2 + "px";
            div.style.bottom = (view.getFrameSize().height - designSizeHeight*view.getScaleY()/pixelRatio)/2 + "px";
        }
        else {
            div.style.left = (designSizeWidth*view.getScaleX()/pixelRatio - designSizeWidth) / 2 + "px";
            div.style.bottom = "0px";
        }
    }
};
cc.DOM.parentDOM = function (x) {
    var p = x.getParent();
    if (!p || !x.dom)
        return false;
    if (!p.dom) {
        cc.DOM.placeHolder(p);
        p.setParent = cc.DOM.methods.setParent;
    }
    x.dom.appendTo(p.dom);
    p.setAnchorPoint(p.getAnchorPoint());
    if (p.getParent()) {
        cc.DOM.parentDOM(p);
    } else {
        if (p.isRunning()) {
            var eglViewDiv = cc.$("#EGLViewDiv");
            if (eglViewDiv) {
                p.dom.appendTo(eglViewDiv);
            } else {
                cc.DOM._createEGLViewDiv(p);
            }
        }
    }
    return true;
};
cc.DOM._createEGLViewDiv = function(p){
    var div = cc.$("#EGLViewDiv");
    if(!div){
        div = cc.$new("div");
        div.id = "EGLViewDiv";
    }
    var view = cc.view;
    var designSize = view.getDesignResolutionSize();
    var viewPortRect = view.getViewPortRect();
    var screenSize = view.getFrameSize();
    var pixelRatio = view.getDevicePixelRatio();
    var designSizeWidth = designSize.width, designSizeHeight = designSize.height;
    if ((designSize.width === 0) && (designSize.height === 0)) {
        designSizeWidth = screenSize.width;
        designSizeHeight = screenSize.height;
    }
    var viewPortWidth = viewPortRect.width/pixelRatio;
    if ((viewPortRect.width === 0) && (viewPortRect.height === 0)) {
        viewPortWidth = screenSize.width;
    }
    div.style.position = 'absolute';
    div.style.width = designSizeWidth + "px";
    div.style.maxHeight = designSizeHeight + "px";
    div.style.margin = 0;
    div.resize(view.getScaleX()/pixelRatio, view.getScaleY()/pixelRatio);
    if (view.getResolutionPolicy() === view._rpNoBorder) {
        div.style.left = (screenSize.width - designSizeWidth)/2 + "px";
        div.style.bottom = (screenSize.height - designSizeHeight*view.getScaleY()/pixelRatio)/2 + "px";
    }
    else {
        div.style.left = (designSizeWidth*view.getScaleX()/pixelRatio - designSizeWidth) / 2 + "px";
        div.style.bottom = "0px";
    }
    p.dom.appendTo(div);
    div.appendTo(cc.container);
};
cc.DOM.setTransform = function (x) {
    if (x.ctx) {
        x.ctx.translate(x.getAnchorPointInPoints().x, x.getAnchorPointInPoints().y);
        if (x.isSprite) {
            var tmp = x._children;
            x._children = [];
            cc.Sprite.prototype.visit.call(x);
            x._children = tmp;
        }
        else {
            cc.Sprite.prototype.visit.call(x);
        }
    }
    if (x.dom) {
        x.dom.position.x = x.getPositionX();
        x.dom.position.y = -x.getPositionY();
        x.dom.rotation = x.getRotation();
        x.dom.scale = {x:x.getScaleX(), y:x.getScaleY()};
        x.dom.skew = {x:x.getSkewX(), y:x.getSkewY()};
        if (x.setAnchorPoint)
            x.setAnchorPoint(x.getAnchorPoint());
        x.dom.transforms();
    }
};
cc.DOM.forSprite = function (x) {
    x.dom = cc.$new('div');
    x.canvas = cc.$new('canvas');
    var locContentSize = x.getContentSize();
    x.canvas.width = locContentSize.width;
    x.canvas.height = locContentSize.height;
    x.dom.style.position = 'absolute';
    x.dom.style.bottom = 0;
    x.ctx = x.canvas.getContext('2d');
    x.dom.appendChild(x.canvas);
    if (x.getParent()) {
        cc.DOM.parentDOM(x);
    }
    x.isSprite = true;
};
cc.DOM.placeHolder = function (x) {
    x.dom = cc.$new('div');
    x.placeholder = true;
    x.dom.style.position = 'absolute';
    x.dom.style.bottom = 0;
    x.dom.style.width = (x.getContentSize().width || cc.director.getWinSize().width) + "px";
    x.dom.style.maxHeight = (x.getContentSize().height || cc.director.getWinSize().height) + "px";
    x.dom.style.margin = 0;
    cc.DOM.setTransform(x);
    x.dom.transforms();
    cc.DOM._addMethods(x);
};
cc.DOM.convert = function (nodeObject) {
    if (arguments.length > 1) {
        cc.DOM.convert(arguments);
        return;
    } else if (arguments.length === 1 && !arguments[0].length) {
        cc.DOM.convert([arguments[0]]);
        return;
    }
    var args = arguments[0];
    for (var i = 0; i < args.length; i++) {
        if (args[i] instanceof cc.Sprite) {
            if (!args[i].dom)
                cc.DOM.forSprite(args[i]);
        } else {
            cc.log('DOM converter only supports sprite and menuitems yet');
        }
        cc.DOM._addMethods(args[i]);
        args[i].visit = function () {
        };
        args[i].transform = function () {
        };
        cc.DOM.setTransform(args[i]);
        args[i].setVisible(args[i].isVisible());
    }
};
cc.KEYBOARD_RETURNTYPE_DEFAULT = 0;
cc.KEYBOARD_RETURNTYPE_DONE = 1;
cc.KEYBOARD_RETURNTYPE_SEND = 2;
cc.KEYBOARD_RETURNTYPE_SEARCH = 3;
cc.KEYBOARD_RETURNTYPE_GO = 4;
cc.EDITBOX_INPUT_MODE_ANY = 0;
cc.EDITBOX_INPUT_MODE_EMAILADDR = 1;
cc.EDITBOX_INPUT_MODE_NUMERIC = 2;
cc.EDITBOX_INPUT_MODE_PHONENUMBER = 3;
cc.EDITBOX_INPUT_MODE_URL = 4;
cc.EDITBOX_INPUT_MODE_DECIMAL = 5;
cc.EDITBOX_INPUT_MODE_SINGLELINE = 6;
cc.EDITBOX_INPUT_FLAG_PASSWORD = 0;
cc.EDITBOX_INPUT_FLAG_SENSITIVE = 1;
cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_WORD = 2;
cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE = 3;
cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS = 4;
cc.EditBoxDelegate = cc.Class.extend({
    editBoxEditingDidBegin: function (sender) {
    },
    editBoxEditingDidEnd: function (sender) {
    },
    editBoxTextChanged: function (sender, text) {
    },
    editBoxReturn: function (sender) {
    }
});
cc.EditBox = cc.ControlButton.extend({
    _domInputSprite: null,
    _delegate: null,
    _editBoxInputMode: cc.EDITBOX_INPUT_MODE_ANY,
    _editBoxInputFlag: cc.EDITBOX_INPUT_FLAG_SENSITIVE,
    _keyboardReturnType: cc.KEYBOARD_RETURNTYPE_DEFAULT,
    _text: "",
    _placeholderText: "",
    _textColor: null,
    _placeholderColor: null,
    _maxLength: 50,
    _adjustHeight: 18,
    _edTxt: null,
    _edFontSize: 14,
    _edFontName: "Arial",
    _placeholderFontName: "",
    _placeholderFontSize: 14,
    _tooltip: false,
    _className: "EditBox",
    _onCanvasClick : null,
    _inputEvent : null,
    _keyPressEvent : null,
    _focusEvent : null,
    _blurEvent : null,
    ctor: function (size, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg) {
        cc.ControlButton.prototype.ctor.call(this);
        this._textColor = cc.color.WHITE;
        this._placeholderColor = cc.color.GRAY;
        this.setContentSize(size);
        var tmpDOMSprite = this._domInputSprite = new cc.Sprite();
        tmpDOMSprite.draw = function () {};
        this.addChild(tmpDOMSprite);
        var tmpEdTxt = this._edTxt = document.createElement("input");
        tmpEdTxt.type = "text";
        tmpEdTxt.style.fontSize = this._edFontSize + "px";
        tmpEdTxt.style.color = "#000000";
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = "transparent";
        tmpEdTxt.style.width = "100%";
        tmpEdTxt.style.height = "100%";
        tmpEdTxt.style.active = 0;
        tmpEdTxt.style.outline = "medium";
        tmpEdTxt.style.padding = "0";
        var onCanvasClick = function() { this._edTxt.blur();};
        this._onCanvasClick = onCanvasClick.bind(this);
        var inputEvent = function () {
            if (this._delegate && this._delegate.editBoxTextChanged)
                this._delegate.editBoxTextChanged(this, this._edTxt.value);
        };
        this._inputEvent = inputEvent.bind(this);
        var keypressEvent = function ( e ) {
            if (e.keyCode === cc.KEY.enter) {
                e.stopPropagation();
                e.preventDefault();
                if (this._delegate && this._delegate.editBoxReturn)
                    this._delegate.editBoxReturn(this);
                cc._canvas.focus();
            }
        };
        this._keyPressEvent = keypressEvent.bind(this);
        var focusEvent = function () {
            if (this._edTxt.value === this._placeholderText) {
                this._edTxt.value = "";
                this._edTxt.style.fontSize = this._edFontSize + "px";
                this._edTxt.style.color = cc.colorToHex(this._textColor);
                if (this._editBoxInputFlag === cc.EDITBOX_INPUT_FLAG_PASSWORD)
                    this._edTxt.type = "password";
                else
                    this._edTxt.type = "text";
            }
            if (this._delegate && this._delegate.editBoxEditingDidBegin)
                this._delegate.editBoxEditingDidBegin(this);
            cc._canvas.addEventListener("click", this._onCanvasClick);
        };
        this._focusEvent = focusEvent.bind(this);
        var blurEvent = function () {
            if (this._edTxt.value === "") {
                this._edTxt.value = this._placeholderText;
                this._edTxt.style.fontSize = this._placeholderFontSize + "px";
                this._edTxt.style.color = cc.colorToHex(this._placeholderColor);
                this._edTxt.type = "text";
            }
            if (this._delegate && this._delegate.editBoxEditingDidEnd)
                this._delegate.editBoxEditingDidEnd(this);
            cc._canvas.removeEventListener('click', this._onCanvasClick);
        };
        this._blurEvent = blurEvent.bind(this);
        tmpEdTxt.addEventListener("input", this._inputEvent);
        tmpEdTxt.addEventListener("keypress", this._keyPressEvent);
        tmpEdTxt.addEventListener("focus", this._focusEvent);
        tmpEdTxt.addEventListener("blur", this._blurEvent);
        cc.DOM.convert(tmpDOMSprite);
        tmpDOMSprite.dom.appendChild(tmpEdTxt);
        tmpDOMSprite.dom.showTooltipDiv = false;
        tmpDOMSprite.dom.style.width = (size.width - 6) + "px";
        tmpDOMSprite.dom.style.height = (size.height - 6) + "px";
        tmpDOMSprite.canvas.remove();
        if (this.initWithSizeAndBackgroundSprite(size, normal9SpriteBg)) {
            if (press9SpriteBg)
                this.setBackgroundSpriteForState(press9SpriteBg, cc.CONTROL_STATE_HIGHLIGHTED);
            if (disabled9SpriteBg)
                this.setBackgroundSpriteForState(disabled9SpriteBg, cc.CONTROL_STATE_DISABLED);
        }
    },
    setFont: function (fontName, fontSize) {
        this._edFontSize = fontSize;
        this._edFontName = fontName;
        this._setFontToEditBox();
    },
    _setFont: function (fontStyle) {
        var res = cc.LabelTTF._fontStyleRE.exec(fontStyle);
        if (res) {
            this._edFontSize = parseInt(res[1]);
            this._edFontName = res[2];
            this._setFontToEditBox();
        }
    },
    setFontName: function (fontName) {
        this._edFontName = fontName;
        this._setFontToEditBox();
    },
    setFontSize: function (fontSize) {
        this._edFontSize = fontSize;
        this._setFontToEditBox();
    },
    _setFontToEditBox: function () {
        if (this._edTxt.value !== this._placeholderText) {
            this._edTxt.style.fontFamily = this._edFontName;
            this._edTxt.style.fontSize = this._edFontSize + "px";
            if (this._editBoxInputFlag === cc.EDITBOX_INPUT_FLAG_PASSWORD)
                this._edTxt.type = "password";
            else
                this._edTxt.type = "text";
        }
    },
    setText: function (text) {
        cc.log("Please use the setString");
        this.setString(text);
    },
    setString: function (text) {
        if (text != null) {
            if (text === "") {
                this._edTxt.value = this._placeholderText;
                this._edTxt.style.color = cc.colorToHex(this._placeholderColor);
                this._edTxt.type = "text";
            } else {
                this._edTxt.value = text;
                this._edTxt.style.color = cc.colorToHex(this._textColor);
                if (this._editBoxInputFlag === cc.EDITBOX_INPUT_FLAG_PASSWORD)
                    this._edTxt.type = "password";
                else
                    this._edTxt.type = "text";
            }
        }
    },
    setFontColor: function (color) {
        this._textColor = color;
        if (this._edTxt.value !== this._placeholderText) {
            this._edTxt.style.color = cc.colorToHex(color);
        }
    },
    setMaxLength: function (maxLength) {
        if (!isNaN(maxLength) && maxLength > 0) {
            this._maxLength = maxLength;
            this._edTxt.maxLength = maxLength;
        }
    },
    getMaxLength: function () {
        return this._maxLength;
    },
    setPlaceHolder: function (text) {
        if (text != null) {
            var oldPlaceholderText = this._placeholderText;
            this._placeholderText = text;
            if (this._edTxt.value === oldPlaceholderText) {
                this._edTxt.value = text;
                this._edTxt.style.color = cc.colorToHex(this._placeholderColor);
                this._setPlaceholderFontToEditText();
            }
        }
    },
    setPlaceholderFont: function (fontName, fontSize) {
        this._placeholderFontName = fontName;
        this._placeholderFontSize = fontSize;
        this._setPlaceholderFontToEditText();
    },
    _setPlaceholderFont: function (fontStyle) {
        var res = cc.LabelTTF._fontStyleRE.exec(fontStyle);
        if (res) {
            this._placeholderFontName = res[2];
            this._placeholderFontSize = parseInt(res[1]);
            this._setPlaceholderFontToEditText();
        }
    },
    setPlaceholderFontName: function (fontName) {
        this._placeholderFontName = fontName;
        this._setPlaceholderFontToEditText();
    },
    setPlaceholderFontSize: function (fontSize) {
        this._placeholderFontSize = fontSize;
        this._setPlaceholderFontToEditText();
    },
    _setPlaceholderFontToEditText: function () {
        if (this._edTxt.value === this._placeholderText) {
            this._edTxt.style.fontFamily = this._placeholderFontName;
            this._edTxt.style.fontSize = this._placeholderFontSize + "px";
            this._edTxt.type = "text";
        }
    },
    setPlaceholderFontColor: function (color) {
        this._placeholderColor = color;
        if (this._edTxt.value === this._placeholderText) {
            this._edTxt.style.color = cc.colorToHex(color);
        }
    },
    setInputFlag: function (inputFlag) {
        this._editBoxInputFlag = inputFlag;
        if ((this._edTxt.value !== this._placeholderText) && (inputFlag === cc.EDITBOX_INPUT_FLAG_PASSWORD))
            this._edTxt.type = "password";
        else
            this._edTxt.type = "text";
    },
    getText: function () {
        cc.log("Please use the getString");
        return this._edTxt.value;
    },
    getString: function () {
        if(this._edTxt.value === this._placeholderText)
            return "";
        return this._edTxt.value;
    },
    initWithSizeAndBackgroundSprite: function (size, normal9SpriteBg) {
        if (this.initWithBackgroundSprite(normal9SpriteBg)) {
            this._domInputSprite.x = 3;
            this._domInputSprite.y = 3;
            this.setZoomOnTouchDown(false);
            this.setPreferredSize(size);
            this.x = 0;
            this.y = 0;
            this._addTargetWithActionForControlEvent(this, this.touchDownAction, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
            return true;
        }
        return false;
    },
    setDelegate: function (delegate) {
        this._delegate = delegate;
    },
    getPlaceHolder: function () {
        return this._placeholderText;
    },
    setInputMode: function (inputMode) {
        this._editBoxInputMode = inputMode;
    },
    setReturnType: function (returnType) {
        this._keyboardReturnType = returnType;
    },
    keyboardWillShow: function (info) {
        var rectTracked = cc.EditBox.getRect(this);
        rectTracked.y -= 4;
        if (!rectTracked.intersectsRect(info.end)) {
            cc.log("needn't to adjust view layout.");
            return;
        }
        this._adjustHeight = info.end.getMaxY() - rectTracked.getMinY();
    },
    keyboardDidShow: function (info) {
    },
    keyboardWillHide: function (info) {
    },
    keyboardDidHide: function (info) {
    },
    touchDownAction: function (sender, controlEvent) {
    },
    initWithBackgroundColor: function (size, bgColor) {
        this._edWidth = size.width;
        this.dom.style.width = this._edWidth.toString() + "px";
        this._edHeight = size.height;
        this.dom.style.height = this._edHeight.toString() + "px";
        this.dom.style.backgroundColor = cc.colorToHex(bgColor);
    },
    cleanup : function () {
        this._edTxt.removeEventListener("input", this._inputEvent);
        this._edTxt.removeEventListener("keypress", this._keyPressEvent);
        this._edTxt.removeEventListener("focus", this._focusEvent);
        this._edTxt.removeEventListener("blur", this._blurEvent);
        cc._canvas.removeEventListener('click', this._onCanvasClick);
        this._super();
    }
});
var _p = cc.EditBox.prototype;
_p.font;
cc.defineGetterSetter(_p, "font", null, _p._setFont);
_p.fontName;
cc.defineGetterSetter(_p, "fontName", null, _p.setFontName);
_p.fontSize;
cc.defineGetterSetter(_p, "fontSize", null, _p.setFontSize);
_p.fontColor;
cc.defineGetterSetter(_p, "fontColor", null, _p.setFontColor);
_p.string;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
_p.maxLength;
cc.defineGetterSetter(_p, "maxLength", _p.getMaxLength, _p.setMaxLength);
_p.placeHolder;
cc.defineGetterSetter(_p, "placeHolder", _p.getPlaceHolder, _p.setPlaceHolder);
_p.placeHolderFont;
cc.defineGetterSetter(_p, "placeHolderFont", null, _p._setPlaceholderFont);
_p.placeHolderFontName;
cc.defineGetterSetter(_p, "placeHolderFontName", null, _p.setPlaceholderFontName);
_p.placeHolderFontSize;
cc.defineGetterSetter(_p, "placeHolderFontSize", null, _p.setPlaceholderFontSize);
_p.placeHolderFontColor;
cc.defineGetterSetter(_p, "placeHolderFontColor", null, _p.setPlaceholderFontColor);
_p.inputFlag;
cc.defineGetterSetter(_p, "inputFlag", null, _p.setInputFlag);
_p.delegate;
cc.defineGetterSetter(_p, "delegate", null, _p.setDelegate);
_p.inputMode;
cc.defineGetterSetter(_p, "inputMode", null, _p.setInputMode);
_p.returnType;
cc.defineGetterSetter(_p, "returnType", null, _p.setReturnType);
_p = null;
cc.EditBox.getRect = function (node) {
    var contentSize = node.getContentSize();
    var rect = cc.rect(0, 0, contentSize.width, contentSize.height);
    return cc.rectApplyAffineTransform(rect, node.getNodeToWorldTransform());
};
cc.EditBox.create = function (size, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg) {
    return new cc.EditBox(size, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg);
};

cc.ProtectedNode = cc.Node.extend({
    _protectedChildren: null,
    _reorderProtectedChildDirty: false,
    _insertProtectedChild: function(child, z){
        this._reorderProtectedChildDirty = true;
        this._protectedChildren.push(child);
        child._setLocalZOrder(z);
    },
    ctor: function(){
        cc.Node.prototype.ctor.call(this);
        this._protectedChildren = [];
    },
    addProtectedChild: function(child, localZOrder, tag){
         cc.assert(child != null, "child must be non-nil");
         cc.assert(!child.parent, "child already added. It can't be added again");
        localZOrder = localZOrder || child.getLocalZOrder();
        if(tag)
            child.setTag(tag);
        this._insertProtectedChild(child, localZOrder);
        child.setParent(this);
        child.setOrderOfArrival(cc.s_globalOrderOfArrival);
        if(this._running){
            child.onEnter();
            if(this._isTransitionFinished)
                child.onEnterTransitionDidFinish();
        }
        if(this._cascadeColorEnabled)
            this._renderCmd.setCascadeColorEnabledDirty();
        if (this._cascadeOpacityEnabled)
            this._renderCmd.setCascadeOpacityEnabledDirty();
    },
    getProtectedChildByTag: function(tag){
        cc.assert(tag !== cc.NODE_TAG_INVALID, "Invalid tag");
        var locChildren = this._protectedChildren;
        for(var i = 0, len = locChildren.length; i < len; i++)
            if(locChildren.getTag() === tag)
                return locChildren[i];
        return null;
    },
    removeProtectedChild: function(child,  cleanup){
        if(cleanup == null)
            cleanup = true;
         var locChildren = this._protectedChildren;
        if(locChildren.length === 0)
            return;
        var idx = locChildren.indexOf(child);
        if(idx > -1){
             if(this._running){
                 child.onExitTransitionDidStart();
                 child.onExit();
             }
            if (cleanup)
                child.cleanup();
            child.setParent(null);
            locChildren.splice(idx, 1);
        }
    },
    removeProtectedChildByTag: function(tag, cleanup){
        cc.assert( tag !== cc.NODE_TAG_INVALID, "Invalid tag");
        if(cleanup == null)
            cleanup = true;
        var child = this.getProtectedChildByTag(tag);
        if (child == null)
            cc.log("cocos2d: removeChildByTag(tag = %d): child not found!", tag);
        else
            this.removeProtectedChild(child, cleanup);
    },
    removeAllProtectedChildren: function(){
        this.removeAllProtectedChildrenWithCleanup(true);
    },
    removeAllProtectedChildrenWithCleanup: function(cleanup){
        if(cleanup == null)
            cleanup = true;
        var locChildren = this._protectedChildren;
        for (var i = 0, len = locChildren.length; i< len; i++) {
            var child = locChildren[i];
            if(this._running){
                child.onExitTransitionDidStart();
                child.onExit();
            }
            if (cleanup)
                child.cleanup();
            child.setParent(null);
        }
        locChildren.length = 0;
    },
    reorderProtectedChild: function(child, localZOrder){
        cc.assert( child != null, "Child must be non-nil");
        this._reorderProtectedChildDirty = true;
        child.setOrderOfArrival(cc.s_globalOrderOfArrival++);
        child._setLocalZOrder(localZOrder);
    },
    sortAllProtectedChildren: function(){
        if (this._reorderProtectedChildDirty) {
            var _children = this._protectedChildren;
            var len = _children.length, i, j, tmp;
            for(i=1; i<len; i++){
                tmp = _children[i];
                j = i - 1;
                while(j >= 0){
                    if(tmp._localZOrder < _children[j]._localZOrder){
                        _children[j+1] = _children[j];
                    }else if(tmp._localZOrder === _children[j]._localZOrder && tmp.arrivalOrder < _children[j].arrivalOrder){
                        _children[j+1] = _children[j];
                    }else
                        break;
                    j--;
                }
                _children[j+1] = tmp;
            }
            this._reorderProtectedChildDirty = false;
        }
    },
    _changePosition: function(){},
    cleanup: function(){
       cc.Node.prototype.cleanup.call(this);
       var locChildren = this._protectedChildren;
        for(var i = 0 , len = locChildren.length; i  < len; i++)
            locChildren[i].cleanup();
    },
    onEnter: function(){
        cc.Node.prototype.onEnter.call(this);
        var locChildren = this._protectedChildren;
        for(var i = 0, len = locChildren.length;i< len;i++)
            locChildren[i].onEnter();
    },
    onEnterTransitionDidFinish: function(){
        cc.Node.prototype.onEnterTransitionDidFinish.call(this);
        var locChildren = this._protectedChildren;
        for(var i = 0, len = locChildren.length;i< len;i++)
            locChildren[i].onEnterTransitionDidFinish();
    },
    onExit:function(){
        cc.Node.prototype.onExit.call(this);
        var locChildren = this._protectedChildren;
        for(var i = 0, len = locChildren.length;i< len;i++)
            locChildren[i].onExit();
    },
    onExitTransitionDidStart: function(){
        cc.Node.prototype.onExitTransitionDidStart.call(this);
        var locChildren = this._protectedChildren;
        for(var i = 0, len = locChildren.length;i< len;i++)
            locChildren[i].onExitTransitionDidStart();
    },
    _createRenderCmd: function(){
        if(cc._renderType === cc._RENDER_TYPE_CANVAS)
            return new cc.ProtectedNode.CanvasRenderCmd(this);
        else
            return new cc.ProtectedNode.WebGLRenderCmd(this);
    }
});
cc.ProtectedNode.create = function(){
    return new cc.ProtectedNode();
};
(function(){
    cc.ProtectedNode.RenderCmd = {
        _updateDisplayColor: function (parentColor) {
            var node = this._node;
            var locDispColor = this._displayedColor, locRealColor = node._realColor;
            var i, len, selChildren, item;
            if (this._cascadeColorEnabledDirty && !node._cascadeColorEnabled) {
                locDispColor.r = locRealColor.r;
                locDispColor.g = locRealColor.g;
                locDispColor.b = locRealColor.b;
                var whiteColor = new cc.Color(255, 255, 255, 255);
                selChildren = node._children;
                for (i = 0, len = selChildren.length; i < len; i++) {
                    item = selChildren[i];
                    if (item && item._renderCmd)
                        item._renderCmd._updateDisplayColor(whiteColor);
                }
                this._cascadeColorEnabledDirty = false;
            } else {
                if (parentColor === undefined) {
                    var locParent = node._parent;
                    if (locParent && locParent._cascadeColorEnabled)
                        parentColor = locParent.getDisplayedColor();
                    else
                        parentColor = cc.color.WHITE;
                }
                locDispColor.r = 0 | (locRealColor.r * parentColor.r / 255.0);
                locDispColor.g = 0 | (locRealColor.g * parentColor.g / 255.0);
                locDispColor.b = 0 | (locRealColor.b * parentColor.b / 255.0);
                if (node._cascadeColorEnabled) {
                    selChildren = node._children;
                    for (i = 0, len = selChildren.length; i < len; i++) {
                        item = selChildren[i];
                        if (item && item._renderCmd){
                            item._renderCmd._updateDisplayColor(locDispColor);
                            item._renderCmd._updateColor();
                        }
                    }
                }
                selChildren = node._protectedChildren;
                for(i = 0, len = selChildren.length;i < len; i++){
                    item = selChildren[i];
                    if(item && item._renderCmd){
                        item._renderCmd._updateDisplayColor(locDispColor);
                        item._renderCmd._updateColor();
                    }
                }
            }
            this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.colorDirty ^ this._dirtyFlag;
        },
        _updateDisplayOpacity: function (parentOpacity) {
            var node = this._node;
            var i, len, selChildren, item;
            if (this._cascadeOpacityEnabledDirty && !node._cascadeOpacityEnabled) {
                this._displayedOpacity = node._realOpacity;
                selChildren = node._children;
                for (i = 0, len = selChildren.length; i < len; i++) {
                    item = selChildren[i];
                    if (item && item._renderCmd)
                        item._renderCmd._updateDisplayOpacity(255);
                }
                this._cascadeOpacityEnabledDirty = false;
            } else {
                if (parentOpacity === undefined) {
                    var locParent = node._parent;
                    parentOpacity = 255;
                    if (locParent && locParent._cascadeOpacityEnabled)
                        parentOpacity = locParent.getDisplayedOpacity();
                }
                this._displayedOpacity = node._realOpacity * parentOpacity / 255.0;
                if (node._cascadeOpacityEnabled) {
                    selChildren = node._children;
                    for (i = 0, len = selChildren.length; i < len; i++) {
                        item = selChildren[i];
                        if (item && item._renderCmd){
                            item._renderCmd._updateDisplayOpacity(this._displayedOpacity);
                            item._renderCmd._updateColor();
                        }
                    }
                }
                selChildren = node._protectedChildren;
                for(i = 0, len = selChildren.length;i < len; i++){
                    item = selChildren[i];
                    if(item && item._renderCmd){
                        item._renderCmd._updateDisplayOpacity(this._displayedOpacity);
                        item._renderCmd._updateColor();
                    }
                }
            }
            this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.opacityDirty ^ this._dirtyFlag;
        },
        _changeProtectedChild: function (child) {
            var cmd = child._renderCmd,
                dirty = cmd._dirtyFlag,
                flags = cc.Node._dirtyFlags;
            if (this._dirtyFlag & flags.colorDirty)
                dirty |= flags.colorDirty;
            if (this._dirtyFlag & flags.opacityDirty)
                dirty |= flags.opacityDirty;
            var colorDirty = dirty & flags.colorDirty,
                opacityDirty = dirty & flags.opacityDirty;
            if (colorDirty)
                cmd._updateDisplayColor(this._displayedColor);
            if (opacityDirty)
                cmd._updateDisplayOpacity(this._displayedOpacity);
            if (colorDirty || opacityDirty)
                cmd._updateColor();
        }
    };
    cc.ProtectedNode.CanvasRenderCmd = function (renderable) {
        cc.Node.CanvasRenderCmd.call(this, renderable);
        this._cachedParent = null;
        this._cacheDirty = false;
    };
    var proto = cc.ProtectedNode.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    cc.inject(cc.ProtectedNode.RenderCmd, proto);
    proto.constructor = cc.ProtectedNode.CanvasRenderCmd;
    proto.visit = function(parentCmd){
        var node = this._node;
        if (!node._visible)
            return;
        var i, j;
        var children = node._children, child;
        var locChildren = node._children, locProtectedChildren = node._protectedChildren;
        var childLen = locChildren.length, pLen = locProtectedChildren.length;
        this._syncStatus(parentCmd);
        node.sortAllChildren();
        node.sortAllProtectedChildren();
        var pChild;
        for (i = 0; i < childLen; i++) {
            child = children[i];
            if (child._localZOrder < 0)
                child.visit(this);
            else
                break;
        }
        for (j = 0; j < pLen; j++) {
            pChild = locProtectedChildren[j];
            if (pChild && pChild._localZOrder < 0){
                this._changeProtectedChild(pChild);
                pChild.visit(this);
            }
            else
                break;
        }
        cc.renderer.pushRenderCommand(this);
        for (; i < childLen; i++)
            children[i] && children[i].visit(this);
        for (; j < pLen; j++){
            pChild = locProtectedChildren[j];
            if(!pChild) continue;
            this._changeProtectedChild(pChild);
            pChild.visit(this);
        }
        this._dirtyFlag = 0;
        this._cacheDirty = false;
    };
    proto.transform = function(parentCmd, recursive){
        var node = this._node;
        if(node._changePosition)
            node._changePosition();
        var t = node.getNodeToParentTransform(), worldT = this._worldTransform;
        if (parentCmd) {
            var pt = parentCmd._worldTransform;
            worldT.a = t.a * pt.a + t.b * pt.c;
            worldT.b = t.a * pt.b + t.b * pt.d;
            worldT.c = t.c * pt.a + t.d * pt.c;
            worldT.d = t.c * pt.b + t.d * pt.d;
            worldT.tx = pt.a * t.tx + pt.c * t.ty + pt.tx;
            worldT.ty = pt.d * t.ty + pt.ty + pt.b * t.tx;
        } else {
            worldT.a = t.a;
            worldT.b = t.b;
            worldT.c = t.c;
            worldT.d = t.d;
            worldT.tx = t.tx;
            worldT.ty = t.ty;
        }
        var i, len, locChildren = node._children;
        if(recursive && locChildren && locChildren.length !== 0){
            for(i = 0, len = locChildren.length; i< len; i++){
                locChildren[i]._renderCmd.transform(this, recursive);
            }
        }
        locChildren = node._protectedChildren;
        if(recursive && locChildren && locChildren.length !== 0){
            for(i = 0, len = locChildren.length; i< len; i++){
                locChildren[i]._renderCmd.transform(this, recursive);
            }
        }
    };
})();
(function(){
    if(!cc.Node.WebGLRenderCmd)
        return;
    cc.ProtectedNode.WebGLRenderCmd = function (renderable) {
        cc.Node.WebGLRenderCmd.call(this, renderable);
    };
    var proto = cc.ProtectedNode.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    cc.inject(cc.ProtectedNode.RenderCmd, proto);
    proto.constructor = cc.ProtectedNode.WebGLRenderCmd;
    proto.visit = function(parentCmd){
        var node = this._node;
        if (!node._visible)
            return;
        var  i, j, currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        this._syncStatus(parentCmd);
        currentStack.top = this._stackMatrix;
        var locGrid = node.grid;
        if (locGrid && locGrid._active)
            locGrid.beforeDraw();
        var locChildren = node._children, locProtectedChildren = node._protectedChildren;
        var childLen = locChildren.length, pLen = locProtectedChildren.length;
        node.sortAllChildren();
        node.sortAllProtectedChildren();
        var pChild;
        for (i = 0; i < childLen; i++) {
            if (locChildren[i] && locChildren[i]._localZOrder < 0)
                locChildren[i].visit(this);
            else
                break;
        }
        for(j = 0; j < pLen; j++){
            pChild = locProtectedChildren[j];
            if (pChild && pChild._localZOrder < 0){
                this._changeProtectedChild(pChild);
                pChild.visit(this);
            }else
                break;
        }
        cc.renderer.pushRenderCommand(this);
        for (; i < childLen; i++) {
            locChildren[i] && locChildren[i].visit(this);
        }
        for (; j < pLen; j++) {
            pChild = locProtectedChildren[j];
            if(!pChild) continue;
            this._changeProtectedChild(pChild);
            pChild.visit(this);
        }
        if (locGrid && locGrid._active)
            locGrid.afterDraw(node);
        this._dirtyFlag = 0;
        currentStack.top = currentStack.stack.pop();
    };
    proto.transform = function(parentCmd, recursive){
        var node = this._node;
        var t4x4 = this._transform4x4, stackMatrix = this._stackMatrix,
            parentMatrix = parentCmd ? parentCmd._stackMatrix : cc.current_stack.top;
        var trans = node.getNodeToParentTransform();
        if(node._changePosition)
            node._changePosition();
        this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.transformDirty ^ this._dirtyFlag;
        var t4x4Mat = t4x4.mat;
        t4x4Mat[0] = trans.a;
        t4x4Mat[4] = trans.c;
        t4x4Mat[12] = trans.tx;
        t4x4Mat[1] = trans.b;
        t4x4Mat[5] = trans.d;
        t4x4Mat[13] = trans.ty;
        t4x4Mat[14] = node._vertexZ;
        cc.kmMat4Multiply(stackMatrix, parentMatrix, t4x4);
        if (node._camera !== null && !(node.grid !== null && node.grid.isActive())) {
            var apx = this._anchorPointInPoints.x, apy = this._anchorPointInPoints.y;
            var translate = (apx !== 0.0 || apy !== 0.0);
            if (translate){
                if(!cc.SPRITEBATCHNODE_RENDER_SUBPIXEL) {
                    apx = 0 | apx;
                    apy = 0 | apy;
                }
                var translation = cc.math.Matrix4.createByTranslation(apx, apy, 0, t4x4);
                stackMatrix.multiply(translate);
                node._camera._locateForRenderer(stackMatrix);
                translation = cc.math.Matrix4.createByTranslation(-apx, -apy, 0, translation);
                stackMatrix.multiply(translation);
                t4x4.identity();
            } else {
                node._camera._locateForRenderer(stackMatrix);
            }
        }
        var i, len, locChildren = node._children;
        if(recursive && locChildren && locChildren.length !== 0){
            for(i = 0, len = locChildren.length; i< len; i++){
                locChildren[i]._renderCmd.transform(this, recursive);
            }
        }
        locChildren = node._protectedChildren;
        if(recursive && locChildren && locChildren.length !== 0){
            for(i = 0, len = locChildren.length; i< len; i++){
                locChildren[i]._renderCmd.transform(this, recursive);
            }
        }
    };
})();
var ccui = ccui || {};
ccui.Class = ccui.Class || cc.Class;
ccui.Class.extend = ccui.Class.extend || cc.Class.extend;
ccui.Node = ccui.Node || cc.Node;
ccui.Node.extend = ccui.Node.extend || cc.Node.extend;
ccui.ProtectedNode = ccui.ProtectedNode || cc.ProtectedNode;
ccui.ProtectedNode.extend = ccui.ProtectedNode.extend || cc.ProtectedNode.extend;
ccui.cocosGUIVersion = "CocosGUI v1.0.0.0";
ccui._FocusNavigationController = cc.Class.extend({
    _keyboardListener: null,
    _firstFocusedWidget: null,
    _enableFocusNavigation: false,
    _keyboardEventPriority: 1,
    enableFocusNavigation: function(flag){
        if (this._enableFocusNavigation === flag)
            return;
        this._enableFocusNavigation = flag;
        if (flag)
            this._addKeyboardEventListener();
        else
            this._removeKeyboardEventListener();
    },
    _setFirstFocsuedWidget: function(widget){
        this._firstFocusedWidget = widget;
    },
    _onKeyPressed: function(keyCode, event){
        if (this._enableFocusNavigation && this._firstFocusedWidget) {
            if (keyCode === cc.KEY.dpadDown) {
                this._firstFocusedWidget = this._firstFocusedWidget.findNextFocusedWidget(ccui.Widget.DOWN, this._firstFocusedWidget);
            }
            if (keyCode === cc.KEY.dpadUp){
                this._firstFocusedWidget = this._firstFocusedWidget.findNextFocusedWidget(ccui.Widget.UP, this._firstFocusedWidget);
            }
            if (keyCode === cc.KEY.dpadLeft) {
                this._firstFocusedWidget = this._firstFocusedWidget.findNextFocusedWidget(ccui.Widget.LEFT, this._firstFocusedWidget);
            }
            if (keyCode === cc.KEY.dpadRight) {
                this._firstFocusedWidget = this._firstFocusedWidget.findNextFocusedWidget(ccui.Widget.RIGHT, this._firstFocusedWidget);
            }
        }
    },
    _addKeyboardEventListener: function(){
        if (!this._keyboardListener) {
            this._keyboardListener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: this._onKeyPressed.bind(this)
            });
            cc.eventManager.addListener(this._keyboardListener, this._keyboardEventPriority);
        }
    },
    _removeKeyboardEventListener: function(){
        if (this._keyboardListener) {
            cc.eventManager.removeEventListener(this._keyboardListener);
            this._keyboardListener = null;
        }
    }
});
ccui.__LAYOUT_COMPONENT_NAME = "__ui_layout";
ccui.Widget = ccui.ProtectedNode.extend({
    _enabled: true,
    _bright: true,
    _touchEnabled: false,
    _brightStyle: null,
    _touchBeganPosition: null,
    _touchMovePosition: null,
    _touchEndPosition: null,
    _touchEventListener: null,
    _touchEventSelector: null,
    _name: "default",
    _widgetType: null,
    _actionTag: 0,
    _customSize: null,
    _layoutParameterDictionary: null,
    _layoutParameterType:0,
    _focused: false,
    _focusEnabled: true,
    _ignoreSize: false,
    _affectByClipping: false,
    _sizeType: null,
    _sizePercent: null,
    _positionType: null,
    _positionPercent: null,
    _hit: false,
    _nodes: null,
    _touchListener: null,
    _className: "Widget",
    _flippedX: false,
    _flippedY: false,
    _opacity: 255,
    _highlight: false,
    _touchEventCallback: null,
    _clickEventListener: null,
    _propagateTouchEvents: true,
    _unifySize: false,
    _callbackName: null,
    _callbackType: null,
    _usingLayoutComponent: false,
    ctor: function () {
        cc.ProtectedNode.prototype.ctor.call(this);
        this._brightStyle = ccui.Widget.BRIGHT_STYLE_NONE;
        this._touchBeganPosition = cc.p(0, 0);
        this._touchMovePosition = cc.p(0, 0);
        this._touchEndPosition = cc.p(0, 0);
        this._widgetType = ccui.Widget.TYPE_WIDGET;
        this._customSize = cc.size(0, 0);
        this._layoutParameterDictionary = {};
        this._sizeType = ccui.Widget.SIZE_ABSOLUTE;
        this._sizePercent = cc.p(0, 0);
        this._positionType = ccui.Widget.POSITION_ABSOLUTE;
        this._positionPercent = cc.p(0, 0);
        this._nodes = [];
        this._layoutParameterType = ccui.LayoutParameter.NONE;
        this.init();
    },
    /**
     * initializes state of widget. please do not call this function by yourself, you should pass the parameters to constructor to initialize it .
     * @returns {boolean}
     */
    init: function () {
        if (cc.ProtectedNode.prototype.init.call(this)) {
            this._layoutParameterDictionary = {};
            this._initRenderer();
            this.setBright(true);
            this.onFocusChanged = this.onFocusChange.bind(this);
            this.onNextFocusedWidget = null;
            this.setAnchorPoint(cc.p(0.5, 0.5));
            this.ignoreContentAdaptWithSize(true);
            return true;
        }
        return false;
    },
    onEnter: function () {
        var locListener = this._touchListener;
        if (locListener && !locListener._isRegistered() && this._touchEnabled)
            cc.eventManager.addListener(locListener, this);
        if(!this._usingLayoutComponent)
            this.updateSizeAndPosition();
        cc.ProtectedNode.prototype.onEnter.call(this);
    },
    onExit: function(){
        this.unscheduleUpdate();
        cc.ProtectedNode.prototype.onExit.call(this);
    },
    _getOrCreateLayoutComponent: function(){
        var layoutComponent = this.getComponent(ccui.__LAYOUT_COMPONENT_NAME);
        if (null == layoutComponent){
            layoutComponent = new ccui.LayoutComponent();
            this.addComponent(layoutComponent);
        }
        return layoutComponent;
    },
    getWidgetParent: function () {
        var widget = this.getParent();
        if (widget instanceof ccui.Widget)
            return widget;
        return null;
    },
    _updateContentSizeWithTextureSize: function(size){
        if(this._unifySize){
            this.setContentSize(size);
            return;
        }
        this.setContentSize(this._ignoreSize ? size : this._customSize);
    },
    _isAncestorsEnabled: function(){
        var parentWidget = this._getAncensterWidget(this);
        if (parentWidget == null)
            return true;
        if (parentWidget && !parentWidget.isEnabled())
            return false;
        return parentWidget._isAncestorsEnabled();
    },
    setPropagateTouchEvents: function(isPropagate){
        this._propagateTouchEvents = isPropagate;
    },
    isPropagateTouchEvents: function(){
        return this._propagateTouchEvents;
    },
    setSwallowTouches: function(swallow){
        if (this._touchListener)
            this._touchListener.setSwallowTouches(swallow);
    },
    isSwallowTouches: function(){
        if (this._touchListener){
            return this._touchListener.isSwallowTouches();
        }
        return false;
    },
    _getAncensterWidget: function(node){
        if (null == node)
            return null;
        var parent = node.getParent();
        if (null == parent)
            return null;
        if (parent instanceof ccui.Widget)
            return parent;
        else
            return this._getAncensterWidget(parent.getParent());
    },
    _isAncestorsVisible: function(node){
        if (null == node)
            return true;
        var parent = node.getParent();
        if (parent && !parent.isVisible())
            return false;
        return this._isAncestorsVisible(parent);
    },
    _cleanupWidget: function(){
        this._eventDispatcher.removeEventListener(this._touchListener);
        this._touchEnabled = false;
        this._touchListener = null;
        if (ccui.Widget._focusedWidget === this){
            ccui.Widget._focusedWidget = null;
            ccui.Widget._focusNavigationController = null;
        }
    },
    setEnabled: function (enabled) {
        this._enabled = enabled;
    },
    _initRenderer: function () {},
    setContentSize: function(contentSize, height){
        var locWidth = (height === undefined) ? contentSize.width : contentSize;
        var locHeight = (height === undefined) ? contentSize.height : height;
        cc.Node.prototype.setContentSize.call(this, locWidth, locHeight);
        this._customSize.width = locWidth;
        this._customSize.height = locHeight;
        if(this._unifySize){
        } else if (this._ignoreSize){
            this._contentSize = this.getVirtualRendererSize();
        }
        if (!this._usingLayoutComponent && this._running) {
            var widgetParent = this.getWidgetParent();
            var pSize = widgetParent ? widgetParent.getContentSize() : this._parent.getContentSize();
            this._sizePercent.x = (pSize.width > 0.0) ? locWidth / pSize.width : 0.0;
            this._sizePercent.y = (pSize.height > 0.0) ? locHeight / pSize.height : 0.0;
        }
        this._onSizeChanged();
    },
    _setWidth: function (w) {
        cc.Node.prototype._setWidth.call(this, w);
        this._customSize.width = w;
        if(this._unifySize){
        } else if (this._ignoreSize){
            this._contentSize = this.getVirtualRendererSize();
        }
        if (!this._usingLayoutComponent && this._running) {
            var widgetParent = this.getWidgetParent();
            var locWidth = widgetParent ? widgetParent.width : this._parent.width;
            this._sizePercent.x = locWidth > 0 ? this._customSize.width / locWidth : 0;
        }
        this._onSizeChanged();
    },
    _setHeight: function (h) {
        cc.Node.prototype._setHeight.call(this, h);
        this._customSize.height = h;
        if(this._unifySize){
        } else if (this._ignoreSize){
            this._contentSize = this.getVirtualRendererSize();
        }
        if (!this._usingLayoutComponent && this._running) {
            var widgetParent = this.getWidgetParent();
            var locH = widgetParent ? widgetParent.height : this._parent.height;
            this._sizePercent.y = locH > 0 ? this._customSize.height / locH : 0;
        }
        this._onSizeChanged();
    },
    setSizePercent: function (percent) {
        if(this._usingLayoutComponent){
            var component = this._getOrCreateLayoutComponent();
            component.setUsingPercentContentSize(true);
            component.setPercentContentSize(percent);
            component.refreshLayout();
            return;
        }
        this._sizePercent.x = percent.x;
        this._sizePercent.y = percent.y;
        var width = this._customSize.width, height = this._customSize.height;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                width = widgetParent.width * percent.x;
                height = widgetParent.height * percent.y;
            } else {
                width = this._parent.width * percent.x;
                height = this._parent.height * percent.y;
            }
        }
        if (this._ignoreSize)
            this.setContentSize(this.getVirtualRendererSize());
        else
            this.setContentSize(width, height);
        this._customSize.width = width;
        this._customSize.height = height;
    },
    _setWidthPercent: function (percent) {
        this._sizePercent.x = percent;
        var width = this._customSize.width;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            width = (widgetParent ? widgetParent.width : this._parent.width) * percent;
        }
        if (this._ignoreSize)
            this._setWidth(this.getVirtualRendererSize().width);
        else
            this._setWidth(width);
        this._customSize.width = width;
    },
    _setHeightPercent: function (percent) {
        this._sizePercent.y = percent;
        var height = this._customSize.height;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            height = (widgetParent ? widgetParent.height : this._parent.height) * percent;
        }
        if (this._ignoreSize)
            this._setHeight(this.getVirtualRendererSize().height);
        else
            this._setHeight(height);
        this._customSize.height = height;
    },
    updateSizeAndPosition: function (parentSize) {
        if(!parentSize){
            var widgetParent = this.getWidgetParent();
            if(widgetParent)
                parentSize = widgetParent.getLayoutSize();
            else
                parentSize = this._parent.getContentSize();
        }
        switch (this._sizeType) {
            case ccui.Widget.SIZE_ABSOLUTE:
                if(this._ignoreSize)
                    this.setContentSize(this.getVirtualRendererSize());
                else
                    this.setContentSize(this._customSize);
                this._sizePercent.x = (parentSize.width > 0) ? this._customSize.width / parentSize.width : 0;
                this._sizePercent.y = (parentSize.height > 0) ? this._customSize.height / parentSize.height : 0;
                break;
            case ccui.Widget.SIZE_PERCENT:
                var cSize = cc.size(parentSize.width * this._sizePercent.x , parentSize.height * this._sizePercent.y);
                if(this._ignoreSize)
                    this.setContentSize(this.getVirtualRendererSize());
                else
                    this.setContentSize(cSize);
                this._customSize.width = cSize.width;
                this._customSize.height = cSize.height;
                break;
            default:
                break;
        }
        this._onSizeChanged();
        var absPos = this.getPosition();
        switch (this._positionType) {
            case ccui.Widget.POSITION_ABSOLUTE:
                if (parentSize.width <= 0 || parentSize.height <= 0) {
                    this._positionPercent.x = this._positionPercent.y = 0;
                } else {
                    this._positionPercent.x = absPos.x / parentSize.width;
                    this._positionPercent.y = absPos.y / parentSize.height;
                }
                break;
            case ccui.Widget.POSITION_PERCENT:
                absPos = cc.p(parentSize.width * this._positionPercent.x, parentSize.height * this._positionPercent.y);
                break;
            default:
                break;
        }
        if(this._parent instanceof ccui.ImageView){
            var renderer = this._parent._imageRenderer;
            if(renderer && !renderer._textureLoaded)
                return;
        }
        this.setPosition(absPos);
    },
    setSizeType: function (type) {
        this._sizeType = type;
        if (this._usingLayoutComponent) {
            var component = this._getOrCreateLayoutComponent();
            component.setUsingPercentContentSize(this._sizeType === ccui.SIZE_PERCENT);
        }
    },
    getSizeType: function () {
        return this._sizeType;
    },
    ignoreContentAdaptWithSize: function (ignore) {
        if(this._unifySize){
            this.setContentSize(this._customSize);
            return;
        }
        if(this._ignoreSize === ignore)
            return;
        this._ignoreSize = ignore;
        this.setContentSize( ignore ? this.getVirtualRendererSize() : this._customSize );
    },
    isIgnoreContentAdaptWithSize: function () {
        return this._ignoreSize;
    },
    getCustomSize: function () {
        return cc.size(this._customSize);
    },
    getLayoutSize: function(){
        return cc.size(this._contentSize);
    },
    getSizePercent: function () {
        if(this._usingLayoutComponent){
            var component = this._getOrCreateLayoutComponent();
            this._sizePercent = component.getPercentContentSize();
        }
        return this._sizePercent;
    },
    _getWidthPercent: function () {
        return this._sizePercent.x;
    },
    _getHeightPercent: function () {
        return this._sizePercent.y;
    },
    getWorldPosition: function () {
        return this.convertToWorldSpace(cc.p(this._anchorPoint.x * this._contentSize.width, this._anchorPoint.y * this._contentSize.height));
    },
    getVirtualRenderer: function () {
        return this;
    },
    getVirtualRendererSize:function(){
        return cc.size(this._contentSize);
    },
    _onSizeChanged: function () {
        if(!this._usingLayoutComponent){
            var locChildren =  this.getChildren();
            for (var i = 0, len = locChildren.length; i < len; i++) {
                var child = locChildren[i];
                if(child instanceof ccui.Widget)
                    child.updateSizeAndPosition();
            }
        }
    },
    setTouchEnabled: function (enable) {
        if (this._touchEnabled === enable)
            return;
        this._touchEnabled = enable;
        if (this._touchEnabled) {
            if(!this._touchListener)
                this._touchListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan.bind(this),
                    onTouchMoved: this.onTouchMoved.bind(this),
                    onTouchEnded: this.onTouchEnded.bind(this)
                });
            cc.eventManager.addListener(this._touchListener, this);
        } else {
            cc.eventManager.removeListener(this._touchListener);
        }
    },
    isTouchEnabled: function () {
        return this._touchEnabled;
    },
    isHighlighted: function(){
        return this._highlight;
    },
    setHighlighted:function(highlight){
        if (highlight === this._highlight)
            return;
        this._highlight = highlight;
        if (this._bright) {
            if (this._highlight)
                this.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            else
                this.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
        } else
            this._onPressStateChangedToDisabled();
    },
    isFocused: function () {
        return this._focused;
    },
    setFocused: function (focus) {
        this._focused = focus;
        if (focus){
            ccui.Widget._focusedWidget = this;
            if(ccui.Widget._focusNavigationController)
                ccui.Widget._focusNavigationController._setFirstFocsuedWidget(this);
        }
    },
    isFocusEnabled: function(){
        return this._focusEnabled;
    },
    setFocusEnabled: function(enable){
        this._focusEnabled = enable;
    },
    findNextFocusedWidget: function( direction, current){
        if (null === this.onNextFocusedWidget || null == this.onNextFocusedWidget(direction) ) {
            var isLayout = current instanceof ccui.Layout;
            if (this.isFocused() || isLayout) {
                var layout = this.getParent();
                if (null === layout || !(layout instanceof ccui.Layout)){
                    if (isLayout)
                        return current.findNextFocusedWidget(direction, current);
                    return current;
                } else
                    return layout.findNextFocusedWidget(direction, current);
            } else
                return current;
        } else {
            var getFocusWidget = this.onNextFocusedWidget(direction);
            this.dispatchFocusEvent(this, getFocusWidget);
            return getFocusWidget;
        }
    },
    requestFocus: function(){
        if (this === ccui.Widget._focusedWidget)
            return;
        this.dispatchFocusEvent(ccui.Widget._focusedWidget, this);
    },
    getCurrentFocusedWidget: function(){
        return ccui.Widget._focusedWidget;
    },
    onFocusChanged: null,
    onNextFocusedWidget: null,
    interceptTouchEvent: function(eventType, sender, touch){
        var widgetParent = this.getWidgetParent();
        if (widgetParent)
            widgetParent.interceptTouchEvent(eventType,sender,touch);
    },
    onFocusChange: function(widgetLostFocus, widgetGetFocus){
        if (widgetLostFocus)
            widgetLostFocus.setFocused(false);
        if (widgetGetFocus)
            widgetGetFocus.setFocused(true);
    },
    dispatchFocusEvent: function(widgetLostFocus, widgetGetFocus){
        if (widgetLostFocus && !widgetLostFocus.isFocused())
            widgetLostFocus = ccui.Widget._focusedWidget;
        if (widgetGetFocus !== widgetLostFocus){
            if (widgetGetFocus && widgetGetFocus.onFocusChanged)
                widgetGetFocus.onFocusChanged(widgetLostFocus, widgetGetFocus);
            if (widgetLostFocus && widgetGetFocus.onFocusChanged)
                widgetLostFocus.onFocusChanged(widgetLostFocus, widgetGetFocus);
            cc.eventManager.dispatchEvent(new cc.EventFocus(widgetLostFocus, widgetGetFocus));
        }
    },
    setBright: function (bright) {
        this._bright = bright;
        if (this._bright) {
            this._brightStyle = ccui.Widget.BRIGHT_STYLE_NONE;
            this.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
        } else
            this._onPressStateChangedToDisabled();
    },
    setBrightStyle: function (style) {
        if (this._brightStyle === style)
            return;
        style = style || ccui.Widget.BRIGHT_STYLE_NORMAL;
        this._brightStyle = style;
        switch (this._brightStyle) {
            case ccui.Widget.BRIGHT_STYLE_NORMAL:
                this._onPressStateChangedToNormal();
                break;
            case ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT:
                this._onPressStateChangedToPressed();
                break;
            default:
                break;
        }
    },
    _onPressStateChangedToNormal: function () {},
    _onPressStateChangedToPressed: function () {},
    _onPressStateChangedToDisabled: function () {},
    _updateChildrenDisplayedRGBA: function(){
        this.setColor(this.getColor());
        this.setOpacity(this.getOpacity());
    },
    didNotSelectSelf: function () {},
    onTouchBegan: function (touch, event) {
        this._hit = false;
        if (this.isVisible() && this.isEnabled() && this._isAncestorsEnabled() && this._isAncestorsVisible(this) ){
            var touchPoint = touch.getLocation();
            this._touchBeganPosition.x = touchPoint.x;
            this._touchBeganPosition.y = touchPoint.y;
            if(this.hitTest(this._touchBeganPosition) && this.isClippingParentContainsPoint(this._touchBeganPosition))
                this._hit = true;
        }
        if (!this._hit) {
            return false;
        }
        this.setHighlighted(true);
        if (this._propagateTouchEvents) {
            this.propagateTouchEvent(ccui.Widget.TOUCH_BEGAN, this, touch);
        }
        this._pushDownEvent();
        return true;
    },
    propagateTouchEvent: function(event, sender, touch){
        var widgetParent = this.getWidgetParent();
        if (widgetParent){
            widgetParent.interceptTouchEvent(event, sender, touch);
        }
    },
    onTouchMoved: function (touch, event) {
        var touchPoint = touch.getLocation();
        this._touchMovePosition.x = touchPoint.x;
        this._touchMovePosition.y = touchPoint.y;
        this.setHighlighted(this.hitTest(touchPoint));
        if (this._propagateTouchEvents)
            this.propagateTouchEvent(ccui.Widget.TOUCH_MOVED, this, touch);
        this._moveEvent();
    },
    onTouchEnded: function (touch, event) {
        var touchPoint = touch.getLocation();
        this._touchEndPosition.x = touchPoint.x;
        this._touchEndPosition.y = touchPoint.y;
        if (this._propagateTouchEvents)
            this.propagateTouchEvent(ccui.Widget.TOUCH_ENDED, this, touch);
        var highlight = this._highlight;
        this.setHighlighted(false);
        if (highlight)
            this._releaseUpEvent();
        else
            this._cancelUpEvent();
    },
    onTouchCancelled: function (touchPoint) {
        this.setHighlighted(false);
        this._cancelUpEvent();
    },
    onTouchLongClicked: function (touchPoint) {
        this.longClickEvent();
    },
    _pushDownEvent: function () {
        if (this._touchEventCallback)
            this._touchEventCallback(this, ccui.Widget.TOUCH_BEGAN);
        if (this._touchEventListener && this._touchEventSelector)
            this._touchEventSelector.call(this._touchEventListener, this, ccui.Widget.TOUCH_BEGAN);
    },
    _moveEvent: function () {
        if (this._touchEventCallback)
            this._touchEventCallback(this, ccui.Widget.TOUCH_MOVED);
        if (this._touchEventListener && this._touchEventSelector)
            this._touchEventSelector.call(this._touchEventListener, this, ccui.Widget.TOUCH_MOVED);
    },
    _releaseUpEvent: function () {
        if (this._touchEventCallback)
            this._touchEventCallback(this, ccui.Widget.TOUCH_ENDED);
        if (this._touchEventListener && this._touchEventSelector)
            this._touchEventSelector.call(this._touchEventListener, this, ccui.Widget.TOUCH_ENDED);
        if (this._clickEventListener)
            this._clickEventListener(this);
    },
    _cancelUpEvent: function () {
        if (this._touchEventCallback)
            this._touchEventCallback(this, ccui.Widget.TOUCH_CANCELED);
        if (this._touchEventListener && this._touchEventSelector)
            this._touchEventSelector.call(this._touchEventListener, this, ccui.Widget.TOUCH_CANCELED);
    },
    longClickEvent: function () {
    },
    addTouchEventListener: function (selector, target) {
        if(target === undefined)
            this._touchEventCallback = selector;
        else {
            this._touchEventSelector = selector;
            this._touchEventListener = target;
        }
    },
    addClickEventListener: function(callback){
        this._clickEventListener = callback;
    },
    hitTest: function (pt) {
        var bb = cc.rect(0,0, this._contentSize.width, this._contentSize.height);
        return cc.rectContainsPoint(bb, this.convertToNodeSpace(pt));
    },
    isClippingParentContainsPoint: function(pt){
        this._affectByClipping = false;
        var parent = this.getParent();
        var clippingParent = null;
        while (parent) {
            if (parent instanceof ccui.Layout) {
                if (parent.isClippingEnabled()) {
                    this._affectByClipping = true;
                    clippingParent = parent;
                    break;
                }
            }
            parent = parent.getParent();
        }
        if (!this._affectByClipping)
            return true;
        if (clippingParent) {
            if (clippingParent.hitTest(pt))
                return clippingParent.isClippingParentContainsPoint(pt);
            return false;
        }
        return true;
    },
    checkChildInfo: function (handleState, sender, touchPoint) {
        var widgetParent = this.getWidgetParent();
        if (widgetParent)
            widgetParent.checkChildInfo(handleState, sender, touchPoint);
    },
    setPosition: function (pos, posY) {
        if (!this._usingLayoutComponent && this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                var pSize = widgetParent.getContentSize();
                if (pSize.width <= 0 || pSize.height <= 0) {
                    this._positionPercent.x = 0;
                    this._positionPercent.y = 0;
                } else {
                    if (posY === undefined) {
                        this._positionPercent.x = pos.x / pSize.width;
                        this._positionPercent.y = pos.y / pSize.height;
                    } else {
                        this._positionPercent.x = pos / pSize.width;
                        this._positionPercent.y = posY / pSize.height;
                    }
                }
            }
        }
        cc.Node.prototype.setPosition.call(this, pos, posY);
    },
    setPositionX: function (x) {
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                var pw = widgetParent.width;
                if (pw <= 0)
                    this._positionPercent.x = 0;
                else
                    this._positionPercent.x = x / pw;
            }
        }
        cc.Node.prototype.setPositionX.call(this, x);
    },
    setPositionY: function (y) {
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                var ph = widgetParent.height;
                if (ph <= 0)
                    this._positionPercent.y = 0;
                else
                    this._positionPercent.y = y / ph;
            }
        }
        cc.Node.prototype.setPositionY.call(this, y);
    },
    setPositionPercent: function (percent) {
        if (this._usingLayoutComponent){
            var component = this._getOrCreateLayoutComponent();
            component.setPositionPercentX(percent.x);
            component.setPositionPercentY(percent.y);
            component.refreshLayout();
            return;
        }else{
            this._setXPercent(percent.x);
            this._setYPercent(percent.y);
        }
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
    },
    _setXPercent: function (percent) {
        if (this._usingLayoutComponent){
            var component = this._getOrCreateLayoutComponent();
            component.setPositionPercentX(percent.x);
            component.refreshLayout();
            return;
        }
        this._positionPercent.x = percent;
    },
    _setYPercent: function (percent) {
        if (this._usingLayoutComponent){
            var component = this._getOrCreateLayoutComponent();
            component.setPositionPercentY(percent.x);
            component.refreshLayout();
            return;
        }
        this._positionPercent.y = percent;
    },
    getPositionPercent: function () {
        if (this._usingLayoutComponent) {
            var component = this._getOrCreateLayoutComponent();
            this._positionPercent.x = component.getPositionPercentX();
            this._positionPercent.y = component.getPositionPercentY();
        }
        return cc.p(this._positionPercent);
    },
    _getXPercent: function () {
        if (this._usingLayoutComponent) {
            var component = this._getOrCreateLayoutComponent();
            this._positionPercent.x = component.getPositionPercentX();
            this._positionPercent.y = component.getPositionPercentY();
        }
        return this._positionPercent.x;
    },
    _getYPercent: function () {
        if (this._usingLayoutComponent) {
            var component = this._getOrCreateLayoutComponent();
            this._positionPercent.x = component.getPositionPercentX();
            this._positionPercent.y = component.getPositionPercentY();
        }
        return this._positionPercent.y;
    },
    setPositionType: function (type) {
        this._positionType = type;
        if(this._usingLayoutComponent){
            var component = this._getOrCreateLayoutComponent();
            if (type === ccui.POSITION_ABSOLUTE){
                component.setPositionPercentXEnabled(false);
                component.setPositionPercentYEnabled(false);
            } else {
                component.setPositionPercentXEnabled(true);
                component.setPositionPercentYEnabled(true);
            }
        }
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
    },
    getPositionType: function () {
        return this._positionType;
    },
    setFlippedX: function (flipX) {
        var realScale = this.getScaleX();
        this._flippedX = flipX;
        this.setScaleX(realScale);
    },
    isFlippedX: function () {
        return this._flippedX;
    },
    setFlippedY: function (flipY) {
        var realScale = this.getScaleY();
        this._flippedY = flipY;
        this.setScaleY(realScale);
    },
    isFlippedY: function () {
        return this._flippedY;
    },
    _adaptRenderers: function(){},
    isBright: function () {
        return this._bright;
    },
    isEnabled: function () {
        return this._enabled;
    },
    getLeftBoundary: function () {
        return this.getPositionX() - this._getAnchorX() * this._contentSize.width;
    },
    getBottomBoundary: function () {
        return this.getPositionY() - this._getAnchorY() * this._contentSize.height;
    },
    getRightBoundary: function () {
        return this.getLeftBoundary() + this._contentSize.width;
    },
    getTopBoundary: function () {
        return this.getBottomBoundary() + this._contentSize.height;
    },
    getTouchBeganPosition: function(){
         return cc.p(this._touchBeganPosition);
    },
    getTouchMovePosition: function(){
        return cc.p(this._touchMovePosition);
    },
    getTouchEndPosition:function(){
        return cc.p(this._touchEndPosition);
    },
    getWidgetType: function () {
        return this._widgetType;
    },
    setLayoutParameter: function (parameter) {
        if(!parameter)
            return;
        this._layoutParameterDictionary[parameter.getLayoutType()] = parameter;
        this._layoutParameterType = parameter.getLayoutType();
    },
    getLayoutParameter: function (type) {
        type = type || this._layoutParameterType;
        return this._layoutParameterDictionary[type];
    },
    getDescription: function () {
        return "Widget";
    },
    clone: function () {
        var clonedWidget = this._createCloneInstance();
        clonedWidget._copyProperties(this);
        clonedWidget._copyClonedWidgetChildren(this);
        return clonedWidget;
    },
    _createCloneInstance: function () {
        return new ccui.Widget();
    },
    _copyClonedWidgetChildren: function (model) {
        var widgetChildren = model.getChildren();
        for (var i = 0; i < widgetChildren.length; i++) {
            var locChild = widgetChildren[i];
            if (locChild instanceof ccui.Widget)
                this.addChild(locChild.clone());
        }
    },
    _copySpecialProperties: function (model) {},
    _copyProperties: function (widget) {
        this.setEnabled(widget.isEnabled());
        this.setVisible(widget.isVisible());
        this.setBright(widget.isBright());
        this.setTouchEnabled(widget.isTouchEnabled());
        this.setLocalZOrder(widget.getLocalZOrder());
        this.setTag(widget.getTag());
        this.setName(widget.getName());
        this.setActionTag(widget.getActionTag());
        this._ignoreSize = widget._ignoreSize;
        this.setContentSize(widget._contentSize);
        this._customSize.width = widget._customSize.width;
        this._customSize.height = widget._customSize.height;
        this._copySpecialProperties(widget);
        this._sizeType = widget.getSizeType();
        this._sizePercent.x = widget._sizePercent.x;
        this._sizePercent.y = widget._sizePercent.y;
        this._positionType = widget._positionType;
        this._positionPercent.x = widget._positionPercent.x;
        this._positionPercent.y = widget._positionPercent.y;
        this.setPosition(widget.getPosition());
        this.setAnchorPoint(widget.getAnchorPoint());
        this.setScaleX(widget.getScaleX());
        this.setScaleY(widget.getScaleY());
        this.setRotation(widget.getRotation());
        this.setRotationX(widget.getRotationX());
        this.setRotationY(widget.getRotationY());
        this.setFlippedX(widget.isFlippedX());
        this.setFlippedY(widget.isFlippedY());
        this.setColor(widget.getColor());
        this.setOpacity(widget.getOpacity());
        this._touchEventCallback = widget._touchEventCallback;
        this._touchEventListener = widget._touchEventListener;
        this._touchEventSelector = widget._touchEventSelector;
        this._clickEventListener = widget._clickEventListener;
        this._focused = widget._focused;
        this._focusEnabled = widget._focusEnabled;
        this._propagateTouchEvents = widget._propagateTouchEvents;
        for (var key in widget._layoutParameterDictionary) {
            var parameter = widget._layoutParameterDictionary[key];
            if (parameter)
                this.setLayoutParameter(parameter.clone());
        }
        this._onSizeChanged();
    },
    setActionTag: function (tag) {
        this._actionTag = tag;
    },
    getActionTag: function () {
        return this._actionTag;
    },
    getLeftInParent: function(){
        cc.log("getLeftInParent is deprecated. Please use getLeftBoundary instead.");
        return this.getLeftBoundary();
    },
    getBottomInParent: function(){
        cc.log("getBottomInParent is deprecated. Please use getBottomBoundary instead.");
        return this.getBottomBoundary();
    },
    getRightInParent: function(){
        cc.log("getRightInParent is deprecated. Please use getRightBoundary instead.");
        return this.getRightBoundary();
    },
    getTopInParent: function(){
        cc.log("getTopInParent is deprecated. Please use getTopBoundary instead.");
        return this.getTopBoundary();
    },
    getTouchEndPos: function () {
        cc.log("getTouchEndPos is deprecated. Please use getTouchEndPosition instead.");
        return this.getTouchEndPosition();
    },
    getTouchMovePos: function () {
        cc.log("getTouchMovePos is deprecated. Please use getTouchMovePosition instead.");
        return this.getTouchMovePosition();
    },
    clippingParentAreaContainPoint: function (pt) {
        cc.log("clippingParentAreaContainPoint is deprecated. Please use isClippingParentContainsPoint instead.");
        this.isClippingParentContainsPoint(pt);
    },
    getTouchStartPos: function () {
        cc.log("getTouchStartPos is deprecated. Please use getTouchBeganPosition instead.");
        return this.getTouchBeganPosition();
    },
    setSize: function (size) {
        this.setContentSize(size);
    },
    getSize: function () {
        return this.getContentSize();
    },
    addNode: function (node, zOrder, tag) {
        if (node instanceof ccui.Widget) {
            cc.log("Please use addChild to add a Widget.");
            return;
        }
        cc.Node.prototype.addChild.call(this, node, zOrder, tag);
        this._nodes.push(node);
    },
    getNodeByTag: function (tag) {
        var _nodes = this._nodes;
        for (var i = 0; i < _nodes.length; i++) {
            var node = _nodes[i];
            if (node && node.getTag() === tag) {
                return node;
            }
        }
        return null;
    },
    getNodes: function () {
        return this._nodes;
    },
    removeNode: function (node, cleanup) {
        cc.Node.prototype.removeChild.call(this, node, cleanup);
        cc.arrayRemoveObject(this._nodes, node);
    },
    removeNodeByTag: function (tag, cleanup) {
        var node = this.getChildByTag(tag);
        if (!node)
            cc.log("cocos2d: removeNodeByTag(tag = %d): child not found!", tag);
        else
            this.removeChild(node, cleanup);
    },
    removeAllNodes: function () {
        for (var i = 0; i < this._nodes.length; i++) {
            var node = this._nodes[i];
            cc.Node.prototype.removeChild.call(this, node);
        }
        this._nodes.length = 0;
    },
    _findLayout: function(){
        cc.renderer.childrenOrderDirty = true;
        var layout = this._parent;
        while(layout){
            if(layout._doLayout){
                layout._doLayoutDirty = true;
                break;
            }else
                layout = layout._parent;
        }
    },
    isUnifySizeEnabled: function(){
        return this._unifySize;
    },
    setUnifySizeEnabled: function(enable){
        this._unifySize = enable;
    },
    _ccEventCallback: null,
    addCCSEventListener: function(callback){
        this._ccEventCallback = callback;
    },
    setScaleX: function(scaleX){
        if (this._flippedX)
            scaleX = scaleX * -1;
        cc.Node.prototype.setScaleX.call(this, scaleX);
    },
    setScaleY: function(scaleY){
        if (this._flippedY)
            scaleY = scaleY * -1;
        cc.Node.prototype.setScaleY.call(this, scaleY);
    },
    setScale: function(scaleX, scaleY){
        if(scaleY === undefined)
            scaleY = scaleX;
        this.setScaleX(scaleX);
        this.setScaleY(scaleY);
    },
    getScaleX: function(){
        var originalScale = cc.Node.prototype.getScaleX.call(this);
        if (this._flippedX)
            originalScale = originalScale * -1.0;
        return originalScale;
    },
    getScaleY: function(){
        var originalScale = cc.Node.prototype.getScaleY.call(this);
        if (this._flippedY)
            originalScale = originalScale * -1.0;
        return originalScale;
    },
    getScale: function(){
        if(this.getScaleX() === this.getScaleY())
            cc.log("Widget#scale. ScaleX != ScaleY. Don't know which one to return");
        return this.getScaleX();
    },
    setCallbackName: function(callbackName){
        this._callbackName = callbackName;
    },
    getCallbackName: function(){
        return this._callbackName;
    },
    setCallbackType: function(callbackType){
        this._callbackType = callbackType;
    },
    getCallbackType: function(){
        return this._callbackType;
    },
    setLayoutComponentEnabled: function(enable){
        this._usingLayoutComponent = enable;
    },
    isLayoutComponentEnabled: function(){
        return this._usingLayoutComponent;
    },
    _createRenderCmd: function(){
        if(cc._renderType === cc._RENDER_TYPE_WEBGL)
            return new ccui.Widget.WebGLRenderCmd(this);
        else
            return new ccui.Widget.CanvasRenderCmd(this);
    }
});
var _p = ccui.Widget.prototype;
_p.xPercent;
cc.defineGetterSetter(_p, "xPercent", _p._getXPercent, _p._setXPercent);
_p.yPercent;
cc.defineGetterSetter(_p, "yPercent", _p._getYPercent, _p._setYPercent);
_p.widthPercent;
cc.defineGetterSetter(_p, "widthPercent", _p._getWidthPercent, _p._setWidthPercent);
_p.heightPercent;
cc.defineGetterSetter(_p, "heightPercent", _p._getHeightPercent, _p._setHeightPercent);
_p.widgetParent;
cc.defineGetterSetter(_p, "widgetParent", _p.getWidgetParent);
_p.enabled;
cc.defineGetterSetter(_p, "enabled", _p.isEnabled, _p.setEnabled);
_p.focused;
cc.defineGetterSetter(_p, "focused", _p.isFocused, _p.setFocused);
_p.sizeType;
cc.defineGetterSetter(_p, "sizeType", _p.getSizeType, _p.setSizeType);
_p.widgetType;
cc.defineGetterSetter(_p, "widgetType", _p.getWidgetType);
_p.touchEnabled;
cc.defineGetterSetter(_p, "touchEnabled", _p.isTouchEnabled, _p.setTouchEnabled);
_p.updateEnabled;
cc.defineGetterSetter(_p, "updateEnabled", _p.isUpdateEnabled, _p.setUpdateEnabled);
_p.bright;
cc.defineGetterSetter(_p, "bright", _p.isBright, _p.setBright);
_p.name;
cc.defineGetterSetter(_p, "name", _p.getName, _p.setName);
_p.actionTag;
cc.defineGetterSetter(_p, "actionTag", _p.getActionTag, _p.setActionTag);
_p.opacity;
cc.defineGetterSetter(_p, "opacity", _p.getOpacity, _p.setOpacity);
_p = null;
ccui.Widget.create = function () {
    return new ccui.Widget();
};
ccui.Widget._focusedWidget = null;
ccui.Widget._focusNavigationController = null;
ccui.Widget.enableDpadNavigation = function(enable){
    if (enable){
        if (null == ccui.Widget._focusNavigationController) {
            ccui.Widget._focusNavigationController = new ccui._FocusNavigationController();
            if (ccui.Widget._focusedWidget) {
                ccui.Widget._focusNavigationController._setFirstFocsuedWidget(ccui.Widget._focusedWidget);
            }
        }
        ccui.Widget._focusNavigationController.enableFocusNavigation(true);
    } else {
        if(ccui.Widget._focusNavigationController){
            ccui.Widget._focusNavigationController.enableFocusNavigation(false);
            ccui.Widget._focusNavigationController = null;
        }
    }
};
ccui.Widget.getCurrentFocusedWidget = function(){
    return ccui.Widget._focusedWidget;
};
ccui.Widget.BRIGHT_STYLE_NONE = -1;
ccui.Widget.BRIGHT_STYLE_NORMAL = 0;
ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT = 1;
ccui.Widget.TYPE_WIDGET = 0;
ccui.Widget.TYPE_CONTAINER = 1;
ccui.Widget.LEFT = 0;
ccui.Widget.RIGHT = 1;
ccui.Widget.UP = 2;
ccui.Widget.DOWN = 3;
ccui.Widget.LOCAL_TEXTURE = 0;
ccui.Widget.PLIST_TEXTURE = 1;
ccui.Widget.TOUCH_BEGAN = 0;
ccui.Widget.TOUCH_MOVED = 1;
ccui.Widget.TOUCH_ENDED = 2;
ccui.Widget.TOUCH_CANCELED = 3;
ccui.Widget.SIZE_ABSOLUTE = 0;
ccui.Widget.SIZE_PERCENT = 1;
ccui.Widget.POSITION_ABSOLUTE = 0;
ccui.Widget.POSITION_PERCENT = 1;
if (cc._renderType === cc._RENDER_TYPE_CANVAS) {
    (function () {
        ccui.Widget.CanvasRenderCmd = function (renderable) {
            cc.ProtectedNode.CanvasRenderCmd.call(this, renderable);
            this._needDraw = false;
        };
        var proto = ccui.Widget.CanvasRenderCmd.prototype = Object.create(cc.ProtectedNode.CanvasRenderCmd.prototype);
        proto.constructor = ccui.Widget.CanvasRenderCmd;
        proto.visit = function (parentCmd) {
            var node = this._node;
            if (node._visible) {
                node._adaptRenderers();
                cc.ProtectedNode.CanvasRenderCmd.prototype.visit.call(this, parentCmd);
            }
        };
        proto.transform = function (parentCmd, recursive) {
            var node = this._node;
            if (node._visible) {
                node._adaptRenderers();
                if(!this._usingLayoutComponent){
                    var widgetParent = node.getWidgetParent();
                    if (widgetParent) {
                        var parentSize = widgetParent.getContentSize();
                        if (parentSize.width !== 0 && parentSize.height !== 0) {
                            node._position.x = parentSize.width * node._positionPercent.x;
                            node._position.y = parentSize.height * node._positionPercent.y;
                        }
                    }
                }
                cc.ProtectedNode.CanvasRenderCmd.prototype.transform.call(this, parentCmd, recursive);
            }
        };
    })();
} else {
    (function () {
        ccui.Widget.WebGLRenderCmd = function (renderable) {
            cc.ProtectedNode.WebGLRenderCmd.call(this, renderable);
            this._needDraw = false;
        };
        var proto = ccui.Widget.WebGLRenderCmd.prototype = Object.create(cc.ProtectedNode.WebGLRenderCmd.prototype);
        proto.constructor = ccui.Widget.WebGLRenderCmd;
        proto.visit = function (parentCmd) {
            var node = this._node;
            if (node._visible) {
                node._adaptRenderers();
                cc.ProtectedNode.WebGLRenderCmd.prototype.visit.call(this, parentCmd);
            }
        };
        proto.transform = function(parentCmd, recursive){
            var node = this._node;
            if (node._visible) {
                node._adaptRenderers();
                if(!this._usingLayoutComponent) {
                    var widgetParent = node.getWidgetParent();
                    if (widgetParent) {
                        var parentSize = widgetParent.getContentSize();
                        if (parentSize.width !== 0 && parentSize.height !== 0) {
                            node._position.x = parentSize.width * node._positionPercent.x;
                            node._position.y = parentSize.height * node._positionPercent.y;
                        }
                    }
                }
                cc.ProtectedNode.WebGLRenderCmd.prototype.transform.call(this, parentCmd, recursive);
            }
        };
    })();
}
ccui.Scale9Sprite = cc.Node.extend({
    _spriteRect: null,
    _capInsetsInternal: null,
    _positionsAreDirty: false,
    _scale9Image: null,
    _topLeft: null,
    _top: null,
    _topRight: null,
    _left: null,
    _centre: null,
    _right: null,
    _bottomLeft: null,
    _bottom: null,
    _bottomRight: null,
    _scale9Dirty: true,
    _opacityModifyRGB: false,
    _originalSize: null,
    _preferredSize: null,
    _opacity: 0,
    _color: null,
    _capInsets: null,
    _insetLeft: 0,
    _insetTop: 0,
    _insetRight: 0,
    _insetBottom: 0,
    _spritesGenerated: false,
    _spriteFrameRotated: false,
    _textureLoaded:false,
    _className:"Scale9Sprite",
    _flippedX: false,
    _flippedY: false,
    textureLoaded:function(){
        return this._textureLoaded;
    },
    addLoadedEventListener:function(callback, target){
        this.addEventListener("load", callback, target);
    },
    _updateCapInset: function () {
        var insets, locInsetLeft = this._insetLeft, locInsetTop = this._insetTop, locInsetRight = this._insetRight;
        var locSpriteRect = this._spriteRect, locInsetBottom = this._insetBottom;
        if (locInsetLeft === 0 && locInsetTop === 0 && locInsetRight === 0 && locInsetBottom === 0) {
            insets = cc.rect(0, 0, 0, 0);
        } else {
            insets = this._spriteFrameRotated ? cc.rect(locInsetBottom, locInsetLeft,
                    locSpriteRect.width - locInsetRight - locInsetLeft,
                    locSpriteRect.height - locInsetTop - locInsetBottom) :
                cc.rect(locInsetLeft, locInsetTop,
                        locSpriteRect.width - locInsetLeft - locInsetRight,
                        locSpriteRect.height - locInsetTop - locInsetBottom);
        }
        this.setCapInsets(insets);
    },
    _updatePositions: function () {
        if (!((this._topLeft) && (this._topRight) && (this._bottomRight) &&
            (this._bottomLeft) && (this._centre))) {
            return;
        }
        var size = this._contentSize;
        var locTopLeft = this._topLeft, locTopRight = this._topRight, locBottomRight = this._bottomRight, locBottomLeft = this._bottomLeft;
        var locCenter = this._centre, locCenterContentSize = this._centre.getContentSize();
        var locTopLeftContentSize = locTopLeft.getContentSize();
        var locBottomLeftContentSize = locBottomLeft.getContentSize();
        var sizableWidth = size.width - locTopLeftContentSize.width - locTopRight.getContentSize().width;
        var sizableHeight = size.height - locTopLeftContentSize.height - locBottomRight.getContentSize().height;
        var horizontalScale = sizableWidth / locCenterContentSize.width;
        var verticalScale = sizableHeight / locCenterContentSize.height;
        var rescaledWidth = locCenterContentSize.width * horizontalScale;
        var rescaledHeight = locCenterContentSize.height * verticalScale;
        var leftWidth = locBottomLeftContentSize.width;
        var bottomHeight = locBottomLeftContentSize.height;
        if (cc._renderType === cc._RENDER_TYPE_WEBGL) {
            var roundedRescaledWidth = Math.round(rescaledWidth);
            if (rescaledWidth !== roundedRescaledWidth) {
                rescaledWidth = roundedRescaledWidth;
                horizontalScale = rescaledWidth / locCenterContentSize.width;
            }
            var roundedRescaledHeight = Math.round(rescaledHeight);
            if (rescaledHeight !== roundedRescaledHeight) {
                rescaledHeight = roundedRescaledHeight;
                verticalScale = rescaledHeight / locCenterContentSize.height;
            }
        }
        locCenter.setScaleX(horizontalScale);
        locCenter.setScaleY(verticalScale);
        var locLeft = this._left, locRight = this._right, locTop = this._top, locBottom = this._bottom;
        var tempAP = cc.p(0, 0);
        locBottomLeft.setAnchorPoint(tempAP);
        locBottomRight.setAnchorPoint(tempAP);
        locTopLeft.setAnchorPoint(tempAP);
        locTopRight.setAnchorPoint(tempAP);
        locLeft.setAnchorPoint(tempAP);
        locRight.setAnchorPoint(tempAP);
        locTop.setAnchorPoint(tempAP);
        locBottom.setAnchorPoint(tempAP);
        locCenter.setAnchorPoint(tempAP);
        locBottomLeft.setPosition(0, 0);
        locBottomRight.setPosition(leftWidth + rescaledWidth, 0);
        locTopLeft.setPosition(0, bottomHeight + rescaledHeight);
        locTopRight.setPosition(leftWidth + rescaledWidth, bottomHeight + rescaledHeight);
        locLeft.setPosition(0, bottomHeight);
        locLeft.setScaleY(verticalScale);
        locRight.setPosition(leftWidth + rescaledWidth, bottomHeight);
        locRight.setScaleY(verticalScale);
        locBottom.setPosition(leftWidth, 0);
        locBottom.setScaleX(horizontalScale);
        locTop.setPosition(leftWidth, bottomHeight + rescaledHeight);
        locTop.setScaleX(horizontalScale);
        locCenter.setPosition(leftWidth, bottomHeight);
    },
    ctor: function (file, rect, capInsets) {
        cc.Node.prototype.ctor.call(this);
        this._spriteRect = cc.rect(0, 0, 0, 0);
        this._capInsetsInternal = cc.rect(0, 0, 0, 0);
        this._originalSize = cc.size(0, 0);
        this._preferredSize = cc.size(0, 0);
        this._capInsets = cc.rect(0, 0, 0, 0);
        if(file != undefined){
            if(file instanceof cc.SpriteFrame)
                this.initWithSpriteFrame(file, rect);
            else{
                var frame = cc.spriteFrameCache.getSpriteFrame(file);
                if(frame != null)
                    this.initWithSpriteFrame(frame, rect);
                else
                    this.initWithFile(file, rect, capInsets);
            }
        }else{
            this.init();
        }
    },
    getSprite: function () {
        return this._scale9Image;
    },
    getOriginalSize: function () {
        return cc.size(this._originalSize);
    },
    getPreferredSize: function () {
        return cc.size(this._preferredSize);
    },
    _getPreferredWidth: function () {
        return this._preferredSize.width;
    },
    _getPreferredHeight: function () {
        return this._preferredSize.height;
    },
    setPreferredSize: function (preferredSize) {
        this.setContentSize(preferredSize);
        this._preferredSize = preferredSize;
        if (this._positionsAreDirty) {
            this._updatePositions();
            this._positionsAreDirty = false;
            this._scale9Dirty = true;
        }
    },
    _setPreferredWidth: function (value) {
        this._setWidth(value);
        this._preferredSize.width = value;
    },
    _setPreferredHeight: function (value) {
        this._setHeight(value);
        this._preferredSize.height = value;
    },
    setOpacity: function (opacity) {
        if(!this._scale9Image)
            return;
        cc.Node.prototype.setOpacity.call(this, opacity);
        var scaleChildren = this._scale9Image.getChildren();
        for (var i = 0; i < scaleChildren.length; i++) {
            var selChild = scaleChildren[i];
            if (selChild)
                selChild.setOpacity(opacity);
        }
        this._scale9Dirty = true;
    },
    setColor: function (color) {
        if(!this._scale9Image)
            return;
        cc.Node.prototype.setColor.call(this, color);
        var scaleChildren = this._scale9Image.getChildren();
        for (var i = 0; i < scaleChildren.length; i++) {
            var selChild = scaleChildren[i];
            if (selChild)
                selChild.setColor(color);
        }
        this._scale9Dirty = true;
    },
    getCapInsets: function () {
        return cc.rect(this._capInsets);
    },
    setCapInsets: function (capInsets) {
        if(!this._scale9Image)
            return;
        var contentSize = this._contentSize;
        var tempWidth = contentSize.width, tempHeight = contentSize.height;
        this.updateWithBatchNode(this._scale9Image, this._spriteRect, this._spriteFrameRotated, capInsets);
        this.setContentSize(tempWidth, tempHeight);
    },
    getInsetLeft: function () {
        return this._insetLeft;
    },
    setInsetLeft: function (insetLeft) {
        this._insetLeft = insetLeft;
        this._updateCapInset();
    },
    getInsetTop: function () {
        return this._insetTop;
    },
    setInsetTop: function (insetTop) {
        this._insetTop = insetTop;
        this._updateCapInset();
    },
    getInsetRight: function () {
        return this._insetRight;
    },
    setInsetRight: function (insetRight) {
        this._insetRight = insetRight;
        this._updateCapInset();
    },
    getInsetBottom: function () {
        return this._insetBottom;
    },
    setInsetBottom: function (insetBottom) {
        this._insetBottom = insetBottom;
        this._updateCapInset();
    },
    setContentSize: function (size, height) {
        cc.Node.prototype.setContentSize.call(this, size, height);
        this._positionsAreDirty = true;
    },
    _setWidth: function (value) {
        cc.Node.prototype._setWidth.call(this, value);
        this._positionsAreDirty = true;
    },
    _setHeight: function (value) {
        cc.Node.prototype._setHeight.call(this, value);
        this._positionsAreDirty = true;
    },
    init: function () {
        return this.initWithBatchNode(null, cc.rect(0, 0, 0, 0), false, cc.rect(0, 0, 0, 0));
    },
    initWithBatchNode: function (batchNode, rect, rotated, capInsets) {
        if (capInsets === undefined) {
            capInsets = rotated;
            rotated = false;
        }
        if (batchNode)
            this.updateWithBatchNode(batchNode, rect, rotated, capInsets);
        this.setCascadeColorEnabled(true);
        this.setCascadeOpacityEnabled(true);
        this.setAnchorPoint(0.5, 0.5);
        this._positionsAreDirty = true;
        return true;
    },
    initWithFile: function (file, rect, capInsets) {
        if (file instanceof cc.Rect) {
            file = arguments[1];
            capInsets = arguments[0];
            rect = cc.rect(0, 0, 0, 0);
        } else {
            rect = rect || cc.rect(0, 0, 0, 0);
            capInsets = capInsets || cc.rect(0, 0, 0, 0);
        }
        if(!file)
            throw "ccui.Scale9Sprite.initWithFile(): file should be non-null";
        var texture = cc.textureCache.getTextureForKey(file);
        if (!texture) {
            texture = cc.textureCache.addImage(file);
        }
        var locLoaded = texture.isLoaded();
        this._textureLoaded = locLoaded;
        if(!locLoaded){
            texture.addEventListener("load", function(sender){
                var preferredSize = this._preferredSize, restorePreferredSize = preferredSize.width !== 0 && preferredSize.height !== 0;
                if (restorePreferredSize) preferredSize = cc.size(preferredSize.width, preferredSize.height);
                var size  = sender.getContentSize();
                this.updateWithBatchNode(this._scale9Image, cc.rect(0,0,size.width,size.height), false, this._capInsets);
                if (restorePreferredSize)this.setPreferredSize(preferredSize);
                this._positionsAreDirty = true;
                this.dispatchEvent("load");
            }, this);
        }
        return this.initWithBatchNode(new cc.SpriteBatchNode(file, 9), rect, false, capInsets);
    },
    initWithSpriteFrame: function (spriteFrame, capInsets) {
        if(!spriteFrame || !spriteFrame.getTexture())
            throw "ccui.Scale9Sprite.initWithSpriteFrame(): spriteFrame should be non-null and its texture should be non-null";
        capInsets = capInsets || cc.rect(0, 0, 0, 0);
        var locLoaded = spriteFrame.textureLoaded();
        this._textureLoaded = locLoaded;
        if(!locLoaded){
            spriteFrame.addEventListener("load", function(sender){
                var preferredSize = this._preferredSize, restorePreferredSize = preferredSize.width !== 0 && preferredSize.height !== 0;
                if (restorePreferredSize) preferredSize = cc.size(preferredSize.width, preferredSize.height);
                this.updateWithBatchNode(this._scale9Image, sender.getRect(), cc._renderType === cc._RENDER_TYPE_WEBGL && sender.isRotated(), this._capInsets);
                if (restorePreferredSize)this.setPreferredSize(preferredSize);
                this._positionsAreDirty = true;
                this.dispatchEvent("load");
            },this);
        }
        var batchNode = new cc.SpriteBatchNode(spriteFrame.getTexture(), 9);
        return this.initWithBatchNode(batchNode, spriteFrame.getRect(), cc._renderType === cc._RENDER_TYPE_WEBGL && spriteFrame.isRotated(), capInsets);
    },
    initWithSpriteFrameName: function (spriteFrameName, capInsets) {
        if(!spriteFrameName)
            throw "ccui.Scale9Sprite.initWithSpriteFrameName(): spriteFrameName should be non-null";
        capInsets = capInsets || cc.rect(0, 0, 0, 0);
        var frame = cc.spriteFrameCache.getSpriteFrame(spriteFrameName);
        if (frame == null) {
            cc.log("ccui.Scale9Sprite.initWithSpriteFrameName(): can't find the sprite frame by spriteFrameName");
            return false;
        }
        return this.initWithSpriteFrame(frame, capInsets);
    },
    resizableSpriteWithCapInsets: function (capInsets) {
        var pReturn = new ccui.Scale9Sprite();
        if (pReturn && pReturn.initWithBatchNode(this._scale9Image, this._spriteRect, false, capInsets))
            return pReturn;
        return null;
    },
    setOpacityModifyRGB: function (value) {
        if(!this._scale9Image)
            return;
        this._opacityModifyRGB = value;
        var scaleChildren = this._scale9Image.getChildren();
        if (scaleChildren) {
            for (var i = 0, len = scaleChildren.length; i < len; i++)
                scaleChildren[i].setOpacityModifyRGB(value);
        }
    },
    isOpacityModifyRGB: function () {
        return this._opacityModifyRGB;
    },
    updateWithBatchNode: function (batchNode, originalRect, rotated, capInsets) {
        var opacity = this.getOpacity();
        var color = this.getColor();
        var rect = cc.rect(originalRect.x, originalRect.y, originalRect.width, originalRect.height);
        this.removeAllChildren(true);
        if (this._scale9Image !== batchNode)
            this._scale9Image = batchNode;
        if(!this._scale9Image)
            return false;
        var tmpTexture = batchNode.getTexture();
        var locLoaded = tmpTexture.isLoaded();
        this._textureLoaded = locLoaded;
        if(!locLoaded){
            tmpTexture.addEventListener("load", function(sender){
                this._positionsAreDirty = true;
                this.dispatchEvent("load");
            },this);
            return true;
        }
        var locScale9Image = this._scale9Image;
        locScale9Image.removeAllChildren(true);
        var locCapInsets = this._capInsets;
        locCapInsets.x = capInsets.x;
        locCapInsets.y = capInsets.y;
        locCapInsets.width = capInsets.width;
        locCapInsets.height = capInsets.height;
        this._spriteFrameRotated = rotated;
        var selTexture = locScale9Image.getTexture();
        if (cc._rectEqualToZero(rect)) {
            var textureSize = selTexture.getContentSize();
            rect = cc.rect(0, 0, textureSize.width, textureSize.height);
        }
        this._spriteRect = rect;
        var locSpriteRect = this._spriteRect;
        locSpriteRect.x = rect.x;
        locSpriteRect.y = rect.y;
        locSpriteRect.width = rect.width;
        locSpriteRect.height = rect.height;
        this._originalSize.width = rect.width;
        this._originalSize.height = rect.height;
        var locPreferredSize = this._preferredSize;
        if(locPreferredSize.width === 0 && locPreferredSize.height === 0){
            locPreferredSize.width = rect.width;
            locPreferredSize.height = rect.height;
        }
        var locCapInsetsInternal = this._capInsetsInternal;
        if(capInsets){
            locCapInsetsInternal.x = capInsets.x;
            locCapInsetsInternal.y = capInsets.y;
            locCapInsetsInternal.width = capInsets.width;
            locCapInsetsInternal.height = capInsets.height;
        }
        var w = rect.width, h = rect.height;
        if (cc._rectEqualToZero(locCapInsetsInternal)) {
            locCapInsetsInternal.x = w / 3;
            locCapInsetsInternal.y = h / 3;
            locCapInsetsInternal.width = w / 3;
            locCapInsetsInternal.height = h / 3;
        }
        var left_w = locCapInsetsInternal.x, center_w = locCapInsetsInternal.width, right_w = w - (left_w + center_w);
        var top_h = locCapInsetsInternal.y, center_h = locCapInsetsInternal.height, bottom_h = h - (top_h + center_h);
        var x = 0.0, y = 0.0;
        var lefttopbounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, left_w + 0.5 | 0, top_h + 0.5 | 0);
        x += left_w;
        var centertopbounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, center_w + 0.5 | 0, top_h + 0.5 | 0);
        x += center_w;
        var righttopbounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, right_w + 0.5 | 0, top_h + 0.5 | 0);
        x = 0.0;
        y = 0.0;
        y += top_h;
        var leftcenterbounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, left_w + 0.5 | 0, center_h + 0.5 | 0);
        x += left_w;
        var centerbounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, center_w + 0.5 | 0, center_h + 0.5 | 0);
        x += center_w;
        var rightcenterbounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, right_w + 0.5 | 0, center_h + 0.5 | 0);
        x = 0.0;
        y = 0.0;
        y += top_h;
        y += center_h;
        var leftbottombounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, left_w + 0.5 | 0, bottom_h + 0.5 | 0);
        x += left_w;
        var centerbottombounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, center_w + 0.5 | 0, bottom_h + 0.5 | 0);
        x += center_w;
        var rightbottombounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, right_w + 0.5 | 0, bottom_h + 0.5 | 0);
        var t = cc.affineTransformMakeIdentity();
        if (!rotated) {
            t = cc.affineTransformTranslate(t, rect.x, rect.y);
            cc._rectApplyAffineTransformIn(centerbounds, t);
            cc._rectApplyAffineTransformIn(rightbottombounds, t);
            cc._rectApplyAffineTransformIn(leftbottombounds, t);
            cc._rectApplyAffineTransformIn(righttopbounds, t);
            cc._rectApplyAffineTransformIn(lefttopbounds, t);
            cc._rectApplyAffineTransformIn(rightcenterbounds, t);
            cc._rectApplyAffineTransformIn(leftcenterbounds, t);
            cc._rectApplyAffineTransformIn(centerbottombounds, t);
            cc._rectApplyAffineTransformIn(centertopbounds, t);
            this._centre = new cc.Sprite();
            this._centre.initWithTexture(selTexture, centerbounds);
            locScale9Image.addChild(this._centre, 0, ccui.Scale9Sprite.POSITIONS_CENTRE);
            this._top = new cc.Sprite();
            this._top.initWithTexture(selTexture, centertopbounds);
            locScale9Image.addChild(this._top, 1, ccui.Scale9Sprite.POSITIONS_TOP);
            this._bottom = new cc.Sprite();
            this._bottom.initWithTexture(selTexture, centerbottombounds);
            locScale9Image.addChild(this._bottom, 1, ccui.Scale9Sprite.POSITIONS_BOTTOM);
            this._left = new cc.Sprite();
            this._left.initWithTexture(selTexture, leftcenterbounds);
            locScale9Image.addChild(this._left, 1, ccui.Scale9Sprite.POSITIONS_LEFT);
            this._right = new cc.Sprite();
            this._right.initWithTexture(selTexture, rightcenterbounds);
            locScale9Image.addChild(this._right, 1, ccui.Scale9Sprite.POSITIONS_RIGHT);
            this._topLeft = new cc.Sprite();
            this._topLeft.initWithTexture(selTexture, lefttopbounds);
            locScale9Image.addChild(this._topLeft, 2, ccui.Scale9Sprite.POSITIONS_TOPLEFT);
            this._topRight = new cc.Sprite();
            this._topRight.initWithTexture(selTexture, righttopbounds);
            locScale9Image.addChild(this._topRight, 2, ccui.Scale9Sprite.POSITIONS_TOPRIGHT);
            this._bottomLeft = new cc.Sprite();
            this._bottomLeft.initWithTexture(selTexture, leftbottombounds);
            locScale9Image.addChild(this._bottomLeft, 2, ccui.Scale9Sprite.POSITIONS_BOTTOMLEFT);
            this._bottomRight = new cc.Sprite();
            this._bottomRight.initWithTexture(selTexture, rightbottombounds);
            locScale9Image.addChild(this._bottomRight, 2, ccui.Scale9Sprite.POSITIONS_BOTTOMRIGHT);
        } else {
            var rotatedcenterbounds = centerbounds;
            var rotatedrightbottombounds = rightbottombounds;
            var rotatedleftbottombounds = leftbottombounds;
            var rotatedrighttopbounds = righttopbounds;
            var rotatedlefttopbounds = lefttopbounds;
            var rotatedrightcenterbounds = rightcenterbounds;
            var rotatedleftcenterbounds = leftcenterbounds;
            var rotatedcenterbottombounds = centerbottombounds;
            var rotatedcentertopbounds = centertopbounds;
            t = cc.affineTransformTranslate(t, rect.height + rect.x, rect.y);
            t = cc.affineTransformRotate(t, 1.57079633);
            centerbounds = cc.rectApplyAffineTransform(centerbounds, t);
            rightbottombounds = cc.rectApplyAffineTransform(rightbottombounds, t);
            leftbottombounds = cc.rectApplyAffineTransform(leftbottombounds, t);
            righttopbounds = cc.rectApplyAffineTransform(righttopbounds, t);
            lefttopbounds = cc.rectApplyAffineTransform(lefttopbounds, t);
            rightcenterbounds = cc.rectApplyAffineTransform(rightcenterbounds, t);
            leftcenterbounds = cc.rectApplyAffineTransform(leftcenterbounds, t);
            centerbottombounds = cc.rectApplyAffineTransform(centerbottombounds, t);
            centertopbounds = cc.rectApplyAffineTransform(centertopbounds, t);
            rotatedcenterbounds.x = centerbounds.x;
            rotatedcenterbounds.y = centerbounds.y;
            rotatedrightbottombounds.x = rightbottombounds.x;
            rotatedrightbottombounds.y = rightbottombounds.y;
            rotatedleftbottombounds.x = leftbottombounds.x;
            rotatedleftbottombounds.y = leftbottombounds.y;
            rotatedrighttopbounds.x = righttopbounds.x;
            rotatedrighttopbounds.y = righttopbounds.y;
            rotatedlefttopbounds.x = lefttopbounds.x;
            rotatedlefttopbounds.y = lefttopbounds.y;
            rotatedrightcenterbounds.x = rightcenterbounds.x;
            rotatedrightcenterbounds.y = rightcenterbounds.y;
            rotatedleftcenterbounds.x = leftcenterbounds.x;
            rotatedleftcenterbounds.y = leftcenterbounds.y;
            rotatedcenterbottombounds.x = centerbottombounds.x;
            rotatedcenterbottombounds.y = centerbottombounds.y;
            rotatedcentertopbounds.x = centertopbounds.x;
            rotatedcentertopbounds.y = centertopbounds.y;
            this._centre = new cc.Sprite();
            this._centre.initWithTexture(selTexture, rotatedcenterbounds, true);
            locScale9Image.addChild(this._centre, 0, ccui.Scale9Sprite.POSITIONS_CENTRE);
            this._top = new cc.Sprite();
            this._top.initWithTexture(selTexture, rotatedcentertopbounds, true);
            locScale9Image.addChild(this._top, 1, ccui.Scale9Sprite.POSITIONS_TOP);
            this._bottom = new cc.Sprite();
            this._bottom.initWithTexture(selTexture, rotatedcenterbottombounds, true);
            locScale9Image.addChild(this._bottom, 1, ccui.Scale9Sprite.POSITIONS_BOTTOM);
            this._left = new cc.Sprite();
            this._left.initWithTexture(selTexture, rotatedleftcenterbounds, true);
            locScale9Image.addChild(this._left, 1, ccui.Scale9Sprite.POSITIONS_LEFT);
            this._right = new cc.Sprite();
            this._right.initWithTexture(selTexture, rotatedrightcenterbounds, true);
            locScale9Image.addChild(this._right, 1, ccui.Scale9Sprite.POSITIONS_RIGHT);
            this._topLeft = new cc.Sprite();
            this._topLeft.initWithTexture(selTexture, rotatedlefttopbounds, true);
            locScale9Image.addChild(this._topLeft, 2, ccui.Scale9Sprite.POSITIONS_TOPLEFT);
            this._topRight = new cc.Sprite();
            this._topRight.initWithTexture(selTexture, rotatedrighttopbounds, true);
            locScale9Image.addChild(this._topRight, 2, ccui.Scale9Sprite.POSITIONS_TOPRIGHT);
            this._bottomLeft = new cc.Sprite();
            this._bottomLeft.initWithTexture(selTexture, rotatedleftbottombounds, true);
            locScale9Image.addChild(this._bottomLeft, 2, ccui.Scale9Sprite.POSITIONS_BOTTOMLEFT);
            this._bottomRight = new cc.Sprite();
            this._bottomRight.initWithTexture(selTexture, rotatedrightbottombounds, true);
            locScale9Image.addChild(this._bottomRight, 2, ccui.Scale9Sprite.POSITIONS_BOTTOMRIGHT);
        }
        this.setContentSize(rect.width, rect.height);
        if(cc._renderType === cc._RENDER_TYPE_WEBGL)
            this.addChild(locScale9Image);
        if (this._spritesGenerated) {
            this.setOpacity(opacity);
            this.setColor(color);
        }
        this._spritesGenerated = true;
        return true;
    },
    setSpriteFrame: function (spriteFrame) {
        var batchNode = new cc.SpriteBatchNode(spriteFrame.getTexture(), 9);
        var locLoaded = spriteFrame.textureLoaded();
        this._textureLoaded = locLoaded;
        if(!locLoaded){
            spriteFrame.addEventListener("load", function(sender){
                var preferredSize = this._preferredSize, restorePreferredSize = preferredSize.width !== 0 && preferredSize.height !== 0;
                if (restorePreferredSize) preferredSize = cc.size(preferredSize.width, preferredSize.height);
                this.updateWithBatchNode(this._scale9Image, sender.getRect(), cc._renderType === cc._RENDER_TYPE_WEBGL && sender.isRotated(), this._capInsets);
                if (restorePreferredSize)this.setPreferredSize(preferredSize);
                this._positionsAreDirty = true;
                this.dispatchEvent("load");
            },this);
        }
        this.updateWithBatchNode(batchNode, spriteFrame.getRect(), cc._renderType === cc._RENDER_TYPE_WEBGL && spriteFrame.isRotated(), cc.rect(0, 0, 0, 0));
        this._insetLeft = 0;
        this._insetTop = 0;
        this._insetRight = 0;
        this._insetBottom = 0;
    },
    setState: function(state){
        this._renderCmd.setState(state);
    },
    setFlippedX: function(flippedX){
        var realScale = this.getScaleX();
        this._flippedX = flippedX;
        this.setScaleX(realScale);
    },
    isFlippedX: function(){
        return this._flippedX;
    },
    setFlippedY:function(flippedY){
        var realScale = this.getScaleY();
        this._flippedY = flippedY;
        this.setScaleY(realScale);
    },
    isFlippedY:function(){
        return this._flippedY;
    },
    setScaleX: function (scaleX) {
        if (this._flippedX)
            scaleX = scaleX * -1;
        cc.Node.prototype.setScaleX.call(this, scaleX);
    },
    setScaleY: function (scaleY) {
        if (this._flippedY)
            scaleY = scaleY * -1;
        cc.Node.prototype.setScaleY.call(this, scaleY);
    },
    setScale: function (scaleX, scaleY) {
        if(scaleY === undefined)
            scaleY = scaleX;
        this.setScaleX(scaleX);
        this.setScaleY(scaleY);
    },
    getScaleX: function () {
        var originalScale = cc.Node.prototype.getScaleX.call(this);
        if (this._flippedX)
            originalScale = originalScale * -1.0;
        return originalScale;
    },
    getScaleY: function () {
        var originalScale = cc.Node.prototype.getScaleY.call(this);
        if (this._flippedY)
            originalScale = originalScale * -1.0;
        return originalScale;
    },
    getScale: function () {
        if(this.getScaleX() !== this.getScaleY())
            cc.log("Scale9Sprite#scale. ScaleX != ScaleY. Don't know which one to return");
        return this.getScaleX();
    },
    _createRenderCmd: function(){
        if(cc._renderType === cc._RENDER_TYPE_CANVAS)
            return new ccui.Scale9Sprite.CanvasRenderCmd(this);
        else
            return new ccui.Scale9Sprite.WebGLRenderCmd(this);
    }
});
var _p = ccui.Scale9Sprite.prototype;
cc.EventHelper.prototype.apply(_p);
_p.preferredSize;
cc.defineGetterSetter(_p, "preferredSize", _p.getPreferredSize, _p.setPreferredSize);
_p.capInsets;
cc.defineGetterSetter(_p, "capInsets", _p.getCapInsets, _p.setCapInsets);
_p.insetLeft;
cc.defineGetterSetter(_p, "insetLeft", _p.getInsetLeft, _p.setInsetLeft);
_p.insetTop;
cc.defineGetterSetter(_p, "insetTop", _p.getInsetTop, _p.setInsetTop);
_p.insetRight;
cc.defineGetterSetter(_p, "insetRight", _p.getInsetRight, _p.setInsetRight);
_p.insetBottom;
cc.defineGetterSetter(_p, "insetBottom", _p.getInsetBottom, _p.setInsetBottom);
_p = null;
ccui.Scale9Sprite.create = function (file, rect, capInsets) {
    return new ccui.Scale9Sprite(file, rect, capInsets);
};
ccui.Scale9Sprite.createWithSpriteFrame = function (spriteFrame, capInsets) {
    return new ccui.Scale9Sprite(spriteFrame, capInsets);
};
ccui.Scale9Sprite.createWithSpriteFrameName = function (spriteFrameName, capInsets) {
    return new ccui.Scale9Sprite(spriteFrameName, capInsets);
};
ccui.Scale9Sprite.POSITIONS_CENTRE = 0;
ccui.Scale9Sprite.POSITIONS_TOP = 1;
ccui.Scale9Sprite.POSITIONS_LEFT = 2;
ccui.Scale9Sprite.POSITIONS_RIGHT = 3;
ccui.Scale9Sprite.POSITIONS_BOTTOM = 4;
ccui.Scale9Sprite.POSITIONS_TOPRIGHT = 5;
ccui.Scale9Sprite.POSITIONS_TOPLEFT = 6;
ccui.Scale9Sprite.POSITIONS_BOTTOMRIGHT = 7;
ccui.Scale9Sprite.state = {NORMAL: 0, GRAY: 1};
(function() {
    ccui.Scale9Sprite.CanvasRenderCmd = function (renderable) {
        cc.Node.CanvasRenderCmd.call(this, renderable);
        this._cachedParent = null;
        this._cacheDirty = false;
        this._state = ccui.Scale9Sprite.state.NORMAL;
        var node = this._node;
        var locCacheCanvas = this._cacheCanvas = cc.newElement('canvas');
        locCacheCanvas.width = 1;
        locCacheCanvas.height = 1;
        this._cacheContext = new cc.CanvasContextWrapper(locCacheCanvas.getContext("2d"));
        var locTexture = this._cacheTexture = new cc.Texture2D();
        locTexture.initWithElement(locCacheCanvas);
        locTexture.handleLoadedTexture();
        this._cacheSprite = new cc.Sprite(locTexture);
        this._cacheSprite.setAnchorPoint(0,0);
        node.addChild(this._cacheSprite);
    };
    var proto = ccui.Scale9Sprite.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    proto.constructor = ccui.Scale9Sprite.CanvasRenderCmd;
    proto.visit = function(parentCmd){
        var node = this._node;
        if(!node._visible)
            return;
        if (node._positionsAreDirty) {
            node._updatePositions();
            node._positionsAreDirty = false;
            node._scale9Dirty = true;
        }
        node._scale9Dirty = false;
        this._cacheScale9Sprite();
        cc.Node.CanvasRenderCmd.prototype.visit.call(this, parentCmd);
    };
    proto.transform = function(parentCmd){
        var node = this._node;
        cc.Node.CanvasRenderCmd.prototype.transform.call(this, parentCmd);
        if (node._positionsAreDirty) {
            node._updatePositions();
            node._positionsAreDirty = false;
            node._scale9Dirty = true;
        }
        this._cacheScale9Sprite();
        var children = node._children;
        for(var i=0; i<children.length; i++){
            children[i].transform(this);
        }
    };
    proto._updateDisplayColor = function(parentColor){
        cc.Node.CanvasRenderCmd.prototype._updateDisplayColor.call(this, parentColor);
        var scale9Image = this._node._scale9Image;
        if(scale9Image){
            var scaleChildren = scale9Image.getChildren();
            for (var i = 0; i < scaleChildren.length; i++) {
                var selChild = scaleChildren[i];
                if (selChild){
                    selChild._renderCmd._updateDisplayColor(parentColor);
                    selChild._renderCmd._updateColor();
                }
            }
            this._cacheScale9Sprite();
        }
    };
    proto._cacheScale9Sprite = function(){
        var node = this._node;
        if(!node._scale9Image)
            return;
        var locScaleFactor = cc.contentScaleFactor();
        var size = node._contentSize;
        var sizeInPixels = cc.size(size.width * locScaleFactor, size.height * locScaleFactor);
        var locCanvas = this._cacheCanvas, wrapper = this._cacheContext, locContext = wrapper.getContext();
        var contentSizeChanged = false;
        if(locCanvas.width !== sizeInPixels.width || locCanvas.height !== sizeInPixels.height){
            locCanvas.width = sizeInPixels.width;
            locCanvas.height = sizeInPixels.height;
            contentSizeChanged = true;
        }
        cc.renderer._turnToCacheMode(node.__instanceId);
        node._scale9Image.visit();
        var selTexture = node._scale9Image.getTexture();
        if(selTexture && this._state === ccui.Scale9Sprite.state.GRAY)
            selTexture._switchToGray(true);
        locContext.setTransform(1, 0, 0, 1, 0, 0);
        locContext.clearRect(0, 0, sizeInPixels.width, sizeInPixels.height);
        cc.renderer._renderingToCacheCanvas(wrapper, node.__instanceId, locScaleFactor, locScaleFactor);
        if(selTexture && this._state === ccui.Scale9Sprite.state.GRAY)
            selTexture._switchToGray(false);
        if(contentSizeChanged)
            this._cacheSprite.setTextureRect(cc.rect(0,0, size.width, size.height));
        if(!this._cacheSprite.getParent())
            node.addChild(this._cacheSprite, -1);
    };
    proto.setState = function(state){
        var locScale9Image = this._node._scale9Image;
        if(!locScale9Image)
            return;
        this._state = state;
        this._cacheScale9Sprite();
    };
})();
(function() {
    if(!cc.Node.WebGLRenderCmd)
        return;
    ccui.Scale9Sprite.WebGLRenderCmd = function (renderable) {
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._cachedParent = null;
        this._cacheDirty = false;
    };
    var proto = ccui.Scale9Sprite.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = ccui.Scale9Sprite.WebGLRenderCmd;
    proto.visit = function(parentCmd){
        var node = this._node;
        if(!node._visible)
            return;
        if (node._positionsAreDirty) {
            node._updatePositions();
            node._positionsAreDirty = false;
            node._scale9Dirty = true;
        }
        cc.Node.WebGLRenderCmd.prototype.visit.call(this, parentCmd);
    };
    proto.transform = function(parentCmd, recursive){
        var node = this._node;
        cc.Node.WebGLRenderCmd.prototype.transform.call(this, parentCmd, recursive);
        if (node._positionsAreDirty) {
            node._updatePositions();
            node._positionsAreDirty = false;
            node._scale9Dirty = true;
        }
    };
    proto._updateDisplayColor = function(parentColor){
        cc.Node.WebGLRenderCmd.prototype._updateDisplayColor.call(this, parentColor);
        var scale9Image = this._node._scale9Image;
        if(scale9Image){
            var scaleChildren = scale9Image.getChildren();
            for (var i = 0; i < scaleChildren.length; i++) {
                var selChild = scaleChildren[i];
                if (selChild){
                    selChild._renderCmd._updateDisplayColor(parentColor);
                    selChild._renderCmd._updateColor();
                }
            }
        }
    };
    proto._updateDisplayOpacity = function(parentColor){
        cc.Node.WebGLRenderCmd.prototype._updateDisplayOpacity.call(this, parentColor);
        var scale9Image = this._node._scale9Image;
        if(scale9Image){
            var scaleChildren = scale9Image.getChildren();
            for (var i = 0; i < scaleChildren.length; i++) {
                var selChild = scaleChildren[i];
                if (selChild){
                    selChild._renderCmd._updateDisplayOpacity(parentColor);
                    selChild._renderCmd._updateColor();
                }
            }
        }
    };
    proto.setState = function (state) {
        var scale9Image = this._node._scale9Image;
        if(scale9Image == null)
            return;
        if (state === ccui.Scale9Sprite.state.NORMAL) {
            scale9Image.setShaderProgram(cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR));
        } else if (state === ccui.Scale9Sprite.state.GRAY) {
            scale9Image.setShaderProgram(ccui.Scale9Sprite.WebGLRenderCmd._getGrayShaderProgram());
        }
    };
    ccui.Scale9Sprite.WebGLRenderCmd._grayShaderProgram = null;
    ccui.Scale9Sprite.WebGLRenderCmd._getGrayShaderProgram = function(){
        var grayShader = ccui.Scale9Sprite.WebGLRenderCmd._grayShaderProgram;
        if(grayShader)
            return grayShader;
        grayShader = new cc.GLProgram();
        grayShader.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, ccui.Scale9Sprite.WebGLRenderCmd._grayShaderFragment);
        grayShader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        grayShader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        grayShader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        grayShader.link();
        grayShader.updateUniforms();
        ccui.Scale9Sprite.WebGLRenderCmd._grayShaderProgram = grayShader;
        return grayShader;
    };
    ccui.Scale9Sprite.WebGLRenderCmd._grayShaderFragment =
        "precision lowp float;\n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    vec4 c = texture2D(CC_Texture0, v_texCoord); \n"
        + "    gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b); \n"
        +"     gl_FragColor.w = c.w ; \n"
        + "}";
})();
ccui.Layout = ccui.Widget.extend({
    _clippingEnabled: false,
    _backGroundScale9Enabled: null,
    _backGroundImage: null,
    _backGroundImageFileName: null,
    _backGroundImageCapInsets: null,
    _colorType: null,
    _bgImageTexType: ccui.Widget.LOCAL_TEXTURE,
    _colorRender: null,
    _gradientRender: null,
    _color: null,
    _startColor: null,
    _endColor: null,
    _alongVector: null,
    _opacity: 255,
    _backGroundImageTextureSize: null,
    _layoutType: null,
    _doLayoutDirty: true,
    _clippingRectDirty: true,
    _clippingType: null,
    _clippingStencil: null,
    _scissorRectDirty: false,
    _clippingRect: null,
    _clippingParent: null,
    _className: "Layout",
    _backGroundImageColor: null,
    _finalPositionX: 0,
    _finalPositionY: 0,
    _backGroundImageOpacity:0,
    _loopFocus: false,
    __passFocusToChild: true,
    _isFocusPassing:false,
    _isInterceptTouch: false,
    ctor: function () {
        this._layoutType = ccui.Layout.ABSOLUTE;
        this._widgetType = ccui.Widget.TYPE_CONTAINER;
        this._clippingType = ccui.Layout.CLIPPING_STENCIL;
        this._colorType = ccui.Layout.BG_COLOR_NONE;
        ccui.Widget.prototype.ctor.call(this);
        this._backGroundImageCapInsets = cc.rect(0, 0, 0, 0);
        this._color = cc.color(255, 255, 255, 255);
        this._startColor = cc.color(255, 255, 255, 255);
        this._endColor = cc.color(255, 255, 255, 255);
        this._alongVector = cc.p(0, -1);
        this._backGroundImageTextureSize = cc.size(0, 0);
        this._clippingRect = cc.rect(0, 0, 0, 0);
        this._backGroundImageColor = cc.color(255, 255, 255, 255);
    },
    onEnter: function(){
        ccui.Widget.prototype.onEnter.call(this);
        if (this._clippingStencil)
            this._clippingStencil.onEnter();
        this._doLayoutDirty = true;
        this._clippingRectDirty = true;
    },
    onExit: function(){
        ccui.Widget.prototype.onExit.call(this);
        if (this._clippingStencil)
            this._clippingStencil.onExit();
    },
    setLoopFocus: function(loop){
        this._loopFocus = loop;
    },
    isLoopFocus: function(){
        return this._loopFocus;
    },
    setPassFocusToChild: function(pass){
        this.__passFocusToChild = pass;
    },
    isPassFocusToChild: function(){
        return this.__passFocusToChild;
    },
    findNextFocusedWidget: function(direction, current){
        if (this._isFocusPassing || this.isFocused()) {
            var parent = this.getParent();
            this._isFocusPassing = false;
            if (this.__passFocusToChild) {
                var w = this._passFocusToChild(direction, current);
                if (w instanceof ccui.Layout && parent) {
                    parent._isFocusPassing = true;
                    return parent.findNextFocusedWidget(direction, this);
                }
                return w;
            }
            if (null == parent || !(parent instanceof ccui.Layout))
                return this;
            parent._isFocusPassing = true;
            return parent.findNextFocusedWidget(direction, this);
        } else if(current.isFocused() || current instanceof ccui.Layout) {
            if (this._layoutType === ccui.Layout.LINEAR_HORIZONTAL) {
                switch (direction){
                    case ccui.Widget.LEFT:
                        return this._getPreviousFocusedWidget(direction, current);
                    break;
                    case ccui.Widget.RIGHT:
                        return this._getNextFocusedWidget(direction, current);
                    break;
                    case ccui.Widget.DOWN:
                    case ccui.Widget.UP:
                        if (this._isLastWidgetInContainer(this, direction)){
                            if (this._isWidgetAncestorSupportLoopFocus(current, direction))
                                return ccui.Widget.prototype.findNextFocusedWidget.call(this, direction, this);
                            return current;
                        } else {
                            return ccui.Widget.prototype.findNextFocusedWidget.call(this, direction, this);
                        }
                    break;
                    default:
                        cc.assert(0, "Invalid Focus Direction");
                        return current;
                }
            } else if (this._layoutType === ccui.Layout.LINEAR_VERTICAL) {
                switch (direction){
                    case ccui.Widget.LEFT:
                    case ccui.Widget.RIGHT:
                        if (this._isLastWidgetInContainer(this, direction)) {
                            if (this._isWidgetAncestorSupportLoopFocus(current, direction))
                                return ccui.Widget.prototype.findNextFocusedWidget.call(this, direction, this);
                            return current;
                        }
                        else
                            return ccui.Widget.prototype.findNextFocusedWidget.call(this, direction, this);
                     break;
                    case ccui.Widget.DOWN:
                        return this._getNextFocusedWidget(direction, current);
                        break;
                    case ccui.Widget.UP:
                        return this._getPreviousFocusedWidget(direction, current);
                        break;
                    default:
                        cc.assert(0, "Invalid Focus Direction");
                        return current;
                }
            } else {
                cc.assert(0, "Un Supported Layout type, please use VBox and HBox instead!!!");
                return current;
            }
        } else
            return current;
    },
    onPassFocusToChild: null,
    init: function () {
        if (ccui.Widget.prototype.init.call(this)) {
            this.ignoreContentAdaptWithSize(false);
            this.setContentSize(cc.size(0, 0));
            this.setAnchorPoint(0, 0);
            this.onPassFocusToChild  = this._findNearestChildWidgetIndex.bind(this);
            return true;
        }
        return false;
    },
    addChild: function (widget, zOrder, tag) {
        if ((widget instanceof ccui.Widget)) {
            this._supplyTheLayoutParameterLackToChild(widget);
        }
        ccui.Widget.prototype.addChild.call(this, widget, zOrder, tag);
        this._doLayoutDirty = true;
    },
    removeChild: function (widget, cleanup) {
        ccui.Widget.prototype.removeChild.call(this, widget, cleanup);
        this._doLayoutDirty = true;
    },
    removeAllChildren: function (cleanup) {
        ccui.Widget.prototype.removeAllChildren.call(this, cleanup);
        this._doLayoutDirty = true;
    },
    removeAllChildrenWithCleanup: function(cleanup){
        ccui.Widget.prototype.removeAllChildrenWithCleanup.call(this, cleanup);
        this._doLayoutDirty = true;
    },
    isClippingEnabled: function () {
        return this._clippingEnabled;
    },
    visit: function (parentCmd) {
        if (!this._visible)
            return;
        this._adaptRenderers();
        this._doLayout();
        if (this._clippingEnabled) {
            switch (this._clippingType) {
                case ccui.Layout.CLIPPING_STENCIL:
                    this._renderCmd.stencilClippingVisit(parentCmd);
                    break;
                case ccui.Layout.CLIPPING_SCISSOR:
                    this._renderCmd.scissorClippingVisit(parentCmd);
                    break;
                default:
                    break;
            }
        } else
            ccui.Widget.prototype.visit.call(this, parentCmd);
    },
    setClippingEnabled: function (able) {
        if (able === this._clippingEnabled)
            return;
        this._clippingEnabled = able;
        switch (this._clippingType) {
            case ccui.Layout.CLIPPING_STENCIL:
                if (able){
                    this._clippingStencil = new cc.DrawNode();
                    this._renderCmd.rebindStencilRendering(this._clippingStencil);
                    if (this._running)
                        this._clippingStencil.onEnter();
                    this._setStencilClippingSize(this._contentSize);
                } else {
                    if (this._running && this._clippingStencil)
                        this._clippingStencil.onExit();
                    this._clippingStencil = null;
                }
                break;
            default:
                break;
        }
    },
    setClippingType: function (type) {
        if (type === this._clippingType)
            return;
        if(cc._renderType === cc._RENDER_TYPE_CANVAS && type === ccui.Layout.CLIPPING_SCISSOR){
            cc.log("Only supports STENCIL on canvas mode.");
            return;
        }
        var clippingEnabled = this.isClippingEnabled();
        this.setClippingEnabled(false);
        this._clippingType = type;
        this.setClippingEnabled(clippingEnabled);
    },
    getClippingType: function () {
        return this._clippingType;
    },
    _setStencilClippingSize: function (size) {
        if (this._clippingEnabled && this._clippingType === ccui.Layout.CLIPPING_STENCIL) {
            var rect = [];
            rect[0] = cc.p(0, 0);
            rect[1] = cc.p(size.width, 0);
            rect[2] = cc.p(size.width, size.height);
            rect[3] = cc.p(0, size.height);
            var green = cc.color.GREEN;
            this._clippingStencil.clear();
            this._clippingStencil.drawPoly(rect, 4, green, 0, green);
        }
    },
    _getClippingRect: function () {
        if (this._clippingRectDirty) {
            var worldPos = this.convertToWorldSpace(cc.p(0, 0));
            var t = this.getNodeToWorldTransform();
            var scissorWidth = this._contentSize.width * t.a;
            var scissorHeight = this._contentSize.height * t.d;
            var parentClippingRect;
            var parent = this;
            while (parent) {
                parent = parent.getParent();
                if (parent && parent instanceof ccui.Layout && parent.isClippingEnabled()) {
                    this._clippingParent = parent;
                    break;
                }
            }
            if (this._clippingParent) {
                parentClippingRect = this._clippingParent._getClippingRect();
                var finalX = worldPos.x - (scissorWidth * this._anchorPoint.x);
                var finalY = worldPos.y - (scissorHeight * this._anchorPoint.y);
                var finalWidth = scissorWidth;
                var finalHeight = scissorHeight;
                var leftOffset = worldPos.x - parentClippingRect.x;
                if (leftOffset < 0) {
                    finalX = parentClippingRect.x;
                    finalWidth += leftOffset;
                }
                var rightOffset = (worldPos.x + scissorWidth) - (parentClippingRect.x + parentClippingRect.width);
                if (rightOffset > 0)
                    finalWidth -= rightOffset;
                var topOffset = (worldPos.y + scissorHeight) - (parentClippingRect.y + parentClippingRect.height);
                if (topOffset > 0)
                    finalHeight -= topOffset;
                var bottomOffset = worldPos.y - parentClippingRect.y;
                if (bottomOffset < 0) {
                    finalY = parentClippingRect.x;
                    finalHeight += bottomOffset;
                }
                if (finalWidth < 0)
                    finalWidth = 0;
                if (finalHeight < 0)
                    finalHeight = 0;
                this._clippingRect.x = finalX;
                this._clippingRect.y = finalY;
                this._clippingRect.width = finalWidth;
                this._clippingRect.height = finalHeight;
            } else {
                this._clippingRect.x = worldPos.x - (scissorWidth * this._anchorPoint.x);
                this._clippingRect.y = worldPos.y - (scissorHeight * this._anchorPoint.y);
                this._clippingRect.width = scissorWidth;
                this._clippingRect.height = scissorHeight;
            }
            this._clippingRectDirty = false;
        }
        return this._clippingRect;
    },
    _onSizeChanged: function () {
        ccui.Widget.prototype._onSizeChanged.call(this);
        var locContentSize = this._contentSize;
        this._setStencilClippingSize(locContentSize);
        this._doLayoutDirty = true;
        this._clippingRectDirty = true;
        if (this._backGroundImage) {
            this._backGroundImage.setPosition(locContentSize.width * 0.5, locContentSize.height * 0.5);
            if (this._backGroundScale9Enabled && this._backGroundImage instanceof ccui.Scale9Sprite)
                this._backGroundImage.setPreferredSize(locContentSize);
        }
        if (this._colorRender)
            this._colorRender.setContentSize(locContentSize);
        if (this._gradientRender)
            this._gradientRender.setContentSize(locContentSize);
    },
    setBackGroundImageScale9Enabled: function (able) {
        if (this._backGroundScale9Enabled === able)
            return;
        this.removeProtectedChild(this._backGroundImage);
        this._backGroundImage = null;
        this._backGroundScale9Enabled = able;
        this._addBackGroundImage();
        this.setBackGroundImage(this._backGroundImageFileName, this._bgImageTexType);
        this.setBackGroundImageCapInsets(this._backGroundImageCapInsets);
    },
    isBackGroundImageScale9Enabled: function () {
        return this._backGroundScale9Enabled;
    },
    setBackGroundImage: function (fileName, texType) {
        if (!fileName)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        if (this._backGroundImage === null){
            this._addBackGroundImage();
            this.setBackGroundImageScale9Enabled(this._backGroundScale9Enabled);
        }
        this._backGroundImageFileName = fileName;
        this._bgImageTexType = texType;
        var locBackgroundImage = this._backGroundImage;
        switch (this._bgImageTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                locBackgroundImage.initWithFile(fileName);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                locBackgroundImage.initWithSpriteFrameName(fileName);
                break;
            default:
                break;
        }
        if (this._backGroundScale9Enabled)
            locBackgroundImage.setPreferredSize(this._contentSize);
        this._backGroundImageTextureSize = locBackgroundImage.getContentSize();
        locBackgroundImage.setPosition(this._contentSize.width * 0.5, this._contentSize.height * 0.5);
        this._updateBackGroundImageColor();
    },
    setBackGroundImageCapInsets: function (capInsets) {
        if(!capInsets)
            return;
        var locInsets = this._backGroundImageCapInsets;
        locInsets.x = capInsets.x;
        locInsets.y = capInsets.y;
        locInsets.width = capInsets.width;
        locInsets.height = capInsets.height;
        if (this._backGroundScale9Enabled)
            this._backGroundImage.setCapInsets(capInsets);
    },
    getBackGroundImageCapInsets: function () {
        return cc.rect(this._backGroundImageCapInsets);
    },
    _supplyTheLayoutParameterLackToChild: function (locChild) {
        if (!locChild) {
            return;
        }
        switch (this._layoutType) {
            case ccui.Layout.ABSOLUTE:
                break;
            case ccui.Layout.LINEAR_HORIZONTAL:
            case ccui.Layout.LINEAR_VERTICAL:
                var layoutParameter = locChild.getLayoutParameter(ccui.LayoutParameter.LINEAR);
                if (!layoutParameter)
                    locChild.setLayoutParameter(new ccui.LinearLayoutParameter());
                break;
            case ccui.Layout.RELATIVE:
                var layoutParameter = locChild.getLayoutParameter(ccui.LayoutParameter.RELATIVE);
                if (!layoutParameter)
                    locChild.setLayoutParameter(new ccui.RelativeLayoutParameter());
                break;
            default:
                break;
        }
    },
    _addBackGroundImage: function () {
        var contentSize = this._contentSize;
        if (this._backGroundScale9Enabled) {
            this._backGroundImage = new ccui.Scale9Sprite();
            this._backGroundImage.setPreferredSize(contentSize);
        } else
            this._backGroundImage = new cc.Sprite();
        this.addProtectedChild(this._backGroundImage, ccui.Layout.BACKGROUND_IMAGE_ZORDER, -1);
        this._backGroundImage.setPosition(contentSize.width * 0.5, contentSize.height * 0.5);
    },
    removeBackGroundImage: function () {
        if (!this._backGroundImage)
            return;
        this.removeProtectedChild(this._backGroundImage);
        this._backGroundImage = null;
        this._backGroundImageFileName = "";
        this._backGroundImageTextureSize.width = 0;
        this._backGroundImageTextureSize.height = 0;
    },
    setBackGroundColorType: function (type) {
        if (this._colorType === type)
            return;
        switch (this._colorType) {
            case ccui.Layout.BG_COLOR_NONE:
                if (this._colorRender) {
                    this.removeProtectedChild(this._colorRender);
                    this._colorRender = null;
                }
                if (this._gradientRender) {
                    this.removeProtectedChild(this._gradientRender);
                    this._gradientRender = null;
                }
                break;
            case ccui.Layout.BG_COLOR_SOLID:
                if (this._colorRender) {
                    this.removeProtectedChild(this._colorRender);
                    this._colorRender = null;
                }
                break;
            case ccui.Layout.BG_COLOR_GRADIENT:
                if (this._gradientRender) {
                    this.removeProtectedChild(this._gradientRender);
                    this._gradientRender = null;
                }
                break;
            default:
                break;
        }
        this._colorType = type;
        switch (this._colorType) {
            case ccui.Layout.BG_COLOR_NONE:
                break;
            case ccui.Layout.BG_COLOR_SOLID:
                this._colorRender = new cc.LayerColor();
                this._colorRender.setContentSize(this._contentSize);
                this._colorRender.setOpacity(this._opacity);
                this._colorRender.setColor(this._color);
                this.addProtectedChild(this._colorRender, ccui.Layout.BACKGROUND_RENDERER_ZORDER, -1);
                break;
            case ccui.Layout.BG_COLOR_GRADIENT:
                this._gradientRender = new cc.LayerGradient(cc.color(255, 0, 0, 255), cc.color(0, 255, 0, 255));
                this._gradientRender.setContentSize(this._contentSize);
                this._gradientRender.setOpacity(this._opacity);
                this._gradientRender.setStartColor(this._startColor);
                this._gradientRender.setEndColor(this._endColor);
                this._gradientRender.setVector(this._alongVector);
                this.addProtectedChild(this._gradientRender, ccui.Layout.BACKGROUND_RENDERER_ZORDER, -1);
                break;
            default:
                break;
        }
    },
    getBackGroundColorType: function () {
        return this._colorType;
    },
    setBackGroundColor: function (color, endColor) {
        if (!endColor) {
            this._color.r = color.r;
            this._color.g = color.g;
            this._color.b = color.b;
            if (this._colorRender)
                this._colorRender.setColor(color);
        } else {
            this._startColor.r = color.r;
            this._startColor.g = color.g;
            this._startColor.b = color.b;
            if (this._gradientRender)
                this._gradientRender.setStartColor(color);
            this._endColor.r = endColor.r;
            this._endColor.g = endColor.g;
            this._endColor.b = endColor.b;
            if (this._gradientRender)
                this._gradientRender.setEndColor(endColor);
        }
    },
    getBackGroundColor: function () {
        var tmpColor = this._color;
        return cc.color(tmpColor.r, tmpColor.g, tmpColor.b, tmpColor.a);
    },
    getBackGroundStartColor: function () {
        var tmpColor = this._startColor;
        return cc.color(tmpColor.r, tmpColor.g, tmpColor.b, tmpColor.a);
    },
    getBackGroundEndColor: function () {
        var tmpColor = this._endColor;
        return cc.color(tmpColor.r, tmpColor.g, tmpColor.b, tmpColor.a);
    },
    setBackGroundColorOpacity: function (opacity) {
        this._opacity = opacity;
        switch (this._colorType) {
            case ccui.Layout.BG_COLOR_NONE:
                break;
            case ccui.Layout.BG_COLOR_SOLID:
                this._colorRender.setOpacity(opacity);
                break;
            case ccui.Layout.BG_COLOR_GRADIENT:
                this._gradientRender.setOpacity(opacity);
                break;
            default:
                break;
        }
    },
    getBackGroundColorOpacity: function () {
        return this._opacity;
    },
    setBackGroundColorVector: function (vector) {
        this._alongVector.x = vector.x;
        this._alongVector.y = vector.y;
        if (this._gradientRender) {
            this._gradientRender.setVector(vector);
        }
    },
    getBackGroundColorVector: function () {
        return this._alongVector;
    },
    setBackGroundImageColor: function (color) {
        this._backGroundImageColor.r = color.r;
        this._backGroundImageColor.g = color.g;
        this._backGroundImageColor.b = color.b;
        this._updateBackGroundImageColor();
    },
    setBackGroundImageOpacity: function (opacity) {
        this._backGroundImageColor.a = opacity;
        this.getBackGroundImageColor();
    },
    getBackGroundImageColor: function () {
        var color = this._backGroundImageColor;
        return cc.color(color.r, color.g, color.b, color.a);
    },
    getBackGroundImageOpacity: function () {
        return this._backGroundImageColor.a;
    },
    _updateBackGroundImageColor: function () {
        if(this._backGroundImage)
            this._backGroundImage.setColor(this._backGroundImageColor);
    },
    getBackGroundImageTextureSize: function () {
        return this._backGroundImageTextureSize;
    },
    setLayoutType: function (type) {
        this._layoutType = type;
        var layoutChildrenArray = this._children;
        var locChild = null;
        for (var i = 0; i < layoutChildrenArray.length; i++) {
            locChild = layoutChildrenArray[i];
            if(locChild instanceof ccui.Widget)
                this._supplyTheLayoutParameterLackToChild(locChild);
        }
        this._doLayoutDirty = true;
    },
    getLayoutType: function () {
        return this._layoutType;
    },
    requestDoLayout: function () {
        this._doLayoutDirty = true;
    },
    _doLayout: function () {
        if (!this._doLayoutDirty)
            return;
        this.sortAllChildren();
        var executant = ccui.getLayoutManager(this._layoutType);
        if (executant)
            executant._doLayout(this);
        this._doLayoutDirty = false;
    },
    _getLayoutContentSize: function(){
        return this.getContentSize();
    },
    _getLayoutElements: function(){
        return this.getChildren();
    },
    _updateBackGroundImageOpacity: function(){
        if (this._backGroundImage)
            this._backGroundImage.setOpacity(this._backGroundImageOpacity);
    },
    _updateBackGroundImageRGBA: function(){
        if (this._backGroundImage) {
            this._backGroundImage.setColor(this._backGroundImageColor);
            this._backGroundImage.setOpacity(this._backGroundImageOpacity);
        }
    },
    _getLayoutAccumulatedSize: function(){
        var children = this.getChildren();
        var  layoutSize = cc.size(0, 0);
        var widgetCount = 0, locSize;
        for(var i = 0, len = children.length; i < len; i++) {
            var layout = children[i];
            if (null !== layout && layout instanceof ccui.Layout){
                locSize = layout._getLayoutAccumulatedSize();
                layoutSize.width += locSize.width;
                layoutSize.height += locSize.height;
            } else {
                if (layout instanceof ccui.Widget) {
                    widgetCount++;
                    var m = layout.getLayoutParameter().getMargin();
                    locSize = layout.getContentSize();
                    layoutSize.width += locSize.width +  (m.right + m.left) * 0.5;
                    layoutSize.height += locSize.height +  (m.top + m.bottom) * 0.5;
                }
            }
        }
        var type = this.getLayoutType();
        if (type === ccui.Layout.LINEAR_HORIZONTAL)
            layoutSize.height = layoutSize.height - layoutSize.height/widgetCount * (widgetCount-1);
        if (type === ccui.Layout.LINEAR_VERTICAL)
            layoutSize.width = layoutSize.width - layoutSize.width/widgetCount * (widgetCount-1);
        return layoutSize;
    },
    _findNearestChildWidgetIndex: function(direction, baseWidget){
        if (baseWidget == null || baseWidget === this)
            return this._findFirstFocusEnabledWidgetIndex();
        var index = 0, locChildren = this.getChildren();
        var count = locChildren.length, widgetPosition;
        var distance = cc.FLT_MAX, found = 0;
        if (direction === ccui.Widget.LEFT || direction === ccui.Widget.RIGHT || direction === ccui.Widget.DOWN || direction === ccui.Widget.UP) {
            widgetPosition = this._getWorldCenterPoint(baseWidget);
            while (index < count) {
                var w = locChildren[index];
                if (w && w instanceof ccui.Widget && w.isFocusEnabled()) {
                    var length = (w instanceof ccui.Layout)? w._calculateNearestDistance(baseWidget)
                        : cc.pLength(cc.pSub(this._getWorldCenterPoint(w), widgetPosition));
                    if (length < distance){
                        found = index;
                        distance = length;
                    }
                }
                index++;
            }
            return found;
        }
        cc.log("invalid focus direction!");
        return 0;
    },
    _findFarthestChildWidgetIndex: function(direction, baseWidget){
        if (baseWidget == null || baseWidget === this)
            return this._findFirstFocusEnabledWidgetIndex();
        var index = 0, locChildren = this.getChildren();
        var count = locChildren.length;
        var distance = -cc.FLT_MAX, found = 0;
        if (direction === ccui.Widget.LEFT || direction === ccui.Widget.RIGHT || direction === ccui.Widget.DOWN || direction === ccui.Widget.UP) {
            var widgetPosition =  this._getWorldCenterPoint(baseWidget);
            while (index <  count) {
                var w = locChildren[index];
                if (w && w instanceof ccui.Widget && w.isFocusEnabled()) {
                    var length = (w instanceof ccui.Layout)?w._calculateFarthestDistance(baseWidget)
                        : cc.pLength(cc.pSub(this._getWorldCenterPoint(w), widgetPosition));
                    if (length > distance){
                        found = index;
                        distance = length;
                    }
                }
                index++;
            }
            return  found;
        }
        cc.log("invalid focus direction!!!");
        return 0;
    },
    _calculateNearestDistance: function(baseWidget){
        var distance = cc.FLT_MAX;
        var widgetPosition =  this._getWorldCenterPoint(baseWidget);
        var locChildren = this._children;
        for (var i = 0, len = locChildren.length; i < len; i++) {
            var widget = locChildren[i], length;
            if (widget instanceof ccui.Layout)
                length = widget._calculateNearestDistance(baseWidget);
            else {
                if (widget instanceof ccui.Widget && widget.isFocusEnabled())
                    length = cc.pLength(cc.pSub(this._getWorldCenterPoint(widget), widgetPosition));
                else
                    continue;
            }
            if (length < distance)
                distance = length;
        }
        return distance;
    },
    _calculateFarthestDistance:function(baseWidget){
        var distance = -cc.FLT_MAX;
        var widgetPosition =  this._getWorldCenterPoint(baseWidget);
        var locChildren = this._children;
        for (var i = 0, len = locChildren.length; i < len; i++) {
            var layout = locChildren[i];
            var length;
            if (layout instanceof ccui.Layout)
                length = layout._calculateFarthestDistance(baseWidget);
            else {
                if (layout instanceof ccui.Widget && layout.isFocusEnabled()) {
                    var wPosition = this._getWorldCenterPoint(layout);
                    length = cc.pLength(cc.pSub(wPosition, widgetPosition));
                } else
                    continue;
            }
            if (length > distance)
                distance = length;
        }
        return distance;
    },
    _findProperSearchingFunctor: function(direction, baseWidget){
        if (baseWidget == null)
            return;
        var previousWidgetPosition = this._getWorldCenterPoint(baseWidget);
        var widgetPosition = this._getWorldCenterPoint(this._findFirstNonLayoutWidget());
        if (direction === ccui.Widget.LEFT) {
            this.onPassFocusToChild = (previousWidgetPosition.x > widgetPosition.x) ? this._findNearestChildWidgetIndex.bind(this)
                : this._findFarthestChildWidgetIndex.bind(this);
        } else if (direction === ccui.Widget.RIGHT) {
            this.onPassFocusToChild = (previousWidgetPosition.x > widgetPosition.x) ? this._findFarthestChildWidgetIndex.bind(this)
                : this._findNearestChildWidgetIndex.bind(this);
        }else if(direction === ccui.Widget.DOWN) {
            this.onPassFocusToChild = (previousWidgetPosition.y > widgetPosition.y) ? this._findNearestChildWidgetIndex.bind(this)
                : this._findFarthestChildWidgetIndex.bind(this);
        }else if(direction === ccui.Widget.UP) {
            this.onPassFocusToChild = (previousWidgetPosition.y < widgetPosition.y) ? this._findNearestChildWidgetIndex.bind(this)
                : this._findFarthestChildWidgetIndex.bind(this);
        }else
            cc.log("invalid direction!");
    },
    _findFirstNonLayoutWidget:function(){
        var locChildren = this._children;
        for(var i = 0, len = locChildren.length; i < len; i++) {
            var child = locChildren[i];
            if (child instanceof ccui.Layout){
                var widget = child._findFirstNonLayoutWidget();
                if(widget)
                    return widget;
            } else{
                if (child instanceof ccui.Widget)
                    return child;
            }
        }
        return null;
    },
    _findFirstFocusEnabledWidgetIndex: function(){
        var index = 0, locChildren = this.getChildren();
        var count = locChildren.length;
        while (index < count) {
            var w = locChildren[index];
            if (w && w instanceof ccui.Widget && w.isFocusEnabled())
                return index;
            index++;
        }
        return 0;
    },
    _findFocusEnabledChildWidgetByIndex: function(index){
        var widget = this._getChildWidgetByIndex(index);
        if (widget){
            if (widget.isFocusEnabled())
                return widget;
            index = index + 1;
            return this._findFocusEnabledChildWidgetByIndex(index);
        }
        return null;
    },
    _getWorldCenterPoint: function(widget){
        var widgetSize = widget instanceof ccui.Layout ? widget._getLayoutAccumulatedSize() :  widget.getContentSize();
        return widget.convertToWorldSpace(cc.p(widgetSize.width /2, widgetSize.height /2));
    },
    _getNextFocusedWidget: function(direction, current){
        var nextWidget = null, locChildren = this._children;
        var  previousWidgetPos = locChildren.indexOf(current);
        previousWidgetPos = previousWidgetPos + 1;
        if (previousWidgetPos < locChildren.length) {
            nextWidget = this._getChildWidgetByIndex(previousWidgetPos);
            if (nextWidget) {
                if (nextWidget.isFocusEnabled()) {
                    if (nextWidget instanceof ccui.Layout) {
                        nextWidget._isFocusPassing = true;
                        return nextWidget.findNextFocusedWidget(direction, nextWidget);
                    } else {
                        this.dispatchFocusEvent(current, nextWidget);
                        return nextWidget;
                    }
                } else
                    return this._getNextFocusedWidget(direction, nextWidget);
            } else
                return current;
        } else {
            if (this._loopFocus) {
                if (this._checkFocusEnabledChild()) {
                    previousWidgetPos = 0;
                    nextWidget = this._getChildWidgetByIndex(previousWidgetPos);
                    if (nextWidget.isFocusEnabled()) {
                        if (nextWidget instanceof ccui.Layout) {
                            nextWidget._isFocusPassing = true;
                            return nextWidget.findNextFocusedWidget(direction, nextWidget);
                        } else {
                            this.dispatchFocusEvent(current, nextWidget);
                            return nextWidget;
                        }
                    } else
                        return this._getNextFocusedWidget(direction, nextWidget);
                } else
                    return (current instanceof ccui.Layout) ? current : ccui.Widget._focusedWidget;
            } else{
                if (this._isLastWidgetInContainer(current, direction)){
                    if (this._isWidgetAncestorSupportLoopFocus(this, direction))
                        return ccui.Widget.prototype.findNextFocusedWidget.call(this, direction, this);
                    return (current instanceof ccui.Layout) ? current : ccui.Widget._focusedWidget;
                } else
                    return ccui.Widget.prototype.findNextFocusedWidget.call(this, direction, this);
            }
        }
    },
    _getPreviousFocusedWidget: function(direction, current){
        var nextWidget = null, locChildren = this._children;
        var previousWidgetPos = locChildren.indexOf(current);
        previousWidgetPos = previousWidgetPos - 1;
        if (previousWidgetPos >= 0){
            nextWidget = this._getChildWidgetByIndex(previousWidgetPos);
            if (nextWidget.isFocusEnabled()) {
                if (nextWidget instanceof ccui.Layout){
                    nextWidget._isFocusPassing = true;
                    return nextWidget.findNextFocusedWidget(direction, nextWidget);
                }
                this.dispatchFocusEvent(current, nextWidget);
                return nextWidget;
            } else
                return this._getPreviousFocusedWidget(direction, nextWidget);
        }else {
            if (this._loopFocus){
                if (this._checkFocusEnabledChild()) {
                    previousWidgetPos = locChildren.length -1;
                    nextWidget = this._getChildWidgetByIndex(previousWidgetPos);
                    if (nextWidget.isFocusEnabled()){
                        if (nextWidget instanceof ccui.Layout){
                            nextWidget._isFocusPassing = true;
                            return nextWidget.findNextFocusedWidget(direction, nextWidget);
                        } else {
                            this.dispatchFocusEvent(current, nextWidget);
                            return nextWidget;
                        }
                    } else
                        return this._getPreviousFocusedWidget(direction, nextWidget);
                } else
                    return (current instanceof ccui.Layout) ? current : ccui.Widget._focusedWidget;
            } else {
                if (this._isLastWidgetInContainer(current, direction)) {
                    if (this._isWidgetAncestorSupportLoopFocus(this, direction))
                        return ccui.Widget.prototype.findNextFocusedWidget.call(this, direction, this);
                    return (current instanceof ccui.Layout) ? current : ccui.Widget._focusedWidget;
                } else
                    return ccui.Widget.prototype.findNextFocusedWidget.call(this, direction, this);
            }
        }
    },
    _getChildWidgetByIndex: function (index) {
        var locChildren = this._children;
        var size = locChildren.length, count = 0, oldIndex = index;
        while (index < size) {
            var firstChild = locChildren[index];
            if (firstChild && firstChild instanceof ccui.Widget)
                return firstChild;
            count++;
            index++;
        }
        var begin = 0;
        while (begin < oldIndex) {
            var child = locChildren[begin];
            if (child && child instanceof ccui.Widget)
                return child;
            count++;
            begin++;
        }
        return null;
    },
    _isLastWidgetInContainer:function(widget, direction){
        var parent = widget.getParent();
        if (parent == null || !(parent instanceof ccui.Layout))
            return true;
        var container = parent.getChildren();
        var index = container.indexOf(widget);
        if (parent.getLayoutType() === ccui.Layout.LINEAR_HORIZONTAL) {
            if (direction === ccui.Widget.LEFT) {
                if (index === 0)
                    return this._isLastWidgetInContainer(parent, direction);
                else
                    return false;
            }
            if (direction === ccui.Widget.RIGHT) {
                if (index === container.length - 1)
                    return this._isLastWidgetInContainer(parent, direction);
                else
                    return false;
            }
            if (direction === ccui.Widget.DOWN)
                return this._isLastWidgetInContainer(parent, direction);
            if (direction === ccui.Widget.UP)
                return this._isLastWidgetInContainer(parent, direction);
        } else if(parent.getLayoutType() === ccui.Layout.LINEAR_VERTICAL){
            if (direction === ccui.Widget.UP){
                if (index === 0)
                    return this._isLastWidgetInContainer(parent, direction);
                else
                    return false;
            }
            if (direction === ccui.Widget.DOWN) {
                if (index === container.length - 1)
                    return this._isLastWidgetInContainer(parent, direction);
                else
                    return false;
            }
            if (direction === ccui.Widget.LEFT)
                return this._isLastWidgetInContainer(parent, direction);
            if (direction === ccui.Widget.RIGHT)
                return this._isLastWidgetInContainer(parent, direction);
        } else {
            cc.log("invalid layout Type");
            return false;
        }
    },
    _isWidgetAncestorSupportLoopFocus: function(widget, direction){
        var parent = widget.getParent();
        if (parent == null || !(parent instanceof ccui.Layout))
            return false;
        if (parent.isLoopFocus()) {
            var layoutType = parent.getLayoutType();
            if (layoutType === ccui.Layout.LINEAR_HORIZONTAL) {
                if (direction === ccui.Widget.LEFT || direction === ccui.Widget.RIGHT)
                    return true;
                else
                    return this._isWidgetAncestorSupportLoopFocus(parent, direction);
            }
            if (layoutType === ccui.Layout.LINEAR_VERTICAL){
                if (direction === ccui.Widget.DOWN || direction === ccui.Widget.UP)
                    return true;
                else
                    return this._isWidgetAncestorSupportLoopFocus(parent, direction);
            } else{
                cc.assert(0, "invalid layout type");
                return false;
            }
        } else
            return this._isWidgetAncestorSupportLoopFocus(parent, direction);
    },
    _passFocusToChild: function(direction, current){
        if (this._checkFocusEnabledChild()) {
            var previousWidget = ccui.Widget.getCurrentFocusedWidget();
            this._findProperSearchingFunctor(direction, previousWidget);
            var index = this.onPassFocusToChild(direction, previousWidget);
            var widget = this._getChildWidgetByIndex(index);
            if (widget instanceof ccui.Layout) {
                widget._isFocusPassing = true;
                return widget.findNextFocusedWidget(direction, widget);
            } else {
                this.dispatchFocusEvent(current, widget);
                return widget;
            }
        }else
            return this;
    },
    _checkFocusEnabledChild: function(){
        var locChildren = this._children;
        for(var i = 0, len = locChildren.length; i < len; i++){
            var widget = locChildren[i];
            if (widget && widget instanceof ccui.Widget && widget.isFocusEnabled())
                return true;
        }
        return false;
    },
    getDescription: function () {
        return "Layout";
    },
    _createCloneInstance: function () {
        return new ccui.Layout();
    },
    _copyClonedWidgetChildren: function (model) {
        ccui.Widget.prototype._copyClonedWidgetChildren.call(this, model);
    },
    _copySpecialProperties: function (layout) {
        if(!(layout instanceof  ccui.Layout))
            return;
        this.setBackGroundImageScale9Enabled(layout._backGroundScale9Enabled);
        this.setBackGroundImage(layout._backGroundImageFileName, layout._bgImageTexType);
        this.setBackGroundImageCapInsets(layout._backGroundImageCapInsets);
        this.setBackGroundColorType(layout._colorType);
        this.setBackGroundColor(layout._color);
        this.setBackGroundColor(layout._startColor, layout._endColor);
        this.setBackGroundColorOpacity(layout._opacity);
        this.setBackGroundColorVector(layout._alongVector);
        this.setLayoutType(layout._layoutType);
        this.setClippingEnabled(layout._clippingEnabled);
        this.setClippingType(layout._clippingType);
        this._loopFocus = layout._loopFocus;
        this.__passFocusToChild = layout.__passFocusToChild;
        this._isInterceptTouch = layout._isInterceptTouch;
    },
    forceDoLayout: function(){
        this.requestDoLayout();
        this._doLayout();
    },
    _createRenderCmd: function(){
        if(cc._renderType === cc._RENDER_TYPE_WEBGL)
            return new ccui.Layout.WebGLRenderCmd(this);
        else
            return new ccui.Layout.CanvasRenderCmd(this);
    }
});
var _p = ccui.Layout.prototype;
_p.clippingEnabled;
cc.defineGetterSetter(_p, "clippingEnabled", _p.isClippingEnabled, _p.setClippingEnabled);
_p.clippingType;
cc.defineGetterSetter(_p, "clippingType", null, _p.setClippingType);
_p.layoutType;
cc.defineGetterSetter(_p, "layoutType", _p.getLayoutType, _p.setLayoutType);
_p = null;
ccui.Layout.create = function () {
    return new ccui.Layout();
};
ccui.Layout.BG_COLOR_NONE = 0;
ccui.Layout.BG_COLOR_SOLID = 1;
ccui.Layout.BG_COLOR_GRADIENT = 2;
ccui.Layout.ABSOLUTE = 0;
ccui.Layout.LINEAR_VERTICAL = 1;
ccui.Layout.LINEAR_HORIZONTAL = 2;
ccui.Layout.RELATIVE = 3;
ccui.Layout.CLIPPING_STENCIL = 0;
ccui.Layout.CLIPPING_SCISSOR = 1;
ccui.Layout.BACKGROUND_IMAGE_ZORDER = -2;
ccui.Layout.BACKGROUND_RENDERER_ZORDER = -2;
(function(){
    ccui.Layout.CanvasRenderCmd = function(renderable){
        ccui.ProtectedNode.CanvasRenderCmd.call(this, renderable);
        this._needDraw = false;
        this._clipElemType = false;
        this._locCache = null;
        this._rendererSaveCmd = new cc.CustomRenderCmd(this, this._onRenderSaveCmd);
        this._rendererSaveCmdSprite = new cc.CustomRenderCmd(this, this._onRenderSaveSpriteCmd);
        this._rendererClipCmd = new cc.CustomRenderCmd(this, this._onRenderClipCmd);
        this._rendererRestoreCmd = new cc.CustomRenderCmd(this, this._onRenderRestoreCmd);
    };
    var proto = ccui.Layout.CanvasRenderCmd.prototype = Object.create(ccui.ProtectedNode.CanvasRenderCmd.prototype);
    proto.constructor = ccui.Layout.CanvasRenderCmd;
    proto.visit = function(parentCmd){
        var node = this._node;
        if (!node._visible)
            return;
        node._adaptRenderers();
        node._doLayout();
        if (node._clippingEnabled) {
            switch (node._clippingType) {
                case ccui.Layout.CLIPPING_STENCIL:
                    this.stencilClippingVisit(parentCmd);
                    break;
                case ccui.Layout.CLIPPING_SCISSOR:
                    this.scissorClippingVisit(parentCmd);
                    break;
                default:
                    break;
            }
        } else
            ccui.Widget.CanvasRenderCmd.prototype.visit.call(this, parentCmd);
    };
    proto._onRenderSaveCmd = function(ctx, scaleX, scaleY){
        var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
        if (this._clipElemType) {
            var canvas = context.canvas;
            this._locCache = ccui.Layout.CanvasRenderCmd._getSharedCache();
            this._locCache.width = canvas.width;
            this._locCache.height = canvas.height;
            var locCacheCtx = this._locCache.getContext("2d");
            locCacheCtx.drawImage(canvas, 0, 0);
        } else {
            wrapper.save();
            wrapper.save();
            wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        }
    };
    proto._onRenderSaveSpriteCmd = function(ctx){
        var wrapper = ctx || cc._renderContext;
        if (this._clipElemType) {
            wrapper.setCompositeOperation("destination-in");
        }
    };
    proto._onRenderClipCmd = function(ctx){
        var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
        if (!this._clipElemType) {
            wrapper.restore();
            context.clip();
        }
    };
    proto._onRenderRestoreCmd = function(ctx){
        var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
        if (this._clipElemType) {
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.globalCompositeOperation = "destination-over";
            context.drawImage(this._locCache, 0, 0);
            context.restore();
        }else{
            wrapper.restore();
        }
    };
    proto.rebindStencilRendering = function(stencil){
        stencil._renderCmd.rendering = this.__stencilDraw;
    };
    proto.__stencilDraw = function(ctx,scaleX, scaleY){
        var wrapper = ctx || cc._renderContext, locContext = wrapper.getContext(), buffer = this._buffer;
        for (var i = 0, bufLen = buffer.length; i < bufLen; i++) {
            var element = buffer[i], vertices = element.verts;
            var firstPoint = vertices[0];
            locContext.beginPath();
            locContext.moveTo(firstPoint.x * scaleX, -firstPoint.y * scaleY);
            for (var j = 1, len = vertices.length; j < len; j++)
                locContext.lineTo(vertices[j].x * scaleX, -vertices[j].y * scaleY);
            locContext.closePath();
        }
    };
    proto.stencilClippingVisit = proto.scissorClippingVisit = function(parentCmd){
        var node = this._node;
        if (!node._clippingStencil || !node._clippingStencil.isVisible())
            return;
        this._clipElemType = node._stencil instanceof cc.Sprite;
        this._syncStatus(parentCmd);
        this._dirtyFlag = 0;
        cc.renderer.pushRenderCommand(this._rendererSaveCmd);
        if (this._clipElemType) {
            cc.ProtectedNode.prototype.visit.call(node, parentCmd);
            cc.renderer.pushRenderCommand(this._rendererSaveCmdSprite);
        }
        node._clippingStencil.visit(this);
        cc.renderer.pushRenderCommand(this._rendererClipCmd);
        if (!this._clipElemType) {
            node.sortAllChildren();
            node.sortAllProtectedChildren();
            var children = node._children;
            var j=0, locProtectChildren = node._protectedChildren, i = 0, locChild;
            var iLen = children.length, jLen = locProtectChildren.length;
            for( ; i < iLen; i++ ){
                locChild = children[i];
                if ( locChild && locChild.getLocalZOrder() < 0 )
                    locChild.visit(this);
                else
                    break;
            }
            for( ; j < jLen; j++ ) {
                locChild = locProtectChildren[j];
                if ( locChild && locChild.getLocalZOrder() < 0 )
                    locChild.visit(this);
                else
                    break;
            }
            for (; i < iLen; i++)
                children[i].visit(this);
            for (; j < jLen; j++)
                locProtectChildren[j].visit(this);
            cc.renderer.pushRenderCommand(this._rendererRestoreCmd);
        }
    };
    ccui.Layout.CanvasRenderCmd._getSharedCache = function () {
        return (cc.ClippingNode._sharedCache) || (cc.ClippingNode._sharedCache = cc.newElement("canvas"));
    };
})();
(function(){
    if(!ccui.ProtectedNode.WebGLRenderCmd)
        return;
    ccui.Layout.WebGLRenderCmd = function(renderable){
        ccui.ProtectedNode.WebGLRenderCmd.call(this, renderable);
        this._needDraw = false;
        this._currentStencilEnabled = 0;
        this._currentStencilWriteMask = 0;
        this._currentStencilFunc = 0;
        this._currentStencilRef = 0;
        this._currentStencilValueMask = 0;
        this._currentStencilFail = 0;
        this._currentStencilPassDepthFail = 0;
        this._currentStencilPassDepthPass = 0;
        this._currentDepthWriteMask = false;
        this._mask_layer_le = 0;
        this._beforeVisitCmdStencil = new cc.CustomRenderCmd(this, this._onBeforeVisitStencil);
        this._afterDrawStencilCmd = new cc.CustomRenderCmd(this, this._onAfterDrawStencil);
        this._afterVisitCmdStencil = new cc.CustomRenderCmd(this, this._onAfterVisitStencil);
        this._beforeVisitCmdScissor = new cc.CustomRenderCmd(this, this._onBeforeVisitScissor);
        this._afterVisitCmdScissor = new cc.CustomRenderCmd(this, this._onAfterVisitScissor);
    };
    var proto = ccui.Layout.WebGLRenderCmd.prototype = Object.create(ccui.ProtectedNode.WebGLRenderCmd.prototype);
    proto.constructor = ccui.Layout.WebGLRenderCmd;
    proto.visit = function(parentCmd){
        var node = this._node;
        if (!node._visible)
            return;
        node._adaptRenderers();
        node._doLayout();
        if (node._clippingEnabled) {
            switch (node._clippingType) {
                case ccui.Layout.CLIPPING_STENCIL:
                    this.stencilClippingVisit(parentCmd);
                    break;
                case ccui.Layout.CLIPPING_SCISSOR:
                    this.scissorClippingVisit(parentCmd);
                    break;
                default:
                    break;
            }
        } else
            ccui.Widget.WebGLRenderCmd.prototype.visit.call(this, parentCmd);
    };
    proto._onBeforeVisitStencil = function(ctx){
        var gl = ctx || cc._renderContext;
        ccui.Layout.WebGLRenderCmd._layer++;
        var mask_layer = 0x1 << ccui.Layout.WebGLRenderCmd._layer;
        var mask_layer_l = mask_layer - 1;
        this._mask_layer_le = mask_layer | mask_layer_l;
        this._currentStencilEnabled = gl.isEnabled(gl.STENCIL_TEST);
        this._currentStencilWriteMask = gl.getParameter(gl.STENCIL_WRITEMASK);
        this._currentStencilFunc = gl.getParameter(gl.STENCIL_FUNC);
        this._currentStencilRef = gl.getParameter(gl.STENCIL_REF);
        this._currentStencilValueMask = gl.getParameter(gl.STENCIL_VALUE_MASK);
        this._currentStencilFail = gl.getParameter(gl.STENCIL_FAIL);
        this._currentStencilPassDepthFail = gl.getParameter(gl.STENCIL_PASS_DEPTH_FAIL);
        this._currentStencilPassDepthPass = gl.getParameter(gl.STENCIL_PASS_DEPTH_PASS);
        gl.enable(gl.STENCIL_TEST);
        gl.stencilMask(mask_layer);
        this._currentDepthWriteMask = gl.getParameter(gl.DEPTH_WRITEMASK);
        gl.depthMask(false);
        gl.stencilFunc(gl.NEVER, mask_layer, mask_layer);
        gl.stencilOp(gl.ZERO, gl.KEEP, gl.KEEP);
        this._drawFullScreenQuadClearStencil();
        gl.stencilFunc(gl.NEVER, mask_layer, mask_layer);
        gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);
    };
    proto._onAfterDrawStencil = function(ctx){
        var gl = ctx || cc._renderContext;
        gl.depthMask(this._currentDepthWriteMask);
        gl.stencilFunc(gl.EQUAL, this._mask_layer_le, this._mask_layer_le);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    };
    proto._onAfterVisitStencil = function(ctx){
        var gl = ctx || cc._renderContext;
        gl.stencilFunc(this._currentStencilFunc, this._currentStencilRef, this._currentStencilValueMask);
        gl.stencilOp(this._currentStencilFail, this._currentStencilPassDepthFail, this._currentStencilPassDepthPass);
        gl.stencilMask(this._currentStencilWriteMask);
        if (!this._currentStencilEnabled)
            gl.disable(gl.STENCIL_TEST);
        ccui.Layout.WebGLRenderCmd._layer--;
    };
    proto._onBeforeVisitScissor = function(ctx){
        var clippingRect = this._getClippingRect();
        var gl = ctx || cc._renderContext;
        gl.enable(gl.SCISSOR_TEST);
        cc.view.setScissorInPoints(clippingRect.x, clippingRect.y, clippingRect.width, clippingRect.height);
    };
    proto._onAfterVisitScissor = function(ctx){
        var gl = ctx || cc._renderContext;
        gl.disable(gl.SCISSOR_TEST);
    };
    proto._drawFullScreenQuadClearStencil = function(){
        cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
        cc.kmGLPushMatrix();
        cc.kmGLLoadIdentity();
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.kmGLPushMatrix();
        cc.kmGLLoadIdentity();
        cc._drawingUtil.drawSolidRect(cc.p(-1,-1), cc.p(1,1), cc.color(255, 255, 255, 255));
        cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
        cc.kmGLPopMatrix();
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.kmGLPopMatrix();
    };
    proto.rebindStencilRendering = function(stencil){};
    proto.transform = function(parentCmd, recursive){
        var node = this._node;
        ccui.ProtectedNode.WebGLRenderCmd.prototype.transform.call(this, parentCmd, recursive);
        if(node._clippingStencil)
            node._clippingStencil._renderCmd.transform(this, recursive);
    };
    proto.stencilClippingVisit = function (parentCmd) {
        var node = this._node;
        if (!node._clippingStencil || !node._clippingStencil.isVisible())
            return;
        if (ccui.Layout.WebGLRenderCmd._layer + 1 === cc.stencilBits) {
            ccui.Layout.WebGLRenderCmd._visit_once = true;
            if (ccui.Layout.WebGLRenderCmd._visit_once) {
                cc.log("Nesting more than " + cc.stencilBits + "stencils is not supported. Everything will be drawn without stencil for this node and its childs.");
                ccui.Layout.WebGLRenderCmd._visit_once = false;
            }
            cc.Node.prototype.visit.call(node, parentCmd);
            return;
        }
        cc.renderer.pushRenderCommand(this._beforeVisitCmdStencil);
        var currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        this._syncStatus(parentCmd);
        this._dirtyFlag = 0;
        currentStack.top = this._stackMatrix;
        node._clippingStencil.visit(this);
        cc.renderer.pushRenderCommand(this._afterDrawStencilCmd);
        var i = 0;
        var j = 0;
        node.sortAllChildren();
        node.sortAllProtectedChildren();
        var locChildren = node._children, locProtectChildren = node._protectedChildren;
        var iLen = locChildren.length, jLen = locProtectChildren.length, child;
        for( ; i < iLen; i++ ){
            child = locChildren[i];
            if ( child && child.getLocalZOrder() < 0 )
                child.visit(this);
            else
                break;
        }
        for( ; j < jLen; j++ ) {
            child = locProtectChildren[j];
            if ( child && child.getLocalZOrder() < 0 )
                child.visit(this);
            else
                break;
        }
        for (; i < iLen; i++)
            locChildren[i].visit(this);
        for (; j < jLen; j++)
            locProtectChildren[j].visit(this);
        cc.renderer.pushRenderCommand(this._afterVisitCmdStencil);
        currentStack.top = currentStack.stack.pop();
    };
    proto.scissorClippingVisit = function(parentCmd){
        cc.renderer.pushRenderCommand(this._beforeVisitCmdScissor);
        cc.ProtectedNode.prototype.visit.call(this._node, parentCmd);
        cc.renderer.pushRenderCommand(this._afterVisitCmdScissor);
    };
    ccui.Layout.WebGLRenderCmd._layer = -1;
    ccui.Layout.WebGLRenderCmd._visit_once = null;
})();
ccui.Margin = ccui.Class.extend({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    ctor: function (margin, top, right, bottom) {
        if (margin !== undefined && top === undefined) {
            this.left = margin.left;
            this.top = margin.top;
            this.right = margin.right;
            this.bottom = margin.bottom;
        }
        if (bottom !== undefined) {
            this.left = margin;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
        }
    },
    setMargin: function (l, t, r, b) {
        this.left = l;
        this.top = t;
        this.right = r;
        this.bottom = b;
    },
    equals: function (target) {
        return (this.left === target.left && this.top === target.top && this.right === target.right && this.bottom === target.bottom);
    }
});
ccui.MarginZero = function(){
    return new ccui.Margin(0,0,0,0);
};
ccui.LayoutParameter = ccui.Class.extend({
    _margin: null,
    _layoutParameterType: null,
    ctor: function () {
        this._margin = new ccui.Margin();
        this._layoutParameterType = ccui.LayoutParameter.NONE;
    },
    setMargin: function (margin) {
        if(cc.isObject(margin)){
            this._margin.left = margin.left;
            this._margin.top = margin.top;
            this._margin.right = margin.right;
            this._margin.bottom = margin.bottom;
        }else{
            this._margin.left = arguments[0];
            this._margin.top = arguments[1];
            this._margin.right = arguments[2];
            this._margin.bottom = arguments[3];
        }
    },
    getMargin: function () {
        return this._margin;
    },
    getLayoutType: function () {
        return this._layoutParameterType;
    },
    clone:function(){
        var parameter = this._createCloneInstance();
        parameter._copyProperties(this);
        return parameter;
    },
    _createCloneInstance:function(){
        return new ccui.LayoutParameter();
    },
    _copyProperties:function(model){
        this._margin.bottom = model._margin.bottom;
        this._margin.left = model._margin.left;
        this._margin.right = model._margin.right;
        this._margin.top = model._margin.top;
    }
});
ccui.LayoutParameter.create = function () {
    return new ccui.LayoutParameter();
};
ccui.LayoutParameter.NONE = 0;
ccui.LayoutParameter.LINEAR = 1;
ccui.LayoutParameter.RELATIVE = 2;
ccui.LinearLayoutParameter = ccui.LayoutParameter.extend({
    _linearGravity: null,
    ctor: function () {
        ccui.LayoutParameter.prototype.ctor.call(this);
        this._linearGravity = ccui.LinearLayoutParameter.NONE;
        this._layoutParameterType = ccui.LayoutParameter.LINEAR;
    },
    setGravity: function (gravity) {
        this._linearGravity = gravity;
    },
    getGravity: function () {
        return this._linearGravity;
    },
    _createCloneInstance: function () {
        return new ccui.LinearLayoutParameter();
    },
    _copyProperties: function (model) {
        ccui.LayoutParameter.prototype._copyProperties.call(this, model);
        if (model instanceof ccui.LinearLayoutParameter)
            this.setGravity(model._linearGravity);
    }
});
ccui.LinearLayoutParameter.create = function () {
    return new ccui.LinearLayoutParameter();
};
ccui.LinearLayoutParameter.NONE = 0;
ccui.LinearLayoutParameter.LEFT = 1;
ccui.LinearLayoutParameter.TOP = 2;
ccui.LinearLayoutParameter.RIGHT = 3;
ccui.LinearLayoutParameter.BOTTOM = 4;
ccui.LinearLayoutParameter.CENTER_VERTICAL = 5;
ccui.LinearLayoutParameter.CENTER_HORIZONTAL = 6;
ccui.RelativeLayoutParameter = ccui.LayoutParameter.extend({
    _relativeAlign: null,
    _relativeWidgetName: "",
    _relativeLayoutName: "",
    _put:false,
    ctor: function () {
        ccui.LayoutParameter.prototype.ctor.call(this);
        this._relativeAlign = ccui.RelativeLayoutParameter.NONE;
        this._relativeWidgetName = "";
        this._relativeLayoutName = "";
        this._put = false;
        this._layoutParameterType = ccui.LayoutParameter.RELATIVE;
    },
    setAlign: function (align) {
        this._relativeAlign = align;
    },
    getAlign: function () {
        return this._relativeAlign;
    },
    setRelativeToWidgetName: function (name) {
        this._relativeWidgetName = name;
    },
    getRelativeToWidgetName: function () {
        return this._relativeWidgetName;
    },
    setRelativeName: function (name) {
        this._relativeLayoutName = name;
    },
    getRelativeName: function () {
        return this._relativeLayoutName;
    },
    _createCloneInstance:function(){
        return new ccui.RelativeLayoutParameter();
    },
    _copyProperties:function(model){
        ccui.LayoutParameter.prototype._copyProperties.call(this, model);
        if (model instanceof ccui.RelativeLayoutParameter) {
            this.setAlign(model._relativeAlign);
            this.setRelativeToWidgetName(model._relativeWidgetName);
            this.setRelativeName(model._relativeLayoutName);
        }
    }
});
ccui.RelativeLayoutParameter.create = function () {
    return new ccui.RelativeLayoutParameter();
};
ccui.RelativeLayoutParameter.NONE = 0;
ccui.RelativeLayoutParameter.PARENT_TOP_LEFT = 1;
ccui.RelativeLayoutParameter.PARENT_TOP_CENTER_HORIZONTAL = 2;
ccui.RelativeLayoutParameter.PARENT_TOP_RIGHT = 3;
ccui.RelativeLayoutParameter.PARENT_LEFT_CENTER_VERTICAL = 4;
ccui.RelativeLayoutParameter.CENTER_IN_PARENT = 5;
ccui.RelativeLayoutParameter.PARENT_RIGHT_CENTER_VERTICAL = 6;
ccui.RelativeLayoutParameter.PARENT_LEFT_BOTTOM = 7;
ccui.RelativeLayoutParameter.PARENT_BOTTOM_CENTER_HORIZONTAL = 8;
ccui.RelativeLayoutParameter.PARENT_RIGHT_BOTTOM = 9;
ccui.RelativeLayoutParameter.LOCATION_ABOVE_LEFTALIGN = 10;
ccui.RelativeLayoutParameter.LOCATION_ABOVE_CENTER = 11;
ccui.RelativeLayoutParameter.LOCATION_ABOVE_RIGHTALIGN = 12;
ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_TOPALIGN = 13;
ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_CENTER = 14;
ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_BOTTOMALIGN = 15;
ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_TOPALIGN = 16;
ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_CENTER = 17;
ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_BOTTOMALIGN = 18;
ccui.RelativeLayoutParameter.LOCATION_BELOW_LEFTALIGN = 19;
ccui.RelativeLayoutParameter.LOCATION_BELOW_CENTER = 20;
ccui.RelativeLayoutParameter.LOCATION_BELOW_RIGHTALIGN = 21;
ccui.LINEAR_GRAVITY_NONE = 0;
ccui.LINEAR_GRAVITY_LEFT = 1;
ccui.LINEAR_GRAVITY_TOP = 2;
ccui.LINEAR_GRAVITY_RIGHT = 3;
ccui.LINEAR_GRAVITY_BOTTOM = 4;
ccui.LINEAR_GRAVITY_CENTER_VERTICAL = 5;
ccui.LINEAR_GRAVITY_CENTER_HORIZONTAL = 6;
ccui.RELATIVE_ALIGN_NONE = 0;
ccui.RELATIVE_ALIGN_PARENT_TOP_LEFT = 1;
ccui.RELATIVE_ALIGN_PARENT_TOP_CENTER_HORIZONTAL = 2;
ccui.RELATIVE_ALIGN_PARENT_TOP_RIGHT = 3;
ccui.RELATIVE_ALIGN_PARENT_LEFT_CENTER_VERTICAL = 4;
ccui.RELATIVE_ALIGN_PARENT_CENTER = 5;
ccui.RELATIVE_ALIGN_PARENT_RIGHT_CENTER_VERTICAL = 6;
ccui.RELATIVE_ALIGN_PARENT_LEFT_BOTTOM = 7;
ccui.RELATIVE_ALIGN_PARENT_BOTTOM_CENTER_HORIZONTAL = 8;
ccui.RELATIVE_ALIGN_PARENT_RIGHT_BOTTOM = 9;
ccui.RELATIVE_ALIGN_LOCATION_ABOVE_LEFT = 10;
ccui.RELATIVE_ALIGN_LOCATION_ABOVE_CENTER = 11;
ccui.RELATIVE_ALIGN_LOCATION_ABOVE_RIGHT = 12;
ccui.RELATIVE_ALIGN_LOCATION_LEFT_TOP = 13;
ccui.RELATIVE_ALIGN_LOCATION_LEFT_CENTER = 14;
ccui.RELATIVE_ALIGN_LOCATION_LEFT_BOTTOM = 15;
ccui.RELATIVE_ALIGN_LOCATION_RIGHT_TOP = 16;
ccui.RELATIVE_ALIGN_LOCATION_RIGHT_CENTER = 17;
ccui.RELATIVE_ALIGN_LOCATION_RIGHT_BOTTOM = 18;
ccui.RELATIVE_ALIGN_LOCATION_BELOW_TOP = 19;
ccui.RELATIVE_ALIGN_LOCATION_BELOW_CENTER = 20;
ccui.RELATIVE_ALIGN_LOCATION_BELOW_BOTTOM = 21;
ccui.getLayoutManager = function (type) {
    switch (type) {
        case ccui.Layout.LINEAR_VERTICAL:
            return ccui.linearVerticalLayoutManager;
        case ccui.Layout.LINEAR_HORIZONTAL:
            return ccui.linearHorizontalLayoutManager;
        case ccui.Layout.RELATIVE:
            return ccui.relativeLayoutManager;
    }
    return null;
};
ccui.linearVerticalLayoutManager = {
    _doLayout: function(layout){
        var layoutSize = layout._getLayoutContentSize();
        var container = layout._getLayoutElements();
        var topBoundary = layoutSize.height;
        for (var i = 0, len = container.length; i < len; i++) {
            var child = container[i];
            if (child) {
                var layoutParameter = child.getLayoutParameter();
                if (layoutParameter){
                    var childGravity = layoutParameter.getGravity();
                    var ap = child.getAnchorPoint();
                    var cs = child.getContentSize();
                    var finalPosX = ap.x * cs.width;
                    var finalPosY = topBoundary - ((1.0 - ap.y) * cs.height);
                    switch (childGravity){
                        case ccui.LinearLayoutParameter.NONE:
                        case ccui.LinearLayoutParameter.LEFT:
                            break;
                        case ccui.LinearLayoutParameter.RIGHT:
                            finalPosX = layoutSize.width - ((1.0 - ap.x) * cs.width);
                            break;
                        case ccui.LinearLayoutParameter.CENTER_HORIZONTAL:
                            finalPosX = layoutSize.width / 2.0 - cs.width * (0.5 - ap.x);
                            break;
                        default:
                            break;
                    }
                    var mg = layoutParameter.getMargin();
                    finalPosX += mg.left;
                    finalPosY -= mg.top;
                    child.setPosition(finalPosX, finalPosY);
                    topBoundary = child.getPositionY() - ap.y * cs.height - mg.bottom;
                }
            }
        }
    }
};
ccui.linearHorizontalLayoutManager = {
    _doLayout: function(layout){
        var layoutSize = layout._getLayoutContentSize();
        var container = layout._getLayoutElements();
        var leftBoundary = 0.0;
        for (var i = 0, len = container.length;  i < len; i++) {
            var child = container[i];
            if (child) {
                var layoutParameter = child.getLayoutParameter();
                if (layoutParameter){
                    var childGravity = layoutParameter.getGravity();
                    var ap = child.getAnchorPoint();
                    var cs = child.getContentSize();
                    var finalPosX = leftBoundary + (ap.x * cs.width);
                    var finalPosY = layoutSize.height - (1.0 - ap.y) * cs.height;
                    switch (childGravity){
                        case ccui.LinearLayoutParameter.NONE:
                        case ccui.LinearLayoutParameter.TOP:
                            break;
                        case ccui.LinearLayoutParameter.BOTTOM:
                            finalPosY = ap.y * cs.height;
                            break;
                        case ccui.LinearLayoutParameter.CENTER_VERTICAL:
                            finalPosY = layoutSize.height / 2.0 - cs.height * (0.5 - ap.y);
                            break;
                        default:
                            break;
                    }
                    var mg = layoutParameter.getMargin();
                    finalPosX += mg.left;
                    finalPosY -= mg.top;
                    child.setPosition(finalPosX, finalPosY);
                    leftBoundary = child.getRightBoundary() + mg.right;
                }
            }
        }
    }
};
ccui.relativeLayoutManager = {
    _unlayoutChildCount: 0,
    _widgetChildren: [],
    _widget: null,
    _finalPositionX:0,
    _finalPositionY:0,
    _relativeWidgetLP:null,
    _doLayout: function(layout){
        this._widgetChildren = this._getAllWidgets(layout);
        var locChildren = this._widgetChildren;
        while (this._unlayoutChildCount > 0) {
            for (var i = 0, len = locChildren.length;  i < len; i++) {
                this._widget = locChildren[i];
                var layoutParameter = this._widget.getLayoutParameter();
                if (layoutParameter){
                    if (layoutParameter._put)
                        continue;
                    var ret = this._calculateFinalPositionWithRelativeWidget(layout);
                    if (!ret)
                        continue;
                    this._calculateFinalPositionWithRelativeAlign();
                    this._widget.setPosition(this._finalPositionX, this._finalPositionY);
                    layoutParameter._put = true;
                }
            }
            this._unlayoutChildCount--;
        }
        this._widgetChildren.length = 0;
    },
    _getAllWidgets: function(layout){
        var container = layout._getLayoutElements();
        var locWidgetChildren = this._widgetChildren;
        locWidgetChildren.length = 0;
        for (var i = 0, len = container.length; i < len; i++){
            var child = container[i];
            if (child) {
                var layoutParameter = child.getLayoutParameter();
                layoutParameter._put = false;
                this._unlayoutChildCount++;
                locWidgetChildren.push(child);
            }
        }
        return locWidgetChildren;
    },
    _getRelativeWidget: function(widget){
        var relativeWidget = null;
        var layoutParameter = widget.getLayoutParameter();
        var relativeName = layoutParameter.getRelativeToWidgetName();
        if (relativeName && relativeName.length !== 0) {
            var locChildren =  this._widgetChildren;
            for(var i = 0, len = locChildren.length;  i  < len; i++){
                var child = locChildren[i];
                if (child){
                    var rlayoutParameter = child.getLayoutParameter();
                    if (rlayoutParameter &&  rlayoutParameter.getRelativeName() === relativeName) {
                        relativeWidget = child;
                        this._relativeWidgetLP = rlayoutParameter;
                        break;
                    }
                }
            }
        }
        return relativeWidget;
    },
    _calculateFinalPositionWithRelativeWidget: function(layout){
        var locWidget = this._widget;
        var ap = locWidget.getAnchorPoint();
        var cs = locWidget.getContentSize();
        this._finalPositionX = 0.0;
        this._finalPositionY = 0.0;
        var relativeWidget = this._getRelativeWidget(locWidget);
        var layoutParameter = locWidget.getLayoutParameter();
        var align = layoutParameter.getAlign();
        var layoutSize = layout._getLayoutContentSize();
        switch (align) {
            case ccui.RelativeLayoutParameter.NONE:
            case ccui.RelativeLayoutParameter.PARENT_TOP_LEFT:
                this._finalPositionX = ap.x * cs.width;
                this._finalPositionY = layoutSize.height - ((1.0 - ap.y) * cs.height);
                break;
            case ccui.RelativeLayoutParameter.PARENT_TOP_CENTER_HORIZONTAL:
                this._finalPositionX = layoutSize.width * 0.5 - cs.width * (0.5 - ap.x);
                this._finalPositionY = layoutSize.height - ((1.0 - ap.y) * cs.height);
                break;
            case ccui.RelativeLayoutParameter.PARENT_TOP_RIGHT:
                this._finalPositionX = layoutSize.width - ((1.0 - ap.x) * cs.width);
                this._finalPositionY = layoutSize.height - ((1.0 - ap.y) * cs.height);
                break;
            case ccui.RelativeLayoutParameter.PARENT_LEFT_CENTER_VERTICAL:
                this._finalPositionX = ap.x * cs.width;
                this._finalPositionY = layoutSize.height * 0.5 - cs.height * (0.5 - ap.y);
                break;
            case ccui.RelativeLayoutParameter.CENTER_IN_PARENT:
                this._finalPositionX = layoutSize.width * 0.5 - cs.width * (0.5 - ap.x);
                this._finalPositionY = layoutSize.height * 0.5 - cs.height * (0.5 - ap.y);
                break;
            case ccui.RelativeLayoutParameter.PARENT_RIGHT_CENTER_VERTICAL:
                this._finalPositionX = layoutSize.width - ((1.0 - ap.x) * cs.width);
                this._finalPositionY = layoutSize.height * 0.5 - cs.height * (0.5 - ap.y);
                break;
            case ccui.RelativeLayoutParameter.PARENT_LEFT_BOTTOM:
                this._finalPositionX = ap.x * cs.width;
                this._finalPositionY = ap.y * cs.height;
                break;
            case ccui.RelativeLayoutParameter.PARENT_BOTTOM_CENTER_HORIZONTAL:
                this._finalPositionX = layoutSize.width * 0.5 - cs.width * (0.5 - ap.x);
                this._finalPositionY = ap.y * cs.height;
                break;
            case ccui.RelativeLayoutParameter.PARENT_RIGHT_BOTTOM:
                this._finalPositionX = layoutSize.width - ((1.0 - ap.x) * cs.width);
                this._finalPositionY = ap.y * cs.height;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_ABOVE_LEFTALIGN:
                if (relativeWidget){
                    if (this._relativeWidgetLP && !this._relativeWidgetLP._put)
                        return false;
                    this._finalPositionY = relativeWidget.getTopBoundary() + ap.y * cs.height;
                    this._finalPositionX = relativeWidget.getLeftBoundary() + ap.x * cs.width;
                }
                break;
            case ccui.RelativeLayoutParameter.LOCATION_ABOVE_CENTER:
                if (relativeWidget){
                    if (this._relativeWidgetLP && !this._relativeWidgetLP._put)
                        return false;
                    var rbs = relativeWidget.getContentSize();
                    this._finalPositionY = relativeWidget.getTopBoundary() + ap.y * cs.height;
                    this._finalPositionX = relativeWidget.getLeftBoundary() + rbs.width * 0.5 + ap.x * cs.width - cs.width * 0.5;
                }
                break;
            case ccui.RelativeLayoutParameter.LOCATION_ABOVE_RIGHTALIGN:
                if (relativeWidget) {
                    if (this._relativeWidgetLP && !this._relativeWidgetLP._put)
                        return false;
                    this._finalPositionY = relativeWidget.getTopBoundary() + ap.y * cs.height;
                    this._finalPositionX = relativeWidget.getRightBoundary() - (1.0 - ap.x) * cs.width;
                }
                break;
            case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_TOPALIGN:
                if (relativeWidget){
                    if (this._relativeWidgetLP && !this._relativeWidgetLP._put)
                        return false;
                    this._finalPositionY = relativeWidget.getTopBoundary() - (1.0 - ap.y) * cs.height;
                    this._finalPositionX = relativeWidget.getLeftBoundary() - (1.0 - ap.x) * cs.width;
                }
                break;
            case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_CENTER:
                if (relativeWidget) {
                    if (this._relativeWidgetLP && !this._relativeWidgetLP._put)
                        return false;
                    var rbs = relativeWidget.getContentSize();
                    this._finalPositionX = relativeWidget.getLeftBoundary() - (1.0 - ap.x) * cs.width;
                    this._finalPositionY = relativeWidget.getBottomBoundary() + rbs.height * 0.5 + ap.y * cs.height - cs.height * 0.5;
                }
                break;
            case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_BOTTOMALIGN:
                if (relativeWidget) {
                    if (this._relativeWidgetLP && !this._relativeWidgetLP._put)
                        return false;
                    this._finalPositionY = relativeWidget.getBottomBoundary() + ap.y * cs.height;
                    this._finalPositionX = relativeWidget.getLeftBoundary() - (1.0 - ap.x) * cs.width;
                }
                break;
            case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_TOPALIGN:
                if (relativeWidget){
                    if (this._relativeWidgetLP && !this._relativeWidgetLP._put)
                        return false;
                    this._finalPositionY = relativeWidget.getTopBoundary() - (1.0 - ap.y) * cs.height;
                    this._finalPositionX = relativeWidget.getRightBoundary() + ap.x * cs.width;
                }
                break;
            case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_CENTER:
                if (relativeWidget){
                    if (this._relativeWidgetLP && !this._relativeWidgetLP._put)
                        return false;
                    var rbs = relativeWidget.getContentSize();
                    var locationRight = relativeWidget.getRightBoundary();
                    this._finalPositionX = locationRight + ap.x * cs.width;
                    this._finalPositionY = relativeWidget.getBottomBoundary() + rbs.height * 0.5 + ap.y * cs.height - cs.height * 0.5;
                }
                break;
            case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_BOTTOMALIGN:
                if (relativeWidget){
                    if (this._relativeWidgetLP && !this._relativeWidgetLP._put)
                        return false;
                    this._finalPositionY = relativeWidget.getBottomBoundary() + ap.y * cs.height;
                    this._finalPositionX = relativeWidget.getRightBoundary() + ap.x * cs.width;
                }
                break;
            case ccui.RelativeLayoutParameter.LOCATION_BELOW_LEFTALIGN:
                if (relativeWidget){
                    if (this._relativeWidgetLP && !this._relativeWidgetLP._put)
                        return false;
                    this._finalPositionY =  relativeWidget.getBottomBoundary() - (1.0 - ap.y) * cs.height;
                    this._finalPositionX = relativeWidget.getLeftBoundary() + ap.x * cs.width;
                }
                break;
            case ccui.RelativeLayoutParameter.LOCATION_BELOW_CENTER:
                if (relativeWidget) {
                    if (this._relativeWidgetLP && !this._relativeWidgetLP._put)
                        return false;
                    var rbs = relativeWidget.getContentSize();
                    this._finalPositionY = relativeWidget.getBottomBoundary() - (1.0 - ap.y) * cs.height;
                    this._finalPositionX = relativeWidget.getLeftBoundary() + rbs.width * 0.5 + ap.x * cs.width - cs.width * 0.5;
                }
                break;
            case ccui.RelativeLayoutParameter.LOCATION_BELOW_RIGHTALIGN:
                if (relativeWidget) {
                    if (this._relativeWidgetLP && !this._relativeWidgetLP._put)
                        return false;
                    this._finalPositionY = relativeWidget.getBottomBoundary() - (1.0 - ap.y) * cs.height;
                    this._finalPositionX = relativeWidget.getRightBoundary() - (1.0 - ap.x) * cs.width;
                }
                break;
            default:
                break;
        }
        return true;
    },
    _calculateFinalPositionWithRelativeAlign: function(){
        var layoutParameter = this._widget.getLayoutParameter();
        var mg = layoutParameter.getMargin();
        var align = layoutParameter.getAlign();
        switch (align) {
            case ccui.RelativeLayoutParameter.NONE:
            case ccui.RelativeLayoutParameter.PARENT_TOP_LEFT:
                this._finalPositionX += mg.left;
                this._finalPositionY -= mg.top;
                break;
            case ccui.RelativeLayoutParameter.PARENT_TOP_CENTER_HORIZONTAL:
                this._finalPositionY -= mg.top;
                break;
            case ccui.RelativeLayoutParameter.PARENT_TOP_RIGHT:
                this._finalPositionX -= mg.right;
                this._finalPositionY -= mg.top;
                break;
            case ccui.RelativeLayoutParameter.PARENT_LEFT_CENTER_VERTICAL:
                this._finalPositionX += mg.left;
                break;
            case ccui.RelativeLayoutParameter.CENTER_IN_PARENT:
                break;
            case ccui.RelativeLayoutParameter.PARENT_RIGHT_CENTER_VERTICAL:
                this._finalPositionX -= mg.right;
                break;
            case ccui.RelativeLayoutParameter.PARENT_LEFT_BOTTOM:
                this._finalPositionX += mg.left;
                this._finalPositionY += mg.bottom;
                break;
            case ccui.RelativeLayoutParameter.PARENT_BOTTOM_CENTER_HORIZONTAL:
                this._finalPositionY += mg.bottom;
                break;
            case ccui.RelativeLayoutParameter.PARENT_RIGHT_BOTTOM:
                this._finalPositionX -= mg.right;
                this._finalPositionY += mg.bottom;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_ABOVE_LEFTALIGN:
                this._finalPositionY += mg.bottom;
                this._finalPositionX += mg.left;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_ABOVE_RIGHTALIGN:
                this._finalPositionY += mg.bottom;
                this._finalPositionX -= mg.right;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_ABOVE_CENTER:
                this._finalPositionY += mg.bottom;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_TOPALIGN:
                this._finalPositionX -= mg.right;
                this._finalPositionY -= mg.top;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_BOTTOMALIGN:
                this._finalPositionX -= mg.right;
                this._finalPositionY += mg.bottom;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_CENTER:
                this._finalPositionX -= mg.right;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_TOPALIGN:
                this._finalPositionX += mg.left;
                this._finalPositionY -= mg.top;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_BOTTOMALIGN:
                this._finalPositionX += mg.left;
                this._finalPositionY += mg.bottom;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_CENTER:
                this._finalPositionX += mg.left;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_BELOW_LEFTALIGN:
                this._finalPositionY -= mg.top;
                this._finalPositionX += mg.left;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_BELOW_RIGHTALIGN:
                this._finalPositionY -= mg.top;
                this._finalPositionX -= mg.right;
                break;
            case ccui.RelativeLayoutParameter.LOCATION_BELOW_CENTER:
                this._finalPositionY -= mg.top;
                break;
            default:
                break;
        }
    }
};
ccui.HBox = ccui.Layout.extend({
    ctor: function(size){
        ccui.Layout.prototype.ctor.call(this, size);
        if(size !== undefined)
            this.initWithSize(size);
        else
           this.init();
    },
    init: function(){
        if(ccui.Layout.prototype.init.call(this)){
            this.setLayoutType(ccui.Layout.LINEAR_HORIZONTAL);
            return true;
        }
        return false;
    },
    initWithSize: function(size){
        if(this.init()){
            this.setContentSize(size);
            return true;
        }
        return false;
    }
});
ccui.HBox.create = function(size){
    return new ccui.HBox(size);
};
ccui.RelativeBox = ccui.Layout.extend({
    ctor: function(size){
        if(size)
            this.initWithSize(size);
        else
            this.init();
    },
    init: function(){
        if(ccui.Layout.prototype.init.call(this)){
            this.setLayoutType(ccui.Layout.RELATIVE);
            return true;
        }
        return false;
    },
    initWithSize: function(size){
        if(this.init()){
            this.setContentSize(size);
            return true;
        }
        return false;
    }
});
ccui.RelativeBox.create = function(size){
    return new ccui.RelativeBox(size);
};
ccui.VBox = ccui.Layout.extend({
    ctor: function(size){
        ccui.Layout.prototype.ctor.call(this, size);
        if(size !== undefined)
            this.initWithSize(size);
        else
            this.init();
    },
    init: function(){
        if(ccui.Layout.prototype.init.call(this)){
            this.setLayoutType(ccui.Layout.LINEAR_VERTICAL);
            return true;
        }
        return false;
    },
    initWithSize: function(size){
        if(this.init()){
            this.setContentSize(size);
            return true;
        }
        return false;
    }
});
ccui.VBox.create = function(size){
    return new ccui.VBox(size);
};
ccui.helper = {
	seekWidgetByTag: function (root, tag) {
	    if (!root)
	        return null;
	    if (root.getTag() === tag)
	        return root;
	    var arrayRootChildren = root.getChildren();
	    var length = arrayRootChildren.length;
	    for (var i = 0; i < length; i++) {
	        var child = arrayRootChildren[i];
	        var res = ccui.helper.seekWidgetByTag(child, tag);
	        if (res !== null)
	            return res;
	    }
	    return null;
	},
	seekWidgetByName: function (root, name) {
	    if (!root)
	        return null;
	    if (root.getName() === name)
	        return root;
	    var arrayRootChildren = root.getChildren();
	    var length = arrayRootChildren.length;
	    for (var i = 0; i < length; i++) {
	        var child = arrayRootChildren[i];
	        var res = ccui.helper.seekWidgetByName(child, name);
	        if (res !== null)
	            return res;
	    }
	    return null;
	},
	seekWidgetByRelativeName: function (root, name) {
	    if (!root)
	        return null;
	    var arrayRootChildren = root.getChildren();
	    var length = arrayRootChildren.length;
	    for (var i = 0; i < length; i++) {
	        var child = arrayRootChildren[i];
	        var layoutParameter = child.getLayoutParameter(ccui.LayoutParameter.RELATIVE);
	        if (layoutParameter && layoutParameter.getRelativeName() === name)
	            return child;
	    }
	    return null;
	},
	seekActionWidgetByActionTag: function (root, tag) {
	    if (!root)
	        return null;
	    if (root.getActionTag() === tag)
	        return root;
	    var arrayRootChildren = root.getChildren();
	    for (var i = 0; i < arrayRootChildren.length; i++) {
	        var child = arrayRootChildren[i];
	        var res = ccui.helper.seekActionWidgetByActionTag(child, tag);
	        if (res !== null)
	            return res;
	    }
	    return null;
	} ,
    _activeLayout: true,
    doLayout: function(rootNode){
        if(!this._activeLayout)
            return;
        var children = rootNode.getChildren(), node;
        for(var i = 0, len = children.length;i < len; i++) {
            node = children[i];
            var com = node.getComponent(ccui.LayoutComponent.NAME);
            var parent = node.getParent();
            if (null != com && null !== parent && com.refreshLayout)
                com.refreshLayout();
        }
    },
    changeLayoutSystemActiveState: function(active){
        this._activeLayout = active;
    },
    restrictCapInsetRect: function (capInsets, textureSize) {
        var x = capInsets.x, y = capInsets.y;
        var width = capInsets.width, height = capInsets.height;
        if (textureSize.width < width) {
            x = 0.0;
            width = 0.0;
        }
        if (textureSize.height < height) {
            y = 0.0;
            height = 0.0;
        }
        return cc.rect(x, y, width, height);
    }
};
ccui.Button = ccui.Widget.extend({
    _buttonNormalRenderer: null,
    _buttonClickedRenderer: null,
    _buttonDisableRenderer: null,
    _titleRenderer: null,
    _normalFileName: "",
    _clickedFileName: "",
    _disabledFileName: "",
    _prevIgnoreSize: true,
    _scale9Enabled: false,
    _capInsetsNormal: null,
    _capInsetsPressed: null,
    _capInsetsDisabled: null,
    _normalTexType: ccui.Widget.LOCAL_TEXTURE,
    _pressedTexType: ccui.Widget.LOCAL_TEXTURE,
    _disabledTexType: ccui.Widget.LOCAL_TEXTURE,
    _normalTextureSize: null,
    _pressedTextureSize: null,
    _disabledTextureSize: null,
    pressedActionEnabled: false,
    _titleColor: null,
    _normalTextureScaleXInSize: 1,
    _normalTextureScaleYInSize: 1,
    _pressedTextureScaleXInSize: 1,
    _pressedTextureScaleYInSize: 1,
    _zoomScale: 0.1,
    _normalTextureLoaded: false,
    _pressedTextureLoaded: false,
    _disabledTextureLoaded: false,
    _className: "Button",
    _normalTextureAdaptDirty: true,
    _pressedTextureAdaptDirty: true,
    _disabledTextureAdaptDirty: true,
    _fontName: "Thonburi",
    _fontSize: 12,
    _type: 0,
    ctor: function (normalImage, selectedImage, disableImage, texType) {
        this._capInsetsNormal = cc.rect(0, 0, 0, 0);
        this._capInsetsPressed = cc.rect(0, 0, 0, 0);
        this._capInsetsDisabled = cc.rect(0, 0, 0, 0);
        this._normalTextureSize = cc.size(0, 0);
        this._pressedTextureSize = cc.size(0, 0);
        this._disabledTextureSize = cc.size(0, 0);
        this._titleColor = cc.color.WHITE;
        ccui.Widget.prototype.ctor.call(this);
        this.setTouchEnabled(true);
        this.init(normalImage, selectedImage, disableImage, texType);
    },
    init: function (normalImage, selectedImage,disableImage, texType) {
        if (ccui.Widget.prototype.init.call(this)) {
            if(normalImage === undefined)
                return true;
            this.loadTextures(normalImage, selectedImage,disableImage, texType);
        }
        return false;
    },
    _initRenderer: function () {
        this._buttonNormalRenderer = new cc.Sprite();
        this._buttonClickedRenderer = new cc.Sprite();
        this._buttonDisableRenderer = new cc.Sprite();
        this._titleRenderer = new cc.LabelTTF("");
        this._titleRenderer.setAnchorPoint(0.5, 0.5);
        this.addProtectedChild(this._buttonNormalRenderer, ccui.Button.NORMAL_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._buttonClickedRenderer, ccui.Button.PRESSED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._buttonDisableRenderer, ccui.Button.DISABLED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._titleRenderer, ccui.Button.TITLE_RENDERER_ZORDER, -1);
    },
    setScale9Enabled: function (able) {
        if (this._scale9Enabled === able)
            return;
        this._brightStyle = ccui.Widget.BRIGHT_STYLE_NONE;
        this._scale9Enabled = able;
        this.removeProtectedChild(this._buttonNormalRenderer);
        this.removeProtectedChild(this._buttonClickedRenderer);
        this.removeProtectedChild(this._buttonDisableRenderer);
        if (this._scale9Enabled) {
            this._buttonNormalRenderer = new ccui.Scale9Sprite();
            this._buttonClickedRenderer = new ccui.Scale9Sprite();
            this._buttonDisableRenderer = new ccui.Scale9Sprite();
        } else {
            this._buttonNormalRenderer = new cc.Sprite();
            this._buttonClickedRenderer = new cc.Sprite();
            this._buttonDisableRenderer = new cc.Sprite();
        }
        this._buttonClickedRenderer.setVisible(false);
        this._buttonDisableRenderer.setVisible(false);
        this.loadTextureNormal(this._normalFileName, this._normalTexType);
        this.loadTexturePressed(this._clickedFileName, this._pressedTexType);
        this.loadTextureDisabled(this._disabledFileName, this._disabledTexType);
        this.addProtectedChild(this._buttonNormalRenderer, ccui.Button.NORMAL_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._buttonClickedRenderer, ccui.Button.PRESSED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._buttonDisableRenderer, ccui.Button.DISABLED_RENDERER_ZORDER, -1);
        if (this._scale9Enabled) {
            var ignoreBefore = this._ignoreSize;
            this.ignoreContentAdaptWithSize(false);
            this._prevIgnoreSize = ignoreBefore;
        } else {
            this.ignoreContentAdaptWithSize(this._prevIgnoreSize);
        }
        this.setCapInsetsNormalRenderer(this._capInsetsNormal);
        this.setCapInsetsPressedRenderer(this._capInsetsPressed);
        this.setCapInsetsDisabledRenderer(this._capInsetsDisabled);
        this.setBright(this._bright);
        this._normalTextureAdaptDirty = true;
        this._pressedTextureAdaptDirty = true;
        this._disabledTextureAdaptDirty = true;
    },
    isScale9Enabled: function () {
        return this._scale9Enabled;
    },
    ignoreContentAdaptWithSize: function (ignore) {
        if(this._unifySize){
            this._updateContentSize();
            return;
        }
        if (!this._scale9Enabled || (this._scale9Enabled && !ignore)) {
            ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, ignore);
            this._prevIgnoreSize = ignore;
        }
    },
    getVirtualRendererSize: function(){
        if (this._unifySize)
            return this._getNormalSize();
        if (!this._normalTextureLoaded && this._titleRenderer.getString().length > 0) {
            return this._titleRenderer.getContentSize();
        }
        return cc.size(this._normalTextureSize);
    },
    loadTextures: function (normal, selected, disabled, texType) {
        this.loadTextureNormal(normal, texType);
        this.loadTexturePressed(selected, texType);
        this.loadTextureDisabled(disabled, texType);
    },
    loadTextureNormal: function (normal, texType) {
        if (!normal)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._normalFileName = normal;
        this._normalTexType = texType;
        var self = this;
        var normalRenderer = this._buttonNormalRenderer;
        if(!normalRenderer._textureLoaded){
            normalRenderer.addEventListener("load", function(){
                self.loadTextureNormal(self._normalFileName, self._normalTexType);
            });
        }
        switch (this._normalTexType){
            case ccui.Widget.LOCAL_TEXTURE:
                normalRenderer.initWithFile(normal);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                normalRenderer.initWithSpriteFrameName(normal);
                break;
            default:
                break;
        }
        this._normalTextureSize = this._buttonNormalRenderer.getContentSize();
        this._updateChildrenDisplayedRGBA();
        if (this._unifySize){
            if (this._scale9Enabled){
                normalRenderer.setCapInsets(this._capInsetsNormal);
                this._updateContentSizeWithTextureSize(this._getNormalSize());
            }
        }else
            this._updateContentSizeWithTextureSize(this._normalTextureSize);
        this._normalTextureLoaded = true;
        this._normalTextureAdaptDirty = true;
        this._findLayout();
    },
    loadTexturePressed: function (selected, texType) {
        if (!selected)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._clickedFileName = selected;
        this._pressedTexType = texType;
        var self = this;
        var clickedRenderer = this._buttonClickedRenderer;
        if(!clickedRenderer._textureLoaded){
            clickedRenderer.addEventListener("load", function(){
                self.loadTexturePressed(self._clickedFileName, self._pressedTexType);
            });
        }
        switch (this._pressedTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                clickedRenderer.initWithFile(selected);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                clickedRenderer.initWithSpriteFrameName(selected);
                break;
            default:
                break;
        }
        if (this._scale9Enabled)
            clickedRenderer.setCapInsets(this._capInsetsPressed);
        this._pressedTextureSize = this._buttonClickedRenderer.getContentSize();
        this._updateChildrenDisplayedRGBA();
        this._pressedTextureLoaded = true;
        this._pressedTextureAdaptDirty = true;
        this._findLayout();
    },
    loadTextureDisabled: function (disabled, texType) {
        if (!disabled)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._disabledFileName = disabled;
        this._disabledTexType = texType;
        var self = this;
        var disabledRenderer = this._buttonDisableRenderer;
        if(!disabledRenderer._textureLoaded){
            disabledRenderer.addEventListener("load", function() {
                self.loadTextureDisabled(self._disabledFileName, self._disabledTexType);
            });
        }
        switch (this._disabledTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                disabledRenderer.initWithFile(disabled);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                disabledRenderer.initWithSpriteFrameName(disabled);
                break;
            default:
                break;
        }
        if (this._scale9Enabled)
            disabledRenderer.setCapInsets(this._capInsetsDisabled);
        this._disabledTextureSize = this._buttonDisableRenderer.getContentSize();
        this._updateChildrenDisplayedRGBA();
        this._disabledTextureLoaded = true;
        this._disabledTextureAdaptDirty = true;
        this._findLayout();
    },
    setCapInsets: function (capInsets) {
        this.setCapInsetsNormalRenderer(capInsets);
        this.setCapInsetsPressedRenderer(capInsets);
        this.setCapInsetsDisabledRenderer(capInsets);
    },
    setCapInsetsNormalRenderer: function (capInsets) {
        if(!capInsets)
            return;
        var x = capInsets.x, y = capInsets.y;
        var width = capInsets.width, height = capInsets.height;
        if (this._normalTextureSize.width < width){
            x = 0;
            width = 0;
        }
        if (this._normalTextureSize.height < height){
            y = 0;
            height = 0;
        }
        var locInsets = this._capInsetsNormal;
        locInsets.x = x;
        locInsets.y = y;
        locInsets.width = width;
        locInsets.height = height;
        if (!this._scale9Enabled)
            return;
        this._buttonNormalRenderer.setCapInsets(locInsets);
    },
    getCapInsetsNormalRenderer:function(){
        return cc.rect(this._capInsetsNormal);
    },
    setCapInsetsPressedRenderer: function (capInsets) {
        if(!capInsets || !this._scale9Enabled)
            return;
        var x = capInsets.x, y = capInsets.y;
        var width = capInsets.width, height = capInsets.height;
        if (this._normalTextureSize.width < width) {
            x = 0;
            width = 0;
        }
        if (this._normalTextureSize.height < height) {
            y = 0;
            height = 0;
        }
        var locInsets = this._capInsetsPressed;
        locInsets.x = x;
        locInsets.y = y;
        locInsets.width = width;
        locInsets.height = height;
        this._buttonClickedRenderer.setCapInsets(locInsets);
    },
    getCapInsetsPressedRenderer: function () {
        return cc.rect(this._capInsetsPressed);
    },
    setCapInsetsDisabledRenderer: function (capInsets) {
        if(!capInsets || !this._scale9Enabled)
            return;
        var x = capInsets.x, y = capInsets.y;
        var width = capInsets.width, height = capInsets.height;
        if (this._normalTextureSize.width < width) {
            x = 0;
            width = 0;
        }
        if (this._normalTextureSize.height < height) {
            y = 0;
            height = 0;
        }
        var locInsets = this._capInsetsDisabled;
        locInsets.x = x;
        locInsets.y = y;
        locInsets.width = width;
        locInsets.height = height;
        this._buttonDisableRenderer.setCapInsets(locInsets);
    },
    getCapInsetsDisabledRenderer: function () {
        return cc.rect(this._capInsetsDisabled);
    },
    _onPressStateChangedToNormal: function () {
        this._buttonNormalRenderer.setVisible(true);
        this._buttonClickedRenderer.setVisible(false);
        this._buttonDisableRenderer.setVisible(false);
        if (this._scale9Enabled)
            this._buttonNormalRenderer.setState( ccui.Scale9Sprite.state.NORMAL);
        if (this._pressedTextureLoaded) {
            if (this.pressedActionEnabled){
                this._buttonNormalRenderer.stopAllActions();
                this._buttonClickedRenderer.stopAllActions();
                this._buttonNormalRenderer.setScale(this._normalTextureScaleXInSize, this._normalTextureScaleYInSize);
                this._buttonClickedRenderer.setScale(this._pressedTextureScaleXInSize, this._pressedTextureScaleYInSize);
                this._titleRenderer.stopAllActions();
                if (this._unifySize){
                    var zoomTitleAction = cc.scaleTo(ccui.Button.ZOOM_ACTION_TIME_STEP, 1, 1);
                    this._titleRenderer.runAction(zoomTitleAction);
                }else{
                    this._titleRenderer.setScaleX(1);
                    this._titleRenderer.setScaleY(1);
                }
            }
        } else {
            this._buttonNormalRenderer.stopAllActions();
            this._buttonNormalRenderer.setScale(this._normalTextureScaleXInSize, this._normalTextureScaleYInSize);
            this._titleRenderer.stopAllActions();
            if (this._scale9Enabled)
                this._buttonNormalRenderer.setColor(cc.color.WHITE);
            this._titleRenderer.setScaleX(1);
            this._titleRenderer.setScaleY(1);
        }
    },
    _onPressStateChangedToPressed: function () {
        var locNormalRenderer = this._buttonNormalRenderer;
        if (this._scale9Enabled)
            locNormalRenderer.setState(ccui.Scale9Sprite.state.NORMAL);
        if (this._pressedTextureLoaded) {
            locNormalRenderer.setVisible(false);
            this._buttonClickedRenderer.setVisible(true);
            this._buttonDisableRenderer.setVisible(false);
            if (this.pressedActionEnabled) {
                locNormalRenderer.stopAllActions();
                this._buttonClickedRenderer.stopAllActions();
                var zoomAction = cc.scaleTo(ccui.Button.ZOOM_ACTION_TIME_STEP, this._pressedTextureScaleXInSize + this._zoomScale,
                        this._pressedTextureScaleYInSize + this._zoomScale);
                this._buttonClickedRenderer.runAction(zoomAction);
                locNormalRenderer.setScale(this._pressedTextureScaleXInSize + this._zoomScale, this._pressedTextureScaleYInSize + this._zoomScale);
                this._titleRenderer.stopAllActions();
                this._titleRenderer.runAction(cc.scaleTo(ccui.Button.ZOOM_ACTION_TIME_STEP, 1 + this._zoomScale, 1 + this._zoomScale));
            }
        } else {
            locNormalRenderer.setVisible(true);
            this._buttonClickedRenderer.setVisible(true);
            this._buttonDisableRenderer.setVisible(false);
            locNormalRenderer.stopAllActions();
            locNormalRenderer.setScale(this._normalTextureScaleXInSize + this._zoomScale, this._normalTextureScaleYInSize + this._zoomScale);
            this._titleRenderer.stopAllActions();
            this._titleRenderer.setScaleX(1 + this._zoomScale);
            this._titleRenderer.setScaleY(1 + this._zoomScale);
        }
    },
    _onPressStateChangedToDisabled: function () {
        if (!this._disabledTextureLoaded){
            if (this._normalTextureLoaded && this._scale9Enabled)
                this._buttonNormalRenderer.setState(ccui.Scale9Sprite.state.GRAY);
        }else{
            this._buttonNormalRenderer.setVisible(false);
            this._buttonDisableRenderer.setVisible(true);
        }
        this._buttonClickedRenderer.setVisible(false);
        this._buttonNormalRenderer.setScale(this._normalTextureScaleXInSize, this._normalTextureScaleYInSize);
        this._buttonClickedRenderer.setScale(this._pressedTextureScaleXInSize, this._pressedTextureScaleYInSize);
    },
    _updateContentSize: function(){
        if (this._unifySize){
            if (this._scale9Enabled)
                ccui.ProtectedNode.setContentSize(this._customSize);
            else{
                var s = this._getNormalSize();
                ccui.ProtectedNode.setContentSize(s);
            }
            this._onSizeChanged();
            return;
        }
        if (this._ignoreSize)
            this.setContentSize(this.getVirtualRendererSize());
    },
    _updateTexturesRGBA: function(){
        this._buttonNormalRenderer.setColor(this.getColor());
        this._buttonClickedRenderer.setColor(this.getColor());
        this._buttonDisableRenderer.setColor(this.getColor());
        this._buttonNormalRenderer.setOpacity(this.getOpacity());
        this._buttonClickedRenderer.setOpacity(this.getOpacity());
        this._buttonDisableRenderer.setOpacity(this.getOpacity());
    },
    _onSizeChanged: function () {
        ccui.Widget.prototype._onSizeChanged.call(this);
        this._updateTitleLocation();
        this._normalTextureAdaptDirty = true;
        this._pressedTextureAdaptDirty = true;
        this._disabledTextureAdaptDirty = true;
    },
    getVirtualRenderer: function () {
        if (this._bright) {
            switch (this._brightStyle) {
                case ccui.Widget.BRIGHT_STYLE_NORMAL:
                    return this._buttonNormalRenderer;
                case ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT:
                    return this._buttonClickedRenderer;
                default:
                    return null;
            }
        } else
            return this._buttonDisableRenderer;
    },
    _normalTextureScaleChangedWithSize: function () {
        if(this._ignoreSize && !this._unifySize){
            if(!this._scale9Enabled){
                this._buttonNormalRenderer.setScale(1);
                this._normalTextureScaleXInSize = this._normalTextureScaleYInSize = 1;
            }
        }else{
            if (this._scale9Enabled){
                this._buttonNormalRenderer.setPreferredSize(this._contentSize);
                this._normalTextureScaleXInSize = this._normalTextureScaleYInSize = 1;
                this._buttonNormalRenderer.setScale(this._normalTextureScaleXInSize, this._normalTextureScaleYInSize);
            }else{
                var textureSize = this._normalTextureSize;
                if (textureSize.width <= 0 || textureSize.height <= 0)
                {
                    this._buttonNormalRenderer.setScale(1);
                    return;
                }
                var scaleX = this._contentSize.width / textureSize.width;
                var scaleY = this._contentSize.height / textureSize.height;
                this._buttonNormalRenderer.setScaleX(scaleX);
                this._buttonNormalRenderer.setScaleY(scaleY);
                this._normalTextureScaleXInSize = scaleX;
                this._normalTextureScaleYInSize = scaleY;
            }
        }
        this._buttonNormalRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2);
    },
    _pressedTextureScaleChangedWithSize: function () {
        if (this._ignoreSize && !this._unifySize) {
            if (!this._scale9Enabled) {
                this._buttonClickedRenderer.setScale(1);
                this._pressedTextureScaleXInSize = this._pressedTextureScaleYInSize = 1;
            }
        } else {
            if (this._scale9Enabled) {
                this._buttonClickedRenderer.setPreferredSize(this._contentSize);
                this._pressedTextureScaleXInSize = this._pressedTextureScaleYInSize = 1;
                this._buttonClickedRenderer.setScale(this._pressedTextureScaleXInSize, this._pressedTextureScaleYInSize);
            } else {
                var textureSize = this._pressedTextureSize;
                if (textureSize.width <= 0 || textureSize.height <= 0) {
                    this._buttonClickedRenderer.setScale(1);
                    return;
                }
                var scaleX = this._contentSize.width / textureSize.width;
                var scaleY = this._contentSize.height / textureSize.height;
                this._buttonClickedRenderer.setScaleX(scaleX);
                this._buttonClickedRenderer.setScaleY(scaleY);
                this._pressedTextureScaleXInSize = scaleX;
                this._pressedTextureScaleYInSize = scaleY;
            }
        }
        this._buttonClickedRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2);
    },
    _disabledTextureScaleChangedWithSize: function () {
        if(this._ignoreSize && !this._unifySize){
            if (this._scale9Enabled)
                this._buttonDisableRenderer.setScale(1);
        }else {
            if (this._scale9Enabled){
                this._buttonDisableRenderer.setScale(1);
                this._buttonDisableRenderer.setPreferredSize(this._contentSize);
            }else{
                var textureSize = this._disabledTextureSize;
                if (textureSize.width <= 0 || textureSize.height <= 0) {
                    this._buttonDisableRenderer.setScale(1);
                    return;
                }
                var scaleX = this._contentSize.width / textureSize.width;
                var scaleY = this._contentSize.height / textureSize.height;
                this._buttonDisableRenderer.setScaleX(scaleX);
                this._buttonDisableRenderer.setScaleY(scaleY);
            }
        }
        this._buttonDisableRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2);
    },
    _adaptRenderers: function(){
        if (this._normalTextureAdaptDirty) {
            this._normalTextureScaleChangedWithSize();
            this._normalTextureAdaptDirty = false;
        }
        if (this._pressedTextureAdaptDirty) {
            this._pressedTextureScaleChangedWithSize();
            this._pressedTextureAdaptDirty = false;
        }
        if (this._disabledTextureAdaptDirty) {
            this._disabledTextureScaleChangedWithSize();
            this._disabledTextureAdaptDirty = false;
        }
    },
    _updateTitleLocation: function(){
        this._titleRenderer.setPosition(this._contentSize.width * 0.5, this._contentSize.height * 0.5);
    },
    setPressedActionEnabled: function (enabled) {
        this.pressedActionEnabled = enabled;
    },
    setTitleText: function (text) {
        if(text === this.getTitleText())
            return;
        this._titleRenderer.setString(text);
        if (this._ignoreSize){
            var s = this.getVirtualRendererSize();
            this.setContentSize(s);
        }else{
            this._titleRenderer._renderCmd._updateTTF();
        }
    },
    getTitleText: function () {
        return this._titleRenderer.getString();
    },
    setTitleColor: function (color) {
        this._titleRenderer.setFontFillColor(color);
    },
    getTitleColor: function () {
        return this._titleRenderer._getFillStyle();
    },
    setTitleFontSize: function (size) {
        this._titleRenderer.setFontSize(size);
        this._fontSize = size;
    },
    getTitleFontSize: function () {
        return this._titleRenderer.getFontSize();
    },
    setZoomScale: function(scale){
        this._zoomScale = scale;
    },
    getZoomScale: function(){
        return this._zoomScale;
    },
    getNormalTextureSize: function(){
        return this._normalTextureSize;
    },
    setTitleFontName: function (fontName) {
        this._titleRenderer.setFontName(fontName);
        this._fontName = fontName;
    },
    getTitleRenderer: function(){
        return this._titleRenderer;
    },
    getTitleFontName: function () {
        return this._titleRenderer.getFontName();
    },
    _setTitleFont: function (font) {
        this._titleRenderer.font = font;
    },
    _getTitleFont: function () {
        return this._titleRenderer.font;
    },
    getDescription: function () {
        return "Button";
    },
    _createCloneInstance: function () {
        return new ccui.Button();
    },
    _copySpecialProperties: function (uiButton) {
        this._prevIgnoreSize = uiButton._prevIgnoreSize;
        this.setScale9Enabled(uiButton._scale9Enabled);
        this.loadTextureNormal(uiButton._normalFileName, uiButton._normalTexType);
        this.loadTexturePressed(uiButton._clickedFileName, uiButton._pressedTexType);
        this.loadTextureDisabled(uiButton._disabledFileName, uiButton._disabledTexType);
        this.setCapInsetsNormalRenderer(uiButton._capInsetsNormal);
        this.setCapInsetsPressedRenderer(uiButton._capInsetsPressed);
        this.setCapInsetsDisabledRenderer(uiButton._capInsetsDisabled);
        this.setTitleText(uiButton.getTitleText());
        this.setTitleFontName(uiButton.getTitleFontName());
        this.setTitleFontSize(uiButton.getTitleFontSize());
        this.setTitleColor(uiButton.getTitleColor());
        this.setPressedActionEnabled(uiButton.pressedActionEnabled);
        this.setZoomScale(uiButton._zoomScale);
    },
    setColor: function(color){
        cc.ProtectedNode.prototype.setColor.call(this, color);
        this._updateTexturesRGBA();
    },
    _getNormalSize: function(){
        var titleSize;
        if (this._titleRenderer !== null)
            titleSize = this._titleRenderer.getContentSize();
        var imageSize;
        if (this._buttonNormalRenderer !== null)
            imageSize = this._buttonNormalRenderer.getContentSize();
        var width = titleSize.width > imageSize.width ? titleSize.width : imageSize.width;
        var height = titleSize.height > imageSize.height ? titleSize.height : imageSize.height;
        return cc.size(width,height);
    }
});
var _p = ccui.Button.prototype;
_p.titleText;
cc.defineGetterSetter(_p, "titleText", _p.getTitleText, _p.setTitleText);
_p.titleFont;
cc.defineGetterSetter(_p, "titleFont", _p._getTitleFont, _p._setTitleFont);
_p.titleFontSize;
cc.defineGetterSetter(_p, "titleFontSize", _p.getTitleFontSize, _p.setTitleFontSize);
_p.titleFontName;
cc.defineGetterSetter(_p, "titleFontName", _p.getTitleFontName, _p.setTitleFontName);
_p.titleColor;
cc.defineGetterSetter(_p, "titleColor", _p.getTitleColor, _p.setTitleColor);
_p = null;
ccui.Button.create = function (normalImage, selectedImage, disableImage, texType) {
    return new ccui.Button(normalImage, selectedImage, disableImage, texType);
};
ccui.Button.NORMAL_RENDERER_ZORDER = -2;
ccui.Button.PRESSED_RENDERER_ZORDER = -2;
ccui.Button.DISABLED_RENDERER_ZORDER = -2;
ccui.Button.TITLE_RENDERER_ZORDER = -1;
ccui.Button.ZOOM_ACTION_TIME_STEP = 0.05;
ccui.Button.SYSTEM = 0;
ccui.Button.TTF = 1;
ccui.CheckBox = ccui.Widget.extend({
    _backGroundBoxRenderer: null,
    _backGroundSelectedBoxRenderer: null,
    _frontCrossRenderer: null,
    _backGroundBoxDisabledRenderer: null,
    _frontCrossDisabledRenderer: null,
    _isSelected: true,
    _checkBoxEventListener: null,
    _checkBoxEventSelector:null,
    _backGroundTexType: ccui.Widget.LOCAL_TEXTURE,
    _backGroundSelectedTexType: ccui.Widget.LOCAL_TEXTURE,
    _frontCrossTexType: ccui.Widget.LOCAL_TEXTURE,
    _backGroundDisabledTexType: ccui.Widget.LOCAL_TEXTURE,
    _frontCrossDisabledTexType: ccui.Widget.LOCAL_TEXTURE,
    _backGroundFileName: "",
    _backGroundSelectedFileName: "",
    _frontCrossFileName: "",
    _backGroundDisabledFileName: "",
    _frontCrossDisabledFileName: "",
    _className: "CheckBox",
    _zoomScale: 0.1,
    _backgroundTextureScaleX: 0.1,
    _backgroundTextureScaleY: 0.1,
    _backGroundBoxRendererAdaptDirty:true,
    _backGroundSelectedBoxRendererAdaptDirty:true,
    _frontCrossRendererAdaptDirty: true,
    _backGroundBoxDisabledRendererAdaptDirty: true,
    _frontCrossDisabledRendererAdaptDirty: true,
    ctor: function (backGround, backGroundSelected,cross,backGroundDisabled,frontCrossDisabled,texType) {
        ccui.Widget.prototype.ctor.call(this);
        this.setTouchEnabled(true);
        var strNum = 0;
        for(var i=0; i<arguments.length; i++){
            var type = typeof arguments[i];
            if(type === "string"){
                if(isNaN(arguments[i] - 0))
                    strNum++;
                else{
                    texType = arguments[i];
                    arguments[i] = undefined;
                }
            }else if(type === "number")
                strNum++;
        }
        switch(strNum){
            case 2:
                texType = cross;
                cross = backGroundSelected;
                backGroundSelected = undefined;
        }
        texType = texType === undefined ? 0 : texType;
        this.init(backGround, backGroundSelected,cross,backGroundDisabled,frontCrossDisabled,texType);
    },
    init: function (backGround, backGroundSelected, cross, backGroundDisabled, frontCrossDisabled, texType) {
        if (ccui.Widget.prototype.init.call(this)) {
            this._isSelected = true;
            this.setSelected(false);
            this.loadTextures(backGround, backGroundSelected, cross, backGroundDisabled, frontCrossDisabled, texType);
            return true;
        }
        return false;
    },
    _initRenderer: function () {
        this._backGroundBoxRenderer = new cc.Sprite();
        this._backGroundSelectedBoxRenderer = new cc.Sprite();
        this._frontCrossRenderer = new cc.Sprite();
        this._backGroundBoxDisabledRenderer = new cc.Sprite();
        this._frontCrossDisabledRenderer = new cc.Sprite();
        this.addProtectedChild(this._backGroundBoxRenderer, ccui.CheckBox.BOX_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._backGroundSelectedBoxRenderer, ccui.CheckBox.BOX_SELECTED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._frontCrossRenderer, ccui.CheckBox.FRONT_CROSS_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._backGroundBoxDisabledRenderer, ccui.CheckBox.BOX_DISABLED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._frontCrossDisabledRenderer, ccui.CheckBox.FRONT_CROSS_DISABLED_RENDERER_ZORDER, -1);
    },
    loadTextures: function (backGround, backGroundSelected, cross, backGroundDisabled, frontCrossDisabled, texType) {
        backGround && this.loadTextureBackGround(backGround, texType);
        backGroundSelected && this.loadTextureBackGroundSelected(backGroundSelected, texType);
        cross && this.loadTextureFrontCross(cross, texType);
        backGroundDisabled && this.loadTextureBackGroundDisabled(backGroundDisabled, texType);
        frontCrossDisabled && this.loadTextureFrontCrossDisabled(frontCrossDisabled, texType);
    },
    loadTextureBackGround: function (backGround, texType) {
        if (!backGround)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._backGroundFileName = backGround;
        this._backGroundTexType = texType;
        var bgBoxRenderer = this._backGroundBoxRenderer;
        if(!bgBoxRenderer._textureLoaded){
            bgBoxRenderer.addEventListener("load", function(){
                this._updateContentSizeWithTextureSize(this._backGroundBoxRenderer.getContentSize());
                this.loadTextureBackGround(this._backGroundFileName, this._backGroundTexType);
            }, this);
        }else{
            this._backGroundBoxRenderer.setContentSize(this._customSize);
        }
        switch (this._backGroundTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                bgBoxRenderer.initWithFile(backGround);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                bgBoxRenderer.initWithSpriteFrameName(backGround);
                break;
            default:
                break;
        }
        this._updateChildrenDisplayedRGBA();
        this._updateContentSizeWithTextureSize(this._backGroundBoxRenderer.getContentSize());
        this._backGroundBoxRendererAdaptDirty = true;
        this._findLayout();
    },
    loadTextureBackGroundSelected: function (backGroundSelected, texType) {
        if (!backGroundSelected)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._backGroundSelectedFileName = backGroundSelected;
        this._backGroundSelectedTexType = texType;
        var backGroundSelectedBoxRenderer = this._backGroundSelectedBoxRenderer;
        if(!backGroundSelectedBoxRenderer._textureLoaded){
            backGroundSelectedBoxRenderer.addEventListener("load", function(){
                this.loadTextureBackGroundSelected(this._backGroundSelectedFileName, this._backGroundSelectedTexType);
            }, this);
        }
        switch (this._backGroundSelectedTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                backGroundSelectedBoxRenderer.initWithFile(backGroundSelected);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                backGroundSelectedBoxRenderer.initWithSpriteFrameName(backGroundSelected);
                break;
            default:
                break;
        }
        this._updateChildrenDisplayedRGBA();
        this._backGroundSelectedBoxRendererAdaptDirty = true;
        this._findLayout();
    },
    loadTextureFrontCross: function (cross, texType) {
        if (!cross)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._frontCrossFileName = cross;
        this._frontCrossTexType = texType;
        var self = this;
        var frontCrossRenderer = this._frontCrossRenderer;
        if(!frontCrossRenderer._textureLoaded){
            frontCrossRenderer.addEventListener("load", function(){
                this.loadTextureFrontCross(this._frontCrossFileName, this._frontCrossTexType);
            }, this);
        }
        switch (this._frontCrossTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                frontCrossRenderer.initWithFile(cross);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                frontCrossRenderer.initWithSpriteFrameName(cross);
                break;
            default:
                break;
        }
        this._updateChildrenDisplayedRGBA();
        this._frontCrossRendererAdaptDirty = true;
        this._findLayout();
    },
    loadTextureBackGroundDisabled: function (backGroundDisabled, texType) {
        if (!backGroundDisabled)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._backGroundDisabledFileName = backGroundDisabled;
        this._backGroundDisabledTexType = texType;
        var self = this;
        var backGroundBoxDisabledRenderer = this._backGroundBoxDisabledRenderer;
        if(!backGroundBoxDisabledRenderer._textureLoaded){
            backGroundBoxDisabledRenderer.addEventListener("load", function(){
                this.loadTextureBackGroundDisabled(this._backGroundDisabledFileName, this._backGroundDisabledTexType);
            }, this);
        }
        switch (this._backGroundDisabledTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                backGroundBoxDisabledRenderer.initWithFile(backGroundDisabled);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                backGroundBoxDisabledRenderer.initWithSpriteFrameName(backGroundDisabled);
                break;
            default:
                break;
        }
        this._updateChildrenDisplayedRGBA();
        this._backGroundBoxDisabledRendererAdaptDirty = true;
        this._findLayout();
    },
    loadTextureFrontCrossDisabled: function (frontCrossDisabled, texType) {
        if (!frontCrossDisabled)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._frontCrossDisabledFileName = frontCrossDisabled;
        this._frontCrossDisabledTexType = texType;
        var self = this;
        var frontCrossDisabledRenderer = this._frontCrossDisabledRenderer;
        if(!frontCrossDisabledRenderer._textureLoaded){
            frontCrossDisabledRenderer.addEventListener("load", function(){
                this.loadTextureFrontCrossDisabled(this._frontCrossDisabledFileName, this._frontCrossDisabledTexType);
            }, this);
        }
        switch (this._frontCrossDisabledTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                frontCrossDisabledRenderer.initWithFile(frontCrossDisabled);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                frontCrossDisabledRenderer.initWithSpriteFrameName(frontCrossDisabled);
                break;
            default:
                break;
        }
        this._updateChildrenDisplayedRGBA();
        this._frontCrossDisabledRendererAdaptDirty = true;
        this._findLayout();
    },
    _onPressStateChangedToNormal: function () {
        this._backGroundBoxRenderer.setVisible(true);
        this._backGroundSelectedBoxRenderer.setVisible(false);
        this._backGroundBoxDisabledRenderer.setVisible(false);
        this._frontCrossDisabledRenderer.setVisible(false);
        this._backGroundBoxRenderer.setScale(this._backgroundTextureScaleX, this._backgroundTextureScaleY);
        this._frontCrossRenderer.setScale(this._backgroundTextureScaleX, this._backgroundTextureScaleY);
        if (this._isSelected)
            this._frontCrossRenderer.setVisible(true);
    },
    _onPressStateChangedToPressed: function () {
        if (!this._backGroundSelectedFileName){
            this._backGroundBoxRenderer.setScale(this._backgroundTextureScaleX + this._zoomScale, this._backgroundTextureScaleY + this._zoomScale);
            this._frontCrossRenderer.setScale(this._backgroundTextureScaleX + this._zoomScale, this._backgroundTextureScaleY + this._zoomScale);
        }else{
            this._backGroundBoxRenderer.setVisible(false);
            this._backGroundSelectedBoxRenderer.setVisible(true);
            this._backGroundBoxDisabledRenderer.setVisible(false);
            this._frontCrossDisabledRenderer.setVisible(false);
        }
    },
    _onPressStateChangedToDisabled: function () {
        if (this._backGroundDisabledFileName && this._frontCrossDisabledFileName){
            this._backGroundBoxRenderer.setVisible(false);
            this._backGroundBoxDisabledRenderer.setVisible(true);
        }
        this._backGroundSelectedBoxRenderer.setVisible(false);
        this._frontCrossRenderer.setVisible(false);
        this._backGroundBoxRenderer.setScale(this._backgroundTextureScaleX, this._backgroundTextureScaleY);
        this._frontCrossRenderer.setScale(this._backgroundTextureScaleX, this._backgroundTextureScaleY);
        if (this._isSelected) {
            this._frontCrossDisabledRenderer.setVisible(true);
        }
    },
    setZoomScale: function(scale){
        this._zoomScale = scale;
    },
    getZoomScale: function(){
        return this._zoomScale;
    },
    setSelectedState: function(selected){
        this.setSelected(selected);
    },
    setSelected: function (selected) {
        if (selected === this._isSelected)
            return;
        this._isSelected = selected;
        this._frontCrossRenderer.setVisible(this._isSelected);
    },
    getSelectedState: function(){
        return this.isSelected();
    },
    isSelected: function () {
        return this._isSelected;
    },
    _selectedEvent: function () {
        if(this._checkBoxEventSelector){
            if (this._checkBoxEventListener)
                this._checkBoxEventSelector.call(this._checkBoxEventListener, this, ccui.CheckBox.EVENT_SELECTED);
            else
                this._checkBoxEventSelector(this, ccui.CheckBox.EVENT_SELECTED);
        }
    },
    _unSelectedEvent: function () {
        if(this._checkBoxEventSelector){
            if (this._checkBoxEventListener)
                this._checkBoxEventSelector.call(this._checkBoxEventListener, this, ccui.CheckBox.EVENT_UNSELECTED);
            else
                this._checkBoxEventSelector(this, ccui.CheckBox.EVENT_UNSELECTED);
        }
    },
    _releaseUpEvent: function(){
        ccui.Widget.prototype._releaseUpEvent.call(this);
        if (this._isSelected){
            this.setSelected(false);
            this._unSelectedEvent();
        } else {
            this.setSelected(true);
            this._selectedEvent();
        }
    },
    addEventListenerCheckBox: function (selector, target) {
        this.addEventListener(selector, target);
    },
    addEventListener: function(selector, target){
        this._checkBoxEventSelector = selector;
        this._checkBoxEventListener = target;
    },
    getVirtualRendererSize: function(){
        return this._backGroundBoxRenderer.getContentSize();
    },
    _onSizeChanged: function () {
        ccui.Widget.prototype._onSizeChanged.call(this);
        this._backGroundBoxRendererAdaptDirty = true;
        this._backGroundSelectedBoxRendererAdaptDirty = true;
        this._frontCrossRendererAdaptDirty = true;
        this._backGroundBoxDisabledRendererAdaptDirty = true;
        this._frontCrossDisabledRendererAdaptDirty = true;
    },
    getVirtualRenderer: function () {
        return this._backGroundBoxRenderer;
    },
    _backGroundTextureScaleChangedWithSize: function () {
        var locRenderer = this._backGroundBoxRenderer, locContentSize = this._contentSize;
        if (this._ignoreSize){
            locRenderer.setScale(1.0);
            this._backgroundTextureScaleX = this._backgroundTextureScaleY = 1;
        }else{
            var textureSize = locRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0){
                locRenderer.setScale(1.0);
                this._backgroundTextureScaleX = this._backgroundTextureScaleY = 1;
                return;
            }
            var scaleX = locContentSize.width / textureSize.width;
            var scaleY = locContentSize.height / textureSize.height;
            this._backgroundTextureScaleX = scaleX;
            this._backgroundTextureScaleY = scaleY;
            locRenderer.setScaleX(scaleX);
            locRenderer.setScaleY(scaleY);
        }
        locRenderer.setPosition(locContentSize.width * 0.5, locContentSize.height * 0.5);
    },
    _backGroundSelectedTextureScaleChangedWithSize: function () {
        var locRenderer = this._backGroundSelectedBoxRenderer, locContentSize = this._contentSize;
        if (this._ignoreSize)
            locRenderer.setScale(1.0);
        else {
            var textureSize = locRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                locRenderer.setScale(1.0);
                return;
            }
            var scaleX = locContentSize.width / textureSize.width;
            var scaleY = locContentSize.height / textureSize.height;
            locRenderer.setScaleX(scaleX);
            locRenderer.setScaleY(scaleY);
        }
        locRenderer.setPosition(locContentSize.width * 0.5, locContentSize.height * 0.5);
    },
    _frontCrossTextureScaleChangedWithSize: function () {
        var locRenderer = this._frontCrossRenderer, locContentSize = this._contentSize;
        if (this._ignoreSize)
            locRenderer.setScale(1.0);
        else {
            var textureSize = locRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                locRenderer.setScale(1.0);
                return;
            }
            var scaleX = locContentSize.width / textureSize.width;
            var scaleY = locContentSize.height / textureSize.height;
            locRenderer.setScaleX(scaleX);
            locRenderer.setScaleY(scaleY);
        }
        locRenderer.setPosition(locContentSize.width * 0.5, locContentSize.height * 0.5);
    },
    _backGroundDisabledTextureScaleChangedWithSize: function () {
        var locRenderer = this._backGroundBoxDisabledRenderer, locContentSize = this._contentSize;
        if (this._ignoreSize)
            locRenderer.setScale(1.0);
        else {
            var textureSize = locRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                locRenderer.setScale(1.0);
                return;
            }
            var scaleX = locContentSize.width / textureSize.width;
            var scaleY = locContentSize.height / textureSize.height;
            locRenderer.setScaleX(scaleX);
            locRenderer.setScaleY(scaleY);
        }
        locRenderer.setPosition(locContentSize.width * 0.5, locContentSize.height * 0.5);
    },
    _frontCrossDisabledTextureScaleChangedWithSize: function () {
        var locRenderer = this._frontCrossDisabledRenderer, locContentSize = this._contentSize;
        if (this._ignoreSize) {
            locRenderer.setScale(1.0);
        } else {
            var textureSize = locRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                locRenderer.setScale(1.0);
                return;
            }
            var scaleX = locContentSize.width / textureSize.width;
            var scaleY = locContentSize.height / textureSize.height;
            locRenderer.setScaleX(scaleX);
            locRenderer.setScaleY(scaleY);
        }
        locRenderer.setPosition(locContentSize.width * 0.5, locContentSize.height * 0.5);
    },
    getDescription: function () {
        return "CheckBox";
    },
    _createCloneInstance: function () {
        return new ccui.CheckBox();
    },
    _copySpecialProperties: function (uiCheckBox) {
        if (uiCheckBox instanceof ccui.CheckBox) {
            this.loadTextureBackGround(uiCheckBox._backGroundFileName, uiCheckBox._backGroundTexType);
            this.loadTextureBackGroundSelected(uiCheckBox._backGroundSelectedFileName, uiCheckBox._backGroundSelectedTexType);
            this.loadTextureFrontCross(uiCheckBox._frontCrossFileName, uiCheckBox._frontCrossTexType);
            this.loadTextureBackGroundDisabled(uiCheckBox._backGroundDisabledFileName, uiCheckBox._backGroundDisabledTexType);
            this.loadTextureFrontCrossDisabled(uiCheckBox._frontCrossDisabledFileName, uiCheckBox._frontCrossDisabledTexType);
            this.setSelected(uiCheckBox._isSelected);
            this._checkBoxEventListener = uiCheckBox._checkBoxEventListener;
            this._checkBoxEventSelector = uiCheckBox._checkBoxEventSelector;
            this._ccEventCallback = uiCheckBox._ccEventCallback;
            this._zoomScale = uiCheckBox._zoomScale;
            this._backgroundTextureScaleX = uiCheckBox._backgroundTextureScaleX;
            this._backgroundTextureScaleY = uiCheckBox._backgroundTextureScaleY;
        }
    },
    _adaptRenderers: function(){
        if (this._backGroundBoxRendererAdaptDirty){
            this._backGroundTextureScaleChangedWithSize();
            this._backGroundBoxRendererAdaptDirty = false;
        }
        if (this._backGroundSelectedBoxRendererAdaptDirty) {
            this._backGroundSelectedTextureScaleChangedWithSize();
            this._backGroundSelectedBoxRendererAdaptDirty = false;
        }
        if (this._frontCrossRendererAdaptDirty){
            this._frontCrossTextureScaleChangedWithSize();
            this._frontCrossRendererAdaptDirty = false;
        }
        if (this._backGroundBoxDisabledRendererAdaptDirty) {
            this._backGroundDisabledTextureScaleChangedWithSize();
            this._backGroundBoxDisabledRendererAdaptDirty = false;
        }
        if (this._frontCrossDisabledRendererAdaptDirty) {
            this._frontCrossDisabledTextureScaleChangedWithSize();
            this._frontCrossDisabledRendererAdaptDirty = false;
        }
    }
});
var _p = ccui.CheckBox.prototype;
_p.selected;
cc.defineGetterSetter(_p, "selected", _p.isSelected, _p.setSelected);
_p = null;
ccui.CheckBox.create = function (backGround, backGroundSeleted, cross, backGroundDisabled, frontCrossDisabled, texType) {
    return new ccui.CheckBox(backGround, backGroundSeleted,cross,backGroundDisabled,frontCrossDisabled,texType);
};
ccui.CheckBox.EVENT_SELECTED = 0;
ccui.CheckBox.EVENT_UNSELECTED = 1;
ccui.CheckBox.BOX_RENDERER_ZORDER = -1;
ccui.CheckBox.BOX_SELECTED_RENDERER_ZORDER = -1;
ccui.CheckBox.BOX_DISABLED_RENDERER_ZORDER = -1;
ccui.CheckBox.FRONT_CROSS_RENDERER_ZORDER = -1;
ccui.CheckBox.FRONT_CROSS_DISABLED_RENDERER_ZORDER = -1;
ccui.ImageView = ccui.Widget.extend({
    _scale9Enabled: false,
    _prevIgnoreSize: true,
    _capInsets: null,
    _imageRenderer: null,
    _textureFile: "",
    _imageTexType: ccui.Widget.LOCAL_TEXTURE,
    _imageTextureSize: null,
    _className:"ImageView",
    _imageRendererAdaptDirty: true,
    ctor: function (imageFileName, texType) {
        this._capInsets = cc.rect(0,0,0,0);
        this._imageTextureSize = cc.size(this._capInsets.width, this._capInsets.height);
        ccui.Widget.prototype.ctor.call(this);
        texType = texType === undefined ? 0 : texType;
        this.init(imageFileName, texType);
    },
    init: function(imageFileName, texType){
        if(ccui.Widget.prototype.init.call(this)){
            if(imageFileName === undefined)
                this._imageTexType = ccui.Widget.LOCAL_TEXTURE;
            else
                this.loadTexture(imageFileName, texType);
            return true;
        }
        return false;
    },
    _initRenderer: function () {
        this._imageRenderer = new cc.Sprite();
        this.addProtectedChild(this._imageRenderer, ccui.ImageView.RENDERER_ZORDER, -1);
    },
    setRotation: function(rotate){
        this._imageRenderer.setRotation(rotate);
    },
    loadTexture: function (fileName, texType) {
        if (!fileName) {
            return;
        }
        var self = this;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._textureFile = fileName;
        this._imageTexType = texType;
        var imageRenderer = self._imageRenderer;
        if(!imageRenderer._textureLoaded){
            imageRenderer.addEventListener("load", function(){
                self.loadTexture(self._textureFile, self._imageTexType);
            });
        }
        switch (self._imageTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                if(self._scale9Enabled){
                    imageRenderer.initWithFile(fileName);
                    imageRenderer.setCapInsets(self._capInsets);
                }else{
                    imageRenderer.initWithFile(fileName);
                }
                break;
            case ccui.Widget.PLIST_TEXTURE:
                if(self._scale9Enabled){
                    imageRenderer.initWithSpriteFrameName(fileName);
                    imageRenderer.setCapInsets(self._capInsets);
                }else{
                    imageRenderer.initWithSpriteFrameName(fileName);
                }
                break;
            default:
                break;
        }
        self._imageTextureSize = imageRenderer.getContentSize();
        this._updateChildrenDisplayedRGBA();
        self._updateContentSizeWithTextureSize(self._imageTextureSize);
        self._imageRendererAdaptDirty = true;
        self._findLayout();
    },
    setTextureRect: function (rect) {
        if (!this._scale9Enabled)
            this._imageRenderer.setTextureRect(rect);
    },
    setScale9Enabled: function (able) {
        if (this._scale9Enabled === able)
            return;
        this._scale9Enabled = able;
        this.removeProtectedChild(this._imageRenderer);
        this._imageRenderer = null;
        if (this._scale9Enabled) {
            this._imageRenderer = new ccui.Scale9Sprite();
        } else {
            this._imageRenderer = new cc.Sprite();
        }
        this.loadTexture(this._textureFile, this._imageTexType);
        this.addProtectedChild(this._imageRenderer, ccui.ImageView.RENDERER_ZORDER, -1);
        if (this._scale9Enabled) {
            var ignoreBefore = this._ignoreSize;
            this.ignoreContentAdaptWithSize(false);
            this._prevIgnoreSize = ignoreBefore;
        } else
            this.ignoreContentAdaptWithSize(this._prevIgnoreSize);
        this.setCapInsets(this._capInsets);
        this._imageRendererAdaptDirty = true;
    },
    isScale9Enabled:function(){
        return this._scale9Enabled;
    },
    ignoreContentAdaptWithSize: function (ignore) {
        if (!this._scale9Enabled || (this._scale9Enabled && !ignore)) {
            ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, ignore);
            this._prevIgnoreSize = ignore;
        }
    },
    setCapInsets: function (capInsets) {
        if(!capInsets)
            return;
        var locInsets = this._capInsets;
        locInsets.x = capInsets.x;
        locInsets.y = capInsets.y;
        locInsets.width = capInsets.width;
        locInsets.height = capInsets.height;
        if (!this._scale9Enabled)
            return;
        this._imageRenderer.setCapInsets(capInsets);
    },
    getCapInsets:function(){
        return cc.rect(this._capInsets);
    },
    _onSizeChanged: function () {
        ccui.Widget.prototype._onSizeChanged.call(this);
        this._imageRendererAdaptDirty = true;
    },
    _adaptRenderers: function(){
        if (this._imageRendererAdaptDirty){
            this._imageTextureScaleChangedWithSize();
            this._imageRendererAdaptDirty = false;
        }
    },
    getVirtualRendererSize: function(){
        return cc.size(this._imageTextureSize);
    },
    getVirtualRenderer: function () {
        return this._imageRenderer;
    },
    _imageTextureScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            if (!this._scale9Enabled)
                this._imageRenderer.setScale(1.0);
        } else {
            if (this._scale9Enabled){
                this._imageRenderer.setPreferredSize(this._contentSize);
                this._imageRenderer.setScale(1);
            } else {
                var textureSize = this._imageTextureSize;
                if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                    this._imageRenderer.setScale(1.0);
                    return;
                }
                this._imageRenderer.setScaleX(this._contentSize.width / textureSize.width);
                this._imageRenderer.setScaleY(this._contentSize.height / textureSize.height);
            }
        }
        this._imageRenderer.setPosition(this._contentSize.width / 2.0, this._contentSize.height / 2.0);
    },
    getDescription: function () {
        return "ImageView";
    },
    _createCloneInstance:function(){
        return new ccui.ImageView();
    },
    _copySpecialProperties: function (imageView) {
        if(imageView instanceof ccui.ImageView){
            this._prevIgnoreSize = imageView._prevIgnoreSize;
            this.setScale9Enabled(imageView._scale9Enabled);
            this.loadTexture(imageView._textureFile, imageView._imageTexType);
            this.setCapInsets(imageView._capInsets);
        }
    },
    setContentSize: function(contentSize, height){
        if(height != null)
            contentSize = cc.size(contentSize, height);
        ccui.Widget.prototype.setContentSize.call(this, contentSize);
        if(!this._scale9Enabled){
            var iContentSize = this._imageRenderer.getContentSize();
            this._imageRenderer.setScaleX(contentSize.width / iContentSize.width);
            this._imageRenderer.setScaleY(contentSize.height / iContentSize.height);
        }else{
            this._imageRenderer.setContentSize(contentSize);
        }
    }
});
ccui.ImageView.create = function (imageFileName, texType) {
    return new ccui.ImageView(imageFileName, texType);
};
ccui.ImageView.RENDERER_ZORDER = -1;
ccui.LoadingBar = ccui.Widget.extend({
    _direction: null,
    _percent: 100,
    _totalLength: 0,
    _barRenderer: null,
    _renderBarTexType: ccui.Widget.LOCAL_TEXTURE,
    _barRendererTextureSize: null,
    _scale9Enabled: false,
    _prevIgnoreSize: true,
    _capInsets: null,
    _textureFile: "",
    _isTextureLoaded: false,
    _className: "LoadingBar",
    _barRendererAdaptDirty: true,
    ctor: function (textureName, percentage) {
        this._direction = ccui.LoadingBar.TYPE_LEFT;
        this._barRendererTextureSize = cc.size(0, 0);
        this._capInsets = cc.rect(0, 0, 0, 0);
        ccui.Widget.prototype.ctor.call(this);
        if(textureName !== undefined)
            this.loadTexture(textureName);
        if(percentage !== undefined)
            this.setPercent(percentage);
    },
    _initRenderer: function () {
        this._barRenderer = new cc.Sprite();
        this.addProtectedChild(this._barRenderer, ccui.LoadingBar.RENDERER_ZORDER, -1);
        this._barRenderer.setAnchorPoint(0.0, 0.5);
    },
    setDirection: function (dir) {
        if (this._direction === dir)
            return;
        this._direction = dir;
        switch (this._direction) {
            case ccui.LoadingBar.TYPE_LEFT:
                this._barRenderer.setAnchorPoint(0, 0.5);
                this._barRenderer.setPosition(0, this._contentSize.height*0.5);
                if (!this._scale9Enabled)
                    this._barRenderer.setFlippedX(false);
                break;
            case ccui.LoadingBar.TYPE_RIGHT:
                this._barRenderer.setAnchorPoint(1, 0.5);
                this._barRenderer.setPosition(this._totalLength,this._contentSize.height*0.5);
                if (!this._scale9Enabled)
                    this._barRenderer.setFlippedX(true);
                break;
        }
    },
    getDirection: function () {
        return this._direction;
    },
    loadTexture: function (texture, texType) {
        if (!texture)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._renderBarTexType = texType;
        this._textureFile = texture;
        var barRenderer = this._barRenderer;
        var self = this;
        if(!barRenderer._textureLoaded){
            barRenderer.addEventListener("load", function(){
                self.loadTexture(self._renderBarTexType, self._textureFile);
            });
        }
        switch (this._renderBarTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                barRenderer.initWithFile(texture);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                barRenderer.initWithSpriteFrameName(texture);
                break;
            default:
                break;
        }
        var bz = barRenderer.getContentSize();
        this._barRendererTextureSize.width = bz.width;
        this._barRendererTextureSize.height = bz.height;
        switch (this._direction) {
            case ccui.LoadingBar.TYPE_LEFT:
                barRenderer.setAnchorPoint(0,0.5);
                if (!this._scale9Enabled)
                    barRenderer.setFlippedX(false);
                break;
            case ccui.LoadingBar.TYPE_RIGHT:
                barRenderer.setAnchorPoint(1,0.5);
                if (!this._scale9Enabled)
                    barRenderer.setFlippedX(true);
                break;
        }
        if (this._scale9Enabled)
            barRenderer.setCapInsets(this._capInsets);
        this._updateChildrenDisplayedRGBA();
        this._barRendererScaleChangedWithSize();
        this._updateContentSizeWithTextureSize(this._barRendererTextureSize);
        this._barRendererAdaptDirty = true;
        this._findLayout();
    },
    setScale9Enabled: function (enabled) {
        if (this._scale9Enabled === enabled)
            return;
        this._scale9Enabled = enabled;
        this.removeProtectedChild(this._barRenderer);
        this._barRenderer = this._scale9Enabled ? new ccui.Scale9Sprite() : new cc.Sprite();
        this.loadTexture(this._textureFile, this._renderBarTexType);
        this.addProtectedChild(this._barRenderer, ccui.LoadingBar.RENDERER_ZORDER, -1);
        if (this._scale9Enabled) {
            var ignoreBefore = this._ignoreSize;
            this.ignoreContentAdaptWithSize(false);
            this._prevIgnoreSize = ignoreBefore;
        } else
            this.ignoreContentAdaptWithSize(this._prevIgnoreSize);
        this.setCapInsets(this._capInsets);
        this.setPercent(this._percent);
        this._barRendererAdaptDirty = true;
    },
    isScale9Enabled: function () {
        return this._scale9Enabled;
    },
    setCapInsets: function (capInsets) {
        if(!capInsets)
            return;
        var locInsets = this._capInsets;
        locInsets.x = capInsets.x;
        locInsets.y = capInsets.y;
        locInsets.width = capInsets.width;
        locInsets.height = capInsets.height;
        if (this._scale9Enabled)
            this._barRenderer.setCapInsets(capInsets);
    },
    getCapInsets: function () {
        return cc.rect(this._capInsets);
    },
    setPercent: function (percent) {
        if(percent > 100)
            percent = 100;
        if(percent < 0)
            percent = 0;
        if (percent === this._percent)
            return;
        this._percent = percent;
        if (this._totalLength <= 0)
            return;
        var res = this._percent / 100.0;
        if (this._scale9Enabled)
            this._setScale9Scale();
        else {
            var spriteRenderer = this._barRenderer;
            var rect = spriteRenderer.getTextureRect();
            rect.width = this._barRendererTextureSize.width * res;
            this._barRenderer.setTextureRect(
                cc.rect(
                    rect.x,
                    rect.y,
                    this._barRendererTextureSize.width * res,
                    this._barRendererTextureSize.height
                )
            );
        }
    },
    setContentSize: function(contentSize, height){
        ccui.Widget.prototype.setContentSize.call(this, contentSize, height);
        this._totalLength = (height === undefined) ? contentSize.width : contentSize;
    },
    getPercent: function () {
        return this._percent;
    },
    _onSizeChanged: function () {
        ccui.Widget.prototype._onSizeChanged.call(this);
        this._barRendererAdaptDirty = true;
    },
    _adaptRenderers: function(){
        if (this._barRendererAdaptDirty){
            this._barRendererScaleChangedWithSize();
            this._barRendererAdaptDirty = false;
        }
    },
    ignoreContentAdaptWithSize: function (ignore) {
        if (!this._scale9Enabled || (this._scale9Enabled && !ignore)) {
            ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, ignore);
            this._prevIgnoreSize = ignore;
        }
    },
    getVirtualRendererSize:function(){
        return cc.size(this._barRendererTextureSize);
    },
    getVirtualRenderer: function () {
        return this._barRenderer;
    },
    _barRendererScaleChangedWithSize: function () {
        var locBarRender = this._barRenderer, locContentSize = this._contentSize;
        if(this._unifySize){
            this._totalLength = this._contentSize.width;
            this.setPercent(this._percent);
        }else if (this._ignoreSize) {
            if (!this._scale9Enabled) {
                this._totalLength = this._barRendererTextureSize.width;
                locBarRender.setScale(1.0);
            }
        } else {
            this._totalLength = locContentSize.width;
            if (this._scale9Enabled){
                this._setScale9Scale();
                locBarRender.setScale(1.0);
            } else {
                var textureSize = this._barRendererTextureSize;
                if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                    locBarRender.setScale(1.0);
                    return;
                }
                var scaleX = locContentSize.width / textureSize.width;
                var scaleY = locContentSize.height / textureSize.height;
                locBarRender.setScaleX(scaleX);
                locBarRender.setScaleY(scaleY);
            }
        }
        switch (this._direction) {
            case ccui.LoadingBar.TYPE_LEFT:
                locBarRender.setPosition(0, locContentSize.height * 0.5);
                break;
            case ccui.LoadingBar.TYPE_RIGHT:
                locBarRender.setPosition(this._totalLength, locContentSize.height * 0.5);
                break;
            default:
                break;
        }
    },
    _setScale9Scale: function () {
        var width = (this._percent) / 100 * this._totalLength;
        this._barRenderer.setPreferredSize(cc.size(width, this._contentSize.height));
    },
    getDescription: function () {
        return "LoadingBar";
    },
    _createCloneInstance: function () {
        return new ccui.LoadingBar();
    },
    _copySpecialProperties: function (loadingBar) {
        if(loadingBar instanceof ccui.LoadingBar){
            this._prevIgnoreSize = loadingBar._prevIgnoreSize;
            this.setScale9Enabled(loadingBar._scale9Enabled);
            this.loadTexture(loadingBar._textureFile, loadingBar._renderBarTexType);
            this.setCapInsets(loadingBar._capInsets);
            this.setPercent(loadingBar._percent);
            this.setDirection(loadingBar._direction);
        }
    }
});
var _p = ccui.LoadingBar.prototype;
_p.direction;
cc.defineGetterSetter(_p, "direction", _p.getDirection, _p.setDirection);
_p.percent;
cc.defineGetterSetter(_p, "percent", _p.getPercent, _p.setPercent);
_p = null;
ccui.LoadingBar.create = function (textureName, percentage) {
    return new ccui.LoadingBar(textureName, percentage);
};
ccui.LoadingBar.TYPE_LEFT = 0;
ccui.LoadingBar.TYPE_RIGHT = 1;
ccui.LoadingBar.RENDERER_ZORDER = -1;
ccui.Slider = ccui.Widget.extend({
    _barRenderer: null,
    _progressBarRenderer: null,
    _barTextureSize: null,
    _progressBarTextureSize: null,
    _slidBallNormalRenderer: null,
    _slidBallPressedRenderer: null,
    _slidBallDisabledRenderer: null,
    _slidBallRenderer: null,
    _barLength: 0,
    _percent: 0,
    _scale9Enabled: false,
    _prevIgnoreSize: true,
    _textureFile: "",
    _progressBarTextureFile: "",
    _slidBallNormalTextureFile: "",
    _slidBallPressedTextureFile: "",
    _slidBallDisabledTextureFile: "",
    _capInsetsBarRenderer: null,
    _capInsetsProgressBarRenderer: null,
    _sliderEventListener: null,
    _sliderEventSelector: null,
    _barTexType: ccui.Widget.LOCAL_TEXTURE,
    _progressBarTexType: ccui.Widget.LOCAL_TEXTURE,
    _ballNTexType: ccui.Widget.LOCAL_TEXTURE,
    _ballPTexType: ccui.Widget.LOCAL_TEXTURE,
    _ballDTexType: ccui.Widget.LOCAL_TEXTURE,
    _isTextureLoaded: false,
    _className: "Slider",
    _barRendererAdaptDirty: true,
    _progressBarRendererDirty: true,
    _unifySize: false,
    _zoomScale: 0.1,
    _sliderBallNormalTextureScaleX: 1,
    _sliderBallNormalTextureScaleY: 1,
    ctor: function (barTextureName, normalBallTextureName, resType) {
        this._barTextureSize = cc.size(0,0);
        this._progressBarTextureSize = cc.size(0, 0);
        this._capInsetsBarRenderer = cc.rect(0, 0, 0, 0);
        this._capInsetsProgressBarRenderer = cc.rect(0, 0, 0, 0);
        ccui.Widget.prototype.ctor.call(this);
        resType = resType == null ? 0 : resType;
        this.setTouchEnabled(true);
        barTextureName && this.loadBarTexture(barTextureName, resType);
        normalBallTextureName && this.loadSlidBallTextures(normalBallTextureName, resType);
    },
    init: function () {
        return ccui.Widget.prototype.init.call(this);
    },
    _initRenderer: function () {
        this._barRenderer = new cc.Sprite();
        this._progressBarRenderer = new cc.Sprite();
        this._progressBarRenderer.setAnchorPoint(0.0, 0.5);
        this.addProtectedChild(this._barRenderer, ccui.Slider.BASEBAR_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._progressBarRenderer, ccui.Slider.PROGRESSBAR_RENDERER_ZORDER, -1);
        this._slidBallNormalRenderer = new cc.Sprite();
        this._slidBallPressedRenderer = new cc.Sprite();
        this._slidBallPressedRenderer.setVisible(false);
        this._slidBallDisabledRenderer = new cc.Sprite();
        this._slidBallDisabledRenderer.setVisible(false);
        this._slidBallRenderer = new cc.Node();
        this._slidBallRenderer.addChild(this._slidBallNormalRenderer);
        this._slidBallRenderer.addChild(this._slidBallPressedRenderer);
        this._slidBallRenderer.addChild(this._slidBallDisabledRenderer);
        this._slidBallRenderer.setCascadeColorEnabled(true);
        this._slidBallRenderer.setCascadeOpacityEnabled(true);
        this.addProtectedChild(this._slidBallRenderer, ccui.Slider.BALL_RENDERER_ZORDER, -1);
    },
    loadBarTexture: function (fileName, texType) {
        if (!fileName) {
            return;
        }
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._textureFile = fileName;
        this._barTexType = texType;
        var barRenderer = this._barRenderer;
        var self = this;
        if(!barRenderer._textureLoaded){
            barRenderer.addEventListener("load", function(){
                self.loadBarTexture(self._textureFile, self._barTexType);
            });
        }
        switch (this._barTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                barRenderer.initWithFile(fileName);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                barRenderer.initWithSpriteFrameName(fileName);
                break;
            default:
                break;
        }
        this._updateChildrenDisplayedRGBA();
        this._barRendererAdaptDirty = true;
        this._progressBarRendererDirty = true;
        this._updateContentSizeWithTextureSize(this._barRenderer.getContentSize());
        this._findLayout();
        this._barTextureSize = this._barRenderer.getContentSize();
    },
    loadProgressBarTexture: function (fileName, texType) {
        if (!fileName) {
            return;
        }
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._progressBarTextureFile = fileName;
        this._progressBarTexType = texType;
        var progressBarRenderer = this._progressBarRenderer;
        var self = this;
        if(!progressBarRenderer._textureLoaded){
            progressBarRenderer.addEventListener("load", function(){
                self.loadProgressBarTexture(self._progressBarTextureFile, self._progressBarTexType);
            });
        }
        switch (this._progressBarTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                progressBarRenderer.initWithFile(fileName);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                progressBarRenderer.initWithSpriteFrameName(fileName);
                break;
            default:
                break;
        }
        this._updateChildrenDisplayedRGBA();
        this._progressBarRenderer.setAnchorPoint(cc.p(0, 0.5));
        var tz = this._progressBarRenderer.getContentSize();
        this._progressBarTextureSize = {width: tz.width, height: tz.height};
        this._progressBarRendererDirty = true;
        this._findLayout();
    },
    setScale9Enabled: function (able) {
        if (this._scale9Enabled === able)
            return;
        this._scale9Enabled = able;
        this.removeProtectedChild(this._barRenderer, true);
        this.removeProtectedChild(this._progressBarRenderer, true);
        this._barRenderer = null;
        this._progressBarRenderer = null;
        if (this._scale9Enabled) {
            this._barRenderer = new ccui.Scale9Sprite();
            this._progressBarRenderer = new ccui.Scale9Sprite();
        } else {
            this._barRenderer = new cc.Sprite();
            this._progressBarRenderer = new cc.Sprite();
        }
        this.loadBarTexture(this._textureFile, this._barTexType);
        this.loadProgressBarTexture(this._progressBarTextureFile, this._progressBarTexType);
        this.addProtectedChild(this._barRenderer, ccui.Slider.BASEBAR_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._progressBarRenderer, ccui.Slider.PROGRESSBAR_RENDERER_ZORDER, -1);
        if (this._scale9Enabled) {
            var ignoreBefore = this._ignoreSize;
            this.ignoreContentAdaptWithSize(false);
            this._prevIgnoreSize = ignoreBefore;
        } else {
            this.ignoreContentAdaptWithSize(this._prevIgnoreSize);
        }
        this.setCapInsetsBarRenderer(this._capInsetsBarRenderer);
        this.setCapInsetProgressBarRenderer(this._capInsetsProgressBarRenderer);
        this._barRendererAdaptDirty = true;
        this._progressBarRendererDirty = true;
    },
    isScale9Enabled: function () {
        return this._scale9Enabled;
    },
    ignoreContentAdaptWithSize: function (ignore) {
        if (!this._scale9Enabled || (this._scale9Enabled && !ignore)) {
            ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, ignore);
            this._prevIgnoreSize = ignore;
        }
    },
    setCapInsets: function (capInsets) {
        this.setCapInsetsBarRenderer(capInsets);
        this.setCapInsetProgressBarRenderer(capInsets);
    },
    setCapInsetsBarRenderer: function (capInsets) {
        if(!capInsets)
            return;
        var locInsets = this._capInsetsBarRenderer;
        locInsets.x = capInsets.x;
        locInsets.y = capInsets.y;
        locInsets.width = capInsets.width;
        locInsets.height = capInsets.height;
        if (!this._scale9Enabled)
            return;
        this._barRenderer.setCapInsets(capInsets);
    },
    getCapInsetsBarRenderer: function () {
        return cc.rect(this._capInsetsBarRenderer);
    },
    setCapInsetProgressBarRenderer: function (capInsets) {
        if(!capInsets)
            return;
        var locInsets = this._capInsetsProgressBarRenderer;
        locInsets.x = capInsets.x;
        locInsets.y = capInsets.y;
        locInsets.width = capInsets.width;
        locInsets.height = capInsets.height;
        if (!this._scale9Enabled)
            return;
        this._progressBarRenderer.setCapInsets(capInsets);
    },
    getCapInsetsProgressBarRenderer: function () {
        return cc.rect(this._capInsetsProgressBarRenderer);
    },
    loadSlidBallTextures: function (normal, pressed, disabled, texType) {
        this.loadSlidBallTextureNormal(normal, texType);
        this.loadSlidBallTexturePressed(pressed, texType);
        this.loadSlidBallTextureDisabled(disabled, texType);
    },
    loadSlidBallTextureNormal: function (normal, texType) {
        if (!normal) {
            return;
        }
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._slidBallNormalTextureFile = normal;
        this._ballNTexType = texType;
        var self = this;
        if(!this._slidBallNormalRenderer._textureLoaded){
            this._slidBallNormalRenderer.addEventListener("load", function(){
                self.loadSlidBallTextureNormal(self._slidBallNormalTextureFile, self._ballNTexType);
            });
        }
        switch (this._ballNTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._slidBallNormalRenderer.initWithFile(normal);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._slidBallNormalRenderer.initWithSpriteFrameName(normal);
                break;
            default:
                break;
        }
        this._updateChildrenDisplayedRGBA();
        this._findLayout();
    },
    loadSlidBallTexturePressed: function (pressed, texType) {
        if (!pressed) {
            return;
        }
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._slidBallPressedTextureFile = pressed;
        this._ballPTexType = texType;
        var self = this;
        if(!this._slidBallPressedRenderer._textureLoaded){
            this._slidBallPressedRenderer.addEventListener("load", function(){
                self.loadSlidBallTexturePressed(self._slidBallPressedTextureFile, self._ballPTexType);
            });
        }
        switch (this._ballPTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._slidBallPressedRenderer.initWithFile(pressed);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._slidBallPressedRenderer.initWithSpriteFrameName(pressed);
                break;
            default:
                break;
        }
        this._updateChildrenDisplayedRGBA();
        this._findLayout();
    },
    loadSlidBallTextureDisabled: function (disabled, texType) {
        if (!disabled) {
            return;
        }
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._slidBallDisabledTextureFile = disabled;
        this._ballDTexType = texType;
        var self = this;
        if(!this._slidBallDisabledRenderer._textureLoaded){
            this._slidBallDisabledRenderer.addEventListener("load", function(){
                self.loadSlidBallTextureDisabled(self._slidBallDisabledTextureFile, self._ballDTexType);
            });
        }
        switch (this._ballDTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._slidBallDisabledRenderer.initWithFile(disabled);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._slidBallDisabledRenderer.initWithSpriteFrameName(disabled);
                break;
            default:
                break;
        }
        this._updateChildrenDisplayedRGBA();
        this._findLayout();
    },
    setPercent: function (percent) {
        if (percent > 100)
            percent = 100;
        if (percent < 0)
            percent = 0;
        this._percent = percent;
        var res = percent / 100.0;
        var dis = this._barLength * res;
        this._slidBallRenderer.setPosition(dis, this._contentSize.height / 2);
        if (this._scale9Enabled)
            this._progressBarRenderer.setPreferredSize(cc.size(dis, this._contentSize.height));
        else {
            var spriteRenderer = this._progressBarRenderer;
            var rect = spriteRenderer.getTextureRect();
            spriteRenderer.setTextureRect(
                cc.rect(rect.x, rect.y, dis, rect.height),
                spriteRenderer.isTextureRectRotated()
            );
        }
    },
    hitTest: function(pt){
        var nsp = this._slidBallNormalRenderer.convertToNodeSpace(pt);
        var ballSize = this._slidBallNormalRenderer.getContentSize();
        var ballRect = cc.rect(0,0, ballSize.width, ballSize.height);
        return (nsp.x >= ballRect.x &&
            nsp.x <= (ballRect.x + ballRect.width) &&
            nsp.y >= ballRect.y &&
            nsp.y <= (ballRect.y +ballRect.height));
    },
    onTouchBegan: function (touch, event) {
        var pass = ccui.Widget.prototype.onTouchBegan.call(this, touch, event);
        if (this._hit) {
            var nsp = this.convertToNodeSpace(this._touchBeganPosition);
            this.setPercent(this._getPercentWithBallPos(nsp.x));
            this._percentChangedEvent();
        }
        return pass;
    },
    onTouchMoved: function (touch, event) {
        var touchPoint = touch.getLocation();
        var nsp = this.convertToNodeSpace(touchPoint);
        this.setPercent(this._getPercentWithBallPos(nsp.x));
        this._percentChangedEvent();
    },
    onTouchEnded: function (touch, event) {
        ccui.Widget.prototype.onTouchEnded.call(this, touch, event);
    },
    onTouchCancelled: function (touch, event) {
        ccui.Widget.prototype.onTouchCancelled.call(this, touch, event);
    },
    _getPercentWithBallPos: function (px) {
        return ((px/this._barLength)*100);
    },
    addEventListenerSlider: function (selector, target) {
        this.addEventListener(selector, target);
    },
    addEventListener: function(selector, target){
        this._sliderEventSelector = selector;
        this._sliderEventListener = target;
    },
    _percentChangedEvent: function () {
        if(this._sliderEventSelector){
            if (this._sliderEventListener)
                this._sliderEventSelector.call(this._sliderEventListener, this, ccui.Slider.EVENT_PERCENT_CHANGED);
            else
                this._sliderEventSelector(this, ccui.Slider.EVENT_PERCENT_CHANGED);
        }
        if (this._ccEventCallback)
            this._ccEventCallback(this, ccui.Slider.EVENT_PERCENT_CHANGED);
    },
    getPercent: function () {
        return this._percent;
    },
    _onSizeChanged: function () {
        ccui.Widget.prototype._onSizeChanged.call(this);
        this._barRendererAdaptDirty = true;
        this._progressBarRendererDirty = true;
    },
    _adaptRenderers: function(){
        if (this._barRendererAdaptDirty)
        {
            this._barRendererScaleChangedWithSize();
            this._barRendererAdaptDirty = false;
        }
        if (this._progressBarRendererDirty)
        {
            this._progressBarRendererScaleChangedWithSize();
            this._progressBarRendererDirty = false;
        }
    },
    getVirtualRendererSize: function(){
        return this._barRenderer.getContentSize();
    },
    getVirtualRenderer: function () {
        return this._barRenderer;
    },
    _barRendererScaleChangedWithSize: function () {
        if (this._unifySize){
            this._barLength = this._contentSize.width;
            this._barRenderer.setPreferredSize(this._contentSize);
        }else if(this._ignoreSize) {
            this._barRenderer.setScale(1.0);
            this._barLength = this._contentSize.width;
        }else {
            this._barLength = this._contentSize.width;
            if (this._scale9Enabled) {
                this._barRenderer.setPreferredSize(this._contentSize);
                this._barRenderer.setScale(1.0);
            } else {
                var btextureSize = this._barTextureSize;
                if (btextureSize.width <= 0.0 || btextureSize.height <= 0.0) {
                    this._barRenderer.setScale(1.0);
                    return;
                }
                var bscaleX = this._contentSize.width / btextureSize.width;
                var bscaleY = this._contentSize.height / btextureSize.height;
                this._barRenderer.setScaleX(bscaleX);
                this._barRenderer.setScaleY(bscaleY);
            }
        }
        this._barRenderer.setPosition(this._contentSize.width / 2.0, this._contentSize.height / 2.0);
        this.setPercent(this._percent);
    },
    _progressBarRendererScaleChangedWithSize: function () {
        if(this._unifySize){
            this._progressBarRenderer.setPreferredSize(this._contentSize);
        }else if(this._ignoreSize) {
            if (!this._scale9Enabled) {
                var ptextureSize = this._progressBarTextureSize;
                var pscaleX = this._contentSize.width / ptextureSize.width;
                var pscaleY = this._contentSize.height / ptextureSize.height;
                this._progressBarRenderer.setScaleX(pscaleX);
                this._progressBarRenderer.setScaleY(pscaleY);
            }
        }
        else {
            if (this._scale9Enabled) {
                this._progressBarRenderer.setPreferredSize(this._contentSize);
                this._progressBarRenderer.setScale(1);
            }
            else {
                var ptextureSize = this._progressBarTextureSize;
                if (ptextureSize.width <= 0.0 || ptextureSize.height <= 0.0) {
                    this._progressBarRenderer.setScale(1.0);
                    return;
                }
                var pscaleX = this._contentSize.width / ptextureSize.width;
                var pscaleY = this._contentSize.height / ptextureSize.height;
                this._progressBarRenderer.setScaleX(pscaleX);
                this._progressBarRenderer.setScaleY(pscaleY);
            }
        }
        this._progressBarRenderer.setPosition(0.0, this._contentSize.height / 2.0);
        this.setPercent(this._percent);
    },
    _onPressStateChangedToNormal: function () {
        this._slidBallNormalRenderer.setVisible(true);
        this._slidBallPressedRenderer.setVisible(false);
        this._slidBallDisabledRenderer.setVisible(false);
        this._slidBallNormalRenderer.setScale(this._sliderBallNormalTextureScaleX, this._sliderBallNormalTextureScaleY);
    },
    _onPressStateChangedToPressed: function () {
        if (!this._slidBallPressedTextureFile){
            this._slidBallNormalRenderer.setScale(this._sliderBallNormalTextureScaleX + this._zoomScale, this._sliderBallNormalTextureScaleY + this._zoomScale);
        }else{
            this._slidBallNormalRenderer.setVisible(false);
            this._slidBallPressedRenderer.setVisible(true);
            this._slidBallDisabledRenderer.setVisible(false);
        }
    },
    _onPressStateChangedToDisabled: function () {
        if (this._slidBallDisabledTextureFile){
            this._slidBallNormalRenderer.setVisible(false);
            this._slidBallDisabledRenderer.setVisible(true);
        }
        this._slidBallNormalRenderer.setScale(this._sliderBallNormalTextureScaleX, this._sliderBallNormalTextureScaleY);
        this._slidBallPressedRenderer.setVisible(false);
    },
    setZoomScale: function(scale){
        this._zoomScale = scale;
    },
    getZoomScale: function(){
        return this._zoomScale;
    },
    getDescription: function () {
        return "Slider";
    },
    _createCloneInstance: function () {
        return new ccui.Slider();
    },
    _copySpecialProperties: function (slider) {
        this._prevIgnoreSize = slider._prevIgnoreSize;
        this.setScale9Enabled(slider._scale9Enabled);
        this.loadBarTexture(slider._textureFile, slider._barTexType);
        this.loadProgressBarTexture(slider._progressBarTextureFile, slider._progressBarTexType);
        this.loadSlidBallTextureNormal(slider._slidBallNormalTextureFile, slider._ballNTexType);
        this.loadSlidBallTexturePressed(slider._slidBallPressedTextureFile, slider._ballPTexType);
        this.loadSlidBallTextureDisabled(slider._slidBallDisabledTextureFile, slider._ballDTexType);
        this.setPercent(slider.getPercent());
        this._sliderEventListener = slider._sliderEventListener;
        this._sliderEventSelector = slider._sliderEventSelector;
        this._zoomScale = slider._zoomScale;
        this._ccEventCallback = slider._ccEventCallback;
    }
});
var _p = ccui.Slider.prototype;
_p.percent;
cc.defineGetterSetter(_p, "percent", _p.getPercent, _p.setPercent);
_p = null;
ccui.Slider.create = function (barTextureName, normalBallTextureName, resType) {
    return new ccui.Slider(barTextureName, normalBallTextureName, resType);
};
ccui.Slider.EVENT_PERCENT_CHANGED = 0;
ccui.Slider.BASEBAR_RENDERER_ZORDER = -3;
ccui.Slider.PROGRESSBAR_RENDERER_ZORDER = -2;
ccui.Slider.BALL_RENDERER_ZORDER = -1;
ccui.Text = ccui.Widget.extend({
    _touchScaleChangeEnabled: false,
    _normalScaleValueX: 1,
    _normalScaleValueY: 1,
    _fontName: "Thonburi",
    _fontSize: 10,
    _onSelectedScaleOffset:0.5,
    _labelRenderer: "",
    _textAreaSize: null,
    _textVerticalAlignment: 0,
    _textHorizontalAlignment: 0,
    _className: "Text",
    _type: null,
    _labelRendererAdaptDirty: true,
    ctor: function (textContent, fontName, fontSize) {
        this._type = ccui.Text.Type.SYSTEM;
        this._textAreaSize = cc.size(0, 0);
        ccui.Widget.prototype.ctor.call(this);
        fontSize !== undefined && this.init(textContent, fontName, fontSize);
    },
    init: function (textContent, fontName, fontSize) {
        if (ccui.Widget.prototype.init.call(this)) {
            if(arguments.length > 0){
                this.setFontName(fontName);
                this.setFontSize(fontSize);
                this.setString(textContent);
            }else{
                this.setFontName(this._fontName);
            }
            return true;
        }
        return false;
    },
    _initRenderer: function () {
        this._labelRenderer = new cc.LabelTTF();
        this.addProtectedChild(this._labelRenderer, ccui.Text.RENDERER_ZORDER, -1);
    },
    setText: function (text) {
        cc.log("Please use the setString");
        this.setString(text);
    },
    setString: function (text) {
        if(text === this._labelRenderer.getString())
            return;
        this._labelRenderer.setString(text);
        this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
        this._labelRendererAdaptDirty = true;
    },
    getStringValue: function () {
        cc.log("Please use the getString");
        return this._labelRenderer.getString();
    },
    getString: function () {
        return this._labelRenderer.getString();
    },
    getStringLength: function () {
        return this._labelRenderer.getStringLength();
    },
    setFontSize: function (size) {
        this._labelRenderer.setFontSize(size);
        this._fontSize = size;
        this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
        this._labelRendererAdaptDirty = true;
    },
    getFontSize: function () {
        return this._fontSize;
    },
    setFontName: function (name) {
        this._fontName = name;
        this._labelRenderer.setFontName(name);
        this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
        this._labelRendererAdaptDirty = true;
    },
    getFontName: function () {
        return this._fontName;
    },
    _setFont: function (font) {
        var res = cc.LabelTTF._fontStyleRE.exec(font);
        if (res) {
            this._fontSize = parseInt(res[1]);
            this._fontName = res[2];
            this._labelRenderer._setFont(font);
            this._labelScaleChangedWithSize();
        }
    },
    _getFont: function () {
        return this._labelRenderer._getFont();
    },
    getType: function(){
        return  this._type;
    },
    setTextAreaSize: function (size) {
        this._labelRenderer.setDimensions(size);
        if (!this._ignoreSize){
            this._customSize = size;
        }
        this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
        this._labelRendererAdaptDirty = true;
    },
    getTextAreaSize: function(){
        return this._labelRenderer.getDimensions();
    },
    setTextHorizontalAlignment: function (alignment) {
        this._labelRenderer.setHorizontalAlignment(alignment);
        this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
        this._labelRendererAdaptDirty = true;
    },
    getTextHorizontalAlignment: function () {
        return this._labelRenderer.getHorizontalAlignment();
    },
    setTextVerticalAlignment: function (alignment) {
        this._labelRenderer.setVerticalAlignment(alignment);
        this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
        this._labelRendererAdaptDirty = true;
    },
    getTextVerticalAlignment: function () {
        return this._labelRenderer.getVerticalAlignment();
    },
    setTouchScaleChangeEnabled: function (enable) {
        this._touchScaleChangeEnabled = enable;
    },
    isTouchScaleChangeEnabled: function () {
        return this._touchScaleChangeEnabled;
    },
    _onPressStateChangedToNormal: function () {
        if (!this._touchScaleChangeEnabled)
            return;
        this._labelRenderer.setScaleX(this._normalScaleValueX);
        this._labelRenderer.setScaleY(this._normalScaleValueY);
    },
    _onPressStateChangedToPressed: function () {
        if (!this._touchScaleChangeEnabled)
            return;
        this._labelRenderer.setScaleX(this._normalScaleValueX + this._onSelectedScaleOffset);
        this._labelRenderer.setScaleY(this._normalScaleValueY + this._onSelectedScaleOffset);
    },
    _onPressStateChangedToDisabled: function () {
    },
    _onSizeChanged: function () {
        ccui.Widget.prototype._onSizeChanged.call(this);
        this._labelRendererAdaptDirty = true;
    },
    _adaptRenderers: function(){
        if (this._labelRendererAdaptDirty) {
            this._labelScaleChangedWithSize();
            this._labelRendererAdaptDirty = false;
        }
    },
    getVirtualRendererSize: function(){
        return this._labelRenderer.getContentSize();
    },
    getVirtualRenderer: function () {
        return this._labelRenderer;
    },
    getAutoRenderSize: function(){
        var virtualSize = this._labelRenderer.getContentSize();
        if (!this._ignoreSize) {
            this._labelRenderer.setDimensions(0, 0);
            virtualSize = this._labelRenderer.getContentSize();
            this._labelRenderer.setDimensions(this._contentSize.width, this._contentSize.height);
        }
        return virtualSize;
    },
    _labelScaleChangedWithSize: function () {
        var locContentSize = this._contentSize;
        if (this._ignoreSize) {
            this._labelRenderer.setDimensions(0,0);
            this._labelRenderer.setScale(1.0);
            this._normalScaleValueX = this._normalScaleValueY = 1;
        } else {
            this._labelRenderer.setDimensions(cc.size(locContentSize.width, locContentSize.height));
            var textureSize = this._labelRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                this._labelRenderer.setScale(1.0);
                return;
            }
            var scaleX = locContentSize.width / textureSize.width;
            var scaleY = locContentSize.height / textureSize.height;
            this._labelRenderer.setScaleX(scaleX);
            this._labelRenderer.setScaleY(scaleY);
            this._normalScaleValueX = scaleX;
            this._normalScaleValueY = scaleY;
        }
        this._labelRenderer.setPosition(locContentSize.width / 2.0, locContentSize.height / 2.0);
    },
    getDescription: function () {
        return "Label";
    },
    enableShadow: function(shadowColor, offset, blurRadius){
        this._labelRenderer.enableShadow(shadowColor, offset, blurRadius);
    },
    enableOutline: function(outlineColor, outlineSize){
        this._labelRenderer.enableStroke(outlineColor, outlineSize);
    },
    enableGlow: function(glowColor){
        if (this._type === ccui.Text.Type.TTF)
            this._labelRenderer.enableGlow(glowColor);
    },
    disableEffect: function(){
        if(this._labelRenderer.disableEffect)
            this._labelRenderer.disableEffect();
    },
    _createCloneInstance: function () {
        return new ccui.Text();
    },
    _copySpecialProperties: function (uiLabel) {
        if(uiLabel instanceof ccui.Text){
            this.setFontName(uiLabel._fontName);
            this.setFontSize(uiLabel.getFontSize());
            this.setString(uiLabel.getString());
            this.setTouchScaleChangeEnabled(uiLabel.touchScaleEnabled);
            this.setTextAreaSize(uiLabel._textAreaSize);
            this.setTextHorizontalAlignment(uiLabel._labelRenderer.getHorizontalAlignment());
            this.setTextVerticalAlignment(uiLabel._labelRenderer.getVerticalAlignment());
            this.setContentSize(uiLabel.getContentSize());
        }
    },
    _setBoundingWidth: function (value) {
        this._textAreaSize.width = value;
        this._labelRenderer._setBoundingWidth(value);
        this._labelScaleChangedWithSize();
    },
    _setBoundingHeight: function (value) {
        this._textAreaSize.height = value;
        this._labelRenderer._setBoundingHeight(value);
        this._labelScaleChangedWithSize();
    },
    _getBoundingWidth: function () {
        return this._textAreaSize.width;
    },
    _getBoundingHeight: function () {
        return this._textAreaSize.height;
    },
    _changePosition: function(){
        this._adaptRenderers();
    },
    setColor: function(color){
        cc.ProtectedNode.prototype.setColor.call(this, color);
        this._labelRenderer.setColor(color);
    },
    setTextColor: function(color){
        this._labelRenderer.setFontFillColor(color);
    },
    getTextColor: function(){
        return this._labelRenderer._getFillStyle();
    }
});
var _p = ccui.Text.prototype;
_p.boundingWidth;
cc.defineGetterSetter(_p, "boundingWidth", _p._getBoundingWidth, _p._setBoundingWidth);
_p.boundingHeight;
cc.defineGetterSetter(_p, "boundingHeight", _p._getBoundingHeight, _p._setBoundingHeight);
_p.string;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
_p.stringLength;
cc.defineGetterSetter(_p, "stringLength", _p.getStringLength);
_p.font;
cc.defineGetterSetter(_p, "font", _p._getFont, _p._setFont);
_p.fontSize;
cc.defineGetterSetter(_p, "fontSize", _p.getFontSize, _p.setFontSize);
_p.fontName;
cc.defineGetterSetter(_p, "fontName", _p.getFontName, _p.setFontName);
_p.textAlign;
cc.defineGetterSetter(_p, "textAlign", _p.getTextHorizontalAlignment, _p.setTextHorizontalAlignment);
_p.verticalAlign;
cc.defineGetterSetter(_p, "verticalAlign", _p.getTextVerticalAlignment, _p.setTextVerticalAlignment);
_p = null;
ccui.Label = ccui.Text.create = function (textContent, fontName, fontSize) {
    return new ccui.Text(textContent, fontName, fontSize);
};
ccui.Text.RENDERER_ZORDER = -1;
ccui.Text.Type = {
    SYSTEM: 0,
    TTF: 1
};
ccui.TextAtlas = ccui.Widget.extend({
    _labelAtlasRenderer: null,
    _stringValue: "",
    _charMapFileName: "",
    _itemWidth: 0,
    _itemHeight: 0,
    _startCharMap: "",
    _className: "TextAtlas",
    _labelAtlasRendererAdaptDirty: null,
    ctor: function (stringValue, charMapFile, itemWidth, itemHeight, startCharMap) {
        ccui.Widget.prototype.ctor.call(this);
        startCharMap !== undefined && this.setProperty(stringValue, charMapFile, itemWidth, itemHeight, startCharMap);
    },
    _initRenderer: function () {
        this._labelAtlasRenderer = new cc.LabelAtlas();
        this._labelAtlasRenderer.setAnchorPoint(cc.p(0.5, 0.5));
        this.addProtectedChild(this._labelAtlasRenderer, ccui.TextAtlas.RENDERER_ZORDER, -1);
    },
    setProperty: function (stringValue, charMapFile, itemWidth, itemHeight, startCharMap) {
        this._stringValue = stringValue;
        this._charMapFileName = charMapFile;
        this._itemWidth = itemWidth;
        this._itemHeight = itemHeight;
        this._startCharMap = startCharMap;
        this._labelAtlasRenderer.initWithString(
            stringValue,
            this._charMapFileName,
            this._itemWidth,
            this._itemHeight,
            this._startCharMap[0]
        );
        this._updateContentSizeWithTextureSize(this._labelAtlasRenderer.getContentSize());
        this._labelAtlasRendererAdaptDirty = true;
    },
    setString: function (value) {
        if(value === this._labelAtlasRenderer.getString())
            return;
        this._stringValue = value;
        this._labelAtlasRenderer.setString(value);
        this._updateContentSizeWithTextureSize(this._labelAtlasRenderer.getContentSize());
        this._labelAtlasRendererAdaptDirty = true;
    },
    setStringValue: function (value) {
        cc.log("Please use the setString");
        this.setString(value);
    },
    getStringValue: function () {
        cc.log("Please use the getString");
        return this.getString();
    },
    getString: function () {
        return this._labelAtlasRenderer.getString();
    },
    getStringLength: function(){
        return this._labelAtlasRenderer.getStringLength();
    },
    _onSizeChanged: function () {
        ccui.Widget.prototype._onSizeChanged.call(this);
        this._labelAtlasRendererAdaptDirty = true;
    },
    _adaptRenderers: function(){
        if (this._labelAtlasRendererAdaptDirty){
            this._labelAtlasScaleChangedWithSize();
            this._labelAtlasRendererAdaptDirty = false;
        }
    },
    getVirtualRendererSize: function(){
        return this._labelAtlasRenderer.getContentSize();
    },
    getVirtualRenderer: function () {
        return this._labelAtlasRenderer;
    },
    _labelAtlasScaleChangedWithSize: function () {
        var locRenderer = this._labelAtlasRenderer;
        if (this._ignoreSize) {
            locRenderer.setScale(1.0);
        } else {
            var textureSize = locRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                locRenderer.setScale(1.0);
                return;
            }
            locRenderer.setScaleX(this._contentSize.width / textureSize.width);
            locRenderer.setScaleY(this._contentSize.height / textureSize.height);
        }
        locRenderer.setPosition(this._contentSize.width / 2.0, this._contentSize.height / 2.0);
    },
    getDescription: function () {
        return "LabelAtlas";
    },
    _copySpecialProperties: function (labelAtlas) {
        if (labelAtlas){
            this.setProperty(labelAtlas._stringValue, labelAtlas._charMapFileName, labelAtlas._itemWidth, labelAtlas._itemHeight, labelAtlas._startCharMap);
        }
    },
    _createCloneInstance: function () {
        return new ccui.TextAtlas();
    }
});
var _p = ccui.TextAtlas.prototype;
_p.string;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
_p = null;
ccui.TextAtlas.create = function (stringValue, charMapFile, itemWidth, itemHeight, startCharMap) {
    return new ccui.TextAtlas(stringValue, charMapFile, itemWidth, itemHeight, startCharMap);
};
ccui.TextAtlas.RENDERER_ZORDER = -1;
ccui.LabelBMFont = ccui.TextBMFont = ccui.Widget.extend({
    _labelBMFontRenderer: null,
    _fntFileHasInit: false,
    _fntFileName: "",
    _stringValue: "",
    _className: "TextBMFont",
    _labelBMFontRendererAdaptDirty: true,
    ctor: function (text, filename) {
        ccui.Widget.prototype.ctor.call(this);
        if(filename != undefined){
            this.setFntFile(filename);
            this.setString(text);
        }
    },
    _initRenderer: function () {
        this._labelBMFontRenderer = new cc.LabelBMFont();
        this.addProtectedChild(this._labelBMFontRenderer, ccui.TextBMFont.RENDERER_ZORDER, -1);
    },
    setFntFile: function (fileName) {
        if (!fileName)
            return;
        this._fntFileName = fileName;
        this._fntFileHasInit = true;
        this._labelBMFontRenderer.initWithString(this._stringValue, fileName);
        this._updateContentSizeWithTextureSize(this._labelBMFontRenderer.getContentSize());
        this._labelBMFontRendererAdaptDirty = true;
        var _self = this;
        var locRenderer = _self._labelBMFontRenderer;
        if(!locRenderer._textureLoaded){
             locRenderer.addEventListener("load", function(){
                 _self.setFntFile(_self._fntFileName);
             });
        }
    },
    setText: function (value) {
        cc.log("Please use the setString");
        this.setString(value);
    },
    setString: function (value) {
        if(value === this._labelBMFontRenderer.getString())
            return;
        this._stringValue = value;
        this._labelBMFontRenderer.setString(value);
        if (!this._fntFileHasInit)
            return;
        this._updateContentSizeWithTextureSize(this._labelBMFontRenderer.getContentSize());
        this._labelBMFontRendererAdaptDirty = true;
    },
    getString: function () {
        return this._stringValue;
    },
    getStringLength: function(){
        return this._labelBMFontRenderer.getStringLength();
    },
    _onSizeChanged: function () {
        ccui.Widget.prototype._onSizeChanged.call(this);
        this._labelBMFontRendererAdaptDirty = true;
    },
    _adaptRenderers: function(){
        if (this._labelBMFontRendererAdaptDirty){
            this._labelBMFontScaleChangedWithSize();
            this._labelBMFontRendererAdaptDirty = false;
        }
    },
    getVirtualRendererSize: function(){
        return this._labelBMFontRenderer.getContentSize();
    },
    getVirtualRenderer: function () {
        return this._labelBMFontRenderer;
    },
    _labelBMFontScaleChangedWithSize: function () {
        var locRenderer = this._labelBMFontRenderer;
        if (this._ignoreSize)
            locRenderer.setScale(1.0);
        else {
            var textureSize = locRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                locRenderer.setScale(1.0);
                return;
            }
            locRenderer.setScaleX(this._contentSize.width / textureSize.width);
            locRenderer.setScaleY(this._contentSize.height / textureSize.height);
        }
        locRenderer.setPosition(this._contentSize.width / 2.0, this._contentSize.height / 2.0);
    },
    getDescription: function () {
        return "TextBMFont";
    },
    _createCloneInstance: function () {
        return new ccui.TextBMFont();
    },
    _copySpecialProperties: function (labelBMFont) {
        this.setFntFile(labelBMFont._fntFileName);
        this.setString(labelBMFont._stringValue);
    }
});
var _p = ccui.TextBMFont.prototype;
_p.string;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
_p = null;
ccui.TextBMFont.create = function (text, filename) {
    return new ccui.TextBMFont(text, filename);
};
ccui.TextBMFont.RENDERER_ZORDER = -1;
ccui._TextFieldRenderer = cc.TextFieldTTF.extend({
    _maxLengthEnabled: false,
    _maxLength: 0,
    _passwordEnabled: false,
    _passwordStyleText: "",
    _attachWithIME: false,
    _detachWithIME: false,
    _insertText: false,
    _deleteBackward: false,
    _className: "_TextFieldRenderer",
    ctor: function () {
        cc.TextFieldTTF.prototype.ctor.call(this);
        this._maxLengthEnabled = false;
        this._maxLength = 0;
        this._passwordEnabled = false;
        this._passwordStyleText = "*";
        this._attachWithIME = false;
        this._detachWithIME = false;
        this._insertText = false;
        this._deleteBackward = false;
    },
    onEnter: function () {
        cc.TextFieldTTF.prototype.onEnter.call(this);
        cc.TextFieldTTF.prototype.setDelegate.call(this, this);
    },
    onTextFieldAttachWithIME: function (sender) {
        this.setAttachWithIME(true);
        return false;
    },
    onTextFieldInsertText: function (sender, text, len) {
        if (len === 1 && text === "\n")
            return false;
        this.setInsertText(true);
        return (this._maxLengthEnabled) && (cc.TextFieldTTF.prototype.getCharCount.call(this) >= this._maxLength);
    },
    onTextFieldDeleteBackward: function (sender, delText, nLen) {
        this.setDeleteBackward(true);
        return false;
    },
    onTextFieldDetachWithIME: function (sender) {
        this.setDetachWithIME(true);
        return false;
    },
    insertText: function (text, len) {
        var input_text = text;
        if (text !== "\n"){
            if (this._maxLengthEnabled){
                var text_count = this.getString().length;
                if (text_count >= this._maxLength){
                    if (this._passwordEnabled)
                        this.setPasswordText(this.getString());
                    return;
                }
            }
        }
        cc.TextFieldTTF.prototype.insertText.call(this, input_text, len);
        if (this._passwordEnabled && cc.TextFieldTTF.prototype.getCharCount.call(this) > 0)
            this.setPasswordText(this.getString());
    },
    deleteBackward: function () {
        cc.TextFieldTTF.prototype.deleteBackward.call(this);
        if (cc.TextFieldTTF.prototype.getCharCount.call(this) > 0 && this._passwordEnabled)
            this.setPasswordText(this._inputText);
    },
    openIME: function () {
        cc.TextFieldTTF.prototype.attachWithIME.call(this);
    },
    closeIME: function () {
        cc.TextFieldTTF.prototype.detachWithIME.call(this);
    },
    setMaxLengthEnabled: function (enable) {
        this._maxLengthEnabled = enable;
    },
    isMaxLengthEnabled: function () {
        return this._maxLengthEnabled;
    },
    setMaxLength: function (length) {
        this._maxLength = length;
    },
    getMaxLength: function () {
        return this._maxLength;
    },
    getCharCount: function () {
        return cc.TextFieldTTF.prototype.getCharCount.call(this);
    },
    setPasswordEnabled: function (enable) {
        this._passwordEnabled = enable;
    },
    isPasswordEnabled: function () {
        return this._passwordEnabled;
    },
    setPasswordStyleText: function (styleText) {
        if (styleText.length > 1)
            return;
        var header = styleText.charCodeAt(0);
        if (header < 33 || header > 126)
            return;
        this._passwordStyleText = styleText;
    },
    setPasswordText: function (text) {
        var tempStr = "";
        var text_count = text.length;
        var max = text_count;
        if (this._maxLengthEnabled && text_count > this._maxLength)
            max = this._maxLength;
        for (var i = 0; i < max; ++i)
            tempStr += this._passwordStyleText;
        cc.LabelTTF.prototype.setString.call(this, tempStr);
    },
    setAttachWithIME: function (attach) {
        this._attachWithIME = attach;
    },
    getAttachWithIME: function () {
        return this._attachWithIME;
    },
    setDetachWithIME: function (detach) {
        this._detachWithIME = detach;
    },
    getDetachWithIME: function () {
        return this._detachWithIME;
    },
    setInsertText: function (insert) {
        this._insertText = insert;
    },
    getInsertText: function () {
        return this._insertText;
    },
    setDeleteBackward: function (deleteBackward) {
        this._deleteBackward = deleteBackward;
    },
    getDeleteBackward: function () {
        return this._deleteBackward;
    },
    onDraw: function (sender) {
        return false;
    }
});
ccui._TextFieldRenderer.create = function (placeholder, fontName, fontSize) {
    var ret = new ccui._TextFieldRenderer();
    if (ret && ret.initWithString("", fontName, fontSize)) {
        if (placeholder)
            ret.setPlaceHolder(placeholder);
        return ret;
    }
    return null;
};
ccui.TextField = ccui.Widget.extend({
    _textFieldRenderer: null,
    _touchWidth: 0,
    _touchHeight: 0,
    _useTouchArea: false,
    _textFieldEventListener: null,
    _textFieldEventSelector: null,
    _passwordStyleText: "",
    _textFieldRendererAdaptDirty: true,
    _fontName: "",
    _fontSize: 12,
    _ccEventCallback: null,
    ctor: function (placeholder, fontName, fontSize) {
        ccui.Widget.prototype.ctor.call(this);
        if (fontName)
            this.setFontName(fontName);
        if (fontSize)
            this.setFontSize(fontSize);
        if (placeholder)
            this.setPlaceHolder(placeholder);
    },
    init: function(){
        if(ccui.Widget.prototype.init.call(this)){
            this.setTouchEnabled(true);
            return true;
        }
        return false;
    },
    onEnter: function () {
        ccui.Widget.prototype.onEnter.call(this);
        this.scheduleUpdate();
    },
    _initRenderer: function () {
        this._textFieldRenderer = ccui._TextFieldRenderer.create("input words here", "Thonburi", 20);
        this.addProtectedChild(this._textFieldRenderer, ccui.TextField.RENDERER_ZORDER, -1);
    },
    setTouchSize: function (size) {
        this._touchWidth = size.width;
        this._touchHeight = size.height;
    },
    setTouchAreaEnabled: function(enable){
        this._useTouchArea = enable;
    },
    hitTest: function(pt){
        if (this._useTouchArea) {
            var nsp = this.convertToNodeSpace(pt);
            var bb = cc.rect(
                -this._touchWidth * this._anchorPoint.x,
                -this._touchHeight * this._anchorPoint.y,
                this._touchWidth, this._touchHeight
            );
            return ( nsp.x >= bb.x && nsp.x <= bb.x + bb.width &&
                nsp.y >= bb.y && nsp.y <= bb.y + bb.height );
        } else
            return ccui.Widget.prototype.hitTest.call(this, pt);
    },
    getTouchSize: function () {
        return cc.size(this._touchWidth, this._touchHeight);
    },
    setText: function (text) {
        cc.log("Please use the setString");
        this.setString(text);
    },
    setString: function (text) {
        if (text == null)
            return;
        text = String(text);
        if (this.isMaxLengthEnabled())
            text = text.substr(0, this.getMaxLength());
        if (this.isPasswordEnabled()) {
            this._textFieldRenderer.setPasswordText(text);
            this._textFieldRenderer.setString("");
            this._textFieldRenderer.insertText(text, text.length);
        } else
            this._textFieldRenderer.setString(text);
        this._textFieldRendererAdaptDirty = true;
        this._updateContentSizeWithTextureSize(this._textFieldRenderer.getContentSize());
    },
    setPlaceHolder: function (value) {
        this._textFieldRenderer.setPlaceHolder(value);
        this._textFieldRendererAdaptDirty = true;
        this._updateContentSizeWithTextureSize(this._textFieldRenderer.getContentSize());
    },
    getPlaceHolder: function () {
        return this._textFieldRenderer.getPlaceHolder();
    },
    getPlaceHolderColor: function(){
        return this._textFieldRenderer.getPlaceHolderColor();
    },
    setPlaceHolderColor: function(color){
        this._textFieldRenderer.setColorSpaceHolder(color);
    },
    setTextColor: function(textColor){
        this._textFieldRenderer.setTextColor(textColor);
    },
    setFontSize: function (size) {
        this._textFieldRenderer.setFontSize(size);
        this._fontSize = size;
        this._textFieldRendererAdaptDirty = true;
        this._updateContentSizeWithTextureSize(this._textFieldRenderer.getContentSize());
    },
    getFontSize: function () {
        return this._fontSize;
    },
    setFontName: function (name) {
        this._textFieldRenderer.setFontName(name);
        this._fontName = name;
        this._textFieldRendererAdaptDirty = true;
        this._updateContentSizeWithTextureSize(this._textFieldRenderer.getContentSize());
    },
    getFontName: function () {
        return this._fontName;
    },
    didNotSelectSelf: function () {
        this._textFieldRenderer.detachWithIME();
    },
    getStringValue: function () {
        cc.log("Please use the getString");
        return this.getString();
    },
    getString: function () {
        return this._textFieldRenderer.getString();
    },
    getStringLength: function(){
        return this._textFieldRenderer.getStringLength();
    },
    onTouchBegan: function (touchPoint, unusedEvent) {
        var self = this;
        var pass = ccui.Widget.prototype.onTouchBegan.call(self, touchPoint, unusedEvent);
        if (self._hit) {
            setTimeout(function(){
                self._textFieldRenderer.attachWithIME();
            }, 0);
        }else{
            setTimeout(function(){
                self._textFieldRenderer.detachWithIME();
            }, 0);
        }
        return pass;
    },
    setMaxLengthEnabled: function (enable) {
        this._textFieldRenderer.setMaxLengthEnabled(enable);
    },
    isMaxLengthEnabled: function () {
        return this._textFieldRenderer.isMaxLengthEnabled();
    },
    setMaxLength: function (length) {
        this._textFieldRenderer.setMaxLength(length);
        this.setString(this.getString());
    },
    getMaxLength: function () {
        return this._textFieldRenderer.getMaxLength();
    },
    setPasswordEnabled: function (enable) {
        this._textFieldRenderer.setPasswordEnabled(enable);
    },
    isPasswordEnabled: function () {
        return this._textFieldRenderer.isPasswordEnabled();
    },
    setPasswordStyleText: function(styleText){
        this._textFieldRenderer.setPasswordStyleText(styleText);
        this._passwordStyleText = styleText;
        this.setString(this.getString());
    },
    getPasswordStyleText: function () {
        return this._passwordStyleText;
    },
    update: function (dt) {
        if (this.getDetachWithIME()) {
            this._detachWithIMEEvent();
            this.setDetachWithIME(false);
        }
        if (this.getAttachWithIME()) {
            this._attachWithIMEEvent();
            this.setAttachWithIME(false);
        }
        if (this.getInsertText()) {
            this._textFieldRendererAdaptDirty = true;
            this._updateContentSizeWithTextureSize(this._textFieldRenderer.getContentSize());
            this._insertTextEvent();
            this.setInsertText(false);
        }
        if (this.getDeleteBackward()) {
            this._textFieldRendererAdaptDirty = true;
            this._updateContentSizeWithTextureSize(this._textFieldRenderer.getContentSize());
            this._deleteBackwardEvent();
            this.setDeleteBackward(false);
        }
    },
    getAttachWithIME: function () {
        return this._textFieldRenderer.getAttachWithIME();
    },
    setAttachWithIME: function (attach) {
        this._textFieldRenderer.setAttachWithIME(attach);
    },
    getDetachWithIME: function () {
        return this._textFieldRenderer.getDetachWithIME();
    },
    setDetachWithIME: function (detach) {
        this._textFieldRenderer.setDetachWithIME(detach);
    },
    getInsertText: function () {
        return this._textFieldRenderer.getInsertText();
    },
    setInsertText: function (insertText) {
        this._textFieldRenderer.setInsertText(insertText);
    },
    getDeleteBackward: function () {
        return this._textFieldRenderer.getDeleteBackward();
    },
    setDeleteBackward: function (deleteBackward) {
        this._textFieldRenderer.setDeleteBackward(deleteBackward);
    },
    _attachWithIMEEvent: function () {
        if(this._textFieldEventSelector){
            if (this._textFieldEventListener)
                this._textFieldEventSelector.call(this._textFieldEventListener, this, ccui.TextField.EVENT_ATTACH_WITH_IME);
            else
                this._textFieldEventSelector(this, ccui.TextField.EVENT_ATTACH_WITH_IME);
        }
        if (this._ccEventCallback){
            this._ccEventCallback(this, ccui.TextField.EVENT_ATTACH_WITH_IME);
        }
    },
    _detachWithIMEEvent: function () {
        if(this._textFieldEventSelector){
            if (this._textFieldEventListener)
                this._textFieldEventSelector.call(this._textFieldEventListener, this, ccui.TextField.EVENT_DETACH_WITH_IME);
            else
                this._textFieldEventSelector(this, ccui.TextField.EVENT_DETACH_WITH_IME);
        }
        if (this._ccEventCallback)
            this._ccEventCallback(this, ccui.TextField.EVENT_DETACH_WITH_IME);
    },
    _insertTextEvent: function () {
        if(this._textFieldEventSelector){
            if (this._textFieldEventListener)
                this._textFieldEventSelector.call(this._textFieldEventListener, this, ccui.TextField.EVENT_INSERT_TEXT);
            else
                this._textFieldEventSelector(this, ccui.TextField.EVENT_INSERT_TEXT);
        }
        if (this._ccEventCallback)
            this._ccEventCallback(this, ccui.TextField.EVENT_INSERT_TEXT);
    },
    _deleteBackwardEvent: function () {
        if(this._textFieldEventSelector){
            if (this._textFieldEventListener)
                this._textFieldEventSelector.call(this._textFieldEventListener, this, ccui.TextField.EVENT_DELETE_BACKWARD);
            else
                this._textFieldEventSelector(this, ccui.TextField.EVENT_DELETE_BACKWARD);
        }
        if (this._ccEventCallback)
            this._ccEventCallback(this, ccui.TextField.EVENT_DELETE_BACKWARD);
    },
    addEventListenerTextField: function (selector, target) {
        this.addEventListener(selector, target);
    },
    addEventListener: function(selector, target){
        this._textFieldEventSelector = selector;
        this._textFieldEventListener = target;
    },
    _onSizeChanged: function () {
        ccui.Widget.prototype._onSizeChanged.call(this);
        this._textFieldRendererAdaptDirty = true;
    },
    _adaptRenderers: function(){
        if (this._textFieldRendererAdaptDirty) {
            this._textfieldRendererScaleChangedWithSize();
            this._textFieldRendererAdaptDirty = false;
        }
    },
    _textfieldRendererScaleChangedWithSize: function () {
        if (!this._ignoreSize)
            this._textFieldRenderer.setDimensions(this._contentSize);
        this._textFieldRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2);
    },
    getAutoRenderSize: function(){
        var virtualSize = this._textFieldRenderer.getContentSize();
        if (!this._ignoreSize) {
            this._textFieldRenderer.setDimensions(0, 0);
            virtualSize = this._textFieldRenderer.getContentSize();
            this._textFieldRenderer.setDimensions(this._contentSize.width, this._contentSize.height);
        }
        return virtualSize;
    },
    getVirtualRendererSize: function(){
        return this._textFieldRenderer.getContentSize();
    },
    getVirtualRenderer: function () {
        return this._textFieldRenderer;
    },
    getDescription: function () {
        return "TextField";
    },
    attachWithIME: function () {
        this._textFieldRenderer.attachWithIME();
    },
    _createCloneInstance: function () {
        return new ccui.TextField();
    },
    _copySpecialProperties: function (textField) {
        this.setString(textField._textFieldRenderer.getString());
        this.setPlaceHolder(textField.getString());
        this.setFontSize(textField._textFieldRenderer.getFontSize());
        this.setFontName(textField._textFieldRenderer.getFontName());
        this.setMaxLengthEnabled(textField.isMaxLengthEnabled());
        this.setMaxLength(textField.getMaxLength());
        this.setPasswordEnabled(textField.isPasswordEnabled());
        this.setPasswordStyleText(textField._passwordStyleText);
        this.setAttachWithIME(textField.getAttachWithIME());
        this.setDetachWithIME(textField.getDetachWithIME());
        this.setInsertText(textField.getInsertText());
        this.setDeleteBackward(textField.getDeleteBackward());
        this._ccEventCallback = textField._ccEventCallback;
        this._textFieldEventListener = textField._textFieldEventListener;
        this._textFieldEventSelector = textField._textFieldEventSelector;
    },
    setTextAreaSize: function(size){
        this.setContentSize(size);
    },
    setTextHorizontalAlignment: function(alignment){
        this._textFieldRenderer.setHorizontalAlignment(alignment);
    },
    setTextVerticalAlignment: function(alignment){
        this._textFieldRenderer.setVerticalAlignment(alignment);
    },
    _setFont: function (font) {
        this._textFieldRenderer._setFont(font);
        this._textFieldRendererAdaptDirty = true;
    },
    _getFont: function () {
        return this._textFieldRenderer._getFont();
    },
    _changePosition: function(){
        this._adaptRenderers();
    }
});
ccui.TextField.create = function(placeholder, fontName, fontSize){
    return new ccui.TextField(placeholder, fontName, fontSize);
};
var _p = ccui.TextField.prototype;
_p.string;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
_p.placeHolder;
cc.defineGetterSetter(_p, "placeHolder", _p.getPlaceHolder, _p.setPlaceHolder);
_p.font;
cc.defineGetterSetter(_p, "font", _p._getFont, _p._setFont);
_p.fontSize;
cc.defineGetterSetter(_p, "fontSize", _p.getFontSize, _p.setFontSize);
_p.fontName;
cc.defineGetterSetter(_p, "fontName", _p.getFontName, _p.setFontName);
_p.maxLengthEnabled;
cc.defineGetterSetter(_p, "maxLengthEnabled", _p.isMaxLengthEnabled, _p.setMaxLengthEnabled);
_p.maxLength;
cc.defineGetterSetter(_p, "maxLength", _p.getMaxLength, _p.setMaxLength);
_p.passwordEnabled;
cc.defineGetterSetter(_p, "passwordEnabled", _p.isPasswordEnabled, _p.setPasswordEnabled);
_p = null;
ccui.TextField.EVENT_ATTACH_WITH_IME = 0;
ccui.TextField.EVENT_DETACH_WITH_IME = 1;
ccui.TextField.EVENT_INSERT_TEXT = 2;
ccui.TextField.EVENT_DELETE_BACKWARD = 3;
ccui.TextField.RENDERER_ZORDER = -1;
ccui.RichElement = ccui.Class.extend({
    _type: 0,
    _tag: 0,
    _color: null,
    _opacity:0,
    ctor: function () {
        this._type = 0;
        this._tag = 0;
        this._color = cc.color(255, 255, 255, 255);
    },
    init: function (tag, color, opacity) {
        this._tag = tag;
        this._color.r = color.r;
        this._color.g = color.g;
        this._color.b = color.b;
        this._opacity = opacity;
        if(opacity === undefined)
            this._color.a = color.a;
        else
            this._color.a = opacity;
    }
});
ccui.RichElementText = ccui.RichElement.extend({
    _text: "",
    _fontName: "",
    _fontSize: 0,
    _fontDefinition: null,
    ctor: function (tag, colorOrFontDef, opacity, text, fontName, fontSize) {
        ccui.RichElement.prototype.ctor.call(this);
        this._type = ccui.RichElement.TEXT;
        this._text = "";
        this._fontName = "";
        this._fontSize = 0;
        if( colorOrFontDef && colorOrFontDef instanceof cc.FontDefinition)
            this.initWithStringAndTextDefinition(tag, text, colorOrFontDef, opacity);
        else
            fontSize && this.init(tag, colorOrFontDef, opacity, text, fontName, fontSize);
    },
    init: function (tag, color, opacity, text, fontName, fontSize) {
        ccui.RichElement.prototype.init.call(this, tag, color, opacity);
        this._text = text;
        this._fontName = fontName;
        this._fontSize = fontSize;
    },
    initWithStringAndTextDefinition: function(tag, text, fontDef, opacity){
        ccui.RichElement.prototype.init.call(this, tag, fontDef.fillStyle, opacity);
        this._fontDefinition = fontDef;
        this._text = text;
        this._fontName = fontDef.fontName;
        this._fontSize = fontDef.fontSize;
    }
});
ccui.RichElementText.create = function (tag, color, opacity, text, fontName, fontSize) {
    return new ccui.RichElementText(tag, color, opacity, text, fontName, fontSize);
};
ccui.RichElementImage = ccui.RichElement.extend({
    _filePath: "",
    _textureRect: null,
    _textureType: 0,
    ctor: function (tag, color, opacity, filePath) {
        ccui.RichElement.prototype.ctor.call(this);
        this._type = ccui.RichElement.IMAGE;
        this._filePath = "";
        this._textureRect = cc.rect(0, 0, 0, 0);
        this._textureType = 0;
        filePath !== undefined && this.init(tag, color, opacity, filePath);
    },
    init: function (tag, color, opacity, filePath) {
        ccui.RichElement.prototype.init.call(this, tag, color, opacity);
        this._filePath = filePath;
    }
});
ccui.RichElementImage.create = function (tag, color, opacity, filePath) {
    return new ccui.RichElementImage(tag, color, opacity, filePath);
};
ccui.RichElementCustomNode = ccui.RichElement.extend({
    _customNode: null,
    ctor: function (tag, color, opacity, customNode) {
        ccui.RichElement.prototype.ctor.call(this);
        this._type = ccui.RichElement.CUSTOM;
        this._customNode = null;
        customNode !== undefined && this.init(tag, color, opacity, customNode);
    },
    init: function (tag, color, opacity, customNode) {
        ccui.RichElement.prototype.init.call(this, tag, color, opacity);
        this._customNode = customNode;
    }
});
ccui.RichElementCustomNode.create = function (tag, color, opacity, customNode) {
    return new ccui.RichElementCustomNode(tag, color, opacity, customNode);
};
ccui.RichText = ccui.Widget.extend({
    _formatTextDirty: false,
    _richElements: null,
    _elementRenders: null,
    _leftSpaceWidth: 0,
    _verticalSpace: 0,
    _elementRenderersContainer: null,
    _lineBreakOnSpace: false,
    _textHorizontalAlignment: null,
    _textVerticalAlignment: null,
    ctor: function () {
        ccui.Widget.prototype.ctor.call(this);
        this._formatTextDirty = false;
        this._richElements = [];
        this._elementRenders = [];
        this._leftSpaceWidth = 0;
        this._verticalSpace = 0;
        this._textHorizontalAlignment = cc.TEXT_ALIGNMENT_LEFT;
        this._textVerticalAlignment = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
    },
    _initRenderer: function () {
        this._elementRenderersContainer = new cc.Node();
        this._elementRenderersContainer.setAnchorPoint(0.5, 0.5);
        this.addProtectedChild(this._elementRenderersContainer, 0, -1);
    },
    insertElement: function (element, index) {
        this._richElements.splice(index, 0, element);
        this._formatTextDirty = true;
    },
    pushBackElement: function (element) {
        this._richElements.push(element);
        this._formatTextDirty = true;
    },
    removeElement: function (element) {
        if (cc.isNumber(element))
            this._richElements.splice(element, 1);
         else
            cc.arrayRemoveObject(this._richElements, element);
        this._formatTextDirty = true;
    },
    formatText: function () {
        if (this._formatTextDirty) {
            this._elementRenderersContainer.removeAllChildren();
            this._elementRenders.length = 0;
            var i, element, locRichElements = this._richElements;
            if (this._ignoreSize) {
                this._addNewLine();
                for (i = 0; i < locRichElements.length; i++) {
                    element = locRichElements[i];
                    var elementRenderer = null;
                    switch (element._type) {
                        case ccui.RichElement.TEXT:
                            if( element._fontDefinition)
                                elementRenderer = new cc.LabelTTF(element._text, element._fontDefinition);
                            else
                                elementRenderer = new cc.LabelTTF(element._text, element._fontName, element._fontSize);
                            break;
                        case ccui.RichElement.IMAGE:
                            elementRenderer = new cc.Sprite(element._filePath);
                            break;
                        case ccui.RichElement.CUSTOM:
                            elementRenderer = element._customNode;
                            break;
                        default:
                            break;
                    }
                    elementRenderer.setColor(element._color);
                    elementRenderer.setOpacity(element._color.a);
                    this._pushToContainer(elementRenderer);
                }
            } else {
                this._addNewLine();
                for (i = 0; i < locRichElements.length; i++) {
                    element = locRichElements[i];
                    switch (element._type) {
                        case ccui.RichElement.TEXT:
                            if( element._fontDefinition)
                                this._handleTextRenderer(element._text, element._fontDefinition, element._fontDefinition.fontSize, element._fontDefinition.fillStyle);
                            else
                                this._handleTextRenderer(element._text, element._fontName, element._fontSize, element._color);
                            break;
                        case ccui.RichElement.IMAGE:
                            this._handleImageRenderer(element._filePath, element._color, element._color.a);
                            break;
                        case ccui.RichElement.CUSTOM:
                            this._handleCustomRenderer(element._customNode);
                            break;
                        default:
                            break;
                    }
                }
            }
            this.formatRenderers();
            this._formatTextDirty = false;
        }
    },
    _handleTextRenderer: function (text, fontNameOrFontDef, fontSize, color) {
        if(text === "")
            return;
        if(text === "\n"){
            this._addNewLine();
            return;
        }
        var textRenderer = fontNameOrFontDef instanceof cc.FontDefinition ? new cc.LabelTTF(text, fontNameOrFontDef) : new cc.LabelTTF(text, fontNameOrFontDef, fontSize);
        var textRendererWidth = textRenderer.getContentSize().width;
        this._leftSpaceWidth -= textRendererWidth;
        if (this._leftSpaceWidth < 0) {
            var overstepPercent = (-this._leftSpaceWidth) / textRendererWidth;
            var curText = text;
            var stringLength = curText.length;
            var leftLength = stringLength * (1 - overstepPercent);
            var leftWords = curText.substr(0, leftLength);
            var cutWords = curText.substr(leftLength, curText.length - 1);
            var validLeftLength = leftLength > 0;
            if(this._lineBreakOnSpace){
                var lastSpaceIndex = leftWords.lastIndexOf(' ');
                leftLength = lastSpaceIndex === -1 ? leftLength : lastSpaceIndex+1 ;
                cutWords = curText.substr(leftLength, curText.length - 1);
                validLeftLength = leftLength > 0 && cutWords !== " ";
            }
            if (validLeftLength) {
                var leftRenderer = null;
                if( fontNameOrFontDef instanceof cc.FontDefinition)
                {
                    leftRenderer = new cc.LabelTTF(leftWords.substr(0, leftLength), fontNameOrFontDef);
                    leftRenderer.setOpacity(fontNameOrFontDef.fillStyle.a);
                }else{
                    leftRenderer =  new cc.LabelTTF(leftWords.substr(0, leftLength), fontNameOrFontDef, fontSize);
                    leftRenderer.setColor(color);
                    leftRenderer.setOpacity(color.a);
                }
                this._pushToContainer(leftRenderer);
            }
            this._addNewLine();
            this._handleTextRenderer(cutWords, fontNameOrFontDef, fontSize, color);
        } else {
            if( fontNameOrFontDef instanceof cc.FontDefinition) {
                textRenderer.setOpacity(fontNameOrFontDef.fillStyle.a);
            }else {
                textRenderer.setColor(color);
                textRenderer.setOpacity(color.a);
            }
            this._pushToContainer(textRenderer);
        }
    },
    _handleImageRenderer: function (filePath, color, opacity) {
        var imageRenderer = new cc.Sprite(filePath);
        this._handleCustomRenderer(imageRenderer);
    },
    _handleCustomRenderer: function (renderer) {
        var imgSize = renderer.getContentSize();
        this._leftSpaceWidth -= imgSize.width;
        if (this._leftSpaceWidth < 0) {
            this._addNewLine();
            this._pushToContainer(renderer);
            this._leftSpaceWidth -= imgSize.width;
        } else
            this._pushToContainer(renderer);
    },
    _addNewLine: function () {
        this._leftSpaceWidth = this._customSize.width;
        this._elementRenders.push([]);
    },
    formatRenderers: function () {
        var newContentSizeHeight = 0, locRenderersContainer = this._elementRenderersContainer;
        var locElementRenders = this._elementRenders;
        var i, j, row, nextPosX, l;
        if (this._ignoreSize) {
            var newContentSizeWidth = 0;
            row = locElementRenders[0];
            nextPosX = 0;
            for (j = 0; j < row.length; j++) {
                l = row[j];
                l.setAnchorPoint(cc.p(0, 0));
                l.setPosition(nextPosX, 0);
                locRenderersContainer.addChild(l, 1, j);
                var lineHeight = l.getLineHeight ? l.getLineHeight() : newContentSizeHeight;
                var iSize = l.getContentSize();
                newContentSizeWidth += iSize.width;
                newContentSizeHeight = Math.max(Math.min(newContentSizeHeight, lineHeight), iSize.height);
                nextPosX += iSize.width;
            }
            if(this._textHorizontalAlignment !== cc.TEXT_ALIGNMENT_LEFT) {
                var offsetX = 0;
                if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_RIGHT)
                    offsetX = this._contentSize.width - nextPosX;
                else if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_CENTER)
                    offsetX = (this._contentSize.width - nextPosX) / 2;
                for (j = 0; j < row.length; j++)
                    row[j].x += offsetX;
            }
            locRenderersContainer.setContentSize(newContentSizeWidth, newContentSizeHeight);
        } else {
            var maxHeights = [];
            for (i = 0; i < locElementRenders.length; i++) {
                row = locElementRenders[i];
                var maxHeight = 0;
                for (j = 0; j < row.length; j++) {
                    l = row[j];
                    var lineHeight = l.getLineHeight ? l.getLineHeight() : l.getContentSize().height;
                    cc.log(lineHeight);
                    maxHeight = Math.max(Math.min(l.getContentSize().height, lineHeight), maxHeight);
                }
                maxHeights[i] = maxHeight;
                newContentSizeHeight += maxHeights[i];
            }
            var nextPosY = this._customSize.height;
            for (i = 0; i < locElementRenders.length; i++) {
                row = locElementRenders[i];
                nextPosX = 0;
                nextPosY -= (maxHeights[i] + this._verticalSpace);
                for (j = 0; j < row.length; j++) {
                    l = row[j];
                    l.setAnchorPoint(cc.p(0, 0));
                    l.setPosition(cc.p(nextPosX, nextPosY));
                    locRenderersContainer.addChild(l, 1);
                    nextPosX += l.getContentSize().width;
                }
                if( this._textHorizontalAlignment !== cc.TEXT_ALIGNMENT_LEFT || this._textVerticalAlignment !== cc.VERTICAL_TEXT_ALIGNMENT_TOP) {
                    var offsetX = 0;
                    if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_RIGHT)
                        offsetX = this._contentSize.width - nextPosX;
                    else if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_CENTER)
                        offsetX = (this._contentSize.width - nextPosX) / 2;
                    var offsetY = 0;
                    if (this._textVerticalAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM)
                        offsetY = this._customSize.height - newContentSizeHeight;
                    else if (this._textVerticalAlignment === cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
                        offsetY = (this._customSize.height - newContentSizeHeight) / 2;
                    for (j = 0; j < row.length; j++) {
                        l = row[j];
                        l.x += offsetX;
                        l.y -= offsetY;
                    }
                }
            }
            locRenderersContainer.setContentSize(this._contentSize);
        }
        var length = locElementRenders.length;
        for (i = 0; i<length; i++){
            locElementRenders[i].length = 0;
        }
        this._elementRenders.length = 0;
        this.setContentSize(this._ignoreSize?this.getVirtualRendererSize():this._customSize);
        this._updateContentSizeWithTextureSize(this._contentSize);
        locRenderersContainer.setPosition(this._contentSize.width * 0.5, this._contentSize.height * 0.5);
    },
    _pushToContainer: function (renderer) {
        if (this._elementRenders.length <= 0)
            return;
        this._elementRenders[this._elementRenders.length - 1].push(renderer);
    },
    _adaptRenderers: function(){
        this.formatText();
    },
    setVerticalSpace: function (space) {
        this._verticalSpace = space;
    },
    setAnchorPoint: function (pt) {
        ccui.Widget.prototype.setAnchorPoint.call(this, pt);
        this._elementRenderersContainer.setAnchorPoint(pt);
    },
    _setAnchorX: function (x) {
        ccui.Widget.prototype._setAnchorX.call(this, x);
        this._elementRenderersContainer._setAnchorX(x);
    },
    _setAnchorY: function (y) {
        ccui.Widget.prototype._setAnchorY.call(this, y);
        this._elementRenderersContainer._setAnchorY(y);
    },
    getVirtualRendererSize: function(){
        return this._elementRenderersContainer.getContentSize();
    },
    ignoreContentAdaptWithSize: function (ignore) {
        if (this._ignoreSize !== ignore) {
            this._formatTextDirty = true;
            ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, ignore);
        }
    },
    getContentSize: function(){
        this.formatText();
        return cc.Node.prototype.getContentSize.call(this);
    },
    _getWidth: function() {
        this.formatText();
        return cc.Node.prototype._getWidth.call(this);
    },
    _getHeight: function() {
        this.formatText();
        return cc.Node.prototype._getHeight.call(this);
    },
    setContentSize: function(contentSize, height){
        var locWidth = (height === undefined) ? contentSize.width : contentSize;
        var locHeight = (height === undefined) ? contentSize.height : height;
        ccui.Widget.prototype.setContentSize.call(this, locWidth, locHeight);
        this._formatTextDirty = true;
    },
    getDescription: function(){
        return "RichText";
    },
    setCascadeOpacityEnabled: function(value) {
        this._super(value);
        this._elementRenderersContainer.setCascadeOpacityEnabled(value);
    },
    setLineBreakOnSpace: function(value){
        this._lineBreakOnSpace = value;
        this._formatTextDirty = true;
        this.formatText();
    },
    setTextHorizontalAlignment: function(value){
        if(value !== this._textHorizontalAlignment) {
            this._textHorizontalAlignment = value;
            this.formatText();
        }
    },
    setTextVerticalAlignment: function(value){
        if(value !== this._textVerticalAlignment) {
            this._textVerticalAlignment = value;
            this.formatText();
        }
    }
});
ccui.RichText.create = function(){
    return new ccui.RichText();
};
ccui.RichElement.TEXT = 0;
ccui.RichElement.IMAGE = 1;
ccui.RichElement.CUSTOM = 2;
ccui.ScrollView = ccui.Layout.extend({
    _innerContainer: null,
    direction: null,
    _autoScrollDir: null,
    _topBoundary: 0,
    _bottomBoundary: 0,
    _leftBoundary: 0,
    _rightBoundary: 0,
    _bounceTopBoundary: 0,
    _bounceBottomBoundary: 0,
    _bounceLeftBoundary: 0,
    _bounceRightBoundary: 0,
    _autoScroll: false,
    _autoScrollAddUpTime: 0,
    _autoScrollOriginalSpeed: 0,
    _autoScrollAcceleration: 0,
    _isAutoScrollSpeedAttenuated: false,
    _needCheckAutoScrollDestination: false,
    _autoScrollDestination: null,
    _bePressed: false,
    _slidTime: 0,
    _moveChildPoint: null,
    _childFocusCancelOffset: 0,
    _leftBounceNeeded: false,
    _topBounceNeeded: false,
    _rightBounceNeeded: false,
    _bottomBounceNeeded: false,
    bounceEnabled: false,
    _bouncing: false,
    _bounceDir: null,
    _bounceOriginalSpeed: 0,
    inertiaScrollEnabled: false,
    _scrollViewEventListener: null,
    _scrollViewEventSelector: null,
    _className: "ScrollView",
    ctor: function () {
        ccui.Layout.prototype.ctor.call(this);
        this.direction = ccui.ScrollView.DIR_NONE;
        this._autoScrollDir = cc.p(0, 0);
        this._autoScrollAcceleration = -1000;
        this._autoScrollDestination = cc.p(0, 0);
        this._slidTime = 0;
        this._moveChildPoint = cc.p(0, 0);
        this._childFocusCancelOffset = 5;
        this._bounceDir = cc.p(0, 0);
        this._bounceOriginalSpeed = 0;
        this.inertiaScrollEnabled = true;
        this.setTouchEnabled(true);
    },
    init: function () {
        if (ccui.Layout.prototype.init.call(this)) {
            this.setClippingEnabled(true);
            this._innerContainer.setTouchEnabled(false);
            return true;
        }
        return false;
    },
    onEnter: function () {
        ccui.Layout.prototype.onEnter.call(this);
        this.scheduleUpdate(true);
    },
    findNextFocusedWidget: function(direction, current){
        if (this.getLayoutType() === ccui.Layout.LINEAR_VERTICAL
            || this.getLayoutType() === ccui.Layout.LINEAR_HORIZONTAL) {
            return this._innerContainer.findNextFocusedWidget(direction, current);
        } else
            return ccui.Widget.prototype.findNextFocusedWidget.call(this, direction, current);
    },
    _initRenderer: function () {
        ccui.Layout.prototype._initRenderer.call(this);
        this._innerContainer = new ccui.Layout();
        this._innerContainer.setColor(cc.color(255,255,255));
        this._innerContainer.setOpacity(255);
        this._innerContainer.setCascadeColorEnabled(true);
        this._innerContainer.setCascadeOpacityEnabled(true);
        this.addProtectedChild(this._innerContainer, 1, 1);
    },
    _onSizeChanged: function () {
        ccui.Layout.prototype._onSizeChanged.call(this);
        var locSize = this._contentSize;
        this._topBoundary = locSize.height;
        this._rightBoundary = locSize.width;
        var bounceBoundaryParameterX = locSize.width / 3;
        var bounceBoundaryParameterY = locSize.height / 3;
        this._bounceTopBoundary = locSize.height - bounceBoundaryParameterY;
        this._bounceBottomBoundary = bounceBoundaryParameterY;
        this._bounceLeftBoundary = bounceBoundaryParameterX;
        this._bounceRightBoundary = locSize.width - bounceBoundaryParameterX;
        var innerSize = this._innerContainer.getContentSize();
        this._innerContainer.setContentSize(cc.size(Math.max(innerSize.width, locSize.width), Math.max(innerSize.height, locSize.height)));
        this._innerContainer.setPosition(0, locSize.height - this._innerContainer.getContentSize().height);
    },
    setInnerContainerSize: function (size) {
        var innerContainer = this._innerContainer;
        var locSize = this._contentSize;
        var innerSizeWidth = locSize.width, innerSizeHeight = locSize.height;
        var originalInnerSize = innerContainer.getContentSize();
        if (size.width < locSize.width)
            cc.log("Inner width <= ScrollView width, it will be force sized!");
        else
            innerSizeWidth = size.width;
        if (size.height < locSize.height)
            cc.log("Inner height <= ScrollView height, it will be force sized!");
        else
            innerSizeHeight = size.height;
        innerContainer.setContentSize(cc.size(innerSizeWidth, innerSizeHeight));
        var newInnerSize, offset;
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                newInnerSize = innerContainer.getContentSize();
                offset = originalInnerSize.height - newInnerSize.height;
                this._scrollChildren(0, offset);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                if (innerContainer.getRightBoundary() <= locSize.width) {
                    newInnerSize = innerContainer.getContentSize();
                    offset = originalInnerSize.width - newInnerSize.width;
                    this._scrollChildren(offset, 0);
                }
                break;
            case ccui.ScrollView.DIR_BOTH:
                newInnerSize = innerContainer.getContentSize();
                var offsetY = originalInnerSize.height - newInnerSize.height;
                var offsetX = (innerContainer.getRightBoundary() <= locSize.width) ? originalInnerSize.width - newInnerSize.width : 0;
                this._scrollChildren(offsetX, offsetY);
                break;
            default:
                break;
        }
        var innerSize = innerContainer.getContentSize();
        var innerPos = innerContainer.getPosition();
        var innerAP = innerContainer.getAnchorPoint();
        if (innerContainer.getLeftBoundary() > 0.0)
            innerContainer.setPosition(innerAP.x * innerSize.width, innerPos.y);
        if (innerContainer.getRightBoundary() < locSize.width)
            innerContainer.setPosition(locSize.width - ((1.0 - innerAP.x) * innerSize.width), innerPos.y);
        if (innerPos.y > 0.0)
            innerContainer.setPosition(innerPos.x, innerAP.y * innerSize.height);
        if (innerContainer.getTopBoundary() < locSize.height)
            innerContainer.setPosition(innerPos.x, locSize.height - (1.0 - innerAP.y) * innerSize.height);
    },
    _setInnerWidth: function (width) {
        var locW = this._contentSize.width,
            innerWidth = locW,
            container = this._innerContainer,
            oldInnerWidth = container.width;
        if (width < locW)
            cc.log("Inner width <= scrollview width, it will be force sized!");
        else
            innerWidth = width;
        container.width = innerWidth;
        switch (this.direction) {
            case ccui.ScrollView.DIR_HORIZONTAL:
            case ccui.ScrollView.DIR_BOTH:
                if (container.getRightBoundary() <= locW) {
                    var newInnerWidth = container.width;
                    var offset = oldInnerWidth - newInnerWidth;
                    this._scrollChildren(offset, 0);
                }
                break;
        }
        var innerAX = container.anchorX;
        if (container.getLeftBoundary() > 0.0)
            container.x = innerAX * innerWidth;
        if (container.getRightBoundary() < locW)
            container.x = locW - ((1.0 - innerAX) * innerWidth);
    },
    _setInnerHeight: function (height) {
        var locH = this._contentSize.height,
            innerHeight = locH,
            container = this._innerContainer,
            oldInnerHeight = container.height;
        if (height < locH)
            cc.log("Inner height <= scrollview height, it will be force sized!");
        else
            innerHeight = height;
        container.height = innerHeight;
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
            case ccui.ScrollView.DIR_BOTH:
                var newInnerHeight = innerHeight;
                var offset = oldInnerHeight - newInnerHeight;
                this._scrollChildren(0, offset);
                break;
        }
        var innerAY = container.anchorY;
        if (container.getLeftBoundary() > 0.0)
            container.y = innerAY * innerHeight;
        if (container.getRightBoundary() < locH)
            container.y = locH - ((1.0 - innerAY) * innerHeight);
    },
    getInnerContainerSize: function () {
        return this._innerContainer.getContentSize();
    },
    _getInnerWidth: function () {
        return this._innerContainer.width;
    },
    _getInnerHeight: function () {
        return this._innerContainer.height;
    },
    addChild: function (widget, zOrder, tag) {
        if(!widget)
            return false;
        zOrder = zOrder || widget.getLocalZOrder();
        tag = tag || widget.getTag();
        return this._innerContainer.addChild(widget, zOrder, tag);
    },
    removeAllChildren: function () {
        this.removeAllChildrenWithCleanup(true);
    },
    removeAllChildrenWithCleanup: function(cleanup){
        this._innerContainer.removeAllChildrenWithCleanup(cleanup);
    },
    removeChild: function (child, cleanup) {
        return this._innerContainer.removeChild(child, cleanup);
    },
    getChildren: function () {
        return this._innerContainer.getChildren();
    },
    getChildrenCount: function () {
        return this._innerContainer.getChildrenCount();
    },
    getChildByTag: function (tag) {
        return this._innerContainer.getChildByTag(tag);
    },
    getChildByName: function (name) {
        return this._innerContainer.getChildByName(name);
    },
    _moveChildren: function (offsetX, offsetY) {
        var locContainer = this._innerContainer;
        this._moveChildPoint.x = locContainer.x + offsetX;
        this._moveChildPoint.y = locContainer.y + offsetY;
        this._innerContainer.setPosition(this._moveChildPoint);
    },
    _autoScrollChildren: function (dt) {
        var lastTime = this._autoScrollAddUpTime;
        this._autoScrollAddUpTime += dt;
        if (this._isAutoScrollSpeedAttenuated) {
            var nowSpeed = this._autoScrollOriginalSpeed + this._autoScrollAcceleration * this._autoScrollAddUpTime;
            if (nowSpeed <= 0) {
                this._stopAutoScrollChildren();
                this._checkNeedBounce();
            } else {
                var timeParam = lastTime * 2 + dt;
                var offset = (this._autoScrollOriginalSpeed + this._autoScrollAcceleration * timeParam * 0.5) * dt;
                var offsetX = offset * this._autoScrollDir.x;
                var offsetY = offset * this._autoScrollDir.y;
                if (!this._scrollChildren(offsetX, offsetY)) {
                    this._stopAutoScrollChildren();
                    this._checkNeedBounce();
                }
            }
        } else {
            if (this._needCheckAutoScrollDestination) {
                var xOffset = this._autoScrollDir.x * dt * this._autoScrollOriginalSpeed;
                var yOffset = this._autoScrollDir.y * dt * this._autoScrollOriginalSpeed;
                var notDone = this._checkCustomScrollDestination(xOffset, yOffset);
                var scrollCheck = this._scrollChildren(xOffset, yOffset);
                if (!notDone || !scrollCheck) {
                    this._stopAutoScrollChildren();
                    this._checkNeedBounce();
                }
            } else {
                if (!this._scrollChildren(this._autoScrollDir.x * dt * this._autoScrollOriginalSpeed,
                        this._autoScrollDir.y * dt * this._autoScrollOriginalSpeed)) {
                    this._stopAutoScrollChildren();
                    this._checkNeedBounce();
                }
            }
        }
    },
    _bounceChildren: function (dt) {
        var locSpeed = this._bounceOriginalSpeed;
        var locBounceDir = this._bounceDir;
        if (locSpeed <= 0.0)
            this._stopBounceChildren();
        if (!this._bounceScrollChildren(locBounceDir.x * dt * locSpeed, locBounceDir.y * dt * locSpeed))
            this._stopBounceChildren();
    },
    _checkNeedBounce: function () {
        if (!this.bounceEnabled)
            return false;
        this._checkBounceBoundary();
        var locTopBounceNeeded = this._topBounceNeeded, locBottomBounceNeeded = this._bottomBounceNeeded,
            locLeftBounceNeeded = this._leftBounceNeeded, locRightBounceNeeded = this._rightBounceNeeded;
        if (locTopBounceNeeded || locBottomBounceNeeded || locLeftBounceNeeded || locRightBounceNeeded) {
            var scrollVector, orSpeed;
            var locContentSize = this._contentSize, locInnerContainer = this._innerContainer;
            if (locTopBounceNeeded && locLeftBounceNeeded) {
                scrollVector = cc.pSub(cc.p(0.0, locContentSize.height), cc.p(locInnerContainer.getLeftBoundary(), locInnerContainer.getTopBoundary()));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this._startBounceChildren(orSpeed);
            } else if (locTopBounceNeeded && locRightBounceNeeded) {
                scrollVector = cc.pSub(cc.p(locContentSize.width, locContentSize.height), cc.p(locInnerContainer.getRightBoundary(), locInnerContainer.getTopBoundary()));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this._startBounceChildren(orSpeed);
            } else if (locBottomBounceNeeded && locLeftBounceNeeded) {
                scrollVector = cc.pSub(cc.p(0, 0), cc.p(locInnerContainer.getLeftBoundary(), locInnerContainer.getBottomBoundary()));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this._startBounceChildren(orSpeed);
            } else if (locBottomBounceNeeded && locRightBounceNeeded) {
                scrollVector = cc.pSub(cc.p(locContentSize.width, 0.0), cc.p(locInnerContainer.getRightBoundary(), locInnerContainer.getBottomBoundary()));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this._startBounceChildren(orSpeed);
            } else if (locTopBounceNeeded) {
                scrollVector = cc.pSub(cc.p(0, locContentSize.height), cc.p(0.0, locInnerContainer.getTopBoundary()));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this._startBounceChildren(orSpeed);
            } else if (locBottomBounceNeeded) {
                scrollVector = cc.pSub(cc.p(0, 0), cc.p(0.0, locInnerContainer.getBottomBoundary()));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this._startBounceChildren(orSpeed);
            } else if (locLeftBounceNeeded) {
                scrollVector = cc.pSub(cc.p(0, 0), cc.p(locInnerContainer.getLeftBoundary(), 0.0));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this._startBounceChildren(orSpeed);
            } else if (locRightBounceNeeded) {
                scrollVector = cc.pSub(cc.p(locContentSize.width, 0), cc.p(locInnerContainer.getRightBoundary(), 0.0));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this._startBounceChildren(orSpeed);
            }
            return true;
        }
        return false;
    },
    _checkBounceBoundary: function () {
        var locContainer = this._innerContainer;
        var icBottomPos = locContainer.getBottomBoundary();
        if (icBottomPos > this._bottomBoundary) {
            this._scrollToBottomEvent();
            this._bottomBounceNeeded = true;
        } else
            this._bottomBounceNeeded = false;
        var icTopPos = locContainer.getTopBoundary();
        if (icTopPos < this._topBoundary) {
            this._scrollToTopEvent();
            this._topBounceNeeded = true;
        } else
            this._topBounceNeeded = false;
        var icRightPos = locContainer.getRightBoundary();
        if (icRightPos < this._rightBoundary) {
            this._scrollToRightEvent();
            this._rightBounceNeeded = true;
        } else
            this._rightBounceNeeded = false;
        var icLeftPos = locContainer.getLeftBoundary();
        if (icLeftPos > this._leftBoundary) {
            this._scrollToLeftEvent();
            this._leftBounceNeeded = true;
        } else
            this._leftBounceNeeded = false;
    },
    _startBounceChildren: function (v) {
        this._bounceOriginalSpeed = v;
        this._bouncing = true;
    },
    _stopBounceChildren: function () {
        this._bouncing = false;
        this._bounceOriginalSpeed = 0.0;
        this._leftBounceNeeded = false;
        this._rightBounceNeeded = false;
        this._topBounceNeeded = false;
        this._bottomBounceNeeded = false;
    },
    _startAutoScrollChildrenWithOriginalSpeed: function (dir, v, attenuated, acceleration) {
        this._stopAutoScrollChildren();
        this._autoScrollDir.x = dir.x;
        this._autoScrollDir.y = dir.y;
        this._isAutoScrollSpeedAttenuated = attenuated;
        this._autoScrollOriginalSpeed = v;
        this._autoScroll = true;
        this._autoScrollAcceleration = acceleration;
    },
    _startAutoScrollChildrenWithDestination: function (des, time, attenuated) {
        this._needCheckAutoScrollDestination = false;
        this._autoScrollDestination = des;
        var dis = cc.pSub(des, this._innerContainer.getPosition());
        var dir = cc.pNormalize(dis);
        var orSpeed = 0.0;
        var acceleration = -1000.0;
        var disLength = cc.pLength(dis);
        if (attenuated) {
            acceleration = -(2 * disLength) / (time * time);
            orSpeed = 2 * disLength / time;
        } else {
            this._needCheckAutoScrollDestination = true;
            orSpeed = disLength / time;
        }
        this._startAutoScrollChildrenWithOriginalSpeed(dir, orSpeed, attenuated, acceleration);
    },
    _jumpToDestination: function (dstX, dstY) {
        if (dstX.x !== undefined) {
            dstY = dstX.y;
            dstX = dstX.x;
        }
        var finalOffsetX = dstX;
        var finalOffsetY = dstY;
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                if (dstY <= 0)
                    finalOffsetY = Math.max(dstY, this._contentSize.height - this._innerContainer.getContentSize().height);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                if (dstX <= 0)
                    finalOffsetX = Math.max(dstX, this._contentSize.width - this._innerContainer.getContentSize().width);
                break;
            case ccui.ScrollView.DIR_BOTH:
                if (dstY <= 0)
                    finalOffsetY = Math.max(dstY, this._contentSize.height - this._innerContainer.getContentSize().height);
                if (dstX <= 0)
                    finalOffsetX = Math.max(dstX, this._contentSize.width - this._innerContainer.getContentSize().width);
                break;
            default:
                break;
        }
        this._innerContainer.setPosition(finalOffsetX, finalOffsetY);
    },
    _stopAutoScrollChildren: function () {
        this._autoScroll = false;
        this._autoScrollOriginalSpeed = 0;
        this._autoScrollAddUpTime = 0;
    },
    _bounceScrollChildren: function (touchOffsetX, touchOffsetY) {
        var scrollEnabled = true;
        var realOffsetX, realOffsetY, icRightPos, icTopPos, icBottomPos;
        var locContainer = this._innerContainer;
        if (touchOffsetX > 0.0 && touchOffsetY > 0.0){
            realOffsetX = touchOffsetX;
            realOffsetY = touchOffsetY;
            icRightPos = locContainer.getRightBoundary();
            if (icRightPos + realOffsetX >= this._rightBoundary) {
                realOffsetX = this._rightBoundary - icRightPos;
                this._bounceRightEvent();
                scrollEnabled = false;
            }
            icTopPos = locContainer.getTopBoundary();
            if (icTopPos + touchOffsetY >= this._topBoundary) {
                realOffsetY = this._topBoundary - icTopPos;
                this._bounceTopEvent();
                scrollEnabled = false;
            }
            this._moveChildren(realOffsetX, realOffsetY);
        } else if (touchOffsetX < 0.0 && touchOffsetY > 0.0){
            realOffsetX = touchOffsetX;
            realOffsetY = touchOffsetY;
            icLefrPos = locContainer.getLeftBoundary();
            if (icLefrPos + realOffsetX <= this._leftBoundary) {
                realOffsetX = this._leftBoundary - icLefrPos;
                this._bounceLeftEvent();
                scrollEnabled = false;
            }
            icTopPos = locContainer.getTopBoundary();
            if (icTopPos + touchOffsetY >= this._topBoundary) {
                realOffsetY = this._topBoundary - icTopPos;
                this._bounceTopEvent();
                scrollEnabled = false;
            }
            this._moveChildren(realOffsetX, realOffsetY);
        }else if (touchOffsetX < 0.0 && touchOffsetY < 0.0){
            realOffsetX = touchOffsetX;
            realOffsetY = touchOffsetY;
            var icLefrPos = locContainer.getLeftBoundary();
            if (icLefrPos + realOffsetX <= this._leftBoundary) {
                realOffsetX = this._leftBoundary - icLefrPos;
                this._bounceLeftEvent();
                scrollEnabled = false;
            }
            icBottomPos = locContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY <= this._bottomBoundary) {
                realOffsetY = this._bottomBoundary - icBottomPos;
                this._bounceBottomEvent();
                scrollEnabled = false;
            }
            this._moveChildren(realOffsetX, realOffsetY);
        } else if (touchOffsetX > 0.0 && touchOffsetY < 0.0){
            realOffsetX = touchOffsetX;
            realOffsetY = touchOffsetY;
            icRightPos = locContainer.getRightBoundary();
            if (icRightPos + realOffsetX >= this._rightBoundary) {
                realOffsetX = this._rightBoundary - icRightPos;
                this._bounceRightEvent();
                scrollEnabled = false;
            }
            icBottomPos = locContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY <= this._bottomBoundary) {
                realOffsetY = this._bottomBoundary - icBottomPos;
                this._bounceBottomEvent();
                scrollEnabled = false;
            }
            this._moveChildren(realOffsetX, realOffsetY);
        } else if (touchOffsetX === 0.0 && touchOffsetY > 0.0){
            realOffsetY = touchOffsetY;
            icTopPos = locContainer.getTopBoundary();
            if (icTopPos + touchOffsetY >= this._topBoundary) {
                realOffsetY = this._topBoundary - icTopPos;
                this._bounceTopEvent();
                scrollEnabled = false;
            }
            this._moveChildren(0.0, realOffsetY);
        } else if (touchOffsetX === 0.0 && touchOffsetY < 0.0) {//bounce to bottom
            realOffsetY = touchOffsetY;
            icBottomPos = locContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY <= this._bottomBoundary) {
                realOffsetY = this._bottomBoundary - icBottomPos;
                this._bounceBottomEvent();
                scrollEnabled = false;
            }
            this._moveChildren(0.0, realOffsetY);
        } else if (touchOffsetX > 0.0 && touchOffsetY === 0.0){
            realOffsetX = touchOffsetX;
            icRightPos = locContainer.getRightBoundary();
            if (icRightPos + realOffsetX >= this._rightBoundary) {
                realOffsetX = this._rightBoundary - icRightPos;
                this._bounceRightEvent();
                scrollEnabled = false;
            }
            this._moveChildren(realOffsetX, 0.0);
        }else if (touchOffsetX < 0.0 && touchOffsetY === 0.0){
            realOffsetX = touchOffsetX;
            var icLeftPos = locContainer.getLeftBoundary();
            if (icLeftPos + realOffsetX <= this._leftBoundary) {
                realOffsetX = this._leftBoundary - icLeftPos;
                this._bounceLeftEvent();
                scrollEnabled = false;
            }
            this._moveChildren(realOffsetX, 0.0);
        }
        return scrollEnabled;
    },
    _checkCustomScrollDestination: function (touchOffsetX, touchOffsetY) {
        var scrollEnabled = true;
        var icBottomPos, icLeftPos, icRightPos, icTopPos;
        var locContainer = this._innerContainer, locDestination = this._autoScrollDestination;
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                if (this._autoScrollDir.y > 0) {
                    icBottomPos = locContainer.getBottomBoundary();
                    if (icBottomPos + touchOffsetY >= locDestination.y) {
                        touchOffsetY = locDestination.y - icBottomPos;
                        scrollEnabled = false;
                    }
                } else {
                    icBottomPos = locContainer.getBottomBoundary();
                    if (icBottomPos + touchOffsetY <= locDestination.y) {
                        touchOffsetY = locDestination.y - icBottomPos;
                        scrollEnabled = false;
                    }
                }
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                if (this._autoScrollDir.x > 0) {
                    icLeftPos = locContainer.getLeftBoundary();
                    if (icLeftPos + touchOffsetX >= locDestination.x) {
                        touchOffsetX = locDestination.x - icLeftPos;
                        scrollEnabled = false;
                    }
                } else {
                    icLeftPos = locContainer.getLeftBoundary();
                    if (icLeftPos + touchOffsetX <= locDestination.x) {
                        touchOffsetX = locDestination.x - icLeftPos;
                        scrollEnabled = false;
                    }
                }
                break;
            case ccui.ScrollView.DIR_BOTH:
                if (touchOffsetX > 0.0 && touchOffsetY > 0.0){
                    icLeftPos = locContainer.getLeftBoundary();
                    if (icLeftPos + touchOffsetX >= locDestination.x) {
                        touchOffsetX = locDestination.x - icLeftPos;
                        scrollEnabled = false;
                    }
                    icBottomPos = locContainer.getBottomBoundary();
                    if (icBottomPos + touchOffsetY >= locDestination.y) {
                        touchOffsetY = locDestination.y - icBottomPos;
                        scrollEnabled = false;
                    }
                } else if (touchOffsetX < 0.0 && touchOffsetY > 0.0){
                    icRightPos = locContainer.getRightBoundary();
                    if (icRightPos + touchOffsetX <= locDestination.x) {
                        touchOffsetX = locDestination.x - icRightPos;
                        scrollEnabled = false;
                    }
                    icBottomPos = locContainer.getBottomBoundary();
                    if (icBottomPos + touchOffsetY >= locDestination.y) {
                        touchOffsetY = locDestination.y - icBottomPos;
                        scrollEnabled = false;
                    }
                } else if (touchOffsetX < 0.0 && touchOffsetY < 0.0){
                    icRightPos = locContainer.getRightBoundary();
                    if (icRightPos + touchOffsetX <= locDestination.x) {
                        touchOffsetX = locDestination.x - icRightPos;
                        scrollEnabled = false;
                    }
                    icTopPos = locContainer.getTopBoundary();
                    if (icTopPos + touchOffsetY <= locDestination.y) {
                        touchOffsetY = locDestination.y - icTopPos;
                        scrollEnabled = false;
                    }
                } else if (touchOffsetX > 0.0 && touchOffsetY < 0.0){
                    icLeftPos = locContainer.getLeftBoundary();
                    if (icLeftPos + touchOffsetX >= locDestination.x) {
                        touchOffsetX = locDestination.x - icLeftPos;
                        scrollEnabled = false;
                    }
                    icTopPos = locContainer.getTopBoundary();
                    if (icTopPos + touchOffsetY <= locDestination.y) {
                        touchOffsetY = locDestination.y - icTopPos;
                        scrollEnabled = false;
                    }
                } else if (touchOffsetX === 0.0 && touchOffsetY > 0.0){
                    icBottomPos = locContainer.getBottomBoundary();
                    if (icBottomPos + touchOffsetY >= locDestination.y) {
                        touchOffsetY = locDestination.y - icBottomPos;
                        scrollEnabled = false;
                    }
                } else if (touchOffsetX < 0.0 && touchOffsetY === 0.0){
                    icRightPos = locContainer.getRightBoundary();
                    if (icRightPos + touchOffsetX <= locDestination.x) {
                        touchOffsetX = locDestination.x - icRightPos;
                        scrollEnabled = false;
                    }
                } else if (touchOffsetX === 0.0 && touchOffsetY < 0.0){
                    icTopPos = locContainer.getTopBoundary();
                    if (icTopPos + touchOffsetY <= locDestination.y) {
                        touchOffsetY = locDestination.y - icTopPos;
                        scrollEnabled = false;
                    }
                } else if (touchOffsetX > 0.0 && touchOffsetY === 0.0){
                    icLeftPos = locContainer.getLeftBoundary();
                    if (icLeftPos + touchOffsetX >= locDestination.x) {
                        touchOffsetX = locDestination.x - icLeftPos;
                        scrollEnabled = false;
                    }
                }
                break;
            default:
                break;
        }
        return scrollEnabled;
    },
    _scrollChildren: function (touchOffsetX, touchOffsetY) {
        var scrollEnabled = true;
        this._scrollingEvent();
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                scrollEnabled = this._scrollChildrenVertical(touchOffsetX, touchOffsetY);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                scrollEnabled = this._scrollChildrenHorizontal(touchOffsetX, touchOffsetY);
                break;
            case ccui.ScrollView.DIR_BOTH:
                scrollEnabled = this._scrollChildrenBoth(touchOffsetX, touchOffsetY);
                break;
            default:
                break;
        }
        return scrollEnabled;
    },
    _scrollChildrenVertical: function(touchOffsetX, touchOffsetY){
        var realOffset = touchOffsetY;
        var scrollEnabled = true;
        var icBottomPos, icTopPos, locContainer = this._innerContainer;
        if (this.bounceEnabled) {
            icBottomPos = locContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY >= this._bounceBottomBoundary) {
                realOffset = this._bounceBottomBoundary - icBottomPos;
                this._scrollToBottomEvent();
                scrollEnabled = false;
            }
            icTopPos = locContainer.getTopBoundary();
            if (icTopPos + touchOffsetY <= this._bounceTopBoundary) {
                realOffset = this._bounceTopBoundary - icTopPos;
                this._scrollToTopEvent();
                scrollEnabled = false;
            }
        } else {
            icBottomPos = locContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY >= this._bottomBoundary){
                realOffset = this._bottomBoundary - icBottomPos;
                this._scrollToBottomEvent();
                scrollEnabled = false;
            }
            icTopPos = locContainer.getTopBoundary();
            if (icTopPos + touchOffsetY <= this._topBoundary) {
                realOffset = this._topBoundary - icTopPos;
                this._scrollToTopEvent();
                scrollEnabled = false;
            }
        }
        this._moveChildren(0.0, realOffset);
        return scrollEnabled;
    },
    _scrollChildrenHorizontal: function(touchOffsetX, touchOffestY){
        var scrollEnabled = true;
        var realOffset = touchOffsetX;
        var icRightPos, icLeftPos, locContainer = this._innerContainer;
        if (this.bounceEnabled){
            icRightPos = locContainer.getRightBoundary();
            if (icRightPos + touchOffsetX <= this._bounceRightBoundary) {
                realOffset = this._bounceRightBoundary - icRightPos;
                this._scrollToRightEvent();
                scrollEnabled = false;
            }
            icLeftPos = locContainer.getLeftBoundary();
            if (icLeftPos + touchOffsetX >= this._bounceLeftBoundary) {
                realOffset = this._bounceLeftBoundary - icLeftPos;
                this._scrollToLeftEvent();
                scrollEnabled = false;
            }
        } else {
            icRightPos = locContainer.getRightBoundary();
            if (icRightPos + touchOffsetX <= this._rightBoundary) {
                realOffset = this._rightBoundary - icRightPos;
                this._scrollToRightEvent();
                scrollEnabled = false;
            }
            icLeftPos = locContainer.getLeftBoundary();
            if (icLeftPos + touchOffsetX >= this._leftBoundary) {
                realOffset = this._leftBoundary - icLeftPos;
                this._scrollToLeftEvent();
                scrollEnabled = false;
            }
        }
        this._moveChildren(realOffset, 0.0);
        return scrollEnabled;
    },
    _scrollChildrenBoth: function (touchOffsetX, touchOffsetY) {
        var scrollEnabled = true;
        var realOffsetX = touchOffsetX;
        var realOffsetY = touchOffsetY;
        var icLeftPos, icBottomPos, icRightPos, icTopPos;
        var locContainer = this._innerContainer;
        if (this.bounceEnabled) {
            if (touchOffsetX > 0.0 && touchOffsetY > 0.0) {
                icLeftPos = locContainer.getLeftBoundary();
                if (icLeftPos + touchOffsetX >= this._bounceLeftBoundary) {
                    realOffsetX = this._bounceLeftBoundary - icLeftPos;
                    this._scrollToLeftEvent();
                    scrollEnabled = false;
                }
                icBottomPos = locContainer.getBottomBoundary();
                if (icBottomPos + touchOffsetY >= this._bounceBottomBoundary) {
                    realOffsetY = this._bounceBottomBoundary - icBottomPos;
                    this._scrollToBottomEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX < 0.0 && touchOffsetY > 0.0) {
                icRightPos = locContainer.getRightBoundary();
                if (icRightPos + touchOffsetX <= this._bounceRightBoundary) {
                    realOffsetX = this._bounceRightBoundary - icRightPos;
                    this._scrollToRightEvent();
                    scrollEnabled = false;
                }
                icBottomPos = locContainer.getBottomBoundary();
                if (icBottomPos + touchOffsetY >= this._bounceBottomBoundary) {
                    realOffsetY = this._bounceBottomBoundary - icBottomPos;
                    this._scrollToBottomEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX < 0.0 && touchOffsetY < 0.0) {
                icRightPos = locContainer.getRightBoundary();
                if (icRightPos + touchOffsetX <= this._bounceRightBoundary) {
                    realOffsetX = this._bounceRightBoundary - icRightPos;
                    this._scrollToRightEvent();
                    scrollEnabled = false;
                }
                icTopPos = locContainer.getTopBoundary();
                if (icTopPos + touchOffsetY <= this._bounceTopBoundary) {
                    realOffsetY = this._bounceTopBoundary - icTopPos;
                    this._scrollToTopEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX > 0.0 && touchOffsetY < 0.0){
                icLeftPos = locContainer.getLeftBoundary();
                if (icLeftPos + touchOffsetX >= this._bounceLeftBoundary) {
                    realOffsetX = this._bounceLeftBoundary - icLeftPos;
                    this._scrollToLeftEvent();
                    scrollEnabled = false;
                }
                icTopPos = locContainer.getTopBoundary();
                if (icTopPos + touchOffsetY <= this._bounceTopBoundary) {
                    realOffsetY = this._bounceTopBoundary - icTopPos;
                    this._scrollToTopEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX === 0.0 && touchOffsetY > 0.0){
                icBottomPos = locContainer.getBottomBoundary();
                if (icBottomPos + touchOffsetY >= this._bounceBottomBoundary) {
                    realOffsetY = this._bounceBottomBoundary - icBottomPos;
                    this._scrollToBottomEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX < 0.0 && touchOffsetY === 0.0){
                icRightPos = locContainer.getRightBoundary();
                if (icRightPos + touchOffsetX <= this._bounceRightBoundary) {
                    realOffsetX = this._bounceRightBoundary - icRightPos;
                    this._scrollToRightEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX === 0.0 && touchOffsetY < 0.0){
                icTopPos = locContainer.getTopBoundary();
                if (icTopPos + touchOffsetY <= this._bounceTopBoundary) {
                    realOffsetY = this._bounceTopBoundary - icTopPos;
                    this._scrollToTopEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX > 0.0 && touchOffsetY === 0.0){
                icLeftPos = locContainer.getLeftBoundary();
                if (icLeftPos + touchOffsetX >= this._bounceLeftBoundary) {
                    realOffsetX = this._bounceLeftBoundary - icLeftPos;
                    this._scrollToLeftEvent();
                    scrollEnabled = false;
                }
            }
        } else {
            if (touchOffsetX > 0.0 && touchOffsetY > 0.0){
                icLeftPos = locContainer.getLeftBoundary();
                if (icLeftPos + touchOffsetX >= this._leftBoundary) {
                    realOffsetX = this._leftBoundary - icLeftPos;
                    this._scrollToLeftEvent();
                    scrollEnabled = false;
                }
                icBottomPos = locContainer.getBottomBoundary();
                if (icBottomPos + touchOffsetY >= this._bottomBoundary) {
                    realOffsetY = this._bottomBoundary - icBottomPos;
                    this._scrollToBottomEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX < 0.0 && touchOffsetY > 0.0){
                icRightPos = locContainer.getRightBoundary();
                if (icRightPos + touchOffsetX <= this._rightBoundary) {
                    realOffsetX = this._rightBoundary - icRightPos;
                    this._scrollToRightEvent();
                    scrollEnabled = false;
                }
                icBottomPos = locContainer.getBottomBoundary();
                if (icBottomPos + touchOffsetY >= this._bottomBoundary) {
                    realOffsetY = this._bottomBoundary - icBottomPos;
                    this._scrollToBottomEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX < 0.0 && touchOffsetY < 0.0){
                icRightPos = locContainer.getRightBoundary();
                if (icRightPos + touchOffsetX <= this._rightBoundary) {
                    realOffsetX = this._rightBoundary - icRightPos;
                    this._scrollToRightEvent();
                    scrollEnabled = false;
                }
                icTopPos = locContainer.getTopBoundary();
                if (icTopPos + touchOffsetY <= this._topBoundary) {
                    realOffsetY = this._topBoundary - icTopPos;
                    this._scrollToTopEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX > 0.0 && touchOffsetY < 0.0){
                icLeftPos = locContainer.getLeftBoundary();
                if (icLeftPos + touchOffsetX >= this._leftBoundary) {
                    realOffsetX = this._leftBoundary - icLeftPos;
                    this._scrollToLeftEvent();
                    scrollEnabled = false;
                }
                icTopPos = this._innerContainer.getTopBoundary();
                if (icTopPos + touchOffsetY <= this._topBoundary) {
                    realOffsetY = this._topBoundary - icTopPos;
                    this._scrollToTopEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX === 0.0 && touchOffsetY > 0.0) {
                icBottomPos = this._innerContainer.getBottomBoundary();
                if (icBottomPos + touchOffsetY >= this._bottomBoundary) {
                    realOffsetY = this._bottomBoundary - icBottomPos;
                    this._scrollToBottomEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX < 0.0 && touchOffsetY === 0.0){
                icRightPos = this._innerContainer.getRightBoundary();
                if (icRightPos + touchOffsetX <= this._rightBoundary) {
                    realOffsetX = this._rightBoundary - icRightPos;
                    this._scrollToRightEvent();
                    scrollEnabled = false;
                }
            } else if (touchOffsetX === 0.0 && touchOffsetY < 0.0){
                icTopPos = this._innerContainer.getTopBoundary();
                if (icTopPos + touchOffsetY <= this._topBoundary) {
                    realOffsetY = this._topBoundary - icTopPos;
                    this._scrollToTopEvent();
                    scrollEnabled = false;
                }
            }  else if (touchOffsetX > 0.0 && touchOffsetY === 0.0){
                icLeftPos = this._innerContainer.getLeftBoundary();
                if (icLeftPos + touchOffsetX >= this._leftBoundary) {
                    realOffsetX = this._leftBoundary - icLeftPos;
                    this._scrollToLeftEvent();
                    scrollEnabled = false;
                }
            }
        }
        this._moveChildren(realOffsetX, realOffsetY);
        return scrollEnabled;
    },
    scrollToBottom: function (time, attenuated) {
        this._startAutoScrollChildrenWithDestination(cc.p(this._innerContainer.getPositionX(), 0), time, attenuated);
    },
    scrollToTop: function (time, attenuated) {
        this._startAutoScrollChildrenWithDestination(
            cc.p(this._innerContainer.getPositionX(), this._contentSize.height - this._innerContainer.getContentSize().height), time, attenuated);
    },
    scrollToLeft: function (time, attenuated) {
        this._startAutoScrollChildrenWithDestination(cc.p(0, this._innerContainer.getPositionY()), time, attenuated);
    },
    scrollToRight: function (time, attenuated) {
        this._startAutoScrollChildrenWithDestination(
            cc.p(this._contentSize.width - this._innerContainer.getContentSize().width, this._innerContainer.getPositionY()), time, attenuated);
    },
    scrollToTopLeft: function (time, attenuated) {
        if (this.direction !== ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return;
        }
        this._startAutoScrollChildrenWithDestination(cc.p(0, this._contentSize.height - this._innerContainer.getContentSize().height), time, attenuated);
    },
    scrollToTopRight: function (time, attenuated) {
        if (this.direction !== ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return;
        }
        var inSize = this._innerContainer.getContentSize();
        this._startAutoScrollChildrenWithDestination(cc.p(this._contentSize.width - inSize.width,
                this._contentSize.height - inSize.height), time, attenuated);
    },
    scrollToBottomLeft: function (time, attenuated) {
        if (this.direction !== ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return;
        }
        this._startAutoScrollChildrenWithDestination(cc.p(0, 0), time, attenuated);
    },
    scrollToBottomRight: function (time, attenuated) {
        if (this.direction !== ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return;
        }
        this._startAutoScrollChildrenWithDestination(cc.p(this._contentSize.width - this._innerContainer.getContentSize().width, 0), time, attenuated);
    },
    scrollToPercentVertical: function (percent, time, attenuated) {
        var minY = this._contentSize.height - this._innerContainer.getContentSize().height;
        var h = -minY;
        this._startAutoScrollChildrenWithDestination(cc.p(this._innerContainer.getPositionX(), minY + percent * h / 100), time, attenuated);
    },
    scrollToPercentHorizontal: function (percent, time, attenuated) {
        var w = this._innerContainer.getContentSize().width - this._contentSize.width;
        this._startAutoScrollChildrenWithDestination(cc.p(-(percent * w / 100), this._innerContainer.getPositionY()), time, attenuated);
    },
    scrollToPercentBothDirection: function (percent, time, attenuated) {
        if (this.direction !== ccui.ScrollView.DIR_BOTH)
            return;
        var minY = this._contentSize.height - this._innerContainer.getContentSize().height;
        var h = -minY;
        var w = this._innerContainer.getContentSize().width - this._contentSize.width;
        this._startAutoScrollChildrenWithDestination(cc.p(-(percent.x * w / 100), minY + percent.y * h / 100), time, attenuated);
    },
    jumpToBottom: function () {
        this._jumpToDestination(this._innerContainer.getPositionX(), 0);
    },
    jumpToTop: function () {
        this._jumpToDestination(this._innerContainer.getPositionX(), this._contentSize.height - this._innerContainer.getContentSize().height);
    },
    jumpToLeft: function () {
        this._jumpToDestination(0, this._innerContainer.getPositionY());
    },
    jumpToRight: function () {
        this._jumpToDestination(this._contentSize.width - this._innerContainer.getContentSize().width, this._innerContainer.getPositionY());
    },
    jumpToTopLeft: function () {
        if (this.direction !== ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return;
        }
        this._jumpToDestination(0, this._contentSize.height - this._innerContainer.getContentSize().height);
    },
    jumpToTopRight: function () {
        if (this.direction !== ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return;
        }
        var inSize = this._innerContainer.getContentSize();
        this._jumpToDestination(this._contentSize.width - inSize.width, this._contentSize.height - inSize.height);
    },
    jumpToBottomLeft: function () {
        if (this.direction !== ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return;
        }
        this._jumpToDestination(0, 0);
    },
    jumpToBottomRight: function () {
        if (this.direction !== ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return;
        }
        this._jumpToDestination(this._contentSize.width - this._innerContainer.getContentSize().width, 0);
    },
    jumpToPercentVertical: function (percent) {
        var minY = this._contentSize.height - this._innerContainer.getContentSize().height;
        var h = -minY;
        this._jumpToDestination(this._innerContainer.getPositionX(), minY + percent * h / 100);
    },
    jumpToPercentHorizontal: function (percent) {
        var w = this._innerContainer.getContentSize().width - this._contentSize.width;
        this._jumpToDestination(-(percent * w / 100), this._innerContainer.getPositionY());
    },
    jumpToPercentBothDirection: function (percent) {
        if (this.direction !== ccui.ScrollView.DIR_BOTH)
            return;
        var inSize = this._innerContainer.getContentSize();
        var minY = this._contentSize.height - inSize.height;
        var h = -minY;
        var w = inSize.width - this._contentSize.width;
        this._jumpToDestination(-(percent.x * w / 100), minY + percent.y * h / 100);
    },
    _startRecordSlidAction: function () {
        if (this._autoScroll)
            this._stopAutoScrollChildren();
        if (this._bouncing)
            this._stopBounceChildren();
        this._slidTime = 0.0;
    },
    _endRecordSlidAction: function () {
        if (!this._checkNeedBounce() && this.inertiaScrollEnabled) {
            if (this._slidTime <= 0.016)
                return;
            var totalDis = 0, dir;
            var touchEndPositionInNodeSpace = this.convertToNodeSpace(this._touchEndPosition);
            var touchBeganPositionInNodeSpace = this.convertToNodeSpace(this._touchBeganPosition);
            switch (this.direction) {
                case ccui.ScrollView.DIR_VERTICAL :
                    totalDis = touchEndPositionInNodeSpace.y - touchBeganPositionInNodeSpace.y;
                    dir = (totalDis < 0) ? ccui.ScrollView.SCROLLDIR_DOWN : ccui.ScrollView.SCROLLDIR_UP;
                    break;
                case ccui.ScrollView.DIR_HORIZONTAL:
                    totalDis = touchEndPositionInNodeSpace.x - touchBeganPositionInNodeSpace.x;
                    dir = totalDis < 0 ? ccui.ScrollView.SCROLLDIR_LEFT : ccui.ScrollView.SCROLLDIR_RIGHT;
                    break;
                case ccui.ScrollView.DIR_BOTH :
                    var subVector = cc.pSub(touchEndPositionInNodeSpace, touchBeganPositionInNodeSpace);
                    totalDis = cc.pLength(subVector);
                    dir = cc.pNormalize(subVector);
                    break;
                default:
                    dir = cc.p(0,0);
                    break;
            }
            var orSpeed = Math.min(Math.abs(totalDis) / (this._slidTime), ccui.ScrollView.AUTO_SCROLL_MAX_SPEED);
            this._startAutoScrollChildrenWithOriginalSpeed(dir, orSpeed, true, -1000);
            this._slidTime = 0;
        }
    },
    _handlePressLogic: function (touch) {
        this._startRecordSlidAction();
        this._bePressed = true;
    },
    _handleMoveLogic: function (touch) {
        var touchPositionInNodeSpace = this.convertToNodeSpace(touch.getLocation()),
            previousTouchPositionInNodeSpace = this.convertToNodeSpace(touch.getPreviousLocation());
        var delta = cc.pSub(touchPositionInNodeSpace, previousTouchPositionInNodeSpace);
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                this._scrollChildren(0.0, delta.y);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                this._scrollChildren(delta.x, 0);
                break;
            case ccui.ScrollView.DIR_BOTH:
                this._scrollChildren(delta.x, delta.y);
                break;
            default:
                break;
        }
    },
    _handleReleaseLogic: function (touch) {
        this._endRecordSlidAction();
        this._bePressed = false;
    },
    onTouchBegan: function (touch, event) {
        var pass = ccui.Layout.prototype.onTouchBegan.call(this, touch, event);
        if(!this._isInterceptTouch){
            if (this._hit)
                this._handlePressLogic(touch);
        }
        return pass;
    },
    onTouchMoved: function (touch, event) {
        ccui.Layout.prototype.onTouchMoved.call(this, touch, event);
        if(!this._isInterceptTouch)
            this._handleMoveLogic(touch);
    },
    onTouchEnded: function (touch, event) {
        ccui.Layout.prototype.onTouchEnded.call(this, touch, event);
        if(!this._isInterceptTouch)
            this._handleReleaseLogic(touch);
        this._isInterceptTouch = false;
    },
    onTouchCancelled: function (touch, event) {
        ccui.Layout.prototype.onTouchCancelled.call(this, touch, event);
        if (!this._isInterceptTouch)
            this.handleReleaseLogic(touch);
        this._isInterceptTouch = false;
    },
    update: function (dt) {
        if (this._autoScroll)
            this._autoScrollChildren(dt);
        if (this._bouncing)
            this._bounceChildren(dt);
        this._recordSlidTime(dt);
    },
    _recordSlidTime: function (dt) {
        if (this._bePressed)
            this._slidTime += dt;
    },
    interceptTouchEvent: function (event, sender, touch) {
        var touchPoint = touch.getLocation();
        switch (event) {
            case ccui.Widget.TOUCH_BEGAN:
                this._isInterceptTouch = true;
                this._touchBeganPosition.x = touchPoint.x;
                this._touchBeganPosition.y = touchPoint.y;
                this._handlePressLogic(touch);
                break;
            case ccui.Widget.TOUCH_MOVED:
                var offset = cc.pLength(cc.pSub(sender.getTouchBeganPosition(), touchPoint));
                this._touchMovePosition.x = touchPoint.x;
                this._touchMovePosition.y = touchPoint.y;
                if (offset > this._childFocusCancelOffset) {
                    sender.setHighlighted(false);
                    this._handleMoveLogic(touch);
                }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            case ccui.Widget.TOUCH_ENDED:
                this._touchEndPosition.x = touchPoint.x;
                this._touchEndPosition.y = touchPoint.y;
                this._handleReleaseLogic(touch);
                if (sender.isSwallowTouches())
                    this._isInterceptTouch = false;
                break;
        }
    },
    _scrollToTopEvent: function () {
        if(this._scrollViewEventSelector){
            if (this._scrollViewEventListener)
                this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_SCROLL_TO_TOP);
            else
                this._scrollViewEventSelector(this, ccui.ScrollView.EVENT_SCROLL_TO_TOP);
        }
        if(this._ccEventCallback)
            this._ccEventCallback(this, ccui.ScrollView.EVENT_SCROLL_TO_TOP);
    },
    _scrollToBottomEvent: function () {
        if(this._scrollViewEventSelector){
            if (this._scrollViewEventListener)
                this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM);
            else
                this._scrollViewEventSelector(this, ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM);
        }
        if(this._ccEventCallback)
            this._ccEventCallback(this, ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM);
    },
    _scrollToLeftEvent: function () {
        if(this._scrollViewEventSelector){
            if (this._scrollViewEventListener)
                this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_SCROLL_TO_LEFT);
            else
                this._scrollViewEventSelector(this, ccui.ScrollView.EVENT_SCROLL_TO_LEFT);
        }
        if(this._ccEventCallback)
            this._ccEventCallback(this, ccui.ScrollView.EVENT_SCROLL_TO_LEFT);
    },
    _scrollToRightEvent: function () {
        if(this._scrollViewEventSelector){
            if (this._scrollViewEventListener)
                this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_SCROLL_TO_RIGHT);
            else
                this._scrollViewEventSelector(this, ccui.ScrollView.EVENT_SCROLL_TO_RIGHT);
        }
        if(this._ccEventCallback)
            this._ccEventCallback(this, ccui.ScrollView.EVENT_SCROLL_TO_RIGHT);
    },
    _scrollingEvent: function () {
        if(this._scrollViewEventSelector){
            if (this._scrollViewEventListener)
                this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_SCROLLING);
            else
                this._scrollViewEventSelector(this, ccui.ScrollView.EVENT_SCROLLING);
        }
        if(this._ccEventCallback)
            this._ccEventCallback(this, ccui.ScrollView.EVENT_SCROLLING);
    },
    _bounceTopEvent: function () {
        if(this._scrollViewEventSelector){
            if (this._scrollViewEventListener)
                this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_BOUNCE_TOP);
            else
                this._scrollViewEventSelector(this, ccui.ScrollView.EVENT_BOUNCE_TOP);
        }
        if(this._ccEventCallback)
            this._ccEventCallback(this, ccui.ScrollView.EVENT_BOUNCE_TOP);
    },
    _bounceBottomEvent: function () {
        if(this._scrollViewEventSelector){
            if (this._scrollViewEventListener)
                this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_BOUNCE_BOTTOM);
            else
                this._scrollViewEventSelector(this, ccui.ScrollView.EVENT_BOUNCE_BOTTOM);
        }
        if(this._ccEventCallback)
            this._ccEventCallback(this, ccui.ScrollView.EVENT_BOUNCE_BOTTOM);
    },
    _bounceLeftEvent: function () {
        if(this._scrollViewEventSelector){
            if (this._scrollViewEventListener)
                this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_BOUNCE_LEFT);
            else
                this._scrollViewEventSelector(this, ccui.ScrollView.EVENT_BOUNCE_LEFT);
        }
        if(this._ccEventCallback)
            this._ccEventCallback(this, ccui.ScrollView.EVENT_BOUNCE_LEFT);
    },
    _bounceRightEvent: function () {
        if(this._scrollViewEventSelector){
            if (this._scrollViewEventListener)
                this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_BOUNCE_RIGHT);
            else
                this._scrollViewEventSelector(this, ccui.ScrollView.EVENT_BOUNCE_RIGHT);
        }
        if(this._ccEventCallback)
            this._ccEventCallback(this, ccui.ScrollView.EVENT_BOUNCE_RIGHT);
    },
    addEventListenerScrollView: function (selector, target) {
        this.addEventListener(selector, target);
    },
    addEventListener: function(selector, target){
        this._scrollViewEventSelector = selector;
        this._scrollViewEventListener = target;
    },
    setDirection: function (dir) {
        this.direction = dir;
    },
    getDirection: function () {
        return this.direction;
    },
    setBounceEnabled: function (enabled) {
        this.bounceEnabled = enabled;
    },
    isBounceEnabled: function () {
        return this.bounceEnabled;
    },
    setInertiaScrollEnabled: function (enabled) {
        this.inertiaScrollEnabled = enabled;
    },
    isInertiaScrollEnabled: function () {
        return this.inertiaScrollEnabled;
    },
    getInnerContainer: function () {
        return this._innerContainer;
    },
    setLayoutType: function (type) {
        this._innerContainer.setLayoutType(type);
    },
    getLayoutType: function () {
        return this._innerContainer.getLayoutType();
    },
    _doLayout: function () {
        if (!this._doLayoutDirty)
            return;
        this._doLayoutDirty = false;
    },
    getDescription: function () {
        return "ScrollView";
    },
    _createCloneInstance: function(){
        return new ccui.ScrollView();
    },
    _copyClonedWidgetChildren: function (model) {
        ccui.Layout.prototype._copyClonedWidgetChildren.call(this, model);
    },
    _copySpecialProperties: function (scrollView) {
        if(scrollView instanceof ccui.ScrollView) {
            ccui.Layout.prototype._copySpecialProperties.call(this, scrollView);
            this.setInnerContainerSize(scrollView.getInnerContainerSize());
            this.setDirection(scrollView.direction);
            this.setBounceEnabled(scrollView.bounceEnabled);
            this.setInertiaScrollEnabled(scrollView.inertiaScrollEnabled);
            this._scrollViewEventListener = scrollView._scrollViewEventListener;
            this._scrollViewEventSelector = scrollView._scrollViewEventSelector;
            this._ccEventCallback = scrollView._ccEventCallback;
        }
    },
    getNodeByTag: function (tag) {
        return this._innerContainer.getNodeByTag(tag);
    },
    getNodes: function () {
        return this._innerContainer.getNodes();
    },
    removeNode: function (node) {
        this._innerContainer.removeNode(node);
    },
    removeNodeByTag: function (tag) {
        this._innerContainer.removeNodeByTag(tag);
    },
    removeAllNodes: function () {
        this._innerContainer.removeAllNodes();
    },
    addNode: function (node, zOrder, tag) {
        this._innerContainer.addNode(node, zOrder, tag);
    }
});
var _p = ccui.ScrollView.prototype;
_p.innerWidth;
cc.defineGetterSetter(_p, "innerWidth", _p._getInnerWidth, _p._setInnerWidth);
_p.innerHeight;
cc.defineGetterSetter(_p, "innerHeight", _p._getInnerHeight, _p._setInnerHeight);
_p = null;
ccui.ScrollView.create = function () {
    return new ccui.ScrollView();
};
ccui.ScrollView.DIR_NONE = 0;
ccui.ScrollView.DIR_VERTICAL = 1;
ccui.ScrollView.DIR_HORIZONTAL = 2;
ccui.ScrollView.DIR_BOTH = 3;
ccui.ScrollView.EVENT_SCROLL_TO_TOP = 0;
ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM = 1;
ccui.ScrollView.EVENT_SCROLL_TO_LEFT = 2;
ccui.ScrollView.EVENT_SCROLL_TO_RIGHT = 3;
ccui.ScrollView.EVENT_SCROLLING = 4;
ccui.ScrollView.EVENT_BOUNCE_TOP = 5;
ccui.ScrollView.EVENT_BOUNCE_BOTTOM = 6;
ccui.ScrollView.EVENT_BOUNCE_LEFT = 7;
ccui.ScrollView.EVENT_BOUNCE_RIGHT = 8;
ccui.ScrollView.AUTO_SCROLL_MAX_SPEED = 1000;
ccui.ScrollView.SCROLLDIR_UP = cc.p(0, 1);
ccui.ScrollView.SCROLLDIR_DOWN = cc.p(0, -1);
ccui.ScrollView.SCROLLDIR_LEFT = cc.p(-1, 0);
ccui.ScrollView.SCROLLDIR_RIGHT = cc.p(1, 0);
ccui.ListView = ccui.ScrollView.extend({
    _model: null,
    _items: null,
    _gravity: null,
    _itemsMargin: 0,
    _curSelectedIndex: 0,
    _refreshViewDirty: true,
    _listViewEventListener: null,
    _listViewEventSelector: null,
    ctor: function () {
        ccui.ScrollView.prototype.ctor.call(this);
        this._items = [];
        this._gravity = ccui.ListView.GRAVITY_CENTER_VERTICAL;
        this.setTouchEnabled(true);
        this.init();
    },
    init: function () {
        if (ccui.ScrollView.prototype.init.call(this)) {
            this.setLayoutType(ccui.Layout.LINEAR_VERTICAL);
            return true;
        }
        return false;
    },
    setItemModel: function (model) {
        if (!model){
            cc.log("Can't set a null to item model!");
            return;
        }
        this._model = model;
    },
    _updateInnerContainerSize: function () {
        var locItems = this._items, length, i;
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                length = locItems.length;
                var totalHeight = (length - 1) * this._itemsMargin;
                for (i = 0; i < length; i++) {
                    totalHeight += locItems[i].getContentSize().height;
                }
                this.setInnerContainerSize(cc.size(this._contentSize.width, totalHeight));
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                length = locItems.length;
                var totalWidth = (length - 1) * this._itemsMargin;
                for (i = 0; i < length; i++) {
                    totalWidth += locItems[i].getContentSize().width;
                }
                this.setInnerContainerSize(cc.size(totalWidth, this._contentSize.height));
                break;
            default:
                break;
        }
    },
    _remedyLayoutParameter: function (item) {
        cc.assert(null != item, "ListView Item can't be nil!");
        var linearLayoutParameter = item.getLayoutParameter();
        var isLayoutParameterExists = true;
        if (!linearLayoutParameter) {
            linearLayoutParameter = new ccui.LinearLayoutParameter();
            isLayoutParameterExists = false;
        }
        var itemIndex = this.getIndex(item);
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                this._remedyVerticalLayoutParameter(linearLayoutParameter, itemIndex);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                this._remedyHorizontalLayoutParameter(linearLayoutParameter, itemIndex);
                break;
            default:
                break;
        }
        if (!isLayoutParameterExists)
            item.setLayoutParameter(linearLayoutParameter);
    },
    _remedyVerticalLayoutParameter: function (layoutParameter, itemIndex) {
        cc.assert(null != layoutParameter, "Layout parameter can't be nil!");
        switch (this._gravity) {
            case ccui.ListView.GRAVITY_LEFT:
                layoutParameter.setGravity(ccui.LinearLayoutParameter.LEFT);
                break;
            case ccui.ListView.GRAVITY_RIGHT:
                layoutParameter.setGravity(ccui.LinearLayoutParameter.RIGHT);
                break;
            case ccui.ListView.GRAVITY_CENTER_HORIZONTAL:
                layoutParameter.setGravity(ccui.LinearLayoutParameter.CENTER_HORIZONTAL);
                break;
            default:
                break;
        }
        if (0 === itemIndex)
            layoutParameter.setMargin(ccui.MarginZero());
        else
            layoutParameter.setMargin(new ccui.Margin(0.0, this._itemsMargin, 0.0, 0.0));
    },
    _remedyHorizontalLayoutParameter: function (layoutParameter, itemIndex) {
        cc.assert(null != layoutParameter, "Layout parameter can't be nil!");
        switch (this._gravity) {
            case ccui.ListView.GRAVITY_TOP:
                layoutParameter.setGravity(ccui.LinearLayoutParameter.TOP);
                break;
            case ccui.ListView.GRAVITY_BOTTOM:
                layoutParameter.setGravity(ccui.LinearLayoutParameter.BOTTOM);
                break;
            case ccui.ListView.GRAVITY_CENTER_VERTICAL:
                layoutParameter.setGravity(ccui.LinearLayoutParameter.CENTER_VERTICAL);
                break;
            default:
                break;
        }
        if (0 === itemIndex)
            layoutParameter.setMargin(ccui.MarginZero());
        else
            layoutParameter.setMargin(new ccui.Margin(this._itemsMargin, 0.0, 0.0, 0.0));
    },
    pushBackDefaultItem: function () {
        if (this._model == null)
            return;
        var newItem = this._model.clone();
        this._remedyLayoutParameter(newItem);
        this.addChild(newItem);
        this._refreshViewDirty = true;
    },
    insertDefaultItem: function (index) {
        if (this._model == null)
            return;
        var newItem = this._model.clone();
        this._items.splice(index, 0, newItem);
        ccui.ScrollView.prototype.addChild.call(this, newItem);
        this._remedyLayoutParameter(newItem);
        this._refreshViewDirty = true;
    },
    pushBackCustomItem: function (item) {
        this._remedyLayoutParameter(item);
        this.addChild(item);
        this._refreshViewDirty = true;
    },
    addChild: function (widget, zOrder, tag) {
        if (widget) {
            zOrder = zOrder || widget.getLocalZOrder();
            tag = tag || widget.getName();
            ccui.ScrollView.prototype.addChild.call(this, widget, zOrder, tag);
            if(widget instanceof ccui.Widget)
                this._items.push(widget);
        }
    },
    removeChild: function(widget, cleanup){
        if (widget) {
            var index = this._items.indexOf(widget);
            if(index > -1)
                this._items.splice(index, 1);
            ccui.ScrollView.prototype.removeChild.call(this, widget, cleanup);
        }
    },
    removeAllChildren: function(){
        this.removeAllChildrenWithCleanup(true);
    },
    removeAllChildrenWithCleanup: function(cleanup){
        ccui.ScrollView.prototype.removeAllChildrenWithCleanup.call(this, cleanup);
        this._items = [];
    },
    insertCustomItem: function (item, index) {
        this._items.splice(index, 0, item);
        ccui.ScrollView.prototype.addChild.call(this, item);
        this._remedyLayoutParameter(item);
        this._refreshViewDirty = true;
    },
    removeItem: function (index) {
        var item = this.getItem(index);
        if (item == null)
            return;
        this.removeChild(item, true);
        this._refreshViewDirty = true;
    },
    removeLastItem: function () {
        this.removeItem(this._items.length - 1);
    },
    removeAllItems: function(){
        this.removeAllChildren();
    },
    getItem: function (index) {
        if (index < 0 || index >= this._items.length)
            return null;
        return this._items[index];
    },
    getItems: function () {
        return this._items;
    },
    getIndex: function (item) {
        if(item == null)
            return -1;
        return this._items.indexOf(item);
    },
    setGravity: function (gravity) {
        if (this._gravity === gravity)
            return;
        this._gravity = gravity;
        this._refreshViewDirty = true;
    },
    setItemsMargin: function (margin) {
        if (this._itemsMargin === margin)
            return;
        this._itemsMargin = margin;
        this._refreshViewDirty = true;
    },
    getItemsMargin:function(){
        return this._itemsMargin;
    },
    setDirection: function (dir) {
        switch (dir) {
            case ccui.ScrollView.DIR_VERTICAL:
                this.setLayoutType(ccui.Layout.LINEAR_VERTICAL);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                this.setLayoutType(ccui.Layout.LINEAR_HORIZONTAL);
                break;
            case ccui.ScrollView.DIR_BOTH:
                return;
            default:
                return;
                break;
        }
        ccui.ScrollView.prototype.setDirection.call(this, dir);
    },
    requestRefreshView: function () {
        this._refreshViewDirty = true;
    },
    refreshView: function () {
        var locItems = this._items;
        for (var i = 0; i < locItems.length; i++) {
            var item = locItems[i];
            item.setLocalZOrder(i);
            this._remedyLayoutParameter(item);
        }
        this._updateInnerContainerSize();
    },
    doLayout: function(){
        this._doLayout();
    },
    _doLayout: function(){
        ccui.Layout.prototype._doLayout.call(this);
        if (this._refreshViewDirty) {
            this.refreshView();
            this._refreshViewDirty = false;
        }
    },
    addEventListenerListView: function (selector, target) {
        this.addEventListener(selector, target);
    },
    addEventListener: function(selector, target){
        this._listViewEventListener = target;
        this._listViewEventSelector = selector;
    },
    _selectedItemEvent: function (event) {
        var eventEnum = (event === ccui.Widget.TOUCH_BEGAN) ? ccui.ListView.ON_SELECTED_ITEM_START : ccui.ListView.ON_SELECTED_ITEM_END;
        if(this._listViewEventSelector){
            if (this._listViewEventListener)
                this._listViewEventSelector.call(this._listViewEventListener, this, eventEnum);
            else
                this._listViewEventSelector(this, eventEnum);
        }
        if(this._ccEventCallback)
            this._ccEventCallback(this, eventEnum);
    },
    interceptTouchEvent: function (eventType, sender, touch) {
        ccui.ScrollView.prototype.interceptTouchEvent.call(this, eventType, sender, touch);
        if (eventType !== ccui.Widget.TOUCH_MOVED) {
            var parent = sender;
            while (parent) {
                if (parent && parent.getParent() === this._innerContainer) {
                    this._curSelectedIndex = this.getIndex(parent);
                    break;
                }
                parent = parent.getParent();
            }
            if (sender.isHighlighted())
                this._selectedItemEvent(eventType);
        }
    },
    getCurSelectedIndex: function () {
        return this._curSelectedIndex;
    },
    _onSizeChanged: function () {
        ccui.ScrollView.prototype._onSizeChanged.call(this);
        this._refreshViewDirty = true;
    },
    getDescription: function () {
        return "ListView";
    },
    _createCloneInstance: function () {
        return new ccui.ListView();
    },
    _copyClonedWidgetChildren: function (model) {
        var arrayItems = model.getItems();
        for (var i = 0; i < arrayItems.length; i++) {
            var item = arrayItems[i];
            this.pushBackCustomItem(item.clone());
        }
    },
    _copySpecialProperties: function (listView) {
        if(listView instanceof ccui.ListView){
            ccui.ScrollView.prototype._copySpecialProperties.call(this, listView);
            this.setItemModel(listView._model);
            this.setItemsMargin(listView._itemsMargin);
            this.setGravity(listView._gravity);
            this._listViewEventListener = listView._listViewEventListener;
            this._listViewEventSelector = listView._listViewEventSelector;
        }
    },
    forceDoLayout: function(){
        if (this._refreshViewDirty) {
            this.refreshView();
            this._refreshViewDirty = false;
        }
        this._innerContainer.forceDoLayout();
    }
});
ccui.ListView.create = function () {
    return new ccui.ListView();
};
ccui.ListView.EVENT_SELECTED_ITEM = 0;
ccui.ListView.ON_SELECTED_ITEM_START = 0;
ccui.ListView.ON_SELECTED_ITEM_END = 1;
ccui.ListView.GRAVITY_LEFT = 0;
ccui.ListView.GRAVITY_RIGHT = 1;
ccui.ListView.GRAVITY_CENTER_HORIZONTAL = 2;
ccui.ListView.GRAVITY_TOP = 3;
ccui.ListView.GRAVITY_BOTTOM = 4;
ccui.ListView.GRAVITY_CENTER_VERTICAL = 5;
ccui.PageView = ccui.Layout.extend({
    _curPageIdx: 0,
    _pages: null,
    _touchMoveDirection: null,
    _touchStartLocation: 0,
    _touchMoveStartLocation: 0,
    _movePagePoint: null,
    _leftBoundaryChild: null,
    _rightBoundaryChild: null,
    _leftBoundary: 0,
    _rightBoundary: 0,
    _isAutoScrolling: false,
    _autoScrollDistance: 0,
    _autoScrollSpeed: 0,
    _autoScrollDirection: 0,
    _childFocusCancelOffset: 0,
    _pageViewEventListener: null,
    _pageViewEventSelector: null,
    _className:"PageView",
    _customScrollThreshold: 0,
    _usingCustomScrollThreshold: false,
    /**
     * Allocates and initializes a UIPageView.
     * Constructor of ccui.PageView. please do not call this function by yourself, you should pass the parameters to constructor to initialize it .
     * @example
     *
     * var uiPageView = new ccui.PageView();
     */
    ctor: function () {
        ccui.Layout.prototype.ctor.call(this);
        this._pages = [];
        this._touchMoveDirection = ccui.PageView.TOUCH_DIR_LEFT;
        this._movePagePoint = null;
        this._leftBoundaryChild = null;
        this._rightBoundaryChild = null;
        this._childFocusCancelOffset = 5;
        this._pageViewEventListener = null;
        this._pageViewEventSelector = null;
        this.setTouchEnabled(true);
    },
    init: function () {
        if (ccui.Layout.prototype.init.call(this)) {
            this.setClippingEnabled(true);
            return true;
        }
        return false;
    },
    onEnter:function(){
        ccui.Layout.prototype.onEnter.call(this);
        this.scheduleUpdate(true);
    },
    addWidgetToPage: function (widget, pageIdx, forceCreate) {
        if (!widget || pageIdx < 0)
            return;
        var pageCount = this._getPageCount();
        if (pageIdx < 0 || pageIdx >= pageCount) {
            if (forceCreate) {
                if (pageIdx > pageCount)
                    cc.log("pageIdx is %d, it will be added as page id [%d]", pageIdx, pageCount);
                var newPage = this._createPage();
                newPage.addChild(widget);
                this.addPage(newPage);
            }
        } else {
            var page = this._pages[pageIdx];
            if (page)
                page.addChild(widget);
        }
    },
    _createPage: function () {
        var newPage = new ccui.Layout();
        newPage.setContentSize(this.getContentSize());
        return newPage;
    },
    addPage: function (page) {
        if (!page || this._pages.indexOf(page) !== -1)
            return;
        this.addChild(page);
        this._pages.push(page);
        this._doLayoutDirty = true;
    },
    insertPage: function (page, idx) {
        if (idx < 0 || !page || this._pages.indexOf(page) !== -1)
            return;
        var pageCount = this._getPageCount();
        if (idx >= pageCount)
            this.addPage(page);
        else {
            this._pages[idx] = page;
            this.addChild(page);
        }
        this._doLayoutDirty = true;
    },
    removePage: function (page) {
        if (!page)
            return;
        this.removeChild(page);
        var index = this._pages.indexOf(page);
        if(index > -1)
            this._pages.splice(index, 1);
        this._doLayoutDirty = true;
    },
    removePageAtIndex: function (index) {
        if (index < 0 || index >= this._pages.length)
            return;
        var page = this._pages[index];
        if (page)
            this.removePage(page);
    },
    removeAllPages: function(){
        var locPages = this._pages;
        for(var i = 0, len = locPages.length; i < len; i++)
            this.removeChild(locPages[i]);
        this._pages.length = 0;
    },
    _updateBoundaryPages: function () {
        var locPages = this._pages;
        if (locPages.length <= 0) {
            this._leftBoundaryChild = null;
            this._rightBoundaryChild = null;
            return;
        }
        this._leftBoundaryChild = locPages[0];
        this._rightBoundaryChild = locPages[locPages.length - 1];
    },
    _getPageCount: function(){
        return this._pages.length;
    },
    _getPositionXByIndex: function (idx) {
        return (this.getContentSize().width * (idx - this._curPageIdx));
    },
    _onSizeChanged: function () {
        ccui.Layout.prototype._onSizeChanged.call(this);
        this._rightBoundary = this.getContentSize().width;
        this._doLayoutDirty = true;
    },
    _updateAllPagesSize: function(){
        var selfSize = this.getContentSize();
        var locPages = this._pages;
        for (var i = 0, len = locPages.length; i < len; i++)
            locPages[i].setContentSize(selfSize);
    },
    _updateAllPagesPosition: function(){
        var pageCount = this._getPageCount();
        if (pageCount <= 0) {
            this._curPageIdx = 0;
            return;
        }
        if (this._curPageIdx >= pageCount)
            this._curPageIdx = pageCount-1;
        var pageWidth = this.getContentSize().width;
        var locPages = this._pages;
        for (var i=0; i< pageCount; i++)
            locPages[i].setPosition(cc.p((i - this._curPageIdx) * pageWidth, 0));
    },
    scrollToPage: function (idx) {
        if (idx < 0 || idx >= this._pages.length)
            return;
        this._curPageIdx = idx;
        var curPage = this._pages[idx];
        this._autoScrollDistance = -(curPage.getPosition().x);
        this._autoScrollSpeed = Math.abs(this._autoScrollDistance) / 0.2;
        this._autoScrollDirection = this._autoScrollDistance > 0 ? ccui.PageView.DIRECTION_RIGHT : ccui.PageView.DIRECTION_LEFT;
        this._isAutoScrolling = true;
    },
    update: function (dt) {
        if (this._isAutoScrolling)
            this._autoScroll(dt);
    },
    setLayoutType:function(type){
    },
    getLayoutType: function(){
        return ccui.Layout.ABSOLUTE;
    },
    _autoScroll: function(dt){
        var step;
        switch (this._autoScrollDirection) {
            case ccui.PageView.DIRECTION_LEFT:
                step = this._autoScrollSpeed * dt;
                if (this._autoScrollDistance + step >= 0.0) {
                    step = -this._autoScrollDistance;
                    this._autoScrollDistance = 0.0;
                    this._isAutoScrolling = false;
                } else
                    this._autoScrollDistance += step;
                this._scrollPages(-step);
                if(!this._isAutoScrolling)
                    this._pageTurningEvent();
                break;
                break;
            case ccui.PageView.DIRECTION_RIGHT:
                step = this._autoScrollSpeed * dt;
                if (this._autoScrollDistance - step <= 0.0) {
                    step = this._autoScrollDistance;
                    this._autoScrollDistance = 0.0;
                    this._isAutoScrolling = false;
                } else
                    this._autoScrollDistance -= step;
                this._scrollPages(step);
                if(!this._isAutoScrolling)
                    this._pageTurningEvent();
                break;
            default:
                break;
        }
    },
    onTouchMoved: function (touch, event) {
        ccui.Layout.prototype.onTouchMoved.call(this, touch, event);
        if (!this._isInterceptTouch)
            this._handleMoveLogic(touch);
    },
    onTouchEnded: function (touch, event) {
        ccui.Layout.prototype.onTouchEnded.call(this, touch, event);
        if (!this._isInterceptTouch)
            this._handleReleaseLogic(touch);
        this._isInterceptTouch = false;
    },
    onTouchCancelled: function (touch, event) {
        ccui.Layout.prototype.onTouchCancelled.call(this, touch, event);
        if (!this._isInterceptTouch)
            this._handleReleaseLogic(touch);
        this._isInterceptTouch = false;
    },
    _doLayout: function(){
        if (!this._doLayoutDirty)
            return;
        this._updateAllPagesPosition();
        this._updateAllPagesSize();
        this._updateBoundaryPages();
        this._doLayoutDirty = false;
    },
    _movePages: function (offset) {
        var arrayPages = this._pages;
        var length = arrayPages.length;
        for (var i = 0; i < length; i++) {
            var child = arrayPages[i];
            child.setPositionX(child.getPositionX() + offset);
        }
    },
    _scrollPages: function (touchOffset) {
        if (this._pages.length <= 0)
            return false;
        if (!this._leftBoundaryChild || !this._rightBoundaryChild)
            return false;
        var realOffset = touchOffset;
        switch (this._touchMoveDirection) {
            case ccui.PageView.TOUCH_DIR_LEFT:
                var rightBoundary = this._rightBoundaryChild.getRightBoundary();
                if (rightBoundary + touchOffset <= this._rightBoundary) {
                    realOffset = this._rightBoundary - rightBoundary;
                    this._movePages(realOffset);
                    return false;
                }
                break;
            case ccui.PageView.TOUCH_DIR_RIGHT:
                var leftBoundary = this._leftBoundaryChild.getLeftBoundary();
                if (leftBoundary + touchOffset >= this._leftBoundary) {
                    realOffset = this._leftBoundary - leftBoundary;
                    this._movePages(realOffset);
                    return false;
                }
                break;
            default:
                break;
        }
        this._movePages(realOffset);
        return true;
    },
    _handleMoveLogic: function (touch) {
        var offset = touch.getLocation().x - touch.getPreviousLocation().x;
        if (offset < 0)
            this._touchMoveDirection = ccui.PageView.TOUCH_DIR_LEFT;
        else if (offset > 0)
            this._touchMoveDirection = ccui.PageView.TOUCH_DIR_RIGHT;
        this._scrollPages(offset);
    },
    setCustomScrollThreshold: function(threshold){
        cc.assert(threshold>0, "Invalid threshold!");
        this._customScrollThreshold = threshold;
        this.setUsingCustomScrollThreshold(true);
    },
    getCustomScrollThreshold: function(){
        return this._customScrollThreshold;
    },
    setUsingCustomScrollThreshold: function(flag){
        this._usingCustomScrollThreshold = flag;
    },
    isUsingCustomScrollThreshold: function(){
        return this._usingCustomScrollThreshold;
    },
    _handleReleaseLogic: function (touchPoint) {
        if (this._pages.length <= 0)
            return;
        var curPage = this._pages[this._curPageIdx];
        if (curPage) {
            var curPagePos = curPage.getPosition();
            var pageCount = this._pages.length;
            var curPageLocation = curPagePos.x;
            var pageWidth = this.getSize().width;
            if (!this._usingCustomScrollThreshold)
                this._customScrollThreshold = pageWidth / 2.0;
            var boundary = this._customScrollThreshold;
            if (curPageLocation <= -boundary) {
                if (this._curPageIdx >= pageCount - 1)
                    this._scrollPages(-curPageLocation);
                else
                    this.scrollToPage(this._curPageIdx + 1);
            } else if (curPageLocation >= boundary) {
                if (this._curPageIdx <= 0)
                    this._scrollPages(-curPageLocation);
                else
                    this.scrollToPage(this._curPageIdx - 1);
            } else
                this.scrollToPage(this._curPageIdx);
        }
    },
    interceptTouchEvent: function (eventType, sender, touch) {
        var touchPoint = touch.getLocation();
        switch (eventType) {
            case ccui.Widget.TOUCH_BEGAN:
                this._touchBeganPosition.x = touchPoint.x;
                this._touchBeganPosition.y = touchPoint.y;
                this._isInterceptTouch = true;
                break;
            case ccui.Widget.TOUCH_MOVED:
                this._touchMovePosition.x = touchPoint.x;
                this._touchMovePosition.y = touchPoint.y;
                var offset = 0;
                offset = Math.abs(sender.getTouchBeganPosition().x - touchPoint.x);
                if (offset > this._childFocusCancelOffset) {
                    sender.setHighlighted(false);
                    this._handleMoveLogic(touch);
                }
                break;
            case ccui.Widget.TOUCH_ENDED:
            case ccui.Widget.TOUCH_CANCELED:
                this._touchEndPosition.x = touchPoint.x;
                this._touchEndPosition.y = touchPoint.y;
                this._handleReleaseLogic(touch);
                if (sender.isSwallowTouches())
                    this._isInterceptTouch = false;
                break;
        }
    },
    _pageTurningEvent: function () {
        if(this._pageViewEventSelector){
            if (this._pageViewEventListener)
                this._pageViewEventSelector.call(this._pageViewEventListener, this, ccui.PageView.EVENT_TURNING);
            else
                this._pageViewEventSelector(this, ccui.PageView.EVENT_TURNING);
        }
        if(this._ccEventCallback)
            this._ccEventCallback(this, ccui.PageView.EVENT_TURNING);
    },
    addEventListenerPageView: function (selector, target) {
        this.addEventListener(selector, target);
    },
    addEventListener: function(selector, target){
        this._pageViewEventSelector = selector;
        this._pageViewEventListener = target;
    },
    getCurPageIndex: function () {
        return this._curPageIdx;
    },
    getPages:function(){
        return this._pages;
    },
    getPage: function(index){
        if (index < 0 || index >= this._pages.length)
            return null;
        return this._pages[index];
    },
    getDescription: function () {
        return "PageView";
    },
    _createCloneInstance: function () {
        return new ccui.PageView();
    },
    _copyClonedWidgetChildren: function (model) {
        var arrayPages = model.getPages();
        for (var i = 0; i < arrayPages.length; i++) {
            var page = arrayPages[i];
            this.addPage(page.clone());
        }
    },
    _copySpecialProperties: function (pageView) {
        ccui.Layout.prototype._copySpecialProperties.call(this, pageView);
        this._ccEventCallback = pageView._ccEventCallback;
        this._pageViewEventListener = pageView._pageViewEventListener;
        this._pageViewEventSelector = pageView._pageViewEventSelector;
        this._usingCustomScrollThreshold = pageView._usingCustomScrollThreshold;
        this._customScrollThreshold = pageView._customScrollThreshold;
    }
});
ccui.PageView.create = function () {
    return new ccui.PageView();
};
ccui.PageView.EVENT_TURNING = 0;
ccui.PageView.TOUCH_DIR_LEFT = 0;
ccui.PageView.TOUCH_DIR_RIGHT = 1;
ccui.PageView.DIRECTION_LEFT = 0;
ccui.PageView.DIRECTION_RIGHT = 1;

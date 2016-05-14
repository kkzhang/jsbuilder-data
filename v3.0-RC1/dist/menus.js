cc._globalFontSize=cc.ITEM_SIZE;cc._globalFontName="Arial";cc._globalFontNameRelease=!1;
cc.MenuItem=cc.Node.extend({_enabled:!1,_target:null,_callback:null,_isSelected:!1,_className:"MenuItem",ctor:function(a,b){var c=cc.Node.prototype;c.ctor.call(this);this._callback=this._target=null;this._enabled=this._isSelected=!1;c.setAnchorPoint.call(this,0.5,0.5);this._target=b||null;if(this._callback=a||null)this._enabled=!0},isSelected:function(){return this._isSelected},setOpacityModifyRGB:function(a){},isOpacityModifyRGB:function(){return!1},setTarget:function(a,b){this._target=b;this._callback=
a},isEnabled:function(){return this._enabled},setEnabled:function(a){this._enabled=a},initWithCallback:function(a,b){this.anchorY=this.anchorX=0.5;this._target=b;this._callback=a;this._enabled=!0;this._isSelected=!1;return!0},rect:function(){var a=this._position,b=this._contentSize,c=this._anchorPoint;return cc.rect(a.x-b.width*c.x,a.y-b.height*c.y,b.width,b.height)},selected:function(){this._isSelected=!0},unselected:function(){this._isSelected=!1},setCallback:function(a,b){this._target=b;this._callback=
a},activate:function(){if(this._enabled){var a=this._target,b=this._callback;if(b)if(a&&"string"==typeof b)a[b](this);else a&&"function"==typeof b?b.call(a,this):b(this)}}});var _p=cc.MenuItem.prototype;cc.defineGetterSetter(_p,"enabled",_p.isEnabled,_p.setEnabled);cc.MenuItem.create=function(a,b){return new cc.MenuItem(a,b)};
cc.MenuItemLabel=cc.MenuItem.extend({_disabledColor:null,_label:null,_orginalScale:0,_colorBackup:null,ctor:function(a,b,c){cc.MenuItem.prototype.ctor.call(this,b,c);this._label=this._disabledColor=null;this._orginalScale=0;this._colorBackup=null;a&&(this._originalScale=1,this._colorBackup=cc.color.WHITE,this._disabledColor=cc.color(126,126,126),this.setLabel(a),this.cascadeOpacity=this.cascadeColor=!0)},getDisabledColor:function(){return this._disabledColor},setDisabledColor:function(a){this._disabledColor=
a},getLabel:function(){return this._label},setLabel:function(a){a&&(this.addChild(a),a.anchorX=0,a.anchorY=0,this.width=a.width,this.height=a.height);this._label&&this.removeChild(this._label,!0);this._label=a},setEnabled:function(a){if(this._enabled!=a){var b=this._label;a?b.color=this._colorBackup:(this._colorBackup=b.color,b.color=this._disabledColor)}cc.MenuItem.prototype.setEnabled.call(this,a)},setOpacity:function(a){this._label.opacity=a},getOpacity:function(){return this._label.opacity},setColor:function(a){this._label.color=
a},getColor:function(){return this._label.color},initWithLabel:function(a,b,c){this.initWithCallback(b,c);this._originalScale=1;this._colorBackup=cc.color.WHITE;this._disabledColor=cc.color(126,126,126);this.setLabel(a);return this.cascadeOpacity=this.cascadeColor=!0},setString:function(a){this._label.string=a;this.width=this._label.width;this.height=this._label.height},getString:function(){return this._label.string},activate:function(){this._enabled&&(this.stopAllActions(),this.scale=this._originalScale,
cc.MenuItem.prototype.activate.call(this))},selected:function(){if(this._enabled){cc.MenuItem.prototype.selected.call(this);var a=this.getActionByTag(cc.ZOOM_ACTION_TAG);a?this.stopAction(a):this._originalScale=this.scale;a=cc.ScaleTo.create(0.1,1.2*this._originalScale);a.setTag(cc.ZOOM_ACTION_TAG);this.runAction(a)}},unselected:function(){if(this._enabled){cc.MenuItem.prototype.unselected.call(this);this.stopActionByTag(cc.ZOOM_ACTION_TAG);var a=cc.ScaleTo.create(0.1,this._originalScale);a.setTag(cc.ZOOM_ACTION_TAG);
this.runAction(a)}}});_p=cc.MenuItemLabel.prototype;cc.defineGetterSetter(_p,"string",_p.getString,_p.setString);cc.defineGetterSetter(_p,"disabledColor",_p.getDisabledColor,_p.setDisabledColor);cc.defineGetterSetter(_p,"label",_p.getLabel,_p.setLabel);cc.MenuItemLabel.create=function(a,b,c){return new cc.MenuItemLabel(a,b,c)};
cc.MenuItemAtlasFont=cc.MenuItemLabel.extend({ctor:function(a,b,c,d,e,g,h){var f;a&&0<a.length&&(f=cc.LabelAtlas.create(a,b,c,d,e));cc.MenuItemLabel.prototype.ctor.call(this,f,g,h)},initWithString:function(a,b,c,d,e,g,h){if(!a||0==a.length)throw"cc.MenuItemAtlasFont.initWithString(): value should be non-null and its length should be greater than 0";var f=new cc.LabelAtlas;f.initWithString(a,b,c,d,e);this.initWithLabel(f,g,h);return!0}});
cc.MenuItemAtlasFont.create=function(a,b,c,d,e,g,h){return new cc.MenuItemAtlasFont(a,b,c,d,e,g,h)};
cc.MenuItemFont=cc.MenuItemLabel.extend({_fontSize:null,_fontName:null,ctor:function(a,b,c){var d;a&&0<a.length?(this._fontName=cc._globalFontName,this._fontSize=cc._globalFontSize,d=cc.LabelTTF.create(a,this._fontName,this._fontSize)):(this._fontSize=0,this._fontName="");cc.MenuItemLabel.prototype.ctor.call(this,d,b,c)},initWithString:function(a,b,c){if(!a||0==a.length)throw"Value should be non-null and its length should be greater than 0";this._fontName=cc._globalFontName;this._fontSize=cc._globalFontSize;
a=cc.LabelTTF.create(a,this._fontName,this._fontSize);this.initWithLabel(a,b,c);return!0},setFontSize:function(a){this._fontSize=a;this._recreateLabel()},getFontSize:function(){return this._fontSize},setFontName:function(a){this._fontName=a;this._recreateLabel()},getFontName:function(){return this._fontName},_recreateLabel:function(){var a=cc.LabelTTF.create(this._label.string,this._fontName,this._fontSize);this.setLabel(a)}});cc.MenuItemFont.setFontSize=function(a){cc._globalFontSize=a};
cc.MenuItemFont.fontSize=function(){return cc._globalFontSize};cc.MenuItemFont.setFontName=function(a){cc._globalFontNameRelease&&(cc._globalFontName="");cc._globalFontName=a;cc._globalFontNameRelease=!0};_p=cc.MenuItemFont.prototype;cc.defineGetterSetter(_p,"fontSize",_p.getFontSize,_p.setFontSize);cc.defineGetterSetter(_p,"fontName",_p.getFontName,_p.setFontName);cc.MenuItemFont.fontName=function(){return cc._globalFontName};
cc.MenuItemFont.create=function(a,b,c){return new cc.MenuItemFont(a,b,c)};
cc.MenuItemSprite=cc.MenuItem.extend({_normalImage:null,_selectedImage:null,_disabledImage:null,ctor:function(a,b,c,d,e){cc.MenuItem.prototype.ctor.call(this);this._disabledImage=this._selectedImage=this._normalImage=null;if(void 0!==b){var g,h,f;void 0!==e?(g=c,f=d,h=e):void 0!==d&&"function"===typeof d?(g=c,f=d):void 0!==d&&"function"===typeof c?(h=d,f=c,g=cc.Sprite.create(b)):void 0===c&&(g=cc.Sprite.create(b));this.initWithNormalSprite(a,b,g,f,h)}},getNormalImage:function(){return this._normalImage},
setNormalImage:function(a){this._normalImage!=a&&(a&&(this.addChild(a,0,cc.NORMAL_TAG),a.anchorX=0,a.anchorY=0),this._normalImage&&this.removeChild(this._normalImage,!0),this._normalImage=a,this.width=this._normalImage.width,this.height=this._normalImage.height,this._updateImagesVisibility(),a.textureLoaded&&!a.textureLoaded()&&a.addLoadedEventListener(function(a){this.width=a.width;this.height=a.height},this))},getSelectedImage:function(){return this._selectedImage},setSelectedImage:function(a){this._selectedImage!=
a&&(a&&(this.addChild(a,0,cc.SELECTED_TAG),a.anchorX=0,a.anchorY=0),this._selectedImage&&this.removeChild(this._selectedImage,!0),this._selectedImage=a,this._updateImagesVisibility())},getDisabledImage:function(){return this._disabledImage},setDisabledImage:function(a){this._disabledImage!=a&&(a&&(this.addChild(a,0,cc.DISABLE_TAG),a.anchorX=0,a.anchorY=0),this._disabledImage&&this.removeChild(this._disabledImage,!0),this._disabledImage=a,this._updateImagesVisibility())},initWithNormalSprite:function(a,
b,c,d,e){this.initWithCallback(d,e);this.setNormalImage(a);this.setSelectedImage(b);this.setDisabledImage(c);if(a=this._normalImage)this.width=a.width,this.height=a.height,a.textureLoaded&&!a.textureLoaded()&&a.addLoadedEventListener(function(a){this.width=a.width;this.height=a.height;this.cascadeOpacity=this.cascadeColor=!0},this);return this.cascadeOpacity=this.cascadeColor=!0},setColor:function(a){this._normalImage.color=a;this._selectedImage&&(this._selectedImage.color=a);this._disabledImage&&
(this._disabledImage.color=a)},getColor:function(){return this._normalImage.color},setOpacity:function(a){this._normalImage.opacity=a;this._selectedImage&&(this._selectedImage.opacity=a);this._disabledImage&&(this._disabledImage.opacity=a)},getOpacity:function(){return this._normalImage.opacity},selected:function(){cc.MenuItem.prototype.selected.call(this);this._normalImage&&(this._disabledImage&&(this._disabledImage.visible=!1),this._selectedImage?(this._normalImage.visible=!1,this._selectedImage.visible=
!0):this._normalImage.visible=!0)},unselected:function(){cc.MenuItem.prototype.unselected.call(this);this._normalImage&&(this._normalImage.visible=!0,this._selectedImage&&(this._selectedImage.visible=!1),this._disabledImage&&(this._disabledImage.visible=!1))},setEnabled:function(a){this._enabled!=a&&(cc.MenuItem.prototype.setEnabled.call(this,a),this._updateImagesVisibility())},_updateImagesVisibility:function(){var a=this._normalImage,b=this._selectedImage,c=this._disabledImage;this._enabled?(a&&
(a.visible=!0),b&&(b.visible=!1),c&&(c.visible=!1)):c?(a&&(a.visible=!1),b&&(b.visible=!1),c&&(c.visible=!0)):(a&&(a.visible=!0),b&&(b.visible=!1))}});_p=cc.MenuItemSprite.prototype;cc.defineGetterSetter(_p,"normalImage",_p.getNormalImage,_p.setNormalImage);cc.defineGetterSetter(_p,"selectedImage",_p.getSelectedImage,_p.setSelectedImage);cc.defineGetterSetter(_p,"disabledImage",_p.getDisabledImage,_p.setDisabledImage);
cc.MenuItemSprite.create=function(a,b,c,d,e){return new cc.MenuItemSprite(a,b,c,d,e||void 0)};
cc.MenuItemImage=cc.MenuItemSprite.extend({ctor:function(a,b,c,d,e){var g=null,h=null,f=null,l=null,k=null;void 0===a?cc.MenuItemSprite.prototype.ctor.call(this):(g=cc.Sprite.create(a),b&&(h=cc.Sprite.create(b)),void 0===d?l=c:void 0===e?(l=c,k=d):e&&(f=cc.Sprite.create(c),l=d,k=e),cc.MenuItemSprite.prototype.ctor.call(this,g,h,f,l,k))},setNormalSpriteFrame:function(a){this.setNormalImage(cc.Sprite.create(a))},setSelectedSpriteFrame:function(a){this.setSelectedImage(cc.Sprite.create(a))},setDisabledSpriteFrame:function(a){this.setDisabledImage(cc.Sprite.create(a))},
initWithNormalImage:function(a,b,c,d,e){var g=null,h=null,f=null;a&&(g=cc.Sprite.create(a));b&&(h=cc.Sprite.create(b));c&&(f=cc.Sprite.create(c));return this.initWithNormalSprite(g,h,f,d,e)}});cc.MenuItemImage.create=function(a,b,c,d,e){return new cc.MenuItemImage(a,b,c,d,e)};
cc.MenuItemToggle=cc.MenuItem.extend({subItems:null,_selectedIndex:0,_opacity:null,_color:null,ctor:function(){cc.MenuItem.prototype.ctor.call(this);this._selectedIndex=0;this.subItems=[];this._opacity=0;this._color=cc.color.WHITE;0<arguments.length&&this.initWithItems(Array.prototype.slice.apply(arguments))},getOpacity:function(){return this._opacity},setOpacity:function(a){this._opacity=a;if(this.subItems&&0<this.subItems.length)for(var b=0;b<this.subItems.length;b++)this.subItems[b].opacity=a;
this._color.a=a},getColor:function(){var a=this._color;return cc.color(a.r,a.g,a.b,a.a)},setColor:function(a){var b=this._color;b.r=a.r;b.g=a.g;b.b=a.b;if(this.subItems&&0<this.subItems.length)for(b=0;b<this.subItems.length;b++)this.subItems[b].setColor(a);void 0!==a.a&&!a.a_undefined&&this.setOpacity(a.a)},getSelectedIndex:function(){return this._selectedIndex},setSelectedIndex:function(a){if(a!=this._selectedIndex){this._selectedIndex=a;(a=this.getChildByTag(cc.CURRENT_ITEM))&&a.removeFromParent(!1);
a=this.subItems[this._selectedIndex];this.addChild(a,0,cc.CURRENT_ITEM);var b=a.width,c=a.height;this.width=b;this.height=c;a.setPosition(b/2,c/2)}},getSubItems:function(){return this.subItems},setSubItems:function(a){this.subItems=a},initWithItems:function(a){var b=a.length;"function"===typeof a[a.length-2]?(this.initWithCallback(a[a.length-2],a[a.length-1]),b-=2):"function"===typeof a[a.length-1]?(this.initWithCallback(a[a.length-1],null),b-=1):this.initWithCallback(null,null);for(var c=this.subItems,
d=c.length=0;d<b;d++)a[d]&&c.push(a[d]);this._selectedIndex=cc.UINT_MAX;this.setSelectedIndex(0);return this.cascadeOpacity=this.cascadeColor=!0},addSubItem:function(a){this.subItems.push(a)},activate:function(){this._enabled&&this.setSelectedIndex((this._selectedIndex+1)%this.subItems.length);cc.MenuItem.prototype.activate.call(this)},selected:function(){cc.MenuItem.prototype.selected.call(this);this.subItems[this._selectedIndex].selected()},unselected:function(){cc.MenuItem.prototype.unselected.call(this);
this.subItems[this._selectedIndex].unselected()},setEnabled:function(a){if(this._enabled!=a){cc.MenuItem.prototype.setEnabled.call(this,a);var b=this.subItems;if(b&&0<b.length)for(var c=0;c<b.length;c++)b[c].enabled=a}},selectedItem:function(){return this.subItems[this._selectedIndex]},onEnter:function(){cc.Node.prototype.onEnter.call(this);this.setSelectedIndex(this._selectedIndex)}});_p=cc.MenuItemToggle.prototype;cc.defineGetterSetter(_p,"selectedIndex",_p.getSelectedIndex,_p.setSelectedIndex);
cc.MenuItemToggle.create=function(){0<arguments.length&&null==arguments[arguments.length-1]&&cc.log("parameters should not be ending with null in Javascript");var a=new cc.MenuItemToggle;a.initWithItems(Array.prototype.slice.apply(arguments));return a};cc.MENU_STATE_WAITING=0;cc.MENU_STATE_TRACKING_TOUCH=1;cc.MENU_HANDLER_PRIORITY=-128;cc.DEFAULT_PADDING=5;
cc.Menu=cc.Layer.extend({enabled:!1,_color:null,_opacity:0,_selectedItem:null,_state:-1,_touchListener:null,_className:"Menu",ctor:function(a){cc.Layer.prototype.ctor.call(this);this._color=cc.color.WHITE;this.enabled=!1;this._opacity=255;this._selectedItem=null;this._state=-1;this._touchListener=cc.EventListener.create({event:cc.EventListener.TOUCH_ONE_BY_ONE,swallowTouches:!0,onTouchBegan:this._onTouchBegan,onTouchMoved:this._onTouchMoved,onTouchEnded:this._onTouchEnded,onTouchCancelled:this._onTouchCancelled});
0<arguments.length&&null==arguments[arguments.length-1]&&cc.log("parameters should not be ending with null in Javascript");var b=arguments.length,c;if(0==b)c=[];else if(1==b)c=a instanceof Array?a:[a];else if(1<b){c=[];for(var d=0;d<b;d++)arguments[d]&&c.push(arguments[d])}this.initWithArray(c)},onEnter:function(){var a=this._touchListener;a._isRegistered()||cc.eventManager.addListener(a,this);cc.Node.prototype.onEnter.call(this)},getColor:function(){var a=this._color;return cc.color(a.r,a.g,a.b,
a.a)},setColor:function(a){var b=this._color;b.r=a.r;b.g=a.g;b.b=a.b;if((b=this._children)&&0<b.length)for(var c=0;c<b.length;c++)b[c].setColor(a);void 0!==a.a&&!a.a_undefined&&this.setOpacity(a.a)},getOpacity:function(){return this._opacity},setOpacity:function(a){this._opacity=a;var b=this._children;if(b&&0<b.length)for(var c=0;c<b.length;c++)b[c].setOpacity(a);this._color.a=a},isEnabled:function(){return this.enabled},setEnabled:function(a){this.enabled=a},initWithItems:function(a){var b=[];if(a)for(var c=
0;c<a.length;c++)a[c]&&b.push(a[c]);return this.initWithArray(b)},initWithArray:function(a){if(cc.Layer.prototype.init.call(this)){this.enabled=!0;var b=cc.winSize;this.setPosition(b.width/2,b.height/2);this.setContentSize(b);this.setAnchorPoint(0.5,0.5);this.ignoreAnchorPointForPosition(!0);if(a)for(b=0;b<a.length;b++)this.addChild(a[b],b);this._selectedItem=null;this._state=cc.MENU_STATE_WAITING;return this.cascadeOpacity=this.cascadeColor=!0}return!1},addChild:function(a,b,c){if(!(a instanceof
cc.MenuItem))throw"cc.Menu.addChild() : Menu only supports MenuItem objects as children";cc.Layer.prototype.addChild.call(this,a,b,c)},alignItemsVertically:function(){this.alignItemsVerticallyWithPadding(cc.DEFAULT_PADDING)},alignItemsVerticallyWithPadding:function(a){var b=-a,c=this._children,d,e,g,h;if(c&&0<c.length){e=0;for(d=c.length;e<d;e++)b+=c[e].height*c[e].scaleY+a;var f=b/2;e=0;for(d=c.length;e<d;e++)h=c[e],g=h.height,b=h.scaleY,h.setPosition(0,f-g*b/2),f-=g*b+a}},alignItemsHorizontally:function(){this.alignItemsHorizontallyWithPadding(cc.DEFAULT_PADDING)},
alignItemsHorizontallyWithPadding:function(a){var b=-a,c=this._children,d,e,g,h;if(c&&0<c.length){d=0;for(e=c.length;d<e;d++)b+=c[d].width*c[d].scaleX+a;var f=-b/2;d=0;for(e=c.length;d<e;d++)h=c[d],b=h.scaleX,g=c[d].width,h.setPosition(f+g*b/2,0),f+=g*b+a}},alignItemsInColumns:function(){0<arguments.length&&null==arguments[arguments.length-1]&&cc.log("parameters should not be ending with null in Javascript");for(var a=[],b=0;b<arguments.length;b++)a.push(arguments[b]);var c=-5,d=0,e=0,g=0,h,f,l,k=
this._children;if(k&&0<k.length){b=0;for(l=k.length;b<l;b++)if(!(d>=a.length)&&(h=a[d]))f=k[b].height,e=e>=f||isNaN(f)?e:f,++g,g>=h&&(c+=e+5,e=g=0,++d)}var p=cc.director.getWinSize(),q=h=e=d=0,m=0,c=c/2;if(k&&0<k.length){b=0;for(l=k.length;b<l;b++){var n=k[b];0==h&&(h=a[d],m=q=p.width/(1+h));f=n._getHeight();e=e>=f||isNaN(f)?e:f;n.setPosition(m-p.width/2,c-f/2);m+=q;++g;g>=h&&(c-=e+5,e=h=g=0,++d)}}},alignItemsInRows:function(){0<arguments.length&&null==arguments[arguments.length-1]&&cc.log("parameters should not be ending with null in Javascript");
var a=[],b;for(b=0;b<arguments.length;b++)a.push(arguments[b]);var c=[],d=[],e=-10,g=-5,h=0,f=0,l=0,k,p,q,m,n=this._children;if(n&&0<n.length){b=0;for(q=n.length;b<q;b++)if(p=n[b],!(h>=a.length)&&(k=a[h]))m=p.width,f=f>=m||isNaN(m)?f:m,g+=p.height+5,++l,l>=k&&(c.push(f),d.push(g),e+=f+10,f=l=0,g=-5,++h)}g=cc.director.getWinSize();k=f=h=0;var e=-e/2,r=0;if(n&&0<n.length){b=0;for(q=n.length;b<q;b++)p=n[b],0==k&&(k=a[h],r=d[h]),m=p._getWidth(),f=f>=m||isNaN(m)?f:m,p.setPosition(e+c[h]/2,r-g.height/2),
r-=p.height+10,++l,l>=k&&(e+=f+5,f=k=l=0,++h)}},removeChild:function(a,b){null!=a&&(a instanceof cc.MenuItem?(this._selectedItem==a&&(this._selectedItem=null),cc.Node.prototype.removeChild.call(this,a,b)):cc.log("cc.Menu.removeChild():Menu only supports MenuItem objects as children"))},_onTouchBegan:function(a,b){var c=b.getCurrentTarget();if(c._state!=cc.MENU_STATE_WAITING||!c._visible||!c.enabled)return!1;for(var d=c.parent;null!=d;d=d.parent)if(!d.isVisible())return!1;c._selectedItem=c._itemForTouch(a);
return c._selectedItem?(c._state=cc.MENU_STATE_TRACKING_TOUCH,c._selectedItem.selected(),!0):!1},_onTouchEnded:function(a,b){var c=b.getCurrentTarget();c._state!==cc.MENU_STATE_TRACKING_TOUCH?cc.log("cc.Menu.onTouchEnded(): invalid state"):(c._selectedItem&&(c._selectedItem.unselected(),c._selectedItem.activate()),c._state=cc.MENU_STATE_WAITING)},_onTouchCancelled:function(a,b){var c=b.getCurrentTarget();c._state!==cc.MENU_STATE_TRACKING_TOUCH?cc.log("cc.Menu.onTouchCancelled(): invalid state"):(this._selectedItem&&
c._selectedItem.unselected(),c._state=cc.MENU_STATE_WAITING)},_onTouchMoved:function(a,b){var c=b.getCurrentTarget();if(c._state!==cc.MENU_STATE_TRACKING_TOUCH)cc.log("cc.Menu.onTouchMoved(): invalid state");else{var d=c._itemForTouch(a);d!=c._selectedItem&&(c._selectedItem&&c._selectedItem.unselected(),c._selectedItem=d,c._selectedItem&&c._selectedItem.selected())}},onExit:function(){this._state==cc.MENU_STATE_TRACKING_TOUCH&&(this._selectedItem&&(this._selectedItem.unselected(),this._selectedItem=
null),this._state=cc.MENU_STATE_WAITING);cc.Node.prototype.onExit.call(this)},setOpacityModifyRGB:function(a){},isOpacityModifyRGB:function(){return!1},_itemForTouch:function(a){a=a.getLocation();var b=this._children,c;if(b&&0<b.length)for(var d=0;d<b.length;d++)if(c=b[d],c.isVisible()&&c.isEnabled()){var e=c.convertToNodeSpace(a),g=c.rect();g.x=0;g.y=0;if(cc.rectContainsPoint(g,e))return c}return null}});_p=cc.Menu.prototype;
cc.Menu.create=function(a){var b=arguments.length;0<b&&null==arguments[b-1]&&cc.log("parameters should not be ending with null in Javascript");return 0==b?new cc.Menu:1==b?new cc.Menu(a):new cc.Menu(Array.prototype.slice.call(arguments,0))};
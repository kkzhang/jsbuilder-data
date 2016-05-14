cc.IMAGE_FORMAT_JPEG=0;cc.IMAGE_FORMAT_PNG=1;cc.IMAGE_FORMAT_RAWDATA=9;cc.NextPOT=function(a){a-=1;a|=a>>1;a|=a>>2;a|=a>>4;a|=a>>8;return(a|a>>16)+1};
cc.RenderTexture=cc.Node.extend({sprite:null,clearFlags:0,clearDepthVal:0,autoDraw:!1,_cacheCanvas:null,_cacheContext:null,_fBO:0,_depthRenderBuffer:0,_oldFBO:0,_texture:null,_textureCopy:null,_uITextureImage:null,_pixelFormat:cc.Texture2D.PIXEL_FORMAT_RGBA8888,_clearColor:null,clearStencilVal:0,_clearColorStr:null,_className:"RenderTexture",ctor:null,_ctorForCanvas:function(a,b,c,d){cc.Node.prototype.ctor.call(this);this._clearColor=cc.color(255,255,255,255);this._clearColorStr="rgba(255,255,255,1)";
this._cacheCanvas=cc.newElement("canvas");this._cacheContext=this._cacheCanvas.getContext("2d");this.anchorY=this.anchorX=0;void 0!==a&&void 0!==b&&(c=c||cc.Texture2D.PIXEL_FORMAT_RGBA8888,this.initWithWidthAndHeight(a,b,c,d||0))},_ctorForWebGL:function(a,b,c,d){cc.Node.prototype.ctor.call(this);this._clearColor=cc.color(0,0,0,0);void 0!==a&&void 0!==b&&(c=c||cc.Texture2D.PIXEL_FORMAT_RGBA8888,this.initWithWidthAndHeight(a,b,c,d||0))},cleanup:null,_cleanupForCanvas:function(){cc.Node.prototype.onExit.call(this);
this._cacheCanvas=this._cacheContext=null},_cleanupForWebGL:function(){cc.Node.prototype.onExit.call(this);this._textureCopy=null;var a=cc._renderContext;a.deleteFramebuffer(this._fBO);this._depthRenderBuffer&&a.deleteRenderbuffer(this._depthRenderBuffer);this._uITextureImage=null},getSprite:function(){return this.sprite},setSprite:function(a){this.sprite=a},initWithWidthAndHeight:null,_initWithWidthAndHeightForCanvas:function(a,b,c,d){c=this._cacheCanvas;d=cc.contentScaleFactor();c.width=0|a*d;c.height=
0|b*d;this._cacheContext.translate(0,c.height);a=new cc.Texture2D;a.initWithElement(c);a.handleLoadedTexture();this.sprite=cc.Sprite.create(a);return!0},_initWithWidthAndHeightForWebGL:function(a,b,c,d){c==cc.Texture2D.PIXEL_FORMAT_A8&&cc.log("cc.RenderTexture._initWithWidthAndHeightForWebGL() : only RGB and RGBA formats are valid for a render texture;");var e=cc._renderContext,f=cc.contentScaleFactor();a=0|a*f;b=0|b*f;this._oldFBO=e.getParameter(e.FRAMEBUFFER_BINDING);var g;cc.configuration.supportsNPOT()?
(f=a,g=b):(f=cc.NextPOT(a),g=cc.NextPOT(b));for(var h=new Uint8Array(4*f*g),k=0;k<4*f*g;k++)h[k]=0;this._pixelFormat=c;this._texture=new cc.Texture2D;if(!this._texture)return!1;k=this._texture;k.initWithData(h,this._pixelFormat,f,g,cc.size(a,b));c=e.getParameter(e.RENDERBUFFER_BINDING);if(cc.configuration.checkForGLExtension("GL_QCOM")){this._textureCopy=new cc.Texture2D;if(!this._textureCopy)return!1;this._textureCopy.initWithData(h,this._pixelFormat,f,g,cc.size(a,b))}this._fBO=e.createFramebuffer();
e.bindFramebuffer(e.FRAMEBUFFER,this._fBO);e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,k._webTextureObj,0);0!=d&&(this._depthRenderBuffer=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,this._depthRenderBuffer),e.renderbufferStorage(e.RENDERBUFFER,d,f,g),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,this._depthRenderBuffer));e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&cc.log("Could not attach texture to the framebuffer");
k.setAliasTexParameters();a=this.sprite=cc.Sprite.create(k);a.scaleY=-1;a.setBlendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA);e.bindRenderbuffer(e.RENDERBUFFER,c);e.bindFramebuffer(e.FRAMEBUFFER,this._oldFBO);this.autoDraw=!1;this.addChild(a);return!0},begin:null,_beginForCanvas:function(){cc._renderContext=this._cacheContext;cc.view._setScaleXYForRenderTexture()},_beginForWebGL:function(){cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);cc.kmGLPushMatrix();cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);cc.kmGLPushMatrix();var a=
cc.director;a.setProjection(a.getProjection());var b=this._texture.getContentSizeInPixels(),c=cc.director.getWinSizeInPixels(),a=c.width/b.width,c=c.height/b.height,d=cc._renderContext;d.viewport(0,0,b.width,b.height);b=new cc.kmMat4;cc.kmMat4OrthographicProjection(b,-1/a,1/a,-1/c,1/c,-1,1);cc.kmGLMultMatrix(b);this._oldFBO=d.getParameter(d.FRAMEBUFFER_BINDING);d.bindFramebuffer(d.FRAMEBUFFER,this._fBO);cc.configuration.checkForGLExtension("GL_QCOM")&&(d.framebufferTexture2D(d.FRAMEBUFFER,d.COLOR_ATTACHMENT0,
d.TEXTURE_2D,this._textureCopy._webTextureObj,0),d.clear(d.COLOR_BUFFER_BIT|d.DEPTH_BUFFER_BIT),d.framebufferTexture2D(d.FRAMEBUFFER,d.COLOR_ATTACHMENT0,d.TEXTURE_2D,this._texture._webTextureObj,0))},beginWithClear:function(a,b,c,d,e,f){var g=cc._renderContext;e=e||g.COLOR_BUFFER_BIT;f=f||g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT;this._beginWithClear(a/255,b/255,c/255,d/255,e,f,g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT|g.STENCIL_BUFFER_BIT)},_beginWithClear:null,_beginWithClearForCanvas:function(a,b,c,d,
e,f,g){this.begin();a=a||0;b=b||0;c=c||0;d=isNaN(d)?1:d;e=this._cacheContext;f=this._cacheCanvas;e.save();e.fillStyle="rgba("+(0|a)+","+(0|b)+","+(0|c)+","+d/255+")";e.clearRect(0,0,f.width,-f.height);e.fillRect(0,0,f.width,-f.height);e.restore()},_beginWithClearForWebGL:function(a,b,c,d,e,f,g){this.begin();var h=cc._renderContext,k=[0,0,0,0],l=0,m=0;g&h.COLOR_BUFFER_BIT&&(k=h.getParameter(h.COLOR_CLEAR_VALUE),h.clearColor(a,b,c,d));g&h.DEPTH_BUFFER_BIT&&(l=h.getParameter(h.DEPTH_CLEAR_VALUE),h.clearDepth(e));
g&h.STENCIL_BUFFER_BIT&&(m=h.getParameter(h.STENCIL_CLEAR_VALUE),h.clearStencil(f));h.clear(g);g&h.COLOR_BUFFER_BIT&&h.clearColor(k[0],k[1],k[2],k[3]);g&h.DEPTH_BUFFER_BIT&&h.clearDepth(l);g&h.STENCIL_BUFFER_BIT&&h.clearStencil(m)},end:null,_endForCanvas:function(){cc._renderContext=cc._mainRenderContextBackup;cc.view._resetScale()},_endForWebGL:function(){var a=cc._renderContext,b=cc.director;a.bindFramebuffer(a.FRAMEBUFFER,this._oldFBO);b.setViewport();cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);cc.kmGLPopMatrix();
cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);cc.kmGLPopMatrix()},clear:function(a,b,c,d){this.beginWithClear(a,b,c,d);this.end()},clearRect:null,_clearRectForCanvas:function(a,b,c,d){this._cacheContext.clearRect(a,b,c,-d)},_clearRectForWebGL:function(a,b,c,d){},clearDepth:null,_clearDepthForCanvas:function(a){cc.log("clearDepth isn't supported on Cocos2d-Html5")},_clearDepthForWebGL:function(a){this.begin();var b=cc._renderContext,c=b.getParameter(b.DEPTH_CLEAR_VALUE);b.clearDepth(a);b.clear(b.DEPTH_BUFFER_BIT);
b.clearDepth(c);this.end()},clearStencil:null,_clearStencilForCanvas:function(a){cc.log("clearDepth isn't supported on Cocos2d-Html5")},_clearStencilForWebGL:function(a){var b=cc._renderContext,c=b.getParameter(b.STENCIL_CLEAR_VALUE);b.clearStencil(a);b.clear(b.STENCIL_BUFFER_BIT);b.clearStencil(c)},visit:null,_visitForCanvas:function(a){this._visible&&(a=a||cc._renderContext,a.save(),this.draw(a),this.transform(a),this.sprite.visit(),a.restore(),this.arrivalOrder=0)},_visitForWebGL:function(a){if(this._visible){cc.kmGLPushMatrix();
var b=this.grid;b&&b.isActive()&&(b.beforeDraw(),this.transformAncestors());this.transform(a);this.sprite.visit();this.draw(a);b&&b.isActive()&&b.afterDraw(this);cc.kmGLPopMatrix();this.arrivalOrder=0}},draw:null,_drawForCanvas:function(a){a=a||cc._renderContext;if(this.autoDraw){this.begin();if(this.clearFlags){var b=this._cacheCanvas;a.save();a.fillStyle=this._clearColorStr;a.clearRect(0,0,b.width,-b.height);a.fillRect(0,0,b.width,-b.height);a.restore()}this.sortAllChildren();a=this._children;for(var b=
a.length,c=this.sprite,d=0;d<b;d++){var e=a[d];e!=c&&e.visit()}this.end()}},_drawForWebGL:function(a){a=cc._renderContext;if(this.autoDraw){this.begin();var b=this.clearFlags;if(b){var c=[0,0,0,0],d=0,e=0;b&a.COLOR_BUFFER_BIT&&(c=a.getParameter(a.COLOR_CLEAR_VALUE),a.clearColor(this._clearColor.r/255,this._clearColor.g/255,this._clearColor.b/255,this._clearColor.a/255));b&a.DEPTH_BUFFER_BIT&&(d=a.getParameter(a.DEPTH_CLEAR_VALUE),a.clearDepth(this.clearDepthVal));b&a.STENCIL_BUFFER_BIT&&(e=a.getParameter(a.STENCIL_CLEAR_VALUE),
a.clearStencil(this.clearStencilVal));a.clear(b);b&a.COLOR_BUFFER_BIT&&a.clearColor(c[0],c[1],c[2],c[3]);b&a.DEPTH_BUFFER_BIT&&a.clearDepth(d);b&a.STENCIL_BUFFER_BIT&&a.clearStencil(e)}this.sortAllChildren();a=this._children;for(b=0;b<a.length;b++)c=a[b],c!=this.sprite&&c.visit();this.end()}},newCCImage:function(a){cc.log("saveToFile isn't supported on cocos2d-html5");return null},_memcpy:function(a,b,c,d,e){for(var f=0;f<e;f++)a[b+f]=c[d+f]},saveToFile:function(a,b){cc.log("saveToFile isn't supported on Cocos2d-Html5")},
listenToBackground:function(a){cc.log("listenToBackground isn't supported on Cocos2d-Html5")},listenToForeground:function(a){cc.log("listenToForeground isn't supported on Cocos2d-Html5")},getClearFlags:function(){return this.clearFlags},setClearFlags:function(a){this.clearFlags=a},getClearColor:function(){return this._clearColor},setClearColor:null,_setClearColorForCanvas:function(a){var b=this._clearColor;b.r=a.r;b.g=a.g;b.b=a.b;b.a=a.a;this._clearColorStr="rgba("+(0|a.r)+","+(0|a.g)+","+(0|a.b)+
","+a.a/255+")"},_setClearColorForWebGL:function(a){var b=this._clearColor;b.r=a.r;b.g=a.g;b.b=a.b;b.a=a.a},getClearDepth:function(){return this.clearDepthVal},setClearDepth:function(a){this.clearDepthVal=a},getClearStencil:function(){return this.clearStencilVal},setClearStencil:function(a){this.clearStencilVal=a},isAutoDraw:function(){return this.autoDraw},setAutoDraw:function(a){this.autoDraw=a}});var _p=cc.RenderTexture.prototype;
cc._renderType==cc._RENDER_TYPE_WEBGL?(_p.ctor=_p._ctorForWebGL,_p.cleanup=_p._cleanupForWebGL,_p.initWithWidthAndHeight=_p._initWithWidthAndHeightForWebGL,_p.begin=_p._beginForWebGL,_p._beginWithClear=_p._beginWithClearForWebGL,_p.end=_p._endForWebGL,_p.clearRect=_p._clearRectForWebGL,_p.clearDepth=_p._clearDepthForWebGL,_p.clearStencil=_p._clearStencilForWebGL,_p.visit=_p._visitForWebGL,_p.draw=_p._drawForWebGL,_p.setClearColor=_p._setClearColorForWebGL):(_p.ctor=_p._ctorForCanvas,_p.cleanup=_p._cleanupForCanvas,
_p.initWithWidthAndHeight=_p._initWithWidthAndHeightForCanvas,_p.begin=_p._beginForCanvas,_p._beginWithClear=_p._beginWithClearForCanvas,_p.end=_p._endForCanvas,_p.clearRect=_p._clearRectForCanvas,_p.clearDepth=_p._clearDepthForCanvas,_p.clearStencil=_p._clearStencilForCanvas,_p.visit=_p._visitForCanvas,_p.draw=_p._drawForCanvas,_p.setClearColor=_p._setClearColorForCanvas);cc.defineGetterSetter(_p,"clearColorVal",_p.getClearColor,_p.setClearColor);
cc.RenderTexture.create=function(a,b,c,d){return new cc.RenderTexture(a,b,c,d)};
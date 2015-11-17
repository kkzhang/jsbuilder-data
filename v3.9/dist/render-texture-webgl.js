!function(){cc.RenderTexture.WebGLRenderCmd=function(a){cc.Node.WebGLRenderCmd.call(this,a),this._needDraw=!0,this._fBO=null,this._oldFBO=null,this._textureCopy=null,this._depthRenderBuffer=null,this._rtTextureRect=new cc.Rect,this._fullRect=new cc.Rect,this._fullViewport=new cc.Rect};var a=cc.RenderTexture.WebGLRenderCmd.prototype=Object.create(cc.Node.WebGLRenderCmd.prototype);a.constructor=cc.RenderTexture.WebGLRenderCmd,a.setVirtualViewport=function(a,b,c){this._rtTextureRect.x=a.x,this._rtTextureRect.y=a.y,this._fullRect=b,this._fullViewport=c},a.rendering=function(a){var b=a||cc._renderContext,c=this._node;if(c.autoDraw){c.begin();var d=c.clearFlags;if(d){var e=[0,0,0,0],f=0,g=0;d&b.COLOR_BUFFER_BIT&&(e=b.getParameter(b.COLOR_CLEAR_VALUE),b.clearColor(c._clearColor.r/255,c._clearColor.g/255,c._clearColor.b/255,c._clearColor.a/255)),d&b.DEPTH_BUFFER_BIT&&(f=b.getParameter(b.DEPTH_CLEAR_VALUE),b.clearDepth(c.clearDepthVal)),d&b.STENCIL_BUFFER_BIT&&(g=b.getParameter(b.STENCIL_CLEAR_VALUE),b.clearStencil(c.clearStencilVal)),b.clear(d),d&b.COLOR_BUFFER_BIT&&b.clearColor(e[0],e[1],e[2],e[3]),d&b.DEPTH_BUFFER_BIT&&b.clearDepth(f),d&b.STENCIL_BUFFER_BIT&&b.clearStencil(g)}c.sortAllChildren();for(var h=c._children,i=0;i<h.length;i++){var j=h[i];j!==c.sprite&&j._renderCmd.visit(c.sprite._renderCmd)}c.end()}},a.clearStencil=function(a){var b=cc._renderContext,c=b.getParameter(b.STENCIL_CLEAR_VALUE);b.clearStencil(a),b.clear(b.STENCIL_BUFFER_BIT),b.clearStencil(c)},a.cleanup=function(){this._node;this._textureCopy=null;var a=cc._renderContext;a.deleteFramebuffer(this._fBO),this._depthRenderBuffer&&a.deleteRenderbuffer(this._depthRenderBuffer)},a.updateClearColor=function(a){},a.initWithWidthAndHeight=function(a,b,c,d){var e=this._node;c===cc.Texture2D.PIXEL_FORMAT_A8&&cc.log("cc.RenderTexture._initWithWidthAndHeightForWebGL() : only RGB and RGBA formats are valid for a render texture;");var f=cc._renderContext,g=cc.contentScaleFactor();this._fullRect=new cc.Rect(0,0,a,b),this._fullViewport=new cc.Rect(0,0,a,b),a=0|a*g,b=0|b*g,this._oldFBO=f.getParameter(f.FRAMEBUFFER_BINDING);var h,i;cc.configuration.supportsNPOT()?(h=a,i=b):(h=cc.NextPOT(a),i=cc.NextPOT(b));for(var j=h*i*4,k=new Uint8Array(j),l=0;h*i*4>l;l++)k[l]=0;this._pixelFormat=c;var m=e._texture=new cc.Texture2D;if(!e._texture)return!1;m.initWithData(k,e._pixelFormat,h,i,cc.size(a,b));var n=f.getParameter(f.RENDERBUFFER_BINDING);if(cc.configuration.checkForGLExtension("GL_QCOM")){if(this._textureCopy=new cc.Texture2D,!this._textureCopy)return!1;this._textureCopy.initWithData(k,e._pixelFormat,h,i,cc.size(a,b))}this._fBO=f.createFramebuffer(),f.bindFramebuffer(f.FRAMEBUFFER,this._fBO),f.framebufferTexture2D(f.FRAMEBUFFER,f.COLOR_ATTACHMENT0,f.TEXTURE_2D,m._webTextureObj,0),0!==d&&(this._depthRenderBuffer=f.createRenderbuffer(),f.bindRenderbuffer(f.RENDERBUFFER,this._depthRenderBuffer),f.renderbufferStorage(f.RENDERBUFFER,d,h,i),d===f.DEPTH_STENCIL?f.framebufferRenderbuffer(f.FRAMEBUFFER,f.DEPTH_STENCIL_ATTACHMENT,f.RENDERBUFFER,this._depthRenderBuffer):d===f.STENCIL_INDEX||d===f.STENCIL_INDEX8?f.framebufferRenderbuffer(f.FRAMEBUFFER,f.STENCIL_ATTACHMENT,f.RENDERBUFFER,this._depthRenderBuffer):d===f.DEPTH_COMPONENT16&&f.framebufferRenderbuffer(f.FRAMEBUFFER,f.DEPTH_ATTACHMENT,f.RENDERBUFFER,this._depthRenderBuffer)),f.checkFramebufferStatus(f.FRAMEBUFFER)!==f.FRAMEBUFFER_COMPLETE&&cc.log("Could not attach texture to the framebuffer"),m.setAliasTexParameters();var o=e.sprite=new cc.Sprite(m);return o.scaleY=-1,o.setBlendFunc(f.ONE,f.ONE_MINUS_SRC_ALPHA),f.bindRenderbuffer(f.RENDERBUFFER,n),f.bindFramebuffer(f.FRAMEBUFFER,this._oldFBO),e.autoDraw=!1,e.addChild(o),!0},a.begin=function(){var a=this._node;cc.kmGLMatrixMode(cc.KM_GL_PROJECTION),cc.kmGLPushMatrix(),cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW),cc.kmGLPushMatrix();var b=cc._renderContext,c=cc.director;c.setProjection(c.getProjection());var d=a._texture.getContentSizeInPixels(),e=cc.director.getWinSizeInPixels(),f=e.width/d.width,g=e.height/d.height,h=cc.math.Matrix4.createOrthographicProjection(-1/f,1/f,-1/g,1/g,-1,1);cc.kmGLMultMatrix(h);var i=new cc.Rect(0,0,0,0);i.width=this._fullViewport.width,i.height=this._fullViewport.height;var j=i.width/this._fullRect.width,k=i.height/this._fullRect.height;i.x=(this._fullRect.x-this._rtTextureRect.x)*j,i.y=(this._fullRect.y-this._rtTextureRect.y)*k,b.viewport(i.x,i.y,i.width,i.height),this._oldFBO=b.getParameter(b.FRAMEBUFFER_BINDING),b.bindFramebuffer(b.FRAMEBUFFER,this._fBO),cc.configuration.checkForGLExtension("GL_QCOM")&&(b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,this._textureCopy._webTextureObj,0),b.clear(b.COLOR_BUFFER_BIT|b.DEPTH_BUFFER_BIT),b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,a._texture._webTextureObj,0))},a._beginWithClear=function(a,b,c,d,e,f,g){a/=255,b/=255,c/=255,d/=255;var h=cc._renderContext,i=[0,0,0,0],j=0,k=0;g&h.COLOR_BUFFER_BIT&&(i=h.getParameter(h.COLOR_CLEAR_VALUE),h.clearColor(a,b,c,d)),g&h.DEPTH_BUFFER_BIT&&(j=h.getParameter(h.DEPTH_CLEAR_VALUE),h.clearDepth(e)),g&h.STENCIL_BUFFER_BIT&&(k=h.getParameter(h.STENCIL_CLEAR_VALUE),h.clearStencil(f)),h.clear(g),g&h.COLOR_BUFFER_BIT&&h.clearColor(i[0],i[1],i[2],i[3]),g&h.DEPTH_BUFFER_BIT&&h.clearDepth(j),g&h.STENCIL_BUFFER_BIT&&h.clearStencil(k)},a.end=function(){var a=this._node;cc.renderer._renderingToBuffer(a.__instanceId);var b=cc._renderContext,c=cc.director;b.bindFramebuffer(b.FRAMEBUFFER,this._oldFBO),c.setViewport(),cc.kmGLMatrixMode(cc.KM_GL_PROJECTION),cc.kmGLPopMatrix(),cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW),cc.kmGLPopMatrix()},a.clearRect=function(a,b,c,d){},a.clearDepth=function(a){var b=this._node;b.begin();var c=cc._renderContext,d=c.getParameter(c.DEPTH_CLEAR_VALUE);c.clearDepth(a),c.clear(c.DEPTH_BUFFER_BIT),c.clearDepth(d),b.end()},a.visit=function(a){var b=this._node;b._visible&&(cc.kmGLPushMatrix(),this._syncStatus(a),cc.renderer.pushRenderCommand(this),b.sprite.visit(this),this._dirtyFlag=0,cc.kmGLPopMatrix())}}();
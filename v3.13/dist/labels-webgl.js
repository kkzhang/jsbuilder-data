!function(){cc.LabelAtlas.WebGLRenderCmd=function(a){cc.AtlasNode.WebGLRenderCmd.call(this,a),this._needDraw=!0};var a=cc.LabelAtlas.WebGLRenderCmd.prototype=Object.create(cc.AtlasNode.WebGLRenderCmd.prototype);a.constructor=cc.LabelAtlas.WebGLRenderCmd,a._updateColor=function(){if(this._colorF32Array){var a=this._displayedColor,b=this._displayedOpacity/255;this._node._opacityModifyRGB?(this._colorF32Array[0]=a.r*b/255,this._colorF32Array[1]=a.g*b/255,this._colorF32Array[2]=a.b*b/255,this._colorF32Array[3]=b):(this._colorF32Array[0]=a.r/255,this._colorF32Array[1]=a.g/255,this._colorF32Array[2]=a.b/255,this._colorF32Array[3]=b)}},a.setCascade=function(){var a=this._node;a._cascadeOpacityEnabled=!0,a._cascadeColorEnabled=!0},a.rendering=function(a){if(cc.AtlasNode.WebGLRenderCmd.prototype.rendering.call(this,a),cc.LABELATLAS_DEBUG_DRAW){var b=this._node,c=b.getContentSize(),d=b.getBoundingBoxToWorld(),e=d.x,f=d.y;c.width=d.width,c.height=d.height;var g=[cc.p(e,f),cc.p(e+c.width,f),cc.p(c.width+e,c.height+f),cc.p(e,f+c.height)];cc._drawingUtil.drawPoly(g,4,!0)}},a.updateAtlasValues=function(){var a=this._node,b=a._string,c=b.length,d=this._textureAtlas,e=d.texture,f=e.pixelsWidth,g=e.pixelsHeight,h=a._itemWidth,i=a._itemHeight;a._ignoreContentScaleFactor||(h=a._itemWidth*cc.contentScaleFactor(),i=a._itemHeight*cc.contentScaleFactor()),c>d.getCapacity()&&cc.log("cc.LabelAtlas._updateAtlasValues(): Invalid String length");for(var j=d.quads,k=a._itemWidth,l=a._itemHeight,m=0,n=-1;m<c;m++){var o=b.charCodeAt(m)-a._mapStartChar.charCodeAt(0),p=o%a._itemsPerRow,q=0|o/a._itemsPerRow;if(!(p<0||q<0||p*k+k>f||q*l+l>g)){n++;var r,s,t,u;cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL?(r=(2*p*h+1)/(2*f),s=r+(2*h-2)/(2*f),t=(2*q*i+1)/(2*g),u=t+(2*i-2)/(2*g)):(r=p*h/f,s=r+h/f,t=q*i/g,u=t+i/g);var v=j[m],w=v.tl,x=v.tr,y=v.bl,z=v.br;w.texCoords.u=r,w.texCoords.v=t,x.texCoords.u=s,x.texCoords.v=t,y.texCoords.u=r,y.texCoords.v=u,z.texCoords.u=s,z.texCoords.v=u,y.vertices.x=n*k,y.vertices.y=0,y.vertices.z=0,z.vertices.x=n*k+k,z.vertices.y=0,z.vertices.z=0,w.vertices.x=n*k,w.vertices.y=a._itemHeight,w.vertices.z=0,x.vertices.x=n*k+k,x.vertices.y=a._itemHeight,x.vertices.z=0}}if(this._updateColor(),this.updateContentSize(m,n+1),c>0){d.dirty=!0;var A=d.totalQuads;c>A&&d.increaseTotalQuadsWith(c-A)}},a.updateContentSize=function(a,b){var c=this._node,d=c._contentSize;a!==b&&a*c._itemWidth===d.width&&c._itemHeight===d.height&&c.setContentSize(b*c._itemWidth,c._itemHeight)},a.setString=function(a){var b=a.length;b>this._textureAtlas.totalQuads&&this._textureAtlas.resizeCapacity(b)},a._addChild=function(){}}(),function(){cc.LabelBMFont.WebGLRenderCmd=function(a){cc.Node.WebGLRenderCmd.call(this,a)};var a=cc.LabelBMFont.WebGLRenderCmd.prototype=Object.create(cc.Node.WebGLRenderCmd.prototype);a.constructor=cc.LabelBMFont.WebGLRenderCmd,a.setTexture=function(a){this._node.setOpacityModifyRGB(this._node._texture.hasPremultipliedAlpha())},a._updateCharTexture=function(a,b,c){a.setTextureRect(b,!1),a.visible=!0},a._changeTextureColor=function(){},a._updateCharColorAndOpacity=function(){}}();
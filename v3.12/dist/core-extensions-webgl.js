!function(){cc.AtlasNode.WebGLRenderCmd=function(a){cc.Node.WebGLRenderCmd.call(this,a),this._needDraw=!0,this._textureAtlas=null,this._colorUnmodified=cc.color.WHITE,this._colorF32Array=null,this._uniformColor=null,this._matrix=new cc.math.Matrix4,this._matrix.identity(),this._shaderProgram=cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURE_UCOLOR),this._uniformColor=cc._renderContext.getUniformLocation(this._shaderProgram.getProgram(),"u_color")};var a=cc.AtlasNode.WebGLRenderCmd.prototype=Object.create(cc.Node.WebGLRenderCmd.prototype);a.constructor=cc.AtlasNode.WebGLRenderCmd,a._updateBlendFunc=function(){var a=this._node;this._textureAtlas.texture.hasPremultipliedAlpha()||(a._blendFunc.src=cc.SRC_ALPHA,a._blendFunc.dst=cc.ONE_MINUS_SRC_ALPHA)},a._updateOpacityModifyRGB=function(){this._node._opacityModifyRGB=this._textureAtlas.texture.hasPremultipliedAlpha()},a.rendering=function(a){var b=a||cc._renderContext,c=this._node,d=this._worldTransform;this._matrix.mat[0]=d.a,this._matrix.mat[4]=d.c,this._matrix.mat[12]=d.tx,this._matrix.mat[1]=d.b,this._matrix.mat[5]=d.d,this._matrix.mat[13]=d.ty,this._shaderProgram.use(),this._shaderProgram._setUniformForMVPMatrixWithMat4(this._matrix),cc.glBlendFunc(c._blendFunc.src,c._blendFunc.dst),this._uniformColor&&this._colorF32Array&&(b.uniform4fv(this._uniformColor,this._colorF32Array),this._textureAtlas.drawNumberOfQuads(c.quadsToDraw,0))},a.initWithTexture=function(a,b,c,d){var e=this._node;e._itemWidth=b,e._itemHeight=c,this._colorUnmodified=cc.color.WHITE,e._opacityModifyRGB=!0,e._blendFunc.src=cc.BLEND_SRC,e._blendFunc.dst=cc.BLEND_DST;var f=e._realColor;return this._colorF32Array=new Float32Array([f.r/255,f.g/255,f.b/255,e._realOpacity/255]),this._textureAtlas=new cc.TextureAtlas,this._textureAtlas.initWithTexture(a,d),this._textureAtlas?(this._updateBlendFunc(),this._updateOpacityModifyRGB(),this._calculateMaxItems(),e.quadsToDraw=d,!0):(cc.log(cc._LogInfos.AtlasNode__initWithTexture),!1)},a.setColor=function(a){var b=cc.color(a.r,a.g,a.b),c=this._node;this._colorUnmodified=a;var d=this._displayedOpacity;c._opacityModifyRGB&&(b.r=b.r*d/255,b.g=b.g*d/255,b.b=b.b*d/255),cc.Node.prototype.setColor.call(c,b)},a.setOpacity=function(a){var b=this._node;cc.Node.prototype.setOpacity.call(b,a),b._opacityModifyRGB&&(b.color=this._colorUnmodified)},a._updateColor=function(){if(this._colorF32Array){var a=this._displayedColor;this._colorF32Array[0]=a.r/255,this._colorF32Array[1]=a.g/255,this._colorF32Array[2]=a.b/255,this._colorF32Array[3]=this._displayedOpacity/255}},a.getTexture=function(){return this._textureAtlas.texture},a.setTexture=function(a){this._textureAtlas.texture=a,this._updateBlendFunc(),this._updateOpacityModifyRGB()},a._calculateMaxItems=function(){var a=this._node,b=this._textureAtlas.texture,c=b.getContentSize();a._ignoreContentScaleFactor&&(c=b.getContentSizeInPixels()),a._itemsPerColumn=0|c.height/a._itemHeight,a._itemsPerRow=0|c.width/a._itemWidth}}();
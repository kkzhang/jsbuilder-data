cc.MotionStreak=cc.Node.extend({texture:null,fastMode:!1,startingPositionInitialized:!1,_blendFunc:null,_stroke:0,_fadeDelta:0,_minSeg:0,_maxPoints:0,_nuPoints:0,_previousNuPoints:0,_pointVertexes:null,_pointState:null,_vertices:null,_colorPointer:null,_texCoords:null,_verticesBuffer:null,_colorPointerBuffer:null,_texCoordsBuffer:null,_className:"MotionStreak",ctor:function(a,b,c,d,e){cc.Node.prototype.ctor.call(this),this._positionR=cc.p(0,0),this._blendFunc=new cc.BlendFunc(cc.SRC_ALPHA,cc.ONE_MINUS_SRC_ALPHA),this.fastMode=!1,this.startingPositionInitialized=!1,this.texture=null,this._stroke=0,this._fadeDelta=0,this._minSeg=0,this._maxPoints=0,this._nuPoints=0,this._previousNuPoints=0,this._pointVertexes=null,this._pointState=null,this._vertices=null,this._colorPointer=null,this._texCoords=null,this._verticesBuffer=null,this._colorPointerBuffer=null,this._texCoordsBuffer=null,void 0!==e&&this.initWithFade(a,b,c,d,e)},getTexture:function(){return this.texture},setTexture:function(a){this.texture!==a&&(this.texture=a)},getBlendFunc:function(){return this._blendFunc},setBlendFunc:function(a,b){void 0===b?this._blendFunc=a:(this._blendFunc.src=a,this._blendFunc.dst=b)},getOpacity:function(){return cc.log("cc.MotionStreak.getOpacity has not been supported."),0},setOpacity:function(a){cc.log("cc.MotionStreak.setOpacity has not been supported.")},setOpacityModifyRGB:function(a){},isOpacityModifyRGB:function(){return!1},isFastMode:function(){return this.fastMode},setFastMode:function(a){this.fastMode=a},isStartingPositionInitialized:function(){return this.startingPositionInitialized},setStartingPositionInitialized:function(a){this.startingPositionInitialized=a},getStroke:function(){return this._stroke},setStroke:function(a){this._stroke=a},initWithFade:function(a,b,c,d,e){if(!e)throw new Error("cc.MotionStreak.initWithFade(): Invalid filename or texture");cc.isString(e)&&(e=cc.textureCache.addImage(e)),cc.Node.prototype.setPosition.call(this,cc.p(0,0)),this.anchorX=0,this.anchorY=0,this.ignoreAnchor=!0,this.startingPositionInitialized=!1,this.fastMode=!0,this._minSeg=b===-1?c/5:b,this._minSeg*=this._minSeg,this._stroke=c,this._fadeDelta=1/a;var f=(0|60*a)+2;return this._maxPoints=f,this._nuPoints=0,this._pointState=new Float32Array(f),this._pointVertexes=new Float32Array(2*f),this._vertices=new Float32Array(4*f),this._texCoords=new Float32Array(4*f),this._colorPointer=new Uint8Array(8*f),this._verticesBuffer=gl.createBuffer(),this._texCoordsBuffer=gl.createBuffer(),this._colorPointerBuffer=gl.createBuffer(),this._blendFunc.src=gl.SRC_ALPHA,this._blendFunc.dst=gl.ONE_MINUS_SRC_ALPHA,this.texture=e,this.color=d,this.scheduleUpdate(),gl.bindBuffer(gl.ARRAY_BUFFER,this._verticesBuffer),gl.bufferData(gl.ARRAY_BUFFER,this._vertices,gl.DYNAMIC_DRAW),gl.bindBuffer(gl.ARRAY_BUFFER,this._texCoordsBuffer),gl.bufferData(gl.ARRAY_BUFFER,this._texCoords,gl.DYNAMIC_DRAW),gl.bindBuffer(gl.ARRAY_BUFFER,this._colorPointerBuffer),gl.bufferData(gl.ARRAY_BUFFER,this._colorPointer,gl.DYNAMIC_DRAW),!0},tintWithColor:function(a){this.color=a;for(var b=this._colorPointer,c=0,d=2*this._nuPoints;c<d;c++)b[4*c]=a.r,b[4*c+1]=a.g,b[4*c+2]=a.b},reset:function(){this._nuPoints=0},setPosition:function(a,b){this.startingPositionInitialized=!0,void 0===b?(this._positionR.x=a.x,this._positionR.y=a.y):(this._positionR.x=a,this._positionR.y=b)},getPositionX:function(){return this._positionR.x},setPositionX:function(a){this._positionR.x=a,this.startingPositionInitialized||(this.startingPositionInitialized=!0)},getPositionY:function(){return this._positionR.y},setPositionY:function(a){this._positionR.y=a,this.startingPositionInitialized||(this.startingPositionInitialized=!0)},update:function(a){if(this.startingPositionInitialized){this._renderCmd._updateDisplayColor(),a*=this._fadeDelta;var b,c,d,e,f=0,g=this._nuPoints,h=this._pointState,i=this._pointVertexes,j=this._vertices,k=this._colorPointer;for(d=0;d<g;d++)if(h[d]-=a,h[d]<=0)f++;else{b=d-f,f>0?(h[b]=h[d],i[2*b]=i[2*d],i[2*b+1]=i[2*d+1],e=2*d,c=2*b,j[2*c]=j[2*e],j[2*c+1]=j[2*e+1],j[2*(c+1)]=j[2*(e+1)],j[2*(c+1)+1]=j[2*(e+1)+1],e*=4,c*=4,k[c+0]=k[e+0],k[c+1]=k[e+1],k[c+2]=k[e+2],k[c+4]=k[e+4],k[c+5]=k[e+5],k[c+6]=k[e+6]):c=8*b;var l=255*h[b];k[c+3]=l,k[c+7]=l}g-=f;var m=!0;if(g>=this._maxPoints)m=!1;else if(g>0){var n=cc.pDistanceSQ(cc.p(i[2*(g-1)],i[2*(g-1)+1]),this._positionR)<this._minSeg,o=1!==g&&cc.pDistanceSQ(cc.p(i[2*(g-2)],i[2*(g-2)+1]),this._positionR)<2*this._minSeg;(n||o)&&(m=!1)}if(m){i[2*g]=this._positionR.x,i[2*g+1]=this._positionR.y,h[g]=1;var p=8*g,q=this.getDisplayedColor();k[p]=q.r,k[p+1]=q.g,k[p+2]=q.b,k[p+4]=q.r,k[p+5]=q.g,k[p+6]=q.b,k[p+3]=255,k[p+7]=255,g>0&&this.fastMode&&(g>1?cc.vertexLineToPolygon(i,this._stroke,this._vertices,g,1):cc.vertexLineToPolygon(i,this._stroke,this._vertices,0,2)),g++}if(this.fastMode||cc.vertexLineToPolygon(i,this._stroke,this._vertices,0,g),g&&this._previousNuPoints!==g){var r=1/g,s=this._texCoords;for(d=0;d<g;d++)s[4*d]=0,s[4*d+1]=r*d,s[2*(2*d+1)]=1,s[2*(2*d+1)+1]=r*d;this._previousNuPoints=g}this._nuPoints=g}},_createRenderCmd:function(){return cc._renderType===cc.game.RENDER_TYPE_WEBGL?new cc.MotionStreak.WebGLRenderCmd(this):null}}),cc.MotionStreak.create=function(a,b,c,d,e){return new cc.MotionStreak(a,b,c,d,e)},cc.MotionStreak.WebGLRenderCmd=function(a){cc.Node.WebGLRenderCmd.call(this,a),this._needDraw=!0,this._matrix=new cc.math.Matrix4,this._matrix.identity(),this._shaderProgram=cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR)},cc.MotionStreak.WebGLRenderCmd.prototype=Object.create(cc.Node.WebGLRenderCmd.prototype),cc.MotionStreak.WebGLRenderCmd.prototype.constructor=cc.Sprite.WebGLRenderCmd,cc.MotionStreak.WebGLRenderCmd.prototype.rendering=function(a){var b=this._node;if(!(b._nuPoints<=1)&&b.texture&&b.texture.isLoaded()){a=a||cc._renderContext;var c=this._worldTransform;this._matrix.mat[0]=c.a,this._matrix.mat[4]=c.c,this._matrix.mat[12]=c.tx,this._matrix.mat[1]=c.b,this._matrix.mat[5]=c.d,this._matrix.mat[13]=c.ty,this._shaderProgram.use(),this._shaderProgram._setUniformForMVPMatrixWithMat4(this._matrix),cc.glBlendFunc(b._blendFunc.src,b._blendFunc.dst),cc.glBindTexture2D(b.texture),a.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION),a.enableVertexAttribArray(cc.VERTEX_ATTRIB_COLOR),a.enableVertexAttribArray(cc.VERTEX_ATTRIB_TEX_COORDS),a.bindBuffer(a.ARRAY_BUFFER,b._verticesBuffer),a.bufferData(a.ARRAY_BUFFER,b._vertices,a.DYNAMIC_DRAW),a.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION,2,a.FLOAT,!1,0,0),a.bindBuffer(a.ARRAY_BUFFER,b._texCoordsBuffer),a.bufferData(a.ARRAY_BUFFER,b._texCoords,a.DYNAMIC_DRAW),a.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS,2,a.FLOAT,!1,0,0),a.bindBuffer(a.ARRAY_BUFFER,b._colorPointerBuffer),a.bufferData(a.ARRAY_BUFFER,b._colorPointer,a.DYNAMIC_DRAW),a.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR,4,a.UNSIGNED_BYTE,!0,0,0),a.drawArrays(a.TRIANGLE_STRIP,0,2*b._nuPoints),cc.g_NumberOfDraws++}};
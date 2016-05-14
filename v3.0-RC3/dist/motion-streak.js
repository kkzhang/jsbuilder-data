cc.MotionStreak=cc.Node.extend({texture:null,fastMode:!1,startingPositionInitialized:!1,_blendFunc:null,_stroke:0,_fadeDelta:0,_minSeg:0,_maxPoints:0,_nuPoints:0,_previousNuPoints:0,_pointVertexes:null,_pointState:null,_vertices:null,_colorPointer:null,_texCoords:null,_verticesBuffer:null,_colorPointerBuffer:null,_texCoordsBuffer:null,_className:"MotionStreak",ctor:function(a,b,c,d,e){cc.Node.prototype.ctor.call(this),this._positionR=cc.p(0,0),this._blendFunc=new cc.BlendFunc(cc.SRC_ALPHA,cc.ONE_MINUS_SRC_ALPHA),this._vertexWebGLBuffer=cc._renderContext.createBuffer(),this.fastMode=!1,this.startingPositionInitialized=!1,this.texture=null,this._stroke=0,this._fadeDelta=0,this._minSeg=0,this._maxPoints=0,this._nuPoints=0,this._previousNuPoints=0,this._pointVertexes=null,this._pointState=null,this._vertices=null,this._colorPointer=null,this._texCoords=null,this._verticesBuffer=null,this._colorPointerBuffer=null,this._texCoordsBuffer=null,void 0!==e&&this.initWithFade(a,b,c,d,e)},getTexture:function(){return this.texture},setTexture:function(a){this.texture!=a&&(this.texture=a)},getBlendFunc:function(){return this._blendFunc},setBlendFunc:function(a,b){void 0===b?this._blendFunc=a:(this._blendFunc.src=a,this._blendFunc.dst=b)},getOpacity:function(){return cc.log("cc.MotionStreak.getOpacity has not been supported."),0},setOpacity:function(){cc.log("cc.MotionStreak.setOpacity has not been supported.")},setOpacityModifyRGB:function(){},isOpacityModifyRGB:function(){return!1},onExit:function(){cc.Node.prototype.onExit.call(this),this._verticesBuffer&&cc._renderContext.deleteBuffer(this._verticesBuffer),this._texCoordsBuffer&&cc._renderContext.deleteBuffer(this._texCoordsBuffer),this._colorPointerBuffer&&cc._renderContext.deleteBuffer(this._colorPointerBuffer)},isFastMode:function(){return this.fastMode},setFastMode:function(a){this.fastMode=a},isStartingPositionInitialized:function(){return this.startingPositionInitialized},setStartingPositionInitialized:function(a){this.startingPositionInitialized=a},initWithFade:function(a,b,c,d,e){if(!e)throw"cc.MotionStreak.initWithFade(): Invalid filename or texture";"string"==typeof e&&(e=cc.textureCache.addImage(e)),cc.Node.prototype.setPosition.call(this,cc.p(0,0)),this.anchorX=0,this.anchorY=0,this.ignoreAnchor=!0,this.startingPositionInitialized=!1,this.fastMode=!0,this._minSeg=-1==b?c/5:b,this._minSeg*=this._minSeg,this._stroke=c,this._fadeDelta=1/a;var f=(0|60*a)+2;this._nuPoints=0,this._pointState=new Float32Array(f),this._pointVertexes=new Float32Array(2*f),this._vertices=new Float32Array(4*f),this._texCoords=new Float32Array(4*f),this._colorPointer=new Uint8Array(8*f),this._maxPoints=f;var g=cc._renderContext;return this._verticesBuffer=g.createBuffer(),this._texCoordsBuffer=g.createBuffer(),this._colorPointerBuffer=g.createBuffer(),this._blendFunc.src=g.SRC_ALPHA,this._blendFunc.dst=g.ONE_MINUS_SRC_ALPHA,this.shaderProgram=cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR),this.texture=e,this.color=d,this.scheduleUpdate(),g.bindBuffer(g.ARRAY_BUFFER,this._verticesBuffer),g.bufferData(g.ARRAY_BUFFER,this._vertices,g.DYNAMIC_DRAW),g.bindBuffer(g.ARRAY_BUFFER,this._texCoordsBuffer),g.bufferData(g.ARRAY_BUFFER,this._texCoords,g.DYNAMIC_DRAW),g.bindBuffer(g.ARRAY_BUFFER,this._colorPointerBuffer),g.bufferData(g.ARRAY_BUFFER,this._colorPointer,g.DYNAMIC_DRAW),!0},tintWithColor:function(a){this.color=a;for(var b=this._colorPointer,c=0,d=2*this._nuPoints;d>c;c++)b[4*c]=a.r,b[4*c+1]=a.g,b[4*c+2]=a.b},reset:function(){this._nuPoints=0},setPosition:function(a,b){this.startingPositionInitialized=!0,void 0===b?(this._positionR.x=a.x,this._positionR.y=a.y):(this._positionR.x=a,this._positionR.y=b)},getPositionX:function(){return this._positionR.x},setPositionX:function(a){this._positionR.x=a,this.startingPositionInitialized||(this.startingPositionInitialized=!0)},getPositionY:function(){return this._positionR.y},setPositionY:function(a){this._positionR.y=a,this.startingPositionInitialized||(this.startingPositionInitialized=!0)},draw:function(a){this._nuPoints<=1||this.texture&&this.texture.isLoaded()&&(a=a||cc._renderContext,cc.nodeDrawSetup(this),cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX),cc.glBlendFunc(this._blendFunc.src,this._blendFunc.dst),cc.glBindTexture2D(this.texture),a.bindBuffer(a.ARRAY_BUFFER,this._verticesBuffer),a.bufferData(a.ARRAY_BUFFER,this._vertices,a.DYNAMIC_DRAW),a.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION,2,a.FLOAT,!1,0,0),a.bindBuffer(a.ARRAY_BUFFER,this._texCoordsBuffer),a.bufferData(a.ARRAY_BUFFER,this._texCoords,a.DYNAMIC_DRAW),a.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS,2,a.FLOAT,!1,0,0),a.bindBuffer(a.ARRAY_BUFFER,this._colorPointerBuffer),a.bufferData(a.ARRAY_BUFFER,this._colorPointer,a.DYNAMIC_DRAW),a.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR,4,a.UNSIGNED_BYTE,!0,0,0),a.drawArrays(a.TRIANGLE_STRIP,0,2*this._nuPoints),cc.g_NumberOfDraws++)},update:function(a){if(this.startingPositionInitialized){a*=this._fadeDelta;var b,c,d,e,f=0,g=this._nuPoints,h=this._pointState,i=this._pointVertexes,j=this._vertices,k=this._colorPointer;for(d=0;g>d;d++)if(h[d]-=a,h[d]<=0)f++;else{b=d-f,f>0?(h[b]=h[d],i[2*b]=i[2*d],i[2*b+1]=i[2*d+1],e=2*d,c=2*b,j[2*c]=j[2*e],j[2*c+1]=j[2*e+1],j[2*(c+1)]=j[2*(e+1)],j[2*(c+1)+1]=j[2*(e+1)+1],e*=4,c*=4,k[c+0]=k[e+0],k[c+1]=k[e+1],k[c+2]=k[e+2],k[c+4]=k[e+4],k[c+5]=k[e+5],k[c+6]=k[e+6]):c=8*b;var l=255*h[b];k[c+3]=l,k[c+7]=l}g-=f;var m=!0;if(g>=this._maxPoints)m=!1;else if(g>0){var n=cc.pDistanceSQ(cc.p(i[2*(g-1)],i[2*(g-1)+1]),this._positionR)<this._minSeg,o=1==g?!1:cc.pDistanceSQ(cc.p(i[2*(g-2)],i[2*(g-2)+1]),this._positionR)<2*this._minSeg;(n||o)&&(m=!1)}if(m){i[2*g]=this._positionR.x,i[2*g+1]=this._positionR.y,h[g]=1;var p=8*g,q=this._displayedColor;k[p]=q.r,k[p+1]=q.g,k[p+2]=q.b,k[p+4]=q.r,k[p+5]=q.g,k[p+6]=q.b,k[p+3]=255,k[p+7]=255,g>0&&this.fastMode&&(g>1?cc.vertexLineToPolygon(i,this._stroke,this._vertices,g,1):cc.vertexLineToPolygon(i,this._stroke,this._vertices,0,2)),g++}if(this.fastMode||cc.vertexLineToPolygon(i,this._stroke,this._vertices,0,g),g&&this._previousNuPoints!=g){var r=1/g,s=this._texCoords;for(d=0;g>d;d++)s[4*d]=0,s[4*d+1]=r*d,s[2*(2*d+1)]=1,s[2*(2*d+1)+1]=r*d;this._previousNuPoints=g}this._nuPoints=g}}}),cc.MotionStreak.create=function(a,b,c,d,e){return new cc.MotionStreak(a,b,c,d,e)};
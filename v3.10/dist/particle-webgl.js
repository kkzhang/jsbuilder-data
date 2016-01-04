!function(){cc.ParticleBatchNode.WebGLRenderCmd=function(a){cc.Node.WebGLRenderCmd.call(this,a),this._needDraw=!0};var a=cc.ParticleBatchNode.WebGLRenderCmd.prototype=Object.create(cc.Node.WebGLRenderCmd.prototype);a.constructor=cc.ParticleBatchNode.WebGLRenderCmd,a.rendering=function(a){var b=this._node;0!==b.textureAtlas.totalQuads&&(this._shaderProgram.use(),this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix),cc.glBlendFuncForParticle(b._blendFunc.src,b._blendFunc.dst),b.textureAtlas.drawQuads())},a._initWithTexture=function(){this._shaderProgram=cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR)},a.visit=function(a){var b=this._node;if(b._visible){var c=cc.current_stack;c.stack.push(c.top),this._syncStatus(a),c.top=this._stackMatrix,cc.renderer.pushRenderCommand(this),this._dirtyFlag=0,cc.kmGLPopMatrix()}}}(),function(){cc.ParticleSystem.WebGLRenderCmd=function(a){cc.Node.WebGLRenderCmd.call(this,a),this._needDraw=!0,this._buffersVBO=[0,0],this._quads=[],this._indices=[],this._quadsArrayBuffer=null};var a=cc.ParticleSystem.WebGLRenderCmd.prototype=Object.create(cc.Node.WebGLRenderCmd.prototype);a.constructor=cc.ParticleSystem.WebGLRenderCmd,a.getDrawMode=function(){},a.setDrawMode=function(a){},a.getShapeType=function(){},a.setShapeType=function(a){},a.setBatchNode=function(a){var b=this._node;if(b._batchNode!==a){var c=b._batchNode;if(b._batchNode=a,a)for(var d=b._particles,e=0;e<b._totalParticles;e++)d[e].atlasIndex=e;a?c||(b._batchNode.textureAtlas._copyQuadsToTextureAtlas(this._quads,b.atlasIndex),cc._renderContext.deleteBuffer(this._buffersVBO[1])):(this._allocMemory(),this.initIndices(b._totalParticles),b.setTexture(c.getTexture()),this._setupVBO())}},a.initIndices=function(a){for(var b=this._indices,c=0,d=a;d>c;++c){var e=6*c,f=4*c;b[e+0]=f+0,b[e+1]=f+1,b[e+2]=f+2,b[e+5]=f+1,b[e+4]=f+2,b[e+3]=f+3}},a.isDifferentTexture=function(a,b){return a===b},a.updateParticlePosition=function(a,b){this.updateQuadWithParticle(a,b)},a.updateQuadWithParticle=function(a,b){var c=null,d=this._node;if(d._batchNode){var e=d._batchNode.textureAtlas.quads;c=e[d.atlasIndex+a.atlasIndex],d._batchNode.textureAtlas.dirty=!0}else c=this._quads[d._particleIdx];var f,g,h,i;d._opacityModifyRGB?(f=0|a.color.r*a.color.a/255,g=0|a.color.g*a.color.a/255,h=0|a.color.b*a.color.a/255):(f=0|a.color.r,g=0|a.color.g,h=0|a.color.b),i=0|a.color.a;var j=c.bl.colors,k=c.br.colors,l=c.tl.colors,m=c.tr.colors;j.r=k.r=l.r=m.r=f,j.g=k.g=l.g=m.g=g,j.b=k.b=l.b=m.b=h,j.a=k.a=l.a=m.a=i;var n=a.size/2;if(a.rotation){var o=-n,p=-n,q=n,r=n,s=b.x,t=b.y,u=-cc.degreesToRadians(a.rotation),v=Math.cos(u),w=Math.sin(u),x=o*v-p*w+s,y=o*w+p*v+t,z=q*v-p*w+s,A=q*w+p*v+t,B=q*v-r*w+s,C=q*w+r*v+t,D=o*v-r*w+s,E=o*w+r*v+t;c.bl.vertices.x=x,c.bl.vertices.y=y,c.br.vertices.x=z,c.br.vertices.y=A,c.tl.vertices.x=D,c.tl.vertices.y=E,c.tr.vertices.x=B,c.tr.vertices.y=C}else c.bl.vertices.x=b.x-n,c.bl.vertices.y=b.y-n,c.br.vertices.x=b.x+n,c.br.vertices.y=b.y-n,c.tl.vertices.x=b.x-n,c.tl.vertices.y=b.y+n,c.tr.vertices.x=b.x+n,c.tr.vertices.y=b.y+n},a.rendering=function(a){var b=this._node;if(b._texture){var c=a||cc._renderContext;this._shaderProgram.use(),this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix),cc.glBindTexture2D(b._texture),cc.glBlendFuncForParticle(b._blendFunc.src,b._blendFunc.dst),cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX),c.bindBuffer(c.ARRAY_BUFFER,this._buffersVBO[0]),c.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION,3,c.FLOAT,!1,24,0),c.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR,4,c.UNSIGNED_BYTE,!0,24,12),c.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS,2,c.FLOAT,!1,24,16),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,this._buffersVBO[1]),c.drawElements(c.TRIANGLES,6*b._particleIdx,c.UNSIGNED_SHORT,0)}},a.initTexCoordsWithRect=function(a){var b=this._node,c=b.texture,d=cc.contentScaleFactor(),e=cc.rect(a.x*d,a.y*d,a.width*d,a.height*d),f=a.width,g=a.height;c&&(f=c.pixelsWidth,g=c.pixelsHeight);var h,i,j,k;cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL?(h=(2*e.x+1)/(2*f),i=(2*e.y+1)/(2*g),j=h+(2*e.width-2)/(2*f),k=i+(2*e.height-2)/(2*g)):(h=e.x/f,i=e.y/g,j=h+e.width/f,k=i+e.height/g);var l=k;k=i,i=l;var m,n=0,o=0;b._batchNode?(m=b._batchNode.textureAtlas.quads,n=b.atlasIndex,o=b.atlasIndex+b._totalParticles):(m=this._quads,n=0,o=b._totalParticles);for(var p=n;o>p;p++){m[p]||(m[p]=cc.V3F_C4B_T2F_QuadZero());var q=m[p];q.bl.texCoords.u=h,q.bl.texCoords.v=i,q.br.texCoords.u=j,q.br.texCoords.v=i,q.tl.texCoords.u=h,q.tl.texCoords.v=k,q.tr.texCoords.u=j,q.tr.texCoords.v=k}},a.setTotalParticles=function(a){var b=this._node;if(a>b._allocatedParticles){var c=cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;this._indices=new Uint16Array(6*a);var d=new ArrayBuffer(a*c),e=b._particles;e.length=0;var f=this._quads;f.length=0;for(var g=0;a>g;g++)e[g]=new cc.Particle,f[g]=new cc.V3F_C4B_T2F_Quad(null,null,null,null,d,g*c);if(b._allocatedParticles=a,b._totalParticles=a,b._batchNode)for(var h=0;a>h;h++)e[h].atlasIndex=h;this._quadsArrayBuffer=d,this.initIndices(a),this._setupVBO(),b._texture&&this.initTexCoordsWithRect(cc.rect(0,0,b._texture.width,b._texture.height))}else b._totalParticles=a;b.resetSystem()},a.addParticle=function(){var a=this._node,b=a._particles;return b[a.particleCount]},a._setupVBO=function(){var a=cc._renderContext;this._buffersVBO[0]=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,this._buffersVBO[0]),a.bufferData(a.ARRAY_BUFFER,this._quadsArrayBuffer,a.DYNAMIC_DRAW),this._buffersVBO[1]=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this._buffersVBO[1]),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this._indices,a.STATIC_DRAW)},a._allocMemory=function(){var a=this._node;if(a._batchNode)return cc.log("cc.ParticleSystem._allocMemory(): Memory should not be allocated when not using batchNode"),!1;var b=cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,c=a._totalParticles,d=this._quads;d.length=0,this._indices=new Uint16Array(6*c);for(var e=new ArrayBuffer(b*c),f=0;c>f;f++)d[f]=new cc.V3F_C4B_T2F_Quad(null,null,null,null,e,f*b);return d&&this._indices?(this._quadsArrayBuffer=e,!0):(cc.log("cocos2d: Particle system: not enough memory"),!1)},a.postStep=function(){var a=cc._renderContext;a.bindBuffer(a.ARRAY_BUFFER,this._buffersVBO[0]),a.bufferData(a.ARRAY_BUFFER,this._quadsArrayBuffer,a.DYNAMIC_DRAW)},a._setBlendAdditive=function(){var a=this._node._blendFunc;this._texture&&!this._texture.hasPremultipliedAlpha()?(a.src=cc.SRC_ALPHA,a.dst=cc.ONE_MINUS_SRC_ALPHA):(a.src=cc.BLEND_SRC,a.dst=cc.BLEND_DST)},a._initWithTotalParticles=function(a){return this._allocMemory()?(this.initIndices(a),this._setupVBO(),void(this._shaderProgram=cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR))):!1},a._updateDeltaColor=function(a,b){a.color.r+=a.deltaColor.r*b,a.color.g+=a.deltaColor.g*b,a.color.b+=a.deltaColor.b*b,a.color.a+=a.deltaColor.a*b,a.isChangeColor=!0}}();
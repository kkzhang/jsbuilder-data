!function(){sp.Skeleton.WebGLRenderCmd=function(a){cc.Node.WebGLRenderCmd.call(this,a),this._needDraw=!0,this._matrix=new cc.math.Matrix4,this._matrix.identity(),this._tmpQuad=new cc.V3F_C4B_T2F_Quad,this.setShaderProgram(cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR))};var a=sp.Skeleton.WebGLRenderCmd.prototype=Object.create(cc.Node.WebGLRenderCmd.prototype);a.constructor=sp.Skeleton.WebGLRenderCmd,a.rendering=function(a){var b,c,d,e,f,g,h=this._node,i=this._tmpQuad,j=h.getColor(),k=h._skeleton,l=h._blendFunc,m=h._premultipliedAlpha,n=this._worldTransform;for(this._matrix.mat[0]=n.a,this._matrix.mat[4]=n.c,this._matrix.mat[12]=n.tx,this._matrix.mat[1]=n.b,this._matrix.mat[5]=n.d,this._matrix.mat[13]=n.ty,this._shaderProgram.use(),this._shaderProgram._setUniformForMVPMatrixWithMat4(this._matrix),k.r=j.r/255,k.g=j.g/255,k.b=j.b/255,k.a=h.getOpacity()/255,m&&(k.r*=k.a,k.g*=k.a,k.b*=k.a),f=0,g=k.drawOrder.length;g>f;f++)if(e=k.drawOrder[f],e.attachment){switch(d=e.attachment,e.attachment.type){case sp.ATTACHMENT_TYPE.REGION:this._updateRegionAttachmentQuad(d,e,i,m);break;case sp.ATTACHMENT_TYPE.MESH:this._updateMeshAttachmentQuad(d,e,i,m);break;case sp.ATTACHMENT_TYPE.SKINNED_MESH:break;default:continue}var o=h.getTextureAtlas(d);if(e.data.blendMode!=b)switch(c&&(c.drawQuads(),c.removeAllQuads()),b=e.data.blendMode){case spine.BlendMode.additive:cc.glBlendFunc(m?cc.ONE:cc.SRC_ALPHA,cc.ONE);break;case spine.BlendMode.multiply:cc.glBlendFunc(cc.DST_COLOR,cc.ONE_MINUS_SRC_ALPHA);break;case spine.BlendMode.screen:cc.glBlendFunc(cc.ONE,cc.ONE_MINUS_SRC_COLOR);break;default:cc.glBlendFunc(l.src,l.dst)}else o!=c&&c&&(c.drawQuads(),c.removeAllQuads());c=o;var p=c.getTotalQuads();if(c.getCapacity()==p&&(c.drawQuads(),c.removeAllQuads(),!c.resizeCapacity(2*c.getCapacity())))return;c.updateQuad(i,p)}if(c&&(c.drawQuads(),c.removeAllQuads()),h._debugBones||h._debugSlots){cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW),cc.current_stack.stack.push(cc.current_stack.top),cc.current_stack.top=this._matrix;var q=cc._drawingUtil;if(h._debugSlots)for(q.setDrawColor(0,0,255,255),q.setLineWidth(1),f=0,g=k.slots.length;g>f;f++)if(e=k.drawOrder[f],e.attachment&&e.attachment.type==sp.ATTACHMENT_TYPE.REGION){d=e.attachment,this._updateRegionAttachmentQuad(d,e,i);var r=[];r.push(cc.p(i.bl.vertices.x,i.bl.vertices.y)),r.push(cc.p(i.br.vertices.x,i.br.vertices.y)),r.push(cc.p(i.tr.vertices.x,i.tr.vertices.y)),r.push(cc.p(i.tl.vertices.x,i.tl.vertices.y)),q.drawPoly(r,4,!0)}if(h._debugBones){var s;for(q.setLineWidth(2),q.setDrawColor(255,0,0,255),f=0,g=k.bones.length;g>f;f++){s=k.bones[f];var t=s.data.length*s.m00+s.worldX,u=s.data.length*s.m10+s.worldY;q.drawLine(cc.p(s.worldX,s.worldY),cc.p(t,u))}for(q.setPointSize(4),q.setDrawColor(0,0,255,255),f=0,g=k.bones.length;g>f;f++)s=k.bones[f],q.drawPoint(cc.p(s.worldX,s.worldY)),0==f&&q.setDrawColor(0,255,0,255)}cc.kmGLPopMatrix()}},a._createChildFormSkeletonData=function(){},a._updateChild=function(){},a._updateRegionAttachmentQuad=function(a,b,c,d){var e={};a.computeVertices(b.bone.skeleton.x,b.bone.skeleton.y,b.bone,e);var f=b.bone.skeleton.r*b.r*255,g=b.bone.skeleton.g*b.g*255,h=b.bone.skeleton.b*b.b*255,i=b.bone.skeleton.a*b.a;d&&(f*=i,g*=i,h*=i);var j=255*i;c.bl.colors.r=c.tl.colors.r=c.tr.colors.r=c.br.colors.r=f,c.bl.colors.g=c.tl.colors.g=c.tr.colors.g=c.br.colors.g=g,c.bl.colors.b=c.tl.colors.b=c.tr.colors.b=c.br.colors.b=h,c.bl.colors.a=c.tl.colors.a=c.tr.colors.a=c.br.colors.a=j;var k=sp.VERTEX_INDEX;c.bl.vertices.x=e[k.X1],c.bl.vertices.y=e[k.Y1],c.tl.vertices.x=e[k.X2],c.tl.vertices.y=e[k.Y2],c.tr.vertices.x=e[k.X3],c.tr.vertices.y=e[k.Y3],c.br.vertices.x=e[k.X4],c.br.vertices.y=e[k.Y4],c.bl.texCoords.u=a.uvs[k.X1],c.bl.texCoords.v=a.uvs[k.Y1],c.tl.texCoords.u=a.uvs[k.X2],c.tl.texCoords.v=a.uvs[k.Y2],c.tr.texCoords.u=a.uvs[k.X3],c.tr.texCoords.v=a.uvs[k.Y3],c.br.texCoords.u=a.uvs[k.X4],c.br.texCoords.v=a.uvs[k.Y4]},a._updateMeshAttachmentQuad=function(a,b,c,d){var e={};a.computeWorldVertices(b.bone.x,b.bone.y,b,e);var f=b.bone.skeleton.r*b.r*255,g=b.bone.skeleton.g*b.g*255,h=b.bone.skeleton.b*b.b*255,i=b.bone.skeleton.a*b.a;d&&(f*=i,g*=i,h*=i);var j=255*i;c.bl.colors.r=c.tl.colors.r=c.tr.colors.r=c.br.colors.r=f,c.bl.colors.g=c.tl.colors.g=c.tr.colors.g=c.br.colors.g=g,c.bl.colors.b=c.tl.colors.b=c.tr.colors.b=c.br.colors.b=h,c.bl.colors.a=c.tl.colors.a=c.tr.colors.a=c.br.colors.a=j;var k=sp.VERTEX_INDEX;c.bl.vertices.x=e[k.X1],c.bl.vertices.y=e[k.Y1],c.tl.vertices.x=e[k.X2],c.tl.vertices.y=e[k.Y2],c.tr.vertices.x=e[k.X3],c.tr.vertices.y=e[k.Y3],c.br.vertices.x=e[k.X4],c.br.vertices.y=e[k.Y4],c.bl.texCoords.u=a.uvs[k.X1],c.bl.texCoords.v=a.uvs[k.Y1],c.tl.texCoords.u=a.uvs[k.X2],c.tl.texCoords.v=a.uvs[k.Y2],c.tr.texCoords.u=a.uvs[k.X3],c.tr.texCoords.v=a.uvs[k.Y3],c.br.texCoords.u=a.uvs[k.X4],c.br.texCoords.v=a.uvs[k.Y4]}}();
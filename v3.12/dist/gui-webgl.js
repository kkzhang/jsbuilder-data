!function(){cc.ScrollView.WebGLRenderCmd=function(a){cc.Layer.WebGLRenderCmd.call(this,a),this._needDraw=!1,this.startCmd=new cc.CustomRenderCmd(this,this._startCmd),this.endCmd=new cc.CustomRenderCmd(this,this._endCmd)};var a=cc.ScrollView.WebGLRenderCmd.prototype=Object.create(cc.Layer.WebGLRenderCmd.prototype);a.constructor=cc.ScrollView.WebGLRenderCmd,a._startCmd=function(){var a=this._node,b=cc.view,c=a._getViewRect();if(b.isScissorEnabled()){if(a._scissorRestored=!0,a._parentScissorRect=b.getScissorRect(),cc.rectIntersection(c,a._parentScissorRect)){var d=a._parentScissorRect,e=Math.max(c.x,d.x),f=Math.max(c.y,d.y),g=Math.min(c.x+c.width,d.x+d.width),h=Math.min(c.y+c.height,d.y+d.height);b.setScissorInPoints(e,f,g-e,h-f)}}else{var i=cc._renderContext;i.enable(i.SCISSOR_TEST),b.setScissorInPoints(c.x,c.y,c.width,c.height)}},a._endCmd=function(){var a=this._node;if(a._scissorRestored){var b=a._parentScissorRect;cc.view.setScissorInPoints(b.x,b.y,b.width,b.height)}else{var c=cc._renderContext;c.disable(c.SCISSOR_TEST)}},a.visit=function(a){var b=this._node;if(b._visible){var c,d,e,f=b._children;if(cc.kmGLPushMatrix(),this._syncStatus(a),b._clippingToBounds&&cc.renderer.pushRenderCommand(this.startCmd),f&&f.length>0){for(e=f.length,c=0;e>c&&(d=f[c],d&&d._localZOrder<0);c++)d._renderCmd.visit();for(;e>c;c++)f[c]._renderCmd.visit()}b._clippingToBounds&&cc.renderer.pushRenderCommand(this.endCmd),this._dirtyFlag=0,cc.kmGLPopMatrix()}}}();
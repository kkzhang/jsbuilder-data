cc.NodeGrid=cc.Node.extend({grid:null,_target:null,_gridRect:null,ctor:function(a){cc.Node.prototype.ctor.call(this),void 0===a&&(a=cc.rect()),this._gridRect=a},getGrid:function(){return this.grid},setGrid:function(a){this.grid=a},setGridRect:function(a){this._gridRect=a},getGridRect:function(){return this._gridRect},setTarget:function(a){this._target=a},_createRenderCmd:function(){return cc._renderType===cc.game.RENDER_TYPE_WEBGL?new cc.NodeGrid.WebGLRenderCmd(this):new cc.Node.CanvasRenderCmd(this)}});var _p=cc.NodeGrid.prototype;_p.grid,_p.target,cc.defineGetterSetter(_p,"target",null,_p.setTarget),cc.NodeGrid.create=function(){return new cc.NodeGrid},function(){cc.NodeGrid.WebGLRenderCmd=function(a){cc.Node.WebGLRenderCmd.call(this,a),this._needDraw=!1,this._gridBeginCommand=new cc.CustomRenderCmd(this,this.onGridBeginDraw),this._gridEndCommand=new cc.CustomRenderCmd(this,this.onGridEndDraw)};var a=cc.NodeGrid.WebGLRenderCmd.prototype=Object.create(cc.Node.WebGLRenderCmd.prototype);a.constructor=cc.NodeGrid.WebGLRenderCmd,a.visit=function(a){var b=this._node;if(b._visible){a=a||this.getParentRenderCmd(),b._parent&&b._parent._renderCmd&&(this._curLevel=b._parent._renderCmd._curLevel+1);var c=cc.current_stack;c.stack.push(c.top),this._syncStatus(a),c.top=this._stackMatrix,cc.renderer.pushRenderCommand(this._gridBeginCommand),b._target&&b._target.visit();var d=b._children;if(d&&d.length>0){var e=d.length;b.sortAllChildren();for(var f=0;f<e;f++){var g=d[f];g&&g.visit()}}cc.renderer.pushRenderCommand(this._gridEndCommand),this._dirtyFlag=0,c.top=c.stack.pop()}},a.onGridBeginDraw=function(){var a=this._node.grid;a&&a._active&&a.beforeDraw()},a.onGridEndDraw=function(){var a=this._node.grid;a&&a._active&&a.afterDraw(this._node)}}();
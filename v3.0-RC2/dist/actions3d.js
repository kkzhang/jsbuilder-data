cc.GridAction=cc.ActionInterval.extend({_gridSize:null,ctor:function(a,b){cc._checkWebGLRenderMode();cc.ActionInterval.prototype.ctor.call(this);this._gridSize=cc.size(0,0);b&&this.initWithDuration(a,b)},clone:function(){var a=new cc.GridAction,b=this._gridSize;a.initWithDuration(this._duration,cc.size(b.width,b.height));return a},startWithTarget:function(a){cc.ActionInterval.prototype.startWithTarget.call(this,a);var b=this.getGrid(),c=this.target;(a=c.grid)&&0<a.getReuseGrid()?(b=a.getGridSize(),
a.isActive()&&(b.width==this._gridSize.width&&b.height==this._gridSize.height)&&a.reuse()):(a&&a.isActive()&&a.setActive(!1),c.grid=b,c.grid.setActive(!0))},reverse:function(){return cc.ReverseTime.create(this)},initWithDuration:function(a,b){return cc.ActionInterval.prototype.initWithDuration.call(this,a)?(this._gridSize.width=b.width,this._gridSize.height=b.height,!0):!1},getGrid:function(){cc.log("cc.GridAction.getGrid(): it should be overridden in subclass.")}});
cc.gridAction=function(a,b){return new cc.GridAction(a,b)};cc.GridAction.create=cc.gridAction;cc.Grid3DAction=cc.GridAction.extend({getGrid:function(){return cc.Grid3D.create(this._gridSize)},vertex:function(a){return this.target.grid.vertex(a)},originalVertex:function(a){return this.target.grid.originalVertex(a)},setVertex:function(a,b){this.target.grid.setVertex(a,b)}});cc.grid3DAction=function(a,b){return new cc.Grid3DAction(a,b)};cc.Grid3DAction.create=cc.grid3DAction;
cc.TiledGrid3DAction=cc.GridAction.extend({tile:function(a){return this.target.grid.tile(a)},originalTile:function(a){return this.target.grid.originalTile(a)},setTile:function(a,b){this.target.grid.setTile(a,b)},getGrid:function(){return cc.TiledGrid3D.create(this._gridSize)}});cc.tiledGrid3DAction=function(a,b){return new cc.TiledGrid3DAction(a,b)};cc.TiledGrid3DAction.create=cc.tiledGrid3DAction;
cc.StopGrid=cc.ActionInstant.extend({startWithTarget:function(a){cc.ActionInstant.prototype.startWithTarget.call(this,a);(a=this.target.grid)&&a.isActive()&&a.setActive(!1)}});cc.stopGrid=function(){return new cc.StopGrid};cc.StopGrid.create=cc.stopGrid;
cc.ReuseGrid=cc.ActionInstant.extend({_times:null,ctor:function(a){cc.ActionInstant.prototype.ctor.call(this);void 0!==a&&this.initWithTimes(a)},initWithTimes:function(a){this._times=a;return!0},startWithTarget:function(a){cc.ActionInstant.prototype.startWithTarget.call(this,a);this.target.grid&&this.target.grid.isActive()&&this.target.grid.setReuseGrid(this.target.grid.getReuseGrid()+this._times)}});cc.reuseGrid=function(a){return new cc.ReuseGrid(a)};cc.ReuseGrid.create=cc.reuseGrid;cc.Waves3D=cc.Grid3DAction.extend({_waves:0,_amplitude:0,_amplitudeRate:0,ctor:function(a,b,c,d){cc.GridAction.prototype.ctor.call(this);void 0!==d&&this.initWithDuration(a,b,c,d)},getAmplitude:function(){return this._amplitude},setAmplitude:function(a){this._amplitude=a},getAmplitudeRate:function(){return this._amplitudeRate},setAmplitudeRate:function(a){this._amplitudeRate=a},initWithDuration:function(a,b,c,d){return cc.Grid3DAction.prototype.initWithDuration.call(this,a,b)?(this._waves=c,this._amplitude=
d,this._amplitudeRate=1,!0):!1},update:function(a){for(var b=this._gridSize,c=this._amplitude,d=cc.p(0,0),e=this._amplitudeRate,f=this._waves,h=0;h<b.width+1;++h)for(var g=0;g<b.height+1;++g){d.x=h;d.y=g;var k=this.originalVertex(d);k.z+=Math.sin(2*Math.PI*a*f+0.01*(k.y+k.x))*c*e;this.setVertex(d,k)}}});cc.waves3D=function(a,b,c,d){return new cc.Waves3D(a,b,c,d)};cc.Waves3D.create=cc.waves3D;
cc.FlipX3D=cc.Grid3DAction.extend({ctor:function(a){void 0!==a?cc.GridAction.prototype.ctor.call(this,a,cc.size(1,1)):cc.GridAction.prototype.ctor.call(this)},initWithDuration:function(a){return cc.Grid3DAction.prototype.initWithDuration.call(this,a,cc.size(1,1))},initWithSize:function(a,b){return 1!=a.width||1!=a.height?(cc.log("Grid size must be (1,1)"),!1):cc.Grid3DAction.prototype.initWithDuration.call(this,b,a)},update:function(a){var b=Math.PI*a;a=Math.sin(b);var c=Math.cos(b/2),b=new cc.Vertex3F,
d=cc.p(0,0);d.x=d.y=1;var e=this.originalVertex(d);d.x=d.y=0;var d=this.originalVertex(d),f=e.x,h=d.x,g,k;f>h?(e=cc.p(0,0),d=cc.p(0,1),g=cc.p(1,0),k=cc.p(1,1)):(g=cc.p(0,0),k=cc.p(0,1),e=cc.p(1,0),d=cc.p(1,1),f=h);b.x=f-f*c;b.z=Math.abs(parseFloat(f*a/4));a=this.originalVertex(e);a.x=b.x;a.z+=b.z;this.setVertex(e,a);a=this.originalVertex(d);a.x=b.x;a.z+=b.z;this.setVertex(d,a);a=this.originalVertex(g);a.x-=b.x;a.z-=b.z;this.setVertex(g,a);a=this.originalVertex(k);a.x-=b.x;a.z-=b.z;this.setVertex(k,
a)}});cc.flipX3D=function(a){return new cc.FlipX3D(a)};cc.FlipX3D.create=cc.flipX3D;
cc.FlipY3D=cc.FlipX3D.extend({ctor:function(a){void 0!==a?cc.GridAction.prototype.ctor.call(this,a,cc.size(1,1)):cc.GridAction.prototype.ctor.call(this)},update:function(a){var b=Math.PI*a;a=Math.sin(b);var c=Math.cos(b/2),b=new cc.Vertex3F,d=cc.p(0,0);d.x=d.y=1;var e=this.originalVertex(d);d.x=d.y=0;var d=this.originalVertex(d),f=e.y,h=d.y,g,k;f>h?(e=cc.p(0,0),d=cc.p(0,1),g=cc.p(1,0),k=cc.p(1,1)):(d=cc.p(0,0),e=cc.p(0,1),k=cc.p(1,0),g=cc.p(1,1),f=h);b.y=f-f*c;b.z=Math.abs(parseFloat(f*a)/4);a=this.originalVertex(e);
a.y=b.y;a.z+=b.z;this.setVertex(e,a);a=this.originalVertex(d);a.y-=b.y;a.z-=b.z;this.setVertex(d,a);a=this.originalVertex(g);a.y=b.y;a.z+=b.z;this.setVertex(g,a);a=this.originalVertex(k);a.y-=b.y;a.z-=b.z;this.setVertex(k,a)}});cc.flipY3D=function(a){return new cc.FlipY3D(a)};cc.FlipY3D.create=cc.flipY3D;
cc.Lens3D=cc.Grid3DAction.extend({_position:null,_radius:0,_lensEffect:0,_concave:!1,_dirty:!1,ctor:function(a,b,c,d){cc.GridAction.prototype.ctor.call(this);this._position=cc.p(0,0);void 0!==d&&this.initWithDuration(a,b,c,d)},getLensEffect:function(){return this._lensEffect},setLensEffect:function(a){this._lensEffect=a},setConcave:function(a){this._concave=a},getPosition:function(){return this._position},setPosition:function(a){cc.pointEqualToPoint(a,this._position)||(this._position.x=a.x,this._position.y=
a.y,this._dirty=!0)},initWithDuration:function(a,b,c,d){return cc.Grid3DAction.prototype.initWithDuration.call(this,a,b)?(this.setPosition(c),this._radius=d,this._lensEffect=0.7,this._dirty=!0):!1},update:function(a){if(this._dirty){a=this._gridSize.width;for(var b=this._gridSize.height,c=this._radius,d=this._lensEffect,e=cc.p(0,0),f=cc.p(0,0),h,g,k,l=0;l<a+1;++l)for(var m=0;m<b+1;++m)e.x=l,e.y=m,h=this.originalVertex(e),f.x=this._position.x-h.x,f.y=this._position.y-h.y,g=cc.pLength(f),g<c&&(g=c-
g,g/=c,0==g&&(g=0.001),g=Math.log(g)*d,k=Math.exp(g)*c,g=cc.pLength(f),0<g&&(f.x/=g,f.y/=g,f.x*=k,f.y*=k,h.z+=cc.pLength(f)*d)),this.setVertex(e,h);this._dirty=!1}}});cc.lens3D=function(a,b,c,d){return new cc.Lens3D(a,b,c,d)};cc.Lens3D.create=cc.lens3D;
cc.Ripple3D=cc.Grid3DAction.extend({_position:null,_radius:0,_waves:0,_amplitude:0,_amplitudeRate:0,ctor:function(a,b,c,d,e,f){cc.GridAction.prototype.ctor.call(this);this._position=cc.p(0,0);void 0!==f&&this.initWithDuration(a,b,c,d,e,f)},getPosition:function(){return this._position},setPosition:function(a){this._position.x=a.x;this._position.y=a.y},getAmplitude:function(){return this._amplitude},setAmplitude:function(a){this._amplitude=a},getAmplitudeRate:function(){return this._amplitudeRate},
setAmplitudeRate:function(a){this._amplitudeRate=a},initWithDuration:function(a,b,c,d,e,f){return cc.Grid3DAction.prototype.initWithDuration.call(this,a,b)?(this.setPosition(c),this._radius=d,this._waves=e,this._amplitude=f,this._amplitudeRate=1,!0):!1},update:function(a){for(var b=this._gridSize.width,c=this._gridSize.height,d=cc.p(0,0),e=this._radius,f=this._waves,h=this._amplitude,g=this._amplitudeRate,k,l,m=cc.p(0,0),n=0;n<b+1;++n)for(var p=0;p<c+1;++p){d.x=n;d.y=p;k=this.originalVertex(d);m.x=
this._position.x-k.x;m.y=this._position.y-k.y;l=cc.pLength(m);if(l<e){l=e-l;var q=Math.pow(l/e,2);k.z+=Math.sin(2*a*Math.PI*f+0.1*l)*h*g*q}this.setVertex(d,k)}}});cc.ripple3D=function(a,b,c,d,e,f){return new cc.Ripple3D(a,b,c,d,e,f)};cc.Ripple3D.create=cc.ripple3D;
cc.Shaky3D=cc.Grid3DAction.extend({_randRange:0,_shakeZ:!1,ctor:function(a,b,c,d){cc.GridAction.prototype.ctor.call(this);void 0!==d&&this.initWithDuration(a,b,c,d)},initWithDuration:function(a,b,c,d){return cc.Grid3DAction.prototype.initWithDuration.call(this,a,b)?(this._randRange=c,this._shakeZ=d,!0):!1},update:function(a){a=this._gridSize.width;for(var b=this._gridSize.height,c=this._randRange,d=this._shakeZ,e=cc.p(0,0),f,h=0;h<a+1;++h)for(var g=0;g<b+1;++g)e.x=h,e.y=g,f=this.originalVertex(e),
f.x+=cc.rand()%(2*c)-c,f.y+=cc.rand()%(2*c)-c,d&&(f.z+=cc.rand()%(2*c)-c),this.setVertex(e,f)}});cc.shaky3D=function(a,b,c,d){return new cc.Shaky3D(a,b,c,d)};cc.Shaky3D.create=cc.shaky3D;
cc.Liquid=cc.Grid3DAction.extend({_waves:0,_amplitude:0,_amplitudeRate:0,ctor:function(a,b,c,d){cc.GridAction.prototype.ctor.call(this);void 0!==d&&this.initWithDuration(a,b,c,d)},getAmplitude:function(){return this._amplitude},setAmplitude:function(a){this._amplitude=a},getAmplitudeRate:function(){return this._amplitudeRate},setAmplitudeRate:function(a){this._amplitudeRate=a},initWithDuration:function(a,b,c,d){return cc.Grid3DAction.prototype.initWithDuration.call(this,a,b)?(this._waves=c,this._amplitude=
d,this._amplitudeRate=1,!0):!1},update:function(a){for(var b=this._gridSize.width,c=this._gridSize.height,d=cc.p(0,0),e=this._waves,f=this._amplitude,h=this._amplitudeRate,g,k=1;k<b;++k)for(var l=1;l<c;++l)d.x=k,d.y=l,g=this.originalVertex(d),g.x+=Math.sin(2*a*Math.PI*e+0.01*g.x)*f*h,g.y+=Math.sin(2*a*Math.PI*e+0.01*g.y)*f*h,this.setVertex(d,g)}});cc.liquid=function(a,b,c,d){return new cc.Liquid(a,b,c,d)};cc.Liquid.create=cc.liquid;
cc.Waves=cc.Grid3DAction.extend({_waves:0,_amplitude:0,_amplitudeRate:0,_vertical:!1,_horizontal:!1,ctor:function(a,b,c,d,e,f){cc.GridAction.prototype.ctor.call(this);void 0!==f&&this.initWithDuration(a,b,c,d,e,f)},getAmplitude:function(){return this._amplitude},setAmplitude:function(a){this._amplitude=a},getAmplitudeRate:function(){return this._amplitudeRate},setAmplitudeRate:function(a){this._amplitudeRate=a},initWithDuration:function(a,b,c,d,e,f){return cc.Grid3DAction.prototype.initWithDuration.call(this,
a,b)?(this._waves=c,this._amplitude=d,this._amplitudeRate=1,this._horizontal=e,this._vertical=f,!0):!1},update:function(a){for(var b=this._gridSize.width,c=this._gridSize.height,d=cc.p(0,0),e=this._vertical,f=this._horizontal,h=this._waves,g=this._amplitude,k=this._amplitudeRate,l,m=0;m<b+1;++m)for(var n=0;n<c+1;++n)d.x=m,d.y=n,l=this.originalVertex(d),e&&(l.x+=Math.sin(2*a*Math.PI*h+0.01*l.y)*g*k),f&&(l.y+=Math.sin(2*a*Math.PI*h+0.01*l.x)*g*k),this.setVertex(d,l)}});
cc.waves=function(a,b,c,d,e,f){return new cc.Waves(a,b,c,d,e,f)};cc.Waves.create=cc.waves;
cc.Twirl=cc.Grid3DAction.extend({_position:null,_twirls:0,_amplitude:0,_amplitudeRate:0,ctor:function(a,b,c,d,e){cc.GridAction.prototype.ctor.call(this);this._position=cc.p(0,0);void 0!==e&&this.initWithDuration(a,b,c,d,e)},getPosition:function(){return this._position},setPosition:function(a){this._position.x=a.x;this._position.y=a.y},getAmplitude:function(){return this._amplitude},setAmplitude:function(a){this._amplitude=a},getAmplitudeRate:function(){return this._amplitudeRate},setAmplitudeRate:function(a){this._amplitudeRate=
a},initWithDuration:function(a,b,c,d,e){return cc.Grid3DAction.prototype.initWithDuration.call(this,a,b)?(this.setPosition(c),this._twirls=d,this._amplitude=e,this._amplitudeRate=1,!0):!1},update:function(a){for(var b=this._position,c=this._gridSize.width,d=this._gridSize.height,e=cc.p(0,0),f=0.1*this._amplitude*this._amplitudeRate,h=this._twirls,g,k,l,m=cc.p(0,0),n=0;n<c+1;++n)for(var p=0;p<d+1;++p)e.x=n,e.y=p,g=this.originalVertex(e),m.x=n-c/2,m.y=p-d/2,k=cc.pLength(m)*Math.cos(Math.PI/2+2*a*Math.PI*
h)*f,l=Math.sin(k)*(g.y-b.y)+Math.cos(k)*(g.x-b.x),k=Math.cos(k)*(g.y-b.y)-Math.sin(k)*(g.x-b.x),g.x=b.x+l,g.y=b.y+k,this.setVertex(e,g)}});cc.twirl=function(a,b,c,d,e){return new cc.Twirl(a,b,c,d,e)};cc.Twirl.create=cc.twirl;cc.ShakyTiles3D=cc.TiledGrid3DAction.extend({_randRange:0,_shakeZ:!1,ctor:function(a,b,c,d){cc.GridAction.prototype.ctor.call(this);void 0!==d&&this.initWithDuration(a,b,c,d)},initWithDuration:function(a,b,c,d){return cc.TiledGrid3DAction.prototype.initWithDuration.call(this,a,b)?(this._randRange=c,this._shakeZ=d,!0):!1},update:function(a){a=this._gridSize;for(var b=this._randRange,c=cc.p(0,0),d=0;d<a.width;++d)for(var e=0;e<a.height;++e){c.x=d;c.y=e;var f=this.originalTile(c);f.bl.x+=cc.rand()%(2*
b)-b;f.br.x+=cc.rand()%(2*b)-b;f.tl.x+=cc.rand()%(2*b)-b;f.tr.x+=cc.rand()%(2*b)-b;f.bl.y+=cc.rand()%(2*b)-b;f.br.y+=cc.rand()%(2*b)-b;f.tl.y+=cc.rand()%(2*b)-b;f.tr.y+=cc.rand()%(2*b)-b;this._shakeZ&&(f.bl.z+=cc.rand()%(2*b)-b,f.br.z+=cc.rand()%(2*b)-b,f.tl.z+=cc.rand()%(2*b)-b,f.tr.z+=cc.rand()%(2*b)-b);this.setTile(c,f)}}});cc.shakyTiles3D=function(a,b,c,d){return new cc.ShakyTiles3D(a,b,c,d)};cc.ShakyTiles3D.create=cc.shakyTiles3D;
cc.ShatteredTiles3D=cc.TiledGrid3DAction.extend({_randRange:0,_once:!1,_shatterZ:!1,ctor:function(a,b,c,d){cc.GridAction.prototype.ctor.call(this);void 0!==d&&this.initWithDuration(a,b,c,d)},initWithDuration:function(a,b,c,d){return cc.TiledGrid3DAction.prototype.initWithDuration.call(this,a,b)?(this._once=!1,this._randRange=c,this._shatterZ=d,!0):!1},update:function(a){if(!1===this._once){a=this._gridSize;for(var b=this._randRange,c,d=cc.p(0,0),e=0;e<a.width;++e)for(var f=0;f<a.height;++f)d.x=e,
d.y=f,c=this.originalTile(d),c.bl.x+=cc.rand()%(2*b)-b,c.br.x+=cc.rand()%(2*b)-b,c.tl.x+=cc.rand()%(2*b)-b,c.tr.x+=cc.rand()%(2*b)-b,c.bl.y+=cc.rand()%(2*b)-b,c.br.y+=cc.rand()%(2*b)-b,c.tl.y+=cc.rand()%(2*b)-b,c.tr.y+=cc.rand()%(2*b)-b,this._shatterZ&&(c.bl.z+=cc.rand()%(2*b)-b,c.br.z+=cc.rand()%(2*b)-b,c.tl.z+=cc.rand()%(2*b)-b,c.tr.z+=cc.rand()%(2*b)-b),this.setTile(d,c);this._once=!0}}});cc.shatteredTiles3D=function(a,b,c,d){return new cc.ShatteredTiles3D(a,b,c,d)};
cc.ShatteredTiles3D.create=cc.shatteredTiles3D;cc.Tile=function(a,b,c){this.position=a||cc.p(0,0);this.startPosition=b||cc.p(0,0);this.delta=c||cc.p(0,0)};
cc.ShuffleTiles=cc.TiledGrid3DAction.extend({_seed:0,_tilesCount:0,_tilesOrder:null,_tiles:null,ctor:function(a,b,c){cc.GridAction.prototype.ctor.call(this);this._tilesOrder=[];this._tiles=[];void 0!==c&&this.initWithDuration(a,b,c)},initWithDuration:function(a,b,c){return cc.TiledGrid3DAction.prototype.initWithDuration.call(this,a,b)?(this._seed=c,this._tilesOrder.length=0,this._tiles.length=0,!0):!1},shuffle:function(a,b){for(var c=b-1;0<=c;c--){var d=0|cc.rand()%(c+1),e=a[c];a[c]=a[d];a[d]=e}},
getDelta:function(a){var b=this._gridSize,c=a.width*b.height+a.height;return cc.size(this._tilesOrder[c]/b.height-a.width,this._tilesOrder[c]%b.height-a.height)},placeTile:function(a,b){var c=this.originalTile(a),d=this.target.grid.getStep(),e=b.position;c.bl.x+=e.x*d.x;c.bl.y+=e.y*d.y;c.br.x+=e.x*d.x;c.br.y+=e.y*d.y;c.tl.x+=e.x*d.x;c.tl.y+=e.y*d.y;c.tr.x+=e.x*d.x;c.tr.y+=e.y*d.y;this.setTile(a,c)},startWithTarget:function(a){cc.TiledGrid3DAction.prototype.startWithTarget.call(this,a);a=this._gridSize;
this._tilesCount=a.width*a.height;for(var b=this._tilesOrder,c=b.length=0;c<this._tilesCount;++c)b[c]=c;this.shuffle(b,this._tilesCount);for(var b=this._tiles,c=b.length=0,d=cc.size(0,0),e=0;e<a.width;++e)for(var f=0;f<a.height;++f)b[c]=new cc.Tile,b[c].position=cc.p(e,f),b[c].startPosition=cc.p(e,f),d.width=e,d.height=f,b[c].delta=this.getDelta(d),++c},update:function(a){for(var b=0,c=this._gridSize,d=this._tiles,e,f=cc.p(0,0),h=0;h<c.width;++h)for(var g=0;g<c.height;++g)f.x=h,f.y=g,e=d[b],e.position.x=
e.delta.width*a,e.position.y=e.delta.height*a,this.placeTile(f,e),++b}});cc.shuffleTiles=function(a,b,c){return new cc.ShuffleTiles(a,b,c)};cc.ShuffleTiles.create=cc.shuffleTiles;
cc.FadeOutTRTiles=cc.TiledGrid3DAction.extend({testFunc:function(a,b){var c=this._gridSize.width*b,d=this._gridSize.height*b;return 0==c+d?1:Math.pow((a.width+a.height)/(c+d),6)},turnOnTile:function(a){this.setTile(a,this.originalTile(a))},turnOffTile:function(a){this.setTile(a,new cc.Quad3)},transformTile:function(a,b){var c=this.originalTile(a),d=this.target.grid.getStep();c.bl.x+=d.x/2*(1-b);c.bl.y+=d.y/2*(1-b);c.br.x-=d.x/2*(1-b);c.br.y+=d.y/2*(1-b);c.tl.x+=d.x/2*(1-b);c.tl.y-=d.y/2*(1-b);c.tr.x-=
d.x/2*(1-b);c.tr.y-=d.y/2*(1-b);this.setTile(a,c)},update:function(a){for(var b=this._gridSize,c=cc.p(0,0),d=cc.size(0,0),e,f=0;f<b.width;++f)for(var h=0;h<b.height;++h)c.x=f,c.y=h,d.width=f,d.height=h,e=this.testFunc(d,a),0==e?this.turnOffTile(c):1>e?this.transformTile(c,e):this.turnOnTile(c)}});cc.fadeOutTRTiles=function(a,b){return new cc.FadeOutTRTiles(a,b)};cc.FadeOutTRTiles.create=cc.fadeOutTRTiles;
cc.FadeOutBLTiles=cc.FadeOutTRTiles.extend({testFunc:function(a,b){return 0==a.width+a.height?1:Math.pow((this._gridSize.width*(1-b)+this._gridSize.height*(1-b))/(a.width+a.height),6)}});cc.fadeOutBLTiles=function(a,b){return new cc.FadeOutBLTiles(a,b)};cc.FadeOutBLTiles.create=cc.fadeOutBLTiles;
cc.FadeOutUpTiles=cc.FadeOutTRTiles.extend({testFunc:function(a,b){var c=this._gridSize.height*b;return 0==c?1:Math.pow(a.height/c,6)},transformTile:function(a,b){var c=this.originalTile(a),d=this.target.grid.getStep();c.bl.y+=d.y/2*(1-b);c.br.y+=d.y/2*(1-b);c.tl.y-=d.y/2*(1-b);c.tr.y-=d.y/2*(1-b);this.setTile(a,c)}});cc.fadeOutUpTiles=function(a,b){return new cc.FadeOutUpTiles(a,b)};cc.FadeOutUpTiles.create=cc.fadeOutUpTiles;
cc.FadeOutDownTiles=cc.FadeOutUpTiles.extend({testFunc:function(a,b){return 0==a.height?1:Math.pow(this._gridSize.height*(1-b)/a.height,6)}});cc.fadeOutDownTiles=function(a,b){return new cc.FadeOutDownTiles(a,b)};cc.FadeOutDownTiles.create=cc.fadeOutDownTiles;
cc.TurnOffTiles=cc.TiledGrid3DAction.extend({_seed:null,_tilesCount:0,_tilesOrder:null,ctor:function(a,b,c){cc.GridAction.prototype.ctor.call(this);this._tilesOrder=[];void 0!==b&&this.initWithDuration(a,b,c)},initWithDuration:function(a,b,c){return cc.TiledGrid3DAction.prototype.initWithDuration.call(this,a,b)?(this._seed=c||0,this._tilesOrder.length=0,!0):!1},shuffle:function(a,b){for(var c=b-1;0<=c;c--){var d=0|cc.rand()%(c+1),e=a[c];a[c]=a[d];a[d]=e}},turnOnTile:function(a){this.setTile(a,this.originalTile(a))},
turnOffTile:function(a){this.setTile(a,new cc.Quad3)},startWithTarget:function(a){cc.TiledGrid3DAction.prototype.startWithTarget.call(this,a);this._tilesCount=this._gridSize.width*this._gridSize.height;a=this._tilesOrder;for(var b=a.length=0;b<this._tilesCount;++b)a[b]=b;this.shuffle(a,this._tilesCount)},update:function(a){a=0|a*this._tilesCount;for(var b=this._gridSize,c,d=cc.p(0,0),e=this._tilesOrder,f=0;f<this._tilesCount;f++)c=e[f],d.x=0|c/b.height,d.y=c%(0|b.height),f<a?this.turnOffTile(d):this.turnOnTile(d)}});
cc.turnOffTiles=function(a,b,c){return new cc.TurnOffTiles(a,b,c)};cc.TurnOffTiles.create=cc.turnOffTiles;
cc.WavesTiles3D=cc.TiledGrid3DAction.extend({_waves:0,_amplitude:0,_amplitudeRate:0,ctor:function(a,b,c,d){cc.GridAction.prototype.ctor.call(this);void 0!==d&&this.initWithDuration(a,b,c,d)},getAmplitude:function(){return this._amplitude},setAmplitude:function(a){this._amplitude=a},getAmplitudeRate:function(){return this._amplitudeRate},setAmplitudeRate:function(a){this._amplitudeRate=a},initWithDuration:function(a,b,c,d){return cc.TiledGrid3DAction.prototype.initWithDuration.call(this,a,b)?(this._waves=
c,this._amplitude=d,this._amplitudeRate=1,!0):!1},update:function(a){for(var b=this._gridSize,c=this._waves,d=this._amplitude,e=this._amplitudeRate,f=cc.p(0,0),h,g=0;g<b.width;g++)for(var k=0;k<b.height;k++)f.x=g,f.y=k,h=this.originalTile(f),h.bl.z=Math.sin(2*a*Math.PI*c+0.01*(h.bl.y+h.bl.x))*d*e,h.br.z=h.bl.z,h.tl.z=h.bl.z,h.tr.z=h.bl.z,this.setTile(f,h)}});cc.wavesTiles3D=function(a,b,c,d){return new cc.WavesTiles3D(a,b,c,d)};cc.WavesTiles3D.create=cc.wavesTiles3D;
cc.JumpTiles3D=cc.TiledGrid3DAction.extend({_jumps:0,_amplitude:0,_amplitudeRate:0,ctor:function(a,b,c,d){cc.GridAction.prototype.ctor.call(this);void 0!==d&&this.initWithDuration(a,b,c,d)},getAmplitude:function(){return this._amplitude},setAmplitude:function(a){this._amplitude=a},getAmplitudeRate:function(){return this._amplitudeRate},setAmplitudeRate:function(a){this._amplitudeRate=a},initWithDuration:function(a,b,c,d){return cc.TiledGrid3DAction.prototype.initWithDuration.call(this,a,b)?(this._jumps=
c,this._amplitude=d,this._amplitudeRate=1,!0):!1},update:function(a){var b=Math.sin(2*Math.PI*a*this._jumps)*this._amplitude*this._amplitudeRate;a=Math.sin(Math.PI*(2*a*this._jumps+1))*this._amplitude*this._amplitudeRate;for(var c=this._gridSize,d=this.target.grid,e,f=cc.p(0,0),h=0;h<c.width;h++)for(var g=0;g<c.height;g++)f.x=h,f.y=g,e=d.originalTile(f),0==(h+g)%2?(e.bl.z+=b,e.br.z+=b,e.tl.z+=b,e.tr.z+=b):(e.bl.z+=a,e.br.z+=a,e.tl.z+=a,e.tr.z+=a),d.setTile(f,e)}});
cc.jumpTiles3D=function(a,b,c,d){return new cc.JumpTiles3D(a,b,c,d)};cc.JumpTiles3D.create=cc.jumpTiles3D;
cc.SplitRows=cc.TiledGrid3DAction.extend({_rows:0,_winSize:null,ctor:function(a,b){cc.GridAction.prototype.ctor.call(this);void 0!==b&&this.initWithDuration(a,b)},initWithDuration:function(a,b){this._rows=b;return cc.TiledGrid3DAction.prototype.initWithDuration.call(this,a,cc.size(1,b))},update:function(a){for(var b=this._gridSize,c=this._winSize.width,d,e,f=cc.p(0,0),h=0;h<b.height;++h)f.y=h,d=this.originalTile(f),e=1,0==h%2&&(e=-1),d.bl.x+=e*c*a,d.br.x+=e*c*a,d.tl.x+=e*c*a,d.tr.x+=e*c*a,this.setTile(f,
d)},startWithTarget:function(a){cc.TiledGrid3DAction.prototype.startWithTarget.call(this,a);this._winSize=cc.director.getWinSizeInPixels()}});cc.splitRows=function(a,b){return new cc.SplitRows(a,b)};cc.SplitRows.create=cc.splitRows;
cc.SplitCols=cc.TiledGrid3DAction.extend({_cols:0,_winSize:null,ctor:function(a,b){cc.GridAction.prototype.ctor.call(this);void 0!==b&&this.initWithDuration(a,b)},initWithDuration:function(a,b){this._cols=b;return cc.TiledGrid3DAction.prototype.initWithDuration.call(this,a,cc.size(b,1))},update:function(a){for(var b=this._gridSize.width,c=this._winSize.height,d,e,f=cc.p(0,0),h=0;h<b;++h)f.x=h,d=this.originalTile(f),e=1,0==h%2&&(e=-1),d.bl.y+=e*c*a,d.br.y+=e*c*a,d.tl.y+=e*c*a,d.tr.y+=e*c*a,this.setTile(f,
d)},startWithTarget:function(a){cc.TiledGrid3DAction.prototype.startWithTarget.call(this,a);this._winSize=cc.director.getWinSizeInPixels()}});cc.splitCols=function(a,b){return new cc.SplitCols(a,b)};cc.SplitCols.create=cc.splitCols;cc.PageTurn3D=cc.Grid3DAction.extend({update:function(a){var b=Math.max(0,a-0.25),b=-100-500*b*b;a=-Math.PI/2*Math.sqrt(a);var c=+Math.PI/2+a;a=Math.sin(c);for(var c=Math.cos(c),d=this._gridSize,e=cc.p(0,0),f=0;f<=d.width;++f)for(var h=0;h<=d.height;++h){e.x=f;e.y=h;var g=this.originalVertex(e),k=Math.sqrt(g.x*g.x+(g.y-b)*(g.y-b)),l=k*a,m=Math.asin(g.x/k)/a,n=Math.cos(m);g.x=m<=Math.PI?l*Math.sin(m):0;g.y=k+b-l*(1-n)*a;g.z=l*(1-n)*c/7;0.5>g.z&&(g.z=0.5);this.setVertex(e,g)}}});
cc.pageTurn3D=function(a,b){return new cc.PageTurn3D(a,b)};cc.PageTurn3D.create=cc.pageTurn3D;
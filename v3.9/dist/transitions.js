cc.SCENE_FADE=4208917214,cc.TRANSITION_ORIENTATION_LEFT_OVER=0,cc.TRANSITION_ORIENTATION_RIGHT_OVER=1,cc.TRANSITION_ORIENTATION_UP_OVER=0,cc.TRANSITION_ORIENTATION_DOWN_OVER=1,cc.TransitionScene=cc.Scene.extend({_inScene:null,_outScene:null,_duration:null,_isInSceneOnTop:!1,_isSendCleanupToScene:!1,_className:"TransitionScene",ctor:function(a,b){cc.Scene.prototype.ctor.call(this),void 0!==a&&void 0!==b&&this.initWithDuration(a,b)},_setNewScene:function(a){this.unschedule(this._setNewScene);var b=cc.director;this._isSendCleanupToScene=b.isSendCleanupToScene(),b.runScene(this._inScene),cc.eventManager.setEnabled(!0),this._outScene.visible=!0},_sceneOrder:function(){this._isInSceneOnTop=!0},visit:function(){this._isInSceneOnTop?(this._outScene.visit(),this._inScene.visit()):(this._inScene.visit(),this._outScene.visit()),cc.Node.prototype.visit.call(this)},onEnter:function(){cc.Node.prototype.onEnter.call(this),cc.eventManager.setEnabled(!1),this._outScene.onExitTransitionDidStart(),this._inScene.onEnter()},onExit:function(){cc.Node.prototype.onExit.call(this),cc.eventManager.setEnabled(!0),this._outScene.onExit(),this._inScene.onEnterTransitionDidFinish()},cleanup:function(){cc.Node.prototype.cleanup.call(this),this._isSendCleanupToScene&&this._outScene.cleanup()},initWithDuration:function(a,b){if(!b)throw new Error("cc.TransitionScene.initWithDuration(): Argument scene must be non-nil");if(this.init()){if(this._duration=a,this.attr({x:0,y:0,anchorX:0,anchorY:0}),this._inScene=b,this._outScene=cc.director.getRunningScene(),this._outScene||(this._outScene=new cc.Scene,this._outScene.init()),this._inScene===this._outScene)throw new Error("cc.TransitionScene.initWithDuration(): Incoming scene must be different from the outgoing scene");return this._sceneOrder(),!0}return!1},finish:function(){this._inScene.attr({visible:!0,x:0,y:0,scale:1,rotation:0}),cc._renderType===cc.game.RENDER_TYPE_WEBGL&&this._inScene.getCamera().restore(),this._outScene.attr({visible:!1,x:0,y:0,scale:1,rotation:0}),cc._renderType===cc.game.RENDER_TYPE_WEBGL&&this._outScene.getCamera().restore(),this.schedule(this._setNewScene,0)},hideOutShowIn:function(){this._inScene.visible=!0,this._outScene.visible=!1}}),cc.TransitionScene.create=function(a,b){return new cc.TransitionScene(a,b)},cc.TransitionSceneOriented=cc.TransitionScene.extend({_orientation:0,ctor:function(a,b,c){cc.TransitionScene.prototype.ctor.call(this),void 0!=c&&this.initWithDuration(a,b,c)},initWithDuration:function(a,b,c){return cc.TransitionScene.prototype.initWithDuration.call(this,a,b)&&(this._orientation=c),!0}}),cc.TransitionSceneOriented.create=function(a,b,c){return new cc.TransitionSceneOriented(a,b,c)},cc.TransitionRotoZoom=cc.TransitionScene.extend({ctor:function(a,b){cc.TransitionScene.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this),this._inScene.attr({scale:.001,anchorX:.5,anchorY:.5}),this._outScene.attr({scale:1,anchorX:.5,anchorY:.5});var a=cc.sequence(cc.spawn(cc.scaleBy(this._duration/2,.001),cc.rotateBy(this._duration/2,720)),cc.delayTime(this._duration/2));this._outScene.runAction(a),this._inScene.runAction(cc.sequence(a.reverse(),cc.callFunc(this.finish,this)))}}),cc.TransitionRotoZoom.create=function(a,b){return new cc.TransitionRotoZoom(a,b)},cc.TransitionJumpZoom=cc.TransitionScene.extend({ctor:function(a,b){cc.TransitionScene.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a=cc.director.getWinSize();this._inScene.attr({scale:.5,x:a.width,y:0,anchorX:.5,anchorY:.5}),this._outScene.anchorX=.5,this._outScene.anchorY=.5;var b=cc.jumpBy(this._duration/4,cc.p(-a.width,0),a.width/4,2),c=cc.scaleTo(this._duration/4,1),d=cc.scaleTo(this._duration/4,.5),e=cc.sequence(d,b),f=cc.sequence(b,c),g=cc.delayTime(this._duration/2);this._outScene.runAction(e),this._inScene.runAction(cc.sequence(g,f,cc.callFunc(this.finish,this)))}}),cc.TransitionJumpZoom.create=function(a,b){return new cc.TransitionJumpZoom(a,b)},cc.TransitionMoveInL=cc.TransitionScene.extend({ctor:function(a,b){cc.TransitionScene.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this),this.initScenes();var a=this.action();this._inScene.runAction(cc.sequence(this.easeActionWithAction(a),cc.callFunc(this.finish,this)))},initScenes:function(){this._inScene.setPosition(-cc.director.getWinSize().width,0)},action:function(){return cc.moveTo(this._duration,cc.p(0,0))},easeActionWithAction:function(a){return new cc.EaseOut(a,2)}}),cc.TransitionMoveInL.create=function(a,b){return new cc.TransitionMoveInL(a,b)},cc.TransitionMoveInR=cc.TransitionMoveInL.extend({ctor:function(a,b){cc.TransitionMoveInL.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},initScenes:function(){this._inScene.setPosition(cc.director.getWinSize().width,0)}}),cc.TransitionMoveInR.create=function(a,b){return new cc.TransitionMoveInR(a,b)},cc.TransitionMoveInT=cc.TransitionMoveInL.extend({ctor:function(a,b){cc.TransitionMoveInL.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},initScenes:function(){this._inScene.setPosition(0,cc.director.getWinSize().height)}}),cc.TransitionMoveInT.create=function(a,b){return new cc.TransitionMoveInT(a,b)},cc.TransitionMoveInB=cc.TransitionMoveInL.extend({ctor:function(a,b){cc.TransitionMoveInL.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},initScenes:function(){this._inScene.setPosition(0,-cc.director.getWinSize().height)}}),cc.TransitionMoveInB.create=function(a,b){return new cc.TransitionMoveInB(a,b)},cc.ADJUST_FACTOR=.5,cc.TransitionSlideInL=cc.TransitionScene.extend({ctor:function(a,b){cc.TransitionScene.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},_sceneOrder:function(){this._isInSceneOnTop=!1},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this),this.initScenes();var a=this.action(),b=this.action(),c=cc.sequence(this.easeActionWithAction(a),cc.callFunc(this.finish,this)),d=this.easeActionWithAction(b);this._inScene.runAction(c),this._outScene.runAction(d)},initScenes:function(){this._inScene.setPosition(-cc.director.getWinSize().width+cc.ADJUST_FACTOR,0)},action:function(){return cc.moveBy(this._duration,cc.p(cc.director.getWinSize().width-cc.ADJUST_FACTOR,0))},easeActionWithAction:function(a){return new cc.EaseInOut(a,2)}}),cc.TransitionSlideInL.create=function(a,b){return new cc.TransitionSlideInL(a,b)},cc.TransitionSlideInR=cc.TransitionSlideInL.extend({ctor:function(a,b){cc.TransitionSlideInL.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},_sceneOrder:function(){this._isInSceneOnTop=!0},initScenes:function(){this._inScene.setPosition(cc.director.getWinSize().width-cc.ADJUST_FACTOR,0)},action:function(){return cc.moveBy(this._duration,cc.p(-(cc.director.getWinSize().width-cc.ADJUST_FACTOR),0))}}),cc.TransitionSlideInR.create=function(a,b){return new cc.TransitionSlideInR(a,b)},cc.TransitionSlideInB=cc.TransitionSlideInL.extend({ctor:function(a,b){cc.TransitionSlideInL.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},_sceneOrder:function(){this._isInSceneOnTop=!1},initScenes:function(){this._inScene.setPosition(0,-(cc.director.getWinSize().height-cc.ADJUST_FACTOR))},action:function(){return cc.moveBy(this._duration,cc.p(0,cc.director.getWinSize().height-cc.ADJUST_FACTOR))}}),cc.TransitionSlideInB.create=function(a,b){return new cc.TransitionSlideInB(a,b)},cc.TransitionSlideInT=cc.TransitionSlideInL.extend({ctor:function(a,b){cc.TransitionSlideInL.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},_sceneOrder:function(){this._isInSceneOnTop=!0},initScenes:function(){this._inScene.setPosition(0,cc.director.getWinSize().height-cc.ADJUST_FACTOR)},action:function(){return cc.moveBy(this._duration,cc.p(0,-(cc.director.getWinSize().height-cc.ADJUST_FACTOR)))}}),cc.TransitionSlideInT.create=function(a,b){return new cc.TransitionSlideInT(a,b)},cc.TransitionShrinkGrow=cc.TransitionScene.extend({ctor:function(a,b){cc.TransitionScene.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this),this._inScene.attr({scale:.001,anchorX:2/3,anchorY:.5}),this._outScene.attr({scale:1,anchorX:1/3,anchorY:.5});var a=cc.scaleTo(this._duration,.01),b=cc.scaleTo(this._duration,1);this._inScene.runAction(cc.sequence(this.easeActionWithAction(b),cc.callFunc(this.finish,this))),this._outScene.runAction(this.easeActionWithAction(a))},easeActionWithAction:function(a){return new cc.EaseOut(a,2)}}),cc.TransitionShrinkGrow.create=function(a,b){return new cc.TransitionShrinkGrow(a,b)},cc.TransitionFlipX=cc.TransitionSceneOriented.extend({ctor:function(a,b,c){cc.TransitionSceneOriented.prototype.ctor.call(this),null==c&&(c=cc.TRANSITION_ORIENTATION_RIGHT_OVER),b&&this.initWithDuration(a,b,c)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,b;this._inScene.visible=!1;var c,d,e,f;this._orientation===cc.TRANSITION_ORIENTATION_RIGHT_OVER?(c=90,d=270,e=90,f=0):(c=-90,d=90,e=-90,f=0),a=cc.sequence(cc.delayTime(this._duration/2),cc.show(),cc.orbitCamera(this._duration/2,1,0,d,c,0,0),cc.callFunc(this.finish,this)),b=cc.sequence(cc.orbitCamera(this._duration/2,1,0,f,e,0,0),cc.hide(),cc.delayTime(this._duration/2)),this._inScene.runAction(a),this._outScene.runAction(b)}}),cc.TransitionFlipX.create=function(a,b,c){return new cc.TransitionFlipX(a,b,c)},cc.TransitionFlipY=cc.TransitionSceneOriented.extend({ctor:function(a,b,c){cc.TransitionSceneOriented.prototype.ctor.call(this),null==c&&(c=cc.TRANSITION_ORIENTATION_UP_OVER),b&&this.initWithDuration(a,b,c)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,b;this._inScene.visible=!1;var c,d,e,f;this._orientation===cc.TRANSITION_ORIENTATION_UP_OVER?(c=90,d=270,e=90,f=0):(c=-90,d=90,e=-90,f=0),a=cc.sequence(cc.delayTime(this._duration/2),cc.show(),cc.orbitCamera(this._duration/2,1,0,d,c,90,0),cc.callFunc(this.finish,this)),b=cc.sequence(cc.orbitCamera(this._duration/2,1,0,f,e,90,0),cc.hide(),cc.delayTime(this._duration/2)),this._inScene.runAction(a),this._outScene.runAction(b)}}),cc.TransitionFlipY.create=function(a,b,c){return new cc.TransitionFlipY(a,b,c)},cc.TransitionFlipAngular=cc.TransitionSceneOriented.extend({ctor:function(a,b,c){cc.TransitionSceneOriented.prototype.ctor.call(this),null==c&&(c=cc.TRANSITION_ORIENTATION_RIGHT_OVER),b&&this.initWithDuration(a,b,c)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,b;this._inScene.visible=!1;var c,d,e,f;this._orientation===cc.TRANSITION_ORIENTATION_RIGHT_OVER?(c=90,d=270,e=90,f=0):(c=-90,d=90,e=-90,f=0),a=cc.sequence(cc.delayTime(this._duration/2),cc.show(),cc.orbitCamera(this._duration/2,1,0,d,c,-45,0),cc.callFunc(this.finish,this)),b=cc.sequence(cc.orbitCamera(this._duration/2,1,0,f,e,45,0),cc.hide(),cc.delayTime(this._duration/2)),this._inScene.runAction(a),this._outScene.runAction(b)}}),cc.TransitionFlipAngular.create=function(a,b,c){return new cc.TransitionFlipAngular(a,b,c)},cc.TransitionZoomFlipX=cc.TransitionSceneOriented.extend({ctor:function(a,b,c){cc.TransitionSceneOriented.prototype.ctor.call(this),null==c&&(c=cc.TRANSITION_ORIENTATION_RIGHT_OVER),b&&this.initWithDuration(a,b,c)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,b;this._inScene.visible=!1;var c,d,e,f;this._orientation===cc.TRANSITION_ORIENTATION_RIGHT_OVER?(c=90,d=270,e=90,f=0):(c=-90,d=90,e=-90,f=0),a=cc.sequence(cc.delayTime(this._duration/2),cc.spawn(cc.orbitCamera(this._duration/2,1,0,d,c,0,0),cc.scaleTo(this._duration/2,1),cc.show()),cc.callFunc(this.finish,this)),b=cc.sequence(cc.spawn(cc.orbitCamera(this._duration/2,1,0,f,e,0,0),cc.scaleTo(this._duration/2,.5)),cc.hide(),cc.delayTime(this._duration/2)),this._inScene.scale=.5,this._inScene.runAction(a),this._outScene.runAction(b)}}),cc.TransitionZoomFlipX.create=function(a,b,c){return new cc.TransitionZoomFlipX(a,b,c)},cc.TransitionZoomFlipY=cc.TransitionSceneOriented.extend({ctor:function(a,b,c){cc.TransitionSceneOriented.prototype.ctor.call(this),null==c&&(c=cc.TRANSITION_ORIENTATION_UP_OVER),b&&this.initWithDuration(a,b,c)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,b;this._inScene.visible=!1;var c,d,e,f;this._orientation===cc.TRANSITION_ORIENTATION_UP_OVER?(c=90,d=270,e=90,f=0):(c=-90,d=90,e=-90,f=0),a=cc.sequence(cc.delayTime(this._duration/2),cc.spawn(cc.orbitCamera(this._duration/2,1,0,d,c,90,0),cc.scaleTo(this._duration/2,1),cc.show()),cc.callFunc(this.finish,this)),b=cc.sequence(cc.spawn(cc.orbitCamera(this._duration/2,1,0,f,e,90,0),cc.scaleTo(this._duration/2,.5)),cc.hide(),cc.delayTime(this._duration/2)),this._inScene.scale=.5,this._inScene.runAction(a),this._outScene.runAction(b)}}),cc.TransitionZoomFlipY.create=function(a,b,c){return new cc.TransitionZoomFlipY(a,b,c)},cc.TransitionZoomFlipAngular=cc.TransitionSceneOriented.extend({ctor:function(a,b,c){cc.TransitionSceneOriented.prototype.ctor.call(this),null==c&&(c=cc.TRANSITION_ORIENTATION_RIGHT_OVER),b&&this.initWithDuration(a,b,c)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,b;this._inScene.visible=!1;var c,d,e,f;this._orientation===cc.TRANSITION_ORIENTATION_RIGHT_OVER?(c=90,d=270,e=90,f=0):(c=-90,d=90,e=-90,f=0),a=cc.sequence(cc.delayTime(this._duration/2),cc.spawn(cc.orbitCamera(this._duration/2,1,0,d,c,-45,0),cc.scaleTo(this._duration/2,1),cc.show()),cc.show(),cc.callFunc(this.finish,this)),b=cc.sequence(cc.spawn(cc.orbitCamera(this._duration/2,1,0,f,e,45,0),cc.scaleTo(this._duration/2,.5)),cc.hide(),cc.delayTime(this._duration/2)),this._inScene.scale=.5,this._inScene.runAction(a),this._outScene.runAction(b)}}),cc.TransitionZoomFlipAngular.create=function(a,b,c){return new cc.TransitionZoomFlipAngular(a,b,c)},cc.TransitionFade=cc.TransitionScene.extend({_color:null,ctor:function(a,b,c){cc.TransitionScene.prototype.ctor.call(this),this._color=cc.color(),b&&this.initWithDuration(a,b,c)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a=new cc.LayerColor(this._color);this._inScene.visible=!1,this.addChild(a,2,cc.SCENE_FADE);var b=this.getChildByTag(cc.SCENE_FADE),c=cc.sequence(cc.fadeIn(this._duration/2),cc.callFunc(this.hideOutShowIn,this),cc.fadeOut(this._duration/2),cc.callFunc(this.finish,this));b.runAction(c)},onExit:function(){cc.TransitionScene.prototype.onExit.call(this),this.removeChildByTag(cc.SCENE_FADE,!1)},initWithDuration:function(a,b,c){return c=c||cc.color.BLACK,cc.TransitionScene.prototype.initWithDuration.call(this,a,b)&&(this._color.r=c.r,this._color.g=c.g,this._color.b=c.b,this._color.a=0),!0}}),cc.TransitionFade.create=function(a,b,c){return new cc.TransitionFade(a,b,c)},cc.TransitionCrossFade=cc.TransitionScene.extend({ctor:function(a,b){cc.TransitionScene.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a=cc.color(0,0,0,0),b=cc.director.getWinSize(),c=new cc.LayerColor(a),d=new cc.RenderTexture(b.width,b.height);d.sprite.anchorX=.5,d.sprite.anchorY=.5,d.attr({x:b.width/2,y:b.height/2,anchorX:.5,anchorY:.5}),d.begin(),this._inScene.visit(),d.end();var e=new cc.RenderTexture(b.width,b.height);e.setPosition(b.width/2,b.height/2),e.sprite.anchorX=e.anchorX=.5,e.sprite.anchorY=e.anchorY=.5,e.begin(),this._outScene.visit(),e.end(),d.sprite.setBlendFunc(cc.ONE,cc.ONE),e.sprite.setBlendFunc(cc.SRC_ALPHA,cc.ONE_MINUS_SRC_ALPHA),c.addChild(d),c.addChild(e),d.sprite.opacity=255,e.sprite.opacity=255;var f=cc.sequence(cc.fadeTo(this._duration,0),cc.callFunc(this.hideOutShowIn,this),cc.callFunc(this.finish,this));e.sprite.runAction(f),this.addChild(c,2,cc.SCENE_FADE)},onExit:function(){this.removeChildByTag(cc.SCENE_FADE,!1),cc.TransitionScene.prototype.onExit.call(this)},visit:function(){cc.Node.prototype.visit.call(this)},draw:function(){}}),cc.TransitionCrossFade.create=function(a,b){return new cc.TransitionCrossFade(a,b)},cc.TransitionTurnOffTiles=cc.TransitionScene.extend({_gridProxy:null,ctor:function(a,b){cc.TransitionScene.prototype.ctor.call(this),this._gridProxy=new cc.NodeGrid,b&&this.initWithDuration(a,b)},_sceneOrder:function(){this._isInSceneOnTop=!1},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this),this._gridProxy.setTarget(this._outScene),this._gridProxy.onEnter();var a=cc.director.getWinSize(),b=a.width/a.height,c=0|12*b,d=12,e=cc.turnOffTiles(this._duration,cc.size(c,d)),f=this.easeActionWithAction(e);this._gridProxy.runAction(cc.sequence(f,cc.callFunc(this.finish,this),cc.stopGrid()))},visit:function(){this._inScene.visit(),this._gridProxy.visit()},easeActionWithAction:function(a){return a}}),cc.TransitionTurnOffTiles.create=function(a,b){return new cc.TransitionTurnOffTiles(a,b)},cc.TransitionSplitCols=cc.TransitionScene.extend({_gridProxy:null,_switchTargetToInscene:function(){this._gridProxy.setTarget(this._inScene)},ctor:function(a,b){cc.TransitionScene.prototype.ctor.call(this),this._gridProxy=new cc.NodeGrid,b&&this.initWithDuration(a,b)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this),this._gridProxy.setTarget(this._outScene),this._gridProxy.onEnter();var a=this.action(),b=cc.sequence(a,cc.callFunc(this._switchTargetToInscene,this),a.reverse());this._gridProxy.runAction(cc.sequence(this.easeActionWithAction(b),cc.callFunc(this.finish,this),cc.stopGrid()))},onExit:function(){this._gridProxy.setTarget(null),this._gridProxy.onExit(),cc.TransitionScene.prototype.onExit.call(this)},visit:function(){this._gridProxy.visit()},easeActionWithAction:function(a){return new cc.EaseInOut(a,3)},action:function(){return cc.splitCols(this._duration/2,3)}}),cc.TransitionSplitCols.create=function(a,b){return new cc.TransitionSplitCols(a,b)},cc.TransitionSplitRows=cc.TransitionSplitCols.extend({ctor:function(a,b){cc.TransitionSplitCols.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},action:function(){return cc.splitRows(this._duration/2,3)}}),cc.TransitionSplitRows.create=function(a,b){return new cc.TransitionSplitRows(a,b)},cc.TransitionFadeTR=cc.TransitionScene.extend({_gridProxy:null,ctor:function(a,b){cc.TransitionScene.prototype.ctor.call(this),this._gridProxy=new cc.NodeGrid,b&&this.initWithDuration(a,b)},_sceneOrder:function(){this._isInSceneOnTop=!1},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this),this._gridProxy.setTarget(this._outScene),this._gridProxy.onEnter();var a=cc.director.getWinSize(),b=a.width/a.height,c=0|12*b,d=12,e=this.actionWithSize(cc.size(c,d));this._gridProxy.runAction(cc.sequence(this.easeActionWithAction(e),cc.callFunc(this.finish,this),cc.stopGrid()))},visit:function(){this._inScene.visit(),this._gridProxy.visit()},easeActionWithAction:function(a){return a},actionWithSize:function(a){return cc.fadeOutTRTiles(this._duration,a)}}),cc.TransitionFadeTR.create=function(a,b){return new cc.TransitionFadeTR(a,b)},cc.TransitionFadeBL=cc.TransitionFadeTR.extend({ctor:function(a,b){cc.TransitionFadeTR.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},actionWithSize:function(a){return cc.fadeOutBLTiles(this._duration,a)}}),cc.TransitionFadeBL.create=function(a,b){return new cc.TransitionFadeBL(a,b)},cc.TransitionFadeUp=cc.TransitionFadeTR.extend({ctor:function(a,b){cc.TransitionFadeTR.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},actionWithSize:function(a){return new cc.FadeOutUpTiles(this._duration,a)}}),cc.TransitionFadeUp.create=function(a,b){return new cc.TransitionFadeUp(a,b)},cc.TransitionFadeDown=cc.TransitionFadeTR.extend({ctor:function(a,b){cc.TransitionFadeTR.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},actionWithSize:function(a){return cc.fadeOutDownTiles(this._duration,a)}}),cc.TransitionFadeDown.create=function(a,b){return new cc.TransitionFadeDown(a,b)},cc.SCENE_RADIAL=49153,cc.TransitionProgress=cc.TransitionScene.extend({_to:0,_from:0,_sceneToBeModified:null,_className:"TransitionProgress",ctor:function(a,b){cc.TransitionScene.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},_setAttrs:function(a,b,c){a.attr({x:b,y:c,anchorX:.5,anchorY:.5})},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this),this._setupTransition();var a=cc.director.getWinSize(),b=new cc.RenderTexture(a.width,a.height);b.sprite.anchorX=.5,b.sprite.anchorY=.5,this._setAttrs(b,a.width/2,a.height/2),b.clear(0,0,0,1),b.begin(),this._sceneToBeModified.visit(),b.end(),this._sceneToBeModified===this._outScene&&this.hideOutShowIn();var c=this._progressTimerNodeWithRenderTexture(b),d=cc.sequence(cc.progressFromTo(this._duration,this._from,this._to),cc.callFunc(this.finish,this));c.runAction(d),this.addChild(c,2,cc.SCENE_RADIAL)},onExit:function(){this.removeChildByTag(cc.SCENE_RADIAL,!0),cc.TransitionScene.prototype.onExit.call(this)},_setupTransition:function(){this._sceneToBeModified=this._outScene,this._from=100,this._to=0},_progressTimerNodeWithRenderTexture:function(a){return cc.log("cc.TransitionProgress._progressTimerNodeWithRenderTexture(): should be overridden in subclass"),null},_sceneOrder:function(){this._isInSceneOnTop=!1}}),cc.TransitionProgress.create=function(a,b){return new cc.TransitionProgress(a,b)},cc.TransitionProgressRadialCCW=cc.TransitionProgress.extend({ctor:function(a,b){cc.TransitionProgress.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},_progressTimerNodeWithRenderTexture:function(a){var b=cc.director.getWinSize(),c=new cc.ProgressTimer(a.sprite);return cc._renderType===cc.game.RENDER_TYPE_WEBGL&&(c.sprite.flippedY=!0),c.type=cc.ProgressTimer.TYPE_RADIAL,c.reverseDir=!1,c.percentage=100,this._setAttrs(c,b.width/2,b.height/2),c}}),cc.TransitionProgressRadialCCW.create=function(a,b){return new cc.TransitionProgressRadialCCW(a,b)},cc.TransitionProgressRadialCW=cc.TransitionProgress.extend({ctor:function(a,b){cc.TransitionProgress.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},_progressTimerNodeWithRenderTexture:function(a){var b=cc.director.getWinSize(),c=new cc.ProgressTimer(a.sprite);return cc._renderType===cc.game.RENDER_TYPE_WEBGL&&(c.sprite.flippedY=!0),c.type=cc.ProgressTimer.TYPE_RADIAL,c.reverseDir=!0,c.percentage=100,this._setAttrs(c,b.width/2,b.height/2),c}}),cc.TransitionProgressRadialCW.create=function(a,b){var c=new cc.TransitionProgressRadialCW;return null!==c&&c.initWithDuration(a,b)?c:new cc.TransitionProgressRadialCW(a,b)},cc.TransitionProgressHorizontal=cc.TransitionProgress.extend({ctor:function(a,b){cc.TransitionProgress.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},_progressTimerNodeWithRenderTexture:function(a){var b=cc.director.getWinSize(),c=new cc.ProgressTimer(a.sprite);return cc._renderType===cc.game.RENDER_TYPE_WEBGL&&(c.sprite.flippedY=!0),c.type=cc.ProgressTimer.TYPE_BAR,c.midPoint=cc.p(1,0),c.barChangeRate=cc.p(1,0),c.percentage=100,this._setAttrs(c,b.width/2,b.height/2),c}}),cc.TransitionProgressHorizontal.create=function(a,b){return new cc.TransitionProgressHorizontal(a,b)},cc.TransitionProgressVertical=cc.TransitionProgress.extend({ctor:function(a,b){cc.TransitionProgress.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},_progressTimerNodeWithRenderTexture:function(a){var b=cc.director.getWinSize(),c=new cc.ProgressTimer(a.sprite);return cc._renderType===cc.game.RENDER_TYPE_WEBGL&&(c.sprite.flippedY=!0),c.type=cc.ProgressTimer.TYPE_BAR,c.midPoint=cc.p(0,0),c.barChangeRate=cc.p(0,1),c.percentage=100,this._setAttrs(c,b.width/2,b.height/2),c}}),cc.TransitionProgressVertical.create=function(a,b){return new cc.TransitionProgressVertical(a,b)},cc.TransitionProgressInOut=cc.TransitionProgress.extend({ctor:function(a,b){cc.TransitionProgress.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},_progressTimerNodeWithRenderTexture:function(a){var b=cc.director.getWinSize(),c=new cc.ProgressTimer(a.sprite);return cc._renderType===cc.game.RENDER_TYPE_WEBGL&&(c.sprite.flippedY=!0),c.type=cc.ProgressTimer.TYPE_BAR,c.midPoint=cc.p(.5,.5),c.barChangeRate=cc.p(1,1),c.percentage=0,this._setAttrs(c,b.width/2,b.height/2),c},_sceneOrder:function(){this._isInSceneOnTop=!1},_setupTransition:function(){this._sceneToBeModified=this._inScene,this._from=0,this._to=100}}),cc.TransitionProgressInOut.create=function(a,b){return new cc.TransitionProgressInOut(a,b)},cc.TransitionProgressOutIn=cc.TransitionProgress.extend({ctor:function(a,b){cc.TransitionProgress.prototype.ctor.call(this),b&&this.initWithDuration(a,b)},_progressTimerNodeWithRenderTexture:function(a){var b=cc.director.getWinSize(),c=new cc.ProgressTimer(a.sprite);return cc._renderType===cc.game.RENDER_TYPE_WEBGL&&(c.sprite.flippedY=!0),c.type=cc.ProgressTimer.TYPE_BAR,c.midPoint=cc.p(.5,.5),c.barChangeRate=cc.p(1,1),c.percentage=100,this._setAttrs(c,b.width/2,b.height/2),c}}),cc.TransitionProgressOutIn.create=function(a,b){return new cc.TransitionProgressOutIn(a,b)},cc.TransitionPageTurn=cc.TransitionScene.extend({ctor:function(a,b,c){cc.TransitionScene.prototype.ctor.call(this),this._gridProxy=new cc.NodeGrid,this.initWithDuration(a,b,c)},_back:!0,_gridProxy:null,_className:"TransitionPageTurn",initWithDuration:function(a,b,c){return this._back=c,cc.TransitionScene.prototype.initWithDuration.call(this,a,b),!0},actionWithSize:function(a){return this._back?cc.reverseTime(cc.pageTurn3D(this._duration,a)):cc.pageTurn3D(this._duration,a)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,b,c=cc.director.getWinSize();c.width>c.height?(a=16,b=12):(a=12,b=16);var d=this.actionWithSize(cc.size(a,b)),e=this._gridProxy;this._back?(e.setTarget(this._inScene),e.onEnter(),this._inScene.visible=!1,e.runAction(cc.sequence(d,cc.callFunc(this.finish,this),cc.stopGrid())),this._inScene.runAction(cc.show())):(e.setTarget(this._outScene),e.onEnter(),e.runAction(cc.sequence(d,cc.callFunc(this.finish,this),cc.stopGrid())))},visit:function(){this._back?this._outScene.visit():this._inScene.visit(),this._gridProxy.visit()},_sceneOrder:function(){this._isInSceneOnTop=this._back}}),cc.TransitionPageTurn.create=function(a,b,c){return new cc.TransitionPageTurn(a,b,c)};
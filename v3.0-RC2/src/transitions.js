cc.SCENE_FADE = 4208917214;
cc.TRANSITION_ORIENTATION_LEFT_OVER = 0;
cc.TRANSITION_ORIENTATION_RIGHT_OVER = 1;
cc.TRANSITION_ORIENTATION_UP_OVER = 0;
cc.TRANSITION_ORIENTATION_DOWN_OVER = 1;
cc.TransitionScene = cc.Scene.extend({_inScene: null, _outScene: null, _duration: null, _isInSceneOnTop: false, _isSendCleanupToScene: false, _className: "TransitionScene", ctor: function (t, scene) {
    cc.Scene.prototype.ctor.call(this);
    if (t !== undefined && scene !== undefined)this.initWithDuration(t, scene)
}, _setNewScene: function (dt) {
    this.unschedule(this._setNewScene);
    var director = cc.director;
    this._isSendCleanupToScene = director.isSendCleanupToScene();
    director.runScene(this._inScene);
    cc.eventManager.setEnabled(true);
    this._outScene.visible =
        true
}, _sceneOrder: function () {
    this._isInSceneOnTop = true
}, draw: function () {
    if (this._isInSceneOnTop) {
        this._outScene.visit();
        this._inScene.visit()
    } else {
        this._inScene.visit();
        this._outScene.visit()
    }
}, onEnter: function () {
    cc.Node.prototype.onEnter.call(this);
    cc.eventManager.setEnabled(false);
    this._outScene.onExitTransitionDidStart();
    this._inScene.onEnter()
}, onExit: function () {
    cc.Node.prototype.onExit.call(this);
    cc.eventManager.setEnabled(true);
    this._outScene.onExit();
    this._inScene.onEnterTransitionDidFinish()
},
    cleanup: function () {
        cc.Node.prototype.cleanup.call(this);
        if (this._isSendCleanupToScene)this._outScene.cleanup()
    }, initWithDuration: function (t, scene) {
        if (!scene)throw"cc.TransitionScene.initWithDuration(): Argument scene must be non-nil";
        if (this.init()) {
            this._duration = t;
            this.attr({x: 0, y: 0, anchorX: 0, anchorY: 0});
            this._inScene = scene;
            this._outScene = cc.director.getRunningScene();
            if (!this._outScene) {
                this._outScene = cc.Scene.create();
                this._outScene.init()
            }
            if (this._inScene == this._outScene)throw"cc.TransitionScene.initWithDuration(): Incoming scene must be different from the outgoing scene";
            this._sceneOrder();
            return true
        } else return false
    }, finish: function () {
        this._inScene.attr({visible: true, x: 0, y: 0, scale: 1, rotation: 0});
        if (cc._renderType === cc._RENDER_TYPE_WEBGL)this._inScene.getCamera().restore();
        this._outScene.attr({visible: false, x: 0, y: 0, scale: 1, rotation: 0});
        if (cc._renderType === cc._RENDER_TYPE_WEBGL)this._outScene.getCamera().restore();
        this.schedule(this._setNewScene, 0)
    }, hideOutShowIn: function () {
        this._inScene.visible = true;
        this._outScene.visible = false
    }});
cc.TransitionScene.create = function (t, scene) {
    return new cc.TransitionScene(t, scene)
};
cc.TransitionSceneOriented = cc.TransitionScene.extend({_orientation: 0, ctor: function (t, scene, orientation) {
    cc.TransitionScene.prototype.ctor.call(this);
    orientation != undefined && this.initWithDuration(t, scene, orientation)
}, initWithDuration: function (t, scene, orientation) {
    if (cc.TransitionScene.prototype.initWithDuration.call(this, t, scene))this._orientation = orientation;
    return true
}});
cc.TransitionSceneOriented.create = function (t, scene, orientation) {
    return new cc.TransitionSceneOriented(t, scene, orientation)
};
cc.TransitionRotoZoom = cc.TransitionScene.extend({ctor: function (t, scene) {
    cc.TransitionScene.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    this._inScene.attr({scale: 0.001, anchorX: 0.5, anchorY: 0.5});
    this._outScene.attr({scale: 1, anchorX: 0.5, anchorY: 0.5});
    var rotoZoom = cc.Sequence.create(cc.Spawn.create(cc.ScaleBy.create(this._duration / 2, 0.001), cc.RotateBy.create(this._duration / 2, 360 * 2)), cc.DelayTime.create(this._duration /
        2));
    this._outScene.runAction(rotoZoom);
    this._inScene.runAction(cc.Sequence.create(rotoZoom.reverse(), cc.CallFunc.create(this.finish, this)))
}});
cc.TransitionRotoZoom.create = function (t, scene) {
    return new cc.TransitionRotoZoom(t, scene)
};
cc.TransitionJumpZoom = cc.TransitionScene.extend({ctor: function (t, scene) {
    cc.TransitionScene.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    var winSize = cc.director.getWinSize();
    this._inScene.attr({scale: 0.5, x: winSize.width, y: 0, anchorX: 0.5, anchorY: 0.5});
    this._outScene.anchorX = 0.5;
    this._outScene.anchorY = 0.5;
    var jump = cc.JumpBy.create(this._duration / 4, cc.p(-winSize.width, 0), winSize.width / 4, 2);
    var scaleIn = cc.ScaleTo.create(this._duration /
        4, 1);
    var scaleOut = cc.ScaleTo.create(this._duration / 4, 0.5);
    var jumpZoomOut = cc.Sequence.create(scaleOut, jump);
    var jumpZoomIn = cc.Sequence.create(jump, scaleIn);
    var delay = cc.DelayTime.create(this._duration / 2);
    this._outScene.runAction(jumpZoomOut);
    this._inScene.runAction(cc.Sequence.create(delay, jumpZoomIn, cc.CallFunc.create(this.finish, this)))
}});
cc.TransitionJumpZoom.create = function (t, scene) {
    return new cc.TransitionJumpZoom(t, scene)
};
cc.TransitionMoveInL = cc.TransitionScene.extend({ctor: function (t, scene) {
    cc.TransitionScene.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    this.initScenes();
    var action = this.action();
    this._inScene.runAction(cc.Sequence.create(this.easeActionWithAction(action), cc.CallFunc.create(this.finish, this)))
}, initScenes: function () {
    this._inScene.setPosition(-cc.director.getWinSize().width, 0)
}, action: function () {
    return cc.MoveTo.create(this._duration,
        cc.p(0, 0))
}, easeActionWithAction: function (action) {
    return cc.EaseOut.create(action, 2)
}});
cc.TransitionMoveInL.create = function (t, scene) {
    return new cc.TransitionMoveInL(t, scene)
};
cc.TransitionMoveInR = cc.TransitionMoveInL.extend({ctor: function (t, scene) {
    cc.TransitionMoveInL.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, initScenes: function () {
    this._inScene.setPosition(cc.director.getWinSize().width, 0)
}});
cc.TransitionMoveInR.create = function (t, scene) {
    return new cc.TransitionMoveInR(t, scene)
};
cc.TransitionMoveInT = cc.TransitionMoveInL.extend({ctor: function (t, scene) {
    cc.TransitionMoveInL.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, initScenes: function () {
    this._inScene.setPosition(0, cc.director.getWinSize().height)
}});
cc.TransitionMoveInT.create = function (t, scene) {
    return new cc.TransitionMoveInT(t, scene)
};
cc.TransitionMoveInB = cc.TransitionMoveInL.extend({ctor: function (t, scene) {
    cc.TransitionMoveInL.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, initScenes: function () {
    this._inScene.setPosition(0, -cc.director.getWinSize().height)
}});
cc.TransitionMoveInB.create = function (t, scene) {
    return new cc.TransitionMoveInB(t, scene)
};
cc.ADJUST_FACTOR = 0.5;
cc.TransitionSlideInL = cc.TransitionScene.extend({ctor: function (t, scene) {
    cc.TransitionScene.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _sceneOrder: function () {
    this._isInSceneOnTop = false
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    this.initScenes();
    var inA = this.action();
    var outA = this.action();
    var inAction = this.easeActionWithAction(inA);
    var outAction = cc.Sequence.create(this.easeActionWithAction(outA), cc.CallFunc.create(this.finish, this));
    this._inScene.runAction(inAction);
    this._outScene.runAction(outAction)
}, initScenes: function () {
    this._inScene.setPosition(-cc.director.getWinSize().width + cc.ADJUST_FACTOR, 0)
}, action: function () {
    return cc.MoveBy.create(this._duration, cc.p(cc.director.getWinSize().width - cc.ADJUST_FACTOR, 0))
}, easeActionWithAction: function (action) {
    return cc.EaseOut.create(action, 2)
}});
cc.TransitionSlideInL.create = function (t, scene) {
    return new cc.TransitionSlideInL(t, scene)
};
cc.TransitionSlideInR = cc.TransitionSlideInL.extend({ctor: function (t, scene) {
    cc.TransitionSlideInL.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _sceneOrder: function () {
    this._isInSceneOnTop = true
}, initScenes: function () {
    this._inScene.setPosition(cc.director.getWinSize().width - cc.ADJUST_FACTOR, 0)
}, action: function () {
    return cc.MoveBy.create(this._duration, cc.p(-(cc.director.getWinSize().width - cc.ADJUST_FACTOR), 0))
}});
cc.TransitionSlideInR.create = function (t, scene) {
    return new cc.TransitionSlideInR(t, scene)
};
cc.TransitionSlideInB = cc.TransitionSlideInL.extend({ctor: function (t, scene) {
    cc.TransitionSlideInL.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _sceneOrder: function () {
    this._isInSceneOnTop = false
}, initScenes: function () {
    this._inScene.setPosition(0, -(cc.director.getWinSize().height - cc.ADJUST_FACTOR))
}, action: function () {
    return cc.MoveBy.create(this._duration, cc.p(0, cc.director.getWinSize().height - cc.ADJUST_FACTOR))
}});
cc.TransitionSlideInB.create = function (t, scene) {
    return new cc.TransitionSlideInB(t, scene)
};
cc.TransitionSlideInT = cc.TransitionSlideInL.extend({ctor: function (t, scene) {
    cc.TransitionSlideInL.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _sceneOrder: function () {
    this._isInSceneOnTop = true
}, initScenes: function () {
    this._inScene.setPosition(0, cc.director.getWinSize().height - cc.ADJUST_FACTOR)
}, action: function () {
    return cc.MoveBy.create(this._duration, cc.p(0, -(cc.director.getWinSize().height - cc.ADJUST_FACTOR)))
}});
cc.TransitionSlideInT.create = function (t, scene) {
    return new cc.TransitionSlideInT(t, scene)
};
cc.TransitionShrinkGrow = cc.TransitionScene.extend({ctor: function (t, scene) {
    cc.TransitionScene.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    this._inScene.attr({scale: 0.001, anchorX: 2 / 3, anchorY: 0.5});
    this._outScene.attr({scale: 1, anchorX: 1 / 3, anchorY: 0.5});
    var scaleOut = cc.ScaleTo.create(this._duration, 0.01);
    var scaleIn = cc.ScaleTo.create(this._duration, 1);
    this._inScene.runAction(this.easeActionWithAction(scaleIn));
    this._outScene.runAction(cc.Sequence.create(this.easeActionWithAction(scaleOut),
        cc.CallFunc.create(this.finish, this)))
}, easeActionWithAction: function (action) {
    return cc.EaseOut.create(action, 2)
}});
cc.TransitionShrinkGrow.create = function (t, scene) {
    return new cc.TransitionShrinkGrow(t, scene)
};
cc.TransitionFlipX = cc.TransitionSceneOriented.extend({ctor: function (t, scene, o) {
    cc.TransitionSceneOriented.prototype.ctor.call(this);
    o = o || cc.TRANSITION_ORIENTATION_RIGHT_OVER;
    scene && this.initWithDuration(t, scene, o)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    var inA, outA;
    this._inScene.visible = false;
    var inDeltaZ, inAngleZ, outDeltaZ, outAngleZ;
    if (this._orientation === cc.TRANSITION_ORIENTATION_RIGHT_OVER) {
        inDeltaZ = 90;
        inAngleZ = 270;
        outDeltaZ = 90;
        outAngleZ = 0
    } else {
        inDeltaZ = -90;
        inAngleZ =
            90;
        outDeltaZ = -90;
        outAngleZ = 0
    }
    inA = cc.Sequence.create(cc.DelayTime.create(this._duration / 2), cc.Show.create(), cc.OrbitCamera.create(this._duration / 2, 1, 0, inAngleZ, inDeltaZ, 0, 0), cc.CallFunc.create(this.finish, this));
    outA = cc.Sequence.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, outAngleZ, outDeltaZ, 0, 0), cc.Hide.create(), cc.DelayTime.create(this._duration / 2));
    this._inScene.runAction(inA);
    this._outScene.runAction(outA)
}});
cc.TransitionFlipX.create = function (t, scene, o) {
    return new cc.TransitionFlipX(t, scene, o)
};
cc.TransitionFlipY = cc.TransitionSceneOriented.extend({ctor: function (t, scene, o) {
    cc.TransitionSceneOriented.prototype.ctor.call(this);
    o = o || cc.TRANSITION_ORIENTATION_UP_OVER;
    scene && this.initWithDuration(t, scene, o)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    var inA, outA;
    this._inScene.visible = false;
    var inDeltaZ, inAngleZ, outDeltaZ, outAngleZ;
    if (this._orientation == cc.TRANSITION_ORIENTATION_UP_OVER) {
        inDeltaZ = 90;
        inAngleZ = 270;
        outDeltaZ = 90;
        outAngleZ = 0
    } else {
        inDeltaZ = -90;
        inAngleZ = 90;
        outDeltaZ = -90;
        outAngleZ = 0
    }
    inA = cc.Sequence.create(cc.DelayTime.create(this._duration / 2), cc.Show.create(), cc.OrbitCamera.create(this._duration / 2, 1, 0, inAngleZ, inDeltaZ, 90, 0), cc.CallFunc.create(this.finish, this));
    outA = cc.Sequence.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, outAngleZ, outDeltaZ, 90, 0), cc.Hide.create(), cc.DelayTime.create(this._duration / 2));
    this._inScene.runAction(inA);
    this._outScene.runAction(outA)
}});
cc.TransitionFlipY.create = function (t, scene, o) {
    return new cc.TransitionFlipY(t, scene, o)
};
cc.TransitionFlipAngular = cc.TransitionSceneOriented.extend({ctor: function (t, scene, o) {
    cc.TransitionSceneOriented.prototype.ctor.call(this);
    o = o || cc.TRANSITION_ORIENTATION_RIGHT_OVER;
    scene && this.initWithDuration(t, scene, o)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    var inA, outA;
    this._inScene.visible = false;
    var inDeltaZ, inAngleZ, outDeltaZ, outAngleZ;
    if (this._orientation === cc.TRANSITION_ORIENTATION_RIGHT_OVER) {
        inDeltaZ = 90;
        inAngleZ = 270;
        outDeltaZ = 90;
        outAngleZ = 0
    } else {
        inDeltaZ = -90;
        inAngleZ =
            90;
        outDeltaZ = -90;
        outAngleZ = 0
    }
    inA = cc.Sequence.create(cc.DelayTime.create(this._duration / 2), cc.Show.create(), cc.OrbitCamera.create(this._duration / 2, 1, 0, inAngleZ, inDeltaZ, -45, 0), cc.CallFunc.create(this.finish, this));
    outA = cc.Sequence.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, outAngleZ, outDeltaZ, 45, 0), cc.Hide.create(), cc.DelayTime.create(this._duration / 2));
    this._inScene.runAction(inA);
    this._outScene.runAction(outA)
}});
cc.TransitionFlipAngular.create = function (t, scene, o) {
    return new cc.TransitionFlipAngular(t, scene, o)
};
cc.TransitionZoomFlipX = cc.TransitionSceneOriented.extend({ctor: function (t, scene, o) {
    cc.TransitionSceneOriented.prototype.ctor.call(this);
    o = o || cc.TRANSITION_ORIENTATION_RIGHT_OVER;
    scene && this.initWithDuration(t, scene, o)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    var inA, outA;
    this._inScene.visible = false;
    var inDeltaZ, inAngleZ, outDeltaZ, outAngleZ;
    if (this._orientation === cc.TRANSITION_ORIENTATION_RIGHT_OVER) {
        inDeltaZ = 90;
        inAngleZ = 270;
        outDeltaZ = 90;
        outAngleZ = 0
    } else {
        inDeltaZ = -90;
        inAngleZ =
            90;
        outDeltaZ = -90;
        outAngleZ = 0
    }
    inA = cc.Sequence.create(cc.DelayTime.create(this._duration / 2), cc.Spawn.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, inAngleZ, inDeltaZ, 0, 0), cc.ScaleTo.create(this._duration / 2, 1), cc.Show.create()), cc.CallFunc.create(this.finish, this));
    outA = cc.Sequence.create(cc.Spawn.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, outAngleZ, outDeltaZ, 0, 0), cc.ScaleTo.create(this._duration / 2, 0.5)), cc.Hide.create(), cc.DelayTime.create(this._duration / 2));
    this._inScene.scale = 0.5;
    this._inScene.runAction(inA);
    this._outScene.runAction(outA)
}});
cc.TransitionZoomFlipX.create = function (t, scene, o) {
    return new cc.TransitionZoomFlipX(t, scene, o)
};
cc.TransitionZoomFlipY = cc.TransitionSceneOriented.extend({ctor: function (t, scene, o) {
    cc.TransitionSceneOriented.prototype.ctor.call(this);
    o = o || cc.TRANSITION_ORIENTATION_UP_OVER;
    scene && this.initWithDuration(t, scene, o)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    var inA, outA;
    this._inScene.visible = false;
    var inDeltaZ, inAngleZ, outDeltaZ, outAngleZ;
    if (this._orientation === cc.TRANSITION_ORIENTATION_UP_OVER) {
        inDeltaZ = 90;
        inAngleZ = 270;
        outDeltaZ = 90;
        outAngleZ = 0
    } else {
        inDeltaZ = -90;
        inAngleZ =
            90;
        outDeltaZ = -90;
        outAngleZ = 0
    }
    inA = cc.Sequence.create(cc.DelayTime.create(this._duration / 2), cc.Spawn.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, inAngleZ, inDeltaZ, 90, 0), cc.ScaleTo.create(this._duration / 2, 1), cc.Show.create()), cc.CallFunc.create(this.finish, this));
    outA = cc.Sequence.create(cc.Spawn.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, outAngleZ, outDeltaZ, 90, 0), cc.ScaleTo.create(this._duration / 2, 0.5)), cc.Hide.create(), cc.DelayTime.create(this._duration / 2));
    this._inScene.scale = 0.5;
    this._inScene.runAction(inA);
    this._outScene.runAction(outA)
}});
cc.TransitionZoomFlipY.create = function (t, scene, o) {
    return new cc.TransitionZoomFlipY(t, scene, o)
};
cc.TransitionZoomFlipAngular = cc.TransitionSceneOriented.extend({ctor: function (t, scene, o) {
    cc.TransitionSceneOriented.prototype.ctor.call(this);
    o = o || cc.TRANSITION_ORIENTATION_RIGHT_OVER;
    scene && this.initWithDuration(t, scene, o)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    var inA, outA;
    this._inScene.visible = false;
    var inDeltaZ, inAngleZ, outDeltaZ, outAngleZ;
    if (this._orientation === cc.TRANSITION_ORIENTATION_RIGHT_OVER) {
        inDeltaZ = 90;
        inAngleZ = 270;
        outDeltaZ = 90;
        outAngleZ = 0
    } else {
        inDeltaZ = -90;
        inAngleZ = 90;
        outDeltaZ = -90;
        outAngleZ = 0
    }
    inA = cc.Sequence.create(cc.DelayTime.create(this._duration / 2), cc.Spawn.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, inAngleZ, inDeltaZ, -45, 0), cc.ScaleTo.create(this._duration / 2, 1), cc.Show.create()), cc.Show.create(), cc.CallFunc.create(this.finish, this));
    outA = cc.Sequence.create(cc.Spawn.create(cc.OrbitCamera.create(this._duration / 2, 1, 0, outAngleZ, outDeltaZ, 45, 0), cc.ScaleTo.create(this._duration / 2, 0.5)), cc.Hide.create(), cc.DelayTime.create(this._duration / 2));
    this._inScene.scale =
        0.5;
    this._inScene.runAction(inA);
    this._outScene.runAction(outA)
}});
cc.TransitionZoomFlipAngular.create = function (t, scene, o) {
    return new cc.TransitionZoomFlipAngular(t, scene, o)
};
cc.TransitionFade = cc.TransitionScene.extend({_color: null, ctor: function (t, scene, color) {
    cc.TransitionScene.prototype.ctor.call(this);
    this._color = cc.color();
    scene && this.initWithDuration(t, scene, color)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    var l = cc.LayerColor.create(this._color);
    this._inScene.visible = false;
    this.addChild(l, 2, cc.SCENE_FADE);
    var f = this.getChildByTag(cc.SCENE_FADE);
    var a = cc.Sequence.create(cc.FadeIn.create(this._duration / 2), cc.CallFunc.create(this.hideOutShowIn,
        this), cc.FadeOut.create(this._duration / 2), cc.CallFunc.create(this.finish, this));
    f.runAction(a)
}, onExit: function () {
    cc.TransitionScene.prototype.onExit.call(this);
    this.removeChildByTag(cc.SCENE_FADE, false)
}, initWithDuration: function (t, scene, color) {
    color = color || cc.color.BLACK;
    if (cc.TransitionScene.prototype.initWithDuration.call(this, t, scene)) {
        this._color.r = color.r;
        this._color.g = color.g;
        this._color.b = color.b;
        this._color.a = 0
    }
    return true
}});
cc.TransitionFade.create = function (t, scene, color) {
    return new cc.TransitionFade(t, scene, color)
};
cc.TransitionCrossFade = cc.TransitionScene.extend({ctor: function (t, scene) {
    cc.TransitionScene.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    var color = cc.color(0, 0, 0, 0);
    var winSize = cc.director.getWinSize();
    var layer = cc.LayerColor.create(color);
    var inTexture = cc.RenderTexture.create(winSize.width, winSize.height);
    if (null == inTexture)return;
    inTexture.sprite.anchorX = 0.5;
    inTexture.sprite.anchorY = 0.5;
    inTexture.attr({x: winSize.width /
        2, y: winSize.height / 2, anchorX: 0.5, anchorY: 0.5});
    inTexture.begin();
    this._inScene.visit();
    inTexture.end();
    var outTexture = cc.RenderTexture.create(winSize.width, winSize.height);
    outTexture.setPosition(winSize.width / 2, winSize.height / 2);
    outTexture.sprite.anchorX = outTexture.anchorX = 0.5;
    outTexture.sprite.anchorY = outTexture.anchorY = 0.5;
    outTexture.begin();
    this._outScene.visit();
    outTexture.end();
    inTexture.sprite.setBlendFunc(cc.ONE, cc.ONE);
    outTexture.sprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA);
    layer.addChild(inTexture);
    layer.addChild(outTexture);
    inTexture.sprite.opacity = 255;
    outTexture.sprite.opacity = 255;
    var layerAction = cc.Sequence.create(cc.FadeTo.create(this._duration, 0), cc.CallFunc.create(this.hideOutShowIn, this), cc.CallFunc.create(this.finish, this));
    outTexture.sprite.runAction(layerAction);
    this.addChild(layer, 2, cc.SCENE_FADE)
}, onExit: function () {
    this.removeChildByTag(cc.SCENE_FADE, false);
    cc.TransitionScene.prototype.onExit.call(this)
}, draw: function () {
}});
cc.TransitionCrossFade.create = function (t, scene) {
    return new cc.TransitionCrossFade(t, scene)
};
cc.TransitionTurnOffTiles = cc.TransitionScene.extend({ctor: function (t, scene) {
    cc.TransitionScene.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _sceneOrder: function () {
    this._isInSceneOnTop = false
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    var winSize = cc.director.getWinSize();
    var aspect = winSize.width / winSize.height;
    var x = 0 | 12 * aspect;
    var y = 12;
    var toff = cc.TurnOffTiles.create(this._duration, cc.size(x, y));
    var action = this.easeActionWithAction(toff);
    this._outScene.runAction(cc.Sequence.create(action,
        cc.CallFunc.create(this.finish, this), cc.StopGrid.create()))
}, easeActionWithAction: function (action) {
    return action
}});
cc.TransitionTurnOffTiles.create = function (t, scene) {
    return new cc.TransitionTurnOffTiles(t, scene)
};
cc.TransitionSplitCols = cc.TransitionScene.extend({ctor: function (t, scene) {
    cc.TransitionScene.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    this._inScene.visible = false;
    var split = this.action();
    var seq = cc.Sequence.create(split, cc.CallFunc.create(this.hideOutShowIn, this), split.reverse());
    this.runAction(cc.Sequence.create(this.easeActionWithAction(seq), cc.CallFunc.create(this.finish, this), cc.StopGrid.create()))
}, easeActionWithAction: function (action) {
    return cc.EaseInOut.create(action,
        3)
}, action: function () {
    return cc.SplitCols.create(this._duration / 2, 3)
}});
cc.TransitionSplitCols.create = function (t, scene) {
    return new cc.TransitionSplitCols(t, scene)
};
cc.TransitionSplitRows = cc.TransitionSplitCols.extend({ctor: function (t, scene) {
    cc.TransitionSplitCols.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, action: function () {
    return cc.SplitRows.create(this._duration / 2, 3)
}});
cc.TransitionSplitRows.create = function (t, scene) {
    return new cc.TransitionSplitRows(t, scene)
};
cc.TransitionFadeTR = cc.TransitionScene.extend({ctor: function (t, scene) {
    cc.TransitionScene.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _sceneOrder: function () {
    this._isInSceneOnTop = false
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    var winSize = cc.director.getWinSize();
    var aspect = winSize.width / winSize.height;
    var x = 0 | 12 * aspect;
    var y = 12;
    var action = this.actionWithSize(cc.size(x, y));
    this._outScene.runAction(cc.Sequence.create(this.easeActionWithAction(action), cc.CallFunc.create(this.finish,
        this), cc.StopGrid.create()))
}, easeActionWithAction: function (action) {
    return action
}, actionWithSize: function (size) {
    return cc.FadeOutTRTiles.create(this._duration, size)
}});
cc.TransitionFadeTR.create = function (t, scene) {
    return new cc.TransitionFadeTR(t, scene)
};
cc.TransitionFadeBL = cc.TransitionFadeTR.extend({ctor: function (t, scene) {
    cc.TransitionFadeTR.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, actionWithSize: function (size) {
    return cc.FadeOutBLTiles.create(this._duration, size)
}});
cc.TransitionFadeBL.create = function (t, scene) {
    return new cc.TransitionFadeBL(t, scene)
};
cc.TransitionFadeUp = cc.TransitionFadeTR.extend({ctor: function (t, scene) {
    cc.TransitionFadeTR.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, actionWithSize: function (size) {
    return cc.FadeOutUpTiles.create(this._duration, size)
}});
cc.TransitionFadeUp.create = function (t, scene) {
    return new cc.TransitionFadeUp(t, scene)
};
cc.TransitionFadeDown = cc.TransitionFadeTR.extend({ctor: function (t, scene) {
    cc.TransitionFadeTR.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, actionWithSize: function (size) {
    return cc.FadeOutDownTiles.create(this._duration, size)
}});
cc.TransitionFadeDown.create = function (t, scene) {
    return new cc.TransitionFadeDown(t, scene)
};
cc.SCENE_RADIAL = 49153;
cc.TransitionProgress = cc.TransitionScene.extend({_to: 0, _from: 0, _sceneToBeModified: null, _className: "TransitionProgress", ctor: function (t, scene) {
    cc.TransitionScene.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _setAttrs: function (node, x, y) {
    node.attr({x: x, y: y, anchorX: 0.5, anchorY: 0.5})
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    this._setupTransition();
    var winSize = cc.director.getWinSize();
    var texture = cc.RenderTexture.create(winSize.width, winSize.height);
    texture.sprite.anchorX =
        0.5;
    texture.sprite.anchorY = 0.5;
    this._setAttrs(texture, winSize.width / 2, winSize.height / 2);
    texture.clear(0, 0, 0, 1);
    texture.begin();
    this._sceneToBeModified.visit();
    texture.end();
    if (this._sceneToBeModified == this._outScene)this.hideOutShowIn();
    var pNode = this._progressTimerNodeWithRenderTexture(texture);
    var layerAction = cc.sequence(cc.progressFromTo(this._duration, this._from, this._to), cc.callFunc(this.finish, this));
    pNode.runAction(layerAction);
    this.addChild(pNode, 2, cc.SCENE_RADIAL)
}, onExit: function () {
    this.removeChildByTag(cc.SCENE_RADIAL,
        true);
    cc.TransitionScene.prototype.onExit.call(this)
}, _setupTransition: function () {
    this._sceneToBeModified = this._outScene;
    this._from = 100;
    this._to = 0
}, _progressTimerNodeWithRenderTexture: function (texture) {
    cc.log("cc.TransitionProgress._progressTimerNodeWithRenderTexture(): should be overridden in subclass");
    return null
}, _sceneOrder: function () {
    this._isInSceneOnTop = false
}});
cc.TransitionProgress.create = function (t, scene) {
    return new cc.TransitionProgress(t, scene)
};
cc.TransitionProgressRadialCCW = cc.TransitionProgress.extend({ctor: function (t, scene) {
    cc.TransitionProgress.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _progressTimerNodeWithRenderTexture: function (texture) {
    var size = cc.director.getWinSize();
    var pNode = cc.ProgressTimer.create(texture.sprite);
    if (cc._renderType === cc._RENDER_TYPE_WEBGL)pNode.sprite.flippedY = true;
    pNode.type = cc.ProgressTimer.TYPE_RADIAL;
    pNode.reverseDir = false;
    pNode.percentage = 100;
    this._setAttrs(pNode, size.width / 2, size.height /
        2);
    return pNode
}});
cc.TransitionProgressRadialCCW.create = function (t, scene) {
    return new cc.TransitionProgressRadialCCW(t, scene)
};
cc.TransitionProgressRadialCW = cc.TransitionProgress.extend({ctor: function (t, scene) {
    cc.TransitionProgress.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _progressTimerNodeWithRenderTexture: function (texture) {
    var size = cc.director.getWinSize();
    var pNode = cc.ProgressTimer.create(texture.sprite);
    if (cc._renderType === cc._RENDER_TYPE_WEBGL)pNode.sprite.flippedY = true;
    pNode.type = cc.ProgressTimer.TYPE_RADIAL;
    pNode.reverseDir = true;
    pNode.percentage = 100;
    this._setAttrs(pNode, size.width / 2, size.height /
        2);
    return pNode
}});
cc.TransitionProgressRadialCW.create = function (t, scene) {
    var tempScene = new cc.TransitionProgressRadialCW;
    if (tempScene != null && tempScene.initWithDuration(t, scene))return tempScene;
    return new cc.TransitionProgressRadialCW(t, scene)
};
cc.TransitionProgressHorizontal = cc.TransitionProgress.extend({ctor: function (t, scene) {
    cc.TransitionProgress.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _progressTimerNodeWithRenderTexture: function (texture) {
    var size = cc.director.getWinSize();
    var pNode = cc.ProgressTimer.create(texture.sprite);
    if (cc._renderType === cc._RENDER_TYPE_WEBGL)pNode.sprite.flippedY = true;
    pNode.type = cc.ProgressTimer.TYPE_BAR;
    pNode.midPoint = cc.p(1, 0);
    pNode.barChangeRate = cc.p(1, 0);
    pNode.percentage = 100;
    this._setAttrs(pNode,
            size.width / 2, size.height / 2);
    return pNode
}});
cc.TransitionProgressHorizontal.create = function (t, scene) {
    return new cc.TransitionProgressHorizontal(t, scene)
};
cc.TransitionProgressVertical = cc.TransitionProgress.extend({ctor: function (t, scene) {
    cc.TransitionProgress.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _progressTimerNodeWithRenderTexture: function (texture) {
    var size = cc.director.getWinSize();
    var pNode = cc.ProgressTimer.create(texture.sprite);
    if (cc._renderType === cc._RENDER_TYPE_WEBGL)pNode.sprite.flippedY = true;
    pNode.type = cc.ProgressTimer.TYPE_BAR;
    pNode.midPoint = cc.p(0, 0);
    pNode.barChangeRate = cc.p(0, 1);
    pNode.percentage = 100;
    this._setAttrs(pNode,
            size.width / 2, size.height / 2);
    return pNode
}});
cc.TransitionProgressVertical.create = function (t, scene) {
    return new cc.TransitionProgressVertical(t, scene)
};
cc.TransitionProgressInOut = cc.TransitionProgress.extend({ctor: function (t, scene) {
    cc.TransitionProgress.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _progressTimerNodeWithRenderTexture: function (texture) {
    var size = cc.director.getWinSize();
    var pNode = cc.ProgressTimer.create(texture.sprite);
    if (cc._renderType === cc._RENDER_TYPE_WEBGL)pNode.sprite.flippedY = true;
    pNode.type = cc.ProgressTimer.TYPE_BAR;
    pNode.midPoint = cc.p(0.5, 0.5);
    pNode.barChangeRate = cc.p(1, 1);
    pNode.percentage = 0;
    this._setAttrs(pNode,
            size.width / 2, size.height / 2);
    return pNode
}, _sceneOrder: function () {
    this._isInSceneOnTop = false
}, _setupTransition: function () {
    this._sceneToBeModified = this._inScene;
    this._from = 0;
    this._to = 100
}});
cc.TransitionProgressInOut.create = function (t, scene) {
    return new cc.TransitionProgressInOut(t, scene)
};
cc.TransitionProgressOutIn = cc.TransitionProgress.extend({ctor: function (t, scene) {
    cc.TransitionProgress.prototype.ctor.call(this);
    scene && this.initWithDuration(t, scene)
}, _progressTimerNodeWithRenderTexture: function (texture) {
    var size = cc.director.getWinSize();
    var pNode = cc.ProgressTimer.create(texture.sprite);
    if (cc._renderType === cc._RENDER_TYPE_WEBGL)pNode.sprite.flippedY = true;
    pNode.type = cc.ProgressTimer.TYPE_BAR;
    pNode.midPoint = cc.p(0.5, 0.5);
    pNode.barChangeRate = cc.p(1, 1);
    pNode.percentage = 100;
    this._setAttrs(pNode,
            size.width / 2, size.height / 2);
    return pNode
}});
cc.TransitionProgressOutIn.create = function (t, scene) {
    return new cc.TransitionProgressOutIn(t, scene)
};
cc.TransitionPageTurn = cc.TransitionScene.extend({ctor: function (t, scene, backwards) {
    cc.TransitionScene.prototype.ctor.call(this);
    this.initWithDuration(t, scene, backwards)
}, _back: true, _className: "TransitionPageTurn", initWithDuration: function (t, scene, backwards) {
    this._back = backwards;
    if (cc.TransitionScene.prototype.initWithDuration.call(this, t, scene));
    return true
}, actionWithSize: function (vector) {
    if (this._back)return cc.ReverseTime.create(cc.PageTurn3D.create(this._duration, vector)); else return cc.PageTurn3D.create(this._duration,
        vector)
}, onEnter: function () {
    cc.TransitionScene.prototype.onEnter.call(this);
    var winSize = cc.director.getWinSize();
    var x, y;
    if (winSize.width > winSize.height) {
        x = 16;
        y = 12
    } else {
        x = 12;
        y = 16
    }
    var action = this.actionWithSize(cc.size(x, y));
    if (!this._back)this._outScene.runAction(cc.Sequence.create(action, cc.CallFunc.create(this.finish, this), cc.StopGrid.create())); else {
        this._inScene.visible = false;
        this._inScene.runAction(cc.Sequence.create(cc.Show.create(), action, cc.CallFunc.create(this.finish, this), cc.StopGrid.create()))
    }
},
    _sceneOrder: function () {
        this._isInSceneOnTop = this._back
    }});
cc.TransitionPageTurn.create = function (t, scene, backwards) {
    return new cc.TransitionPageTurn(t, scene, backwards)
};
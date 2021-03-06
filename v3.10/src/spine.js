var sp = sp || {};
sp.VERTEX_INDEX = {
    X1: 0,
    Y1: 1,
    X2: 2,
    Y2: 3,
    X3: 4,
    Y3: 5,
    X4: 6,
    Y4: 7
};
sp.ATTACHMENT_TYPE = {
    REGION: 0,
    BOUNDING_BOX: 1,
    MESH: 2,
    SKINNED_MESH:3
};
sp.Skeleton = cc.Node.extend({
    _skeleton: null,
    _rootBone: null,
    _timeScale: 1,
    _debugSlots: false,
    _debugBones: false,
    _premultipliedAlpha: false,
    _ownsSkeletonData: null,
    _atlas: null,
    _blendFunc: null,
    ctor:function(skeletonDataFile, atlasFile, scale){
        cc.Node.prototype.ctor.call(this);
        if(arguments.length === 0)
            this.init();
        else
            this.initWithArgs(skeletonDataFile, atlasFile, scale);
    },
    _createRenderCmd:function () {
        if(cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new sp.Skeleton.CanvasRenderCmd(this);
        else
            return new sp.Skeleton.WebGLRenderCmd(this);
    },
    init: function () {
        cc.Node.prototype.init.call(this);
        this._premultipliedAlpha = (cc._renderType === cc.game.RENDER_TYPE_WEBGL && cc.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA);
        this._blendFunc = {src: cc.BLEND_SRC, dst: cc.BLEND_DST};
        this.scheduleUpdate();
    },
    setDebugSolots:function(enable){
        this._debugSlots = enable;
    },
    setDebugBones:function(enable){
        this._debugBones = enable;
    },
    setDebugSlotsEnabled: function(enabled) {
        this._debugSlots = enabled;
    },
    getDebugSlotsEnabled: function() {
        return this._debugSlots;
    },
    setDebugBonesEnabled: function(enabled) {
        this._debugBones = enabled;
    },
    getDebugBonesEnabled: function() {
        return this._debugBones;
    },
    setTimeScale:function(scale){
        this._timeScale = scale;
    },
    getTimeScale: function(){
        return this._timeScale;
    },
    initWithArgs: function (skeletonDataFile, atlasFile, scale) {
        var argSkeletonFile = skeletonDataFile, argAtlasFile = atlasFile,
            skeletonData, atlas, ownsSkeletonData;
        if (cc.isString(argSkeletonFile)) {
            if (cc.isString(argAtlasFile)) {
                var data = cc.loader.getRes(argAtlasFile);
                sp._atlasLoader.setAtlasFile(argAtlasFile);
                atlas = new spine.Atlas(data, sp._atlasLoader);
            } else {
                atlas = atlasFile;
            }
            scale = scale || 1 / cc.director.getContentScaleFactor();
            var attachmentLoader = new spine.AtlasAttachmentLoader(atlas);
            var skeletonJsonReader = new spine.SkeletonJson(attachmentLoader);
            skeletonJsonReader.scale = scale;
            var skeletonJson = cc.loader.getRes(argSkeletonFile);
            skeletonData = skeletonJsonReader.readSkeletonData(skeletonJson);
            atlas.dispose(skeletonJsonReader);
            ownsSkeletonData = true;
        } else {
            skeletonData = skeletonDataFile;
            ownsSkeletonData = atlasFile;
        }
        this.setSkeletonData(skeletonData, ownsSkeletonData);
        this.init();
    },
    getBoundingBox: function () {
        var minX = cc.FLT_MAX, minY = cc.FLT_MAX, maxX = cc.FLT_MIN, maxY = cc.FLT_MIN;
        var scaleX = this.getScaleX(), scaleY = this.getScaleY(), vertices = [],
            slots = this._skeleton.slots, VERTEX = sp.VERTEX_INDEX;
        for (var i = 0, slotCount = slots.length; i < slotCount; ++i) {
            var slot = slots[i];
            if (!slot.attachment || slot.attachment.type != sp.ATTACHMENT_TYPE.REGION)
                continue;
            var attachment = slot.attachment;
            this._computeRegionAttachmentWorldVertices(attachment, slot.bone.skeleton.x, slot.bone.skeleton.y, slot.bone, vertices);
            minX = Math.min(minX, vertices[VERTEX.X1] * scaleX, vertices[VERTEX.X4] * scaleX, vertices[VERTEX.X2] * scaleX, vertices[VERTEX.X3] * scaleX);
            minY = Math.min(minY, vertices[VERTEX.Y1] * scaleY, vertices[VERTEX.Y4] * scaleY, vertices[VERTEX.Y2] * scaleY, vertices[VERTEX.Y3] * scaleY);
            maxX = Math.max(maxX, vertices[VERTEX.X1] * scaleX, vertices[VERTEX.X4] * scaleX, vertices[VERTEX.X2] * scaleX, vertices[VERTEX.X3] * scaleX);
            maxY = Math.max(maxY, vertices[VERTEX.Y1] * scaleY, vertices[VERTEX.Y4] * scaleY, vertices[VERTEX.Y2] * scaleY, vertices[VERTEX.Y3] * scaleY);
        }
        var position = this.getPosition();
        return cc.rect(position.x + minX, position.y + minY, maxX - minX, maxY - minY);
    },
    _computeRegionAttachmentWorldVertices : function(self, x, y, bone, vertices){
        var offset = self.offset, vertexIndex = sp.VERTEX_INDEX;
        x += bone.worldX;
        y += bone.worldY;
        vertices[vertexIndex.X1] = offset[vertexIndex.X1] * bone.m00 + offset[vertexIndex.Y1] * bone.m01 + x;
        vertices[vertexIndex.Y1] = offset[vertexIndex.X1] * bone.m10 + offset[vertexIndex.Y1] * bone.m11 + y;
        vertices[vertexIndex.X2] = offset[vertexIndex.X2] * bone.m00 + offset[vertexIndex.Y2] * bone.m01 + x;
        vertices[vertexIndex.Y2] = offset[vertexIndex.X2] * bone.m10 + offset[vertexIndex.Y2] * bone.m11 + y;
        vertices[vertexIndex.X3] = offset[vertexIndex.X3] * bone.m00 + offset[vertexIndex.Y3] * bone.m01 + x;
        vertices[vertexIndex.Y3] = offset[vertexIndex.X3] * bone.m10 + offset[vertexIndex.Y3] * bone.m11 + y;
        vertices[vertexIndex.X4] = offset[vertexIndex.X4] * bone.m00 + offset[vertexIndex.Y4] * bone.m01 + x;
        vertices[vertexIndex.Y4] = offset[vertexIndex.X4] * bone.m10 + offset[vertexIndex.Y4] * bone.m11 + y;
    },
    updateWorldTransform: function () {
        this._skeleton.updateWorldTransform();
    },
    setToSetupPose: function () {
        this._skeleton.setToSetupPose();
    },
    setBonesToSetupPose: function () {
        this._skeleton.setBonesToSetupPose();
    },
    setSlotsToSetupPose: function () {
        this._skeleton.setSlotsToSetupPose();
    },
    findBone: function (boneName) {
        return this._skeleton.findBone(boneName);
    },
    findSlot: function (slotName) {
        return this._skeleton.findSlot(slotName);
    },
    setSkin: function (skinName) {
        return this._skeleton.setSkinByName(skinName);
    },
    getAttachment: function (slotName, attachmentName) {
        return this._skeleton.getAttachmentBySlotName(slotName, attachmentName);
    },
    setAttachment: function (slotName, attachmentName) {
        this._skeleton.setAttachment(slotName, attachmentName);
    },
    setPremultipliedAlpha: function (premultiplied) {
        this._premultipliedAlpha = premultiplied;
    },
    isPremultipliedAlpha: function () {
        return this._premultipliedAlpha;
    },
    setSkeletonData: function (skeletonData, ownsSkeletonData) {
        if(skeletonData.width != null && skeletonData.height != null)
            this.setContentSize(skeletonData.width / cc.director.getContentScaleFactor(), skeletonData.height / cc.director.getContentScaleFactor());
        this._skeleton = new spine.Skeleton(skeletonData);
        this._skeleton.updateWorldTransform();
        this._rootBone = this._skeleton.getRootBone();
        this._ownsSkeletonData = ownsSkeletonData;
        this._renderCmd._createChildFormSkeletonData();
    },
    getTextureAtlas: function (regionAttachment) {
        return regionAttachment.rendererObject.page.rendererObject;
    },
    getBlendFunc: function () {
        return this._blendFunc;
    },
    setBlendFunc: function (src, dst) {
        var locBlendFunc = this._blendFunc;
        if (dst === undefined) {
            locBlendFunc.src = src.src;
            locBlendFunc.dst = src.dst;
        } else {
            locBlendFunc.src = src;
            locBlendFunc.dst = dst;
        }
    },
    update: function (dt) {
        this._skeleton.update(dt);
    }
});
sp.Skeleton.create = function (skeletonDataFile, atlasFile, scale) {
    return new sp.Skeleton(skeletonDataFile, atlasFile, scale);
};
var spine = {
    radDeg: 180 / Math.PI,
    degRad: Math.PI / 180,
    temp: [],
    Float32Array: (typeof(Float32Array) === 'undefined') ? Array : Float32Array,
    Uint16Array: (typeof(Uint16Array) === 'undefined') ? Array : Uint16Array
};
spine.BoneData = function (name, parent) {
    this.length = this.x = this.y = this.rotation = 0;
    this.scaleX = this.scaleY = 1;
    this.name = name;
    this.parent = parent;
};
spine.BoneData.prototype = {
    length: 0,
    x: 0, y: 0,
    rotation: 0,
    scaleX: 1, scaleY: 1,
    inheritScale: true,
    inheritRotation: true,
    flipX: false, flipY: false
};
spine.BlendMode = {
    normal: 0,
    additive: 1,
    multiply: 2,
    screen: 3
};
spine.SlotData = function (name, boneData) {
    this.r = this.g = this.b = this.a = 1;
    this.blendMode = spine.BlendMode.normal;
    this.name = name;
    this.boneData = boneData;
};
spine.SlotData.prototype = {
    r: 1, g: 1, b: 1, a: 1,
    attachmentName: null,
    blendMode: spine.BlendMode.normal
};
spine.IkConstraintData = function (name) {
    this.bendDirection = this.mix = 1;
    this.name = name;
    this.bones = [];
};
spine.IkConstraintData.prototype = {
    target: null,
    bendDirection: 1,
    mix: 1
};
spine.Bone = function (boneData, skeleton, parent) {
    this.x = this.y = this.rotation = this.rotationIK = 0;
    this.scaleX = this.scaleY = 1;
    this.flipX = this.flipY = false;
    this.m00 = this.m01 = this.worldX = 0;
    this.m10 = this.m11= this.worldY = 0;
    this.worldRotation = 0;
    this.worldScaleX = this.worldScaleY = 1;
    this.worldFlipX = this.worldFlipY = false;
    this.data = boneData;
    this.skeleton = skeleton;
    this.parent = parent;
    this.setToSetupPose();
};
spine.Bone.yDown = false;
spine.Bone.prototype = {
    x: 0, y: 0,
    rotation: 0, rotationIK: 0,
    scaleX: 1, scaleY: 1,
    flipX: false, flipY: false,
    m00: 0, m01: 0, worldX: 0,
    m10: 0, m11: 0, worldY: 0,
    worldRotation: 0,
    worldScaleX: 1, worldScaleY: 1,
    worldFlipX: false, worldFlipY: false,
    updateWorldTransform: function () {
        var parent = this.parent;
        if (parent) {
            this.worldX = this.x * parent.m00 + this.y * parent.m01 + parent.worldX;
            this.worldY = this.x * parent.m10 + this.y * parent.m11 + parent.worldY;
            if (this.data.inheritScale) {
                this.worldScaleX = parent.worldScaleX * this.scaleX;
                this.worldScaleY = parent.worldScaleY * this.scaleY;
            } else {
                this.worldScaleX = this.scaleX;
                this.worldScaleY = this.scaleY;
            }
            this.worldRotation = this.data.inheritRotation ? (parent.worldRotation + this.rotationIK) : this.rotationIK;
            this.worldFlipX = parent.worldFlipX != this.flipX;
            this.worldFlipY = parent.worldFlipY != this.flipY;
        } else {
            var skeletonFlipX = this.skeleton.flipX, skeletonFlipY = this.skeleton.flipY;
            this.worldX = skeletonFlipX ? -this.x : this.x;
            this.worldY = (skeletonFlipY != spine.Bone.yDown) ? -this.y : this.y;
            this.worldScaleX = this.scaleX;
            this.worldScaleY = this.scaleY;
            this.worldRotation = this.rotationIK;
            this.worldFlipX = skeletonFlipX != this.flipX;
            this.worldFlipY = skeletonFlipY != this.flipY;
        }
        var radians = this.worldRotation * spine.degRad;
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        if (this.worldFlipX) {
            this.m00 = -cos * this.worldScaleX;
            this.m01 = sin * this.worldScaleY;
        } else {
            this.m00 = cos * this.worldScaleX;
            this.m01 = -sin * this.worldScaleY;
        }
        if (this.worldFlipY != spine.Bone.yDown) {
            this.m10 = -sin * this.worldScaleX;
            this.m11 = -cos * this.worldScaleY;
        } else {
            this.m10 = sin * this.worldScaleX;
            this.m11 = cos * this.worldScaleY;
        }
    },
    setToSetupPose: function () {
        var data = this.data;
        this.x = data.x;
        this.y = data.y;
        this.rotation = data.rotation;
        this.rotationIK = this.rotation;
        this.scaleX = data.scaleX;
        this.scaleY = data.scaleY;
        this.flipX = data.flipX;
        this.flipY = data.flipY;
    },
    worldToLocal: function (world) {
        var dx = world[0] - this.worldX, dy = world[1] - this.worldY;
        var m00 = this.m00, m10 = this.m10, m01 = this.m01, m11 = this.m11;
        if (this.worldFlipX != (this.worldFlipY != spine.Bone.yDown)) {
            m00 = -m00;
            m11 = -m11;
        }
        var invDet = 1 / (m00 * m11 - m01 * m10);
        world[0] = dx * m00 * invDet - dy * m01 * invDet;
        world[1] = dy * m11 * invDet - dx * m10 * invDet;
    },
    localToWorld: function (local) {
        var localX = local[0], localY = local[1];
        local[0] = localX * this.m00 + localY * this.m01 + this.worldX;
        local[1] = localX * this.m10 + localY * this.m11 + this.worldY;
    }
};
spine.Slot = function (slotData, bone) {
    this.r = this.g = this.b = this.a = 1;
    this._attachmentTime = 0;
    this.data = slotData;
    this.bone = bone;
    this.setToSetupPose();
};
spine.Slot.prototype = {
    r: 1, g: 1, b: 1, a: 1,
    _attachmentTime: 0,
    attachment: null,
    attachmentVertices: [],
    setAttachment: function (attachment) {
        this.attachment = attachment;
        this._attachmentTime = this.bone.skeleton.time;
        this.attachmentVertices.length = 0;
    },
    setAttachmentTime: function (time) {
        this._attachmentTime = this.bone.skeleton.time - time;
    },
    getAttachmentTime: function () {
        return this.bone.skeleton.time - this._attachmentTime;
    },
    setToSetupPose: function () {
        var data = this.data;
        this.r = data.r;
        this.g = data.g;
        this.b = data.b;
        this.a = data.a;
        var slotDatas = this.bone.skeleton.data.slots;
        for (var i = 0, n = slotDatas.length; i < n; i++) {
            if (slotDatas[i] == data) {
                this.setAttachment(!data.attachmentName ? null : this.bone.skeleton.getAttachmentBySlotIndex(i, data.attachmentName));
                break;
            }
        }
    }
};
spine.IkConstraint = function (data, skeleton) {
    this.data = data;
    this.mix = data.mix;
    this.bendDirection = data.bendDirection;
    this.bones = [];
    for (var i = 0, n = data.bones.length; i < n; i++)
        this.bones.push(skeleton.findBone(data.bones[i].name));
    this.target = skeleton.findBone(data.target.name);
};
spine.IkConstraint.prototype = {
    apply: function () {
        var target = this.target;
        var bones = this.bones;
        switch (bones.length) {
        case 1:
            spine.IkConstraint.apply1(bones[0], target.worldX, target.worldY, this.mix);
            break;
        case 2:
            spine.IkConstraint.apply2(bones[0], bones[1], target.worldX, target.worldY, this.bendDirection, this.mix);
            break;
        }
    }
};
spine.IkConstraint.apply1 = function (bone, targetX, targetY, alpha) {
    var parentRotation = (!bone.data.inheritRotation || !bone.parent) ? 0 : bone.parent.worldRotation;
    var rotation = bone.rotation;
    var rotationIK = Math.atan2(targetY - bone.worldY, targetX - bone.worldX) * spine.radDeg;
    if (bone.worldFlipX != (bone.worldFlipY != spine.Bone.yDown)) rotationIK = -rotationIK;
    rotationIK -= parentRotation;
    bone.rotationIK = rotation + (rotationIK - rotation) * alpha;
};
spine.IkConstraint.apply2 = function (parent, child, targetX, targetY, bendDirection, alpha) {
    var childRotation = child.rotation, parentRotation = parent.rotation;
    if (!alpha) {
        child.rotationIK = childRotation;
        parent.rotationIK = parentRotation;
        return;
    }
    var positionX, positionY, tempPosition = spine.temp;
    var parentParent = parent.parent;
    if (parentParent) {
        tempPosition[0] = targetX;
        tempPosition[1] = targetY;
        parentParent.worldToLocal(tempPosition);
        targetX = (tempPosition[0] - parent.x) * parentParent.worldScaleX;
        targetY = (tempPosition[1] - parent.y) * parentParent.worldScaleY;
    } else {
        targetX -= parent.x;
        targetY -= parent.y;
    }
    if (child.parent == parent) {
        positionX = child.x;
        positionY = child.y;
    } else {
        tempPosition[0] = child.x;
        tempPosition[1] = child.y;
        child.parent.localToWorld(tempPosition);
        parent.worldToLocal(tempPosition);
        positionX = tempPosition[0];
        positionY = tempPosition[1];
    }
    var childX = positionX * parent.worldScaleX, childY = positionY * parent.worldScaleY;
    var offset = Math.atan2(childY, childX);
    var len1 = Math.sqrt(childX * childX + childY * childY), len2 = child.data.length * child.worldScaleX;
    var cosDenom = 2 * len1 * len2;
    if (cosDenom < 0.0001) {
        child.rotationIK = childRotation + (Math.atan2(targetY, targetX) * spine.radDeg - parentRotation - childRotation) * alpha;
        return;
    }
    var cos = (targetX * targetX + targetY * targetY - len1 * len1 - len2 * len2) / cosDenom;
    if (cos < -1)
        cos = -1;
    else if (cos > 1)
        cos = 1;
    var childAngle = Math.acos(cos) * bendDirection;
    var adjacent = len1 + len2 * cos, opposite = len2 * Math.sin(childAngle);
    var parentAngle = Math.atan2(targetY * adjacent - targetX * opposite, targetX * adjacent + targetY * opposite);
    var rotation = (parentAngle - offset) * spine.radDeg - parentRotation;
    if (rotation > 180)
        rotation -= 360;
    else if (rotation < -180)
        rotation += 360;
    parent.rotationIK = parentRotation + rotation * alpha;
    rotation = (childAngle + offset) * spine.radDeg - childRotation;
    if (rotation > 180)
        rotation -= 360;
    else if (rotation < -180)
        rotation += 360;
    child.rotationIK = childRotation + (rotation + parent.worldRotation - child.parent.worldRotation) * alpha;
};
spine.Skin = function (name) {
    this.name = name;
    this.attachments = {};
};
spine.Skin.prototype = {
    addAttachment: function (slotIndex, name, attachment) {
        this.attachments[slotIndex + ":" + name] = attachment;
    },
    getAttachment: function (slotIndex, name) {
        return this.attachments[slotIndex + ":" + name];
    },
    _attachAll: function (skeleton, oldSkin) {
        for (var key in oldSkin.attachments) {
            var colon = key.indexOf(":");
            var slotIndex = parseInt(key.substring(0, colon));
            var name = key.substring(colon + 1);
            var slot = skeleton.slots[slotIndex];
            if (slot.attachment && slot.attachment.name == name) {
                var attachment = this.getAttachment(slotIndex, name);
                if (attachment) slot.setAttachment(attachment);
            }
        }
    }
};
spine.Animation = function (name, timelines, duration) {
    this.name = name;
    this.timelines = timelines;
    this.duration = duration;
};
spine.Animation.prototype = {
    apply: function (skeleton, lastTime, time, loop, events) {
        if (loop && this.duration != 0) {
            time %= this.duration;
            lastTime %= this.duration;
        }
        var timelines = this.timelines;
        for (var i = 0, n = timelines.length; i < n; i++)
            timelines[i].apply(skeleton, lastTime, time, events, 1);
    },
    mix: function (skeleton, lastTime, time, loop, events, alpha) {
        if (loop && this.duration != 0) {
            time %= this.duration;
            lastTime %= this.duration;
        }
        var timelines = this.timelines;
        for (var i = 0, n = timelines.length; i < n; i++)
            timelines[i].apply(skeleton, lastTime, time, events, alpha);
    }
};
spine.Animation.binarySearch = function (values, target, step) {
    var low = 0;
    var high = Math.floor(values.length / step) - 2;
    if (!high) return step;
    var current = high >>> 1;
    while (true) {
        if (values[(current + 1) * step] <= target)
            low = current + 1;
        else
            high = current;
        if (low == high) return (low + 1) * step;
        current = (low + high) >>> 1;
    }
};
spine.Animation.binarySearch1 = function (values, target) {
    var low = 0;
    var high = values.length - 2;
    if (!high) return 1;
    var current = high >>> 1;
    while (true) {
        if (values[current + 1] <= target)
            low = current + 1;
        else
            high = current;
        if (low == high) return low + 1;
        current = (low + high) >>> 1;
    }
};
spine.Animation.linearSearch = function (values, target, step) {
    for (var i = 0, last = values.length - step; i <= last; i += step)
        if (values[i] > target) return i;
    return -1;
};
spine.Curves = function (frameCount) {
    this.curves = [];
};
spine.Curves.prototype = {
    setLinear: function (frameIndex) {
        this.curves[frameIndex * 19] = 0;
    },
    setStepped: function (frameIndex) {
        this.curves[frameIndex * 19] = 1;
    },
    setCurve: function (frameIndex, cx1, cy1, cx2, cy2) {
        var subdiv1 = 1 / 10, subdiv2 = subdiv1 * subdiv1, subdiv3 = subdiv2 * subdiv1;
        var pre1 = 3 * subdiv1, pre2 = 3 * subdiv2, pre4 = 6 * subdiv2, pre5 = 6 * subdiv3;
        var tmp1x = -cx1 * 2 + cx2, tmp1y = -cy1 * 2 + cy2, tmp2x = (cx1 - cx2) * 3 + 1, tmp2y = (cy1 - cy2) * 3 + 1;
        var dfx = cx1 * pre1 + tmp1x * pre2 + tmp2x * subdiv3, dfy = cy1 * pre1 + tmp1y * pre2 + tmp2y * subdiv3;
        var ddfx = tmp1x * pre4 + tmp2x * pre5, ddfy = tmp1y * pre4 + tmp2y * pre5;
        var dddfx = tmp2x * pre5, dddfy = tmp2y * pre5;
        var i = frameIndex * 19;
        var curves = this.curves;
        curves[i++] = 2;
        var x = dfx, y = dfy;
        for (var n = i + 19 - 1; i < n; i += 2) {
            curves[i] = x;
            curves[i + 1] = y;
            dfx += ddfx;
            dfy += ddfy;
            ddfx += dddfx;
            ddfy += dddfy;
            x += dfx;
            y += dfy;
        }
    },
    getCurvePercent: function (frameIndex, percent) {
        percent = percent < 0 ? 0 : (percent > 1 ? 1 : percent);
        var curves = this.curves;
        var i = frameIndex * 19;
        var type = curves[i];
        if (type === 0) return percent;
        if (type == 1) return 0;
        i++;
        var x = 0;
        for (var start = i, n = i + 19 - 1; i < n; i += 2) {
            x = curves[i];
            if (x >= percent) {
                var prevX, prevY;
                if (i == start) {
                    prevX = 0;
                    prevY = 0;
                } else {
                    prevX = curves[i - 2];
                    prevY = curves[i - 1];
                }
                return prevY + (curves[i + 1] - prevY) * (percent - prevX) / (x - prevX);
            }
        }
        var y = curves[i - 1];
        return y + (1 - y) * (percent - x) / (1 - x);
    }
};
spine.RotateTimeline = function (frameCount) {
    this.boneIndex = 0;
    this.curves = new spine.Curves(frameCount);
    this.frames = [];
    this.frames.length = frameCount * 2;
};
spine.RotateTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 2;
    },
    setFrame: function (frameIndex, time, angle) {
        frameIndex *= 2;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = angle;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return;
        var bone = skeleton.bones[this.boneIndex];
        if (time >= frames[frames.length - 2]) {
            var amount = bone.data.rotation + frames[frames.length - 1] - bone.rotation;
            while (amount > 180)
                amount -= 360;
            while (amount < -180)
                amount += 360;
            bone.rotation += amount * alpha;
            return;
        }
        var frameIndex = spine.Animation.binarySearch(frames, time, 2);
        var prevFrameValue = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex - 2] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 2 - 1, percent);
        var amount = frames[frameIndex + 1] - prevFrameValue;
        while (amount > 180)
            amount -= 360;
        while (amount < -180)
            amount += 360;
        amount = bone.data.rotation + (prevFrameValue + amount * percent) - bone.rotation;
        while (amount > 180)
            amount -= 360;
        while (amount < -180)
            amount += 360;
        bone.rotation += amount * alpha;
    }
};
spine.TranslateTimeline = function (frameCount) {
    this.boneIndex = 0;
    this.curves = new spine.Curves(frameCount);
    this.frames = [];
    this.frames.length = frameCount * 3;
};
spine.TranslateTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 3;
    },
    setFrame: function (frameIndex, time, x, y) {
        frameIndex *= 3;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = x;
        this.frames[frameIndex + 2] = y;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return;
        var bone = skeleton.bones[this.boneIndex];
        if (time >= frames[frames.length - 3]) {
            bone.x += (bone.data.x + frames[frames.length - 2] - bone.x) * alpha;
            bone.y += (bone.data.y + frames[frames.length - 1] - bone.y) * alpha;
            return;
        }
        var frameIndex = spine.Animation.binarySearch(frames, time, 3);
        var prevFrameX = frames[frameIndex - 2];
        var prevFrameY = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex + -3] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);
        bone.x += (bone.data.x + prevFrameX + (frames[frameIndex + 1] - prevFrameX) * percent - bone.x) * alpha;
        bone.y += (bone.data.y + prevFrameY + (frames[frameIndex + 2] - prevFrameY) * percent - bone.y) * alpha;
    }
};
spine.ScaleTimeline = function (frameCount) {
    this.boneIndex = 0;
    this.curves = new spine.Curves(frameCount);
    this.frames = [];
    this.frames.length = frameCount * 3;
};
spine.ScaleTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 3;
    },
    setFrame: function (frameIndex, time, x, y) {
        frameIndex *= 3;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = x;
        this.frames[frameIndex + 2] = y;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return;
        var bone = skeleton.bones[this.boneIndex];
        if (time >= frames[frames.length - 3]) {
            bone.scaleX += (bone.data.scaleX * frames[frames.length - 2] - bone.scaleX) * alpha;
            bone.scaleY += (bone.data.scaleY * frames[frames.length - 1] - bone.scaleY) * alpha;
            return;
        }
        var frameIndex = spine.Animation.binarySearch(frames, time, 3);
        var prevFrameX = frames[frameIndex - 2];
        var prevFrameY = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex + -3] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);
        bone.scaleX += (bone.data.scaleX * (prevFrameX + (frames[frameIndex + 1] - prevFrameX) * percent) - bone.scaleX) * alpha;
        bone.scaleY += (bone.data.scaleY * (prevFrameY + (frames[frameIndex + 2] - prevFrameY) * percent) - bone.scaleY) * alpha;
    }
};
spine.ColorTimeline = function (frameCount) {
    this.boneIndex = 0;
    this.curves = new spine.Curves(frameCount);
    this.frames = [];
    this.frames.length = frameCount * 5;
};
spine.ColorTimeline.prototype = {
    slotIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 5;
    },
    setFrame: function (frameIndex, time, r, g, b, a) {
        frameIndex *= 5;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = r;
        this.frames[frameIndex + 2] = g;
        this.frames[frameIndex + 3] = b;
        this.frames[frameIndex + 4] = a;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return;
        var r, g, b, a;
        if (time >= frames[frames.length - 5]) {
            var i = frames.length - 1;
            r = frames[i - 3];
            g = frames[i - 2];
            b = frames[i - 1];
            a = frames[i];
        } else {
            var frameIndex = spine.Animation.binarySearch(frames, time, 5);
            var prevFrameR = frames[frameIndex - 4];
            var prevFrameG = frames[frameIndex - 3];
            var prevFrameB = frames[frameIndex - 2];
            var prevFrameA = frames[frameIndex - 1];
            var frameTime = frames[frameIndex];
            var percent = 1 - (time - frameTime) / (frames[frameIndex - 5] - frameTime);
            percent = this.curves.getCurvePercent(frameIndex / 5 - 1, percent);
            r = prevFrameR + (frames[frameIndex + 1] - prevFrameR) * percent;
            g = prevFrameG + (frames[frameIndex + 2] - prevFrameG) * percent;
            b = prevFrameB + (frames[frameIndex + 3] - prevFrameB) * percent;
            a = prevFrameA + (frames[frameIndex + 4] - prevFrameA) * percent;
        }
        var slot = skeleton.slots[this.slotIndex];
        if (alpha < 1) {
            slot.r += (r - slot.r) * alpha;
            slot.g += (g - slot.g) * alpha;
            slot.b += (b - slot.b) * alpha;
            slot.a += (a - slot.a) * alpha;
        } else {
            slot.r = r;
            slot.g = g;
            slot.b = b;
            slot.a = a;
        }
    }
};
spine.AttachmentTimeline = function (frameCount) {
    this.slotIndex = 0;
    this.curves = new spine.Curves(frameCount);
    this.frames = [];
    this.frames.length = frameCount;
    this.attachmentNames = [];
    this.attachmentNames.length = frameCount;
};
spine.AttachmentTimeline.prototype = {
    slotIndex: 0,
    getFrameCount: function () {
        return this.frames.length;
    },
    setFrame: function (frameIndex, time, attachmentName) {
        this.frames[frameIndex] = time;
        this.attachmentNames[frameIndex] = attachmentName;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha) {
        var frames = this.frames;
        if (time < frames[0]) {
            if (lastTime > time) this.apply(skeleton, lastTime, Number.MAX_VALUE, null, 0);
            return;
        } else if (lastTime > time)
            lastTime = -1;
        var frameIndex = time >= frames[frames.length - 1] ? frames.length - 1 : spine.Animation.binarySearch1(frames, time) - 1;
        if (frames[frameIndex] < lastTime) return;
        var attachmentName = this.attachmentNames[frameIndex];
        skeleton.slots[this.slotIndex].setAttachment(
            !attachmentName ? null : skeleton.getAttachmentBySlotIndex(this.slotIndex, attachmentName));
    }
};
spine.EventTimeline = function (frameCount) {
    this.frames = [];
    this.frames.length = frameCount;
    this.events = [];
    this.events.length = frameCount;
};
spine.EventTimeline.prototype = {
    getFrameCount: function () {
        return this.frames.length;
    },
    setFrame: function (frameIndex, time, event) {
        this.frames[frameIndex] = time;
        this.events[frameIndex] = event;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha) {
        if (!firedEvents) return;
        var frames = this.frames;
        var frameCount = frames.length;
        if (lastTime > time) {
            this.apply(skeleton, lastTime, Number.MAX_VALUE, firedEvents, alpha);
            lastTime = -1;
        } else if (lastTime >= frames[frameCount - 1])
            return;
        if (time < frames[0]) return;
        var frameIndex;
        if (lastTime < frames[0])
            frameIndex = 0;
        else {
            frameIndex = spine.Animation.binarySearch1(frames, lastTime);
            var frame = frames[frameIndex];
            while (frameIndex > 0) {
                if (frames[frameIndex - 1] != frame) break;
                frameIndex--;
            }
        }
        var events = this.events;
        for (; frameIndex < frameCount && time >= frames[frameIndex]; frameIndex++)
            firedEvents.push(events[frameIndex]);
    }
};
spine.DrawOrderTimeline = function (frameCount) {
    this.frames = [];
    this.frames.length = frameCount;
    this.drawOrders = [];
    this.drawOrders.length = frameCount;
};
spine.DrawOrderTimeline.prototype = {
    getFrameCount: function () {
        return this.frames.length;
    },
    setFrame: function (frameIndex, time, drawOrder) {
        this.frames[frameIndex] = time;
        this.drawOrders[frameIndex] = drawOrder;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return;
        var frameIndex;
        if (time >= frames[frames.length - 1])
            frameIndex = frames.length - 1;
        else
            frameIndex = spine.Animation.binarySearch1(frames, time) - 1;
        var drawOrder = skeleton.drawOrder;
        var slots = skeleton.slots;
        var drawOrderToSetupIndex = this.drawOrders[frameIndex];
        if (!drawOrderToSetupIndex) {
            for (var i = 0, n = slots.length; i < n; i++)
                drawOrder[i] = slots[i];
        } else {
            for (var i = 0, n = drawOrderToSetupIndex.length; i < n; i++)
                drawOrder[i] = skeleton.slots[drawOrderToSetupIndex[i]];
        }
    }
};
spine.FfdTimeline = function (frameCount) {
    this.slotIndex = this.attachment = 0;
    this.curves = new spine.Curves(frameCount);
    this.frames = [];
    this.frames.length = frameCount;
    this.frameVertices = [];
    this.frameVertices.length = frameCount;
};
spine.FfdTimeline.prototype = {
    slotIndex: 0,
    attachment: 0,
    getFrameCount: function () {
        return this.frames.length;
    },
    setFrame: function (frameIndex, time, vertices) {
        this.frames[frameIndex] = time;
        this.frameVertices[frameIndex] = vertices;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha) {
        var slot = skeleton.slots[this.slotIndex];
        if (slot.attachment != this.attachment) return;
        var frames = this.frames;
        if (time < frames[0]) return;
        var frameVertices = this.frameVertices;
        var vertexCount = frameVertices[0].length;
        var vertices = slot.attachmentVertices;
        if (vertices.length != vertexCount) alpha = 1;
        vertices.length = vertexCount;
        if (time >= frames[frames.length - 1]) {
            var lastVertices = frameVertices[frames.length - 1];
            if (alpha < 1) {
                for (var i = 0; i < vertexCount; i++)
                    vertices[i] += (lastVertices[i] - vertices[i]) * alpha;
            } else {
                for (var i = 0; i < vertexCount; i++)
                    vertices[i] = lastVertices[i];
            }
            return;
        }
        var frameIndex = spine.Animation.binarySearch1(frames, time);
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex - 1] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex - 1, percent < 0 ? 0 : (percent > 1 ? 1 : percent));
        var prevVertices = frameVertices[frameIndex - 1];
        var nextVertices = frameVertices[frameIndex];
        if (alpha < 1) {
            for (var i = 0; i < vertexCount; i++) {
                var prev = prevVertices[i];
                vertices[i] += (prev + (nextVertices[i] - prev) * percent - vertices[i]) * alpha;
            }
        } else {
            for (var i = 0; i < vertexCount; i++) {
                var prev = prevVertices[i];
                vertices[i] = prev + (nextVertices[i] - prev) * percent;
            }
        }
    }
};
spine.IkConstraintTimeline = function (frameCount) {
    this.ikConstraintIndex = 0;
    this.curves = new spine.Curves(frameCount);
    this.frames = [];
    this.frames.length = frameCount * 3;
};
spine.IkConstraintTimeline.prototype = {
    ikConstraintIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 3;
    },
    setFrame: function (frameIndex, time, mix, bendDirection) {
        frameIndex *= 3;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = mix;
        this.frames[frameIndex + 2] = bendDirection;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return;
        var ikConstraint = skeleton.ikConstraints[this.ikConstraintIndex];
        if (time >= frames[frames.length - 3]) {
            ikConstraint.mix += (frames[frames.length - 2] - ikConstraint.mix) * alpha;
            ikConstraint.bendDirection = frames[frames.length - 1];
            return;
        }
        var frameIndex = spine.Animation.binarySearch(frames, time, 3);
        var prevFrameMix = frames[frameIndex + -2];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex + -3] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);
        var mix = prevFrameMix + (frames[frameIndex + 1] - prevFrameMix) * percent;
        ikConstraint.mix += (mix - ikConstraint.mix) * alpha;
        ikConstraint.bendDirection = frames[frameIndex + -1];
    }
};
spine.FlipXTimeline = function (frameCount) {
    this.boneIndex = 0;
    this.curves = new spine.Curves(frameCount);
    this.frames = [];
    this.frames.length = frameCount * 2;
};
spine.FlipXTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 2;
    },
    setFrame: function (frameIndex, time, flip) {
        frameIndex *= 2;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = flip ? 1 : 0;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha) {
        var frames = this.frames;
        if (time < frames[0]) {
            if (lastTime > time) this.apply(skeleton, lastTime, Number.MAX_VALUE, null, 0);
            return;
        } else if (lastTime > time)
            lastTime = -1;
        var frameIndex = (time >= frames[frames.length - 2] ? frames.length : spine.Animation.binarySearch(frames, time, 2)) - 2;
        if (frames[frameIndex] < lastTime) return;
        skeleton.bones[this.boneIndex].flipX = frames[frameIndex + 1] != 0;
    }
};
spine.FlipYTimeline = function (frameCount) {
    this.boneIndex = 0;
    this.curves = new spine.Curves(frameCount);
    this.frames = [];
    this.frames.length = frameCount * 2;
};
spine.FlipYTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 2;
    },
    setFrame: function (frameIndex, time, flip) {
        frameIndex *= 2;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = flip ? 1 : 0;
    },
    apply: function (skeleton, lastTime, time, firedEvents, alpha) {
        var frames = this.frames;
        if (time < frames[0]) {
            if (lastTime > time) this.apply(skeleton, lastTime, Number.MAX_VALUE, null, 0);
            return;
        } else if (lastTime > time)
            lastTime = -1;
        var frameIndex = (time >= frames[frames.length - 2] ? frames.length : spine.Animation.binarySearch(frames, time, 2)) - 2;
        if (frames[frameIndex] < lastTime) return;
        skeleton.bones[this.boneIndex].flipY = frames[frameIndex + 1] != 0;
    }
};
spine.SkeletonData = function () {
    this.width = this.height = 0;
    this.bones = [];
    this.slots = [];
    this.skins = [];
    this.events = [];
    this.animations = [];
    this.ikConstraints = [];
};
spine.SkeletonData.prototype = {
    name: null,
    defaultSkin: null,
    width: 0, height: 0,
    version: null, hash: null,
    findBone: function (boneName) {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].name == boneName) return bones[i];
        return null;
    },
    findBoneIndex: function (boneName) {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].name == boneName) return i;
        return -1;
    },
    findSlot: function (slotName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++) {
            if (slots[i].name == slotName) return slot[i];
        }
        return null;
    },
    findSlotIndex: function (slotName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            if (slots[i].name == slotName) return i;
        return -1;
    },
    findSkin: function (skinName) {
        var skins = this.skins;
        for (var i = 0, n = skins.length; i < n; i++)
            if (skins[i].name == skinName) return skins[i];
        return null;
    },
    findEvent: function (eventName) {
        var events = this.events;
        for (var i = 0, n = events.length; i < n; i++)
            if (events[i].name == eventName) return events[i];
        return null;
    },
    findAnimation: function (animationName) {
        var animations = this.animations;
        for (var i = 0, n = animations.length; i < n; i++)
            if (animations[i].name == animationName) return animations[i];
        return null;
    },
    findIkConstraint: function (ikConstraintName) {
        var ikConstraints = this.ikConstraints;
        for (var i = 0, n = ikConstraints.length; i < n; i++)
            if (ikConstraints[i].name == ikConstraintName) return ikConstraints[i];
        return null;
    }
};
spine.Skeleton = function (skeletonData) {
    this.x = this.y = 0;
    this.r = this.g = this.b = this.a = 1;
    this.time = 0;
    this.flipX = this.flipY = false;
    this.data = skeletonData;
    this.bones = [];
    for (var i = 0, n = skeletonData.bones.length; i < n; i++) {
        var boneData = skeletonData.bones[i];
        var parent = !boneData.parent ? null : this.bones[skeletonData.bones.indexOf(boneData.parent)];
        this.bones.push(new spine.Bone(boneData, this, parent));
    }
    this.slots = [];
    this.drawOrder = [];
    for (var i = 0, n = skeletonData.slots.length; i < n; i++) {
        var slotData = skeletonData.slots[i];
        var bone = this.bones[skeletonData.bones.indexOf(slotData.boneData)];
        var slot = new spine.Slot(slotData, bone);
        this.slots.push(slot);
        this.drawOrder.push(slot);
    }
    this.ikConstraints = [];
    for (var i = 0, n = skeletonData.ikConstraints.length; i < n; i++)
        this.ikConstraints.push(new spine.IkConstraint(skeletonData.ikConstraints[i], this));
    this.boneCache = [];
    this.updateCache();
};
spine.Skeleton.prototype = {
    x: 0, y: 0,
    skin: null,
    r: 1, g: 1, b: 1, a: 1,
    time: 0,
    flipX: false, flipY: false,
    updateCache: function () {
        var ikConstraints = this.ikConstraints;
        var ikConstraintsCount = ikConstraints.length;
        var arrayCount = ikConstraintsCount + 1;
        var boneCache = this.boneCache;
        if (boneCache.length > arrayCount) boneCache.length = arrayCount;
        for (var i = 0, n = boneCache.length; i < n; i++)
            boneCache[i].length = 0;
        while (boneCache.length < arrayCount)
            boneCache[boneCache.length] = [];
        var nonIkBones = boneCache[0];
        var bones = this.bones;
        outer:
        for (var i = 0, n = bones.length; i < n; i++) {
            var bone = bones[i];
            var current = bone;
            do {
                for (var ii = 0; ii < ikConstraintsCount; ii++) {
                    var ikConstraint = ikConstraints[ii];
                    var parent = ikConstraint.bones[0];
                    var child= ikConstraint.bones[ikConstraint.bones.length - 1];
                    while (true) {
                        if (current == child) {
                            boneCache[ii].push(bone);
                            boneCache[ii + 1].push(bone);
                            continue outer;
                        }
                        if (child == parent) break;
                        child = child.parent;
                    }
                }
                current = current.parent;
            } while (current);
            nonIkBones[nonIkBones.length] = bone;
        }
    },
    updateWorldTransform: function () {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++) {
            var bone = bones[i];
            bone.rotationIK = bone.rotation;
        }
        var i = 0, last = this.boneCache.length - 1;
        while (true) {
            var cacheBones = this.boneCache[i];
            for (var ii = 0, nn = cacheBones.length; ii < nn; ii++)
                cacheBones[ii].updateWorldTransform();
            if (i == last) break;
            this.ikConstraints[i].apply();
            i++;
        }
    },
    setToSetupPose: function () {
        this.setBonesToSetupPose();
        this.setSlotsToSetupPose();
    },
    setBonesToSetupPose: function () {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            bones[i].setToSetupPose();
        var ikConstraints = this.ikConstraints;
        for (var i = 0, n = ikConstraints.length; i < n; i++) {
            var ikConstraint = ikConstraints[i];
            ikConstraint.bendDirection = ikConstraint.data.bendDirection;
            ikConstraint.mix = ikConstraint.data.mix;
        }
    },
    setSlotsToSetupPose: function () {
        var slots = this.slots;
        var drawOrder = this.drawOrder;
        for (var i = 0, n = slots.length; i < n; i++) {
            drawOrder[i] = slots[i];
            slots[i].setToSetupPose(i);
        }
    },
    getRootBone: function () {
        return this.bones.length ? this.bones[0] : null;
    },
    findBone: function (boneName) {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].data.name == boneName) return bones[i];
        return null;
    },
    findBoneIndex: function (boneName) {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].data.name == boneName) return i;
        return -1;
    },
    findSlot: function (slotName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            if (slots[i].data.name == slotName) return slots[i];
        return null;
    },
    findSlotIndex: function (slotName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            if (slots[i].data.name == slotName) return i;
        return -1;
    },
    setSkinByName: function (skinName) {
        var skin = this.data.findSkin(skinName);
        if (!skin) throw new Error("Skin not found: " + skinName);
        this.setSkin(skin);
    },
    setSkin: function (newSkin) {
        if (newSkin) {
            if (this.skin)
                newSkin._attachAll(this, this.skin);
            else {
                var slots = this.slots;
                for (var i = 0, n = slots.length; i < n; i++) {
                    var slot = slots[i];
                    var name = slot.data.attachmentName;
                    if (name) {
                        var attachment = newSkin.getAttachment(i, name);
                        if (attachment) slot.setAttachment(attachment);
                    }
                }
            }
        }
        this.skin = newSkin;
    },
    getAttachmentBySlotName: function (slotName, attachmentName) {
        return this.getAttachmentBySlotIndex(this.data.findSlotIndex(slotName), attachmentName);
    },
    getAttachmentBySlotIndex: function (slotIndex, attachmentName) {
        if (this.skin) {
            var attachment = this.skin.getAttachment(slotIndex, attachmentName);
            if (attachment) return attachment;
        }
        if (this.data.defaultSkin) return this.data.defaultSkin.getAttachment(slotIndex, attachmentName);
        return null;
    },
    setAttachment: function (slotName, attachmentName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++) {
            var slot = slots[i];
            if (slot.data.name == slotName) {
                var attachment = null;
                if (attachmentName) {
                    attachment = this.getAttachmentBySlotIndex(i, attachmentName);
                    if (!attachment) throw new Error("Attachment not found: " + attachmentName + ", for slot: " + slotName);
                }
                slot.setAttachment(attachment);
                return;
            }
        }
        throw new Error("Slot not found: " + slotName);
    },
    findIkConstraint: function (ikConstraintName) {
        var ikConstraints = this.ikConstraints;
        for (var i = 0, n = ikConstraints.length; i < n; i++)
            if (ikConstraints[i].data.name == ikConstraintName) return ikConstraints[i];
        return null;
    },
    update: function (delta) {
        this.time += delta;
    }
};
spine.EventData = function (name) {
    this.intValue = this.floatValue = 0;
    this.name = name;
};
spine.EventData.prototype = {
    intValue: 0,
    floatValue: 0,
    stringValue: null
};
spine.Event = function (data) {
    this.intValue = this.floatValue = 0;
    this.data = data;
};
spine.Event.prototype = {
    intValue: 0,
    floatValue: 0,
    stringValue: null
};
spine.AttachmentType = {
    region: 0,
    boundingbox: 1,
    mesh: 2,
    skinnedmesh: 3
};
spine.RegionAttachment = function (name) {
    this.type = spine.AttachmentType.region;
    this.x = this.y = this.rotation = 0;
    this.scaleX = this.scaleY = 1;
    this.width = this.height = 0;
    this.r = this.g = this.b = this.a = 1;
    this.regionOffsetX = this.regionOffsetY = this.regionWidth = this.regionHeight = this.regionOriginalWidth = this.regionOriginalHeight = 0;
    this.name = name;
    this.offset = [];
    this.offset.length = 8;
    this.uvs = [];
    this.uvs.length = 8;
};
spine.RegionAttachment.prototype = {
    x: 0, y: 0,
    rotation: 0,
    scaleX: 1, scaleY: 1,
    width: 0, height: 0,
    r: 1, g: 1, b: 1, a: 1,
    path: null,
    rendererObject: null,
    regionOffsetX: 0, regionOffsetY: 0,
    regionWidth: 0, regionHeight: 0,
    regionOriginalWidth: 0, regionOriginalHeight: 0,
    setUVs: function (u, v, u2, v2, rotate) {
        var uvs = this.uvs;
        if (rotate) {
            uvs[2] = u;
            uvs[3] = v2;
            uvs[4] = u;
            uvs[5] = v;
            uvs[6] = u2;
            uvs[7] = v;
            uvs[0] = u2;
            uvs[1] = v2;
        } else {
            uvs[0] = u;
            uvs[1] = v2;
            uvs[2] = u;
            uvs[3] = v;
            uvs[4] = u2;
            uvs[5] = v;
            uvs[6] = u2;
            uvs[7] = v2;
        }
    },
    updateOffset: function () {
        var regionScaleX = this.width / this.regionOriginalWidth * this.scaleX;
        var regionScaleY = this.height / this.regionOriginalHeight * this.scaleY;
        var localX = -this.width / 2 * this.scaleX + this.regionOffsetX * regionScaleX;
        var localY = -this.height / 2 * this.scaleY + this.regionOffsetY * regionScaleY;
        var localX2 = localX + this.regionWidth * regionScaleX;
        var localY2 = localY + this.regionHeight * regionScaleY;
        var radians = this.rotation * spine.degRad;
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var localXCos = localX * cos + this.x;
        var localXSin = localX * sin;
        var localYCos = localY * cos + this.y;
        var localYSin = localY * sin;
        var localX2Cos = localX2 * cos + this.x;
        var localX2Sin = localX2 * sin;
        var localY2Cos = localY2 * cos + this.y;
        var localY2Sin = localY2 * sin;
        var offset = this.offset;
        offset[0] = localXCos - localYSin;
        offset[1] = localYCos + localXSin;
        offset[2] = localXCos - localY2Sin;
        offset[3] = localY2Cos + localXSin;
        offset[4] = localX2Cos - localY2Sin;
        offset[5] = localY2Cos + localX2Sin;
        offset[6] = localX2Cos - localYSin;
        offset[7] = localYCos + localX2Sin;
    },
    computeVertices: function (x, y, bone, vertices) {
        x += bone.worldX;
        y += bone.worldY;
        var m00 = bone.m00, m01 = bone.m01, m10 = bone.m10, m11 = bone.m11;
        var offset = this.offset;
        vertices[0] = offset[0] * m00 + offset[1] * m01 + x;
        vertices[1] = offset[0] * m10 + offset[1] * m11 + y;
        vertices[2] = offset[2] * m00 + offset[3] * m01 + x;
        vertices[3] = offset[2] * m10 + offset[3] * m11 + y;
        vertices[4] = offset[4] * m00 + offset[5] * m01 + x;
        vertices[5] = offset[4] * m10 + offset[5] * m11 + y;
        vertices[6] = offset[6] * m00 + offset[7] * m01 + x;
        vertices[7] = offset[6] * m10 + offset[7] * m11 + y;
    }
};
spine.MeshAttachment = function (name) {
    this.type = spine.AttachmentType.mesh;
    this.hullLength = 0;
    this.r = this.g = this.b = this.a = 1;
    this.regionU = this.regionV = this.regionV2 = 0;
    this.regionRotate = false;
    this.regionOffsetX = this.regionOffsetY = this.regionWidth = this.regionHeight = this.regionOriginalWidth = this.regionOriginalHeight = 0;
    this.width = this.height = 0;
    this.name = name;
};
spine.MeshAttachment.prototype = {
    vertices: null,
    uvs: null,
    regionUVs: null,
    triangles: null,
    hullLength: 0,
    r: 1, g: 1, b: 1, a: 1,
    path: null,
    rendererObject: null,
    regionU: 0, regionV: 0, regionU2: 0, regionV2: 0, regionRotate: false,
    regionOffsetX: 0, regionOffsetY: 0,
    regionWidth: 0, regionHeight: 0,
    regionOriginalWidth: 0, regionOriginalHeight: 0,
    edges: null,
    width: 0, height: 0,
    updateUVs: function () {
        var width = this.regionU2 - this.regionU, height = this.regionV2 - this.regionV;
        var n = this.regionUVs.length;
        if (!this.uvs || this.uvs.length != n) {
            this.uvs = new spine.Float32Array(n);
        }
        if (this.regionRotate) {
            for (var i = 0; i < n; i += 2) {
                this.uvs[i] = this.regionU + this.regionUVs[i + 1] * width;
                this.uvs[i + 1] = this.regionV + height - this.regionUVs[i] * height;
            }
        } else {
            for (var i = 0; i < n; i += 2) {
                this.uvs[i] = this.regionU + this.regionUVs[i] * width;
                this.uvs[i + 1] = this.regionV + this.regionUVs[i + 1] * height;
            }
        }
    },
    computeWorldVertices: function (x, y, slot, worldVertices) {
        var bone = slot.bone;
        x += bone.worldX;
        y += bone.worldY;
        var m00 = bone.m00, m01 = bone.m01, m10 = bone.m10, m11 = bone.m11;
        var vertices = this.vertices;
        var verticesCount = vertices.length;
        if (slot.attachmentVertices.length == verticesCount) vertices = slot.attachmentVertices;
        for (var i = 0; i < verticesCount; i += 2) {
            var vx = vertices[i];
            var vy = vertices[i + 1];
            worldVertices[i] = vx * m00 + vy * m01 + x;
            worldVertices[i + 1] = vx * m10 + vy * m11 + y;
        }
    }
};
spine.SkinnedMeshAttachment = function (name) {
    this.type = spine.AttachmentType.skinnedmesh;
    this.hullLength = 0;
    this.r = this.g = this.b = this.a = 1;
    this.regionU = this.regionV = this.regionU2 = this.regionV2 = 0;
    this.regionRotate = false;
    this.regionOffsetX = this.regionOffsetY = this.regionWidth = this.regionHeight = this.regionOriginalWidth = this.regionOriginalHeight = 0;
    this.width = this.height = 0;
    this.name = name;
};
spine.SkinnedMeshAttachment.prototype = {
    bones: null,
    weights: null,
    uvs: null,
    regionUVs: null,
    triangles: null,
    hullLength: 0,
    r: 1, g: 1, b: 1, a: 1,
    path: null,
    rendererObject: null,
    regionU: 0, regionV: 0, regionU2: 0, regionV2: 0, regionRotate: false,
    regionOffsetX: 0, regionOffsetY: 0,
    regionWidth: 0, regionHeight: 0,
    regionOriginalWidth: 0, regionOriginalHeight: 0,
    edges: null,
    width: 0, height: 0,
    updateUVs: function (u, v, u2, v2, rotate) {
        var width = this.regionU2 - this.regionU, height = this.regionV2 - this.regionV;
        var n = this.regionUVs.length;
        if (!this.uvs || this.uvs.length != n) {
            this.uvs = new spine.Float32Array(n);
        }
        if (this.regionRotate) {
            for (var i = 0; i < n; i += 2) {
                this.uvs[i] = this.regionU + this.regionUVs[i + 1] * width;
                this.uvs[i + 1] = this.regionV + height - this.regionUVs[i] * height;
            }
        } else {
            for (var i = 0; i < n; i += 2) {
                this.uvs[i] = this.regionU + this.regionUVs[i] * width;
                this.uvs[i + 1] = this.regionV + this.regionUVs[i + 1] * height;
            }
        }
    },
    computeWorldVertices: function (x, y, slot, worldVertices) {
        var skeletonBones = slot.bone.skeleton.bones;
        var weights = this.weights;
        var bones = this.bones;
        var w = 0, v = 0, b = 0, f = 0, n = bones.length, nn;
        var wx, wy, bone, vx, vy, weight;
        if (!slot.attachmentVertices.length) {
            for (; v < n; w += 2) {
                wx = 0;
                wy = 0;
                nn = bones[v++] + v;
                for (; v < nn; v++, b += 3) {
                    bone = skeletonBones[bones[v]];
                    vx = weights[b];
                    vy = weights[b + 1];
                    weight = weights[b + 2];
                    wx += (vx * bone.m00 + vy * bone.m01 + bone.worldX) * weight;
                    wy += (vx * bone.m10 + vy * bone.m11 + bone.worldY) * weight;
                }
                worldVertices[w] = wx + x;
                worldVertices[w + 1] = wy + y;
            }
        } else {
            var ffd = slot.attachmentVertices;
            for (; v < n; w += 2) {
                wx = 0;
                wy = 0;
                nn = bones[v++] + v;
                for (; v < nn; v++, b += 3, f += 2) {
                    bone = skeletonBones[bones[v]];
                    vx = weights[b] + ffd[f];
                    vy = weights[b + 1] + ffd[f + 1];
                    weight = weights[b + 2];
                    wx += (vx * bone.m00 + vy * bone.m01 + bone.worldX) * weight;
                    wy += (vx * bone.m10 + vy * bone.m11 + bone.worldY) * weight;
                }
                worldVertices[w] = wx + x;
                worldVertices[w + 1] = wy + y;
            }
        }
    }
};
spine.BoundingBoxAttachment = function (name) {
    this.type = spine.AttachmentType.boundingbox;
    this.name = name;
    this.vertices = [];
};
spine.BoundingBoxAttachment.prototype = {
    computeWorldVertices: function (x, y, bone, worldVertices) {
        x += bone.worldX;
        y += bone.worldY;
        var m00 = bone.m00, m01 = bone.m01, m10 = bone.m10, m11 = bone.m11;
        var vertices = this.vertices;
        for (var i = 0, n = vertices.length; i < n; i += 2) {
            var px = vertices[i];
            var py = vertices[i + 1];
            worldVertices[i] = px * m00 + py * m01 + x;
            worldVertices[i + 1] = px * m10 + py * m11 + y;
        }
    }
};
spine.AnimationStateData = function (skeletonData) {
    this.skeletonData = skeletonData;
    this.animationToMixTime = {};
    this.defaultMix = 0;
};
spine.AnimationStateData.prototype = {
    defaultMix: 0,
    setMixByName: function (fromName, toName, duration) {
        var from = this.skeletonData.findAnimation(fromName);
        if (!from) throw new Error("Animation not found: " + fromName);
        var to = this.skeletonData.findAnimation(toName);
        if (!to) throw new Error("Animation not found: " + toName);
        this.setMix(from, to, duration);
    },
    setMix: function (from, to, duration) {
        this.animationToMixTime[from.name + ":" + to.name] = duration;
    },
    getMix: function (from, to) {
        var key = from.name + ":" + to.name;
        return this.animationToMixTime.hasOwnProperty(key) ? this.animationToMixTime[key] : this.defaultMix;
    }
};
spine.TrackEntry = function () {
    this.delay = this.time = this.endTime = 0;
    this.lastTime = -1;
    this.timeScale = 1;
    this.mixTime = this.mixDuration = 1;
    this.mix = 1;
};
spine.TrackEntry.prototype = {
    next: null, previous: null,
    animation: null,
    loop: false,
    delay: 0, time: 0, lastTime: -1, endTime: 0,
    timeScale: 1,
    mixTime: 0, mixDuration: 0, mix: 1,
    onStart: null, onEnd: null, onComplete: null, onEvent: null
};
spine.AnimationState = function (stateData) {
    this.timeScale = 1;
    this.data = stateData;
    this.tracks = [];
    this.events = [];
};
spine.AnimationState.prototype = {
    onStart: null,
    onEnd: null,
    onComplete: null,
    onEvent: null,
    timeScale: 1,
    update: function (delta) {
        delta *= this.timeScale;
        for (var i = 0; i < this.tracks.length; i++) {
            var current = this.tracks[i];
            if (!current) continue;
            current.time += delta * current.timeScale;
            if (current.previous) {
                var previousDelta = delta * current.previous.timeScale;
                current.previous.time += previousDelta;
                current.mixTime += previousDelta;
            }
            var next = current.next;
            if (next) {
                next.time = current.lastTime - next.delay;
                if (next.time >= 0) this.setCurrent(i, next);
            } else {
                if (!current.loop && current.lastTime >= current.endTime) this.clearTrack(i);
            }
        }
    },
    apply: function (skeleton) {
        for (var i = 0; i < this.tracks.length; i++) {
            var current = this.tracks[i];
            if (!current) continue;
            this.events.length = 0;
            var time = current.time;
            var lastTime = current.lastTime;
            var endTime = current.endTime;
            var loop = current.loop;
            if (!loop && time > endTime) time = endTime;
            var previous = current.previous;
            if (!previous) {
                if (current.mix == 1)
                    current.animation.apply(skeleton, current.lastTime, time, loop, this.events);
                else
                    current.animation.mix(skeleton, current.lastTime, time, loop, this.events, current.mix);
            } else {
                var previousTime = previous.time;
                if (!previous.loop && previousTime > previous.endTime) previousTime = previous.endTime;
                previous.animation.apply(skeleton, previousTime, previousTime, previous.loop, null);
                var alpha = current.mixTime / current.mixDuration * current.mix;
                if (alpha >= 1) {
                    alpha = 1;
                    current.previous = null;
                }
                current.animation.mix(skeleton, current.lastTime, time, loop, this.events, alpha);
            }
            for (var ii = 0, nn = this.events.length; ii < nn; ii++) {
                var event = this.events[ii];
                if (current.onEvent) current.onEvent(i, event);
                if (this.onEvent) this.onEvent(i, event);
            }
            if (loop ? (lastTime % endTime > time % endTime) : (lastTime < endTime && time >= endTime)) {
                var count = Math.floor(time / endTime);
                if (current.onComplete) current.onComplete(i, count);
                if (this.onComplete) this.onComplete(i, count);
            }
            current.lastTime = current.time;
        }
    },
    clearTracks: function () {
        for (var i = 0, n = this.tracks.length; i < n; i++)
            this.clearTrack(i);
        this.tracks.length = 0;
    },
    clearTrack: function (trackIndex) {
        if (trackIndex >= this.tracks.length) return;
        var current = this.tracks[trackIndex];
        if (!current) return;
        if (current.onEnd) current.onEnd(trackIndex);
        if (this.onEnd) this.onEnd(trackIndex);
        this.tracks[trackIndex] = null;
    },
    _expandToIndex: function (index) {
        if (index < this.tracks.length) return this.tracks[index];
        while (index >= this.tracks.length)
            this.tracks.push(null);
        return null;
    },
    setCurrent: function (index, entry) {
        var current = this._expandToIndex(index);
        if (current) {
            var previous = current.previous;
            current.previous = null;
            if (current.onEnd) current.onEnd(index);
            if (this.onEnd) this.onEnd(index);
            entry.mixDuration = this.data.getMix(current.animation, entry.animation);
            if (entry.mixDuration > 0) {
                entry.mixTime = 0;
                if (previous && current.mixTime / current.mixDuration < 0.5)
                    entry.previous = previous;
                else
                    entry.previous = current;
            }
        }
        this.tracks[index] = entry;
        if (entry.onStart) entry.onStart(index);
        if (this.onStart) this.onStart(index);
    },
    setAnimationByName: function (trackIndex, animationName, loop) {
        var animation = this.data.skeletonData.findAnimation(animationName);
        if (!animation) throw new Error("Animation not found: " + animationName);
        return this.setAnimation(trackIndex, animation, loop);
    },
    setAnimation: function (trackIndex, animation, loop) {
        var entry = new spine.TrackEntry();
        entry.animation = animation;
        entry.loop = loop;
        entry.endTime = animation.duration;
        this.setCurrent(trackIndex, entry);
        return entry;
    },
    addAnimationByName: function (trackIndex, animationName, loop, delay) {
        var animation = this.data.skeletonData.findAnimation(animationName);
        if (!animation) throw new Error("Animation not found: " + animationName);
        return this.addAnimation(trackIndex, animation, loop, delay);
    },
    addAnimation: function (trackIndex, animation, loop, delay) {
        var entry = new spine.TrackEntry();
        entry.animation = animation;
        entry.loop = loop;
        entry.endTime = animation.duration;
        var last = this._expandToIndex(trackIndex);
        if (last) {
            while (last.next)
                last = last.next;
            last.next = entry;
        } else
            this.tracks[trackIndex] = entry;
        if (delay <= 0) {
            if (last)
                delay += last.endTime - this.data.getMix(last.animation, animation);
            else
                delay = 0;
        }
        entry.delay = delay;
        return entry;
    },
    getCurrent: function (trackIndex) {
        if (trackIndex >= this.tracks.length) return null;
        return this.tracks[trackIndex];
    }
};
spine.SkeletonJson = function (attachmentLoader) {
    this.scale = 1;
    this.attachmentLoader = attachmentLoader;
};
spine.SkeletonJson.prototype = {
    scale: 1,
    readSkeletonData: function (root, name) {
        var skeletonData = new spine.SkeletonData();
        skeletonData.name = name;
        var skeletonMap = root["skeleton"];
        if (skeletonMap) {
            skeletonData.hash = skeletonMap["hash"];
            skeletonData.version = skeletonMap["spine"];
            skeletonData.width = skeletonMap["width"] || 0;
            skeletonData.height = skeletonMap["height"] || 0;
        }
        var bones = root["bones"];
        for (var i = 0, n = bones.length; i < n; i++) {
            var boneMap = bones[i];
            var parent = null;
            if (boneMap["parent"]) {
                parent = skeletonData.findBone(boneMap["parent"]);
                if (!parent) throw new Error("Parent bone not found: " + boneMap["parent"]);
            }
            var boneData = new spine.BoneData(boneMap["name"], parent);
            boneData.length = (boneMap["length"] || 0) * this.scale;
            boneData.x = (boneMap["x"] || 0) * this.scale;
            boneData.y = (boneMap["y"] || 0) * this.scale;
            boneData.rotation = (boneMap["rotation"] || 0);
            boneData.scaleX = boneMap.hasOwnProperty("scaleX") ? boneMap["scaleX"] : 1;
            boneData.scaleY = boneMap.hasOwnProperty("scaleY") ? boneMap["scaleY"] : 1;
            boneData.inheritScale = boneMap.hasOwnProperty("inheritScale") ? boneMap["inheritScale"] : true;
            boneData.inheritRotation = boneMap.hasOwnProperty("inheritRotation") ? boneMap["inheritRotation"] : true;
            skeletonData.bones.push(boneData);
        }
        var ik = root["ik"];
        if (ik) {
            for (var i = 0, n = ik.length; i < n; i++) {
                var ikMap = ik[i];
                var ikConstraintData = new spine.IkConstraintData(ikMap["name"]);
                var bones = ikMap["bones"];
                for (var ii = 0, nn = bones.length; ii < nn; ii++) {
                    var bone = skeletonData.findBone(bones[ii]);
                    if (!bone) throw new Error("IK bone not found: " + bones[ii]);
                    ikConstraintData.bones.push(bone);
                }
                ikConstraintData.target = skeletonData.findBone(ikMap["target"]);
                if (!ikConstraintData.target) throw new Error("Target bone not found: " + ikMap["target"]);
                ikConstraintData.bendDirection = (!ikMap.hasOwnProperty("bendPositive") || ikMap["bendPositive"]) ? 1 : -1;
                ikConstraintData.mix = ikMap.hasOwnProperty("mix") ? ikMap["mix"] : 1;
                skeletonData.ikConstraints.push(ikConstraintData);
            }
        }
        var slots = root["slots"];
        for (var i = 0, n = slots.length; i < n; i++) {
            var slotMap = slots[i];
            var boneData = skeletonData.findBone(slotMap["bone"]);
            if (!boneData) throw new Error("Slot bone not found: " + slotMap["bone"]);
            var slotData = new spine.SlotData(slotMap["name"], boneData);
            var color = slotMap["color"];
            if (color) {
                slotData.r = this.toColor(color, 0);
                slotData.g = this.toColor(color, 1);
                slotData.b = this.toColor(color, 2);
                slotData.a = this.toColor(color, 3);
            }
            slotData.attachmentName = slotMap["attachment"];
            slotData.blendMode = spine.AttachmentType[slotMap["blend"] || "normal"];
            skeletonData.slots.push(slotData);
        }
        var skins = root["skins"];
        for (var skinName in skins) {
            if (!skins.hasOwnProperty(skinName)) continue;
            var skinMap = skins[skinName];
            var skin = new spine.Skin(skinName);
            for (var slotName in skinMap) {
                if (!skinMap.hasOwnProperty(slotName)) continue;
                var slotIndex = skeletonData.findSlotIndex(slotName);
                var slotEntry = skinMap[slotName];
                for (var attachmentName in slotEntry) {
                    if (!slotEntry.hasOwnProperty(attachmentName)) continue;
                    var attachment = this.readAttachment(skin, attachmentName, slotEntry[attachmentName]);
                    if (attachment) skin.addAttachment(slotIndex, attachmentName, attachment);
                }
            }
            skeletonData.skins.push(skin);
            if (skin.name == "default") skeletonData.defaultSkin = skin;
        }
        var events = root["events"];
        for (var eventName in events) {
            if (!events.hasOwnProperty(eventName)) continue;
            var eventMap = events[eventName];
            var eventData = new spine.EventData(eventName);
            eventData.intValue = eventMap["int"] || 0;
            eventData.floatValue = eventMap["float"] || 0;
            eventData.stringValue = eventMap["string"] || null;
            skeletonData.events.push(eventData);
        }
        var animations = root["animations"];
        for (var animationName in animations) {
            if (!animations.hasOwnProperty(animationName)) continue;
            this.readAnimation(animationName, animations[animationName], skeletonData);
        }
        return skeletonData;
    },
    readAttachment: function (skin, name, map) {
        name = map["name"] || name;
        var type = spine.AttachmentType[map["type"] || "region"];
        var path = map["path"] || name;
        var scale = this.scale;
        if (type == spine.AttachmentType.region) {
            var region = this.attachmentLoader.newRegionAttachment(skin, name, path);
            if (!region) return null;
            region.path = path;
            region.x = (map["x"] || 0) * scale;
            region.y = (map["y"] || 0) * scale;
            region.scaleX = map.hasOwnProperty("scaleX") ? map["scaleX"] : 1;
            region.scaleY = map.hasOwnProperty("scaleY") ? map["scaleY"] : 1;
            region.rotation = map["rotation"] || 0;
            region.width = (map["width"] || 0) * scale;
            region.height = (map["height"] || 0) * scale;
            var color = map["color"];
            if (color) {
                region.r = this.toColor(color, 0);
                region.g = this.toColor(color, 1);
                region.b = this.toColor(color, 2);
                region.a = this.toColor(color, 3);
            }
            region.updateOffset();
            return region;
        } else if (type == spine.AttachmentType.mesh) {
            var mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
            if (!mesh) return null;
            mesh.path = path;
            mesh.vertices = this.getFloatArray(map, "vertices", scale);
            mesh.triangles = this.getIntArray(map, "triangles");
            mesh.regionUVs = this.getFloatArray(map, "uvs", 1);
            mesh.updateUVs();
            color = map["color"];
            if (color) {
                mesh.r = this.toColor(color, 0);
                mesh.g = this.toColor(color, 1);
                mesh.b = this.toColor(color, 2);
                mesh.a = this.toColor(color, 3);
            }
            mesh.hullLength = (map["hull"] || 0) * 2;
            if (map["edges"]) mesh.edges = this.getIntArray(map, "edges");
            mesh.width = (map["width"] || 0) * scale;
            mesh.height = (map["height"] || 0) * scale;
            return mesh;
        } else if (type == spine.AttachmentType.skinnedmesh) {
            var mesh = this.attachmentLoader.newSkinnedMeshAttachment(skin, name, path);
            if (!mesh) return null;
            mesh.path = path;
            var uvs = this.getFloatArray(map, "uvs", 1);
            var vertices = this.getFloatArray(map, "vertices", 1);
            var weights = [];
            var bones = [];
            for (var i = 0, n = vertices.length; i < n; ) {
                var boneCount = vertices[i++] | 0;
                bones[bones.length] = boneCount;
                for (var nn = i + boneCount * 4; i < nn; ) {
                    bones[bones.length] = vertices[i];
                    weights[weights.length] = vertices[i + 1] * scale;
                    weights[weights.length] = vertices[i + 2] * scale;
                    weights[weights.length] = vertices[i + 3];
                    i += 4;
                }
            }
            mesh.bones = bones;
            mesh.weights = weights;
            mesh.triangles = this.getIntArray(map, "triangles");
            mesh.regionUVs = uvs;
            mesh.updateUVs();
            color = map["color"];
            if (color) {
                mesh.r = this.toColor(color, 0);
                mesh.g = this.toColor(color, 1);
                mesh.b = this.toColor(color, 2);
                mesh.a = this.toColor(color, 3);
            }
            mesh.hullLength = (map["hull"] || 0) * 2;
            if (map["edges"]) mesh.edges = this.getIntArray(map, "edges");
            mesh.width = (map["width"] || 0) * scale;
            mesh.height = (map["height"] || 0) * scale;
            return mesh;
        } else if (type == spine.AttachmentType.boundingbox) {
            var attachment = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
            var vertices = map["vertices"];
            for (var i = 0, n = vertices.length; i < n; i++)
                attachment.vertices.push(vertices[i] * scale);
            return attachment;
        }
        throw new Error("Unknown attachment type: " + type);
    },
    readAnimation: function (name, map, skeletonData) {
        var timelines = [];
        var duration = 0;
        var slots = map["slots"];
        for (var slotName in slots) {
            if (!slots.hasOwnProperty(slotName)) continue;
            var slotMap = slots[slotName];
            var slotIndex = skeletonData.findSlotIndex(slotName);
            for (var timelineName in slotMap) {
                if (!slotMap.hasOwnProperty(timelineName)) continue;
                var values = slotMap[timelineName];
                if (timelineName == "color") {
                    var timeline = new spine.ColorTimeline(values.length);
                    timeline.slotIndex = slotIndex;
                    var frameIndex = 0;
                    for (var i = 0, n = values.length; i < n; i++) {
                        var valueMap = values[i];
                        var color = valueMap["color"];
                        var r = this.toColor(color, 0);
                        var g = this.toColor(color, 1);
                        var b = this.toColor(color, 2);
                        var a = this.toColor(color, 3);
                        timeline.setFrame(frameIndex, valueMap["time"], r, g, b, a);
                        this.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 5 - 5]);
                } else if (timelineName == "attachment") {
                    var timeline = new spine.AttachmentTimeline(values.length);
                    timeline.slotIndex = slotIndex;
                    var frameIndex = 0;
                    for (var i = 0, n = values.length; i < n; i++) {
                        var valueMap = values[i];
                        timeline.setFrame(frameIndex++, valueMap["time"], valueMap["name"]);
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
                } else
                    throw new Error("Invalid timeline type for a slot: " + timelineName + " (" + slotName + ")");
            }
        }
        var bones = map["bones"];
        for (var boneName in bones) {
            if (!bones.hasOwnProperty(boneName)) continue;
            var boneIndex = skeletonData.findBoneIndex(boneName);
            if (boneIndex == -1) throw new Error("Bone not found: " + boneName);
            var boneMap = bones[boneName];
            for (var timelineName in boneMap) {
                if (!boneMap.hasOwnProperty(timelineName)) continue;
                var values = boneMap[timelineName];
                if (timelineName == "rotate") {
                    var timeline = new spine.RotateTimeline(values.length);
                    timeline.boneIndex = boneIndex;
                    var frameIndex = 0;
                    for (var i = 0, n = values.length; i < n; i++) {
                        var valueMap = values[i];
                        timeline.setFrame(frameIndex, valueMap["time"], valueMap["angle"]);
                        this.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 2 - 2]);
                } else if (timelineName == "translate" || timelineName == "scale") {
                    var timeline;
                    var timelineScale = 1;
                    if (timelineName == "scale")
                        timeline = new spine.ScaleTimeline(values.length);
                    else {
                        timeline = new spine.TranslateTimeline(values.length);
                        timelineScale = this.scale;
                    }
                    timeline.boneIndex = boneIndex;
                    var frameIndex = 0;
                    for (var i = 0, n = values.length; i < n; i++) {
                        var valueMap = values[i];
                        var x = (valueMap["x"] || 0) * timelineScale;
                        var y = (valueMap["y"] || 0) * timelineScale;
                        timeline.setFrame(frameIndex, valueMap["time"], x, y);
                        this.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 3 - 3]);
                } else if (timelineName == "flipX" || timelineName == "flipY") {
                    var x = timelineName == "flipX";
                    var timeline = x ? new spine.FlipXTimeline(values.length) : new spine.FlipYTimeline(values.length);
                    timeline.boneIndex = boneIndex;
                    var field = x ? "x" : "y";
                    var frameIndex = 0;
                    for (var i = 0, n = values.length; i < n; i++) {
                        var valueMap = values[i];
                        timeline.setFrame(frameIndex, valueMap["time"], valueMap[field] || false);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 2 - 2]);
                } else
                    throw new Error("Invalid timeline type for a bone: " + timelineName + " (" + boneName + ")");
            }
        }
        var ikMap = map["ik"];
        for (var ikConstraintName in ikMap) {
            if (!ikMap.hasOwnProperty(ikConstraintName)) continue;
            var ikConstraint = skeletonData.findIkConstraint(ikConstraintName);
            var values = ikMap[ikConstraintName];
            var timeline = new spine.IkConstraintTimeline(values.length);
            timeline.ikConstraintIndex = skeletonData.ikConstraints.indexOf(ikConstraint);
            var frameIndex = 0;
            for (var i = 0, n = values.length; i < n; i++) {
                var valueMap = values[i];
                var mix = valueMap.hasOwnProperty("mix") ? valueMap["mix"] : 1;
                var bendDirection = (!valueMap.hasOwnProperty("bendPositive") || valueMap["bendPositive"]) ? 1 : -1;
                timeline.setFrame(frameIndex, valueMap["time"], mix, bendDirection);
                this.readCurve(timeline, frameIndex, valueMap);
                frameIndex++;
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[timeline.frameCount * 3 - 3]);
        }
        var ffd = map["ffd"];
        for (var skinName in ffd) {
            var skin = skeletonData.findSkin(skinName);
            var slotMap = ffd[skinName];
            for (slotName in slotMap) {
                var slotIndex = skeletonData.findSlotIndex(slotName);
                var meshMap = slotMap[slotName];
                for (var meshName in meshMap) {
                    var values = meshMap[meshName];
                    var timeline = new spine.FfdTimeline(values.length);
                    var attachment = skin.getAttachment(slotIndex, meshName);
                    if (!attachment) throw new Error("FFD attachment not found: " + meshName);
                    timeline.slotIndex = slotIndex;
                    timeline.attachment = attachment;
                    var isMesh = attachment.type == spine.AttachmentType.mesh;
                    var vertexCount;
                    if (isMesh)
                        vertexCount = attachment.vertices.length;
                    else
                        vertexCount = attachment.weights.length / 3 * 2;
                    var frameIndex = 0;
                    for (var i = 0, n = values.length; i < n; i++) {
                        var valueMap = values[i];
                        var vertices;
                        if (!valueMap["vertices"]) {
                            if (isMesh)
                                vertices = attachment.vertices;
                            else {
                                vertices = [];
                                vertices.length = vertexCount;
                            }
                        } else {
                            var verticesValue = valueMap["vertices"];
                            var vertices = [];
                            vertices.length = vertexCount;
                            var start = valueMap["offset"] || 0;
                            var nn = verticesValue.length;
                            if (this.scale == 1) {
                                for (var ii = 0; ii < nn; ii++)
                                    vertices[ii + start] = verticesValue[ii];
                            } else {
                                for (var ii = 0; ii < nn; ii++)
                                    vertices[ii + start] = verticesValue[ii] * this.scale;
                            }
                            if (isMesh) {
                                var meshVertices = attachment.vertices;
                                for (var ii = 0, nn = vertices.length; ii < nn; ii++)
                                    vertices[ii] += meshVertices[ii];
                            }
                        }
                        timeline.setFrame(frameIndex, valueMap["time"], vertices);
                        this.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines[timelines.length] = timeline;
                    duration = Math.max(duration, timeline.frames[timeline.frameCount - 1]);
                }
            }
        }
        var drawOrderValues = map["drawOrder"];
        if (!drawOrderValues) drawOrderValues = map["draworder"];
        if (drawOrderValues) {
            var timeline = new spine.DrawOrderTimeline(drawOrderValues.length);
            var slotCount = skeletonData.slots.length;
            var frameIndex = 0;
            for (var i = 0, n = drawOrderValues.length; i < n; i++) {
                var drawOrderMap = drawOrderValues[i];
                var drawOrder = null;
                if (drawOrderMap["offsets"]) {
                    drawOrder = [];
                    drawOrder.length = slotCount;
                    for (var ii = slotCount - 1; ii >= 0; ii--)
                        drawOrder[ii] = -1;
                    var offsets = drawOrderMap["offsets"];
                    var unchanged = [];
                    unchanged.length = slotCount - offsets.length;
                    var originalIndex = 0, unchangedIndex = 0;
                    for (var ii = 0, nn = offsets.length; ii < nn; ii++) {
                        var offsetMap = offsets[ii];
                        var slotIndex = skeletonData.findSlotIndex(offsetMap["slot"]);
                        if (slotIndex == -1) throw new Error("Slot not found: " + offsetMap["slot"]);
                        while (originalIndex != slotIndex)
                            unchanged[unchangedIndex++] = originalIndex++;
                        drawOrder[originalIndex + offsetMap["offset"]] = originalIndex++;
                    }
                    while (originalIndex < slotCount)
                        unchanged[unchangedIndex++] = originalIndex++;
                    for (var ii = slotCount - 1; ii >= 0; ii--)
                        if (drawOrder[ii] == -1) drawOrder[ii] = unchanged[--unchangedIndex];
                }
                timeline.setFrame(frameIndex++, drawOrderMap["time"], drawOrder);
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
        }
        var events = map["events"];
        if (events) {
            var timeline = new spine.EventTimeline(events.length);
            var frameIndex = 0;
            for (var i = 0, n = events.length; i < n; i++) {
                var eventMap = events[i];
                var eventData = skeletonData.findEvent(eventMap["name"]);
                if (!eventData) throw new Error("Event not found: " + eventMap["name"]);
                var event = new spine.Event(eventData);
                event.intValue = eventMap.hasOwnProperty("int") ? eventMap["int"] : eventData.intValue;
                event.floatValue = eventMap.hasOwnProperty("float") ? eventMap["float"] : eventData.floatValue;
                event.stringValue = eventMap.hasOwnProperty("string") ? eventMap["string"] : eventData.stringValue;
                timeline.setFrame(frameIndex++, eventMap["time"], event);
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
        }
        skeletonData.animations.push(new spine.Animation(name, timelines, duration));
    },
    readCurve: function (timeline, frameIndex, valueMap) {
        var curve = valueMap["curve"];
        if (!curve)
            timeline.curves.setLinear(frameIndex);
        else if (curve == "stepped")
            timeline.curves.setStepped(frameIndex);
        else if (curve instanceof Array)
            timeline.curves.setCurve(frameIndex, curve[0], curve[1], curve[2], curve[3]);
    },
    toColor: function (hexString, colorIndex) {
        if (hexString.length != 8) throw new Error("Color hexidecimal length must be 8, recieved: " + hexString);
        return parseInt(hexString.substring(colorIndex * 2, (colorIndex * 2) + 2), 16) / 255;
    },
    getFloatArray: function (map, name, scale) {
        var list = map[name];
        var values = new spine.Float32Array(list.length);
        var i = 0, n = list.length;
        if (scale == 1) {
            for (; i < n; i++)
                values[i] = list[i];
        } else {
            for (; i < n; i++)
                values[i] = list[i] * scale;
        }
        return values;
    },
    getIntArray: function (map, name) {
        var list = map[name];
        var values = new spine.Uint16Array(list.length);
        for (var i = 0, n = list.length; i < n; i++)
            values[i] = list[i] | 0;
        return values;
    }
};
spine.Atlas = function (atlasText, textureLoader) {
    this.textureLoader = textureLoader;
    this.pages = [];
    this.regions = [];
    var reader = new spine.AtlasReader(atlasText);
    var tuple = [];
    tuple.length = 4;
    var page = null;
    while (true) {
        var line = reader.readLine();
        if (line === null) break;
        line = reader.trim(line);
        if (!line.length)
            page = null;
        else if (!page) {
            page = new spine.AtlasPage();
            page.name = line;
            if (reader.readTuple(tuple) == 2) {
                page.width = parseInt(tuple[0]);
                page.height = parseInt(tuple[1]);
                reader.readTuple(tuple);
            }
            page.format = spine.Atlas.Format[tuple[0]];
            reader.readTuple(tuple);
            page.minFilter = spine.Atlas.TextureFilter[tuple[0]];
            page.magFilter = spine.Atlas.TextureFilter[tuple[1]];
            var direction = reader.readValue();
            page.uWrap = spine.Atlas.TextureWrap.clampToEdge;
            page.vWrap = spine.Atlas.TextureWrap.clampToEdge;
            if (direction == "x")
                page.uWrap = spine.Atlas.TextureWrap.repeat;
            else if (direction == "y")
                page.vWrap = spine.Atlas.TextureWrap.repeat;
            else if (direction == "xy")
                page.uWrap = page.vWrap = spine.Atlas.TextureWrap.repeat;
            textureLoader.load(page, line, this);
            this.pages.push(page);
        } else {
            var region = new spine.AtlasRegion();
            region.name = line;
            region.page = page;
            region.rotate = reader.readValue() == "true";
            reader.readTuple(tuple);
            var x = parseInt(tuple[0]);
            var y = parseInt(tuple[1]);
            reader.readTuple(tuple);
            var width = parseInt(tuple[0]);
            var height = parseInt(tuple[1]);
            region.u = x / page.width;
            region.v = y / page.height;
            if (region.rotate) {
                region.u2 = (x + height) / page.width;
                region.v2 = (y + width) / page.height;
            } else {
                region.u2 = (x + width) / page.width;
                region.v2 = (y + height) / page.height;
            }
            region.x = x;
            region.y = y;
            region.width = Math.abs(width);
            region.height = Math.abs(height);
            if (reader.readTuple(tuple) == 4) {
                region.splits = [parseInt(tuple[0]), parseInt(tuple[1]), parseInt(tuple[2]), parseInt(tuple[3])];
                if (reader.readTuple(tuple) == 4) {
                    region.pads = [parseInt(tuple[0]), parseInt(tuple[1]), parseInt(tuple[2]), parseInt(tuple[3])];
                    reader.readTuple(tuple);
                }
            }
            region.originalWidth = parseInt(tuple[0]);
            region.originalHeight = parseInt(tuple[1]);
            reader.readTuple(tuple);
            region.offsetX = parseInt(tuple[0]);
            region.offsetY = parseInt(tuple[1]);
            region.index = parseInt(reader.readValue());
            this.regions.push(region);
        }
    }
};
spine.Atlas.prototype = {
    findRegion: function (name) {
        var regions = this.regions;
        for (var i = 0, n = regions.length; i < n; i++)
            if (regions[i].name == name) return regions[i];
        return null;
    },
    dispose: function () {
        var pages = this.pages;
        for (var i = 0, n = pages.length; i < n; i++)
            this.textureLoader.unload(pages[i].rendererObject);
    },
    updateUVs: function (page) {
        var regions = this.regions;
        for (var i = 0, n = regions.length; i < n; i++) {
            var region = regions[i];
            if (region.page != page) continue;
            region.u = region.x / page.width;
            region.v = region.y / page.height;
            if (region.rotate) {
                region.u2 = (region.x + region.height) / page.width;
                region.v2 = (region.y + region.width) / page.height;
            } else {
                region.u2 = (region.x + region.width) / page.width;
                region.v2 = (region.y + region.height) / page.height;
            }
        }
    }
};
spine.Atlas.Format = {
    alpha: 0,
    intensity: 1,
    luminanceAlpha: 2,
    rgb565: 3,
    rgba4444: 4,
    rgb888: 5,
    rgba8888: 6
};
spine.Atlas.TextureFilter = {
    nearest: 0,
    linear: 1,
    mipMap: 2,
    mipMapNearestNearest: 3,
    mipMapLinearNearest: 4,
    mipMapNearestLinear: 5,
    mipMapLinearLinear: 6
};
spine.Atlas.TextureWrap = {
    mirroredRepeat: 0,
    clampToEdge: 1,
    repeat: 2
};
spine.AtlasPage = function () {
    this.width = this.height = 0;
};
spine.AtlasPage.prototype = {
    name: null,
    format: null,
    minFilter: null,
    magFilter: null,
    uWrap: null,
    vWrap: null,
    rendererObject: null,
    width: 0,
    height: 0
};
spine.AtlasRegion = function () {
    this.x = this.y = this.width = this.height =
        this.u = this.v = this.u2 = this.v2 =
            this.offsetX = this.offsetY =
                this.originalWidth = this.originalHeight = 0;
    this.index = 0;
};
spine.AtlasRegion.prototype = {
    page: null,
    name: null,
    x: 0, y: 0,
    width: 0, height: 0,
    u: 0, v: 0, u2: 0, v2: 0,
    offsetX: 0, offsetY: 0,
    originalWidth: 0, originalHeight: 0,
    index: 0,
    rotate: false,
    splits: null,
    pads: null
};
spine.AtlasReader = function (text) {
    this.index = 0;
    this.lines = text.split(/\r\n|\r|\n/);
};
spine.AtlasReader.prototype = {
    index: 0,
    trim: function (value) {
        return value.replace(/^\s+|\s+$/g, "");
    },
    readLine: function () {
        if (this.index >= this.lines.length) return null;
        return this.lines[this.index++];
    },
    readValue: function () {
        var line = this.readLine();
        var colon = line.indexOf(":");
        if (colon == -1) throw new Error("Invalid line: " + line);
        return this.trim(line.substring(colon + 1));
    },
    readTuple: function (tuple) {
        var line = this.readLine();
        var colon = line.indexOf(":");
        if (colon == -1) throw new Error("Invalid line: " + line);
        var i = 0, lastMatch = colon + 1;
        for (; i < 3; i++) {
            var comma = line.indexOf(",", lastMatch);
            if (comma == -1) break;
            tuple[i] = this.trim(line.substr(lastMatch, comma - lastMatch));
            lastMatch = comma + 1;
        }
        tuple[i] = this.trim(line.substring(lastMatch));
        return i + 1;
    }
};
spine.AtlasAttachmentLoader = function (atlas) {
    this.atlas = atlas;
};
spine.AtlasAttachmentLoader.prototype = {
    newRegionAttachment: function (skin, name, path) {
        var region = this.atlas.findRegion(path);
        if (!region) throw new Error("Region not found in atlas: " + path + " (region attachment: " + name + ")");
        var attachment = new spine.RegionAttachment(name);
        attachment.rendererObject = region;
        attachment.setUVs(region.u, region.v, region.u2, region.v2, region.rotate);
        attachment.regionOffsetX = region.offsetX;
        attachment.regionOffsetY = region.offsetY;
        attachment.regionWidth = region.width;
        attachment.regionHeight = region.height;
        attachment.regionOriginalWidth = region.originalWidth;
        attachment.regionOriginalHeight = region.originalHeight;
        return attachment;
    },
    newMeshAttachment: function (skin, name, path) {
        var region = this.atlas.findRegion(path);
        if (!region) throw new Error("Region not found in atlas: " + path + " (mesh attachment: " + name + ")");
        var attachment = new spine.MeshAttachment(name);
        attachment.rendererObject = region;
        attachment.regionU = region.u;
        attachment.regionV = region.v;
        attachment.regionU2 = region.u2;
        attachment.regionV2 = region.v2;
        attachment.regionRotate = region.rotate;
        attachment.regionOffsetX = region.offsetX;
        attachment.regionOffsetY = region.offsetY;
        attachment.regionWidth = region.width;
        attachment.regionHeight = region.height;
        attachment.regionOriginalWidth = region.originalWidth;
        attachment.regionOriginalHeight = region.originalHeight;
        return attachment;
    },
    newSkinnedMeshAttachment: function (skin, name, path) {
        var region = this.atlas.findRegion(path);
        if (!region) throw new Error("Region not found in atlas: " + path + " (skinned mesh attachment: " + name + ")");
        var attachment = new spine.SkinnedMeshAttachment(name);
        attachment.rendererObject = region;
        attachment.regionU = region.u;
        attachment.regionV = region.v;
        attachment.regionU2 = region.u2;
        attachment.regionV2 = region.v2;
        attachment.regionRotate = region.rotate;
        attachment.regionOffsetX = region.offsetX;
        attachment.regionOffsetY = region.offsetY;
        attachment.regionWidth = region.width;
        attachment.regionHeight = region.height;
        attachment.regionOriginalWidth = region.originalWidth;
        attachment.regionOriginalHeight = region.originalHeight;
        return attachment;
    },
    newBoundingBoxAttachment: function (skin, name) {
        return new spine.BoundingBoxAttachment(name);
    }
};
spine.SkeletonBounds = function () {
    this.minX = this.minY = this.maxX = this.maxY = 0;
    this.polygonPool = [];
    this.polygons = [];
    this.boundingBoxes = [];
};
spine.SkeletonBounds.prototype = {
    minX: 0, minY: 0, maxX: 0, maxY: 0,
    update: function (skeleton, updateAabb) {
        var slots = skeleton.slots;
        var slotCount = slots.length;
        var x = skeleton.x, y = skeleton.y;
        var boundingBoxes = this.boundingBoxes;
        var polygonPool = this.polygonPool;
        var polygons = this.polygons;
        boundingBoxes.length = 0;
        for (var i = 0, n = polygons.length; i < n; i++)
            polygonPool.push(polygons[i]);
        polygons.length = 0;
        for (var i = 0; i < slotCount; i++) {
            var slot = slots[i];
            var boundingBox = slot.attachment;
            if (boundingBox.type != spine.AttachmentType.boundingbox) continue;
            boundingBoxes.push(boundingBox);
            var poolCount = polygonPool.length, polygon;
            if (poolCount > 0) {
                polygon = polygonPool[poolCount - 1];
                polygonPool.splice(poolCount - 1, 1);
            } else
                polygon = [];
            polygons.push(polygon);
            polygon.length = boundingBox.vertices.length;
            boundingBox.computeWorldVertices(x, y, slot.bone, polygon);
        }
        if (updateAabb) this.aabbCompute();
    },
    aabbCompute: function () {
        var polygons = this.polygons;
        var minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
        for (var i = 0, n = polygons.length; i < n; i++) {
            var vertices = polygons[i];
            for (var ii = 0, nn = vertices.length; ii < nn; ii += 2) {
                var x = vertices[ii];
                var y = vertices[ii + 1];
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    },
    aabbContainsPoint: function (x, y) {
        return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
    },
    aabbIntersectsSegment: function (x1, y1, x2, y2) {
        var minX = this.minX, minY = this.minY, maxX = this.maxX, maxY = this.maxY;
        if ((x1 <= minX && x2 <= minX) || (y1 <= minY && y2 <= minY) || (x1 >= maxX && x2 >= maxX) || (y1 >= maxY && y2 >= maxY))
            return false;
        var m = (y2 - y1) / (x2 - x1);
        var y = m * (minX - x1) + y1;
        if (y > minY && y < maxY) return true;
        y = m * (maxX - x1) + y1;
        if (y > minY && y < maxY) return true;
        var x = (minY - y1) / m + x1;
        if (x > minX && x < maxX) return true;
        x = (maxY - y1) / m + x1;
        if (x > minX && x < maxX) return true;
        return false;
    },
    aabbIntersectsSkeleton: function (bounds) {
        return this.minX < bounds.maxX && this.maxX > bounds.minX && this.minY < bounds.maxY && this.maxY > bounds.minY;
    },
    containsPoint: function (x, y) {
        var polygons = this.polygons;
        for (var i = 0, n = polygons.length; i < n; i++)
            if (this.polygonContainsPoint(polygons[i], x, y)) return this.boundingBoxes[i];
        return null;
    },
    intersectsSegment: function (x1, y1, x2, y2) {
        var polygons = this.polygons;
        for (var i = 0, n = polygons.length; i < n; i++)
            if (polygons[i].intersectsSegment(x1, y1, x2, y2)) return this.boundingBoxes[i];
        return null;
    },
    polygonContainsPoint: function (polygon, x, y) {
        var nn = polygon.length;
        var prevIndex = nn - 2;
        var inside = false;
        for (var ii = 0; ii < nn; ii += 2) {
            var vertexY = polygon[ii + 1];
            var prevY = polygon[prevIndex + 1];
            if ((vertexY < y && prevY >= y) || (prevY < y && vertexY >= y)) {
                var vertexX = polygon[ii];
                if (vertexX + (y - vertexY) / (prevY - vertexY) * (polygon[prevIndex] - vertexX) < x) inside = !inside;
            }
            prevIndex = ii;
        }
        return inside;
    },
    polygonIntersectsSegment: function (polygon, x1, y1, x2, y2) {
        var nn = polygon.length;
        var width12 = x1 - x2, height12 = y1 - y2;
        var det1 = x1 * y2 - y1 * x2;
        var x3 = polygon[nn - 2], y3 = polygon[nn - 1];
        for (var ii = 0; ii < nn; ii += 2) {
            var x4 = polygon[ii], y4 = polygon[ii + 1];
            var det2 = x3 * y4 - y3 * x4;
            var width34 = x3 - x4, height34 = y3 - y4;
            var det3 = width12 * height34 - height12 * width34;
            var x = (det1 * width34 - width12 * det2) / det3;
            if (((x >= x3 && x <= x4) || (x >= x4 && x <= x3)) && ((x >= x1 && x <= x2) || (x >= x2 && x <= x1))) {
                var y = (det1 * height34 - height12 * det2) / det3;
                if (((y >= y3 && y <= y4) || (y >= y4 && y <= y3)) && ((y >= y1 && y <= y2) || (y >= y2 && y <= y1))) return true;
            }
            x3 = x4;
            y3 = y4;
        }
        return false;
    },
    getPolygon: function (attachment) {
        var index = this.boundingBoxes.indexOf(attachment);
        return index == -1 ? null : this.polygons[index];
    },
    getWidth: function () {
        return this.maxX - this.minX;
    },
    getHeight: function () {
        return this.maxY - this.minY;
    }
};
sp._atlasPage_createTexture_webGL = function (self, path) {
    var texture = cc.textureCache.addImage(path);
    self.rendererObject = new cc.TextureAtlas(texture, 128);
    self.width = texture.getPixelsWide();
    self.height = texture.getPixelsHigh();
};
sp._atlasPage_createTexture_canvas = function(self, path) {
    self._texture = cc.textureCache.addImage(path);
};
sp._atlasPage_disposeTexture = function (self) {
    self.rendererObject.release();
};
sp._atlasLoader = {
    spAtlasFile:null,
    setAtlasFile:function(spAtlasFile){
        this.spAtlasFile = spAtlasFile;
    },
    load:function(page, line, spAtlas){
        var texturePath = cc.path.join(cc.path.dirname(this.spAtlasFile), line);
        if (cc._renderType === cc.game.RENDER_TYPE_WEBGL)
            sp._atlasPage_createTexture_webGL(page,texturePath);
        else
            sp._atlasPage_createTexture_canvas(page,texturePath);
    },
    unload:function(obj){
    }
};
sp.ANIMATION_EVENT_TYPE = {
    START: 0,
    END: 1,
    COMPLETE: 2,
    EVENT: 3
};
sp.TrackEntryListeners = function(startListener, endListener, completeListener, eventListener){
    this.startListener = startListener || null;
    this.endListener = endListener || null;
    this.completeListener = completeListener || null;
    this.eventListener = eventListener || null;
};
sp.TrackEntryListeners.getListeners = function(entry){
    if(!entry.rendererObject){
        entry.rendererObject = new sp.TrackEntryListeners();
        entry.listener = sp.trackEntryCallback;
    }
    return entry.rendererObject;
};
sp.trackEntryCallback = function(state, trackIndex, type, event, loopCount) {
    state.rendererObject.onTrackEntryEvent(trackIndex, type, event, loopCount);
};
sp.SkeletonAnimation = sp.Skeleton.extend({
    _state: null,
    _target: null,
    _callback: null,
    _ownsAnimationStateData: false,
    _startListener: null,
    _endListener: null,
    _completeListener: null,
    _eventListener: null,
    init: function () {
        sp.Skeleton.prototype.init.call(this);
        this._ownsAnimationStateData = true;
        this.setAnimationStateData(new spine.AnimationStateData(this._skeleton.data));
    },
    setAnimationStateData: function (stateData) {
        var state = new spine.AnimationState(stateData);
        state.rendererObject = this;
        state.onStart = this._onAnimationStateStart.bind(this);
        state.onComplete = this._onAnimationStateComplete.bind(this);
        state.onEnd = this._onAnimationStateEnd.bind(this);
        state.onEvent = this._onAnimationStateEvent.bind(this);
        this._state = state;
    },
    setMix: function (fromAnimation, toAnimation, duration) {
        this._state.data.setMixByName(fromAnimation, toAnimation, duration);
    },
    setAnimationListener: function (target, callback) {
        this._target = target;
        this._callback = callback;
    },
    setAnimation: function (trackIndex, name, loop) {
        var animation = this._skeleton.data.findAnimation(name);
        if (!animation) {
            cc.log("Spine: Animation not found: " + name);
            return null;
        }
        return this._state.setAnimation(trackIndex, animation, loop);
    },
    addAnimation: function (trackIndex, name, loop, delay) {
        delay = delay == null ? 0 : delay;
        var animation = this._skeleton.data.findAnimation(name);
        if (!animation) {
            cc.log("Spine: Animation not found:" + name);
            return null;
        }
        return this._state.addAnimation(trackIndex, animation, loop, delay);
    },
    getCurrent: function (trackIndex) {
        return this._state.getCurrent(trackIndex);
    },
    clearTracks: function () {
        this._state.clearTracks();
    },
    clearTrack: function (trackIndex) {
        this._state.clearTrack(trackIndex);
    },
    update: function (dt) {
        this._super(dt);
        dt *= this._timeScale;
        this._state.update(dt);
        this._state.apply(this._skeleton);
        this._skeleton.updateWorldTransform();
        this._renderCmd._updateChild();
    },
    setStartListener: function(listener){
        this._startListener = listener;
    },
    setEndListener: function(listener) {
        this._endListener = listener;
    },
    setCompleteListener: function(listener) {
        this._completeListener = listener;
    },
    setEventListener: function(listener){
        this._eventListener = listener;
    },
    setTrackStartListener: function(entry, listener){
        sp.TrackEntryListeners.getListeners(entry).startListener = listener;
    },
    setTrackEndListener: function(entry, listener){
        sp.TrackEntryListeners.getListeners(entry).endListener = listener;
    },
    setTrackCompleteListener: function(entry, listener){
        sp.TrackEntryListeners.getListeners(entry).completeListener = listener;
    },
    setTrackEventListener: function(entry, listener){
        sp.TrackEntryListeners.getListeners(entry).eventListener = listener;
    },
    onTrackEntryEvent: function(traceIndex, type, event, loopCount){
        var entry = this._state.getCurrent(traceIndex);
        if(!entry.rendererObject)
            return;
        var listeners = entry.rendererObject;
        switch (type){
            case sp.ANIMATION_EVENT_TYPE.START:
                if(listeners.startListener)
                    listeners.startListener(traceIndex);
                break;
            case sp.ANIMATION_EVENT_TYPE.END:
                if(listeners.endListener)
                    listeners.endListener(traceIndex);
                break;
            case sp.ANIMATION_EVENT_TYPE.COMPLETE:
                if(listeners.completeListener)
                    listeners.completeListener(traceIndex, loopCount);
                break;
            case sp.ANIMATION_EVENT_TYPE.EVENT:
                if(listeners.eventListener)
                    listeners.eventListener(traceIndex, event);
                break;
        }
    },
    onAnimationStateEvent: function(trackIndex, type, event, loopCount) {
        switch(type){
            case sp.ANIMATION_EVENT_TYPE.START:
                if(this._startListener)
                    this._startListener(trackIndex);
                break;
            case sp.ANIMATION_EVENT_TYPE.END:
                if(this._endListener)
                    this._endListener(trackIndex);
                break;
            case sp.ANIMATION_EVENT_TYPE.COMPLETE:
                if(this._completeListener)
                    this._completeListener(trackIndex, loopCount);
                break;
            case sp.ANIMATION_EVENT_TYPE.EVENT:
                if(this._eventListener)
                    this._eventListener(trackIndex, event);
                break;
        }
    },
    getState: function(){
        return this._state;
    },
    _onAnimationStateStart: function (trackIndex) {
        this._animationStateCallback(trackIndex, sp.ANIMATION_EVENT_TYPE.START, null, 0);
    },
    _onAnimationStateEnd: function (trackIndex) {
        this._animationStateCallback(trackIndex, sp.ANIMATION_EVENT_TYPE.END, null, 0);
    },
    _onAnimationStateComplete: function (trackIndex, count) {
        this._animationStateCallback(trackIndex, sp.ANIMATION_EVENT_TYPE.COMPLETE, null, count);
    },
    _onAnimationStateEvent: function (trackIndex, event) {
        this._animationStateCallback(trackIndex, sp.ANIMATION_EVENT_TYPE.EVENT, event, 0);
    },
    _animationStateCallback: function (trackIndex, type, event, loopCount) {
        this.onAnimationStateEvent(trackIndex, type, event, loopCount);
        if (this._target && this._callback) {
            this._callback.call(this._target, this, trackIndex, type, event, loopCount)
        }
    }
});
sp.SkeletonAnimation.create = function (skeletonDataFile, atlasFile, scale) {
    return new sp.SkeletonAnimation(skeletonDataFile, atlasFile, scale);
};
(function(){
    sp.Skeleton.CanvasRenderCmd = function(renderableObject){
        cc.Node.CanvasRenderCmd.call(this, renderableObject);
        this._needDraw = true;
    };
    var proto = sp.Skeleton.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    proto.constructor = sp.Skeleton.CanvasRenderCmd;
    proto.rendering = function (wrapper, scaleX, scaleY) {
        var node = this._node, i, n, slot, slotNode;
        wrapper = wrapper || cc._renderContext;
        var locSkeleton = node._skeleton, drawOrder = locSkeleton.drawOrder;
        for(i = 0, n = drawOrder.length; i < n; i++){
            slot = drawOrder[i];
            slotNode = slot._slotNode;
            if(slotNode._visible && slotNode._renderCmd && slot.currentSprite){
                slotNode._renderCmd.transform(this, true);
                slot.currentSprite._renderCmd.rendering(wrapper, scaleX, scaleY);
                slotNode._renderCmd._dirtyFlag = slot.currentSprite._renderCmd._dirtyFlag = 0;
            }
        }
        if (!node._debugSlots && !node._debugBones)
            return;
        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        wrapper.setGlobalAlpha(1);
        var attachment, drawingUtil = cc._drawingUtil;
        if (node._debugSlots) {
            drawingUtil.setDrawColor(0, 0, 255, 255);
            drawingUtil.setLineWidth(1);
            var points = [];
            for (i = 0, n = locSkeleton.slots.length; i < n; i++) {
                slot = locSkeleton.drawOrder[i];
                if (!slot.attachment || slot.attachment.type != sp.ATTACHMENT_TYPE.REGION)
                    continue;
                attachment = slot.attachment;
                this._updateRegionAttachmentSlot(attachment, slot, points);
                drawingUtil.drawPoly(points, 4, true);
            }
        }
        if (node._debugBones) {
            var bone;
            drawingUtil.setLineWidth(2);
            drawingUtil.setDrawColor(255, 0, 0, 255);
            for (i = 0, n = locSkeleton.bones.length; i < n; i++) {
                bone = locSkeleton.bones[i];
                var x = bone.data.length * bone.m00 + bone.worldX;
                var y = bone.data.length * bone.m10 + bone.worldY;
                drawingUtil.drawLine(
                    {x: bone.worldX, y: bone.worldY},
                    {x: x, y: y});
            }
            drawingUtil.setPointSize(4);
            drawingUtil.setDrawColor(0, 0, 255, 255);
            for (i = 0, n = locSkeleton.bones.length; i < n; i++) {
                bone = locSkeleton.bones[i];
                drawingUtil.drawPoint({x: bone.worldX, y: bone.worldY});
                if (i === 0)
                    drawingUtil.setDrawColor(0, 255, 0, 255);
            }
        }
    };
    proto._updateRegionAttachmentSlot = function(attachment, slot, points) {
        if(!points)
            return;
        var vertices = {}, VERTEX = sp.VERTEX_INDEX, bone = slot.bone;
        attachment.computeVertices(bone.skeleton.x, bone.skeleton.y, bone, vertices);
        points.length = 0;
        points.push(cc.p(vertices[VERTEX.X1], vertices[VERTEX.Y1]));
        points.push(cc.p(vertices[VERTEX.X4], vertices[VERTEX.Y4]));
        points.push(cc.p(vertices[VERTEX.X3], vertices[VERTEX.Y3]));
        points.push(cc.p(vertices[VERTEX.X2], vertices[VERTEX.Y2]));
    };
    proto._createChildFormSkeletonData = function(){
        var node = this._node;
        var locSkeleton = node._skeleton, spriteName, sprite;
        for (var i = 0, n = locSkeleton.slots.length; i < n; i++) {
            var slot = locSkeleton.slots[i], attachment = slot.attachment;
            var slotNode = new cc.Node();
            slot._slotNode = slotNode;
            if(attachment instanceof spine.RegionAttachment){
                spriteName = attachment.rendererObject.name;
                sprite = this._createSprite(slot, attachment);
                slot.currentSprite = sprite;
                slot.currentSpriteName = spriteName;
                slotNode.addChild(sprite);
            } else if(attachment instanceof spine.MeshAttachment){
            }
        }
    };
    proto._createSprite = function(slot, attachment){
        var rendererObject = attachment.rendererObject;
        var texture = rendererObject.page._texture;
        var rect = new cc.Rect(rendererObject.x, rendererObject.y, rendererObject.width, rendererObject.height);
        var sprite = new cc.Sprite();
        sprite.initWithTexture(rendererObject.page._texture, rect, rendererObject.rotate, false);
        sprite._rect.width = attachment.width;
        sprite._rect.height = attachment.height;
        sprite.setContentSize(attachment.width, attachment.height);
        sprite.setRotation(-attachment.rotation);
        sprite.setScale(rendererObject.width / rendererObject.originalWidth * attachment.scaleX,
            rendererObject.height / rendererObject.originalHeight * attachment.scaleY);
        slot.sprites = slot.sprites || {};
        slot.sprites[rendererObject.name] = sprite;
        return sprite;
    };
    proto._updateChild = function(){
        var locSkeleton = this._node._skeleton, slots = locSkeleton.slots;
        var i, n, selSprite;
        var slot, attachment, slotNode;
        for(i = 0, n = slots.length; i < n; i++){
            slot = slots[i];
            attachment = slot.attachment;
            slotNode = slot._slotNode;
            if(!attachment){
                slotNode.setVisible(false);
                continue;
            }
            var type = attachment.type;
            if (type === spine.AttachmentType.region){
                if(attachment.rendererObject){
                    if(!slot.currentSpriteName || slot.currentSpriteName !== attachment.name){
                         var spriteName = attachment.rendererObject.name;
                        if(slot.currentSprite !== undefined)
                            slot.currentSprite.setVisible(false);
                        slot.sprites = slot.sprites ||{};
                        if(slot.sprites[spriteName] !== undefined)
                            slot.sprites[spriteName].setVisible(true);
                        else{
                            var sprite = this._createSprite(slot, attachment);
                            slotNode.addChild(sprite);
                        }
                        slot.currentSprite = slot.sprites[spriteName];
                        slot.currentSpriteName = spriteName;
                    }
                }
                var bone = slot.bone;
                slotNode.setPosition(bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01,
                    bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11);
                slotNode.setScale(bone.worldScaleX, bone.worldScaleY);
                selSprite = slot.currentSprite;
                selSprite._flippedX = bone.worldFlipX;
                selSprite._flippedY = bone.worldFlipY;
                if(selSprite._flippedY || selSprite._flippedX){
                    slotNode.setRotation(bone.worldRotation);
                    selSprite.setRotation(attachment.rotation);
                }else{
                    slotNode.setRotation(-bone.worldRotation);
                    selSprite.setRotation(-attachment.rotation);
                }
                selSprite._renderCmd._displayedOpacity = 0 | (locSkeleton.a * slot.a * 255);
                var r = 0 | (locSkeleton.r * slot.r * 255), g = 0 | (locSkeleton.g * slot.g * 255), b = 0 | (locSkeleton.b * slot.b * 255);
                selSprite.setColor(cc.color(r,g,b));
                selSprite._renderCmd._updateColor();
            } else if (type === spine.AttachmentType.skinnedmesh) {
            } else {
                slotNode.setVisible(false);
                continue;
            }
            slotNode.setVisible(true);
        }
    };
})();

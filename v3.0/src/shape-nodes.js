cc.v2fzero = function () {
    return {x: 0, y: 0};
};
cc.v2f = function (x, y) {
    return {x: x, y: y};
};
cc.v2fadd = function (v0, v1) {
    return cc.v2f(v0.x + v1.x, v0.y + v1.y);
};
cc.v2fsub = function (v0, v1) {
    return cc.v2f(v0.x - v1.x, v0.y - v1.y);
};
cc.v2fmult = function (v, s) {
    return cc.v2f(v.x * s, v.y * s);
};
cc.v2fperp = function (p0) {
    return cc.v2f(-p0.y, p0.x);
};
cc.v2fneg = function (p0) {
    return cc.v2f(-p0.x, -p0.y);
};
cc.v2fdot = function (p0, p1) {
    return  p0.x * p1.x + p0.y * p1.y;
};
cc.v2fforangle = function (_a_) {
    return cc.v2f(Math.cos(_a_), Math.sin(_a_));
};
cc.v2fnormalize = function (p) {
    var r = cc.pNormalize(cc.p(p.x, p.y));
    return cc.v2f(r.x, r.y);
};
cc.__v2f = function (v) {
    return cc.v2f(v.x, v.y);
};
cc.__t = function (v) {
    return {u: v.x, v: v.y};
};
cc.DrawNodeCanvas = cc.Node.extend({
    _buffer: null,
    _blendFunc: null,
    _lineWidth: 1,
    _drawColor: null,
    _className:"DrawNodeCanvas",
    ctor: function () {
        cc.Node.prototype.ctor.call(this);
        this._buffer = [];
        this._drawColor = cc.color(255, 255, 255, 255);
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
		this.init();
    },
    getBlendFunc: function () {
        return this._blendFunc;
    },
    setBlendFunc: function (blendFunc, dst) {
        if (dst === undefined) {
            this._blendFunc.src = blendFunc.src;
            this._blendFunc.dst = blendFunc.dst;
        } else {
            this._blendFunc.src = blendFunc;
            this._blendFunc.dst = dst;
        }
    },
    setLineWidth: function (width) {
        this._lineWidth = width;
    },
    getLineWidth: function () {
        return this._lineWidth;
    },
    setDrawColor: function (color) {
        var locDrawColor = this._drawColor;
        locDrawColor.r = color.r;
        locDrawColor.g = color.g;
        locDrawColor.b = color.b;
        locDrawColor.a = (color.a == null) ? 255 : color.a;
    },
    getDrawColor: function () {
        return  cc.color(this._drawColor.r, this._drawColor.g, this._drawColor.b, this._drawColor.a);
    },
    drawRect: function (origin, destination, fillColor, lineWidth, lineColor) {
        lineWidth = lineWidth || this._lineWidth;
        lineColor = lineColor || this.getDrawColor();
        if(lineColor.a == null)
            lineColor.a = 255;
        var vertices = [
            origin,
            cc.p(destination.x, origin.y),
            destination,
            cc.p(origin.x, destination.y)
        ];
        var element = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        element.verts = vertices;
        element.lineWidth = lineWidth;
        element.lineColor = lineColor;
        element.isClosePolygon = true;
        element.isStroke = true;
        element.lineCap = "butt";
        element.fillColor = fillColor;
        if (fillColor) {
            if(fillColor.a == null)
                fillColor.a = 255;
            element.isFill = true;
        }
        this._buffer.push(element);
    },
    drawCircle: function (center, radius, angle, segments, drawLineToCenter, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        var coef = 2.0 * Math.PI / segments;
        var vertices = [];
        for (var i = 0; i <= segments; i++) {
            var rads = i * coef;
            var j = radius * Math.cos(rads + angle) + center.x;
            var k = radius * Math.sin(rads + angle) + center.y;
            vertices.push(cc.p(j, k));
        }
        if (drawLineToCenter) {
            vertices.push(cc.p(center.x, center.y));
        }
        var element = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        element.verts = vertices;
        element.lineWidth = lineWidth;
        element.lineColor = color;
        element.isClosePolygon = true;
        element.isStroke = true;
        this._buffer.push(element);
    },
    drawQuadBezier: function (origin, control, destination, segments, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        var vertices = [], t = 0.0;
        for (var i = 0; i < segments; i++) {
            var x = Math.pow(1 - t, 2) * origin.x + 2.0 * (1 - t) * t * control.x + t * t * destination.x;
            var y = Math.pow(1 - t, 2) * origin.y + 2.0 * (1 - t) * t * control.y + t * t * destination.y;
            vertices.push(cc.p(x, y));
            t += 1.0 / segments;
        }
        vertices.push(cc.p(destination.x, destination.y));
        var element = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        element.verts = vertices;
        element.lineWidth = lineWidth;
        element.lineColor = color;
        element.isStroke = true;
        element.lineCap = "round";
        this._buffer.push(element);
    },
    drawCubicBezier: function (origin, control1, control2, destination, segments, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        var vertices = [], t = 0;
        for (var i = 0; i < segments; i++) {
            var x = Math.pow(1 - t, 3) * origin.x + 3.0 * Math.pow(1 - t, 2) * t * control1.x + 3.0 * (1 - t) * t * t * control2.x + t * t * t * destination.x;
            var y = Math.pow(1 - t, 3) * origin.y + 3.0 * Math.pow(1 - t, 2) * t * control1.y + 3.0 * (1 - t) * t * t * control2.y + t * t * t * destination.y;
            vertices.push(cc.p(x, y));
            t += 1.0 / segments;
        }
        vertices.push(cc.p(destination.x, destination.y));
        var element = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        element.verts = vertices;
        element.lineWidth = lineWidth;
        element.lineColor = color;
        element.isStroke = true;
        element.lineCap = "round";
        this._buffer.push(element);
    },
    drawCatmullRom: function (points, segments, lineWidth, color) {
        this.drawCardinalSpline(points, 0.5, segments, lineWidth, color);
    },
    drawCardinalSpline: function (config, tension, segments, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this.getDrawColor();
        if(color.a == null)
            color.a = 255;
        var vertices = [], p, lt, deltaT = 1.0 / config.length;
        for (var i = 0; i < segments + 1; i++) {
            var dt = i / segments;
            if (dt == 1) {
                p = config.length - 1;
                lt = 1;
            } else {
                p = 0 | (dt / deltaT);
                lt = (dt - deltaT * p) / deltaT;
            }
            var newPos = cc.cardinalSplineAt(
                cc.getControlPointAt(config, p - 1),
                cc.getControlPointAt(config, p - 0),
                cc.getControlPointAt(config, p + 1),
                cc.getControlPointAt(config, p + 2),
                tension, lt);
            vertices.push(newPos);
        }
        var element = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        element.verts = vertices;
        element.lineWidth = lineWidth;
        element.lineColor = color;
        element.isStroke = true;
        element.lineCap = "round";
        this._buffer.push(element);
    },
    drawDot: function (pos, radius, color) {
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        var element = new cc._DrawNodeElement(cc.DrawNode.TYPE_DOT);
        element.verts = [pos];
        element.lineWidth = radius;
        element.fillColor = color;
        this._buffer.push(element);
    },
    drawDots: function(points, radius, color){
        if(!points || points.length == 0)
            return;
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        for(var i = 0, len = points.length; i < len; i++)
           this.drawDot(points[i], radius, color);
    },
    drawSegment: function (from, to, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        var element = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        element.verts = [from, to];
        element.lineWidth = lineWidth * 2;
        element.lineColor = color;
        element.isStroke = true;
        element.lineCap = "round";
        this._buffer.push(element);
    },
    drawPoly_: function (verts, fillColor, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        var element = new cc._DrawNodeElement(cc.DrawNode.TYPE_POLY);
        element.verts = verts;
        element.fillColor = fillColor;
        element.lineWidth = lineWidth;
        element.lineColor = color;
        element.isClosePolygon = true;
        element.isStroke = true;
        element.lineCap = "round";
        if (fillColor)
            element.isFill = true;
        this._buffer.push(element);
    },
    drawPoly: function (verts, fillColor, lineWidth, color) {
        var vertsCopy = [];
        for (var i=0; i < verts.length; i++) {
            vertsCopy.push(cc.p(verts[i].x, verts[i].y));
        }
        return this.drawPoly_(vertsCopy, fillColor, lineWidth, color);     
    },
    draw: function (ctx) {
        var context = ctx || cc._renderContext, _t = this;
        if ((_t._blendFunc && (_t._blendFunc.src == cc.SRC_ALPHA) && (_t._blendFunc.dst == cc.ONE)))
            context.globalCompositeOperation = 'lighter';
        for (var i = 0; i < _t._buffer.length; i++) {
            var element = _t._buffer[i];
            switch (element.type) {
                case cc.DrawNode.TYPE_DOT:
                    _t._drawDot(context, element);
                    break;
                case cc.DrawNode.TYPE_SEGMENT:
                    _t._drawSegment(context, element);
                    break;
                case cc.DrawNode.TYPE_POLY:
                    _t._drawPoly(context, element);
                    break;
            }
        }
    },
    _drawDot: function (ctx, element) {
        var locColor = element.fillColor, locPos = element.verts[0], locRadius = element.lineWidth;
        var locScaleX = cc.view.getScaleX(), locScaleY = cc.view.getScaleY();
        ctx.fillStyle = "rgba(" + (0 | locColor.r) + "," + (0 | locColor.g) + "," + (0 | locColor.b) + "," + locColor.a / 255 + ")";
        ctx.beginPath();
        ctx.arc(locPos.x * locScaleX, -locPos.y * locScaleY, locRadius * locScaleX, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    },
    _drawSegment: function (ctx, element) {
        var locColor = element.lineColor;
        var locFrom = element.verts[0];
        var locTo = element.verts[1];
        var locLineWidth = element.lineWidth;
        var locLineCap = element.lineCap;
        var locScaleX = cc.view.getScaleX(), locScaleY = cc.view.getScaleY();
        ctx.strokeStyle = "rgba(" + (0 | locColor.r) + "," + (0 | locColor.g) + "," + (0 | locColor.b) + "," + locColor.a / 255 + ")";
        ctx.lineWidth = locLineWidth * locScaleX;
        ctx.beginPath();
        ctx.lineCap = locLineCap;
        ctx.moveTo(locFrom.x * locScaleX, -locFrom.y * locScaleY);
        ctx.lineTo(locTo.x * locScaleX, -locTo.y * locScaleY);
        ctx.stroke();
    },
    _drawPoly: function (ctx, element) {
        var locVertices = element.verts;
        var locLineCap = element.lineCap;
        var locFillColor = element.fillColor;
        var locLineWidth = element.lineWidth;
        var locLineColor = element.lineColor;
        var locIsClosePolygon = element.isClosePolygon;
        var locIsFill = element.isFill;
        var locIsStroke = element.isStroke;
        if (locVertices == null)
            return;
        var firstPoint = locVertices[0];
        var locScaleX = cc.view.getScaleX(), locScaleY = cc.view.getScaleY();
        ctx.lineCap = locLineCap;
        if (locFillColor) {
            ctx.fillStyle = "rgba(" + (0 | locFillColor.r) + "," + (0 | locFillColor.g) + ","
                + (0 | locFillColor.b) + "," + locFillColor.a / 255 + ")";
        }
        if (locLineWidth) {
            ctx.lineWidth = locLineWidth * locScaleX;
        }
        if (locLineColor) {
            ctx.strokeStyle = "rgba(" + (0 | locLineColor.r) + "," + (0 | locLineColor.g) + ","
                + (0 | locLineColor.b) + "," + locLineColor.a / 255 + ")";
        }
        ctx.beginPath();
        ctx.moveTo(firstPoint.x * locScaleX, -firstPoint.y * locScaleY);
        for (var i = 1, len = locVertices.length; i < len; i++)
            ctx.lineTo(locVertices[i].x * locScaleX, -locVertices[i].y * locScaleY);
        if (locIsClosePolygon)
            ctx.closePath();
        if (locIsFill)
            ctx.fill();
        if (locIsStroke)
            ctx.stroke();
    },
    clear: function () {
        this._buffer.length = 0;
    }
});
cc.DrawNodeWebGL = cc.Node.extend({
    _bufferCapacity:0,
    _buffer:null,
    _trianglesArrayBuffer:null,
    _trianglesWebBuffer:null,
    _trianglesReader:null,
    _lineWidth: 1,
    _drawColor: null,
    _blendFunc:null,
    _dirty:false,
    _className:"DrawNodeWebGL",
    getBlendFunc:function () {
        return this._blendFunc;
    },
    setBlendFunc:function (blendFunc, dst) {
        if (dst === undefined) {
            this._blendFunc.src = blendFunc.src;
            this._blendFunc.dst = blendFunc.dst;
        } else {
            this._blendFunc.src = blendFunc;
            this._blendFunc.dst = dst;
        }
    },
    ctor:function () {
        cc.Node.prototype.ctor.call(this);
        this._buffer = [];
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        this._drawColor = cc.color(255,255,255,255);
	    this.init();
    },
    init:function () {
        if (cc.Node.prototype.init.call(this)) {
            this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_LENGTHTEXTURECOLOR);
            this._ensureCapacity(64);
            this._trianglesWebBuffer = cc._renderContext.createBuffer();
            this._dirty = true;
            return true;
        }
        return false;
    },
    setLineWidth: function (width) {
        this._lineWidth = width;
    },
    getLineWidth: function () {
        return this._lineWidth;
    },
    setDrawColor: function (color) {
        var locDrawColor = this._drawColor;
        locDrawColor.r = color.r;
        locDrawColor.g = color.g;
        locDrawColor.b = color.b;
        locDrawColor.a = color.a;
    },
    getDrawColor: function () {
        return  cc.color(this._drawColor.r, this._drawColor.g, this._drawColor.b, this._drawColor.a);
    },
    drawRect: function (origin, destination, fillColor, lineWidth, lineColor) {
        lineWidth = lineWidth || this._lineWidth;
        lineColor = lineColor || this.getDrawColor();
        if (lineColor.a == null)
            lineColor.a = 255;
        var vertices = [origin, cc.p(destination.x, origin.y), destination, cc.p(origin.x, destination.y)];
        if(fillColor == null)
            this._drawSegments(vertices, lineWidth, lineColor, true);
        else
            this.drawPoly(vertices, fillColor, lineWidth, lineColor);
    },
    drawCircle: function (center, radius, angle, segments, drawLineToCenter, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        var coef = 2.0 * Math.PI / segments, vertices = [], i, len;
        for (i = 0; i <= segments; i++) {
            var rads = i * coef;
            var j = radius * Math.cos(rads + angle) + center.x;
            var k = radius * Math.sin(rads + angle) + center.y;
            vertices.push(cc.p(j, k));
        }
        if (drawLineToCenter)
            vertices.push(cc.p(center.x, center.y));
        lineWidth *= 0.5;
        for (i = 0, len = vertices.length; i < len - 1; i++)
            this.drawSegment(vertices[i], vertices[i + 1], lineWidth, color);
    },
    drawQuadBezier: function (origin, control, destination, segments, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        var vertices = [], t = 0.0;
        for (var i = 0; i < segments; i++) {
            var x = Math.pow(1 - t, 2) * origin.x + 2.0 * (1 - t) * t * control.x + t * t * destination.x;
            var y = Math.pow(1 - t, 2) * origin.y + 2.0 * (1 - t) * t * control.y + t * t * destination.y;
            vertices.push(cc.p(x, y));
            t += 1.0 / segments;
        }
        vertices.push(cc.p(destination.x, destination.y));
        this._drawSegments(vertices, lineWidth, color, false);
    },
    drawCubicBezier: function (origin, control1, control2, destination, segments, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        var vertices = [], t = 0;
        for (var i = 0; i < segments; i++) {
            var x = Math.pow(1 - t, 3) * origin.x + 3.0 * Math.pow(1 - t, 2) * t * control1.x + 3.0 * (1 - t) * t * t * control2.x + t * t * t * destination.x;
            var y = Math.pow(1 - t, 3) * origin.y + 3.0 * Math.pow(1 - t, 2) * t * control1.y + 3.0 * (1 - t) * t * t * control2.y + t * t * t * destination.y;
            vertices.push(cc.p(x, y));
            t += 1.0 / segments;
        }
        vertices.push(cc.p(destination.x, destination.y));
        this._drawSegments(vertices, lineWidth, color, false);
    },
    drawCatmullRom: function (points, segments, lineWidth, color) {
        this.drawCardinalSpline(points, 0.5, segments, lineWidth, color);
    },
    drawCardinalSpline: function (config, tension, segments, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        var vertices = [], p, lt, deltaT = 1.0 / config.length;
        for (var i = 0; i < segments + 1; i++) {
            var dt = i / segments;
            if (dt == 1) {
                p = config.length - 1;
                lt = 1;
            } else {
                p = 0 | (dt / deltaT);
                lt = (dt - deltaT * p) / deltaT;
            }
            var newPos = cc.cardinalSplineAt(
                cc.getControlPointAt(config, p - 1),
                cc.getControlPointAt(config, p - 0),
                cc.getControlPointAt(config, p + 1),
                cc.getControlPointAt(config, p + 2),
                tension, lt);
            vertices.push(newPos);
        }
        lineWidth *= 0.5;
        for (var j = 0, len = vertices.length; j < len - 1; j++)
            this.drawSegment(vertices[j], vertices[j + 1], lineWidth, color);
    },
    _render:function () {
        var gl = cc._renderContext;
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._trianglesWebBuffer);
        if (this._dirty) {
            gl.bufferData(gl.ARRAY_BUFFER, this._trianglesArrayBuffer, gl.STREAM_DRAW);
            this._dirty = false;
        }
        var triangleSize = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, triangleSize, 0);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, triangleSize, 8);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, triangleSize, 12);
        gl.drawArrays(gl.TRIANGLES, 0, this._buffer.length * 3);
        cc.incrementGLDraws(1);
    },
    _ensureCapacity:function(count){
        var _t = this;
        var locBuffer = _t._buffer;
        if(locBuffer.length + count > _t._bufferCapacity){
            var TriangleLength = cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT;
            _t._bufferCapacity += Math.max(_t._bufferCapacity, count);
            if((locBuffer == null) || (locBuffer.length === 0)){
                _t._buffer = [];
                _t._trianglesArrayBuffer = new ArrayBuffer(TriangleLength * _t._bufferCapacity);
                _t._trianglesReader = new Uint8Array(_t._trianglesArrayBuffer);
            } else {
                var newTriangles = [];
                var newArrayBuffer = new ArrayBuffer(TriangleLength * _t._bufferCapacity);
                for(var i = 0; i < locBuffer.length;i++){
                    newTriangles[i] = new cc.V2F_C4B_T2F_Triangle(locBuffer[i].a,locBuffer[i].b,locBuffer[i].c,
                        newArrayBuffer, i * TriangleLength);
                }
                _t._trianglesReader = new Uint8Array(newArrayBuffer);
                _t._trianglesArrayBuffer = newArrayBuffer;
                _t._buffer = newTriangles;
            }
        }
    },
    draw:function () {
        cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst);
        this._shaderProgram.use();
        this._shaderProgram.setUniformsForBuiltins();
        this._render();
    },
    drawDot:function (pos, radius, color) {
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        var c4bColor = {r: 0 | color.r, g: 0 | color.g, b: 0 | color.b, a: 0 | color.a};
        var a = {vertices: {x: pos.x - radius, y: pos.y - radius}, colors: c4bColor, texCoords: {u: -1.0, v: -1.0}};
        var b = {vertices: {x: pos.x - radius, y: pos.y + radius}, colors: c4bColor, texCoords: {u: -1.0, v: 1.0}};
        var c = {vertices: {x: pos.x + radius, y: pos.y + radius}, colors: c4bColor, texCoords: {u: 1.0, v: 1.0}};
        var d = {vertices: {x: pos.x + radius, y: pos.y - radius}, colors: c4bColor, texCoords: {u: 1.0, v: -1.0}};
        this._ensureCapacity(2*3);
        this._buffer.push(new cc.V2F_C4B_T2F_Triangle(a, b, c, this._trianglesArrayBuffer, this._buffer.length * cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT));
        this._buffer.push(new cc.V2F_C4B_T2F_Triangle(a, c, d, this._trianglesArrayBuffer, this._buffer.length * cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT));
        this._dirty = true;
    },
    drawDots: function(points, radius,color) {
        if(!points || points.length == 0)
            return;
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        for(var i = 0, len = points.length; i < len; i++)
            this.drawDot(points[i], radius, color);
    },
    drawSegment:function (from, to, radius, color) {
        color = color || this.getDrawColor();
        if (color.a == null)
            color.a = 255;
        radius = radius || (this._lineWidth * 0.5);
        var vertexCount = 6*3;
        this._ensureCapacity(vertexCount);
        var c4bColor = {r: 0 | color.r, g: 0 | color.g, b: 0 | color.b, a: 0 | color.a};
        var a = cc.__v2f(from), b = cc.__v2f(to);
        var n = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(b, a))), t = cc.v2fperp(n);
        var nw = cc.v2fmult(n, radius), tw = cc.v2fmult(t, radius);
        var v0 = cc.v2fsub(b, cc.v2fadd(nw, tw));
        var v1 = cc.v2fadd(b, cc.v2fsub(nw, tw));
        var v2 = cc.v2fsub(b, nw);
        var v3 = cc.v2fadd(b, nw);
        var v4 = cc.v2fsub(a, nw);
        var v5 = cc.v2fadd(a, nw);
        var v6 = cc.v2fsub(a, cc.v2fsub(nw, tw));
        var v7 = cc.v2fadd(a, cc.v2fadd(nw, tw));
        var TriangleLength = cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT, triangleBuffer = this._trianglesArrayBuffer, locBuffer = this._buffer;
        locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v0, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(cc.v2fadd(n, t)))},
            {vertices: v1, colors: c4bColor, texCoords: cc.__t(cc.v2fsub(n, t))}, {vertices: v2, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(n))},
            triangleBuffer, locBuffer.length * TriangleLength));
        locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v3, colors: c4bColor, texCoords: cc.__t(n)},
            {vertices: v1, colors: c4bColor, texCoords: cc.__t(cc.v2fsub(n, t))}, {vertices: v2, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(n))},
            triangleBuffer, locBuffer.length * TriangleLength));
        locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v3, colors: c4bColor, texCoords: cc.__t(n)},
            {vertices: v4, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(n))}, {vertices: v2, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(n))},
            triangleBuffer, locBuffer.length * TriangleLength));
        locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v3, colors: c4bColor, texCoords: cc.__t(n)},
            {vertices: v4, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(n))}, {vertices: v5, colors: c4bColor, texCoords: cc.__t(n)},
            triangleBuffer, locBuffer.length * TriangleLength));
        locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v6, colors: c4bColor, texCoords: cc.__t(cc.v2fsub(t, n))},
            {vertices: v4, colors: c4bColor, texCoords: cc.__t(cc.v2fneg(n))}, {vertices: v5, colors: c4bColor, texCoords: cc.__t(n)},
            triangleBuffer, locBuffer.length * TriangleLength));
        locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v6, colors: c4bColor, texCoords: cc.__t(cc.v2fsub(t, n))},
            {vertices: v7, colors: c4bColor, texCoords: cc.__t(cc.v2fadd(n, t))}, {vertices: v5, colors: c4bColor, texCoords: cc.__t(n)},
            triangleBuffer, locBuffer.length * TriangleLength));
        this._dirty = true;
    },
    drawPoly:function (verts, fillColor, borderWidth, borderColor) {
        if(fillColor == null){
            this._drawSegments(verts, borderWidth, borderColor, true);
            return;
        }
        if (fillColor.a == null)
            fillColor.a = 255;
        if (borderColor.a == null)
            borderColor.a = 255;
        borderWidth = borderWidth || this._lineWidth;
        borderWidth *= 0.5;
        var c4bFillColor = {r: 0 | fillColor.r, g: 0 | fillColor.g, b: 0 | fillColor.b, a: 0 | fillColor.a};
        var c4bBorderColor = {r: 0 | borderColor.r, g: 0 | borderColor.g, b: 0 | borderColor.b, a: 0 | borderColor.a};
        var extrude = [], i, v0, v1, v2, count = verts.length;
        for (i = 0; i < count; i++) {
            v0 = cc.__v2f(verts[(i - 1 + count) % count]);
            v1 = cc.__v2f(verts[i]);
            v2 = cc.__v2f(verts[(i + 1) % count]);
            var n1 = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(v1, v0)));
            var n2 = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(v2, v1)));
            var offset = cc.v2fmult(cc.v2fadd(n1, n2), 1.0 / (cc.v2fdot(n1, n2) + 1.0));
            extrude[i] = {offset: offset, n: n2};
        }
        var outline = (borderWidth > 0.0), triangleCount = 3 * count - 2, vertexCount = 3 * triangleCount;
        this._ensureCapacity(vertexCount);
        var triangleBytesLen = cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT, trianglesBuffer = this._trianglesArrayBuffer;
        var locBuffer = this._buffer;
        var inset = (outline == false ? 0.5 : 0.0);
        for (i = 0; i < count - 2; i++) {
            v0 = cc.v2fsub(cc.__v2f(verts[0]), cc.v2fmult(extrude[0].offset, inset));
            v1 = cc.v2fsub(cc.__v2f(verts[i + 1]), cc.v2fmult(extrude[i + 1].offset, inset));
            v2 = cc.v2fsub(cc.__v2f(verts[i + 2]), cc.v2fmult(extrude[i + 2].offset, inset));
            locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: v0, colors: c4bFillColor, texCoords: cc.__t(cc.v2fzero())},
                {vertices: v1, colors: c4bFillColor, texCoords: cc.__t(cc.v2fzero())}, {vertices: v2, colors: c4bFillColor, texCoords: cc.__t(cc.v2fzero())},
                trianglesBuffer, locBuffer.length * triangleBytesLen));
        }
        for (i = 0; i < count; i++) {
            var j = (i + 1) % count;
            v0 = cc.__v2f(verts[i]);
            v1 = cc.__v2f(verts[j]);
            var n0 = extrude[i].n;
            var offset0 = extrude[i].offset;
            var offset1 = extrude[j].offset;
            var inner0 = outline ? cc.v2fsub(v0, cc.v2fmult(offset0, borderWidth)) : cc.v2fsub(v0, cc.v2fmult(offset0, 0.5));
            var inner1 = outline ? cc.v2fsub(v1, cc.v2fmult(offset1, borderWidth)) : cc.v2fsub(v1, cc.v2fmult(offset1, 0.5));
            var outer0 = outline ? cc.v2fadd(v0, cc.v2fmult(offset0, borderWidth)) : cc.v2fadd(v0, cc.v2fmult(offset0, 0.5));
            var outer1 = outline ? cc.v2fadd(v1, cc.v2fmult(offset1, borderWidth)) : cc.v2fadd(v1, cc.v2fmult(offset1, 0.5));
            if (outline) {
                locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: inner0, colors: c4bBorderColor, texCoords: cc.__t(cc.v2fneg(n0))},
                    {vertices: inner1, colors: c4bBorderColor, texCoords: cc.__t(cc.v2fneg(n0))}, {vertices: outer1, colors: c4bBorderColor, texCoords: cc.__t(n0)},
                    trianglesBuffer, locBuffer.length * triangleBytesLen));
                locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: inner0, colors: c4bBorderColor, texCoords: cc.__t(cc.v2fneg(n0))},
                    {vertices: outer0, colors: c4bBorderColor, texCoords: cc.__t(n0)}, {vertices: outer1, colors: c4bBorderColor, texCoords: cc.__t(n0)},
                    trianglesBuffer, locBuffer.length * triangleBytesLen));
            } else {
                locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: inner0, colors: c4bFillColor, texCoords: cc.__t(cc.v2fzero())},
                    {vertices: inner1, colors: c4bFillColor, texCoords: cc.__t(cc.v2fzero())}, {vertices: outer1, colors: c4bFillColor, texCoords: cc.__t(n0)},
                    trianglesBuffer, locBuffer.length * triangleBytesLen));
                locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: inner0, colors: c4bFillColor, texCoords: cc.__t(cc.v2fzero())},
                    {vertices: outer0, colors: c4bFillColor, texCoords: cc.__t(n0)}, {vertices: outer1, colors: c4bFillColor, texCoords: cc.__t(n0)},
                    trianglesBuffer, locBuffer.length * triangleBytesLen));
            }
        }
        extrude = null;
        this._dirty = true;
    },
    _drawSegments: function(verts, borderWidth, borderColor, closePoly){
        borderWidth = borderWidth || this._lineWidth;
        borderColor = borderColor || this._drawColor;
        if(borderColor.a == null)
            borderColor.a = 255;
        borderWidth *= 0.5;
        if (borderWidth <= 0)
            return;
        var c4bBorderColor = {r: 0 | borderColor.r, g: 0 | borderColor.g, b: 0 | borderColor.b, a: 0 | borderColor.a };
        var extrude = [], i, v0, v1, v2, count = verts.length;
        for (i = 0; i < count; i++) {
            v0 = cc.__v2f(verts[(i - 1 + count) % count]);
            v1 = cc.__v2f(verts[i]);
            v2 = cc.__v2f(verts[(i + 1) % count]);
            var n1 = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(v1, v0)));
            var n2 = cc.v2fnormalize(cc.v2fperp(cc.v2fsub(v2, v1)));
            var offset = cc.v2fmult(cc.v2fadd(n1, n2), 1.0 / (cc.v2fdot(n1, n2) + 1.0));
            extrude[i] = {offset: offset, n: n2};
        }
        var triangleCount = 3 * count - 2, vertexCount = 3 * triangleCount;
        this._ensureCapacity(vertexCount);
        var triangleBytesLen = cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT, trianglesBuffer = this._trianglesArrayBuffer;
        var locBuffer = this._buffer;
        var len = closePoly ? count : count - 1;
        for (i = 0; i < len; i++) {
            var j = (i + 1) % count;
            v0 = cc.__v2f(verts[i]);
            v1 = cc.__v2f(verts[j]);
            var n0 = extrude[i].n;
            var offset0 = extrude[i].offset;
            var offset1 = extrude[j].offset;
            var inner0 = cc.v2fsub(v0, cc.v2fmult(offset0, borderWidth));
            var inner1 = cc.v2fsub(v1, cc.v2fmult(offset1, borderWidth));
            var outer0 = cc.v2fadd(v0, cc.v2fmult(offset0, borderWidth));
            var outer1 = cc.v2fadd(v1, cc.v2fmult(offset1, borderWidth));
            locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: inner0, colors: c4bBorderColor, texCoords: cc.__t(cc.v2fneg(n0))},
                {vertices: inner1, colors: c4bBorderColor, texCoords: cc.__t(cc.v2fneg(n0))}, {vertices: outer1, colors: c4bBorderColor, texCoords: cc.__t(n0)},
                trianglesBuffer, locBuffer.length * triangleBytesLen));
            locBuffer.push(new cc.V2F_C4B_T2F_Triangle({vertices: inner0, colors: c4bBorderColor, texCoords: cc.__t(cc.v2fneg(n0))},
                {vertices: outer0, colors: c4bBorderColor, texCoords: cc.__t(n0)}, {vertices: outer1, colors: c4bBorderColor, texCoords: cc.__t(n0)},
                trianglesBuffer, locBuffer.length * triangleBytesLen));
        }
        extrude = null;
        this._dirty = true;
    },
    clear:function () {
        this._buffer.length = 0;
        this._dirty = true;
    }
});
cc.DrawNode = cc._renderType == cc._RENDER_TYPE_WEBGL ? cc.DrawNodeWebGL : cc.DrawNodeCanvas;
cc.DrawNode.create = function () {
    return new cc.DrawNode();
};
cc._DrawNodeElement = function (type, verts, fillColor, lineWidth, lineColor, lineCap, isClosePolygon, isFill, isStroke) {
    var _t = this;
    _t.type = type;
    _t.verts = verts || null;
    _t.fillColor = fillColor || null;
    _t.lineWidth = lineWidth || 0;
    _t.lineColor = lineColor || null;
    _t.lineCap = lineCap || "butt";
    _t.isClosePolygon = isClosePolygon || false;
    _t.isFill = isFill || false;
    _t.isStroke = isStroke || false;
};
cc.DrawNode.TYPE_DOT = 0;
cc.DrawNode.TYPE_SEGMENT = 1;
cc.DrawNode.TYPE_POLY = 2;

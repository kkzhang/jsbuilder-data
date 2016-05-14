var cc = cc || {};
cc._tmp = cc._tmp || {};
cc._tmp.WebGLColor = function () {
    cc.color = function (r, g, b, a, arrayBuffer, offset) {
        if (r === undefined)
            return new cc.Color(0, 0, 0, 255, arrayBuffer, offset);
        if (cc.isString(r)) {
            var color = cc.hexToColor(r);
            return new cc.Color(color.r, color.g, color.b, color.a);
        }
        if (cc.isObject(r))
            return new cc.Color(r.r, r.g, r.b, r.a, r.arrayBuffer, r.offset);
        return new cc.Color(r, g, b, a, arrayBuffer, offset);
    };
    cc.Color = function (r, g, b, a, arrayBuffer, offset) {
        this._arrayBuffer = arrayBuffer || new ArrayBuffer(cc.Color.BYTES_PER_ELEMENT);
        this._offset = offset || 0;
        var locArrayBuffer = this._arrayBuffer, locOffset = this._offset, locElementLen = Uint8Array.BYTES_PER_ELEMENT;
        this._rU8 = new Uint8Array(locArrayBuffer, locOffset, 1);
        this._gU8 = new Uint8Array(locArrayBuffer, locOffset + locElementLen, 1);
        this._bU8 = new Uint8Array(locArrayBuffer, locOffset + locElementLen * 2, 1);
        this._aU8 = new Uint8Array(locArrayBuffer, locOffset + locElementLen * 3, 1);
        this._rU8[0] = r || 0;
        this._gU8[0] = g || 0;
        this._bU8[0] = b || 0;
        this._aU8[0] = (a == null) ? 255 : a;
        if (a === undefined)
            this.a_undefined = true;
    };
    cc.Color.BYTES_PER_ELEMENT = 4;
    var _p = cc.Color.prototype;
    _p._getR = function () {
        return this._rU8[0];
    };
    _p._setR = function (value) {
        this._rU8[0] = value < 0 ? 0 : value;
    };
    _p._getG = function () {
        return this._gU8[0];
    };
    _p._setG = function (value) {
        this._gU8[0] = value < 0 ? 0 : value;
    };
    _p._getB = function () {
        return this._bU8[0];
    };
    _p._setB = function (value) {
        this._bU8[0] = value < 0 ? 0 : value;
    };
    _p._getA = function () {
        return this._aU8[0];
    };
    _p._setA = function (value) {
        this._aU8[0] = value < 0 ? 0 : value;
    };
    _p.r;
    cc.defineGetterSetter(_p, "r", _p._getR, _p._setR);
    _p.g;
    cc.defineGetterSetter(_p, "g", _p._getG, _p._setG);
    _p.b;
    cc.defineGetterSetter(_p, "b", _p._getB, _p._setB);
    _p.a;
    cc.defineGetterSetter(_p, "a", _p._getA, _p._setA);
    cc.Vertex2F = function (x, y, arrayBuffer, offset) {
        this._arrayBuffer = arrayBuffer || new ArrayBuffer(cc.Vertex2F.BYTES_PER_ELEMENT);
        this._offset = offset || 0;
        this._xF32 = new Float32Array(this._arrayBuffer, this._offset, 1);
        this._yF32 = new Float32Array(this._arrayBuffer, this._offset + 4, 1);
        this._xF32[0] = x || 0;
        this._yF32[0] = y || 0;
    };
    cc.Vertex2F.BYTES_PER_ELEMENT = 8;
    Object.defineProperties(cc.Vertex2F.prototype, {
        x: {
            get: function () {
                return this._xF32[0];
            },
            set: function (xValue) {
                this._xF32[0] = xValue;
            },
            enumerable: true
        },
        y: {
            get: function () {
                return this._yF32[0];
            },
            set: function (yValue) {
                this._yF32[0] = yValue;
            },
            enumerable: true
        }
    });
    cc.Vertex3F = function (x, y, z, arrayBuffer, offset) {
        this._arrayBuffer = arrayBuffer || new ArrayBuffer(cc.Vertex3F.BYTES_PER_ELEMENT);
        this._offset = offset || 0;
        var locArrayBuffer = this._arrayBuffer, locOffset = this._offset;
        this._xF32 = new Float32Array(locArrayBuffer, locOffset, 1);
        this._xF32[0] = x || 0;
        this._yF32 = new Float32Array(locArrayBuffer, locOffset + Float32Array.BYTES_PER_ELEMENT, 1);
        this._yF32[0] = y || 0;
        this._zF32 = new Float32Array(locArrayBuffer, locOffset + Float32Array.BYTES_PER_ELEMENT * 2, 1);
        this._zF32[0] = z || 0;
    };
    cc.Vertex3F.BYTES_PER_ELEMENT = 12;
    Object.defineProperties(cc.Vertex3F.prototype, {
        x: {
            get: function () {
                return this._xF32[0];
            },
            set: function (xValue) {
                this._xF32[0] = xValue;
            },
            enumerable: true
        },
        y: {
            get: function () {
                return this._yF32[0];
            },
            set: function (yValue) {
                this._yF32[0] = yValue;
            },
            enumerable: true
        },
        z: {
            get: function () {
                return this._zF32[0];
            },
            set: function (zValue) {
                this._zF32[0] = zValue;
            },
            enumerable: true
        }
    });
    cc.Tex2F = function (u, v, arrayBuffer, offset) {
        this._arrayBuffer = arrayBuffer || new ArrayBuffer(cc.Tex2F.BYTES_PER_ELEMENT);
        this._offset = offset || 0;
        this._uF32 = new Float32Array(this._arrayBuffer, this._offset, 1);
        this._vF32 = new Float32Array(this._arrayBuffer, this._offset + 4, 1);
        this._uF32[0] = u || 0;
        this._vF32[0] = v || 0;
    };
    cc.Tex2F.BYTES_PER_ELEMENT = 8;
    Object.defineProperties(cc.Tex2F.prototype, {
        u: {
            get: function () {
                return this._uF32[0];
            },
            set: function (xValue) {
                this._uF32[0] = xValue;
            },
            enumerable: true
        },
        v: {
            get: function () {
                return this._vF32[0];
            },
            set: function (yValue) {
                this._vF32[0] = yValue;
            },
            enumerable: true
        }
    });
    cc.Quad2 = function (tl, tr, bl, br, arrayBuffer, offset) {
        this._arrayBuffer = arrayBuffer || new ArrayBuffer(cc.Quad2.BYTES_PER_ELEMENT);
        this._offset = offset || 0;
        var locArrayBuffer = this._arrayBuffer, locElementLen = cc.Vertex2F.BYTES_PER_ELEMENT;
        this._tl = tl ? new cc.Vertex2F(tl.x, tl.y, locArrayBuffer, 0) : new cc.Vertex2F(0, 0, locArrayBuffer, 0);
        this._tr = tr ? new cc.Vertex2F(tr.x, tr.y, locArrayBuffer, locElementLen) : new cc.Vertex2F(0, 0, locArrayBuffer, locElementLen);
        this._bl = bl ? new cc.Vertex2F(bl.x, bl.y, locArrayBuffer, locElementLen * 2) : new cc.Vertex2F(0, 0, locArrayBuffer, locElementLen * 2);
        this._br = br ? new cc.Vertex2F(br.x, br.y, locArrayBuffer, locElementLen * 3) : new cc.Vertex2F(0, 0, locArrayBuffer, locElementLen * 3);
    };
    cc.Quad2.BYTES_PER_ELEMENT = 32;
    cc.Quad3 = function (bl1, br1, tl1, tr1) {
        this.bl = bl1 || new cc.Vertex3F(0, 0, 0);
        this.br = br1 || new cc.Vertex3F(0, 0, 0);
        this.tl = tl1 || new cc.Vertex3F(0, 0, 0);
        this.tr = tr1 || new cc.Vertex3F(0, 0, 0);
    };
    Object.defineProperties(cc.Quad2.prototype, {
        tl: {
            get: function () {
                return this._tl;
            },
            set: function (tlValue) {
                this._tl.x = tlValue.x;
                this._tl.y = tlValue.y;
            },
            enumerable: true
        },
        tr: {
            get: function () {
                return this._tr;
            },
            set: function (trValue) {
                this._tr.x = trValue.x;
                this._tr.y = trValue.y;
            },
            enumerable: true
        },
        bl: {
            get: function () {
                return this._bl;
            },
            set: function (blValue) {
                this._bl.x = blValue.x;
                this._bl.y = blValue.y;
            },
            enumerable: true
        },
        br: {
            get: function () {
                return this._br;
            },
            set: function (brValue) {
                this._br.x = brValue.x;
                this._br.y = brValue.y;
            },
            enumerable: true
        }
    });
    cc.V3F_C4B_T2F = function (vertices, colors, texCoords, arrayBuffer, offset) {
        this._arrayBuffer = arrayBuffer || new ArrayBuffer(cc.V3F_C4B_T2F.BYTES_PER_ELEMENT);
        this._offset = offset || 0;
        var locArrayBuffer = this._arrayBuffer, locOffset = this._offset, locElementLen = cc.Vertex3F.BYTES_PER_ELEMENT;
        this._vertices = vertices ? new cc.Vertex3F(vertices.x, vertices.y, vertices.z, locArrayBuffer, locOffset) :
            new cc.Vertex3F(0, 0, 0, locArrayBuffer, locOffset);
        this._colors = colors ? cc.color(colors.r, colors.g, colors.b, colors.a, locArrayBuffer, locOffset + locElementLen) :
            cc.color(0, 0, 0, 0, locArrayBuffer, locOffset + locElementLen);
        this._texCoords = texCoords ? new cc.Tex2F(texCoords.u, texCoords.v, locArrayBuffer, locOffset + locElementLen + cc.Color.BYTES_PER_ELEMENT) :
            new cc.Tex2F(0, 0, locArrayBuffer, locOffset + locElementLen + cc.Color.BYTES_PER_ELEMENT);
    };
    cc.V3F_C4B_T2F.BYTES_PER_ELEMENT = 24;
    Object.defineProperties(cc.V3F_C4B_T2F.prototype, {
        vertices: {
            get: function () {
                return this._vertices;
            },
            set: function (verticesValue) {
                var locVertices = this._vertices;
                locVertices.x = verticesValue.x;
                locVertices.y = verticesValue.y;
                locVertices.z = verticesValue.z;
            },
            enumerable: true
        },
        colors: {
            get: function () {
                return this._colors;
            },
            set: function (colorValue) {
                var locColors = this._colors;
                locColors.r = colorValue.r;
                locColors.g = colorValue.g;
                locColors.b = colorValue.b;
                locColors.a = colorValue.a;
            },
            enumerable: true
        },
        texCoords: {
            get: function () {
                return this._texCoords;
            },
            set: function (texValue) {
                this._texCoords.u = texValue.u;
                this._texCoords.v = texValue.v;
            },
            enumerable: true
        }
    });
    cc.V3F_C4B_T2F_Quad = function (tl, bl, tr, br, arrayBuffer, offset) {
        this._arrayBuffer = arrayBuffer || new ArrayBuffer(cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT);
        this._offset = offset || 0;
        var locArrayBuffer = this._arrayBuffer, locOffset = this._offset, locElementLen = cc.V3F_C4B_T2F.BYTES_PER_ELEMENT;
        this._tl = tl ? new cc.V3F_C4B_T2F(tl.vertices, tl.colors, tl.texCoords, locArrayBuffer, locOffset) :
            new cc.V3F_C4B_T2F(null, null, null, locArrayBuffer, locOffset);
        this._bl = bl ? new cc.V3F_C4B_T2F(bl.vertices, bl.colors, bl.texCoords, locArrayBuffer, locOffset + locElementLen) :
            new cc.V3F_C4B_T2F(null, null, null, locArrayBuffer, locOffset + locElementLen);
        this._tr = tr ? new cc.V3F_C4B_T2F(tr.vertices, tr.colors, tr.texCoords, locArrayBuffer, locOffset + locElementLen * 2) :
            new cc.V3F_C4B_T2F(null, null, null, locArrayBuffer, locOffset + locElementLen * 2);
        this._br = br ? new cc.V3F_C4B_T2F(br.vertices, br.colors, br.texCoords, locArrayBuffer, locOffset + locElementLen * 3) :
            new cc.V3F_C4B_T2F(null, null, null, locArrayBuffer, locOffset + locElementLen * 3);
    };
    cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT = 96;
    Object.defineProperties(cc.V3F_C4B_T2F_Quad.prototype, {
        tl: {
            get: function () {
                return this._tl;
            },
            set: function (tlValue) {
                var locTl = this._tl;
                locTl.vertices = tlValue.vertices;
                locTl.colors = tlValue.colors;
                locTl.texCoords = tlValue.texCoords;
            },
            enumerable: true
        },
        bl: {
            get: function () {
                return this._bl;
            },
            set: function (blValue) {
                var locBl = this._bl;
                locBl.vertices = blValue.vertices;
                locBl.colors = blValue.colors;
                locBl.texCoords = blValue.texCoords;
            },
            enumerable: true
        },
        tr: {
            get: function () {
                return this._tr;
            },
            set: function (trValue) {
                var locTr = this._tr;
                locTr.vertices = trValue.vertices;
                locTr.colors = trValue.colors;
                locTr.texCoords = trValue.texCoords;
            },
            enumerable: true
        },
        br: {
            get: function () {
                return this._br;
            },
            set: function (brValue) {
                var locBr = this._br;
                locBr.vertices = brValue.vertices;
                locBr.colors = brValue.colors;
                locBr.texCoords = brValue.texCoords;
            },
            enumerable: true
        },
        arrayBuffer: {
            get: function () {
                return this._arrayBuffer;
            },
            enumerable: true
        }
    });
    cc.V3F_C4B_T2F_QuadZero = function () {
        return new cc.V3F_C4B_T2F_Quad();
    };
    cc.V3F_C4B_T2F_QuadCopy = function (sourceQuad) {
        if (!sourceQuad)
            return  cc.V3F_C4B_T2F_QuadZero();
        var srcTL = sourceQuad.tl, srcBL = sourceQuad.bl, srcTR = sourceQuad.tr, srcBR = sourceQuad.br;
        return {
            tl: {vertices: {x: srcTL.vertices.x, y: srcTL.vertices.y, z: srcTL.vertices.z},
                colors: {r: srcTL.colors.r, g: srcTL.colors.g, b: srcTL.colors.b, a: srcTL.colors.a},
                texCoords: {u: srcTL.texCoords.u, v: srcTL.texCoords.v}},
            bl: {vertices: {x: srcBL.vertices.x, y: srcBL.vertices.y, z: srcBL.vertices.z},
                colors: {r: srcBL.colors.r, g: srcBL.colors.g, b: srcBL.colors.b, a: srcBL.colors.a},
                texCoords: {u: srcBL.texCoords.u, v: srcBL.texCoords.v}},
            tr: {vertices: {x: srcTR.vertices.x, y: srcTR.vertices.y, z: srcTR.vertices.z},
                colors: {r: srcTR.colors.r, g: srcTR.colors.g, b: srcTR.colors.b, a: srcTR.colors.a},
                texCoords: {u: srcTR.texCoords.u, v: srcTR.texCoords.v}},
            br: {vertices: {x: srcBR.vertices.x, y: srcBR.vertices.y, z: srcBR.vertices.z},
                colors: {r: srcBR.colors.r, g: srcBR.colors.g, b: srcBR.colors.b, a: srcBR.colors.a},
                texCoords: {u: srcBR.texCoords.u, v: srcBR.texCoords.v}}
        };
    };
    cc.V3F_C4B_T2F_QuadsCopy = function (sourceQuads) {
        if (!sourceQuads)
            return [];
        var retArr = [];
        for (var i = 0; i < sourceQuads.length; i++) {
            retArr.push(cc.V3F_C4B_T2F_QuadCopy(sourceQuads[i]));
        }
        return retArr;
    };
    cc.V2F_C4B_T2F = function (vertices, colors, texCoords, arrayBuffer, offset) {
        this._arrayBuffer = arrayBuffer || new ArrayBuffer(cc.V2F_C4B_T2F.BYTES_PER_ELEMENT);
        this._offset = offset || 0;
        var locArrayBuffer = this._arrayBuffer, locOffset = this._offset, locElementLen = cc.Vertex2F.BYTES_PER_ELEMENT;
        this._vertices = vertices ? new cc.Vertex2F(vertices.x, vertices.y, locArrayBuffer, locOffset) :
            new cc.Vertex2F(0, 0, locArrayBuffer, locOffset);
        this._colors = colors ? cc.color(colors.r, colors.g, colors.b, colors.a, locArrayBuffer, locOffset + locElementLen) :
            cc.color(0, 0, 0, 0, locArrayBuffer, locOffset + locElementLen);
        this._texCoords = texCoords ? new cc.Tex2F(texCoords.u, texCoords.v, locArrayBuffer, locOffset + locElementLen + cc.Color.BYTES_PER_ELEMENT) :
            new cc.Tex2F(0, 0, locArrayBuffer, locOffset + locElementLen + cc.Color.BYTES_PER_ELEMENT);
    };
    cc.V2F_C4B_T2F.BYTES_PER_ELEMENT = 20;
    Object.defineProperties(cc.V2F_C4B_T2F.prototype, {
        vertices: {
            get: function () {
                return this._vertices;
            },
            set: function (verticesValue) {
                this._vertices.x = verticesValue.x;
                this._vertices.y = verticesValue.y;
            },
            enumerable: true
        },
        colors: {
            get: function () {
                return this._colors;
            },
            set: function (colorValue) {
                var locColors = this._colors;
                locColors.r = colorValue.r;
                locColors.g = colorValue.g;
                locColors.b = colorValue.b;
                locColors.a = colorValue.a;
            },
            enumerable: true
        },
        texCoords: {
            get: function () {
                return this._texCoords;
            },
            set: function (texValue) {
                this._texCoords.u = texValue.u;
                this._texCoords.v = texValue.v;
            },
            enumerable: true
        }
    });
    cc.V2F_C4B_T2F_Triangle = function (a, b, c, arrayBuffer, offset) {
        this._arrayBuffer = arrayBuffer || new ArrayBuffer(cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT);
        this._offset = offset || 0;
        var locArrayBuffer = this._arrayBuffer, locOffset = this._offset, locElementLen = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;
        this._a = a ? new cc.V2F_C4B_T2F(a.vertices, a.colors, a.texCoords, locArrayBuffer, locOffset) :
            new cc.V2F_C4B_T2F(null, null, null, locArrayBuffer, locOffset);
        this._b = b ? new cc.V2F_C4B_T2F(b.vertices, b.colors, b.texCoords, locArrayBuffer, locOffset + locElementLen) :
            new cc.V2F_C4B_T2F(null, null, null, locArrayBuffer, locOffset + locElementLen);
        this._c = c ? new cc.V2F_C4B_T2F(c.vertices, c.colors, c.texCoords, locArrayBuffer, locOffset + locElementLen * 2) :
            new cc.V2F_C4B_T2F(null, null, null, locArrayBuffer, locOffset + locElementLen * 2);
    };
    cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT = 60;
    Object.defineProperties(cc.V2F_C4B_T2F_Triangle.prototype, {
        a: {
            get: function () {
                return this._a;
            },
            set: function (aValue) {
                var locA = this._a;
                locA.vertices = aValue.vertices;
                locA.colors = aValue.colors;
                locA.texCoords = aValue.texCoords;
            },
            enumerable: true
        },
        b: {
            get: function () {
                return this._b;
            },
            set: function (bValue) {
                var locB = this._b;
                locB.vertices = bValue.vertices;
                locB.colors = bValue.colors;
                locB.texCoords = bValue.texCoords;
            },
            enumerable: true
        },
        c: {
            get: function () {
                return this._c;
            },
            set: function (cValue) {
                var locC = this._c;
                locC.vertices = cValue.vertices;
                locC.colors = cValue.colors;
                locC.texCoords = cValue.texCoords;
            },
            enumerable: true
        }
    });
};
cc._tmp.WebGLCCNode = function () {
    var _p = cc.Node.prototype;
    _p._transform4x4 = null;
    _p._stackMatrix = null;
    _p._glServerState = null;
    _p._camera = null;
    _p.ctor = function () {
        var _t = this;
        _t._initNode();
        var mat4 = new cc.kmMat4();
        mat4.mat[2] = mat4.mat[3] = mat4.mat[6] = mat4.mat[7] = mat4.mat[8] = mat4.mat[9] = mat4.mat[11] = mat4.mat[14] = 0.0;
        mat4.mat[10] = mat4.mat[15] = 1.0;
        _t._transform4x4 = mat4;
        _t._glServerState = 0;
        _t._stackMatrix = new cc.kmMat4();
        this._initRendererCmd();
    };
    _p.setNodeDirty = function () {
        var _t = this;
        if(_t._transformDirty === false){
            _t._setNodeDirtyForCache();
            _t._renderCmdDiry = _t._transformDirty = _t._inverseDirty = true;
            cc.renderer.pushDirtyNode(this);
        }
    };
    _p.visit = function () {
        var _t = this;
        if (!_t._visible)
            return;
        if( _t._parent)
            _t._curLevel = _t._parent._curLevel + 1;
        var context = cc._renderContext, i, currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        cc.kmMat4Assign(_t._stackMatrix, currentStack.top);
        currentStack.top = _t._stackMatrix;
        _t.transform();
        var locChildren = _t._children;
        if (locChildren && locChildren.length > 0) {
            var childLen = locChildren.length;
            _t.sortAllChildren();
            for (i = 0; i < childLen; i++) {
                if (locChildren[i] && locChildren[i]._localZOrder < 0)
                    locChildren[i].visit();
                else
                    break;
            }
            if(this._rendererCmd)
                cc.renderer.pushRenderCommand(this._rendererCmd);
            for (; i < childLen; i++) {
                if (locChildren[i]) {
                    locChildren[i].visit();
                }
            }
        } else{
            if(this._rendererCmd)
                cc.renderer.pushRenderCommand(this._rendererCmd);
        }
        currentStack.top = currentStack.stack.pop();
    };
    _p._transformForRenderer = function (pMatrix) {
        var t4x4 = this._transform4x4, stackMatrix = this._stackMatrix,
            parentMatrix = pMatrix || (this._parent ? this._parent._stackMatrix : cc.current_stack.top);
        var trans = this.nodeToParentTransform();
        var t4x4Mat = t4x4.mat;
        t4x4Mat[0] = trans.a;
        t4x4Mat[4] = trans.c;
        t4x4Mat[12] = trans.tx;
        t4x4Mat[1] = trans.b;
        t4x4Mat[5] = trans.d;
        t4x4Mat[13] = trans.ty;
        t4x4Mat[14] = this._vertexZ;
        cc.kmMat4Multiply(stackMatrix, parentMatrix, t4x4);
        if (this._camera != null && !(this.grid != null && this.grid.isActive())) {
            var apx = this._anchorPointInPoints.x, apy = this._anchorPointInPoints.y;
            var translate = (apx !== 0.0 || apy !== 0.0);
            if (translate){
                if(!cc.SPRITEBATCHNODE_RENDER_SUBPIXEL) {
                    apx = 0 | apx;
                    apy = 0 | apy;
                }
                var translation = new cc.kmMat4();
                cc.kmMat4Translation(translation, apx, apy, 0);
                cc.kmMat4Multiply(stackMatrix, stackMatrix, translation);
                this._camera._locateForRenderer(stackMatrix);
                cc.kmMat4Translation(translation, -apx, -apy, 0);
                cc.kmMat4Multiply(stackMatrix, stackMatrix, translation);
            } else {
                this._camera._locateForRenderer(stackMatrix);
            }
        }
        this._renderCmdDiry = false;
        if(!this._children || this._children.length === 0)
            return;
        var i, len, locChildren = this._children;
        for(i = 0, len = locChildren.length; i< len; i++){
            locChildren[i]._transformForRenderer(stackMatrix);
        }
    };
    _p.transform = function () {
        var _t = this;
        var t4x4 = _t._transform4x4, topMat4 = cc.current_stack.top;
        var trans = _t.nodeToParentTransform();
        var t4x4Mat = t4x4.mat;
        t4x4Mat[0] = trans.a;
        t4x4Mat[4] = trans.c;
        t4x4Mat[12] = trans.tx;
        t4x4Mat[1] = trans.b;
        t4x4Mat[5] = trans.d;
        t4x4Mat[13] = trans.ty;
        t4x4Mat[14] = _t._vertexZ;
        cc.kmMat4Multiply(topMat4, topMat4, t4x4);
        if (_t._camera != null && !(_t.grid != null && _t.grid.isActive())) {
            var apx = _t._anchorPointInPoints.x, apy = _t._anchorPointInPoints.y;
            var translate = (apx !== 0.0 || apy !== 0.0);
            if (translate){
                if(!cc.SPRITEBATCHNODE_RENDER_SUBPIXEL) {
                    apx = 0 | apx;
                    apy = 0 | apy;
                }
                cc.kmGLTranslatef(apx, apy, 0);
                _t._camera.locate();
                cc.kmGLTranslatef(-apx, -apy, 0);
            } else {
                _t._camera.locate();
            }
        }
    };
    _p.getNodeToParentTransform = _p._getNodeToParentTransformForWebGL;
};
cc._tmp.WebGLTexture2D = function () {
    cc.Texture2D = cc.Class.extend({
        _pVRHaveAlphaPremultiplied: true,
        _pixelFormat: null,
        _pixelsWide: 0,
        _pixelsHigh: 0,
        _name: "",
        _contentSize: null,
        maxS: 0,
        maxT: 0,
        _hasPremultipliedAlpha: false,
        _hasMipmaps: false,
        shaderProgram: null,
        _isLoaded: false,
        _htmlElementObj: null,
        _webTextureObj: null,
        url: null,
        _loadedEventListeners: null,
        ctor: function () {
            this._contentSize = cc.size(0, 0);
            this._pixelFormat = cc.Texture2D.defaultPixelFormat;
        },
        releaseTexture: function () {
            if (this._webTextureObj)
                cc._renderContext.deleteTexture(this._webTextureObj);
            cc.loader.release(this.url);
        },
        getPixelFormat: function () {
            return this._pixelFormat;
        },
        getPixelsWide: function () {
            return this._pixelsWide;
        },
        getPixelsHigh: function () {
            return this._pixelsHigh;
        },
        getName: function () {
            return this._webTextureObj;
        },
        getContentSize: function () {
            return cc.size(this._contentSize.width / cc.contentScaleFactor(), this._contentSize.height / cc.contentScaleFactor());
        },
        _getWidth: function () {
            return this._contentSize.width / cc.contentScaleFactor();
        },
        _getHeight: function () {
            return this._contentSize.height / cc.contentScaleFactor();
        },
        getContentSizeInPixels: function () {
            return this._contentSize;
        },
        getMaxS: function () {
            return this.maxS;
        },
        setMaxS: function (maxS) {
            this.maxS = maxS;
        },
        getMaxT: function () {
            return this.maxT;
        },
        setMaxT: function (maxT) {
            this.maxT = maxT;
        },
        getShaderProgram: function () {
            return this.shaderProgram;
        },
        setShaderProgram: function (shaderProgram) {
            this.shaderProgram = shaderProgram;
        },
        hasPremultipliedAlpha: function () {
            return this._hasPremultipliedAlpha;
        },
        hasMipmaps: function () {
            return this._hasMipmaps;
        },
        description: function () {
            var _t = this;
            return "<cc.Texture2D | Name = " + _t._name + " | Dimensions = " + _t._pixelsWide + " x " + _t._pixelsHigh
                + " | Coordinates = (" + _t.maxS + ", " + _t.maxT + ")>";
        },
        releaseData: function (data) {
            data = null;
        },
        keepData: function (data, length) {
            return data;
        },
        initWithData: function (data, pixelFormat, pixelsWide, pixelsHigh, contentSize) {
            var self = this, tex2d = cc.Texture2D;
            var gl = cc._renderContext;
            var format = gl.RGBA, type = gl.UNSIGNED_BYTE;
            var bitsPerPixel = cc.Texture2D._B[pixelFormat];
            var bytesPerRow = pixelsWide * bitsPerPixel / 8;
            if (bytesPerRow % 8 === 0) {
                gl.pixelStorei(gl.UNPACK_ALIGNMENT, 8);
            } else if (bytesPerRow % 4 === 0) {
                gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
            } else if (bytesPerRow % 2 === 0) {
                gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);
            } else {
                gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
            }
            self._webTextureObj = gl.createTexture();
            cc.glBindTexture2D(self);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            switch (pixelFormat) {
                case tex2d.PIXEL_FORMAT_RGBA8888:
                    format = gl.RGBA;
                    break;
                case tex2d.PIXEL_FORMAT_RGB888:
                    format = gl.RGB;
                    break;
                case tex2d.PIXEL_FORMAT_RGBA4444:
                    type = gl.UNSIGNED_SHORT_4_4_4_4;
                    break;
                case tex2d.PIXEL_FORMAT_RGB5A1:
                    type = gl.UNSIGNED_SHORT_5_5_5_1;
                    break;
                case tex2d.PIXEL_FORMAT_RGB565:
                    type = gl.UNSIGNED_SHORT_5_6_5;
                    break;
                case tex2d.PIXEL_FORMAT_AI88:
                    format = gl.LUMINANCE_ALPHA;
                    break;
                case tex2d.PIXEL_FORMAT_A8:
                    format = gl.ALPHA;
                    break;
                case tex2d.PIXEL_FORMAT_I8:
                    format = gl.LUMINANCE;
                    break;
                default:
                    cc.assert(0, cc._LogInfos.Texture2D_initWithData);
            }
            gl.texImage2D(gl.TEXTURE_2D, 0, format, pixelsWide, pixelsHigh, 0, format, type, data);
            self._contentSize.width = contentSize.width;
            self._contentSize.height = contentSize.height;
            self._pixelsWide = pixelsWide;
            self._pixelsHigh = pixelsHigh;
            self._pixelFormat = pixelFormat;
            self.maxS = contentSize.width / pixelsWide;
            self.maxT = contentSize.height / pixelsHigh;
            self._hasPremultipliedAlpha = false;
            self._hasMipmaps = false;
            self.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURE);
            self._isLoaded = true;
            return true;
        },
        drawAtPoint: function (point) {
            var self = this;
            var coordinates = [
                0.0, self.maxT,
                self.maxS, self.maxT,
                0.0, 0.0,
                self.maxS, 0.0 ];
            var width = self._pixelsWide * self.maxS,
                height = self._pixelsHigh * self.maxT;
            var vertices = [
                point.x, point.y, 0.0,
                width + point.x, point.y, 0.0,
                point.x, height + point.y, 0.0,
                width + point.x, height + point.y, 0.0 ];
            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_TEX_COORDS);
            self._shaderProgram.use();
            self._shaderProgram.setUniformsForBuiltins();
            cc.glBindTexture2D(self);
            var gl = cc._renderContext;
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, 0, vertices);
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 0, coordinates);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        },
        drawInRect: function (rect) {
            var self = this;
            var coordinates = [
                0.0, self.maxT,
                self.maxS, self.maxT,
                0.0, 0.0,
                self.maxS, 0.0];
            var vertices = [    rect.x, rect.y, 
                rect.x + rect.width, rect.y, 
                rect.x, rect.y + rect.height, 
                rect.x + rect.width, rect.y + rect.height         ];
            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_TEX_COORDS);
            self._shaderProgram.use();
            self._shaderProgram.setUniformsForBuiltins();
            cc.glBindTexture2D(self);
            var gl = cc._renderContext;
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, 0, vertices);
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 0, coordinates);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        },
        initWithImage: function (uiImage) {
            if (uiImage == null) {
                cc.log(cc._LogInfos.Texture2D_initWithImage);
                return false;
            }
            var imageWidth = uiImage.getWidth();
            var imageHeight = uiImage.getHeight();
            var maxTextureSize = cc.configuration.getMaxTextureSize();
            if (imageWidth > maxTextureSize || imageHeight > maxTextureSize) {
                cc.log(cc._LogInfos.Texture2D_initWithImage_2, imageWidth, imageHeight, maxTextureSize, maxTextureSize);
                return false;
            }
            this._isLoaded = true;
            return this._initPremultipliedATextureWithImage(uiImage, imageWidth, imageHeight);
        },
        initWithElement: function (element) {
            if (!element)
                return;
            this._webTextureObj = cc._renderContext.createTexture();
            this._htmlElementObj = element;
        },
        getHtmlElementObj: function () {
            return this._htmlElementObj;
        },
        isLoaded: function () {
            return this._isLoaded;
        },
        handleLoadedTexture: function () {
            var self = this;
            if (!cc._rendererInitialized) return;
            if (!self._htmlElementObj) {
                var img = cc.loader.getRes(self.url);
                if (!img) return;
                self.initWithElement(img);
            }
            if (!self._htmlElementObj.width || !self._htmlElementObj.height) {
                return;
            }
            self._isLoaded = true;
            var gl = cc._renderContext;
            cc.glBindTexture2D(self);
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self._htmlElementObj);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            self.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURE);
            cc.glBindTexture2D(null);
            var pixelsWide = self._htmlElementObj.width;
            var pixelsHigh = self._htmlElementObj.height;
            self._pixelsWide = self._contentSize.width = pixelsWide;
            self._pixelsHigh = self._contentSize.height = pixelsHigh;
            self._pixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA8888;
            self.maxS = 1;
            self.maxT = 1;
            self._hasPremultipliedAlpha = false;
            self._hasMipmaps = false;
            this._callLoadedEventCallbacks();
        },
        initWithString: function (text, fontName, fontSize, dimensions, hAlignment, vAlignment) {
            cc.log(cc._LogInfos.Texture2D_initWithString);
            return null;
        },
        initWithETCFile: function (file) {
            cc.log(cc._LogInfos.Texture2D_initWithETCFile_2);
            return false;
        },
        initWithPVRFile: function (file) {
            cc.log(cc._LogInfos.Texture2D_initWithPVRFile_2);
            return false;
        },
        initWithPVRTCData: function (data, level, bpp, hasAlpha, length, pixelFormat) {
            cc.log(cc._LogInfos.Texture2D_initWithPVRTCData_2);
            return false;
        },
        setTexParameters: function (texParams, magFilter, wrapS, wrapT) {
            var _t = this;
            var gl = cc._renderContext;
            if(magFilter !== undefined)
                texParams = {minFilter: texParams, magFilter: magFilter, wrapS: wrapS, wrapT: wrapT};
            cc.assert((_t._pixelsWide == cc.NextPOT(_t._pixelsWide) && _t._pixelsHigh == cc.NextPOT(_t._pixelsHigh)) ||
                (texParams.wrapS == gl.CLAMP_TO_EDGE && texParams.wrapT == gl.CLAMP_TO_EDGE),
                "WebGLRenderingContext.CLAMP_TO_EDGE should be used in NPOT textures");
            cc.glBindTexture2D(_t);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texParams.minFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texParams.magFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, texParams.wrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, texParams.wrapT);
        },
        setAntiAliasTexParameters: function () {
            var gl = cc._renderContext;
            cc.glBindTexture2D(this);
            if (!this._hasMipmaps)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            else
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        },
        setAliasTexParameters: function () {
            var gl = cc._renderContext;
            cc.glBindTexture2D(this);
            if (!this._hasMipmaps)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            else
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        },
        generateMipmap: function () {
            var _t = this;
            cc.assert(_t._pixelsWide == cc.NextPOT(_t._pixelsWide) && _t._pixelsHigh == cc.NextPOT(_t._pixelsHigh), "Mimpap texture only works in POT textures");
            cc.glBindTexture2D(_t);
            cc._renderContext.generateMipmap(cc._renderContext.TEXTURE_2D);
            _t._hasMipmaps = true;
        },
        stringForFormat: function () {
            return cc.Texture2D._M[this._pixelFormat];
        },
        bitsPerPixelForFormat: function (format) {//TODO I want to delete the format argument, use this._pixelFormat
            format = format || this._pixelFormat;
            var value = cc.Texture2D._B[format];
            if (value != null) return value;
            cc.log(cc._LogInfos.Texture2D_bitsPerPixelForFormat, format);
            return -1;
        },
        _initPremultipliedATextureWithImage: function (uiImage, width, height) {
            var tex2d = cc.Texture2D;
            var tempData = uiImage.getData();
            var inPixel32 = null;
            var inPixel8 = null;
            var outPixel16 = null;
            var hasAlpha = uiImage.hasAlpha();
            var imageSize = cc.size(uiImage.getWidth(), uiImage.getHeight());
            var pixelFormat = tex2d.defaultPixelFormat;
            var bpp = uiImage.getBitsPerComponent();
            var i;
            if (!hasAlpha) {
                if (bpp >= 8) {
                    pixelFormat = tex2d.PIXEL_FORMAT_RGB888;
                } else {
                    cc.log(cc._LogInfos.Texture2D__initPremultipliedATextureWithImage);
                    pixelFormat = tex2d.PIXEL_FORMAT_RGB565;
                }
            }
            var length = width * height;
            if (pixelFormat == tex2d.PIXEL_FORMAT_RGB565) {
                if (hasAlpha) {
                    tempData = new Uint16Array(width * height);
                    inPixel32 = uiImage.getData();
                    for (i = 0; i < length; ++i) {
                        tempData[i] =
                            ((((inPixel32[i] >> 0) & 0xFF) >> 3) << 11) |
                                ((((inPixel32[i] >> 8) & 0xFF) >> 2) << 5) |
                                ((((inPixel32[i] >> 16) & 0xFF) >> 3) << 0);
                    }
                } else {
                    tempData = new Uint16Array(width * height);
                    inPixel8 = uiImage.getData();
                    for (i = 0; i < length; ++i) {
                        tempData[i] =
                            (((inPixel8[i] & 0xFF) >> 3) << 11) |
                                (((inPixel8[i] & 0xFF) >> 2) << 5) |
                                (((inPixel8[i] & 0xFF) >> 3) << 0);
                    }
                }
            } else if (pixelFormat == tex2d.PIXEL_FORMAT_RGBA4444) {
                tempData = new Uint16Array(width * height);
                inPixel32 = uiImage.getData();
                for (i = 0; i < length; ++i) {
                    tempData[i] =
                        ((((inPixel32[i] >> 0) & 0xFF) >> 4) << 12) |
                            ((((inPixel32[i] >> 8) & 0xFF) >> 4) << 8) |
                            ((((inPixel32[i] >> 16) & 0xFF) >> 4) << 4) |
                            ((((inPixel32[i] >> 24) & 0xFF) >> 4) << 0);
                }
            } else if (pixelFormat == tex2d.PIXEL_FORMAT_RGB5A1) {
                tempData = new Uint16Array(width * height);
                inPixel32 = uiImage.getData();
                for (i = 0; i < length; ++i) {
                    tempData[i] =
                        ((((inPixel32[i] >> 0) & 0xFF) >> 3) << 11) |
                            ((((inPixel32[i] >> 8) & 0xFF) >> 3) << 6) |
                            ((((inPixel32[i] >> 16) & 0xFF) >> 3) << 1) |
                            ((((inPixel32[i] >> 24) & 0xFF) >> 7) << 0);
                }
            } else if (pixelFormat == tex2d.PIXEL_FORMAT_A8) {
                tempData = new Uint8Array(width * height);
                inPixel32 = uiImage.getData();
                for (i = 0; i < length; ++i) {
                    tempData[i] = (inPixel32 >> 24) & 0xFF;
                }
            }
            if (hasAlpha && pixelFormat == tex2d.PIXEL_FORMAT_RGB888) {
                inPixel32 = uiImage.getData();
                tempData = new Uint8Array(width * height * 3);
                for (i = 0; i < length; ++i) {
                    tempData[i * 3] = (inPixel32 >> 0) & 0xFF;
                    tempData[i * 3 + 1] = (inPixel32 >> 8) & 0xFF;
                    tempData[i * 3 + 2] = (inPixel32 >> 16) & 0xFF;
                }
            }
            this.initWithData(tempData, pixelFormat, width, height, imageSize);
            if (tempData != uiImage.getData())
                tempData = null;
            this._hasPremultipliedAlpha = uiImage.isPremultipliedAlpha();
            return true;
        },
        addLoadedEventListener: function (callback, target) {
            if (!this._loadedEventListeners)
                this._loadedEventListeners = [];
            this._loadedEventListeners.push({eventCallback: callback, eventTarget: target});
        },
        removeLoadedEventListener: function (target) {
            if (!this._loadedEventListeners)
                return;
            var locListeners = this._loadedEventListeners;
            for (var i = 0; i < locListeners.length; i++) {
                var selCallback = locListeners[i];
                if (selCallback.eventTarget == target) {
                    locListeners.splice(i, 1);
                }
            }
        },
        _callLoadedEventCallbacks: function () {
            if (!this._loadedEventListeners)
                return;
            var locListeners = this._loadedEventListeners;
            for (var i = 0, len = locListeners.length; i < len; i++) {
                var selCallback = locListeners[i];
                selCallback.eventCallback.call(selCallback.eventTarget, this);
            }
            locListeners.length = 0;
        }
    });
};
cc._tmp.WebGLTextureAtlas = function () {
    var _p = cc.TextureAtlas.prototype;
    _p._setupVBO = function () {
        var _t = this;
        var gl = cc._renderContext;
        _t._buffersVBO[0] = gl.createBuffer();
        _t._buffersVBO[1] = gl.createBuffer();
        _t._quadsWebBuffer = gl.createBuffer();
        _t._mapBuffers();
    };
    _p._mapBuffers = function () {
        var _t = this;
        var gl = cc._renderContext;
        gl.bindBuffer(gl.ARRAY_BUFFER, _t._quadsWebBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, _t._quadsArrayBuffer, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _t._buffersVBO[1]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _t._indices, gl.STATIC_DRAW);
    };
    _p.drawNumberOfQuads = function (n, start) {
        var _t = this;
        start = start || 0;
        if (0 === n || !_t.texture || !_t.texture.isLoaded())
            return;
        var gl = cc._renderContext;
        cc.glBindTexture2D(_t.texture);
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
        gl.bindBuffer(gl.ARRAY_BUFFER, _t._quadsWebBuffer);
        if (_t.dirty)
            gl.bufferData(gl.ARRAY_BUFFER, _t._quadsArrayBuffer, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 24, 16);
        if (_t.dirty)
            _t.dirty = false;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _t._buffersVBO[1]);
        if (cc.TEXTURE_ATLAS_USE_TRIANGLE_STRIP)
            gl.drawElements(gl.TRIANGLE_STRIP, n * 6, gl.UNSIGNED_SHORT, start * 6 * _t._indices.BYTES_PER_ELEMENT);
        else
            gl.drawElements(gl.TRIANGLES, n * 6, gl.UNSIGNED_SHORT, start * 6 * _t._indices.BYTES_PER_ELEMENT);
        cc.g_NumberOfDraws++;
    };
};
cc._tmp.WebGLTextureCache = function () {
    var _p = cc.textureCache;
    _p.handleLoadedTexture = function (url) {
        var locTexs = this._textures;
        if (!cc._rendererInitialized) {
            locTexs = this._loadedTexturesBefore;
        }
        var tex = locTexs[url];
        if (!tex) {
            tex = locTexs[url] = new cc.Texture2D();
            tex.url = url;
        }
        tex.handleLoadedTexture();
    };
    _p.addImage = function (url, cb, target) {
        cc.assert(url, cc._LogInfos.Texture2D_addImage_2);
        var locTexs = this._textures;
        if (!cc._rendererInitialized) {
            locTexs = this._loadedTexturesBefore;
        }
        var tex = locTexs[url] || locTexs[cc.loader._aliases[url]];
        if (tex) {
            cb && cb.call(target, tex);
            return tex;
        }
        if (!cc.loader.getRes(url)) {
            if (cc.loader._checkIsImageURL(url)) {
                cc.loader.load(url, function (err) {
                    cb && cb.call(target);
                });
            } else {
                cc.loader.loadImg(url, function (err, img) {
                    if (err)
                        return cb ? cb(err) : err;
                    cc.loader.cache[url] = img;
                    cc.textureCache.handleLoadedTexture(url);
                    cb && cb.call(target, tex);
                });
            }
        }
        tex = locTexs[url] = new cc.Texture2D();
        tex.url = url;
        return tex;
    };
    delete _p;
}
cc._tmp.LayerDefineForWebGL = function(){
    var _p = cc.Layer.prototype;
    _p.bake = function(){};
    _p.unbake = function(){};
    _p.visit = cc.Node.prototype.visit;
};
cc._tmp.WebGLLayerColor = function () {
    var _p = cc.LayerColor.prototype;
    _p._squareVertices = null;
    _p._squareColors = null;
    _p._verticesFloat32Buffer = null;
    _p._colorsUint8Buffer = null;
    _p._squareVerticesAB = null;
    _p._squareColorsAB = null;
    _p.ctor = function (color, width, height) {
        var _t = this;
        _t._squareVerticesAB = new ArrayBuffer(32);
        _t._squareColorsAB = new ArrayBuffer(16);
        var locSquareVerticesAB = _t._squareVerticesAB, locSquareColorsAB = _t._squareColorsAB;
        var locVertex2FLen = cc.Vertex2F.BYTES_PER_ELEMENT, locColorLen = cc.Color.BYTES_PER_ELEMENT;
        _t._squareVertices = [new cc.Vertex2F(0, 0, locSquareVerticesAB, 0),
            new cc.Vertex2F(0, 0, locSquareVerticesAB, locVertex2FLen),
            new cc.Vertex2F(0, 0, locSquareVerticesAB, locVertex2FLen * 2),
            new cc.Vertex2F(0, 0, locSquareVerticesAB, locVertex2FLen * 3)];
        _t._squareColors = [cc.color(0, 0, 0, 255, locSquareColorsAB, 0),
            cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen),
            cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen * 2),
            cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen * 3)];
        _t._verticesFloat32Buffer = cc._renderContext.createBuffer();
        _t._colorsUint8Buffer = cc._renderContext.createBuffer();
        cc.Layer.prototype.ctor.call(_t);
        _t._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        cc.LayerColor.prototype.init.call(_t, color, width, height);
    };
    _p._initRendererCmd = function(){
        this._rendererCmd = new cc.RectRenderCmdWebGL(this);
    };
    _p.setContentSize = function (size, height) {
        var locSquareVertices = this._squareVertices;
        if (height === undefined) {
            locSquareVertices[1].x = size.width;
            locSquareVertices[2].y = size.height;
            locSquareVertices[3].x = size.width;
            locSquareVertices[3].y = size.height;
        } else {
            locSquareVertices[1].x = size;
            locSquareVertices[2].y = height;
            locSquareVertices[3].x = size;
            locSquareVertices[3].y = height;
        }
        this._bindLayerVerticesBufferData();
        cc.Layer.prototype.setContentSize.call(this, size, height);
    };
    _p._setWidth = function (width) {
        var locSquareVertices = this._squareVertices;
        locSquareVertices[1].x = width;
        locSquareVertices[3].x = width;
        this._bindLayerVerticesBufferData();
        cc.Layer.prototype._setWidth.call(this, width);
    };
    _p._setHeight = function (height) {
        var locSquareVertices = this._squareVertices;
        locSquareVertices[2].y = height;
        locSquareVertices[3].y = height;
        this._bindLayerVerticesBufferData();
        cc.Layer.prototype._setHeight.call(this, height);
    };
    _p._updateColor = function () {
        var locDisplayedColor = this._displayedColor;
        var locDisplayedOpacity = this._displayedOpacity, locSquareColors = this._squareColors;
        for (var i = 0; i < 4; i++) {
            locSquareColors[i].r = locDisplayedColor.r;
            locSquareColors[i].g = locDisplayedColor.g;
            locSquareColors[i].b = locDisplayedColor.b;
            locSquareColors[i].a = locDisplayedOpacity;
        }
        this._bindLayerColorsBufferData();
    };
    _p.draw = function (ctx) {
        var context = ctx || cc._renderContext;
        cc.nodeDrawSetup(this);
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR);
        context.bindBuffer(context.ARRAY_BUFFER, this._verticesFloat32Buffer);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, context.FLOAT, false, 0, 0);
        context.bindBuffer(context.ARRAY_BUFFER, this._colorsUint8Buffer);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, context.UNSIGNED_BYTE, true, 0, 0);
        cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst);
        context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
    };
    _p._bindLayerVerticesBufferData = function () {
        var glContext = cc._renderContext;
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this._verticesFloat32Buffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, this._squareVerticesAB, glContext.STATIC_DRAW);
    };
    _p._bindLayerColorsBufferData = function () {
        var glContext = cc._renderContext;
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this._colorsUint8Buffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, this._squareColorsAB, glContext.STATIC_DRAW);
    };
};
cc._tmp.WebGLLayerGradient = function () {
    var _p = cc.LayerGradient.prototype;
    _p._initRendererCmd = function(){
        this._rendererCmd = new cc.RectRenderCmdWebGL(this);
    };
    _p.draw = cc.LayerColor.prototype.draw;
    _p._updateColor = function () {
        var _t = this;
        var locAlongVector = _t._alongVector;
        var h = cc.pLength(locAlongVector);
        if (h === 0)
            return;
        var c = Math.sqrt(2.0), u = cc.p(locAlongVector.x / h, locAlongVector.y / h);
        if (_t._compressedInterpolation) {
            var h2 = 1 / ( Math.abs(u.x) + Math.abs(u.y) );
            u = cc.pMult(u, h2 * c);
        }
        var opacityf = _t._displayedOpacity / 255.0;
        var locDisplayedColor = _t._displayedColor, locEndColor = _t._endColor;
        var S = { r: locDisplayedColor.r, g: locDisplayedColor.g, b: locDisplayedColor.b, a: _t._startOpacity * opacityf};
        var E = {r: locEndColor.r, g: locEndColor.g, b: locEndColor.b, a: _t._endOpacity * opacityf};
        var locSquareColors = _t._squareColors;
        var locSquareColor0 = locSquareColors[0], locSquareColor1 = locSquareColors[1], locSquareColor2 = locSquareColors[2], locSquareColor3 = locSquareColors[3];
        locSquareColor0.r = ((E.r + (S.r - E.r) * ((c + u.x + u.y) / (2.0 * c))));
        locSquareColor0.g = ((E.g + (S.g - E.g) * ((c + u.x + u.y) / (2.0 * c))));
        locSquareColor0.b = ((E.b + (S.b - E.b) * ((c + u.x + u.y) / (2.0 * c))));
        locSquareColor0.a = ((E.a + (S.a - E.a) * ((c + u.x + u.y) / (2.0 * c))));
        locSquareColor1.r = ((E.r + (S.r - E.r) * ((c - u.x + u.y) / (2.0 * c))));
        locSquareColor1.g = ((E.g + (S.g - E.g) * ((c - u.x + u.y) / (2.0 * c))));
        locSquareColor1.b = ((E.b + (S.b - E.b) * ((c - u.x + u.y) / (2.0 * c))));
        locSquareColor1.a = ((E.a + (S.a - E.a) * ((c - u.x + u.y) / (2.0 * c))));
        locSquareColor2.r = ((E.r + (S.r - E.r) * ((c + u.x - u.y) / (2.0 * c))));
        locSquareColor2.g = ((E.g + (S.g - E.g) * ((c + u.x - u.y) / (2.0 * c))));
        locSquareColor2.b = ((E.b + (S.b - E.b) * ((c + u.x - u.y) / (2.0 * c))));
        locSquareColor2.a = ((E.a + (S.a - E.a) * ((c + u.x - u.y) / (2.0 * c))));
        locSquareColor3.r = ((E.r + (S.r - E.r) * ((c - u.x - u.y) / (2.0 * c))));
        locSquareColor3.g = ((E.g + (S.g - E.g) * ((c - u.x - u.y) / (2.0 * c))));
        locSquareColor3.b = ((E.b + (S.b - E.b) * ((c - u.x - u.y) / (2.0 * c))));
        locSquareColor3.a = ((E.a + (S.a - E.a) * ((c - u.x - u.y) / (2.0 * c))));
        _t._bindLayerColorsBufferData();
    };
};
cc._tmp.WebGLSprite = function () {
    var _p = cc.Sprite.prototype;
    _p._spriteFrameLoadedCallback = function(spriteFrame){
        this.setNodeDirty(true);
        this.setTextureRect(spriteFrame.getRect(), spriteFrame.isRotated(), spriteFrame.getOriginalSize());
        this._callLoadedEventCallbacks();
    };
    _p.setOpacityModifyRGB = function (modify) {
        if (this._opacityModifyRGB !== modify) {
            this._opacityModifyRGB = modify;
            this.updateColor();
        }
    };
    _p.updateDisplayedOpacity = function (parentOpacity) {
        cc.Node.prototype.updateDisplayedOpacity.call(this, parentOpacity);
        this.updateColor();
    };
    _p.ctor = function (fileName, rect, rotated) {
        var self = this;
        cc.Node.prototype.ctor.call(self);
        self._shouldBeHidden = false;
        self._offsetPosition = cc.p(0, 0);
        self._unflippedOffsetPositionFromCenter = cc.p(0, 0);
        self._blendFunc = {src: cc.BLEND_SRC, dst: cc.BLEND_DST};
        self._rect = cc.rect(0,0,0,0);
        self._quad = new cc.V3F_C4B_T2F_Quad();
        self._quadWebBuffer = cc._renderContext.createBuffer();
        self._quadDirty = true;
        self._textureLoaded = true;
        self._softInit(fileName, rect, rotated);
    };
    _p._initRendererCmd = function(){
        this._rendererCmd = new cc.TextureRenderCmdWebGL(this);
    };
    _p.setBlendFunc = function (src, dst) {
        var locBlendFunc = this._blendFunc;
        if (dst === undefined) {
            locBlendFunc.src = src.src;
            locBlendFunc.dst = src.dst;
        } else {
            locBlendFunc.src = src;
            locBlendFunc.dst = dst;
        }
    };
    _p.init = function () {
        var _t = this;
        if (arguments.length > 0)
            return _t.initWithFile(arguments[0], arguments[1]);
        cc.Node.prototype.init.call(_t);
        _t.dirty = _t._recursiveDirty = false;
        _t._opacityModifyRGB = true;
        _t._blendFunc.src = cc.BLEND_SRC;
        _t._blendFunc.dst = cc.BLEND_DST;
        _t.texture = null;
        _t._textureLoaded = true;
        _t._flippedX = _t._flippedY = false;
        _t.anchorX = 0.5;
        _t.anchorY = 0.5;
        _t._offsetPosition.x = 0;
        _t._offsetPosition.y = 0;
        _t._hasChildren = false;
        var tempColor = {r: 255, g: 255, b: 255, a: 255};
        _t._quad.bl.colors = tempColor;
        _t._quad.br.colors = tempColor;
        _t._quad.tl.colors = tempColor;
        _t._quad.tr.colors = tempColor;
        _t._quadDirty = true;
        _t.setTextureRect(cc.rect(0, 0, 0, 0), false, cc.size(0, 0));
        return true;
    };
    _p.initWithTexture = function (texture, rect, rotated) {
        var _t = this;
        var argnum = arguments.length;
        cc.assert(argnum!=0, cc._LogInfos.Sprite_initWithTexture);
        rotated = rotated || false;
        if (!cc.Node.prototype.init.call(_t))
            return false;
        _t._batchNode = null;
        _t._recursiveDirty = false;
        _t.dirty = false;
        _t._opacityModifyRGB = true;
        _t._blendFunc.src = cc.BLEND_SRC;
        _t._blendFunc.dst = cc.BLEND_DST;
        _t._flippedX = _t._flippedY = false;
        _t.anchorX = 0.5;
        _t.anchorY = 0.5;
        _t._offsetPosition.x = 0;
        _t._offsetPosition.y = 0;
        _t._hasChildren = false;
        var tmpColor = cc.color(255, 255, 255, 255);
        var locQuad = _t._quad;
        locQuad.bl.colors = tmpColor;
        locQuad.br.colors = tmpColor;
        locQuad.tl.colors = tmpColor;
        locQuad.tr.colors = tmpColor;
        var locTextureLoaded = texture.isLoaded();
        _t._textureLoaded = locTextureLoaded;
        if (!locTextureLoaded) {
            _t._rectRotated = rotated || false;
            if (rect) {
                var locRect = _t._rect;
                locRect.x = rect.x;
                locRect.y = rect.y;
                locRect.width = rect.width;
                locRect.height = rect.height;
            }
            texture.addLoadedEventListener(_t._textureLoadedCallback, _t);
            return true;
        }
        if (!rect) {
            rect = cc.rect(0, 0, texture.width, texture.height);
        }
        if(texture && texture.url) {
            var _x, _y;
            if(rotated){
                _x = rect.x + rect.height;
                _y = rect.y + rect.width;
            }else{
                _x = rect.x + rect.width;
                _y = rect.y + rect.height;
            }
            if(_x > texture.width){
                cc.error(cc._LogInfos.RectWidth, texture.url);
            }
            if(_y > texture.height){
                cc.error(cc._LogInfos.RectHeight, texture.url);
            }
        }
        _t.texture = texture;
        _t.setTextureRect(rect, rotated);
        _t.batchNode = null;
        _t._quadDirty = true;
        return true;
    };
    _p._textureLoadedCallback = function (sender) {
        var _t = this;
        if(_t._textureLoaded)
            return;
        _t._textureLoaded = true;
        var locRect = _t._rect;
        if (!locRect) {
            locRect = cc.rect(0, 0, sender.width, sender.height);
        } else if (cc._rectEqualToZero(locRect)) {
            locRect.width = sender.width;
            locRect.height = sender.height;
        }
        _t.texture = sender;
        _t.setTextureRect(locRect, _t._rectRotated);
        _t.batchNode = _t._batchNode;
        _t._quadDirty = true;
        _t._callLoadedEventCallbacks();
    };
    _p.setTextureRect = function (rect, rotated, untrimmedSize) {
        var _t = this;
        _t._rectRotated = rotated || false;
        _t.setContentSize(untrimmedSize || rect);
        _t.setVertexRect(rect);
        _t._setTextureCoords(rect);
        var relativeOffset = _t._unflippedOffsetPositionFromCenter;
        if (_t._flippedX)
            relativeOffset.x = -relativeOffset.x;
        if (_t._flippedY)
            relativeOffset.y = -relativeOffset.y;
        var locRect = _t._rect;
        _t._offsetPosition.x = relativeOffset.x + (_t._contentSize.width - locRect.width) / 2;
        _t._offsetPosition.y = relativeOffset.y + (_t._contentSize.height - locRect.height) / 2;
        if (_t._batchNode) {
            _t.dirty = true;
        } else {
            var x1 = _t._offsetPosition.x;
            var y1 = _t._offsetPosition.y;
            var x2 = x1 + locRect.width;
            var y2 = y1 + locRect.height;
            var locQuad = _t._quad;
            locQuad.bl.vertices = {x:x1, y:y1, z:0};
            locQuad.br.vertices = {x:x2, y:y1, z:0};
            locQuad.tl.vertices = {x:x1, y:y2, z:0};
            locQuad.tr.vertices = {x:x2, y:y2, z:0};
            _t._quadDirty = true;
        }
    };
    _p.updateTransform = function () {
        var _t = this;
        if (_t.dirty) {
            var locQuad = _t._quad, locParent = _t._parent;
            if (!_t._visible || ( locParent && locParent != _t._batchNode && locParent._shouldBeHidden)) {
                locQuad.br.vertices = locQuad.tl.vertices = locQuad.tr.vertices = locQuad.bl.vertices = {x: 0, y: 0, z: 0};
                _t._shouldBeHidden = true;
            } else {
                _t._shouldBeHidden = false;
                if (!locParent || locParent == _t._batchNode) {
                    _t._transformToBatch = _t.nodeToParentTransform();
                } else {
                    _t._transformToBatch = cc.affineTransformConcat(_t.nodeToParentTransform(), locParent._transformToBatch);
                }
                var locTransformToBatch = _t._transformToBatch;
                var rect = _t._rect;
                var x1 = _t._offsetPosition.x;
                var y1 = _t._offsetPosition.y;
                var x2 = x1 + rect.width;
                var y2 = y1 + rect.height;
                var x = locTransformToBatch.tx;
                var y = locTransformToBatch.ty;
                var cr = locTransformToBatch.a;
                var sr = locTransformToBatch.b;
                var cr2 = locTransformToBatch.d;
                var sr2 = -locTransformToBatch.c;
                var ax = x1 * cr - y1 * sr2 + x;
                var ay = x1 * sr + y1 * cr2 + y;
                var bx = x2 * cr - y1 * sr2 + x;
                var by = x2 * sr + y1 * cr2 + y;
                var cx = x2 * cr - y2 * sr2 + x;
                var cy = x2 * sr + y2 * cr2 + y;
                var dx = x1 * cr - y2 * sr2 + x;
                var dy = x1 * sr + y2 * cr2 + y;
                var locVertexZ = _t._vertexZ;
                if(!cc.SPRITEBATCHNODE_RENDER_SUBPIXEL) {
                    ax = 0 | ax;
                    ay = 0 | ay;
                    bx = 0 | bx;
                    by = 0 | by;
                    cx = 0 | cx;
                    cy = 0 | cy;
                    dx = 0 | dx;
                    dy = 0 | dy;
                }
                locQuad.bl.vertices = {x: ax, y: ay, z: locVertexZ};
                locQuad.br.vertices = {x: bx, y: by, z: locVertexZ};
                locQuad.tl.vertices = {x: dx, y: dy, z: locVertexZ};
                locQuad.tr.vertices = {x: cx, y: cy, z: locVertexZ};
            }
            _t.textureAtlas.updateQuad(locQuad, _t.atlasIndex);
            _t._recursiveDirty = false;
            _t.dirty = false;
        }
        if (_t._hasChildren)
            _t._arrayMakeObjectsPerformSelector(_t._children, cc.Node._StateCallbackType.updateTransform);
        if (cc.SPRITE_DEBUG_DRAW) {
            var vertices = [
                cc.p(_t._quad.bl.vertices.x, _t._quad.bl.vertices.y),
                cc.p(_t._quad.br.vertices.x, _t._quad.br.vertices.y),
                cc.p(_t._quad.tr.vertices.x, _t._quad.tr.vertices.y),
                cc.p(_t._quad.tl.vertices.x, _t._quad.tl.vertices.y)
            ];
            cc._drawingUtil.drawPoly(vertices, 4, true);
        }
    };
    _p.addChild = function (child, localZOrder, tag) {
        var _t = this;
        cc.assert(child, cc._LogInfos.Sprite_addChild_3);
        if (localZOrder == null)
            localZOrder = child._localZOrder;
        if (tag == null)
            tag = child.tag;
        if (_t._batchNode) {
            if(!(child instanceof cc.Sprite)){
                cc.log(cc._LogInfos.Sprite_addChild);
                return;
            }
            if(child.texture._webTextureObj !== _t.textureAtlas.texture._webTextureObj)
                cc.log(cc._LogInfos.Sprite_addChild_2);
            _t._batchNode.appendChild(child);
            if (!_t._reorderChildDirty)
                _t._setReorderChildDirtyRecursively();
        }
        cc.Node.prototype.addChild.call(_t, child, localZOrder, tag);
        _t._hasChildren = true;
    };
    _p.setOpacity = function (opacity) {
        cc.Node.prototype.setOpacity.call(this, opacity);
        this.updateColor();
    };
    _p.setColor = function (color3) {
        cc.Node.prototype.setColor.call(this, color3);
        this.updateColor();
    };
    _p.updateDisplayedColor = function (parentColor) {
        cc.Node.prototype.updateDisplayedColor.call(this, parentColor);
        this.updateColor();
    };
    _p.setSpriteFrame = function (newFrame) {
        var _t = this;
        if(cc.isString(newFrame)){
            newFrame = cc.spriteFrameCache.getSpriteFrame(newFrame);
            cc.assert(newFrame, cc._LogInfos.Sprite_setSpriteFrame);
        }
        _t.setNodeDirty(true);
        var frameOffset = newFrame.getOffset();
        _t._unflippedOffsetPositionFromCenter.x = frameOffset.x;
        _t._unflippedOffsetPositionFromCenter.y = frameOffset.y;
        var pNewTexture = newFrame.getTexture();
        var locTextureLoaded = newFrame.textureLoaded();
        if (!locTextureLoaded) {
            _t._textureLoaded = false;
            newFrame.addLoadedEventListener(function (sender) {
                _t._textureLoaded = true;
                var locNewTexture = sender.getTexture();
                if (locNewTexture != _t._texture)
                    _t.texture = locNewTexture;
                _t.setTextureRect(sender.getRect(), sender.isRotated(), sender.getOriginalSize());
                _t._callLoadedEventCallbacks();
            }, _t);
        }
        if (pNewTexture != _t._texture)
            _t.texture = pNewTexture;
        _t._rectRotated = newFrame.isRotated();
        _t.setTextureRect(newFrame.getRect(), _t._rectRotated, newFrame.getOriginalSize());
    };
    _p.isFrameDisplayed = function (frame) {
        return (cc.rectEqualToRect(frame.getRect(), this._rect) && frame.getTexture().getName() == this._texture.getName()
            && cc.pointEqualToPoint(frame.getOffset(), this._unflippedOffsetPositionFromCenter));
    };
    _p.setBatchNode = function (spriteBatchNode) {
        var _t = this;
        _t._batchNode = spriteBatchNode;
        if (!_t._batchNode) {
            _t.atlasIndex = cc.Sprite.INDEX_NOT_INITIALIZED;
            _t.textureAtlas = null;
            _t._recursiveDirty = false;
            _t.dirty = false;
            var x1 = _t._offsetPosition.x;
            var y1 = _t._offsetPosition.y;
            var x2 = x1 + _t._rect.width;
            var y2 = y1 + _t._rect.height;
            var locQuad = _t._quad;
            locQuad.bl.vertices = {x:x1, y:y1, z:0};
            locQuad.br.vertices = {x:x2, y:y1, z:0};
            locQuad.tl.vertices = {x:x1, y:y2, z:0};
            locQuad.tr.vertices = {x:x2, y:y2, z:0};
            _t._quadDirty = true;
        } else {
            _t._transformToBatch = cc.affineTransformIdentity();
            _t.textureAtlas = _t._batchNode.textureAtlas;
        }
    };
    _p.setTexture = function (texture) {
        var _t = this;
        if(texture && (cc.isString(texture))){
            texture = cc.textureCache.addImage(texture);
            _t.setTexture(texture);
            var size = texture.getContentSize();
            _t.setTextureRect(cc.rect(0,0, size.width, size.height));
            if(!texture._isLoaded){
                texture.addLoadedEventListener(function(){
                    var size = texture.getContentSize();
                    _t.setTextureRect(cc.rect(0,0, size.width, size.height));
                }, this);
            }
            return;
        }
        cc.assert(!texture || (texture instanceof cc.Texture2D), cc._LogInfos.Sprite_setTexture_2);
        if(_t._batchNode && _t._batchNode.texture != texture) {
            cc.log(cc._LogInfos.Sprite_setTexture);
            return;
        }
        if (texture)
            _t.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
        else
            _t.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_COLOR);
        if (!_t._batchNode && _t._texture != texture) {
            _t._texture = texture;
            _t._updateBlendFunc();
        }
    };
    _p.draw = function () {
        var _t = this;
        if (!_t._textureLoaded)
            return;
        var gl = cc._renderContext, locTexture = _t._texture;
        if (locTexture) {
            if (locTexture._isLoaded) {
                _t._shaderProgram.use();
                _t._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4();
                cc.glBlendFunc(_t._blendFunc.src, _t._blendFunc.dst);
                cc.glBindTexture2DN(0, locTexture);
                cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
                gl.bindBuffer(gl.ARRAY_BUFFER, _t._quadWebBuffer);
                if (_t._quadDirty) {
                    gl.bufferData(gl.ARRAY_BUFFER, _t._quad.arrayBuffer, gl.DYNAMIC_DRAW);
                    _t._quadDirty = false;
                }
                gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
                gl.vertexAttribPointer(1, 4, gl.UNSIGNED_BYTE, true, 24, 12);
                gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 24, 16);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }
        } else {
            _t._shaderProgram.use();
            _t._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4();
            cc.glBlendFunc(_t._blendFunc.src, _t._blendFunc.dst);
            cc.glBindTexture2D(null);
            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR);
            gl.bindBuffer(gl.ARRAY_BUFFER, _t._quadWebBuffer);
            if (_t._quadDirty) {
                cc._renderContext.bufferData(cc._renderContext.ARRAY_BUFFER, _t._quad.arrayBuffer, cc._renderContext.STATIC_DRAW);
                _t._quadDirty = false;
            }
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, 0);
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        cc.g_NumberOfDraws++;
        if (cc.SPRITE_DEBUG_DRAW === 0 && !_t._showNode)
            return;
        if (cc.SPRITE_DEBUG_DRAW === 1 || _t._showNode) {
            var locQuad = _t._quad;
            var verticesG1 = [
                cc.p(locQuad.tl.vertices.x, locQuad.tl.vertices.y),
                cc.p(locQuad.bl.vertices.x, locQuad.bl.vertices.y),
                cc.p(locQuad.br.vertices.x, locQuad.br.vertices.y),
                cc.p(locQuad.tr.vertices.x, locQuad.tr.vertices.y)
            ];
            cc._drawingUtil.drawPoly(verticesG1, 4, true);
        } else if (cc.SPRITE_DEBUG_DRAW === 2) {
            var drawRectG2 = _t.getTextureRect();
            var offsetPixG2 = _t.getOffsetPosition();
            var verticesG2 = [cc.p(offsetPixG2.x, offsetPixG2.y), cc.p(offsetPixG2.x + drawRectG2.width, offsetPixG2.y),
                cc.p(offsetPixG2.x + drawRectG2.width, offsetPixG2.y + drawRectG2.height), cc.p(offsetPixG2.x, offsetPixG2.y + drawRectG2.height)];
            cc._drawingUtil.drawPoly(verticesG2, 4, true);
        }
    };
    delete _p;
}
cc._tmp.WebGLLabelTTF = function () {
    var _p = cc.LabelTTF.prototype;
    _p.setColor = cc.Sprite.prototype.setColor;
    _p._transformForRenderer = function(){
        if (this._needUpdateTexture) {
            this._needUpdateTexture = false;
            this._updateTexture();
        }
        cc.Node.prototype._transformForRenderer.call(this);
    };
    _p._setColorsString = function () {
        this._needUpdateTexture = true;
        var locStrokeColor = this._strokeColor, locFontFillColor = this._textFillColor;
        this._shadowColorStr = "rgba(128,128,128," + this._shadowOpacity + ")";
        this._fillColorStr = "rgba(" + (0 | locFontFillColor.r) + "," + (0 | locFontFillColor.g) + "," + (0 | locFontFillColor.b) + ", 1)";
        this._strokeColorStr = "rgba(" + (0 | locStrokeColor.r) + "," + (0 | locStrokeColor.g) + "," + (0 | locStrokeColor.b) + ", 1)";
    };
    _p.updateDisplayedColor = cc.Sprite.prototype.updateDisplayedColor;
    _p.setOpacity = cc.Sprite.prototype.setOpacity;
    _p.updateDisplayedOpacity = cc.Sprite.prototype.updateDisplayedOpacity;
    _p.initWithStringAndTextDefinition = function (text, textDefinition) {
        if (!cc.Sprite.prototype.init.call(this))
            return false;
        this.shaderProgram = cc.shaderCache.programForKey(cc.LabelTTF._SHADER_PROGRAM);
        this._updateWithTextDefinition(textDefinition, false);
        this.string = text;
        return true;
    };
    _p.setFontFillColor = function (tintColor) {
        var locTextFillColor = this._textFillColor;
        if (locTextFillColor.r != tintColor.r || locTextFillColor.g != tintColor.g || locTextFillColor.b != tintColor.b) {
            locTextFillColor.r = tintColor.r;
            locTextFillColor.g = tintColor.g;
            locTextFillColor.b = tintColor.b;
            this._setColorsString();
            this._needUpdateTexture = true;
        }
    };
    _p.draw = function (ctx) {
        if (!this._string || this._string == "")
            return;
        var gl = ctx || cc._renderContext, locTexture = this._texture;
        if (locTexture && locTexture._isLoaded) {
            this._shaderProgram.use();
            this._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4();
            cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst);
            cc.glBindTexture2D(locTexture);
            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._quadWebBuffer);
            if (this._quadDirty) {
                gl.bufferData(gl.ARRAY_BUFFER, this._quad.arrayBuffer, gl.STATIC_DRAW);
                this._quadDirty = false;
            }
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, 0);
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 24, 16);
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        if (cc.SPRITE_DEBUG_DRAW === 1) {
            var locQuad = this._quad;
            var verticesG1 = [
                cc.p(locQuad.tl.vertices.x, locQuad.tl.vertices.y),
                cc.p(locQuad.bl.vertices.x, locQuad.bl.vertices.y),
                cc.p(locQuad.br.vertices.x, locQuad.br.vertices.y),
                cc.p(locQuad.tr.vertices.x, locQuad.tr.vertices.y)
            ];
            cc._drawingUtil.drawPoly(verticesG1, 4, true);
        } else if (cc.SPRITE_DEBUG_DRAW === 2) {
            var drawSizeG2 = this.getTextureRect();
            var offsetPixG2X = this.offsetX, offsetPixG2Y = this.offsetY;
            var verticesG2 = [cc.p(offsetPixG2X, offsetPixG2Y), cc.p(offsetPixG2X + drawSizeG2.width, offsetPixG2Y),
                cc.p(offsetPixG2X + drawSizeG2.width, offsetPixG2Y + drawSizeG2.height), cc.p(offsetPixG2X, offsetPixG2Y + drawSizeG2.height)];
            cc._drawingUtil.drawPoly(verticesG2, 4, true);
        }
        cc.g_NumberOfDraws++;
    };
    _p.setTextureRect = cc.Sprite.prototype.setTextureRect;
};
cc._tmp.DirectorWebGL = function () {
    cc.DirectorDelegate = cc.Class.extend({
        updateProjection: function () {
        }
    });
    var _p = cc.Director.prototype;
    _p.setProjection = function (projection) {
        var _t = this;
        var size = _t._winSizeInPoints;
        _t.setViewport();
        var view = _t._openGLView,
            ox = view._viewPortRect.x / view._scaleX,
            oy = view._viewPortRect.y / view._scaleY;
        switch (projection) {
            case cc.Director.PROJECTION_2D:
                cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
                cc.kmGLLoadIdentity();
                var orthoMatrix = new cc.kmMat4();
                cc.kmMat4OrthographicProjection(orthoMatrix, 0, size.width, 0, size.height, -1024, 1024);
                cc.kmGLMultMatrix(orthoMatrix);
                cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
                cc.kmGLLoadIdentity();
                break;
            case cc.Director.PROJECTION_3D:
                var zeye = _t.getZEye();
                var matrixPerspective = new cc.kmMat4(), matrixLookup = new cc.kmMat4();
                cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
                cc.kmGLLoadIdentity();
                cc.kmMat4PerspectiveProjection(matrixPerspective, 60, size.width / size.height, 0.1, zeye * 2);
                cc.kmGLMultMatrix(matrixPerspective);
                cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
                cc.kmGLLoadIdentity();
                var eye = cc.kmVec3Fill(null, -ox + size.width / 2, -oy + size.height / 2, zeye);
                var center = cc.kmVec3Fill(null, -ox + size.width / 2, -oy + size.height / 2, 0.0);
                var up = cc.kmVec3Fill(null, 0.0, 1.0, 0.0);
                cc.kmMat4LookAt(matrixLookup, eye, center, up);
                cc.kmGLMultMatrix(matrixLookup);
                break;
            case cc.Director.PROJECTION_CUSTOM:
                if (_t._projectionDelegate)
                    _t._projectionDelegate.updateProjection();
                break;
            default:
                cc.log(cc._LogInfos.Director_setProjection);
                break;
        }
        _t._projection = projection;
        cc.eventManager.dispatchEvent(_t._eventProjectionChanged);
        cc.setProjectionMatrixDirty();
    };
    _p.setDepthTest = function (on) {
        var loc_gl = cc._renderContext;
        if (on) {
            loc_gl.clearDepth(1.0);
            loc_gl.enable(loc_gl.DEPTH_TEST);
            loc_gl.depthFunc(loc_gl.LEQUAL);
        } else {
            loc_gl.disable(loc_gl.DEPTH_TEST);
        }
    };
    _p.setOpenGLView = function (openGLView) {
        var _t = this;
        _t._winSizeInPoints.width = cc._canvas.width;
        _t._winSizeInPoints.height = cc._canvas.height;
        _t._openGLView = openGLView || cc.view;
        var conf = cc.configuration;
        conf.gatherGPUInfo();
        conf.dumpInfo();
        _t._createStatsLabel();
        _t.setGLDefaultValues();
        if (cc.eventManager)
            cc.eventManager.setEnabled(true);
    };
    _p._clear = function () {
        var gl = cc._renderContext;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
    _p._beforeVisitScene = function () {
        cc.kmGLPushMatrix();
    };
    _p._afterVisitScene = function () {
        cc.kmGLPopMatrix();
    };
    _p._createStatsLabel = function () {
        var _t = this;
        if (!cc.LabelAtlas){
            _t._createStatsLabelForCanvas();
            return
        }
        if ((cc.Director._fpsImageLoaded == null) || (cc.Director._fpsImageLoaded == false))
            return;
        var texture = new cc.Texture2D();
        texture.initWithElement(cc.Director._fpsImage);
        texture.handleLoadedTexture();
        var factor = cc.view.getDesignResolutionSize().height / 320.0;
        if (factor === 0)
            factor = _t._winSizeInPoints.height / 320.0;
        var tmpLabel = new cc.LabelAtlas();
        tmpLabel._setIgnoreContentScaleFactor(true);
        tmpLabel.initWithString("00.0", texture, 12, 32, '.');
        tmpLabel.scale = factor;
        _t._FPSLabel = tmpLabel;
        tmpLabel = new cc.LabelAtlas();
        tmpLabel._setIgnoreContentScaleFactor(true);
        tmpLabel.initWithString("0.000", texture, 12, 32, '.');
        tmpLabel.scale = factor;
        _t._SPFLabel = tmpLabel;
        tmpLabel = new cc.LabelAtlas();
        tmpLabel._setIgnoreContentScaleFactor(true);
        tmpLabel.initWithString("000", texture, 12, 32, '.');
        tmpLabel.scale = factor;
        _t._drawsLabel = tmpLabel;
        var locStatsPosition = cc.DIRECTOR_STATS_POSITION;
        _t._drawsLabel.setPosition(locStatsPosition.x, 34 * factor + locStatsPosition.y);
        _t._SPFLabel.setPosition(locStatsPosition.x, 17 * factor + locStatsPosition.y);
        _t._FPSLabel.setPosition(locStatsPosition);
    };
    _p._createStatsLabelForCanvas = function () {
        var _t = this;
        var fontSize = 0;
        if (_t._winSizeInPoints.width > _t._winSizeInPoints.height)
            fontSize = 0 | (_t._winSizeInPoints.height / 320 * 24);
        else
            fontSize = 0 | (_t._winSizeInPoints.width / 320 * 24);
        _t._FPSLabel = cc.LabelTTF.create("000.0", "Arial", fontSize);
        _t._SPFLabel = cc.LabelTTF.create("0.000", "Arial", fontSize);
        _t._drawsLabel = cc.LabelTTF.create("0000", "Arial", fontSize);
        var locStatsPosition = cc.DIRECTOR_STATS_POSITION;
        _t._drawsLabel.setPosition(_t._drawsLabel.width / 2 + locStatsPosition.x, _t._drawsLabel.height * 5 / 2 + locStatsPosition.y);
        _t._SPFLabel.setPosition(_t._SPFLabel.width / 2 + locStatsPosition.x, _t._SPFLabel.height * 3 / 2 + locStatsPosition.y);
        _t._FPSLabel.setPosition(_t._FPSLabel.width / 2 + locStatsPosition.x, _t._FPSLabel.height / 2 + locStatsPosition.y);
    };
    _p.convertToGL = function (uiPoint) {
        var transform = new cc.kmMat4();
        cc.GLToClipTransform(transform);
        var transformInv = new cc.kmMat4();
        cc.kmMat4Inverse(transformInv, transform);
        var zClip = transform.mat[14] / transform.mat[15];
        var glSize = this._openGLView.getDesignResolutionSize();
        var clipCoord = new cc.kmVec3(2.0 * uiPoint.x / glSize.width - 1.0, 1.0 - 2.0 * uiPoint.y / glSize.height, zClip);
        var glCoord = new cc.kmVec3();
        cc.kmVec3TransformCoord(glCoord, clipCoord, transformInv);
        return cc.p(glCoord.x, glCoord.y);
    };
    _p.convertToUI = function (glPoint) {
        var transform = new cc.kmMat4();
        cc.GLToClipTransform(transform);
        var clipCoord = new cc.kmVec3();
        var glCoord = new cc.kmVec3(glPoint.x, glPoint.y, 0.0);
        cc.kmVec3TransformCoord(clipCoord, glCoord, transform);
        var glSize = this._openGLView.getDesignResolutionSize();
        return cc.p(glSize.width * (clipCoord.x * 0.5 + 0.5), glSize.height * (-clipCoord.y * 0.5 + 0.5));
    };
    _p.getVisibleSize = function () {
        return this._openGLView.getVisibleSize();
    };
    _p.getVisibleOrigin = function () {
        return this._openGLView.getVisibleOrigin();
    };
    _p.getZEye = function () {
        return (this._winSizeInPoints.height / 1.1566 );
    };
    _p.setViewport = function () {
        var view = this._openGLView;
        if (view) {
            var locWinSizeInPoints = this._winSizeInPoints;
            view.setViewPortInPoints(-view._viewPortRect.x/view._scaleX, -view._viewPortRect.y/view._scaleY, locWinSizeInPoints.width, locWinSizeInPoints.height);
        }
    };
    _p.getOpenGLView = function () {
        return this._openGLView;
    };
    _p.getProjection = function () {
        return this._projection;
    };
    _p.setAlphaBlending = function (on) {
        if (on)
            cc.glBlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        else
            cc.glBlendFunc(cc._renderContext.ONE, cc._renderContext.ZERO);
    };
    _p.setGLDefaultValues = function () {
        var _t = this;
        _t.setAlphaBlending(true);
        _t.setDepthTest(false);
        _t.setProjection(_t._projection);
        cc._renderContext.clearColor(0.0, 0.0, 0.0, 1.0);
    };
}
cc.configuration = {
	ERROR:0,
	STRING:1,
	INT:2,
	DOUBLE:3,
	BOOLEAN:4,
    _maxTextureSize:0,
    _maxModelviewStackDepth:0,
    _supportsPVRTC:false,
    _supportsNPOT:false,
    _supportsBGRA8888:false,
    _supportsDiscardFramebuffer:false,
    _supportsShareableVAO:false,
    _maxSamplesAllowed:0,
    _maxTextureUnits:0,
    _GlExtensions:"",
    _valueDict:{},
	_inited: false,
	_init:function () {
		var locValueDict = this._valueDict;
		locValueDict["cocos2d.x.version"] = cc.ENGINE_VERSION;
		locValueDict["cocos2d.x.compiled_with_profiler"] = false;
		locValueDict["cocos2d.x.compiled_with_gl_state_cache"] = cc.ENABLE_GL_STATE_CACHE;
		this._inited = true;
	},
    getMaxTextureSize:function () {
        return this._maxTextureSize;
    },
    getMaxModelviewStackDepth:function () {
        return this._maxModelviewStackDepth;
    },
    getMaxTextureUnits:function () {
        return this._maxTextureUnits;
    },
    supportsNPOT:function () {
        return this._supportsNPOT;
    },
    supportsPVRTC: function () {
        return this._supportsPVRTC;
    },
	supportsETC: function() {
		return false;
	},
	supportsS3TC: function() {
		return false;
	},
	supportsATITC: function() {
		return false;
	},
    supportsBGRA8888:function () {
        return this._supportsBGRA8888;
    },
    supportsDiscardFramebuffer:function () {
        return this._supportsDiscardFramebuffer;
    },
    supportsShareableVAO:function () {
        return this._supportsShareableVAO;
    },
    checkForGLExtension:function (searchName) {
        return this._GlExtensions.indexOf(searchName) > -1;
    },
    getValue: function(key, default_value){
	    if(!this._inited)
		    this._init();
        var locValueDict = this._valueDict;
        if(locValueDict[key])
            return locValueDict[key];
        return default_value;
    },
    setValue: function(key, value){
        this._valueDict[key] = value;
    },
    dumpInfo: function(){
         if(cc.ENABLE_GL_STATE_CACHE === 0){
             cc.log("");
             cc.log(cc._LogInfos.configuration_dumpInfo);
             cc.log("")
         }
    },
    gatherGPUInfo: function(){
        if(cc._renderType === cc._RENDER_TYPE_CANVAS)
            return;
	    if(!this._inited)
		    this._init();
        var gl = cc._renderContext;
        var locValueDict = this._valueDict;
        locValueDict["gl.vendor"] = gl.getParameter(gl.VENDOR);
        locValueDict["gl.renderer"] = gl.getParameter(gl.RENDERER);
        locValueDict["gl.version"] = gl.getParameter(gl.VERSION);
        this._GlExtensions = "";
        var extArr = gl.getSupportedExtensions();
        for (var i = 0; i < extArr.length; i++)
            this._GlExtensions += extArr[i] + " ";
        this._maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        locValueDict["gl.max_texture_size"] = this._maxTextureSize;
        this._maxTextureUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        locValueDict["gl.max_texture_units"] = this._maxTextureUnits;
        this._supportsPVRTC = this.checkForGLExtension("GL_IMG_texture_compression_pvrtc");
        locValueDict["gl.supports_PVRTC"] = this._supportsPVRTC;
        this._supportsNPOT = false;
        locValueDict["gl.supports_NPOT"] = this._supportsNPOT;
        this._supportsBGRA8888 = this.checkForGLExtension("GL_IMG_texture_format_BGRA888");
        locValueDict["gl.supports_BGRA8888"] = this._supportsBGRA8888;
        this._supportsDiscardFramebuffer = this.checkForGLExtension("GL_EXT_discard_framebuffer");
        locValueDict["gl.supports_discard_framebuffer"] = this._supportsDiscardFramebuffer;
        this._supportsShareableVAO = this.checkForGLExtension("vertex_array_object");
        locValueDict["gl.supports_vertex_array_object"] = this._supportsShareableVAO;
        cc.checkGLErrorDebug();
    },
    loadConfigFile: function( url){
	    if(!this._inited)
		    this._init();
        var dict = cc.loader.getRes(url);
        if(!dict) throw "Please load the resource first : " + url;
        cc.assert(dict, cc._LogInfos.configuration_loadConfigFile_2, url);
        var getDatas = dict["data"];
        if(!getDatas){
            cc.log(cc._LogInfos.configuration_loadConfigFile, url);
            return;
        }
        for(var selKey in getDatas)
            this._valueDict[selKey] = getDatas[selKey];
    }
};
if(cc._renderType === cc._RENDER_TYPE_WEBGL){
    cc.rendererWebGL = {
        childrenOrderDirty: true,
        _transformNodePool: [],
        _renderCmds: [],
        _isCacheToBufferOn: false,
        _cacheToBufferCmds: [],
        rendering: function (ctx) {
            var locCmds = this._renderCmds,
                i,
                len;
            var context = ctx || cc._renderContext;
            for (i = 0, len = locCmds.length; i < len; i++) {
                locCmds[i].rendering(context);
            }
        },
        _renderingToBuffer: function (ctx) {
            var locCmds = this._cacheToBufferCmds, i, len;
            ctx = ctx || cc._renderContext;
            for (i = 0, len = locCmds.length; i < len; i++) {
                locCmds[i].rendering(ctx);
            }
            locCmds.length = 0;
            this._isCacheToBufferOn = false;
        },
        resetFlag: function () {
            this.childrenOrderDirty = false;
            this._transformNodePool.length = 0;
        },
        transform: function () {
            var locPool = this._transformNodePool;
            locPool.sort(this._sortNodeByLevelAsc);
            for (var i = 0, len = locPool.length; i < len; i++) {
                if (locPool[i]._renderCmdDiry)
                    locPool[i]._transformForRenderer();
            }
            locPool.length = 0;
        },
        transformDirty: function () {
            return this._transformNodePool.length > 0;
        },
        _sortNodeByLevelAsc: function (n1, n2) {
            return n1._curLevel - n2._curLevel;
        },
        pushDirtyNode: function (node) {
            this._transformNodePool.push(node);
        },
        clearRenderCommands: function () {
            this._renderCmds.length = 0;
        },
        pushRenderCommand: function (cmd) {
            if (this._isCacheToBufferOn) {
                if (this._cacheToBufferCmds.indexOf(cmd) === -1)
                    this._cacheToBufferCmds.push(cmd);
            } else {
                if (this._renderCmds.indexOf(cmd) === -1)
                    this._renderCmds.push(cmd);
            }
        }
    };
    cc.renderer = cc.rendererWebGL;
    cc.TextureRenderCmdWebGL = function(node){
        this._node = node;
    };
    cc.TextureRenderCmdWebGL.prototype.rendering = function(ctx){
        var _t = this._node;
        if (!_t._textureLoaded)
            return;
        var gl = ctx || cc._renderContext, locTexture = _t._texture;
        if (locTexture) {
            if (locTexture._isLoaded) {
                _t._shaderProgram.use();
                _t._shaderProgram._setUniformForMVPMatrixWithMat4(_t._stackMatrix);
                cc.glBlendFunc(_t._blendFunc.src, _t._blendFunc.dst);
                cc.glBindTexture2DN(0, locTexture);
                cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
                gl.bindBuffer(gl.ARRAY_BUFFER, _t._quadWebBuffer);
                if (_t._quadDirty) {
                    gl.bufferData(gl.ARRAY_BUFFER, _t._quad.arrayBuffer, gl.DYNAMIC_DRAW);
                    _t._quadDirty = false;
                }
                gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
                gl.vertexAttribPointer(1, 4, gl.UNSIGNED_BYTE, true, 24, 12);
                gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 24, 16);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }
        } else {
            _t._shaderProgram.use();
            _t._shaderProgram._setUniformForMVPMatrixWithMat4(_t._stackMatrix);
            cc.glBlendFunc(_t._blendFunc.src, _t._blendFunc.dst);
            cc.glBindTexture2D(null);
            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR);
            gl.bindBuffer(gl.ARRAY_BUFFER, _t._quadWebBuffer);
            if (_t._quadDirty) {
                gl.bufferData(gl.ARRAY_BUFFER, _t._quad.arrayBuffer, gl.STATIC_DRAW);
                _t._quadDirty = false;
            }
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, 0);
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        cc.g_NumberOfDraws++;
    };
    cc.RectRenderCmdWebGL = function(node){
        this._node = node;
    };
    cc.RectRenderCmdWebGL.prototype.rendering = function(ctx){
        var context = ctx || cc._renderContext;
        var node = this._node;
        node._shaderProgram.use();
        node._shaderProgram._setUniformForMVPMatrixWithMat4(node._stackMatrix);
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR);
        context.bindBuffer(context.ARRAY_BUFFER, node._verticesFloat32Buffer);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, context.FLOAT, false, 0, 0);
        context.bindBuffer(context.ARRAY_BUFFER, node._colorsUint8Buffer);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, context.UNSIGNED_BYTE, true, 0, 0);
        cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
        context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
    };
    cc.DrawNodeRenderCmdWebGL = function (node) {
        this._node = node;
    };
    cc.DrawNodeRenderCmdWebGL.prototype.rendering = function(ctx){
        var _t = this._node;
        cc.glBlendFunc(_t._blendFunc.src, _t._blendFunc.dst);
        _t._shaderProgram.use();
        _t._shaderProgram._setUniformForMVPMatrixWithMat4(_t._stackMatrix);
        _t._render();
    };
    cc.MotionStreakCmdWebGL = function(node){
        this._node = node;
    };
    cc.MotionStreakCmdWebGL.prototype.rendering = function(ctx){
        var _t = this._node;
        if (_t._nuPoints <= 1)
            return;
        if(_t.texture && _t.texture.isLoaded()){
            ctx = ctx || cc._renderContext;
            _t._shaderProgram.use();
            _t._shaderProgram._setUniformForMVPMatrixWithMat4(_t._stackMatrix);
            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
            cc.glBlendFunc(_t._blendFunc.src, _t._blendFunc.dst);
            cc.glBindTexture2D(_t.texture);
            ctx.bindBuffer(ctx.ARRAY_BUFFER, _t._verticesBuffer);
            ctx.bufferData(ctx.ARRAY_BUFFER, _t._vertices, ctx.DYNAMIC_DRAW);
            ctx.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, ctx.FLOAT, false, 0, 0);
            ctx.bindBuffer(ctx.ARRAY_BUFFER, _t._texCoordsBuffer);
            ctx.bufferData(ctx.ARRAY_BUFFER, _t._texCoords, ctx.DYNAMIC_DRAW);
            ctx.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, ctx.FLOAT, false, 0, 0);
            ctx.bindBuffer(ctx.ARRAY_BUFFER, _t._colorPointerBuffer);
            ctx.bufferData(ctx.ARRAY_BUFFER, _t._colorPointer, ctx.DYNAMIC_DRAW);
            ctx.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, ctx.UNSIGNED_BYTE, true, 0, 0);
            ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, _t._nuPoints * 2);
            cc.g_NumberOfDraws ++;
        }
    };
    cc.ProgressRenderCmdWebGL = function (node) {
        this._node = node;
    };
    cc.ProgressRenderCmdWebGL.prototype.rendering = function(ctx){
        var _t = this._node;
        var context = ctx || cc._renderContext;
        if (!_t._vertexData || !_t._sprite)
            return;
        _t._shaderProgram.use();
        _t._shaderProgram._setUniformForMVPMatrixWithMat4(_t._stackMatrix);
        var blendFunc = _t._sprite.getBlendFunc();
        cc.glBlendFunc(blendFunc.src, blendFunc.dst);
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
        cc.glBindTexture2D(_t._sprite.texture);
        context.bindBuffer(context.ARRAY_BUFFER, _t._vertexWebGLBuffer);
        if(_t._vertexDataDirty){
            context.bufferData(context.ARRAY_BUFFER, _t._vertexArrayBuffer, context.DYNAMIC_DRAW);
            _t._vertexDataDirty = false;
        }
        var locVertexDataLen = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, context.FLOAT, false, locVertexDataLen, 0);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, context.UNSIGNED_BYTE, true, locVertexDataLen, 8);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, context.FLOAT, false, locVertexDataLen, 12);
        if (_t._type === cc.ProgressTimer.TYPE_RADIAL)
            context.drawArrays(context.TRIANGLE_FAN, 0, _t._vertexDataCount);
        else if (_t._type == cc.ProgressTimer.TYPE_BAR) {
            if (!_t._reverseDirection)
                context.drawArrays(context.TRIANGLE_STRIP, 0, _t._vertexDataCount);
            else {
                context.drawArrays(context.TRIANGLE_STRIP, 0, _t._vertexDataCount / 2);
                context.drawArrays(context.TRIANGLE_STRIP, 4, _t._vertexDataCount / 2);
                cc.g_NumberOfDraws++;
            }
        }
        cc.g_NumberOfDraws++;
    };
    cc.ParticleRenderCmdWebGL = function(node){
        this._node = node;
    };
    cc.ParticleRenderCmdWebGL.prototype.rendering = function(ctx){
        var _t = this._node;
        if(!_t._texture)
            return;
        var gl = ctx || cc._renderContext;
        _t._shaderProgram.use();
        _t._shaderProgram._setUniformForMVPMatrixWithMat4(_t._stackMatrix);//setUniformForModelViewAndProjectionMatrixWithMat4();
        cc.glBindTexture2D(_t._texture);
        cc.glBlendFuncForParticle(_t._blendFunc.src, _t._blendFunc.dst);
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
        gl.bindBuffer(gl.ARRAY_BUFFER, _t._buffersVBO[0]);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 24, 16);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _t._buffersVBO[1]);
        gl.drawElements(gl.TRIANGLES, _t._particleIdx * 6, gl.UNSIGNED_SHORT, 0);
    };
    cc.ParticleBatchNodeRenderCmdWebGL = function(node){
        this._node = node;
    };
    cc.ParticleBatchNodeRenderCmdWebGL.prototype.rendering = function(ctx){
        var _t = this._node;
        if (_t.textureAtlas.totalQuads == 0)
            return;
        _t._shaderProgram.use();
        _t._shaderProgram._setUniformForMVPMatrixWithMat4(_t._stackMatrix);
        cc.glBlendFuncForParticle(_t._blendFunc.src, _t._blendFunc.dst);
        _t.textureAtlas.drawQuads();
    };
    cc.RenderTextureRenderCmdWebGL = function(node){
        this._node = node;
    };
    cc.RenderTextureRenderCmdWebGL.prototype.rendering = function(ctx){
        var gl = ctx || cc._renderContext;
        var node = this._node;
        if (node.autoDraw) {
            node.begin();
            var locClearFlags = node.clearFlags;
            if (locClearFlags) {
                var oldClearColor = [0.0, 0.0, 0.0, 0.0];
                var oldDepthClearValue = 0.0;
                var oldStencilClearValue = 0;
                if (locClearFlags & gl.COLOR_BUFFER_BIT) {
                    oldClearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);
                    gl.clearColor(node._clearColor.r/255, node._clearColor.g/255, node._clearColor.b/255, node._clearColor.a/255);
                }
                if (locClearFlags & gl.DEPTH_BUFFER_BIT) {
                    oldDepthClearValue = gl.getParameter(gl.DEPTH_CLEAR_VALUE);
                    gl.clearDepth(node.clearDepthVal);
                }
                if (locClearFlags & gl.STENCIL_BUFFER_BIT) {
                    oldStencilClearValue = gl.getParameter(gl.STENCIL_CLEAR_VALUE);
                    gl.clearStencil(node.clearStencilVal);
                }
                gl.clear(locClearFlags);
                if (locClearFlags & gl.COLOR_BUFFER_BIT)
                    gl.clearColor(oldClearColor[0], oldClearColor[1], oldClearColor[2], oldClearColor[3]);
                if (locClearFlags & gl.DEPTH_BUFFER_BIT)
                    gl.clearDepth(oldDepthClearValue);
                if (locClearFlags & gl.STENCIL_BUFFER_BIT)
                    gl.clearStencil(oldStencilClearValue);
            }
            node.sortAllChildren();
            var locChildren = node._children;
            for (var i = 0; i < locChildren.length; i++) {
                var getChild = locChildren[i];
                if (getChild != node.sprite)
                    getChild.visit();
            }
            node.end();
        }
    };
    cc.SpriteBatchNodeRenderCmdWebGL = function(node){
        this._node = node;
    };
    cc.SpriteBatchNodeRenderCmdWebGL.prototype.rendering = function(ctx){
        var node = this._node;
        if (node.textureAtlas.totalQuads === 0)
            return;
        node._shaderProgram.use();
        node._shaderProgram._setUniformForMVPMatrixWithMat4(node._stackMatrix);
        node._arrayMakeObjectsPerformSelector(node._children, cc.Node._StateCallbackType.updateTransform);
        cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
        node.textureAtlas.drawQuads();
    };
    cc.AtlasNodeRenderCmdWebGL = function(node){
        this._node = node;
    };
    cc.AtlasNodeRenderCmdWebGL.prototype.rendering = function(ctx){
        var context = ctx || cc._renderContext, node = this._node;
        node._shaderProgram.use();
        node._shaderProgram._setUniformForMVPMatrixWithMat4(node._stackMatrix);
        cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
        if(node._uniformColor && node._colorF32Array){
            context.uniform4fv(node._uniformColor, node._colorF32Array);
            node.textureAtlas.drawNumberOfQuads(node.quadsToDraw, 0);
        }
    };
    cc.CustomRenderCmdWebGL = function(node, func){
        this._node = node;
        this._callback = func;
    };
    cc.CustomRenderCmdWebGL.prototype.rendering = function(ctx){
        if(!this._callback)
            return;
        this._callback.call(this._node, ctx);
    };
    cc.TMXLayerRenderCmdWebGL = function(node){
        this._node = node;
    };
    cc.TMXLayerRenderCmdWebGL.prototype.rendering = cc.SpriteBatchNodeRenderCmdWebGL.prototype.rendering;
    cc.PhysicsDebugNodeRenderCmdWebGL = function(node){
        this._node = node;
    };
    cc.PhysicsDebugNodeRenderCmdWebGL.prototype.rendering = function(ctx){
        var node = this._node;
        if (!node._space)
            return;
        node._space.eachShape(cc.DrawShape.bind(node));
        node._space.eachConstraint(cc.DrawConstraint.bind(node));
        cc.DrawNode.prototype.draw.call(node);
        node.clear();
    };
    cc.SkeletonRenderCmdWebGL = function(node){
        this._node = node;
    };
    cc.SkeletonRenderCmdWebGL.prototype.rendering = function(ctx){
        var node = this._node;
        node._shaderProgram.use();
        node._shaderProgram._setUniformForMVPMatrixWithMat4(node._stackMatrix);
        var color = node.getColor(), locSkeleton = node._skeleton;
        locSkeleton.r = color.r / 255;
        locSkeleton.g = color.g / 255;
        locSkeleton.b = color.b / 255;
        locSkeleton.a = node.getOpacity() / 255;
        if (node._premultipliedAlpha) {
            locSkeleton.r *= locSkeleton.a;
            locSkeleton.g *= locSkeleton.a;
            locSkeleton.b *= locSkeleton.a;
        }
        var additive,textureAtlas,attachment,slot, i, n,
            quad = new cc.V3F_C4B_T2F_Quad();
        var locBlendFunc = node._blendFunc;
        for (i = 0, n = locSkeleton.slots.length; i < n; i++) {
            slot = locSkeleton.drawOrder[i];
            if (!slot.attachment || slot.attachment.type != sp.ATTACHMENT_TYPE.REGION)
                continue;
            attachment = slot.attachment;
            var regionTextureAtlas = node.getTextureAtlas(attachment);
            if (slot.data.additiveBlending != additive) {
                if (textureAtlas) {
                    textureAtlas.drawQuads();
                    textureAtlas.removeAllQuads();
                }
                additive = !additive;
                cc.glBlendFunc(locBlendFunc.src, additive ? cc.ONE : locBlendFunc.dst);
            } else if (regionTextureAtlas != textureAtlas && textureAtlas) {
                textureAtlas.drawQuads();
                textureAtlas.removeAllQuads();
            }
            textureAtlas = regionTextureAtlas;
            var quadCount = textureAtlas.getTotalQuads();
            if (textureAtlas.getCapacity() == quadCount) {
                textureAtlas.drawQuads();
                textureAtlas.removeAllQuads();
                if (!textureAtlas.resizeCapacity(textureAtlas.getCapacity() * 2))
                    return;
            }
            sp._regionAttachment_updateQuad(attachment, slot, quad, node._premultipliedAlpha);
            textureAtlas.updateQuad(quad, quadCount);
        }
        if (textureAtlas) {
            textureAtlas.drawQuads();
            textureAtlas.removeAllQuads();
        }
        if(node._debugBones || node._debugSlots){
            cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
            cc.current_stack.stack.push(cc.current_stack.top);
            cc.current_stack.top = node._stackMatrix;
            var drawingUtil = cc._drawingUtil;
            if (node._debugSlots) {
                drawingUtil.setDrawColor(0, 0, 255, 255);
                drawingUtil.setLineWidth(1);
                for (i = 0, n = locSkeleton.slots.length; i < n; i++) {
                    slot = locSkeleton.drawOrder[i];
                    if (!slot.attachment || slot.attachment.type != sp.ATTACHMENT_TYPE.REGION)
                        continue;
                    attachment = slot.attachment;
                    quad = new cc.V3F_C4B_T2F_Quad();
                    sp._regionAttachment_updateQuad(attachment, slot, quad);
                    var points = [];
                    points.push(cc.p(quad.bl.vertices.x, quad.bl.vertices.y));
                    points.push(cc.p(quad.br.vertices.x, quad.br.vertices.y));
                    points.push(cc.p(quad.tr.vertices.x, quad.tr.vertices.y));
                    points.push(cc.p(quad.tl.vertices.x, quad.tl.vertices.y));
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
                    drawingUtil.drawLine(cc.p(bone.worldX, bone.worldY), cc.p(x, y));
                }
                drawingUtil.setPointSize(4);
                drawingUtil.setDrawColor(0, 0, 255, 255);
                for (i = 0, n = locSkeleton.bones.length; i < n; i++) {
                    bone = locSkeleton.bones[i];
                    drawingUtil.drawPoint(cc.p(bone.worldX, bone.worldY));
                    if (i == 0) {
                        drawingUtil.setDrawColor(0, 255, 0, 255);
                    }
                }
            }
            cc.kmGLPopMatrix();
        }
    };
    cc.ArmatureRenderCmdWebGL = function(node){
        this._node = node;
    };
    cc.ArmatureRenderCmdWebGL.prototype.rendering = function(ctx){
        var _t = this._node;
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.kmGLPushMatrix();
        cc.kmGLLoadMatrix(_t._stackMatrix);
        if (_t._parentBone == null && _t._batchNode == null) {
        }
        var locChildren = _t._children;
        var alphaPremultiplied = cc.BlendFunc.ALPHA_PREMULTIPLIED, alphaNonPremultipled = cc.BlendFunc.ALPHA_NON_PREMULTIPLIED;
        for (var i = 0, len = locChildren.length; i< len; i++) {
            var selBone = locChildren[i];
            if (selBone && selBone.getDisplayRenderNode) {
                var node = selBone.getDisplayRenderNode();
                if (null == node)
                    continue;
                node.setShaderProgram(_t._shaderProgram);
                switch (selBone.getDisplayRenderNodeType()) {
                    case ccs.DISPLAY_TYPE_SPRITE:
                        if(node instanceof ccs.Skin){
                            node.updateTransform();
                            var func = selBone.getBlendFunc();
                            if (func.src != alphaPremultiplied.src || func.dst != alphaPremultiplied.dst)
                                node.setBlendFunc(selBone.getBlendFunc());
                            else {
                                if ((_t._blendFunc.src == alphaPremultiplied.src && _t._blendFunc.dst == alphaPremultiplied.dst)
                                    && !node.getTexture().hasPremultipliedAlpha())
                                    node.setBlendFunc(alphaNonPremultipled);
                                else
                                    node.setBlendFunc(_t._blendFunc);
                            }
                            node.draw(ctx);
                        }
                        break;
                    case ccs.DISPLAY_TYPE_ARMATURE:
                        node.draw(ctx);
                        break;
                    default:
                        node.visit(ctx);
                        break;
                }
            } else if(selBone instanceof cc.Node) {
                selBone.setShaderProgram(_t._shaderProgram);
                selBone.visit(ctx);
            }
        }
        cc.kmGLPopMatrix();
    };
}

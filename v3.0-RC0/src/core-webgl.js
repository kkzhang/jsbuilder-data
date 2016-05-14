var cc = cc || {};
cc._tmp = cc._tmp || {};
cc._tmp.WebGLColor = function () {
    cc.color = function (a, c, b, d, e, f) {
        return void 0 === a ? new cc.Color(0, 0, 0, 255, e, f) : "string" === typeof a ? (a = cc.hexToColor(a), new cc.Color(a.r, a.g, a.b, a.a)) : "object" === typeof a ? new cc.Color(a.r, a.g, a.b, a.a, a.arrayBuffer, a.offset) : new cc.Color(a, c, b, d, e, f)
    };
    cc.Color = function (a, c, b, d, e, f) {
        this._arrayBuffer = e || new ArrayBuffer(cc.Color.BYTES_PER_ELEMENT);
        this._offset = f || 0;
        e = this._arrayBuffer;
        f = this._offset;
        var k = Uint8Array.BYTES_PER_ELEMENT;
        this._rU8 = new Uint8Array(e, f, 1);
        this._gU8 =
            new Uint8Array(e, f + k, 1);
        this._bU8 = new Uint8Array(e, f + 2 * k, 1);
        this._aU8 = new Uint8Array(e, f + 3 * k, 1);
        this._rU8[0] = a || 0;
        this._gU8[0] = c || 0;
        this._bU8[0] = b || 0;
        this._aU8[0] = d || 255;
        void 0 === d && (this.a_undefined = !0)
    };
    cc.Color.BYTES_PER_ELEMENT = 4;
    var b = cc.Color.prototype;
    b._getR = function () {
        return this._rU8[0]
    };
    b._setR = function (a) {
        this._rU8[0] = 0 > a ? 0 : a
    };
    b._getG = function () {
        return this._gU8[0]
    };
    b._setG = function (a) {
        this._gU8[0] = 0 > a ? 0 : a
    };
    b._getB = function () {
        return this._bU8[0]
    };
    b._setB = function (a) {
        this._bU8[0] = 0 > a ? 0 :
            a
    };
    b._getA = function () {
        return this._aU8[0]
    };
    b._setA = function (a) {
        this._aU8[0] = 0 > a ? 0 : a
    };
    cc.defineGetterSetter(b, "r", b._getR, b._setR);
    cc.defineGetterSetter(b, "g", b._getG, b._setG);
    cc.defineGetterSetter(b, "b", b._getB, b._setB);
    cc.defineGetterSetter(b, "a", b._getA, b._setA);
    cc.Vertex2F = function (a, c, b, d) {
        this._arrayBuffer = b || new ArrayBuffer(cc.Vertex2F.BYTES_PER_ELEMENT);
        this._offset = d || 0;
        this._xF32 = new Float32Array(this._arrayBuffer, this._offset, 1);
        this._yF32 = new Float32Array(this._arrayBuffer, this._offset +
            4, 1);
        this._xF32[0] = a || 0;
        this._yF32[0] = c || 0
    };
    cc.Vertex2F.BYTES_PER_ELEMENT = 8;
    Object.defineProperties(cc.Vertex2F.prototype, {x: {get: function () {
        return this._xF32[0]
    }, set: function (a) {
        this._xF32[0] = a
    }, enumerable: !0}, y: {get: function () {
        return this._yF32[0]
    }, set: function (a) {
        this._yF32[0] = a
    }, enumerable: !0}});
    cc.Vertex3F = function (a, c, b, d, e) {
        this._arrayBuffer = d || new ArrayBuffer(cc.Vertex3F.BYTES_PER_ELEMENT);
        this._offset = e || 0;
        d = this._arrayBuffer;
        e = this._offset;
        this._xF32 = new Float32Array(d, e, 1);
        this._xF32[0] =
            a || 0;
        this._yF32 = new Float32Array(d, e + Float32Array.BYTES_PER_ELEMENT, 1);
        this._yF32[0] = c || 0;
        this._zF32 = new Float32Array(d, e + 2 * Float32Array.BYTES_PER_ELEMENT, 1);
        this._zF32[0] = b || 0
    };
    cc.Vertex3F.BYTES_PER_ELEMENT = 12;
    Object.defineProperties(cc.Vertex3F.prototype, {x: {get: function () {
        return this._xF32[0]
    }, set: function (a) {
        this._xF32[0] = a
    }, enumerable: !0}, y: {get: function () {
        return this._yF32[0]
    }, set: function (a) {
        this._yF32[0] = a
    }, enumerable: !0}, z: {get: function () {
        return this._zF32[0]
    }, set: function (a) {
        this._zF32[0] =
            a
    }, enumerable: !0}});
    cc.Tex2F = function (a, c, b, d) {
        this._arrayBuffer = b || new ArrayBuffer(cc.Tex2F.BYTES_PER_ELEMENT);
        this._offset = d || 0;
        this._uF32 = new Float32Array(this._arrayBuffer, this._offset, 1);
        this._vF32 = new Float32Array(this._arrayBuffer, this._offset + 4, 1);
        this._uF32[0] = a || 0;
        this._vF32[0] = c || 0
    };
    cc.Tex2F.BYTES_PER_ELEMENT = 8;
    Object.defineProperties(cc.Tex2F.prototype, {u: {get: function () {
        return this._uF32[0]
    }, set: function (a) {
        this._uF32[0] = a
    }, enumerable: !0}, v: {get: function () {
        return this._vF32[0]
    }, set: function (a) {
        this._vF32[0] =
            a
    }, enumerable: !0}});
    cc.Quad2 = function (a, c, b, d, e, f) {
        this._arrayBuffer = e || new ArrayBuffer(cc.Quad2.BYTES_PER_ELEMENT);
        this._offset = f || 0;
        e = this._arrayBuffer;
        f = cc.Vertex2F.BYTES_PER_ELEMENT;
        this._tl = a ? new cc.Vertex2F(a.x, a.y, e, 0) : new cc.Vertex2F(0, 0, e, 0);
        this._tr = c ? new cc.Vertex2F(c.x, c.y, e, f) : new cc.Vertex2F(0, 0, e, f);
        this._bl = b ? new cc.Vertex2F(b.x, b.y, e, 2 * f) : new cc.Vertex2F(0, 0, e, 2 * f);
        this._br = d ? new cc.Vertex2F(d.x, d.y, e, 3 * f) : new cc.Vertex2F(0, 0, e, 3 * f)
    };
    cc.Quad2.BYTES_PER_ELEMENT = 32;
    cc.Quad3 = function (a, c, b, d) {
        this.bl = a || new cc.Vertex3F(0, 0, 0);
        this.br = c || new cc.Vertex3F(0, 0, 0);
        this.tl = b || new cc.Vertex3F(0, 0, 0);
        this.tr = d || new cc.Vertex3F(0, 0, 0)
    };
    Object.defineProperties(cc.Quad2.prototype, {tl: {get: function () {
        return this._tl
    }, set: function (a) {
        this._tl.x = a.x;
        this._tl.y = a.y
    }, enumerable: !0}, tr: {get: function () {
        return this._tr
    }, set: function (a) {
        this._tr.x = a.x;
        this._tr.y = a.y
    }, enumerable: !0}, bl: {get: function () {
        return this._bl
    }, set: function (a) {
        this._bl.x = a.x;
        this._bl.y = a.y
    }, enumerable: !0}, br: {get: function () {
        return this._br
    },
        set: function (a) {
            this._br.x = a.x;
            this._br.y = a.y
        }, enumerable: !0}});
    cc.V3F_C4B_T2F = function (a, c, b, d, e) {
        this._arrayBuffer = d || new ArrayBuffer(cc.V3F_C4B_T2F.BYTES_PER_ELEMENT);
        this._offset = e || 0;
        d = this._arrayBuffer;
        e = this._offset;
        var f = cc.Vertex3F.BYTES_PER_ELEMENT;
        this._vertices = a ? new cc.Vertex3F(a.x, a.y, a.z, d, e) : new cc.Vertex3F(0, 0, 0, d, e);
        this._colors = c ? cc.color(c.r, c.g, c.b, c.a, d, e + f) : cc.color(0, 0, 0, 0, d, e + f);
        this._texCoords = b ? new cc.Tex2F(b.u, b.v, d, e + f + cc.Color.BYTES_PER_ELEMENT) : new cc.Tex2F(0, 0, d, e +
            f + cc.Color.BYTES_PER_ELEMENT)
    };
    cc.V3F_C4B_T2F.BYTES_PER_ELEMENT = 24;
    Object.defineProperties(cc.V3F_C4B_T2F.prototype, {vertices: {get: function () {
        return this._vertices
    }, set: function (a) {
        var c = this._vertices;
        c.x = a.x;
        c.y = a.y;
        c.z = a.z
    }, enumerable: !0}, colors: {get: function () {
        return this._colors
    }, set: function (a) {
        var c = this._colors;
        c.r = a.r;
        c.g = a.g;
        c.b = a.b;
        c.a = a.a
    }, enumerable: !0}, texCoords: {get: function () {
        return this._texCoords
    }, set: function (a) {
        this._texCoords.u = a.u;
        this._texCoords.v = a.v
    }, enumerable: !0}});
    cc.V3F_C4B_T2F_Quad =
        function (a, c, b, d, e, f) {
            this._arrayBuffer = e || new ArrayBuffer(cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT);
            this._offset = f || 0;
            e = this._arrayBuffer;
            f = this._offset;
            var k = cc.V3F_C4B_T2F.BYTES_PER_ELEMENT;
            this._tl = a ? new cc.V3F_C4B_T2F(a.vertices, a.colors, a.texCoords, e, f) : new cc.V3F_C4B_T2F(null, null, null, e, f);
            this._bl = c ? new cc.V3F_C4B_T2F(c.vertices, c.colors, c.texCoords, e, f + k) : new cc.V3F_C4B_T2F(null, null, null, e, f + k);
            this._tr = b ? new cc.V3F_C4B_T2F(b.vertices, b.colors, b.texCoords, e, f + 2 * k) : new cc.V3F_C4B_T2F(null,
                null, null, e, f + 2 * k);
            this._br = d ? new cc.V3F_C4B_T2F(d.vertices, d.colors, d.texCoords, e, f + 3 * k) : new cc.V3F_C4B_T2F(null, null, null, e, f + 3 * k)
        };
    cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT = 96;
    Object.defineProperties(cc.V3F_C4B_T2F_Quad.prototype, {tl: {get: function () {
        return this._tl
    }, set: function (a) {
        var c = this._tl;
        c.vertices = a.vertices;
        c.colors = a.colors;
        c.texCoords = a.texCoords
    }, enumerable: !0}, bl: {get: function () {
        return this._bl
    }, set: function (a) {
        var c = this._bl;
        c.vertices = a.vertices;
        c.colors = a.colors;
        c.texCoords = a.texCoords
    },
        enumerable: !0}, tr: {get: function () {
        return this._tr
    }, set: function (a) {
        var c = this._tr;
        c.vertices = a.vertices;
        c.colors = a.colors;
        c.texCoords = a.texCoords
    }, enumerable: !0}, br: {get: function () {
        return this._br
    }, set: function (a) {
        var c = this._br;
        c.vertices = a.vertices;
        c.colors = a.colors;
        c.texCoords = a.texCoords
    }, enumerable: !0}, arrayBuffer: {get: function () {
        return this._arrayBuffer
    }, enumerable: !0}});
    cc.V3F_C4B_T2F_QuadZero = function () {
        return new cc.V3F_C4B_T2F_Quad
    };
    cc.V3F_C4B_T2F_QuadCopy = function (a) {
        if (!a)return cc.V3F_C4B_T2F_QuadZero();
        var c = a.tl, b = a.bl, d = a.tr;
        a = a.br;
        return{tl: {vertices: {x: c.vertices.x, y: c.vertices.y, z: c.vertices.z}, colors: {r: c.colors.r, g: c.colors.g, b: c.colors.b, a: c.colors.a}, texCoords: {u: c.texCoords.u, v: c.texCoords.v}}, bl: {vertices: {x: b.vertices.x, y: b.vertices.y, z: b.vertices.z}, colors: {r: b.colors.r, g: b.colors.g, b: b.colors.b, a: b.colors.a}, texCoords: {u: b.texCoords.u, v: b.texCoords.v}}, tr: {vertices: {x: d.vertices.x, y: d.vertices.y, z: d.vertices.z}, colors: {r: d.colors.r, g: d.colors.g, b: d.colors.b, a: d.colors.a}, texCoords: {u: d.texCoords.u,
            v: d.texCoords.v}}, br: {vertices: {x: a.vertices.x, y: a.vertices.y, z: a.vertices.z}, colors: {r: a.colors.r, g: a.colors.g, b: a.colors.b, a: a.colors.a}, texCoords: {u: a.texCoords.u, v: a.texCoords.v}}}
    };
    cc.V3F_C4B_T2F_QuadsCopy = function (a) {
        if (!a)return[];
        for (var c = [], b = 0; b < a.length; b++)c.push(cc.V3F_C4B_T2F_QuadCopy(a[b]));
        return c
    };
    cc.V2F_C4B_T2F = function (a, c, b, d, e) {
        this._arrayBuffer = d || new ArrayBuffer(cc.V2F_C4B_T2F.BYTES_PER_ELEMENT);
        this._offset = e || 0;
        d = this._arrayBuffer;
        e = this._offset;
        var f = cc.Vertex2F.BYTES_PER_ELEMENT;
        this._vertices = a ? new cc.Vertex2F(a.x, a.y, d, e) : new cc.Vertex2F(0, 0, d, e);
        this._colors = c ? cc.color(c.r, c.g, c.b, c.a, d, e + f) : cc.color(0, 0, 0, 0, d, e + f);
        this._texCoords = b ? new cc.Tex2F(b.u, b.v, d, e + f + cc.Color.BYTES_PER_ELEMENT) : new cc.Tex2F(0, 0, d, e + f + cc.Color.BYTES_PER_ELEMENT)
    };
    cc.V2F_C4B_T2F.BYTES_PER_ELEMENT = 20;
    Object.defineProperties(cc.V2F_C4B_T2F.prototype, {vertices: {get: function () {
        return this._vertices
    }, set: function (a) {
        this._vertices.x = a.x;
        this._vertices.y = a.y
    }, enumerable: !0}, colors: {get: function () {
        return this._colors
    },
        set: function (a) {
            var c = this._colors;
            c.r = a.r;
            c.g = a.g;
            c.b = a.b;
            c.a = a.a
        }, enumerable: !0}, texCoords: {get: function () {
        return this._texCoords
    }, set: function (a) {
        this._texCoords.u = a.u;
        this._texCoords.v = a.v
    }, enumerable: !0}});
    cc.V2F_C4B_T2F_Triangle = function (a, c, b, d, e) {
        this._arrayBuffer = d || new ArrayBuffer(cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT);
        this._offset = e || 0;
        d = this._arrayBuffer;
        e = this._offset;
        var f = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;
        this._a = a ? new cc.V2F_C4B_T2F(a.vertices, a.colors, a.texCoords, d, e) : new cc.V2F_C4B_T2F(null,
            null, null, d, e);
        this._b = c ? new cc.V2F_C4B_T2F(c.vertices, c.colors, c.texCoords, d, e + f) : new cc.V2F_C4B_T2F(null, null, null, d, e + f);
        this._c = b ? new cc.V2F_C4B_T2F(b.vertices, b.colors, b.texCoords, d, e + 2 * f) : new cc.V2F_C4B_T2F(null, null, null, d, e + 2 * f)
    };
    cc.V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT = 60;
    Object.defineProperties(cc.V2F_C4B_T2F_Triangle.prototype, {a: {get: function () {
        return this._a
    }, set: function (a) {
        var c = this._a;
        c.vertices = a.vertices;
        c.colors = a.colors;
        c.texCoords = a.texCoords
    }, enumerable: !0}, b: {get: function () {
        return this._b
    },
        set: function (a) {
            var c = this._b;
            c.vertices = a.vertices;
            c.colors = a.colors;
            c.texCoords = a.texCoords
        }, enumerable: !0}, c: {get: function () {
        return this._c
    }, set: function (a) {
        var c = this._c;
        c.vertices = a.vertices;
        c.colors = a.colors;
        c.texCoords = a.texCoords
    }, enumerable: !0}})
};
cc._tmp.WebGLCCNode = function () {
    var b = cc.Node.prototype;
    b._transform4x4 = null;
    b._stackMatrix = null;
    b._glServerState = null;
    b._camera = null;
    b.ctor = function () {
        this._initNode();
        var a = new cc.kmMat4;
        a.mat[2] = a.mat[3] = a.mat[6] = a.mat[7] = a.mat[8] = a.mat[9] = a.mat[11] = a.mat[14] = 0;
        a.mat[10] = a.mat[15] = 1;
        this._transform4x4 = a;
        this._glServerState = 0;
        this._stackMatrix = new cc.kmMat4
    };
    b.setNodeDirty = function () {
        !1 === this._transformDirty && (this._transformDirty = this._inverseDirty = !0)
    };
    b.visit = function () {
        if (this._visible) {
            var a =
                cc._renderContext, c, b = cc.current_stack;
            b.stack.push(b.top);
            cc.kmMat4Assign(this._stackMatrix, b.top);
            b.top = this._stackMatrix;
            var d = this.grid;
            d && d._active && d.beforeDraw();
            this.transform();
            var e = this._children;
            if (e && 0 < e.length) {
                var f = e.length;
                this.sortAllChildren();
                for (c = 0; c < f; c++)if (e[c] && 0 > e[c]._localZOrder)e[c].visit(); else break;
                for (this.draw(a); c < f; c++)e[c] && e[c].visit()
            } else this.draw(a);
            this.arrivalOrder = 0;
            d && d._active && d.afterDraw(this);
            b.top = b.stack.pop()
        }
    };
    b.transform = function () {
        var a = this._transform4x4,
            c = cc.current_stack.top, b = this.nodeToParentTransform(), d = a.mat;
        d[0] = b.a;
        d[4] = b.c;
        d[12] = b.tx;
        d[1] = b.b;
        d[5] = b.d;
        d[13] = b.ty;
        d[14] = this._vertexZ;
        cc.kmMat4Multiply(c, c, a);
        null != this._camera && !(null != this.grid && this.grid.isActive()) && (a = this._anchorPointInPoints.x, c = this._anchorPointInPoints.y, 0 !== a || 0 !== c ? (cc.SPRITEBATCHNODE_RENDER_SUBPIXEL || (a |= 0, c |= 0), cc.kmGLTranslatef(a, c, 0), this._camera.locate(), cc.kmGLTranslatef(-a, -c, 0)) : this._camera.locate())
    };
    b.nodeToParentTransform = b._nodeToParentTransformForWebGL
};
cc._tmp.WebGLTexture2D = function () {
    cc.Texture2D = cc.Class.extend({_pVRHaveAlphaPremultiplied: !0, _pixelFormat: null, _pixelsWide: 0, _pixelsHigh: 0, _name: "", _contentSize: null, maxS: 0, maxT: 0, _hasPremultipliedAlpha: !1, _hasMipmaps: !1, shaderProgram: null, _isLoaded: !1, _htmlElementObj: null, _webTextureObj: null, url: null, _loadedEventListeners: null, ctor: function () {
        this._contentSize = cc.size(0, 0);
        this._pixelFormat = cc.Texture2D.defaultPixelFormat
    }, releaseTexture: function () {
        this._webTextureObj && cc._renderContext.deleteTexture(this._webTextureObj);
        cc.loader.release(this.url)
    }, getPixelFormat: function () {
        return this._pixelFormat
    }, getPixelsWide: function () {
        return this._pixelsWide
    }, getPixelsHigh: function () {
        return this._pixelsHigh
    }, getName: function () {
        return this._webTextureObj
    }, getContentSize: function () {
        return cc.size(this._contentSize.width / cc.contentScaleFactor(), this._contentSize.height / cc.contentScaleFactor())
    }, _getWidth: function () {
        return this._contentSize.width / cc.contentScaleFactor()
    }, _getHeight: function () {
        return this._contentSize.height / cc.contentScaleFactor()
    },
        getContentSizeInPixels: function () {
            return this._contentSize
        }, getMaxS: function () {
            return this.maxS
        }, setMaxS: function (b) {
            this.maxS = b
        }, getMaxT: function () {
            return this.maxT
        }, setMaxT: function (b) {
            this.maxT = b
        }, getShaderProgram: function () {
            return this.shaderProgram
        }, setShaderProgram: function (b) {
            this.shaderProgram = b
        }, hasPremultipliedAlpha: function () {
            return this._hasPremultipliedAlpha
        }, hasMipmaps: function () {
            return this._hasMipmaps
        }, description: function () {
            return"\x3ccc.Texture2D | Name \x3d " + this._name + " | Dimensions \x3d " +
                this._pixelsWide + " x " + this._pixelsHigh + " | Coordinates \x3d (" + this.maxS + ", " + this.maxT + ")\x3e"
        }, releaseData: function (b) {
        }, keepData: function (b, a) {
            return b
        }, initWithData: function (b, a, c, g, d) {
            var e = cc.Texture2D, f = cc._renderContext, k = f.RGBA, l = f.UNSIGNED_BYTE, h = c * cc.Texture2D._B[a] / 8;
            0 === h % 8 ? f.pixelStorei(f.UNPACK_ALIGNMENT, 8) : 0 === h % 4 ? f.pixelStorei(f.UNPACK_ALIGNMENT, 4) : 0 === h % 2 ? f.pixelStorei(f.UNPACK_ALIGNMENT, 2) : f.pixelStorei(f.UNPACK_ALIGNMENT, 1);
            this._webTextureObj = f.createTexture();
            cc.glBindTexture2D(this);
            f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MIN_FILTER, f.LINEAR);
            f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MAG_FILTER, f.LINEAR);
            f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_S, f.CLAMP_TO_EDGE);
            f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_T, f.CLAMP_TO_EDGE);
            switch (a) {
                case e.PIXEL_FORMAT_RGBA8888:
                    k = f.RGBA;
                    break;
                case e.PIXEL_FORMAT_RGB888:
                    k = f.RGB;
                    break;
                case e.PIXEL_FORMAT_RGBA4444:
                    l = f.UNSIGNED_SHORT_4_4_4_4;
                    break;
                case e.PIXEL_FORMAT_RGB5A1:
                    l = f.UNSIGNED_SHORT_5_5_5_1;
                    break;
                case e.PIXEL_FORMAT_RGB565:
                    l = f.UNSIGNED_SHORT_5_6_5;
                    break;
                case e.PIXEL_FORMAT_AI88:
                    k = f.LUMINANCE_ALPHA;
                    break;
                case e.PIXEL_FORMAT_A8:
                    k = f.ALPHA;
                    break;
                case e.PIXEL_FORMAT_I8:
                    k = f.LUMINANCE;
                    break;
                default:
                    cc.assert(0, cc._LogInfos.Texture2D_initWithData)
            }
            f.texImage2D(f.TEXTURE_2D, 0, k, c, g, 0, k, l, b);
            this._contentSize.width = d.width;
            this._contentSize.height = d.height;
            this._pixelsWide = c;
            this._pixelsHigh = g;
            this._pixelFormat = a;
            this.maxS = d.width / c;
            this.maxT = d.height / g;
            this._hasMipmaps = this._hasPremultipliedAlpha = !1;
            this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURE);
            return this._isLoaded = !0
        }, drawAtPoint: function (b) {
            var a = [0, this.maxT, this.maxS, this.maxT, 0, 0, this.maxS, 0], c = this._pixelsWide * this.maxS, g = this._pixelsHigh * this.maxT;
            b = [b.x, b.y, 0, c + b.x, b.y, 0, b.x, g + b.y, 0, c + b.x, g + b.y, 0];
            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_TEX_COORDS);
            this._shaderProgram.use();
            this._shaderProgram.setUniformsForBuiltins();
            cc.glBindTexture2D(this);
            c = cc._renderContext;
            c.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, c.FLOAT, !1, 0, b);
            c.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS,
                2, c.FLOAT, !1, 0, a);
            c.drawArrays(c.TRIANGLE_STRIP, 0, 4)
        }, drawInRect: function (b) {
            var a = [0, this.maxT, this.maxS, this.maxT, 0, 0, this.maxS, 0];
            b = [b.x, b.y, b.x + b.width, b.y, b.x, b.y + b.height, b.x + b.width, b.y + b.height];
            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_TEX_COORDS);
            this._shaderProgram.use();
            this._shaderProgram.setUniformsForBuiltins();
            cc.glBindTexture2D(this);
            var c = cc._renderContext;
            c.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, c.FLOAT, !1, 0, b);
            c.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS,
                2, c.FLOAT, !1, 0, a);
            c.drawArrays(c.TRIANGLE_STRIP, 0, 4)
        }, initWithImage: function (b) {
            if (null == b)return cc.log(cc._LogInfos.Texture2D_initWithImage), !1;
            var a = b.getWidth(), c = b.getHeight(), g = cc.configuration.getMaxTextureSize();
            if (a > g || c > g)return cc.log(cc._LogInfos.Texture2D_initWithImage_2, a, c, g, g), !1;
            this._isLoaded = !0;
            return this._initPremultipliedATextureWithImage(b, a, c)
        }, initWithElement: function (b) {
            b && (this._webTextureObj = cc._renderContext.createTexture(), this._htmlElementObj = b)
        }, getHtmlElementObj: function () {
            return this._htmlElementObj
        },
        isLoaded: function () {
            return this._isLoaded
        }, handleLoadedTexture: function () {
            if (cc._rendererInitialized) {
                if (!this._htmlElementObj) {
                    var b = cc.loader.getRes(this.url);
                    if (!b)return;
                    this.initWithElement(b)
                }
                this._htmlElementObj.width && this._htmlElementObj.height && (this._isLoaded = !0, b = cc._renderContext, cc.glBindTexture2D(this), b.pixelStorei(b.UNPACK_ALIGNMENT, 4), b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, b.RGBA, b.UNSIGNED_BYTE, this._htmlElementObj), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.LINEAR), b.texParameteri(b.TEXTURE_2D,
                    b.TEXTURE_MAG_FILTER, b.LINEAR), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE), this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURE), cc.glBindTexture2D(null), b = this._htmlElementObj.height, this._pixelsWide = this._contentSize.width = this._htmlElementObj.width, this._pixelsHigh = this._contentSize.height = b, this._pixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA8888, this.maxT = this.maxS = 1, this._hasMipmaps = this._hasPremultipliedAlpha = !1, this._callLoadedEventCallbacks())
            }
        }, initWithString: function (b, a, c, g, d, e) {
            cc.log(cc._LogInfos.Texture2D_initWithString);
            return null
        }, initWithETCFile: function (b) {
            cc.log(cc._LogInfos.Texture2D_initWithETCFile_2);
            return!1
        }, initWithPVRFile: function (b) {
            cc.log(cc._LogInfos.Texture2D_initWithPVRFile_2);
            return!1
        }, initWithPVRTCData: function (b, a, c, g, d, e) {
            cc.log(cc._LogInfos.Texture2D_initWithPVRTCData_2);
            return!1
        }, setTexParameters: function (b) {
            var a = cc._renderContext;
            cc.assert(this._pixelsWide == cc.NextPOT(this._pixelsWide) &&
                this._pixelsHigh == cc.NextPOT(this._pixelsHigh) || b.wrapS == a.CLAMP_TO_EDGE && b.wrapT == a.CLAMP_TO_EDGE, "WebGLRenderingContext.CLAMP_TO_EDGE should be used in NPOT textures");
            cc.glBindTexture2D(this);
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, b.minFilter);
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, b.magFilter);
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, b.wrapS);
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, b.wrapT)
        }, setAntiAliasTexParameters: function () {
            var b = cc._renderContext;
            cc.glBindTexture2D(this);
            this._hasMipmaps ? b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.LINEAR_MIPMAP_NEAREST) : b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.LINEAR);
            b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST)
        }, setAliasTexParameters: function () {
            var b = cc._renderContext;
            cc.glBindTexture2D(this);
            this._hasMipmaps ? b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST_MIPMAP_NEAREST) : b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST);
            b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST)
        },
        generateMipmap: function () {
            cc.assert(this._pixelsWide == cc.NextPOT(this._pixelsWide) && this._pixelsHigh == cc.NextPOT(this._pixelsHigh), "Mimpap texture only works in POT textures");
            cc.glBindTexture2D(this);
            cc._renderContext.generateMipmap(cc._renderContext.TEXTURE_2D);
            this._hasMipmaps = !0
        }, stringForFormat: function () {
            return cc.Texture2D._M[this._pixelFormat]
        }, bitsPerPixelForFormat: function (b) {
            b = b || this._pixelFormat;
            var a = cc.Texture2D._B[b];
            if (null != a)return a;
            cc.log(cc._LogInfos.Texture2D_bitsPerPixelForFormat,
                b);
            return-1
        }, _initPremultipliedATextureWithImage: function (b, a, c) {
            var g = cc.Texture2D, d = b.getData(), e = null, e = null, f = b.hasAlpha(), k = cc.size(b.getWidth(), b.getHeight()), l = g.defaultPixelFormat, h = b.getBitsPerComponent();
            f || (8 <= h ? l = g.PIXEL_FORMAT_RGB888 : (cc.log(cc._LogInfos.Texture2D__initPremultipliedATextureWithImage), l = g.PIXEL_FORMAT_RGB565));
            var m = a * c;
            if (l == g.PIXEL_FORMAT_RGB565)if (f) {
                d = new Uint16Array(a * c);
                e = b.getData();
                for (h = 0; h < m; ++h)d[h] = (e[h] >> 0 & 255) >> 3 << 11 | (e[h] >> 8 & 255) >> 2 << 5 | (e[h] >> 16 & 255) >> 3 <<
                    0
            } else {
                d = new Uint16Array(a * c);
                e = b.getData();
                for (h = 0; h < m; ++h)d[h] = (e[h] & 255) >> 3 << 11 | (e[h] & 255) >> 2 << 5 | (e[h] & 255) >> 3 << 0
            } else if (l == g.PIXEL_FORMAT_RGBA4444) {
                d = new Uint16Array(a * c);
                e = b.getData();
                for (h = 0; h < m; ++h)d[h] = (e[h] >> 0 & 255) >> 4 << 12 | (e[h] >> 8 & 255) >> 4 << 8 | (e[h] >> 16 & 255) >> 4 << 4 | (e[h] >> 24 & 255) >> 4 << 0
            } else if (l == g.PIXEL_FORMAT_RGB5A1) {
                d = new Uint16Array(a * c);
                e = b.getData();
                for (h = 0; h < m; ++h)d[h] = (e[h] >> 0 & 255) >> 3 << 11 | (e[h] >> 8 & 255) >> 3 << 6 | (e[h] >> 16 & 255) >> 3 << 1 | (e[h] >> 24 & 255) >> 7 << 0
            } else if (l == g.PIXEL_FORMAT_A8) {
                d =
                    new Uint8Array(a * c);
                e = b.getData();
                for (h = 0; h < m; ++h)d[h] = e >> 24 & 255
            }
            if (f && l == g.PIXEL_FORMAT_RGB888) {
                e = b.getData();
                d = new Uint8Array(3 * a * c);
                for (h = 0; h < m; ++h)d[3 * h] = e >> 0 & 255, d[3 * h + 1] = e >> 8 & 255, d[3 * h + 2] = e >> 16 & 255
            }
            this.initWithData(d, l, a, c, k);
            b.getData();
            this._hasPremultipliedAlpha = b.isPremultipliedAlpha();
            return!0
        }, addLoadedEventListener: function (b, a) {
            this._loadedEventListeners || (this._loadedEventListeners = []);
            this._loadedEventListeners.push({eventCallback: b, eventTarget: a})
        }, removeLoadedEventListener: function (b) {
            if (this._loadedEventListeners)for (var a =
                this._loadedEventListeners, c = 0; c < a.length; c++)a[c].eventTarget == b && a.splice(c, 1)
        }, _callLoadedEventCallbacks: function () {
            if (this._loadedEventListeners) {
                for (var b = this._loadedEventListeners, a = 0, c = b.length; a < c; a++) {
                    var g = b[a];
                    g.eventCallback.call(g.eventTarget, this)
                }
                b.length = 0
            }
        }})
};
cc._tmp.WebGLTextureAtlas = function () {
    var b = cc.TextureAtlas.prototype;
    b._setupVBO = function () {
        var a = cc._renderContext;
        this._buffersVBO[0] = a.createBuffer();
        this._buffersVBO[1] = a.createBuffer();
        this._quadsWebBuffer = a.createBuffer();
        this._mapBuffers()
    };
    b._mapBuffers = function () {
        var a = cc._renderContext;
        a.bindBuffer(a.ARRAY_BUFFER, this._quadsWebBuffer);
        a.bufferData(a.ARRAY_BUFFER, this._quadsArrayBuffer, a.DYNAMIC_DRAW);
        a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this._buffersVBO[1]);
        a.bufferData(a.ELEMENT_ARRAY_BUFFER,
            this._indices, a.STATIC_DRAW)
    };
    b.drawNumberOfQuads = function (a, c) {
        c = c || 0;
        if (!(0 === a || !this.texture || !this.texture.isLoaded())) {
            var b = cc._renderContext;
            cc.glBindTexture2D(this.texture);
            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
            b.bindBuffer(b.ARRAY_BUFFER, this._quadsWebBuffer);
            this.dirty && b.bufferData(b.ARRAY_BUFFER, this._quadsArrayBuffer, b.DYNAMIC_DRAW);
            b.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, b.FLOAT, !1, 24, 0);
            b.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, b.UNSIGNED_BYTE,
                !0, 24, 12);
            b.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, b.FLOAT, !1, 24, 16);
            this.dirty && (this.dirty = !1);
            b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this._buffersVBO[1]);
            cc.TEXTURE_ATLAS_USE_TRIANGLE_STRIP ? b.drawElements(b.TRIANGLE_STRIP, 6 * a, b.UNSIGNED_SHORT, 6 * c * this._indices.BYTES_PER_ELEMENT) : b.drawElements(b.TRIANGLES, 6 * a, b.UNSIGNED_SHORT, 6 * c * this._indices.BYTES_PER_ELEMENT);
            cc.g_NumberOfDraws++
        }
    }
};
cc._tmp.WebGLTextureCache = function () {
    var b = cc.textureCache;
    b.handleLoadedTexture = function (a) {
        var c = this._textures;
        cc._rendererInitialized || (c = this._loadedTexturesBefore);
        var b = c[a];
        b || (b = c[a] = new cc.Texture2D, b.url = a);
        b.handleLoadedTexture()
    };
    b.addImage = function (a, c, b) {
        cc.assert(a, cc._LogInfos.Texture2D_addImage_2);
        var d = this._textures;
        cc._rendererInitialized || (d = this._loadedTexturesBefore);
        var e = d[a] || d[cc.loader._aliases[a]];
        if (e)return c && c.call(b), e;
        cc.loader.getRes(a) || (cc.loader._checkIsImageURL(a) ?
            cc.loader.load(a, function (a) {
                c && c.call(b)
            }) : cc.loader.cache[a] = cc.loader.loadImg(a, function (b, d) {
            if (b)return c ? c(b) : b;
            cc.textureCache.handleLoadedTexture(a);
            c && c(null, d)
        }));
        e = d[a] = new cc.Texture2D;
        e.url = a;
        return e
    };
    delete b
};
cc._tmp.LayerDefineForWebGL = function () {
    var b = cc.Layer.prototype;
    b.bake = function () {
    };
    b.unbake = function () {
    };
    b.visit = cc.Node.prototype.visit
};
cc._tmp.WebGLLayerColor = function () {
    var b = cc.LayerColor.prototype;
    b._squareVertices = null;
    b._squareColors = null;
    b._verticesFloat32Buffer = null;
    b._colorsUint8Buffer = null;
    b._squareVerticesAB = null;
    b._squareColorsAB = null;
    b.ctor = function (a, c, b) {
        this._squareVerticesAB = new ArrayBuffer(32);
        this._squareColorsAB = new ArrayBuffer(16);
        var d = this._squareVerticesAB, e = this._squareColorsAB, f = cc.Vertex2F.BYTES_PER_ELEMENT, k = cc.Color.BYTES_PER_ELEMENT;
        this._squareVertices = [new cc.Vertex2F(0, 0, d, 0), new cc.Vertex2F(0, 0, d,
            f), new cc.Vertex2F(0, 0, d, 2 * f), new cc.Vertex2F(0, 0, d, 3 * f)];
        this._squareColors = [cc.color(0, 0, 0, 255, e, 0), cc.color(0, 0, 0, 255, e, k), cc.color(0, 0, 0, 255, e, 2 * k), cc.color(0, 0, 0, 255, e, 3 * k)];
        this._verticesFloat32Buffer = cc._renderContext.createBuffer();
        this._colorsUint8Buffer = cc._renderContext.createBuffer();
        cc.LayerRGBA.prototype.ctor.call(this);
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        cc.LayerColor.prototype.init.call(this, a, c, b)
    };
    b.setContentSize = function (a, c) {
        var b = this._squareVertices;
        void 0 === c ? (b[1].x = a.width, b[2].y = a.height, b[3].x = a.width, b[3].y = a.height) : (b[1].x = a, b[2].y = c, b[3].x = a, b[3].y = c);
        this._bindLayerVerticesBufferData();
        cc.Layer.prototype.setContentSize.call(this, a, c)
    };
    b._setWidth = function (a) {
        var c = this._squareVertices;
        c[1].x = a;
        c[3].x = a;
        this._bindLayerVerticesBufferData();
        cc.Layer.prototype._setWidth.call(this, a)
    };
    b._setHeight = function (a) {
        var c = this._squareVertices;
        c[2].y = a;
        c[3].y = a;
        this._bindLayerVerticesBufferData();
        cc.Layer.prototype._setHeight.call(this, a)
    };
    b._updateColor =
        function () {
            for (var a = this._displayedColor, c = this._displayedOpacity, b = this._squareColors, d = 0; 4 > d; d++)b[d].r = a.r, b[d].g = a.g, b[d].b = a.b, b[d].a = c;
            this._bindLayerColorsBufferData()
        };
    b.draw = function (a) {
        a = a || cc._renderContext;
        cc.nodeDrawSetup(this);
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR);
        a.bindBuffer(a.ARRAY_BUFFER, this._verticesFloat32Buffer);
        a.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, a.FLOAT, !1, 0, 0);
        a.bindBuffer(a.ARRAY_BUFFER, this._colorsUint8Buffer);
        a.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, a.UNSIGNED_BYTE, !0, 0, 0);
        cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst);
        a.drawArrays(a.TRIANGLE_STRIP, 0, 4)
    };
    b._bindLayerVerticesBufferData = function () {
        var a = cc._renderContext;
        a.bindBuffer(a.ARRAY_BUFFER, this._verticesFloat32Buffer);
        a.bufferData(a.ARRAY_BUFFER, this._squareVerticesAB, a.STATIC_DRAW)
    };
    b._bindLayerColorsBufferData = function () {
        var a = cc._renderContext;
        a.bindBuffer(a.ARRAY_BUFFER, this._colorsUint8Buffer);
        a.bufferData(a.ARRAY_BUFFER, this._squareColorsAB,
            a.STATIC_DRAW)
    }
};
cc._tmp.WebGLLayerGradient = function () {
    var b = cc.LayerGradient.prototype;
    b.draw = cc.LayerColor.prototype.draw;
    b._updateColor = function () {
        var a = this._alongVector, c = cc.pLength(a);
        if (0 !== c) {
            var b = Math.sqrt(2), a = cc.p(a.x / c, a.y / c);
            this._compressedInterpolation && (c = 1 / (Math.abs(a.x) + Math.abs(a.y)), a = cc.pMult(a, c * b));
            var d = this._displayedOpacity / 255, c = this._displayedColor, e = this._endColor, c = {r: c.r, g: c.g, b: c.b, a: this._startOpacity * d}, d = {r: e.r, g: e.g, b: e.b, a: this._endOpacity * d}, f = this._squareColors, e = f[0], k = f[1],
                l = f[2], f = f[3];
            e.r = d.r + (c.r - d.r) * ((b + a.x + a.y) / (2 * b));
            e.g = d.g + (c.g - d.g) * ((b + a.x + a.y) / (2 * b));
            e.b = d.b + (c.b - d.b) * ((b + a.x + a.y) / (2 * b));
            e.a = d.a + (c.a - d.a) * ((b + a.x + a.y) / (2 * b));
            k.r = d.r + (c.r - d.r) * ((b - a.x + a.y) / (2 * b));
            k.g = d.g + (c.g - d.g) * ((b - a.x + a.y) / (2 * b));
            k.b = d.b + (c.b - d.b) * ((b - a.x + a.y) / (2 * b));
            k.a = d.a + (c.a - d.a) * ((b - a.x + a.y) / (2 * b));
            l.r = d.r + (c.r - d.r) * ((b + a.x - a.y) / (2 * b));
            l.g = d.g + (c.g - d.g) * ((b + a.x - a.y) / (2 * b));
            l.b = d.b + (c.b - d.b) * ((b + a.x - a.y) / (2 * b));
            l.a = d.a + (c.a - d.a) * ((b + a.x - a.y) / (2 * b));
            f.r = d.r + (c.r - d.r) * ((b - a.x - a.y) /
                (2 * b));
            f.g = d.g + (c.g - d.g) * ((b - a.x - a.y) / (2 * b));
            f.b = d.b + (c.b - d.b) * ((b - a.x - a.y) / (2 * b));
            f.a = d.a + (c.a - d.a) * ((b - a.x - a.y) / (2 * b));
            this._bindLayerColorsBufferData()
        }
    }
};
cc._tmp.WebGLSprite = function () {
    var b = cc.Sprite.prototype;
    b._spriteFrameLoadedCallback = function (a) {
        this.setNodeDirty(!0);
        this.setTextureRect(a.getRect(), a.isRotated(), a.getOriginalSize());
        this._callLoadedEventCallbacks()
    };
    b.setOpacityModifyRGB = function (a) {
        this._opacityModifyRGB !== a && (this._opacityModifyRGB = a, this.updateColor())
    };
    b.updateDisplayedOpacity = function (a) {
        cc.NodeRGBA.prototype.updateDisplayedOpacity.call(this, a);
        this.updateColor()
    };
    b.ctor = function (a, b, g) {
        cc.NodeRGBA.prototype.ctor.call(this);
        this._shouldBeHidden = !1;
        this._offsetPosition = cc.p(0, 0);
        this._unflippedOffsetPositionFromCenter = cc.p(0, 0);
        this._blendFunc = {src: cc.BLEND_SRC, dst: cc.BLEND_DST};
        this._rect = cc.rect(0, 0, 0, 0);
        this._quad = new cc.V3F_C4B_T2F_Quad;
        this._quadWebBuffer = cc._renderContext.createBuffer();
        this._textureLoaded = this._quadDirty = !0;
        this._softInit(a, b, g)
    };
    b.setBlendFunc = function (a, b) {
        var g = this._blendFunc;
        void 0 === b ? (g.src = a.src, g.dst = a.dst) : (g.src = a, g.dst = b)
    };
    b.init = function () {
        if (0 < arguments.length)return this.initWithFile(arguments[0],
            arguments[1]);
        cc.NodeRGBA.prototype.init.call(this);
        this.dirty = this._recursiveDirty = !1;
        this._opacityModifyRGB = !0;
        this._blendFunc.src = cc.BLEND_SRC;
        this._blendFunc.dst = cc.BLEND_DST;
        this.texture = null;
        this._textureLoaded = !0;
        this._flippedX = this._flippedY = !1;
        this.anchorY = this.anchorX = 0.5;
        this._offsetPosition.x = 0;
        this._offsetPosition.y = 0;
        this._hasChildren = !1;
        var a = {r: 255, g: 255, b: 255, a: 255};
        this._quad.bl.colors = a;
        this._quad.br.colors = a;
        this._quad.tl.colors = a;
        this._quad.tr.colors = a;
        this._quadDirty = !0;
        this.setTextureRect(cc.rect(0,
            0, 0, 0), !1, cc.size(0, 0));
        return!0
    };
    b.initWithTexture = function (a, b, g) {
        cc.assert(0 != arguments.length, cc._LogInfos.Sprite_initWithTexture);
        g = g || !1;
        if (!cc.NodeRGBA.prototype.init.call(this))return!1;
        this._batchNode = null;
        this.dirty = this._recursiveDirty = !1;
        this._opacityModifyRGB = !0;
        this._blendFunc.src = cc.BLEND_SRC;
        this._blendFunc.dst = cc.BLEND_DST;
        this._flippedX = this._flippedY = !1;
        this.anchorY = this.anchorX = 0.5;
        this._offsetPosition.x = 0;
        this._offsetPosition.y = 0;
        this._hasChildren = !1;
        var d = cc.color(255, 255, 255,
            255), e = this._quad;
        e.bl.colors = d;
        e.br.colors = d;
        e.tl.colors = d;
        e.tr.colors = d;
        this._textureLoaded = d = a.isLoaded();
        if (!d)return this._rectRotated = g || !1, b && (d = this._rect, d.x = b.x, d.y = b.y, d.width = b.width, d.height = b.height), a.addLoadedEventListener(this._textureLoadedCallback, this), !0;
        b || (b = cc.rect(0, 0, a.width, a.height));
        a && (g ? (d = b.x + b.height, e = b.y + b.width) : (d = b.x + b.width, e = b.y + b.height), d > a.width && cc.error(cc._LogInfos.RectWidth, a.url), e > a.height && cc.error(cc._LogInfos.RectHeight, a.url));
        this.texture = a;
        this.setTextureRect(b,
            g);
        this.batchNode = null;
        return this._quadDirty = !0
    };
    b._textureLoadedCallback = function (a) {
        if (!this._textureLoaded) {
            this._textureLoaded = !0;
            var b = this._rect;
            b ? cc._rectEqualToZero(b) && (b.width = a.width, b.height = a.height) : b = cc.rect(0, 0, a.width, a.height);
            this.texture = a;
            this.setTextureRect(b, this._rectRotated);
            this.batchNode = this._batchNode;
            this._quadDirty = !0;
            this._callLoadedEventCallbacks()
        }
    };
    b.setTextureRect = function (a, b, g) {
        this._rectRotated = b || !1;
        this.setContentSize(g || a);
        this.setVertexRect(a);
        this._setTextureCoords(a);
        a = this._unflippedOffsetPositionFromCenter;
        this._flippedX && (a.x = -a.x);
        this._flippedY && (a.y = -a.y);
        var d = this._rect;
        this._offsetPosition.x = a.x + (this._contentSize.width - d.width) / 2;
        this._offsetPosition.y = a.y + (this._contentSize.height - d.height) / 2;
        if (this._batchNode)this.dirty = !0; else {
            a = 0 + this._offsetPosition.x;
            b = 0 + this._offsetPosition.y;
            g = a + d.width;
            var d = b + d.height, e = this._quad;
            e.bl.vertices = {x: a, y: b, z: 0};
            e.br.vertices = {x: g, y: b, z: 0};
            e.tl.vertices = {x: a, y: d, z: 0};
            e.tr.vertices = {x: g, y: d, z: 0};
            this._quadDirty = !0
        }
    };
    b.updateTransform = function () {
        if (this.dirty) {
            var a = this._quad, b = this._parent;
            if (!this._visible || b && b != this._batchNode && b._shouldBeHidden)a.br.vertices = {x: 0, y: 0, z: 0}, a.tl.vertices = {x: 0, y: 0, z: 0}, a.tr.vertices = {x: 0, y: 0, z: 0}, a.bl.vertices = {x: 0, y: 0, z: 0}, this._shouldBeHidden = !0; else {
                this._shouldBeHidden = !1;
                var g = this._transformToBatch = !b || b == this._batchNode ? this.nodeToParentTransform() : cc.AffineTransformConcat(this.nodeToParentTransform(), b._transformToBatch), d = this._rect, b = this._offsetPosition.x, e =
                    this._offsetPosition.y, f = b + d.width, k = e + d.height, l = g.tx, h = g.ty, m = g.a, n = g.b, p = g.d, q = -g.c, g = b * m - e * q + l, d = b * n + e * p + h, r = f * m - e * q + l, e = f * n + e * p + h, s = f * m - k * q + l, f = f * n + k * p + h, l = b * m - k * q + l, b = b * n + k * p + h, k = this._vertexZ;
                cc.SPRITEBATCHNODE_RENDER_SUBPIXEL || (g |= 0, d |= 0, r |= 0, e |= 0, s |= 0, f |= 0, l |= 0, b |= 0);
                a.bl.vertices = {x: g, y: d, z: k};
                a.br.vertices = {x: r, y: e, z: k};
                a.tl.vertices = {x: l, y: b, z: k};
                a.tr.vertices = {x: s, y: f, z: k}
            }
            this.textureAtlas.updateQuad(a, this.atlasIndex);
            this.dirty = this._recursiveDirty = !1
        }
        this._hasChildren && this._arrayMakeObjectsPerformSelector(this._children,
            cc.Node.StateCallbackType.updateTransform);
        cc.SPRITE_DEBUG_DRAW && (a = [cc.p(this._quad.bl.vertices.x, this._quad.bl.vertices.y), cc.p(this._quad.br.vertices.x, this._quad.br.vertices.y), cc.p(this._quad.tr.vertices.x, this._quad.tr.vertices.y), cc.p(this._quad.tl.vertices.x, this._quad.tl.vertices.y)], cc._drawingUtil.drawPoly(a, 4, !0))
    };
    b.addChild = function (a, b, g) {
        cc.assert(a, cc._LogInfos.Sprite_addChild_3);
        null == b && (b = a._localZOrder);
        null == g && (g = a.tag);
        if (this._batchNode) {
            if (!(a instanceof cc.Sprite)) {
                cc.log(cc._LogInfos.Sprite_addChild);
                return
            }
            a.texture._webTextureObj !== this.textureAtlas.texture._webTextureObj && cc.log(cc._LogInfos.Sprite_addChild_2);
            this._batchNode.appendChild(a);
            this._reorderChildDirty || this._setReorderChildDirtyRecursively()
        }
        cc.NodeRGBA.prototype.addChild.call(this, a, b, g);
        this._hasChildren = !0
    };
    b.setOpacity = function (a) {
        cc.NodeRGBA.prototype.setOpacity.call(this, a);
        this.updateColor()
    };
    b.setColor = function (a) {
        cc.NodeRGBA.prototype.setColor.call(this, a);
        this.updateColor()
    };
    b.updateDisplayedColor = function (a) {
        cc.NodeRGBA.prototype.updateDisplayedColor.call(this,
            a);
        this.updateColor()
    };
    b.setSpriteFrame = function (a) {
        var b = this;
        "string" == typeof a && (a = cc.spriteFrameCache.getSpriteFrame(a), cc.assert(a, cc._LogInfos.Sprite_setSpriteFrame));
        b.setNodeDirty(!0);
        var g = a.getOffset();
        b._unflippedOffsetPositionFromCenter.x = g.x;
        b._unflippedOffsetPositionFromCenter.y = g.y;
        g = a.getTexture();
        a.textureLoaded() || (b._textureLoaded = !1, a.addLoadedEventListener(function (a) {
            b._textureLoaded = !0;
            var e = a.getTexture();
            e != b._texture && (b.texture = e);
            b.setTextureRect(a.getRect(), a.isRotated(),
                a.getOriginalSize());
            b._callLoadedEventCallbacks()
        }, b));
        g != b._texture && (b.texture = g);
        b._rectRotated = a.isRotated();
        b.setTextureRect(a.getRect(), b._rectRotated, a.getOriginalSize())
    };
    b.isFrameDisplayed = function (a) {
        return cc.rectEqualToRect(a.getRect(), this._rect) && a.getTexture().getName() == this._texture.getName() && cc.pointEqualToPoint(a.getOffset(), this._unflippedOffsetPositionFromCenter)
    };
    b.setBatchNode = function (a) {
        if (this._batchNode = a)this._transformToBatch = cc.AffineTransformIdentity(), this.textureAtlas =
            this._batchNode.textureAtlas; else {
            this.atlasIndex = cc.Sprite.INDEX_NOT_INITIALIZED;
            this.textureAtlas = null;
            this.dirty = this._recursiveDirty = !1;
            a = this._offsetPosition.x;
            var b = this._offsetPosition.y, g = a + this._rect.width, d = b + this._rect.height, e = this._quad;
            e.bl.vertices = {x: a, y: b, z: 0};
            e.br.vertices = {x: g, y: b, z: 0};
            e.tl.vertices = {x: a, y: d, z: 0};
            e.tr.vertices = {x: g, y: d, z: 0};
            this._quadDirty = !0
        }
    };
    b.setTexture = function (a) {
        a && "string" === typeof a ? (a = cc.textureCache.addImage(a), this.setTexture(a), a = a.getContentSize(),
            this.setTextureRect(cc.rect(0, 0, a.width, a.height))) : (cc.assert(!a || a instanceof cc.Texture2D, cc._LogInfos.Sprite_setTexture_2), this._batchNode && this._batchNode.texture != a ? cc.log(cc._LogInfos.Sprite_setTexture) : (this.shaderProgram = a ? cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR) : cc.shaderCache.programForKey(cc.SHADER_POSITION_COLOR), !this._batchNode && this._texture != a && (this._texture = a, this._updateBlendFunc())))
    };
    b.draw = function () {
        if (this._textureLoaded) {
            var a = cc._renderContext, b = this._texture;
            b ? b._isLoaded && (this._shaderProgram.use(), this._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4(), cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst), cc.glBindTexture2DN(0, b), cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX), a.bindBuffer(a.ARRAY_BUFFER, this._quadWebBuffer), this._quadDirty && (a.bufferData(a.ARRAY_BUFFER, this._quad.arrayBuffer, a.DYNAMIC_DRAW), this._quadDirty = !1), a.vertexAttribPointer(0, 3, a.FLOAT, !1, 24, 0), a.vertexAttribPointer(1, 4, a.UNSIGNED_BYTE, !0, 24,
                12), a.vertexAttribPointer(2, 2, a.FLOAT, !1, 24, 16), a.drawArrays(a.TRIANGLE_STRIP, 0, 4)) : (this._shaderProgram.use(), this._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4(), cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst), cc.glBindTexture2D(null), cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR), a.bindBuffer(a.ARRAY_BUFFER, this._quadWebBuffer), this._quadDirty && (cc._renderContext.bufferData(cc._renderContext.ARRAY_BUFFER, this._quad.arrayBuffer, cc._renderContext.STATIC_DRAW),
                this._quadDirty = !1), a.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, a.FLOAT, !1, 24, 0), a.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, a.UNSIGNED_BYTE, !0, 24, 12), a.drawArrays(a.TRIANGLE_STRIP, 0, 4));
            cc.g_NumberOfDraws++;
            if (0 !== cc.SPRITE_DEBUG_DRAW || this._showNode)1 === cc.SPRITE_DEBUG_DRAW || this._showNode ? (a = this._quad, a = [cc.p(a.tl.vertices.x, a.tl.vertices.y), cc.p(a.bl.vertices.x, a.bl.vertices.y), cc.p(a.br.vertices.x, a.br.vertices.y), cc.p(a.tr.vertices.x, a.tr.vertices.y)], cc._drawingUtil.drawPoly(a, 4,
                !0)) : 2 === cc.SPRITE_DEBUG_DRAW && (a = this.getTextureRect(), b = this.getOffsetPosition(), a = [cc.p(b.x, b.y), cc.p(b.x + a.width, b.y), cc.p(b.x + a.width, b.y + a.height), cc.p(b.x, b.y + a.height)], cc._drawingUtil.drawPoly(a, 4, !0))
        }
    };
    delete b
};
cc._tmp.WebGLLabelTTF = function () {
    var b = cc.LabelTTF.prototype;
    b.setColor = cc.Sprite.prototype.setColor;
    b._setColorsString = function () {
        this._needUpdateTexture = !0;
        var a = this._strokeColor, b = this._textFillColor;
        this._shadowColorStr = "rgba(128,128,128," + this._shadowOpacity + ")";
        this._fillColorStr = "rgba(" + (0 | b.r) + "," + (0 | b.g) + "," + (0 | b.b) + ", 1)";
        this._strokeColorStr = "rgba(" + (0 | a.r) + "," + (0 | a.g) + "," + (0 | a.b) + ", 1)"
    };
    b.updateDisplayedColor = cc.Sprite.prototype.updateDisplayedColor;
    b.setOpacity = cc.Sprite.prototype.setOpacity;
    b.updateDisplayedOpacity = cc.Sprite.prototype.updateDisplayedOpacity;
    b.initWithStringAndTextDefinition = function (a, b) {
        if (!cc.Sprite.prototype.init.call(this))return!1;
        this.shaderProgram = cc.shaderCache.programForKey(cc.LabelTTF._SHADER_PROGRAM);
        this._updateWithTextDefinition(b, !1);
        this.string = a;
        return!0
    };
    b.setFontFillColor = function (a) {
        var b = this._textFillColor;
        if (b.r != a.r || b.g != a.g || b.b != a.b)b.r = a.r, b.g = a.g, b.b = a.b, this._setColorsString(), this._needUpdateTexture = !0
    };
    b.draw = function (a) {
        if (this._string &&
            "" != this._string) {
            a = a || cc._renderContext;
            var b = this._texture;
            b && b._isLoaded && (this._shaderProgram.use(), this._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4(), cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst), cc.glBindTexture2D(b), cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX), a.bindBuffer(a.ARRAY_BUFFER, this._quadWebBuffer), this._quadDirty && (a.bufferData(a.ARRAY_BUFFER, this._quad.arrayBuffer, a.STATIC_DRAW), this._quadDirty = !1), a.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION,
                3, a.FLOAT, !1, 24, 0), a.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, a.FLOAT, !1, 24, 16), a.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, a.UNSIGNED_BYTE, !0, 24, 12), a.drawArrays(a.TRIANGLE_STRIP, 0, 4));
            if (1 === cc.SPRITE_DEBUG_DRAW)a = this._quad, a = [cc.p(a.tl.vertices.x, a.tl.vertices.y), cc.p(a.bl.vertices.x, a.bl.vertices.y), cc.p(a.br.vertices.x, a.br.vertices.y), cc.p(a.tr.vertices.x, a.tr.vertices.y)], cc._drawingUtil.drawPoly(a, 4, !0); else if (2 === cc.SPRITE_DEBUG_DRAW) {
                a = this.getTextureRect()._size;
                var b = this.offsetX,
                    g = this.offsetY;
                a = [cc.p(b, g), cc.p(b + a.width, g), cc.p(b + a.width, g + a.height), cc.p(b, g + a.height)];
                cc._drawingUtil.drawPoly(a, 4, !0)
            }
            cc.g_NumberOfDraws++
        }
    };
    b.setTextureRect = cc.Sprite.prototype.setTextureRect
};
cc._tmp.DirectorWebGL = function () {
    cc.DirectorDelegate = cc.Class.extend({updateProjection: function () {
    }});
    var b = cc.Director.prototype;
    b.setProjection = function (a) {
        var b = this._winSizeInPoints;
        this.setViewport();
        switch (a) {
            case cc.Director.PROJECTION_2D:
                cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
                cc.kmGLLoadIdentity();
                var g = new cc.kmMat4;
                cc.kmMat4OrthographicProjection(g, 0, b.width, 0, b.height, -1024, 1024);
                cc.kmGLMultMatrix(g);
                cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
                cc.kmGLLoadIdentity();
                break;
            case cc.Director.PROJECTION_3D:
                var d =
                    this.getZEye(), e = new cc.kmMat4, g = new cc.kmMat4;
                cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
                cc.kmGLLoadIdentity();
                cc.kmMat4PerspectiveProjection(e, 60, b.width / b.height, 0.1, 2 * d);
                cc.kmGLMultMatrix(e);
                cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
                cc.kmGLLoadIdentity();
                d = cc.kmVec3Fill(null, b.width / 2, b.height / 2, d);
                b = cc.kmVec3Fill(null, b.width / 2, b.height / 2, 0);
                e = cc.kmVec3Fill(null, 0, 1, 0);
                cc.kmMat4LookAt(g, d, b, e);
                cc.kmGLMultMatrix(g);
                break;
            case cc.Director.PROJECTION_CUSTOM:
                this._projectionDelegate && this._projectionDelegate.updateProjection();
                break;
            default:
                cc.log(cc._LogInfos.Director_setProjection)
        }
        this._projection = a;
        cc.eventManager.dispatchEvent(this._eventProjectionChanged);
        cc.setProjectionMatrixDirty()
    };
    b.setDepthTest = function (a) {
        var b = cc._renderContext;
        a ? (b.clearDepth(1), b.enable(b.DEPTH_TEST), b.depthFunc(b.LEQUAL)) : b.disable(b.DEPTH_TEST)
    };
    b.setOpenGLView = function (a) {
        this._winSizeInPoints.width = cc._canvas.width;
        this._winSizeInPoints.height = cc._canvas.height;
        this._openGLView = a || cc.view;
        a = cc.configuration;
        a.gatherGPUInfo();
        a.dumpInfo();
        this._createStatsLabel();
        this.setGLDefaultValues();
        cc.eventManager && cc.eventManager.setEnabled(!0)
    };
    b._clear = function () {
        var a = cc._renderContext;
        a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT)
    };
    b._beforeVisitScene = function () {
        cc.kmGLPushMatrix()
    };
    b._afterVisitScene = function () {
        cc.kmGLPopMatrix()
    };
    b._createStatsLabel = function () {
        if (cc.LabelAtlas) {
            if (!(null == cc.Director._fpsImageLoaded || !1 == cc.Director._fpsImageLoaded)) {
                var a = new cc.Texture2D;
                a.initWithElement(cc.Director._fpsImage);
                a.handleLoadedTexture();
                var b = cc.view.getDesignResolutionSize().height / 320;
                0 === b && (b = this._winSizeInPoints.height / 320);
                var g = new cc.LabelAtlas;
                g._setIgnoreContentScaleFactor(!0);
                g.initWithString("00.0", a, 12, 32, ".");
                g.scale = b;
                this._FPSLabel = g;
                g = new cc.LabelAtlas;
                g._setIgnoreContentScaleFactor(!0);
                g.initWithString("0.000", a, 12, 32, ".");
                g.scale = b;
                this._SPFLabel = g;
                g = new cc.LabelAtlas;
                g._setIgnoreContentScaleFactor(!0);
                g.initWithString("000", a, 12, 32, ".");
                g.scale = b;
                this._drawsLabel = g;
                a = cc.DIRECTOR_STATS_POSITION;
                this._drawsLabel.setPosition(a.x,
                        34 * b + a.y);
                this._SPFLabel.setPosition(a.x, 17 * b + a.y);
                this._FPSLabel.setPosition(a)
            }
        } else this._createStatsLabelForCanvas()
    };
    b._createStatsLabelForCanvas = function () {
        var a = 0, a = this._winSizeInPoints.width > this._winSizeInPoints.height ? 0 | 24 * (this._winSizeInPoints.height / 320) : 0 | 24 * (this._winSizeInPoints.width / 320);
        this._FPSLabel = cc.LabelTTF.create("000.0", "Arial", a);
        this._SPFLabel = cc.LabelTTF.create("0.000", "Arial", a);
        this._drawsLabel = cc.LabelTTF.create("0000", "Arial", a);
        a = cc.DIRECTOR_STATS_POSITION;
        this._drawsLabel.setPosition(this._drawsLabel.width /
            2 + a.x, 5 * this._drawsLabel.height / 2 + a.y);
        this._SPFLabel.setPosition(this._SPFLabel.width / 2 + a.x, 3 * this._SPFLabel.height / 2 + a.y);
        this._FPSLabel.setPosition(this._FPSLabel.width / 2 + a.x, this._FPSLabel.height / 2 + a.y)
    };
    b.convertToGL = function (a) {
        var b = new cc.kmMat4;
        cc.GLToClipTransform(b);
        var g = new cc.kmMat4;
        cc.kmMat4Inverse(g, b);
        var b = b.mat[14] / b.mat[15], d = this._openGLView.getDesignResolutionSize();
        a = new cc.kmVec3(2 * a.x / d.width - 1, 1 - 2 * a.y / d.height, b);
        b = new cc.kmVec3;
        cc.kmVec3TransformCoord(b, a, g);
        return cc.p(b.x,
            b.y)
    };
    b.convertToUI = function (a) {
        var b = new cc.kmMat4;
        cc.GLToClipTransform(b);
        var g = new cc.kmVec3;
        a = new cc.kmVec3(a.x, a.y, 0);
        cc.kmVec3TransformCoord(g, a, b);
        b = this._openGLView.getDesignResolutionSize();
        return cc.p(b.width * (0.5 * g.x + 0.5), b.height * (0.5 * -g.y + 0.5))
    };
    b.getVisibleSize = function () {
        return this._openGLView.getVisibleSize()
    };
    b.getVisibleOrigin = function () {
        return this._openGLView.getVisibleOrigin()
    };
    b.getZEye = function () {
        return this._winSizeInPoints.height / 1.1566
    };
    b.setViewport = function () {
        if (this._openGLView) {
            var a =
                this._winSizeInPoints;
            this._openGLView.setViewPortInPoints(0, 0, a.width, a.height)
        }
    };
    b.getOpenGLView = function () {
        return this._openGLView
    };
    b.getProjection = function () {
        return this._projection
    };
    b.setAlphaBlending = function (a) {
        a ? cc.glBlendFunc(cc.BLEND_SRC, cc.BLEND_DST) : cc.glBlendFunc(cc._renderContext.ONE, cc._renderContext.ZERO)
    };
    b.setGLDefaultValues = function () {
        this.setAlphaBlending(!0);
        this.setDepthTest(!1);
        this.setProjection(this._projection);
        cc._renderContext.clearColor(0, 0, 0, 1)
    }
};
//-----------------------Shader_Position_uColor Shader Source--------------------------
cc.SHADER_POSITION_UCOLOR_FRAG =
        "precision lowp float;\n"
        + "varying vec4 v_fragmentColor;\n"
        + "void main()                              \n"
        + "{ \n"
        + "    gl_FragColor = v_fragmentColor;      \n"
        + "}\n";
cc.SHADER_POSITION_UCOLOR_VERT =
        "attribute vec4 a_position;\n"
        + "uniform    vec4 u_color;\n"
        + "uniform float u_pointSize;\n"
        + "varying lowp vec4 v_fragmentColor; \n"
        + "void main(void)   \n"
        + "{\n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    gl_PointSize = u_pointSize;          \n"
        + "    v_fragmentColor = u_color;           \n"
        + "}";
cc.SHADER_POSITION_COLOR_FRAG =
        "precision lowp float; \n"
        + "varying vec4 v_fragmentColor; \n"
        + "void main() \n"
        + "{ \n"
        + "     gl_FragColor = v_fragmentColor; \n"
        + "} ";
cc.SHADER_POSITION_COLOR_VERT =
        "attribute vec4 a_position;\n"
        + "attribute vec4 a_color;\n"
        + "varying lowp vec4 v_fragmentColor;\n"
        + "void main()\n"
        + "{\n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    v_fragmentColor = a_color;             \n"
        + "}";
cc.SHADER_SPRITE_POSITION_COLOR_VERT =
        "attribute vec4 a_position;\n"
        + "attribute vec4 a_color;\n"
        + "varying lowp vec4 v_fragmentColor;\n"
        + "void main()\n"
        + "{\n"
        + "    gl_Position = CC_PMatrix * a_position;  \n"
        + "    v_fragmentColor = a_color;             \n"
        + "}";
cc.SHADER_POSITION_COLOR_LENGTH_TEXTURE_FRAG =
        "// #extension GL_OES_standard_derivatives : enable\n"
        + "varying mediump vec4 v_color;\n"
        + "varying mediump vec2 v_texcoord;\n"
        + "void main()	\n"
        + "{ \n"
        + "// #if defined GL_OES_standard_derivatives	\n"
        + "// gl_FragColor = v_color*smoothstep(0.0, length(fwidth(v_texcoord)), 1.0 - length(v_texcoord)); \n"
        + "// #else	\n"
        + "gl_FragColor = v_color * step(0.0, 1.0 - length(v_texcoord)); \n"
        + "// #endif \n"
        + "}";
cc.SHADER_POSITION_COLOR_LENGTH_TEXTURE_VERT =
        "attribute mediump vec4 a_position; \n"
        + "attribute mediump vec2 a_texcoord; \n"
        + "attribute mediump vec4 a_color;	\n"
        + "varying mediump vec4 v_color; \n"
        + "varying mediump vec2 v_texcoord;	\n"
        + "void main() \n"
        + "{ \n"
        + "     v_color = a_color;//vec4(a_color.rgb * a_color.a, a_color.a); \n"
        + "     v_texcoord = a_texcoord; \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "}";
cc.SHADER_POSITION_TEXTURE_FRAG =
        "precision lowp float;   \n"
        + "varying vec2 v_texCoord;  \n"
        + "void main() \n"
        + "{  \n"
        + "    gl_FragColor =  texture2D(CC_Texture0, v_texCoord);   \n"
        + "}";
cc.SHADER_POSITION_TEXTURE_VERT =
        "attribute vec4 a_position; \n"
        + "attribute vec2 a_texCoord; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    v_texCoord = a_texCoord;               \n"
        + "}";
cc.SHADER_POSITION_TEXTURE_UCOLOR_FRAG =
        "precision lowp float;  \n"
        + "uniform vec4 u_color; \n"
        + "varying vec2 v_texCoord; \n"
        + "void main() \n"
        + "{  \n"
        + "    gl_FragColor =  texture2D(CC_Texture0, v_texCoord) * u_color;    \n"
        + "}";
cc.SHADER_POSITION_TEXTURE_UCOLOR_VERT =
        "attribute vec4 a_position;\n"
        + "attribute vec2 a_texCoord; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    v_texCoord = a_texCoord;                 \n"
        + "}";
cc.SHADER_POSITION_TEXTURE_A8COLOR_FRAG =
        "precision lowp float;  \n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_FragColor = vec4( v_fragmentColor.rgb,         \n"
        + "        v_fragmentColor.a * texture2D(CC_Texture0, v_texCoord).a   \n"
        + "    ); \n"
        + "}";
cc.SHADER_POSITION_TEXTURE_A8COLOR_VERT =
        "attribute vec4 a_position; \n"
        + "attribute vec2 a_texCoord; \n"
        + "attribute vec4 a_color;  \n"
        + "varying lowp vec4 v_fragmentColor; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    v_fragmentColor = a_color; \n"
        + "    v_texCoord = a_texCoord; \n"
        + "}";
cc.SHADER_POSITION_TEXTURE_COLOR_FRAG =
        "precision lowp float;\n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord); \n"
        + "}";
cc.SHADER_POSITION_TEXTURE_COLOR_VERT =
        "attribute vec4 a_position; \n"
        + "attribute vec2 a_texCoord; \n"
        + "attribute vec4 a_color;  \n"
        + "varying lowp vec4 v_fragmentColor; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    v_fragmentColor = a_color; \n"
        + "    v_texCoord = a_texCoord; \n"
        + "}";
cc.SHADER_SPRITE_POSITION_TEXTURE_COLOR_VERT =
        "attribute vec4 a_position; \n"
        + "attribute vec2 a_texCoord; \n"
        + "attribute vec4 a_color;  \n"
        + "varying lowp vec4 v_fragmentColor; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_Position = CC_PMatrix * a_position;  \n"
        + "    v_fragmentColor = a_color; \n"
        + "    v_texCoord = a_texCoord; \n"
        + "}";
cc.SHADER_POSITION_TEXTURE_COLOR_ALPHATEST_FRAG =
        "precision lowp float;   \n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord;   \n"
        + "uniform float CC_alpha_value; \n"
        + "void main() \n"
        + "{  \n"
        + "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);  \n"
        + "    if ( texColor.a <= CC_alpha_value )          \n"
        + "        discard; \n"
        + "    gl_FragColor = texColor * v_fragmentColor;  \n"
        + "}";
cc.SHADER_SPRITE_POSITION_TEXTURE_COLOR_VERT =
        "attribute vec4 a_position; \n"
        + "attribute vec2 a_texCoord; \n"
        + "attribute vec4 a_color;  \n"
        + "varying lowp vec4 v_fragmentColor; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_Position = CC_PMatrix * a_position;  \n"
        + "    v_fragmentColor = a_color; \n"
        + "    v_texCoord = a_texCoord; \n"
        + "}";
cc.SHADEREX_SWITCHMASK_FRAG =
        "precision lowp float; \n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"
        + "uniform sampler2D u_texture;  \n"
        + "uniform sampler2D   u_mask;   \n"
        + "void main()  \n"
        + "{  \n"
        + "    vec4 texColor   = texture2D(u_texture, v_texCoord);  \n"
        + "    vec4 maskColor  = texture2D(u_mask, v_texCoord); \n"
        + "    vec4 finalColor = vec4(texColor.r, texColor.g, texColor.b, maskColor.a * texColor.a);        \n"
        + "    gl_FragColor    = v_fragmentColor * finalColor; \n"
        + "}";
cc.shaderCache = {
    TYPE_POSITION_TEXTURECOLOR: 0,
    TYPE_POSITION_TEXTURECOLOR_ALPHATEST: 1,
    TYPE_POSITION_COLOR: 2,
    TYPE_POSITION_TEXTURE: 3,
    TYPE_POSITION_TEXTURE_UCOLOR: 4,
    TYPE_POSITION_TEXTURE_A8COLOR: 5,
    TYPE_POSITION_UCOLOR: 6,
    TYPE_POSITION_LENGTH_TEXTURECOLOR: 7,
    TYPE_SPRITE_POSITION_TEXTURECOLOR: 8,
    TYPE_SPRITE_POSITION_TEXTURECOLOR_ALPHATEST: 9,
    TYPE_SPRITE_POSITION_COLOR: 10,
    TYPE_MAX: 10,
    _programs: {},
    _init: function () {
        this.loadDefaultShaders();
        return true;
    },
    _loadDefaultShader: function (program, type) {
        switch (type) {
            case this.TYPE_POSITION_TEXTURECOLOR:
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, cc.SHADER_POSITION_TEXTURE_COLOR_FRAG);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case this.TYPE_SPRITE_POSITION_TEXTURECOLOR:
                program.initWithVertexShaderByteArray(cc.SHADER_SPRITE_POSITION_TEXTURE_COLOR_VERT, cc.SHADER_POSITION_TEXTURE_COLOR_FRAG);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case this.TYPE_POSITION_TEXTURECOLOR_ALPHATEST:
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, cc.SHADER_POSITION_TEXTURE_COLOR_ALPHATEST_FRAG);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case this.TYPE_SPRITE_POSITION_TEXTURECOLOR_ALPHATEST:
                program.initWithVertexShaderByteArray(cc.SHADER_SPRITE_POSITION_TEXTURE_COLOR_VERT, cc.SHADER_POSITION_TEXTURE_COLOR_ALPHATEST_FRAG);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case this.TYPE_POSITION_COLOR:
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_COLOR_VERT, cc.SHADER_POSITION_COLOR_FRAG);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                break;
            case this.TYPE_SPRITE_POSITION_COLOR:
                program.initWithVertexShaderByteArray(cc.SHADER_SPRITE_POSITION_COLOR_VERT, cc.SHADER_POSITION_COLOR_FRAG);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                break;
            case this.TYPE_POSITION_TEXTURE:
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_VERT, cc.SHADER_POSITION_TEXTURE_FRAG);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case this.TYPE_POSITION_TEXTURE_UCOLOR:
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_UCOLOR_VERT, cc.SHADER_POSITION_TEXTURE_UCOLOR_FRAG);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case this.TYPE_POSITION_TEXTURE_A8COLOR:
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_A8COLOR_VERT, cc.SHADER_POSITION_TEXTURE_A8COLOR_FRAG);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case this.TYPE_POSITION_UCOLOR:
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_UCOLOR_VERT, cc.SHADER_POSITION_UCOLOR_FRAG);
                program.addAttribute("aVertex", cc.VERTEX_ATTRIB_POSITION);
                break;
            case this.TYPE_POSITION_LENGTH_TEXTURECOLOR:
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_COLOR_LENGTH_TEXTURE_VERT, cc.SHADER_POSITION_COLOR_LENGTH_TEXTURE_FRAG);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                break;
            default:
                cc.log("cocos2d: cc.shaderCache._loadDefaultShader, error shader type");
                return;
        }
        program.link();
        program.updateUniforms();
    },
    loadDefaultShaders: function () {
        var program = new cc.GLProgram();
        this._loadDefaultShader(program, this.TYPE_POSITION_TEXTURECOLOR);
        this._programs[cc.SHADER_POSITION_TEXTURECOLOR] = program;
        this._programs["ShaderPositionTextureColor"] = program;
        program = new cc.GLProgram();
        this._loadDefaultShader(program, this.TYPE_SPRITE_POSITION_TEXTURECOLOR);
        this._programs[cc.SHADER_SPRITE_POSITION_TEXTURECOLOR] = program;
        this._programs["ShaderSpritePositionTextureColor"] = program;
        program = new cc.GLProgram();
        this._loadDefaultShader(program, this.TYPE_POSITION_TEXTURECOLOR_ALPHATEST);
        this._programs[cc.SHADER_POSITION_TEXTURECOLORALPHATEST] = program;
        this._programs["ShaderPositionTextureColorAlphaTest"] = program;
        program = new cc.GLProgram();
        this._loadDefaultShader(program, this.TYPE_SPRITE_POSITION_TEXTURECOLOR_ALPHATEST);
        this._programs[cc.SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST] = program;
        this._programs["ShaderSpritePositionTextureColorAlphaTest"] = program;
        program = new cc.GLProgram();
        this._loadDefaultShader(program, this.TYPE_POSITION_COLOR);
        this._programs[cc.SHADER_POSITION_COLOR] = program;
        this._programs["ShaderPositionColor"] = program;
        program = new cc.GLProgram();
        this._loadDefaultShader(program, this.TYPE_SPRITE_POSITION_COLOR);
        this._programs[cc.SHADER_SPRITE_POSITION_COLOR] = program;
        this._programs["ShaderSpritePositionColor"] = program;
        program = new cc.GLProgram();
        this._loadDefaultShader(program, this.TYPE_POSITION_TEXTURE);
        this._programs[cc.SHADER_POSITION_TEXTURE] = program;
        this._programs["ShaderPositionTexture"] = program;
        program = new cc.GLProgram();
        this._loadDefaultShader(program, this.TYPE_POSITION_TEXTURE_UCOLOR);
        this._programs[cc.SHADER_POSITION_TEXTURE_UCOLOR] = program;
        this._programs["ShaderPositionTextureUColor"] = program;
        program = new cc.GLProgram();
        this._loadDefaultShader(program, this.TYPE_POSITION_TEXTURE_A8COLOR);
        this._programs[cc.SHADER_POSITION_TEXTUREA8COLOR] = program;
        this._programs["ShaderPositionTextureA8Color"] = program;
        program = new cc.GLProgram();
        this._loadDefaultShader(program, this.TYPE_POSITION_UCOLOR);
        this._programs[cc.SHADER_POSITION_UCOLOR] = program;
        this._programs["ShaderPositionUColor"] = program;
        program = new cc.GLProgram();
        this._loadDefaultShader(program, this.TYPE_POSITION_LENGTH_TEXTURECOLOR);
        this._programs[cc.SHADER_POSITION_LENGTHTEXTURECOLOR] = program;
        this._programs["ShaderPositionLengthTextureColor"] = program;
    },
    reloadDefaultShaders: function () {
        var program = this.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
        program.reset();
        this._loadDefaultShader(program, this.TYPE_POSITION_TEXTURECOLOR);
        program = this.programForKey(cc.SHADER_SPRITE_POSITION_TEXTURECOLOR);
        program.reset();
        this._loadDefaultShader(program, this.TYPE_SPRITE_POSITION_TEXTURECOLOR);
        program = this.programForKey(cc.SHADER_POSITION_TEXTURECOLORALPHATEST);
        program.reset();
        this._loadDefaultShader(program, this.TYPE_POSITION_TEXTURECOLOR_ALPHATEST);
        program = this.programForKey(cc.SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST);
        program.reset();
        this._loadDefaultShader(program, this.TYPE_SPRITE_POSITION_TEXTURECOLOR_ALPHATEST);
        program = this.programForKey(cc.SHADER_POSITION_COLOR);
        program.reset();
        this._loadDefaultShader(program, this.TYPE_POSITION_COLOR);
        program = this.programForKey(cc.SHADER_POSITION_TEXTURE);
        program.reset();
        this._loadDefaultShader(program, this.TYPE_POSITION_TEXTURE);
        program = this.programForKey(cc.SHADER_POSITION_TEXTURE_UCOLOR);
        program.reset();
        this._loadDefaultShader(program, this.TYPE_POSITION_TEXTURE_UCOLOR);
        program = this.programForKey(cc.SHADER_POSITION_TEXTUREA8COLOR);
        program.reset();
        this._loadDefaultShader(program, this.TYPE_POSITION_TEXTURE_A8COLOR);
        program = this.programForKey(cc.SHADER_POSITION_UCOLOR);
        program.reset();
        this._loadDefaultShader(program, this.TYPE_POSITION_UCOLOR);
    },
    programForKey: function (key) {
        return this._programs[key];
    },
    getProgram: function (shaderName) {
        return this._programs[shaderName];
    },
    addProgram: function (program, key) {
        this._programs[key] = program;
    }
};
cc.GLProgram = cc.Class.extend({
    _glContext: null,
    _programObj: null,
    _vertShader: null,
    _fragShader: null,
    _uniforms: null,
    _hashForUniforms: null,
    _usesTime: false,
    _updateUniformLocation: function (location) {
        if (!location)
            return false;
        var updated;
        var element = this._hashForUniforms[location];
        if (!element) {
            element = [
                arguments[1],
                arguments[2],
                arguments[3],
                arguments[4]
            ];
            this._hashForUniforms[location] = element;
            updated = true;
        } else {
            updated = false;
            var count = arguments.length-1;
            for (var i = 0; i < count; ++i) {
                if (arguments[i+1] !== element[i]) {
                    element[i] = arguments[i+1];
                    updated = true;
                }
            }
        }
        return updated;
    },
    _description: function () {
        return "<CCGLProgram = " + this.toString() + " | Program = " + this._programObj.toString() + ", VertexShader = " +
            this._vertShader.toString() + ", FragmentShader = " + this._fragShader.toString() + ">";
    },
    _compileShader: function (shader, type, source) {
        if (!source || !shader)
            return false;
        var preStr = cc.GLProgram._isHighpSupported() ? "precision highp float;\n" : "precision mediump float;\n";
        source = preStr
            + "uniform mat4 CC_PMatrix;         \n"
            + "uniform mat4 CC_MVMatrix;        \n"
            + "uniform mat4 CC_MVPMatrix;       \n"
            + "uniform vec4 CC_Time;            \n"
            + "uniform vec4 CC_SinTime;         \n"
            + "uniform vec4 CC_CosTime;         \n"
            + "uniform vec4 CC_Random01;        \n"
            + "uniform sampler2D CC_Texture0;   \n"
            + "//CC INCLUDES END                \n" + source;
        this._glContext.shaderSource(shader, source);
        this._glContext.compileShader(shader);
        var status = this._glContext.getShaderParameter(shader, this._glContext.COMPILE_STATUS);
        if (!status) {
            cc.log("cocos2d: ERROR: Failed to compile shader:\n" + this._glContext.getShaderSource(shader));
            if (type === this._glContext.VERTEX_SHADER)
                cc.log("cocos2d: \n" + this.vertexShaderLog());
            else
                cc.log("cocos2d: \n" + this.fragmentShaderLog());
        }
        return ( status === true );
    },
    ctor: function (vShaderFileName, fShaderFileName, glContext) {
        this._uniforms = {};
        this._hashForUniforms = {};
        this._glContext = glContext || cc._renderContext;
		vShaderFileName && fShaderFileName && this.init(vShaderFileName, fShaderFileName);
    },
    destroyProgram: function () {
        this._vertShader = null;
        this._fragShader = null;
        this._uniforms = null;
        this._hashForUniforms = null;
        this._glContext.deleteProgram(this._programObj);
    },
    initWithVertexShaderByteArray: function (vertShaderStr, fragShaderStr) {
        var locGL = this._glContext;
        this._programObj = locGL.createProgram();
        this._vertShader = null;
        this._fragShader = null;
        if (vertShaderStr) {
            this._vertShader = locGL.createShader(locGL.VERTEX_SHADER);
            if (!this._compileShader(this._vertShader, locGL.VERTEX_SHADER, vertShaderStr)) {
                cc.log("cocos2d: ERROR: Failed to compile vertex shader");
            }
        }
        if (fragShaderStr) {
            this._fragShader = locGL.createShader(locGL.FRAGMENT_SHADER);
            if (!this._compileShader(this._fragShader, locGL.FRAGMENT_SHADER, fragShaderStr)) {
                cc.log("cocos2d: ERROR: Failed to compile fragment shader");
            }
        }
        if (this._vertShader)
            locGL.attachShader(this._programObj, this._vertShader);
        cc.checkGLErrorDebug();
        if (this._fragShader)
            locGL.attachShader(this._programObj, this._fragShader);
        for (var key in this._hashForUniforms) {
            delete this._hashForUniforms[key];
        }
        cc.checkGLErrorDebug();
        return true;
    },
    initWithString: function (vertShaderStr, fragShaderStr) {
        return this.initWithVertexShaderByteArray(vertShaderStr, fragShaderStr);
    },
    initWithVertexShaderFilename: function (vShaderFilename, fShaderFileName) {
        var vertexSource = cc.loader.getRes(vShaderFilename);
        if(!vertexSource) throw new Error("Please load the resource firset : " + vShaderFilename);
        var fragmentSource = cc.loader.getRes(fShaderFileName);
        if(!fragmentSource) throw new Error("Please load the resource firset : " + fShaderFileName);
        return this.initWithVertexShaderByteArray(vertexSource, fragmentSource);
    },
    init: function (vShaderFilename, fShaderFileName) {
        return this.initWithVertexShaderFilename(vShaderFilename, fShaderFileName);
    },
    addAttribute: function (attributeName, index) {
        this._glContext.bindAttribLocation(this._programObj, index, attributeName);
    },
    link: function () {
        if(!this._programObj) {
            cc.log("cc.GLProgram.link(): Cannot link invalid program");
            return false;
        }
        this._glContext.linkProgram(this._programObj);
        if (this._vertShader)
            this._glContext.deleteShader(this._vertShader);
        if (this._fragShader)
            this._glContext.deleteShader(this._fragShader);
        this._vertShader = null;
        this._fragShader = null;
        if (cc.game.config[cc.game.CONFIG_KEY.debugMode]) {
            var status = this._glContext.getProgramParameter(this._programObj, this._glContext.LINK_STATUS);
            if (!status) {
                cc.log("cocos2d: ERROR: Failed to link program: " + this._glContext.getProgramInfoLog(this._programObj));
                cc.glDeleteProgram(this._programObj);
                this._programObj = null;
                return false;
            }
        }
        return true;
    },
    use: function () {
        cc.glUseProgram(this._programObj);
    },
    updateUniforms: function () {
        this._uniforms[cc.UNIFORM_PMATRIX_S] = this._glContext.getUniformLocation(this._programObj, cc.UNIFORM_PMATRIX_S);
        this._uniforms[cc.UNIFORM_MVMATRIX_S] = this._glContext.getUniformLocation(this._programObj, cc.UNIFORM_MVMATRIX_S);
        this._uniforms[cc.UNIFORM_MVPMATRIX_S] = this._glContext.getUniformLocation(this._programObj, cc.UNIFORM_MVPMATRIX_S);
        this._uniforms[cc.UNIFORM_TIME_S] = this._glContext.getUniformLocation(this._programObj, cc.UNIFORM_TIME_S);
        this._uniforms[cc.UNIFORM_SINTIME_S] = this._glContext.getUniformLocation(this._programObj, cc.UNIFORM_SINTIME_S);
        this._uniforms[cc.UNIFORM_COSTIME_S] = this._glContext.getUniformLocation(this._programObj, cc.UNIFORM_COSTIME_S);
        this._usesTime = (this._uniforms[cc.UNIFORM_TIME_S] != null || this._uniforms[cc.UNIFORM_SINTIME_S] != null || this._uniforms[cc.UNIFORM_COSTIME_S] != null);
        this._uniforms[cc.UNIFORM_RANDOM01_S] = this._glContext.getUniformLocation(this._programObj, cc.UNIFORM_RANDOM01_S);
        this._uniforms[cc.UNIFORM_SAMPLER_S] = this._glContext.getUniformLocation(this._programObj, cc.UNIFORM_SAMPLER_S);
        this.use();
        this.setUniformLocationWith1i(this._uniforms[cc.UNIFORM_SAMPLER_S], 0);
    },
    _addUniformLocation: function (name) {
        var location = this._glContext.getUniformLocation(this._programObj, name);
        this._uniforms[name] = location;
    },
    getUniformLocationForName: function (name) {
        if (!name)
            throw new Error("cc.GLProgram.getUniformLocationForName(): uniform name should be non-null");
        if (!this._programObj)
            throw new Error("cc.GLProgram.getUniformLocationForName(): Invalid operation. Cannot get uniform location when program is not initialized");
        var location = this._uniforms[name] || this._glContext.getUniformLocation(this._programObj, name);
        return location;
    },
    getUniformMVPMatrix: function () {
        return this._uniforms[cc.UNIFORM_MVPMATRIX_S];
    },
    getUniformSampler: function () {
        return this._uniforms[cc.UNIFORM_SAMPLER_S];
    },
    setUniformLocationWith1i: function (location, i1) {
        var gl = this._glContext;
        if (typeof location === 'string') {
            var updated = this._updateUniformLocation(location, i1);
            if (updated) {
                var locObj = this.getUniformLocationForName(location);
                gl.uniform1i(locObj, i1);
            }
        }
        else {
            gl.uniform1i(location, i1);
        }
    },
    setUniformLocationWith2i: function (location, i1, i2) {
        var gl = this._glContext;
        if (typeof location === 'string') {
            var updated = this._updateUniformLocation(location, i1, i2);
            if (updated) {
                var locObj = this.getUniformLocationForName(location);
                gl.uniform2i(locObj, i1, i2);
            }
        }
        else {
            gl.uniform2i(location, i1, i2);
        }
    },
    setUniformLocationWith3i: function (location, i1, i2, i3) {
        var gl = this._glContext;
        if (typeof location === 'string') {
            var updated = this._updateUniformLocation(location, i1, i2, i3);
            if (updated) {
                var locObj = this.getUniformLocationForName(location);
                gl.uniform3i(locObj, i1, i2, i3);
            }
        }
        else {
            gl.uniform3i(location, i1, i2, i3);
        }
    },
    setUniformLocationWith4i: function (location, i1, i2, i3, i4) {
        var gl = this._glContext;
        if (typeof location === 'string') {
            var updated = this._updateUniformLocation(location, i1, i2, i3, i4);
            if (updated) {
                var locObj = this.getUniformLocationForName(location);
                gl.uniform4i(locObj, i1, i2, i3, i4);
            }
        }
        else {
            gl.uniform4i(location, i1, i2, i3, i4);
        }
    },
    setUniformLocationWith2iv: function (location, intArray) {
        var locObj = typeof location === 'string' ? this.getUniformLocationForName(location) : location;
        this._glContext.uniform2iv(locObj, intArray);
    },
    setUniformLocationWith3iv:function(location, intArray){
        var locObj = typeof location === 'string' ? this.getUniformLocationForName(location) : location;
        this._glContext.uniform3iv(locObj, intArray);
    },
    setUniformLocationWith4iv:function(location, intArray){
        var locObj = typeof location === 'string' ? this.getUniformLocationForName(location) : location;
        this._glContext.uniform4iv(locObj, intArray);
    },
    setUniformLocationI32: function (location, i1) {
        this.setUniformLocationWith1i(location, i1);
    },
    setUniformLocationWith1f: function (location, f1) {
        var gl = this._glContext;
        if (typeof location === 'string') {
            var updated = this._updateUniformLocation(location, f1);
            if (updated) {
                var locObj = this.getUniformLocationForName(location);
                gl.uniform1f(locObj, f1);
            }
        }
        else {
            gl.uniform1f(location, f1);
        }
    },
    setUniformLocationWith2f: function (location, f1, f2) {
        var gl = this._glContext;
        if (typeof location === 'string') {
            var updated = this._updateUniformLocation(location, f1, f2);
            if (updated) {
                var locObj = this.getUniformLocationForName(location);
                gl.uniform2f(locObj, f1, f2);
            }
        }
        else {
            gl.uniform2f(location, f1, f2);
        }
    },
    setUniformLocationWith3f: function (location, f1, f2, f3) {
        var gl = this._glContext;
        if (typeof location === 'string') {
            var updated = this._updateUniformLocation(location, f1, f2, f3);
            if (updated) {
                var locObj = this.getUniformLocationForName(location);
                gl.uniform3f(locObj, f1, f2, f3);
            }
        }
        else {
            gl.uniform3f(location, f1, f2, f3);
        }
    },
    setUniformLocationWith4f: function (location, f1, f2, f3, f4) {
        var gl = this._glContext;
        if (typeof location === 'string') {
            var updated = this._updateUniformLocation(location, f1, f2, f3, f4);
            if (updated) {
                var locObj = this.getUniformLocationForName(location);
                gl.uniform4f(locObj, f1, f2, f3, f4);
            }
        }
        else {
            gl.uniform4f(location, f1, f2, f3, f4);
        }
    },
    setUniformLocationWith2fv: function (location, floatArray) {
        var locObj = typeof location === 'string' ? this.getUniformLocationForName(location) : location;
        this._glContext.uniform2fv(locObj, floatArray);
    },
    setUniformLocationWith3fv: function (location, floatArray) {
        var locObj = typeof location === 'string' ? this.getUniformLocationForName(location) : location;
        this._glContext.uniform3fv(locObj, floatArray);
    },
    setUniformLocationWith4fv: function (location, floatArray) {
        var locObj = typeof location === 'string' ? this.getUniformLocationForName(location) : location;
        this._glContext.uniform4fv(locObj, floatArray);
    },
    setUniformLocationWithMatrix4fv: function (location, matrixArray) {
        var locObj = typeof location === 'string' ? this.getUniformLocationForName(location) : location;
        this._glContext.uniformMatrix4fv(locObj, false, matrixArray);
    },
    setUniformLocationF32: function () {
        if (arguments.length < 2)
            return;
        switch (arguments.length) {
            case 2:
                this.setUniformLocationWith1f(arguments[0], arguments[1]);
                break;
            case 3:
                this.setUniformLocationWith2f(arguments[0], arguments[1], arguments[2]);
                break;
            case 4:
                this.setUniformLocationWith3f(arguments[0], arguments[1], arguments[2], arguments[3]);
                break;
            case 5:
                this.setUniformLocationWith4f(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                break;
        }
    },
    setUniformsForBuiltins: function () {
        var matrixP = new cc.math.Matrix4();
        var matrixMV = new cc.math.Matrix4();
        var matrixMVP = new cc.math.Matrix4();
        cc.kmGLGetMatrix(cc.KM_GL_PROJECTION, matrixP);
        cc.kmGLGetMatrix(cc.KM_GL_MODELVIEW, matrixMV);
        cc.kmMat4Multiply(matrixMVP, matrixP, matrixMV);
        this.setUniformLocationWithMatrix4fv(this._uniforms[cc.UNIFORM_PMATRIX_S], matrixP.mat, 1);
        this.setUniformLocationWithMatrix4fv(this._uniforms[cc.UNIFORM_MVMATRIX_S], matrixMV.mat, 1);
        this.setUniformLocationWithMatrix4fv(this._uniforms[cc.UNIFORM_MVPMATRIX_S], matrixMVP.mat, 1);
        if (this._usesTime) {
            var director = cc.director;
            var time = director.getTotalFrames() * director.getAnimationInterval();
            this.setUniformLocationWith4f(this._uniforms[cc.UNIFORM_TIME_S], time / 10.0, time, time * 2, time * 4);
            this.setUniformLocationWith4f(this._uniforms[cc.UNIFORM_SINTIME_S], time / 8.0, time / 4.0, time / 2.0, Math.sin(time));
            this.setUniformLocationWith4f(this._uniforms[cc.UNIFORM_COSTIME_S], time / 8.0, time / 4.0, time / 2.0, Math.cos(time));
        }
        if (this._uniforms[cc.UNIFORM_RANDOM01_S] !== -1)
            this.setUniformLocationWith4f(this._uniforms[cc.UNIFORM_RANDOM01_S], Math.random(), Math.random(), Math.random(), Math.random());
    },
    _setUniformsForBuiltinsForRenderer: function (node) {
        if(!node || !node._renderCmd)
            return;
        var matrixP = new cc.math.Matrix4();
        var matrixMVP = new cc.math.Matrix4();
        cc.kmGLGetMatrix(cc.KM_GL_PROJECTION, matrixP);
        cc.kmMat4Multiply(matrixMVP, matrixP, node._renderCmd._stackMatrix);
        this.setUniformLocationWithMatrix4fv(this._uniforms[cc.UNIFORM_PMATRIX_S], matrixP.mat, 1);
        this.setUniformLocationWithMatrix4fv(this._uniforms[cc.UNIFORM_MVMATRIX_S], node._renderCmd._stackMatrix.mat, 1);
        this.setUniformLocationWithMatrix4fv(this._uniforms[cc.UNIFORM_MVPMATRIX_S], matrixMVP.mat, 1);
        if (this._usesTime) {
            var director = cc.director;
            var time = director.getTotalFrames() * director.getAnimationInterval();
            this.setUniformLocationWith4f(this._uniforms[cc.UNIFORM_TIME_S], time / 10.0, time, time * 2, time * 4);
            this.setUniformLocationWith4f(this._uniforms[cc.UNIFORM_SINTIME_S], time / 8.0, time / 4.0, time / 2.0, Math.sin(time));
            this.setUniformLocationWith4f(this._uniforms[cc.UNIFORM_COSTIME_S], time / 8.0, time / 4.0, time / 2.0, Math.cos(time));
        }
        if (this._uniforms[cc.UNIFORM_RANDOM01_S] !== -1)
            this.setUniformLocationWith4f(this._uniforms[cc.UNIFORM_RANDOM01_S], Math.random(), Math.random(), Math.random(), Math.random());
    },
    setUniformForModelViewProjectionMatrix: function () {
        this._glContext.uniformMatrix4fv(this._uniforms[cc.UNIFORM_MVPMATRIX_S], false,
        cc.getMat4MultiplyValue(cc.projection_matrix_stack.top, cc.modelview_matrix_stack.top));
    },
    setUniformForModelViewProjectionMatrixWithMat4: function (swapMat4) {
        cc.kmMat4Multiply(swapMat4, cc.projection_matrix_stack.top, cc.modelview_matrix_stack.top);
        this._glContext.uniformMatrix4fv(this._uniforms[cc.UNIFORM_MVPMATRIX_S], false, swapMat4.mat);
    },
    setUniformForModelViewAndProjectionMatrixWithMat4: function () {
        this._glContext.uniformMatrix4fv(this._uniforms[cc.UNIFORM_MVMATRIX_S], false, cc.modelview_matrix_stack.top.mat);
        this._glContext.uniformMatrix4fv(this._uniforms[cc.UNIFORM_PMATRIX_S], false, cc.projection_matrix_stack.top.mat);
    },
    _setUniformForMVPMatrixWithMat4: function(modelViewMatrix){
        if(!modelViewMatrix)
            throw new Error("modelView matrix is undefined.");
        this._glContext.uniformMatrix4fv(this._uniforms[cc.UNIFORM_MVMATRIX_S], false, modelViewMatrix.mat);
        this._glContext.uniformMatrix4fv(this._uniforms[cc.UNIFORM_PMATRIX_S], false, cc.projection_matrix_stack.top.mat);
    },
    _updateProjectionUniform: function(){
        this._glContext.uniformMatrix4fv(this._uniforms[cc.UNIFORM_PMATRIX_S], false, cc.projection_matrix_stack.top.mat);
    },
    vertexShaderLog: function () {
        return this._glContext.getShaderInfoLog(this._vertShader);
    },
    getVertexShaderLog: function () {
        return this._glContext.getShaderInfoLog(this._vertShader);
    },
    getFragmentShaderLog: function () {
        return this._glContext.getShaderInfoLog(this._vertShader);
    },
    fragmentShaderLog: function () {
        return this._glContext.getShaderInfoLog(this._fragShader);
    },
    programLog: function () {
        return this._glContext.getProgramInfoLog(this._programObj);
    },
    getProgramLog: function () {
        return this._glContext.getProgramInfoLog(this._programObj);
    },
    reset: function () {
        this._vertShader = null;
        this._fragShader = null;
        this._uniforms.length = 0;
        this._glContext.deleteProgram(this._programObj);
        this._programObj = null;
        for (var key in this._hashForUniforms) {
            delete this._hashForUniforms[key];
        }
    },
    getProgram: function () {
        return this._programObj;
    },
    retain: function () {
    },
    release: function () {
    }
});
cc.GLProgram.create = function (vShaderFileName, fShaderFileName) {
    return new cc.GLProgram(vShaderFileName, fShaderFileName);
};
cc.GLProgram._highpSupported = null;
cc.GLProgram._isHighpSupported = function(){
    if(cc.GLProgram._highpSupported == null){
        var ctx = cc._renderContext;
        var highp = ctx.getShaderPrecisionFormat(ctx.FRAGMENT_SHADER, ctx.HIGH_FLOAT);
        cc.GLProgram._highpSupported = highp.precision !== 0;
    }
    return cc.GLProgram._highpSupported;
};
cc.setProgram = function (node, program) {
    node.shaderProgram = program;
    var children = node.children;
    if (!children)
        return;
    for (var i = 0; i < children.length; i++)
        cc.setProgram(children[i], program);
};
cc._currentProjectionMatrix = -1;
if (cc.ENABLE_GL_STATE_CACHE) {
    cc.MAX_ACTIVETEXTURE = 16;
    cc._currentShaderProgram = -1;
    cc._currentBoundTexture = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    cc._blendingSource = -1;
    cc._blendingDest = -1;
    cc._GLServerState = 0;
    if(cc.TEXTURE_ATLAS_USE_VAO)
        cc._uVAO = 0;
    var _currBuffers = {};
    var _currBuffer;
    WebGLRenderingContext.prototype.glBindBuffer = WebGLRenderingContext.prototype.bindBuffer;
    WebGLRenderingContext.prototype.bindBuffer = function (target, buffer) {
        if (_currBuffers[target] !== buffer) {
            _currBuffers[target] = buffer;
            this.glBindBuffer(target, buffer);
        }
        if (!_currBuffer || _currBuffer !== buffer) {
            _currBuffer = buffer;
            return false;
        }
        else {
            return true;
        }
    };
    WebGLRenderingContext.prototype.glEnableVertexAttribArray = WebGLRenderingContext.prototype.enableVertexAttribArray;
    WebGLRenderingContext.prototype.enableVertexAttribArray = function (index) {
        if (index === cc.VERTEX_ATTRIB_FLAG_POSITION) {
            if (!this._vertexAttribPosition) {
                this.glEnableVertexAttribArray(index);
                this._vertexAttribPosition = true;
            }
        }
        else if (index === cc.VERTEX_ATTRIB_FLAG_COLOR) {
            if (!this._vertexAttribColor) {
                this.glEnableVertexAttribArray(index);
                this._vertexAttribColor = true;
            }
        }
        else if (index === cc.VERTEX_ATTRIB_FLAG_TEX_COORDS) {
            if (!this._vertexAttribTexCoords) {
                this.glEnableVertexAttribArray(index);
                this._vertexAttribTexCoords = true;
            }
        }
        else {
            this.glEnableVertexAttribArray(index);
        }
    };
    WebGLRenderingContext.prototype.glDisableVertexAttribArray = WebGLRenderingContext.prototype.disableVertexAttribArray;
    WebGLRenderingContext.prototype.disableVertexAttribArray = function (index) {
        if (index === cc.VERTEX_ATTRIB_FLAG_COLOR) {
            if (this._vertexAttribColor) {
                this.glDisableVertexAttribArray(index);
                this._vertexAttribColor = false;
            }
        }
        else if (index === cc.VERTEX_ATTRIB_FLAG_TEX_COORDS) {
            if (this._vertexAttribTexCoords) {
                this.glDisableVertexAttribArray(index);
                this._vertexAttribTexCoords = false;
            }
        }
        else if (index !== 0) {
            this.glDisableVertexAttribArray(index);
        }
    };
}
cc.glInvalidateStateCache = function () {
    cc.kmGLFreeAll();
    cc._currentProjectionMatrix = -1;
    if (cc.ENABLE_GL_STATE_CACHE) {
        cc._currentShaderProgram = -1;
        for (var i = 0; i < cc.MAX_ACTIVETEXTURE; i++) {
            cc._currentBoundTexture[i] = -1;
        }
        cc._blendingSource = -1;
        cc._blendingDest = -1;
        cc._GLServerState = 0;
    }
};
cc.glUseProgram = function (program) {
    if (program !== cc._currentShaderProgram) {
        cc._currentShaderProgram = program;
        cc._renderContext.useProgram(program);
    }
};
if(!cc.ENABLE_GL_STATE_CACHE){
    cc.glUseProgram = function (program) {
        cc._renderContext.useProgram(program);
    };
}
cc.glDeleteProgram = function (program) {
    if (cc.ENABLE_GL_STATE_CACHE) {
        if (program === cc._currentShaderProgram)
            cc._currentShaderProgram = -1;
    }
    gl.deleteProgram(program);
};
cc.glBlendFunc = function (sfactor, dfactor) {
    if ((sfactor !== cc._blendingSource) || (dfactor !== cc._blendingDest)) {
        cc._blendingSource = sfactor;
        cc._blendingDest = dfactor;
        cc.setBlending(sfactor, dfactor);
    }
};
cc.setBlending = function (sfactor, dfactor) {
    var ctx = cc._renderContext;
    if ((sfactor === ctx.ONE) && (dfactor === ctx.ZERO)) {
        ctx.disable(ctx.BLEND);
    } else {
        ctx.enable(ctx.BLEND);
        cc._renderContext.blendFunc(sfactor,dfactor);
    }
};
cc.glBlendFuncForParticle = function(sfactor, dfactor) {
    if ((sfactor !== cc._blendingSource) || (dfactor !== cc._blendingDest)) {
        cc._blendingSource = sfactor;
        cc._blendingDest = dfactor;
        var ctx = cc._renderContext;
        if ((sfactor === ctx.ONE) && (dfactor === ctx.ZERO)) {
            ctx.disable(ctx.BLEND);
        } else {
            ctx.enable(ctx.BLEND);
            ctx.blendFuncSeparate(ctx.SRC_ALPHA, dfactor, sfactor, dfactor);
        }
    }
};
if (!cc.ENABLE_GL_STATE_CACHE) {
    cc.glBlendFunc = cc.setBlending;
}
cc.glBlendResetToCache = function () {
    var ctx = cc._renderContext;
    ctx.blendEquation(ctx.FUNC_ADD);
    if (cc.ENABLE_GL_STATE_CACHE)
        cc.setBlending(cc._blendingSource, cc._blendingDest);
    else
        cc.setBlending(ctx.BLEND_SRC, ctx.BLEND_DST);
};
cc.setProjectionMatrixDirty = function () {
    cc._currentProjectionMatrix = -1;
};
cc.glBindTexture2D = function (textureId) {
    cc.glBindTexture2DN(0, textureId);
};
cc.glBindTexture2DN = function (textureUnit, textureId) {
    if (cc._currentBoundTexture[textureUnit] === textureId)
        return;
    cc._currentBoundTexture[textureUnit] = textureId;
    var ctx = cc._renderContext;
    ctx.activeTexture(ctx.TEXTURE0 + textureUnit);
    if(textureId)
        ctx.bindTexture(ctx.TEXTURE_2D, textureId._webTextureObj);
    else
        ctx.bindTexture(ctx.TEXTURE_2D, null);
};
if (!cc.ENABLE_GL_STATE_CACHE){
    cc.glBindTexture2DN = function (textureUnit, textureId) {
        var ctx = cc._renderContext;
        ctx.activeTexture(ctx.TEXTURE0 + textureUnit);
        if(textureId)
            ctx.bindTexture(ctx.TEXTURE_2D, textureId._webTextureObj);
        else
            ctx.bindTexture(ctx.TEXTURE_2D, null);
    };
}
cc.glDeleteTexture = function (textureId) {
    cc.glDeleteTextureN(0, textureId);
};
cc.glDeleteTextureN = function (textureUnit, textureId) {
    if (cc.ENABLE_GL_STATE_CACHE) {
        if (textureId === cc._currentBoundTexture[ textureUnit ])
            cc._currentBoundTexture[ textureUnit ] = -1;
    }
    cc._renderContext.deleteTexture(textureId);
};
cc.glBindVAO = function (vaoId) {
    if (!cc.TEXTURE_ATLAS_USE_VAO)
        return;
    if (cc.ENABLE_GL_STATE_CACHE) {
        if (cc._uVAO !== vaoId) {
            cc._uVAO = vaoId;
        }
    } else {
    }
};
cc.glEnable = function (flags) {
    if (cc.ENABLE_GL_STATE_CACHE) {
    } else {
    }
};

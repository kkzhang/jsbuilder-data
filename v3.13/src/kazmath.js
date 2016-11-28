cc.math = cc.math || {};
cc.math.EPSILON = 1.0 / 64.0;
cc.math.square = function(s){
    return s*s;
};
cc.math.almostEqual = function(lhs,rhs){
    return (lhs + cc.math.EPSILON > rhs && lhs - cc.math.EPSILON < rhs);
};
(function(cc){
    cc.math.Vec2 = function (x, y) {
        if(y === undefined){
            this.x = x.x;
            this.y = x.y;
        }else{
            this.x = x || 0;
            this.y = y || 0;
        }
    };
    var proto = cc.math.Vec2.prototype;
    proto.fill = function(x, y){
        this.x = x;
        this.y = y;
    };
    proto.length = function(){
        return Math.sqrt(cc.math.square(this.x) + cc.math.square(this.y));
    };
    proto.lengthSq = function(){
        return cc.math.square(this.x) + cc.math.square(this.y);
    };
    proto.normalize = function(){
        var l = 1.0 / this.length();
        this.x *= l;
        this.y *= l;
        return this;
    };
    cc.math.Vec2.add = function (pOut, pV1, pV2) {
        pOut.x = pV1.x + pV2.x;
        pOut.y = pV1.y + pV2.y;
        return pOut
    };
    proto.add = function(vec){
        this.x += vec.x;
        this.y += vec.y;
        return this;
    };
    proto.dot = function (vec) {
        return this.x * vec.x + this.y * vec.y;
    };
    cc.math.Vec2.subtract = function (pOut, pV1, pV2) {
        pOut.x = pV1.x - pV2.x;
        pOut.y = pV1.y - pV2.y;
        return pOut;
    };
    proto.subtract = function(vec){
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    };
    proto.transform = function (mat3) {
        var x = this.x, y = this.y;
        this.x = x * mat3.mat[0] + y * mat3.mat[3] + mat3.mat[6];
        this.y = x * mat3.mat[1] + y * mat3.mat[4] + mat3.mat[7];
        return this;
    };
    cc.math.Vec2.scale = function (pOut, pIn, s) {
        pOut.x = pIn.x * s;
        pOut.y = pIn.y * s;
        return pOut;
    };
    proto.scale = function(s) {
        this.x *= s;
        this.y *= s;
        return this;
    };
    proto.equals = function (vec) {
        return (this.x < vec.x + cc.math.EPSILON && this.x > vec.x - cc.math.EPSILON) &&
            (this.y < vec.y + cc.math.EPSILON && this.y > vec.y - cc.math.EPSILON);
    };
})(cc);
(function(cc) {
    cc.math.Vec3 = cc.kmVec3 = function (x, y, z) {
        if(x && y === undefined){
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
    };
    cc.math.vec3 = function(x, y, z){
        return new cc.math.Vec3(x, y, z);
    };
    var _p = cc.math.Vec3.prototype;
    _p.fill = function (x, y, z) {
        if (x && y === undefined) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        return this;
    };
    _p.length = function () {
        return Math.sqrt(cc.math.square(this.x) + cc.math.square(this.y) + cc.math.square(this.z));
    };
    _p.lengthSq = function () {
        return cc.math.square(this.x) + cc.math.square(this.y) + cc.math.square(this.z)
    };
    _p.normalize = function () {
        var l = 1.0 / this.length();
        this.x *= l;
        this.y *= l;
        this.z *= l;
        return this;
    };
    _p.cross = function (vec3) {
        var x = this.x, y = this.y, z = this.z;
        this.x = (y * vec3.z) - (z * vec3.y);
        this.y = (z * vec3.x) - (x * vec3.z);
        this.z = (x * vec3.y) - (y * vec3.x);
        return this;
    };
    _p.dot = function (vec) {
        return (  this.x * vec.x + this.y * vec.y + this.z * vec.z );
    };
    _p.add = function(vec){
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        return this;
    };
    _p.subtract = function (vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        return this;
    };
    _p.transform = function (mat4) {
        var x = this.x, y = this.y, z = this.z, mat = mat4.mat;
        this.x = x * mat[0] + y * mat[4] + z * mat[8] + mat[12];
        this.y = x * mat[1] + y * mat[5] + z * mat[9] + mat[13];
        this.z = x * mat[2] + y * mat[6] + z * mat[10] + mat[14];
        return this;
    };
    _p.transformNormal = function(mat4){
        var x = this.x, y = this.y, z = this.z, mat = mat4.mat;
        this.x = x * mat[0] + y * mat[4] + z * mat[8];
        this.y = x * mat[1] + y * mat[5] + z * mat[9];
        this.z = x * mat[2] + y * mat[6] + z * mat[10];
        return this;
    };
    _p.transformCoord = function(mat4){
        var v = new cc.math.Vec4(this.x, this.y, this.z, 1.0);
        v.transform(mat4);
        this.x = v.x / v.w;
        this.y = v.y / v.w;
        this.z = v.z / v.w;
        return this;
    };
    _p.scale = function(scale){
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    };
    _p.equals = function(vec){
        var EPSILON = cc.math.EPSILON;
        return (this.x < (vec.x + EPSILON) && this.x > (vec.x - EPSILON)) &&
            (this.y < (vec.y + EPSILON) && this.y > (vec.y - EPSILON)) &&
            (this.z < (vec.z + EPSILON) && this.z > (vec.z - EPSILON));
    };
    _p.inverseTransform = function(mat4){
        var mat = mat4.mat;
        var v1 = new cc.math.Vec3(this.x - mat[12], this.y - mat[13], this.z - mat[14]);
        this.x = v1.x * mat[0] + v1.y * mat[1] + v1.z * mat[2];
        this.y = v1.x * mat[4] + v1.y * mat[5] + v1.z * mat[6];
        this.z = v1.x * mat[8] + v1.y * mat[9] + v1.z * mat[10];
        return this;
    };
    _p.inverseTransformNormal = function(mat4){
        var x = this.x, y = this.y, z = this.z, mat = mat4.mat;
        this.x = x * mat[0] + y * mat[1] + z * mat[2];
        this.y = x * mat[4] + y * mat[5] + z * mat[6];
        this.z = x * mat[8] + y * mat[9] + z * mat[10];
        return this;
    };
    _p.assignFrom = function(vec){
        if(!vec)
            return this;
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
         return this;
    };
    cc.math.Vec3.zero = function(vec){
        vec.x = vec.y = vec.z = 0.0;
        return vec;
    };
    _p.toTypeArray = function(){
        var tyArr = new Float32Array(3);
        tyArr[0] = this.x;
        tyArr[1] = this.y;
        tyArr[2] = this.z;
        return tyArr;
    };
})(cc);
(function(cc) {
    cc.math.Vec4 = function (x, y, z, w) {
        if (x && y === undefined) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }
    };
    cc.kmVec4 = cc.math.Vec4;
    var proto = cc.math.Vec4.prototype;
    proto.fill = function (x, y, z, w) {
        if (x && y === undefined) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
    };
    proto.add = function(vec) {
        if(!vec)
            return this;
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        this.w += vec.w;
        return this;
    };
    proto.dot = function(vec){
        return ( this.x * vec.x + this.y * vec.y + this.z * vec.z + this.w * vec.w );
    };
    proto.length = function(){
        return Math.sqrt(cc.math.square(this.x) + cc.math.square(this.y) + cc.math.square(this.z) + cc.math.square(this.w));
    };
    proto.lengthSq = function(){
        return cc.math.square(this.x) + cc.math.square(this.y) + cc.math.square(this.z) + cc.math.square(this.w);
    };
    proto.lerp = function(vec, t){
        return this;
    };
    proto.normalize = function() {
        var l = 1.0 / this.length();
        this.x *= l;
        this.y *= l;
        this.z *= l;
        this.w *= l;
        return this;
    };
    proto.scale = function(scale){
        this.normalize();
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        this.w *= scale;
        return this;
    };
    proto.subtract = function(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        this.w -= vec.w;
    };
    proto.transform = function(mat4) {
        var x = this.x, y = this.y, z = this.z, w = this.w, mat = mat4.mat;
        this.x = x * mat[0] + y * mat[4] + z * mat[8] + w * mat[12];
        this.y = x * mat[1] + y * mat[5] + z * mat[9] + w * mat[13];
        this.z = x * mat[2] + y * mat[6] + z * mat[10] + w * mat[14];
        this.w = x * mat[3] + y * mat[7] + z * mat[11] + w * mat[15];
        return this;
    };
    cc.math.Vec4.transformArray = function(vecArray, mat4){
        var retArray = [];
        for (var i = 0; i < vecArray.length; i++) {
            var selVec = new cc.math.Vec4(vecArray[i]);
            selVec.transform(mat4);
            retArray.push(selVec);
        }
        return retArray;
    };
    proto.equals = function(vec){
       var EPSILON = cc.math.EPSILON;
        return (this.x < vec.x + EPSILON && this.x > vec.x - EPSILON) &&
            (this.y < vec.y + EPSILON && this.y > vec.y - EPSILON) &&
            (this.z < vec.z + EPSILON && this.z > vec.z - EPSILON) &&
            (this.w < vec.w + EPSILON && this.w > vec.w - EPSILON);
    };
    proto.assignFrom = function(vec) {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
        this.w = vec.w;
        return this;
    };
    proto.toTypeArray = function(){
        var tyArr = new Float32Array(4);
        tyArr[0] = this.x;
        tyArr[1] = this.y;
        tyArr[2] = this.z;
        tyArr[3] = this.w;
        return tyArr;
    };
})(cc);
(function(cc){
    cc.math.Ray2 = function (start, dir) {
        this.start = start || new cc.math.Vec2();
        this.dir = dir || new cc.math.Vec2();
    };
    cc.math.Ray2.prototype.fill = function (px, py, vx, vy) {
        this.start.x = px;
        this.start.y = py;
        this.dir.x = vx;
        this.dir.y = vy;
    };
    cc.math.Ray2.prototype.intersectLineSegment = function (p1, p2, intersection) {
        var x1 = this.start.x, y1 = this.start.y;
        var x2 = this.start.x + this.dir.x, y2 = this.start.y + this.dir.y;
        var x3 = p1.x, y3 = p1.y;
        var x4 = p2.x, y4 = p2.y;
        var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        var ua, x, y;
        if (denom > -cc.math.EPSILON && denom < cc.math.EPSILON)
            return false;
        ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
        x = x1 + ua * (x2 - x1);
        y = y1 + ua * (y2 - y1);
        if (x < Math.min(p1.x, p2.x) - cc.math.EPSILON ||
            x > Math.max(p1.x, p2.x) + cc.math.EPSILON ||
            y < Math.min(p1.y, p2.y) - cc.math.EPSILON ||
            y > Math.max(p1.y, p2.y) + cc.math.EPSILON) {
            return false;
        }
        if (x < Math.min(x1, x2) - cc.math.EPSILON ||
            x > Math.max(x1, x2) + cc.math.EPSILON ||
            y < Math.min(y1, y2) - cc.math.EPSILON ||
            y > Math.max(y1, y2) + cc.math.EPSILON) {
            return false;
        }
        intersection.x = x;
        intersection.y = y;
        return true;
    };
    function calculate_line_normal(p1, p2, normalOut){
        var tmp = new cc.math.Vec2(p2);
        tmp.subtract(p1);
        normalOut.x = -tmp.y;
        normalOut.y = tmp.x;
        normalOut.normalize();
    }
    cc.math.Ray2.prototype.intersectTriangle = function(p1, p2, p3, intersection, normal_out){
        var intersect = new cc.math.Vec2(), final_intersect = new cc.math.Vec2();
        var normal = new cc.math.Vec2(), distance = 10000.0, intersected = false;
        var this_distance;
        if(this.intersectLineSegment(p1, p2, intersect)) {
            intersected = true;
            this_distance = intersect.subtract(this.start).length();
            if(this_distance < distance) {
                final_intersect.x = intersect.x;
                final_intersect.y = intersect.y;
                distance = this_distance;
                calculate_line_normal(p1, p2, normal);
            }
        }
        if(this.intersectLineSegment(p2, p3, intersect)) {
            intersected = true;
            this_distance = intersect.subtract(this.start).length();
            if(this_distance < distance) {
                final_intersect.x = intersect.x;
                final_intersect.y = intersect.y;
                distance = this_distance;
                calculate_line_normal(p2, p3, normal);
            }
        }
        if(this.intersectLineSegment(p3, p1, intersect)) {
            intersected = true;
            this_distance = intersect.subtract(this.start).length();
            if(this_distance < distance) {
                final_intersect.x = intersect.x;
                final_intersect.y = intersect.y;
                distance = this_distance;
                calculate_line_normal(p3, p1, normal);
            }
        }
        if(intersected) {
            intersection.x = final_intersect.x;
            intersection.y = final_intersect.y;
            if(normal_out) {
                normal_out.x = normal.x;
                normal_out.y = normal.y;
            }
        }
        return intersected;
    };
})(cc);
window.Uint16Array = window.Uint16Array || window.Array;
window.Float32Array = window.Float32Array || window.Array;
(function(cc){
    cc.math.Matrix3 = function(mat3) {
        if (mat3 && mat3.mat) {
            this.mat = new Float32Array(mat3.mat);
        } else {
            this.mat = new Float32Array(9);
        }
    };
    cc.kmMat3 = cc.math.Matrix3;
    var _p = cc.math.Matrix3.prototype;
    _p.fill = function(mat3) {
        var mat = this.mat, matIn = mat3.mat;
        mat[0] = matIn[0];
        mat[1] = matIn[1];
        mat[2] = matIn[2];
        mat[3] = matIn[3];
        mat[4] = matIn[4];
        mat[5] = matIn[5];
        mat[6] = matIn[6];
        mat[7] = matIn[7];
        mat[8] = matIn[8];
        return this;
    };
    _p.adjugate = function(){
        var mat = this.mat;
        var m0 = mat[0], m1 = mat[1], m2 = mat[2], m3 = mat[3], m4 = mat[4],
            m5 = mat[5], m6 = mat[6], m7 = mat[7], m8 = mat[8];
        mat[0] = m4 * m8 - m5 * m7;
        mat[1] = m2 * m7 - m1 * m8;
        mat[2] = m1 * m5 - m2 * m4;
        mat[3] = m5 * m6 - m3 * m8;
        mat[4] = m0 * m8 - m2 * m6;
        mat[5] = m2 * m3 - m0 * m5;
        mat[6] = m3 * m7 - m4 * m6;
        mat[8] = m0 * m4 - m1 * m3;
        return this;
    };
    _p.identity = function() {
        var mat = this.mat;
        mat[1] = mat[2] = mat[3] =
            mat[5] = mat[6] = mat[7] = 0;
        mat[0] = mat[4] = mat[8] = 1.0;
        return this;
    };
    var tmpMatrix = new cc.math.Matrix3();
    _p.inverse = function(determinate){
        if (determinate === 0.0)
            return this;
        tmpMatrix.assignFrom(this);
        var detInv = 1.0 / determinate;
        this.adjugate();
        this.multiplyScalar(detInv);
        return this;
    };
    _p.isIdentity = function(){
        var mat = this.mat;
        return (mat[0] === 1 && mat[1] === 0 && mat[2] === 0
        && mat[3] === 0 && mat[4] === 1 && mat[5] === 0
        && mat[6] === 0 && mat[7] === 0 && mat[8] === 1);
    };
    _p.transpose = function(){
        var mat = this.mat;
        var  m1 = mat[1], m2 = mat[2], m3 = mat[3],  m5 = mat[5],
            m6 = mat[6], m7 = mat[7];
        mat[1] = m3;
        mat[2] = m6;
        mat[3] = m1;
        mat[5] = m7;
        mat[6] = m2;
        mat[7] = m5;
        return this;
    };
    _p.determinant = function(){
        var mat = this.mat;
        var output = mat[0] * mat[4] * mat[8] + mat[1] * mat[5] * mat[6] + mat[2] * mat[3] * mat[7];
        output -= mat[2] * mat[4] * mat[6] + mat[0] * mat[5] * mat[7] + mat[1] * mat[3] * mat[8];
        return output;
    };
    _p.multiply = function(mat3){
        var m1 = this.mat, m2 = mat3.mat;
        var a0 = m1[0], a1 = m1[1], a2 = m1[2], a3 = m1[3], a4 = m1[4], a5 = m1[5],
            a6 = m1[6], a7 = m1[7], a8 = m1[8];
        var b0 = m2[0], b1 = m2[1], b2 = m2[2], b3 = m2[3], b4 = m2[4], b5 = m2[5],
            b6 = m2[6], b7 = m2[7], b8 = m2[8];
        m1[0] = a0 * b0 + a3 * b1 + a6 * b2;
        m1[1] = a1 * b0 + a4 * b1 + a7 * b2;
        m1[2] = a2 * b0 + a5 * b1 + a8 * b2;
        m1[3] = a2 * b0 + a5 * b1 + a8 * b2;
        m1[4] = a1 * b3 + a4 * b4 + a7 * b5;
        m1[5] = a2 * b3 + a5 * b4 + a8 * b5;
        m1[6] = a0 * b6 + a3 * b7 + a6 * b8;
        m1[7] = a1 * b6 + a4 * b7 + a7 * b8;
        m1[8] = a2 * b6 + a5 * b7 + a8 * b8;
        return this;
    };
    _p.multiplyScalar = function(factor) {
        var mat = this.mat;
        mat[0] *= factor;
        mat[1] *= factor;
        mat[2] *= factor;
        mat[3] *= factor;
        mat[4] *= factor;
        mat[5] *= factor;
        mat[6] *= factor;
        mat[7] *= factor;
        mat[8] *= factor;
        return this;
    };
    cc.math.Matrix3.rotationAxisAngle = function(axis, radians) {
        var rcos = Math.cos(radians), rsin = Math.sin(radians);
        var retMat = new cc.math.Matrix3();
        var mat = retMat.mat;
        mat[0] = rcos + axis.x * axis.x * (1 - rcos);
        mat[1] = axis.z * rsin + axis.y * axis.x * (1 - rcos);
        mat[2] = -axis.y * rsin + axis.z * axis.x * (1 - rcos);
        mat[3] = -axis.z * rsin + axis.x * axis.y * (1 - rcos);
        mat[4] = rcos + axis.y * axis.y * (1 - rcos);
        mat[5] = axis.x * rsin + axis.z * axis.y * (1 - rcos);
        mat[6] = axis.y * rsin + axis.x * axis.z * (1 - rcos);
        mat[7] = -axis.x * rsin + axis.y * axis.z * (1 - rcos);
        mat[8] = rcos + axis.z * axis.z * (1 - rcos);
        return retMat;
    };
    _p.assignFrom = function(matIn){
        if(this === matIn) {
            cc.log("cc.math.Matrix3.assign(): current matrix equals matIn");
            return this;
        }
        var mat = this.mat, m2 = matIn.mat;
        mat[0] = m2[0];
        mat[1] = m2[1];
        mat[2] = m2[2];
        mat[3] = m2[3];
        mat[4] = m2[4];
        mat[5] = m2[5];
        mat[6] = m2[6];
        mat[7] = m2[7];
        mat[8] = m2[8];
        return this;
    };
    _p.equals = function(mat3) {
        if (this === mat3)
            return true;
        var EPSILON = cc.math.EPSILON,m1 = this.mat, m2 = mat3.mat;
        for (var i = 0; i < 9; ++i) {
            if (!(m1[i] + EPSILON > m2[i] && m1[i] - EPSILON < m2[i]))
                return false;
        }
        return true;
    };
    cc.math.Matrix3.createByRotationX = function(radians) {
        var retMat = new cc.math.Matrix3(), mat = retMat.mat;
        mat[0] = 1.0;
        mat[1] = 0.0;
        mat[2] = 0.0;
        mat[3] = 0.0;
        mat[4] = Math.cos(radians);
        mat[5] = Math.sin(radians);
        mat[6] = 0.0;
        mat[7] = -Math.sin(radians);
        mat[8] = Math.cos(radians);
        return retMat;
    };
    cc.math.Matrix3.createByRotationY = function(radians) {
        var retMat = new cc.math.Matrix3(), mat = retMat.mat;
        mat[0] = Math.cos(radians);
        mat[1] = 0.0;
        mat[2] = -Math.sin(radians);
        mat[3] = 0.0;
        mat[4] = 1.0;
        mat[5] = 0.0;
        mat[6] = Math.sin(radians);
        mat[7] = 0.0;
        mat[8] = Math.cos(radians);
        return retMat;
    };
    cc.math.Matrix3.createByRotationZ = function(radians) {
        var retMat = new cc.math.Matrix3(), mat = retMat.mat;
        mat[0] = Math.cos(radians);
        mat[1] = -Math.sin(radians);
        mat[2] = 0.0;
        mat[3] = Math.sin(radians);
        mat[4] = Math.cos(radians);
        mat[5] = 0.0;
        mat[6] = 0.0;
        mat[7] = 0.0;
        mat[8] = 1.0;
        return retMat;
    };
    cc.math.Matrix3.createByRotation = function(radians) {
        var retMat = new cc.math.Matrix3(), mat = retMat.mat;
        mat[0] = Math.cos(radians);
        mat[1] = Math.sin(radians);
        mat[2] = 0.0;
        mat[3] = -Math.sin(radians);
        mat[4] = Math.cos(radians);
        mat[5] = 0.0;
        mat[6] = 0.0;
        mat[7] = 0.0;
        mat[8] = 1.0;
        return retMat;
    };
    cc.math.Matrix3.createByScale = function(x, y) {
        var ret = new cc.math.Matrix3();
        ret.identity();
        ret.mat[0] = x;
        ret.mat[4] = y;
        return ret;
    };
    cc.math.Matrix3.createByTranslation = function(x, y){
        var ret = new cc.math.Matrix3();
        ret.identity();
        ret.mat[6] = x;
        ret.mat[7] = y;
        return ret;
    };
    cc.math.Matrix3.createByQuaternion = function(quaternion) {
        if(!quaternion)
            return null;
        var ret = new cc.math.Matrix3(), mat = ret.mat;
        mat[0] = 1.0 - 2.0 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z);
        mat[1] = 2.0 * (quaternion.x * quaternion.y - quaternion.w * quaternion.z);
        mat[2] = 2.0 * (quaternion.x * quaternion.z + quaternion.w * quaternion.y);
        mat[3] = 2.0 * (quaternion.x * quaternion.y + quaternion.w * quaternion.z);
        mat[4] = 1.0 - 2.0 * (quaternion.x * quaternion.x + quaternion.z * quaternion.z);
        mat[5] = 2.0 * (quaternion.y * quaternion.z - quaternion.w * quaternion.x);
        mat[6] = 2.0 * (quaternion.x * quaternion.z - quaternion.w * quaternion.y);
        mat[7] = 2.0 * (quaternion.y * quaternion.z + quaternion.w * quaternion.x);
        mat[8] = 1.0 - 2.0 * (quaternion.x * quaternion.x + quaternion.y * quaternion.y);
        return ret;
    };
    _p.rotationToAxisAngle = function() {
        return cc.math.Quaternion.rotationMatrix(this).toAxisAndAngle();
    }
})(cc);
(function(cc) {
    cc.math.Matrix4 = function (mat4) {
        if(mat4 && mat4.mat){
            this.mat = new Float32Array(mat4.mat);
        } else {
            this.mat = new Float32Array(16);
        }
    };
    cc.kmMat4 = cc.math.Matrix4;
    var proto = cc.math.Matrix4.prototype;
    proto.fill = function(scalarArr){
         var mat = this.mat;
        for(var i = 0; i < 16; i++){
            mat[i] = scalarArr[i];
        }
        return this;
    };
    cc.kmMat4Identity = function (pOut) {
        var mat = pOut.mat;
        mat[1] = mat[2] = mat[3] = mat[4] = mat[6] = mat[7]
            = mat[8] = mat[9] = mat[11] = mat[12] = mat[13] = mat[14] = 0;
        mat[0] = mat[5] = mat[10] = mat[15] = 1.0;
        return pOut;
    };
    proto.identity = function(){
        var mat = this.mat;
        mat[1] = mat[2] = mat[3] = mat[4] = mat[6] = mat[7]
            = mat[8] = mat[9] = mat[11] = mat[12] = mat[13] = mat[14] = 0;
        mat[0] = mat[5] = mat[10] = mat[15] = 1.0;
        return this;
    };
    proto.get = function(row, col){
        return this.mat[row + 4 * col];
    };
    proto.set = function(row, col, value){
        this.mat[row + 4 * col] = value;
    };
    proto.swap = function(r1, c1, r2, c2) {
        var mat = this.mat, tmp = mat[r1 + 4 * c1];
        mat[r1 + 4 * c1] = mat[r2 + 4 * c2];
        mat[r2 + 4 * c2] = tmp;
    };
    cc.math.Matrix4._gaussj = function (a, b) {
        var i, icol = 0, irow = 0, j, k, l, ll, n = 4, m = 4, selElement;
        var big, dumb, pivinv;
        var indxc = [0, 0, 0, 0], indxr = [0, 0, 0, 0], ipiv = [0, 0, 0, 0];
        for (i = 0; i < n; i++) {
            big = 0.0;
            for (j = 0; j < n; j++) {
                if (ipiv[j] !== 1) {
                    for (k = 0; k < n; k++) {
                        if (ipiv[k] === 0) {
                            selElement = Math.abs(a.get(j, k));
                            if (selElement >= big) {
                                big = selElement;
                                irow = j;
                                icol = k;
                            }
                        }
                    }
                }
            }
            ++(ipiv[icol]);
            if (irow !== icol) {
                for (l = 0; l < n; l++)
                    a.swap(irow, l, icol, l);
                for (l = 0; l < m; l++)
                    b.swap(irow, l, icol, l);
            }
            indxr[i] = irow;
            indxc[i] = icol;
            if (a.get(icol, icol) === 0.0)
                return false;
            pivinv = 1.0 / a.get(icol, icol);
            a.set(icol, icol, 1.0);
            for (l = 0; l < n; l++)
                a.set(icol, l, a.get(icol, l) * pivinv);
            for (l = 0; l < m; l++)
                b.set(icol, l, b.get(icol, l) * pivinv);
            for (ll = 0; ll < n; ll++) {
                if (ll !== icol) {
                    dumb = a.get(ll, icol);
                    a.set(ll, icol, 0.0);
                    for (l = 0; l < n; l++)
                        a.set(ll, l, a.get(ll, l) - a.get(icol, l) * dumb);
                    for (l = 0; l < m; l++)
                        b.set(ll, l, a.get(ll, l) - b.get(icol, l) * dumb);
                }
            }
        }
        for (l = n - 1; l >= 0; l--) {
            if (indxr[l] !== indxc[l]) {
                for (k = 0; k < n; k++)
                    a.swap(k, indxr[l], k, indxc[l]);
            }
        }
        return true;
    };
    var identityMatrix = new cc.math.Matrix4().identity();
    cc.kmMat4Inverse = function (pOut, pM) {
        var inv = new cc.math.Matrix4(pM);
        var tmp = new cc.math.Matrix4(identityMatrix);
        if (cc.math.Matrix4._gaussj(inv, tmp) === false)
            return null;
        pOut.assignFrom(inv);
        return pOut;
    };
    proto.inverse = function(){
        var inv = new cc.math.Matrix4(this);
        var tmp = new cc.math.Matrix4(identityMatrix);
        if (cc.math.Matrix4._gaussj(inv, tmp) === false)
            return null;
        return inv;
    };
    proto.isIdentity = function () {
        var mat = this.mat;
        return (mat[0] === 1 && mat[1] === 0 && mat[2] === 0 && mat[3] === 0
        && mat[4] === 0 && mat[5] === 1 && mat[6] === 0 && mat[7] === 0
        && mat[8] === 0 && mat[9] === 0 && mat[10] === 1 && mat[11] === 0
        && mat[12] === 0 && mat[13] === 0 && mat[14] === 0 && mat[15] === 1);
    };
    proto.transpose = function() {
        var mat = this.mat;
        var m1 = mat[1], m2 = mat[2], m3 = mat[3],
            m4 = mat[4], m6 = mat[6], m7 = mat[7],
            m8 = mat[8], m9 = mat[9], m11 = mat[11],
            m12 = mat[12], m13 = mat[13], m14 = mat[14];
        mat[1] = m4;
        mat[2] = m8;
        mat[3] = m12;
        mat[4] = m1;
        mat[6] = m9;
        mat[7] = m13;
        mat[8] = m2;
        mat[9] = m6;
        mat[11] = m14;
        mat[12] = m3;
        mat[13] = m7;
        mat[14] = m11;
        return this;
    };
    cc.kmMat4Multiply = function (pOut, pM1, pM2) {
        var outArray = pOut.mat, mat1 = pM1.mat, mat2 = pM2.mat;
        var a00 = mat1[0], a01 = mat1[1], a02 = mat1[2], a03 = mat1[3];
        var a10 = mat1[4], a11 = mat1[5], a12 = mat1[6], a13 = mat1[7];
        var a20 = mat1[8], a21 = mat1[9], a22 = mat1[10], a23 = mat1[11];
        var a30 = mat1[12], a31 = mat1[13], a32 = mat1[14], a33 = mat1[15];
        var b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3];
        var b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7];
        var b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11];
        var b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];
        outArray[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        outArray[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        outArray[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        outArray[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        outArray[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        outArray[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        outArray[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        outArray[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        outArray[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        outArray[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        outArray[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        outArray[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        outArray[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        outArray[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        outArray[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        outArray[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
        return pOut;
    };
    proto.multiply = function(mat4){
        var mat = this.mat, mat2 = mat4.mat;
        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
        var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
        var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
        var b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3];
        var b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7];
        var b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11];
        var b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];
        mat[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        mat[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        mat[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        mat[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        mat[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        mat[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        mat[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        mat[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        mat[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        mat[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        mat[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        mat[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        mat[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        mat[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        mat[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        mat[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
        return this;
    };
    cc.getMat4MultiplyValue = function (pM1, pM2) {
        var m1 = pM1.mat, m2 = pM2.mat;
        var mat = new Float32Array(16);
        mat[0] = m1[0] * m2[0] + m1[4] * m2[1] + m1[8] * m2[2] + m1[12] * m2[3];
        mat[1] = m1[1] * m2[0] + m1[5] * m2[1] + m1[9] * m2[2] + m1[13] * m2[3];
        mat[2] = m1[2] * m2[0] + m1[6] * m2[1] + m1[10] * m2[2] + m1[14] * m2[3];
        mat[3] = m1[3] * m2[0] + m1[7] * m2[1] + m1[11] * m2[2] + m1[15] * m2[3];
        mat[4] = m1[0] * m2[4] + m1[4] * m2[5] + m1[8] * m2[6] + m1[12] * m2[7];
        mat[5] = m1[1] * m2[4] + m1[5] * m2[5] + m1[9] * m2[6] + m1[13] * m2[7];
        mat[6] = m1[2] * m2[4] + m1[6] * m2[5] + m1[10] * m2[6] + m1[14] * m2[7];
        mat[7] = m1[3] * m2[4] + m1[7] * m2[5] + m1[11] * m2[6] + m1[15] * m2[7];
        mat[8] = m1[0] * m2[8] + m1[4] * m2[9] + m1[8] * m2[10] + m1[12] * m2[11];
        mat[9] = m1[1] * m2[8] + m1[5] * m2[9] + m1[9] * m2[10] + m1[13] * m2[11];
        mat[10] = m1[2] * m2[8] + m1[6] * m2[9] + m1[10] * m2[10] + m1[14] * m2[11];
        mat[11] = m1[3] * m2[8] + m1[7] * m2[9] + m1[11] * m2[10] + m1[15] * m2[11];
        mat[12] = m1[0] * m2[12] + m1[4] * m2[13] + m1[8] * m2[14] + m1[12] * m2[15];
        mat[13] = m1[1] * m2[12] + m1[5] * m2[13] + m1[9] * m2[14] + m1[13] * m2[15];
        mat[14] = m1[2] * m2[12] + m1[6] * m2[13] + m1[10] * m2[14] + m1[14] * m2[15];
        mat[15] = m1[3] * m2[12] + m1[7] * m2[13] + m1[11] * m2[14] + m1[15] * m2[15];
        return mat;
    };
    cc.kmMat4Assign = function (pOut, pIn) {
        if (pOut === pIn) {
            cc.log("cc.kmMat4Assign(): pOut equals pIn");
            return pOut;
        }
        var outArr = pOut.mat;
        var inArr = pIn.mat;
        outArr[0] = inArr[0];
        outArr[1] = inArr[1];
        outArr[2] = inArr[2];
        outArr[3] = inArr[3];
        outArr[4] = inArr[4];
        outArr[5] = inArr[5];
        outArr[6] = inArr[6];
        outArr[7] = inArr[7];
        outArr[8] = inArr[8];
        outArr[9] = inArr[9];
        outArr[10] = inArr[10];
        outArr[11] = inArr[11];
        outArr[12] = inArr[12];
        outArr[13] = inArr[13];
        outArr[14] = inArr[14];
        outArr[15] = inArr[15];
        return pOut;
    };
    proto.assignFrom = function(mat4) {
        if (this === mat4) {
            cc.log("cc.mat.Matrix4.assignFrom(): mat4 equals current matrix");
            return this;
        }
        var outArr = this.mat, inArr = mat4.mat;
        outArr[0] = inArr[0];
        outArr[1] = inArr[1];
        outArr[2] = inArr[2];
        outArr[3] = inArr[3];
        outArr[4] = inArr[4];
        outArr[5] = inArr[5];
        outArr[6] = inArr[6];
        outArr[7] = inArr[7];
        outArr[8] = inArr[8];
        outArr[9] = inArr[9];
        outArr[10] = inArr[10];
        outArr[11] = inArr[11];
        outArr[12] = inArr[12];
        outArr[13] = inArr[13];
        outArr[14] = inArr[14];
        outArr[15] = inArr[15];
        return this;
    };
    proto.equals = function(mat4) {
        if (this === mat4) {
            cc.log("cc.kmMat4AreEqual(): pMat1 and pMat2 are same object.");
            return true;
        }
        var matA = this.mat, matB = mat4.mat, EPSILON = cc.math.EPSILON;
        for (var i = 0; i < 16; i++) {
            if (!(matA[i] + EPSILON > matB[i] && matA[i] - EPSILON < matB[i]))
                return false;
        }
        return true;
    };
    cc.math.Matrix4.createByRotationX = function(radians, matrix) {
        matrix = matrix || new cc.math.Matrix4();
        var mat = matrix.mat;
        mat[0] = 1.0;
        mat[3] = mat[2] = mat[1] = 0.0;
        mat[4] = 0.0;
        mat[5] = Math.cos(radians);
        mat[6] = Math.sin(radians);
        mat[7] = 0.0;
        mat[8] = 0.0;
        mat[9] = -Math.sin(radians);
        mat[10] = Math.cos(radians);
        mat[11] = 0.0;
        mat[14] = mat[13] = mat[12] = 0.0;
        mat[15] = 1.0;
        return matrix;
    };
    cc.math.Matrix4.createByRotationY = function(radians, matrix) {
        matrix = matrix || new cc.math.Matrix4();
        var mat = matrix.mat;
        mat[0] = Math.cos(radians);
        mat[1] = 0.0;
        mat[2] = -Math.sin(radians);
        mat[3] = 0.0;
        mat[7] = mat[6] = mat[4] = 0.0;
        mat[5] = 1.0;
        mat[8] = Math.sin(radians);
        mat[9] = 0.0;
        mat[10] = Math.cos(radians);
        mat[11] = 0.0;
        mat[14] = mat[13] = mat[12] = 0.0;
        mat[15] = 1.0;
        return matrix;
    };
    cc.math.Matrix4.createByRotationZ = function(radians, matrix){
        matrix = matrix || new cc.math.Matrix4();
        var mat = matrix.mat;
        mat[0] = Math.cos(radians);
        mat[1] = Math.sin(radians);
        mat[3] = mat[2] = 0.0;
        mat[4] = -Math.sin(radians);
        mat[5] = Math.cos(radians);
        mat[7] = mat[6] = 0.0;
        mat[11] = mat[9] = mat[8] = 0.0;
        mat[10] = 1.0;
        mat[14] = mat[13] = mat[12] = 0.0;
        mat[15] = 1.0;
        return matrix;
    };
    cc.math.Matrix4.createByPitchYawRoll = function(pitch, yaw, roll, matrix) {
        matrix = matrix || new cc.math.Matrix4();
        var cr = Math.cos(pitch), sr = Math.sin(pitch);
        var cp = Math.cos(yaw), sp = Math.sin(yaw);
        var cy = Math.cos(roll), sy = Math.sin(roll);
        var srsp = sr * sp, crsp = cr * sp;
        var mat = matrix.mat;
        mat[0] = cp * cy;
        mat[4] = cp * sy;
        mat[8] = -sp;
        mat[1] = srsp * cy - cr * sy;
        mat[5] = srsp * sy + cr * cy;
        mat[9] = sr * cp;
        mat[2] = crsp * cy + sr * sy;
        mat[6] = crsp * sy - sr * cy;
        mat[10] = cr * cp;
        mat[3] = mat[7] = mat[11] = 0.0;
        mat[15] = 1.0;
        return matrix;
    };
    cc.math.Matrix4.createByQuaternion = function(quaternion, matrix) {
        matrix = matrix || new cc.math.Matrix4();
        var mat = matrix.mat;
        mat[0] = 1.0 - 2.0 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z );
        mat[1] = 2.0 * (quaternion.x * quaternion.y + quaternion.z * quaternion.w);
        mat[2] = 2.0 * (quaternion.x * quaternion.z - quaternion.y * quaternion.w);
        mat[3] = 0.0;
        mat[4] = 2.0 * ( quaternion.x * quaternion.y - quaternion.z * quaternion.w );
        mat[5] = 1.0 - 2.0 * ( quaternion.x * quaternion.x + quaternion.z * quaternion.z );
        mat[6] = 2.0 * (quaternion.z * quaternion.y + quaternion.x * quaternion.w );
        mat[7] = 0.0;
        mat[8] = 2.0 * ( quaternion.x * quaternion.z + quaternion.y * quaternion.w );
        mat[9] = 2.0 * ( quaternion.y * quaternion.z - quaternion.x * quaternion.w );
        mat[10] = 1.0 - 2.0 * ( quaternion.x * quaternion.x + quaternion.y * quaternion.y );
        mat[11] = 0.0;
        mat[14] = mat[13] = mat[12] = 0;
        mat[15] = 1.0;
        return matrix;
    };
    cc.math.Matrix4.createByRotationTranslation = function(rotation, translation, matrix) {
        matrix = matrix || new cc.math.Matrix4();
        var mat = matrix.mat, rMat = rotation.mat;
        mat[0] = rMat[0];
        mat[1] = rMat[1];
        mat[2] = rMat[2];
        mat[3] = 0.0;
        mat[4] = rMat[3];
        mat[5] = rMat[4];
        mat[6] = rMat[5];
        mat[7] = 0.0;
        mat[8] = rMat[6];
        mat[9] = rMat[7];
        mat[10] = rMat[8];
        mat[11] = 0.0;
        mat[12] = translation.x;
        mat[13] = translation.y;
        mat[14] = translation.z;
        mat[15] = 1.0;
        return matrix;
    };
    cc.math.Matrix4.createByScale = function(x, y, z, matrix) {
        matrix = matrix || new cc.math.Matrix4();
        var mat = matrix.mat;
        mat[0] = x;
        mat[5] = y;
        mat[10] = z;
        mat[15] = 1.0;
        mat[1] = mat[2] = mat[3] = mat[4] = mat[6] = mat[7] =
            mat[8] = mat[9] = mat[11] = mat[12] = mat[13] = mat[14] = 0;
         return matrix;
    };
    cc.kmMat4Translation = function (pOut, x, y, z) {
        pOut.mat[0] = pOut.mat[5] = pOut.mat[10] = pOut.mat[15] = 1.0;
        pOut.mat[1] = pOut.mat[2] = pOut.mat[3] =
            pOut.mat[4] = pOut.mat[6] = pOut.mat[7] =
                pOut.mat[8] = pOut.mat[9] = pOut.mat[11] = 0.0;
        pOut.mat[12] = x;
        pOut.mat[13] = y;
        pOut.mat[14] = z;
        return pOut;
    };
    cc.math.Matrix4.createByTranslation = function(x, y, z, matrix){
        matrix = matrix || new cc.math.Matrix4();
        matrix.identity();
        matrix.mat[12] = x;
        matrix.mat[13] = y;
        matrix.mat[14] = z;
        return matrix;
    };
    proto.getUpVec3 = function() {
        var mat = this.mat;
        var ret = new cc.math.Vec3(mat[4],mat[5], mat[6]);
        return ret.normalize();
    };
    proto.getRightVec3 = function(){
        var mat = this.mat;
        var ret = new cc.math.Vec3(mat[0],mat[1], mat[2]);
        return ret.normalize();
    };
    proto.getForwardVec3 = function() {
        var mat = this.mat;
        var ret = new cc.math.Vec3(mat[8],mat[9], mat[10]);
        return ret.normalize();
    };
    cc.kmMat4PerspectiveProjection = function (pOut, fovY, aspect, zNear, zFar) {
        var r = cc.degreesToRadians(fovY / 2);
        var deltaZ = zFar - zNear;
        var s = Math.sin(r);
        if (deltaZ === 0 || s === 0 || aspect === 0)
            return null;
        var cotangent = Math.cos(r) / s;
        pOut.identity();
        pOut.mat[0] = cotangent / aspect;
        pOut.mat[5] = cotangent;
        pOut.mat[10] = -(zFar + zNear) / deltaZ;
        pOut.mat[11] = -1;
        pOut.mat[14] = -2 * zNear * zFar / deltaZ;
        pOut.mat[15] = 0;
        return pOut;
    };
    cc.math.Matrix4.createPerspectiveProjection = function(fovY, aspect, zNear, zFar){
        var r = cc.degreesToRadians(fovY / 2), deltaZ = zFar - zNear;
        var s = Math.sin(r);
        if (deltaZ === 0 || s === 0 || aspect === 0)
            return null;
        var cotangent = Math.cos(r) / s;
        var matrix = new cc.math.Matrix4(), mat = matrix.mat;
        matrix.identity();
        mat[0] = cotangent / aspect;
        mat[5] = cotangent;
        mat[10] = -(zFar + zNear) / deltaZ;
        mat[11] = -1;
        mat[14] = -2 * zNear * zFar / deltaZ;
        mat[15] = 0;
        return matrix;
    };
    cc.kmMat4OrthographicProjection = function (pOut, left, right, bottom, top, nearVal, farVal) {
        pOut.identity();
        pOut.mat[0] = 2 / (right - left);
        pOut.mat[5] = 2 / (top - bottom);
        pOut.mat[10] = -2 / (farVal - nearVal);
        pOut.mat[12] = -((right + left) / (right - left));
        pOut.mat[13] = -((top + bottom) / (top - bottom));
        pOut.mat[14] = -((farVal + nearVal) / (farVal - nearVal));
        return pOut;
    };
    cc.math.Matrix4.createOrthographicProjection = function (left, right, bottom, top, nearVal, farVal) {
        var matrix = new cc.math.Matrix4(), mat = matrix.mat;
        matrix.identity();
        mat[0] = 2 / (right - left);
        mat[5] = 2 / (top - bottom);
        mat[10] = -2 / (farVal - nearVal);
        mat[12] = -((right + left) / (right - left));
        mat[13] = -((top + bottom) / (top - bottom));
        mat[14] = -((farVal + nearVal) / (farVal - nearVal));
        return matrix;
    };
    cc.kmMat4LookAt = function (pOut, pEye, pCenter, pUp) {
        var f = new cc.math.Vec3(pCenter), up = new cc.math.Vec3(pUp);
        f.subtract(pEye);
        f.normalize();
        up.normalize();
        var s = new cc.math.Vec3(f);
        s.cross(up);
        s.normalize();
        var u = new cc.math.Vec3(s);
        u.cross(f);
        s.normalize();
        pOut.identity();
        pOut.mat[0] = s.x;
        pOut.mat[4] = s.y;
        pOut.mat[8] = s.z;
        pOut.mat[1] = u.x;
        pOut.mat[5] = u.y;
        pOut.mat[9] = u.z;
        pOut.mat[2] = -f.x;
        pOut.mat[6] = -f.y;
        pOut.mat[10] = -f.z;
        var translate = cc.math.Matrix4.createByTranslation(-pEye.x, -pEye.y, -pEye.z);
        pOut.multiply(translate);
        return pOut;
    };
    var tempMatrix = new cc.math.Matrix4();
    proto.lookAt = function(eyeVec, centerVec, upVec) {
        var f = new cc.math.Vec3(centerVec), up = new cc.math.Vec3(upVec), mat = this.mat;
        f.subtract(eyeVec);
        f.normalize();
        up.normalize();
        var s = new cc.math.Vec3(f);
        s.cross(up);
        s.normalize();
        var u = new cc.math.Vec3(s);
        u.cross(f);
        s.normalize();
        this.identity();
        mat[0] = s.x;
        mat[4] = s.y;
        mat[8] = s.z;
        mat[1] = u.x;
        mat[5] = u.y;
        mat[9] = u.z;
        mat[2] = -f.x;
        mat[6] = -f.y;
        mat[10] = -f.z;
        tempMatrix = cc.math.Matrix4.createByTranslation(-eyeVec.x, -eyeVec.y, -eyeVec.z, tempMatrix);
        this.multiply(tempMatrix);
        return this;
    };
    cc.kmMat4RotationAxisAngle = function (pOut, axis, radians) {
        var rcos = Math.cos(radians), rsin = Math.sin(radians);
        var normalizedAxis = new cc.math.Vec3(axis);
        normalizedAxis.normalize();
        pOut.mat[0] = rcos + normalizedAxis.x * normalizedAxis.x * (1 - rcos);
        pOut.mat[1] = normalizedAxis.z * rsin + normalizedAxis.y * normalizedAxis.x * (1 - rcos);
        pOut.mat[2] = -normalizedAxis.y * rsin + normalizedAxis.z * normalizedAxis.x * (1 - rcos);
        pOut.mat[3] = 0.0;
        pOut.mat[4] = -normalizedAxis.z * rsin + normalizedAxis.x * normalizedAxis.y * (1 - rcos);
        pOut.mat[5] = rcos + normalizedAxis.y * normalizedAxis.y * (1 - rcos);
        pOut.mat[6] = normalizedAxis.x * rsin + normalizedAxis.z * normalizedAxis.y * (1 - rcos);
        pOut.mat[7] = 0.0;
        pOut.mat[8] = normalizedAxis.y * rsin + normalizedAxis.x * normalizedAxis.z * (1 - rcos);
        pOut.mat[9] = -normalizedAxis.x * rsin + normalizedAxis.y * normalizedAxis.z * (1 - rcos);
        pOut.mat[10] = rcos + normalizedAxis.z * normalizedAxis.z * (1 - rcos);
        pOut.mat[11] = 0.0;
        pOut.mat[12] = 0.0;
        pOut.mat[13] = 0.0;
        pOut.mat[14] = 0.0;
        pOut.mat[15] = 1.0;
        return pOut;
    };
    cc.math.Matrix4.createByAxisAndAngle = function(axis, radians, matrix) {
        matrix = matrix || new cc.math.Matrix4();
        var mat = this.mat, rcos = Math.cos(radians), rsin = Math.sin(radians) ;
        var normalizedAxis = new cc.math.Vec3(axis);
        normalizedAxis.normalize();
        mat[0] = rcos + normalizedAxis.x * normalizedAxis.x * (1 - rcos);
        mat[1] = normalizedAxis.z * rsin + normalizedAxis.y * normalizedAxis.x * (1 - rcos);
        mat[2] = -normalizedAxis.y * rsin + normalizedAxis.z * normalizedAxis.x * (1 - rcos);
        mat[3] = 0.0;
        mat[4] = -normalizedAxis.z * rsin + normalizedAxis.x * normalizedAxis.y * (1 - rcos);
        mat[5] = rcos + normalizedAxis.y * normalizedAxis.y * (1 - rcos);
        mat[6] = normalizedAxis.x * rsin + normalizedAxis.z * normalizedAxis.y * (1 - rcos);
        mat[7] = 0.0;
        mat[8] = normalizedAxis.y * rsin + normalizedAxis.x * normalizedAxis.z * (1 - rcos);
        mat[9] = -normalizedAxis.x * rsin + normalizedAxis.y * normalizedAxis.z * (1 - rcos);
        mat[10] = rcos + normalizedAxis.z * normalizedAxis.z * (1 - rcos);
        mat[11] = 0.0;
        mat[12] = mat[13] = mat[14] = 0.0;
        mat[15] = 1.0;
        return matrix;
    };
    proto.extractRotation = function(){
        var matrix = new cc.math.Matrix3(), mat4 = this.mat, mat3 = matrix.mat;
        mat3[0] = mat4[0];
        mat3[1] = mat4[1];
        mat3[2] = mat4[2];
        mat3[3] = mat4[4];
        mat3[4] = mat4[5];
        mat3[5] = mat4[6];
        mat3[6] = mat4[8];
        mat3[7] = mat4[9];
        mat3[8] = mat4[10];
        return matrix;
    };
    proto.extractPlane = function(planeType) {
        var plane = new cc.math.Plane(), mat = this.mat;
        switch (planeType) {
            case cc.math.Plane.RIGHT:
                plane.a = mat[3] - mat[0];
                plane.b = mat[7] - mat[4];
                plane.c = mat[11] - mat[8];
                plane.d = mat[15] - mat[12];
                break;
            case cc.math.Plane.LEFT:
                plane.a = mat[3] + mat[0];
                plane.b = mat[7] + mat[4];
                plane.c = mat[11] + mat[8];
                plane.d = mat[15] + mat[12];
                break;
            case cc.math.Plane.BOTTOM:
                plane.a = mat[3] + mat[1];
                plane.b = mat[7] + mat[5];
                plane.c = mat[11] + mat[9];
                plane.d = mat[15] + mat[13];
                break;
            case cc.math.Plane.TOP:
                plane.a = mat[3] - mat[1];
                plane.b = mat[7] - mat[5];
                plane.c = mat[11] - mat[9];
                plane.d = mat[15] - mat[13];
                break;
            case cc.math.Plane.FAR:
                plane.a = mat[3] - mat[2];
                plane.b = mat[7] - mat[6];
                plane.c = mat[11] - mat[10];
                plane.d = mat[15] - mat[14];
                break;
            case cc.math.Plane.NEAR:
                plane.a = mat[3] + mat[2];
                plane.b = mat[7] + mat[6];
                plane.c = mat[11] + mat[10];
                plane.d = mat[15] + mat[14];
                break;
            default:
                cc.log("cc.math.Matrix4.extractPlane: Invalid plane index");
                break;
        }
        var t = Math.sqrt(plane.a * plane.a + plane.b * plane.b + plane.c * plane.c);
        plane.a /= t;
        plane.b /= t;
        plane.c /= t;
        plane.d /= t;
        return plane;
    };
    proto.toAxisAndAngle = function() {
        var rotation = this.extractRotation();
        var temp = cc.math.Quaternion.rotationMatrix(rotation);
        return temp.toAxisAndAngle();
    };
})(cc);
(function(cc){
    cc.math.Plane = function (a, b, c, d) {
        if (a && b === undefined) {
            this.a = a.a;
            this.b = a.b;
            this.c = a.c;
            this.d = a.d;
        } else {
            this.a = a || 0;
            this.b = b || 0;
            this.c = c || 0;
            this.d = d || 0;
        }
    };
    cc.kmPlane = cc.math.Plane;
    var proto = cc.math.Plane.prototype;
    cc.math.Plane.LEFT = 0;
    cc.math.Plane.RIGHT = 1;
    cc.math.Plane.BOTTOM = 2;
    cc.math.Plane.TOP = 3;
    cc.math.Plane.NEAR = 4;
    cc.math.Plane.FAR = 5;
    cc.math.Plane.POINT_INFRONT_OF_PLANE = 0;
    cc.math.Plane.POINT_BEHIND_PLANE = 1;
    cc.math.Plane.POINT_ON_PLANE = 2;
    proto.dot = function(vec4){
        return (this.a * vec4.x + this.b * vec4.y + this.c * vec4.z + this.d * vec4.w);
    };
    proto.dotCoord = function(vec3) {
        return (this.a * vec3.x + this.b * vec3.y + this.c * vec3.z + this.d);
    };
    proto.dotNormal = function(vec3) {
        return (this.a * vec3.x + this.b * vec3.y + this.c * vec3.z);
    };
    cc.math.Plane.fromPointNormal = function(vec3, normal) {
        return new cc.math.Plane(normal.x, normal.y, normal.z, -normal.dot(vec3));
    };
    cc.math.Plane.fromPoints = function(vec1, vec2, vec3) {
        var  v1 = new cc.math.Vec3(vec2), v2 = new cc.math.Vec3(vec3), plane = new cc.math.Plane();
        v1.subtract(vec1);
        v2.subtract(vec1);
        v1.cross(v2);
        v1.normalize();
        plane.a = v1.x;
        plane.b = v1.y;
        plane.c = v1.z;
        plane.d = v1.scale(-1.0).dot(vec1);
        return plane;
    };
    proto.normalize = function(){
        var n = new cc.math.Vec3(this.a, this.b, this.c), l = 1.0 / n.length();
        n.normalize();
        this.a = n.x;
        this.b = n.y;
        this.c = n.z;
        this.d = this.d * l;
        return this;
    };
    proto.classifyPoint = function(vec3) {
        var distance = this.a * vec3.x + this.b * vec3.y + this.c * vec3.z + this.d;
        if(distance > 0.001)
            return cc.math.Plane.POINT_INFRONT_OF_PLANE;
        if(distance < -0.001)
            return cc.math.Plane.POINT_BEHIND_PLANE;
        return cc.math.Plane.POINT_ON_PLANE;
    };
})(cc);
(function(cc) {
    cc.math.Quaternion = function (x, y, z, w) {
        if (x && y === undefined) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }
    };
    cc.kmQuaternion = cc.math.Quaternion;
    var proto = cc.math.Quaternion.prototype;
    proto.conjugate = function (quaternion) {
        this.x = -quaternion.x;
        this.y = -quaternion.y;
        this.z = -quaternion.z;
        this.w = quaternion.w;
        return this;
    };
    proto.dot = function(quaternion) {
        return (this.w * quaternion.w + this.x * quaternion.x + this.y * quaternion.y + this.z * quaternion.z);
    };
    proto.exponential = function(){
        return this;
    };
    proto.identity = function(){
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
        this.w = 1.0;
        return this;
    };
    proto.inverse = function(){
        var len = this.length();
        if (Math.abs(len) > cc.math.EPSILON) {
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
            this.w = 0.0;
            return this;
        }
        this.conjugate(this).scale(1.0 / len);
        return this;
    };
    proto.isIdentity = function(){
        return (this.x === 0.0 && this.y === 0.0 && this.z === 0.0 && this.w === 1.0);
    };
    proto.length = function() {
        return Math.sqrt(this.lengthSq());
    };
    proto.lengthSq = function() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    };
    proto.multiply = function(quaternion) {
        var x = this.x, y = this.y, z = this.z, w = this.w;
        this.w = w * quaternion.w - x * quaternion.x - y * quaternion.y - z * quaternion.z;
        this.x = w * quaternion.x + x * quaternion.w + y * quaternion.z - z * quaternion.y;
        this.y = w * quaternion.y + y * quaternion.w + z * quaternion.x - x * quaternion.z;
        this.z = w * quaternion.z + z * quaternion.w + x * quaternion.y - y * quaternion.x;
        return this;
    };
    proto.normalize = function(){
        var length = this.length();
        if (Math.abs(length) <= cc.math.EPSILON)
            throw new Error("current quaternion is an invalid value");
        this.scale(1.0 / length);
        return this;
    };
    proto.rotationAxis = function(axis, angle){
        var rad = angle * 0.5, scale = Math.sin(rad);
        this.w = Math.cos(rad);
        this.x = axis.x * scale;
        this.y = axis.y * scale;
        this.z = axis.z * scale;
        return this;
    };
    cc.math.Quaternion.rotationMatrix = function (mat3) {
        if (!mat3)
            return null;
        var x, y, z, w;
        var m4x4 = [], mat = mat3.mat, scale = 0.0;
        m4x4[0] = mat[0];
        m4x4[1] = mat[3];
        m4x4[2] = mat[6];
        m4x4[4] = mat[1];
        m4x4[5] = mat[4];
        m4x4[6] = mat[7];
        m4x4[8] = mat[2];
        m4x4[9] = mat[5];
        m4x4[10] = mat[8];
        m4x4[15] = 1;
        var pMatrix = m4x4[0];
        var diagonal = pMatrix[0] + pMatrix[5] + pMatrix[10] + 1;
        if (diagonal > cc.math.EPSILON) {
            scale = Math.sqrt(diagonal) * 2;
            x = ( pMatrix[9] - pMatrix[6] ) / scale;
            y = ( pMatrix[2] - pMatrix[8] ) / scale;
            z = ( pMatrix[4] - pMatrix[1] ) / scale;
            w = 0.25 * scale;
        } else {
            if (pMatrix[0] > pMatrix[5] && pMatrix[0] > pMatrix[10]) {
                scale = Math.sqrt(1.0 + pMatrix[0] - pMatrix[5] - pMatrix[10]) * 2.0;
                x = 0.25 * scale;
                y = (pMatrix[4] + pMatrix[1] ) / scale;
                z = (pMatrix[2] + pMatrix[8] ) / scale;
                w = (pMatrix[9] - pMatrix[6] ) / scale;
            }
            else if (pMatrix[5] > pMatrix[10]) {
                scale = Math.sqrt(1.0 + pMatrix[5] - pMatrix[0] - pMatrix[10]) * 2.0;
                x = (pMatrix[4] + pMatrix[1] ) / scale;
                y = 0.25 * scale;
                z = (pMatrix[9] + pMatrix[6] ) / scale;
                w = (pMatrix[2] - pMatrix[8] ) / scale;
            } else {
                scale = Math.sqrt(1.0 + pMatrix[10] - pMatrix[0] - pMatrix[5]) * 2.0;
                x = (pMatrix[2] + pMatrix[8] ) / scale;
                y = (pMatrix[9] + pMatrix[6] ) / scale;
                z = 0.25 * scale;
                w = (pMatrix[4] - pMatrix[1] ) / scale;
            }
        }
        return new cc.math.Quaternion(x, y, z, w);
    };
    cc.math.Quaternion.rotationYawPitchRoll = function (yaw, pitch, roll) {
        var ex, ey, ez;
        var cr, cp, cy, sr, sp, sy, cpcy, spsy;
        ex = cc.degreesToRadians(pitch) / 2.0;
        ey = cc.degreesToRadians(yaw) / 2.0;
        ez = cc.degreesToRadians(roll) / 2.0;
        cr = Math.cos(ex);
        cp = Math.cos(ey);
        cy = Math.cos(ez);
        sr = Math.sin(ex);
        sp = Math.sin(ey);
        sy = Math.sin(ez);
        cpcy = cp * cy;
        spsy = sp * sy;
        var ret = new cc.math.Quaternion();
        ret.w = cr * cpcy + sr * spsy;
        ret.x = sr * cpcy - cr * spsy;
        ret.y = cr * sp * cy + sr * cp * sy;
        ret.z = cr * cp * sy - sr * sp * cy;
        ret.normalize();
        return ret;
    };
    proto.slerp = function(quaternion, t) {
        if (this.x === quaternion.x && this.y === quaternion.y && this.z === quaternion.z && this.w === quaternion.w) {
            return this;
        }
        var ct = this.dot(quaternion), theta = Math.acos(ct), st = Math.sqrt(1.0 - cc.math.square(ct));
        var stt = Math.sin(t * theta) / st, somt = Math.sin((1.0 - t) * theta) / st;
        var temp2 = new cc.math.Quaternion(quaternion);
        this.scale(somt);
        temp2.scale(stt);
        this.add(temp2);
        return this;
    };
    proto.toAxisAndAngle = function(){
        var tempAngle;
        var scale;
        var retAngle, retAxis = new cc.math.Vec3();
        tempAngle = Math.acos(this.w);
        scale = Math.sqrt(cc.math.square(this.x) + cc.math.square(this.y) + cc.math.square(this.z));
        if (((scale > -cc.math.EPSILON) && scale < cc.math.EPSILON)
            || (scale < 2 * Math.PI + cc.math.EPSILON && scale > 2 * Math.PI - cc.math.EPSILON)) {
            retAngle = 0.0;
            retAxis.x = 0.0;
            retAxis.y = 0.0;
            retAxis.z = 1.0;
        } else {
            retAngle = tempAngle * 2.0;
            retAxis.x = this.x / scale;
            retAxis.y = this.y / scale;
            retAxis.z = this.z / scale;
            retAxis.normalize();
        }
         return {axis: retAxis, angle: retAngle};
    };
    proto.scale = function(scale) {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        this.w *= scale;
        return this;
    };
    proto.assignFrom = function(quaternion){
        this.x = quaternion.x;
        this.y = quaternion.y;
        this.z = quaternion.z;
        this.w = quaternion.w;
        return this;
    };
    proto.add = function(quaternion) {
        this.x += quaternion.x;
        this.y += quaternion.y;
        this.z += quaternion.z;
        this.w += quaternion.w;
        return this;
    };
    cc.math.Quaternion.rotationBetweenVec3 = function(vec1, vec2, fallback) {
        var v1 = new cc.math.Vec3(vec1), v2 = new cc.math.Vec3(vec2);
        v1.normalize();
        v2.normalize();
        var a = v1.dot(v2), quaternion = new cc.math.Quaternion();
        if (a >= 1.0) {
            quaternion.identity();
            return quaternion;
        }
        if (a < (1e-6 - 1.0)) {
            if (Math.abs(fallback.lengthSq()) < cc.math.EPSILON) {
                quaternion.rotationAxis(fallback, Math.PI);
            } else {
                var axis = new cc.math.Vec3(1.0, 0.0, 0.0);
                axis.cross(vec1);
                if (Math.abs(axis.lengthSq()) < cc.math.EPSILON) {
                    axis.fill(0.0, 1.0, 0.0);
                    axis.cross(vec1);
                }
                axis.normalize();
                quaternion.rotationAxis(axis, Math.PI);
            }
        } else {
            var s = Math.sqrt((1 + a) * 2), invs = 1 / s;
            v1.cross(v2);
            quaternion.x = v1.x * invs;
            quaternion.y = v1.y * invs;
            quaternion.z = v1.z * invs;
            quaternion.w = s * 0.5;
            quaternion.normalize();
        }
        return quaternion;
    };
    proto.multiplyVec3 = function(vec){
        var x = this.x, y = this.y, z = this.z, retVec = new cc.math.Vec3(vec);
        var uv = new cc.math.Vec3(x, y, z), uuv = new cc.math.Vec3(x, y, z);
        uv.cross(vec);
        uuv.cross(uv);
        uv.scale((2.0 * q.w));
        uuv.scale(2.0);
        retVec.add(uv);
        retVec.add(uuv);
        return retVec;
    };
})(cc);
cc.math.AABB = function (min, max) {
    this.min = min || new cc.math.Vec3();
    this.max = max || new cc.math.Vec3();
};
cc.math.AABB.prototype.containsPoint = function (point) {
    return (point.x >= this.min.x && point.x <= this.max.x &&
    point.y >= this.min.y && point.y <= this.max.y &&
    point.z >= this.min.z && point.z <= this.max.z);
};
cc.math.AABB.containsPoint = function (pPoint, pBox) {
    return (pPoint.x >= pBox.min.x && pPoint.x <= pBox.max.x &&
        pPoint.y >= pBox.min.y && pPoint.y <= pBox.max.y &&
        pPoint.z >= pBox.min.z && pPoint.z <= pBox.max.z);
};
cc.math.AABB.prototype.assignFrom = function(aabb){
    this.min.assignFrom(aabb.min);
    this.max.assignFrom(aabb.max);
};
cc.math.AABB.assign = function (pOut, pIn) {
    pOut.min.assignFrom(pIn.min);
    pOut.max.assignFrom(pIn.max);
    return pOut;
};
(function(cc){
    cc.math.Matrix4Stack = function(top, stack) {
        this.top = top;
        this.stack = stack || [];
    };
    cc.km_mat4_stack = cc.math.Matrix4Stack;
    var proto = cc.math.Matrix4Stack.prototype;
    proto.initialize = function() {
        this.stack.length = 0;
        this.top = null;
    };
    cc.km_mat4_stack_push = function(stack, item){
        stack.stack.push(stack.top);
        stack.top = new cc.math.Matrix4(item);
    };
    cc.km_mat4_stack_pop = function(stack, pOut){
        stack.top = stack.stack.pop();
    };
    cc.km_mat4_stack_release = function(stack){
        stack.stack = null;
        stack.top = null;
    };
    proto.push = function(item) {
        item = item || this.top;
        this.stack.push(this.top);
        this.top = new cc.math.Matrix4(item);
    };
    proto.pop = function() {
        this.top = this.stack.pop();
    };
    proto.release = function(){
        this.stack = null;
        this.top = null;
        this._matrixPool = null;
    };
    proto._getFromPool = function (item) {
        var pool = this._matrixPool;
        if (pool.length === 0)
            return new cc.math.Matrix4(item);
        var ret = pool.pop();
        ret.assignFrom(item);
        return ret;
    };
    proto._putInPool = function(matrix){
        this._matrixPool.push(matrix);
    };
})(cc);
(function(cc) {
    cc.KM_GL_MODELVIEW = 0x1700;
    cc.KM_GL_PROJECTION = 0x1701;
    cc.KM_GL_TEXTURE = 0x1702;
    cc.modelview_matrix_stack = new cc.math.Matrix4Stack();
    cc.projection_matrix_stack = new cc.math.Matrix4Stack();
    cc.texture_matrix_stack = new cc.math.Matrix4Stack();
    cc.current_stack = null;
    var initialized = false;
    cc.lazyInitialize = function () {
        if (!initialized) {
            var identity = new cc.math.Matrix4();
            cc.modelview_matrix_stack.initialize();
            cc.projection_matrix_stack.initialize();
            cc.texture_matrix_stack.initialize();
            cc.current_stack = cc.modelview_matrix_stack;
            cc.initialized = true;
            identity.identity();
            cc.modelview_matrix_stack.push(identity);
            cc.projection_matrix_stack.push(identity);
            cc.texture_matrix_stack.push(identity);
        }
    };
    cc.lazyInitialize();
    cc.kmGLFreeAll = function () {
        cc.modelview_matrix_stack.release();
        cc.modelview_matrix_stack = null;
        cc.projection_matrix_stack.release();
        cc.projection_matrix_stack = null;
        cc.texture_matrix_stack.release();
        cc.texture_matrix_stack = null;
        cc.initialized = false;
        cc.current_stack = null;
    };
    cc.kmGLPushMatrix = function () {
        cc.current_stack.push(cc.current_stack.top);
    };
    cc.kmGLPushMatrixWitMat4 = function (saveMat) {
        cc.current_stack.stack.push(cc.current_stack.top);
        saveMat.assignFrom(cc.current_stack.top);
        cc.current_stack.top = saveMat;
    };
    cc.kmGLPopMatrix = function () {
        cc.current_stack.top = cc.current_stack.stack.pop();
    };
    cc.kmGLMatrixMode = function (mode) {
        switch (mode) {
            case cc.KM_GL_MODELVIEW:
                cc.current_stack = cc.modelview_matrix_stack;
                break;
            case cc.KM_GL_PROJECTION:
                cc.current_stack = cc.projection_matrix_stack;
                break;
            case cc.KM_GL_TEXTURE:
                cc.current_stack = cc.texture_matrix_stack;
                break;
            default:
                throw new Error("Invalid matrix mode specified");
                break;
        }
    };
    cc.kmGLLoadIdentity = function () {
        cc.current_stack.top.identity();
    };
    cc.kmGLLoadMatrix = function (pIn) {
        cc.current_stack.top.assignFrom(pIn);
    };
    cc.kmGLMultMatrix = function (pIn) {
        cc.current_stack.top.multiply(pIn);
    };
    var tempMatrix = new cc.math.Matrix4();
    cc.kmGLTranslatef = function (x, y, z) {
        var translation = cc.math.Matrix4.createByTranslation(x, y, z, tempMatrix);
        cc.current_stack.top.multiply(translation);
    };
    var tempVector3 = new cc.math.Vec3();
    cc.kmGLRotatef = function (angle, x, y, z) {
        tempVector3.fill(x, y, z);
        var rotation = cc.math.Matrix4.createByAxisAndAngle(tempVector3, cc.degreesToRadians(angle), tempMatrix);
        cc.current_stack.top.multiply(rotation);
    };
    cc.kmGLScalef = function (x, y, z) {
        var scaling = cc.math.Matrix4.createByScale(x, y, z, tempMatrix);
        cc.current_stack.top.multiply(scaling);
    };
    cc.kmGLGetMatrix = function (mode, pOut) {
        switch (mode) {
            case cc.KM_GL_MODELVIEW:
                pOut.assignFrom(cc.modelview_matrix_stack.top);
                break;
            case cc.KM_GL_PROJECTION:
                pOut.assignFrom(cc.projection_matrix_stack.top);
                break;
            case cc.KM_GL_TEXTURE:
                pOut.assignFrom(cc.texture_matrix_stack.top);
                break;
            default:
                throw new Error("Invalid matrix mode specified");
                break;
        }
    };
})(cc);

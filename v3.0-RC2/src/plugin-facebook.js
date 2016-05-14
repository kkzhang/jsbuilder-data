/*
 -header

 ! JSON v3.2.3 | http://bestiejs.github.com/json3 | Copyright 2012, Kit Cambridge | http://kit.mit-license.org
 */
try {
    window.FB || function (window) {
        var self = window, document = window.document;
        var setTimeout = window.setTimeout, setInterval = window.setInterval, clearTimeout = window.clearTimeout, clearInterval = window.clearInterval;
        var __DEV__ = 0;

        function emptyFunction() {
        }

        var __w, __t;
        __t = function (a) {
            return a[0]
        };
        __w = function (a) {
            return a
        };
        var require, __d;
        (function (a) {
            var b = {}, c = {}, d = ["global", "require", "requireDynamic", "requireLazy", "module", "exports"];
            require = function (e, f) {
                if (c.hasOwnProperty(e))return c[e];
                if (!b.hasOwnProperty(e)) {
                    if (f)return null;
                    throw new Error("Module " + e + " has not been defined");
                }
                var g = b[e], h = g.deps, i = h.length, j, k = [];
                for (var l = 0; l < i; l++) {
                    switch (h[l]) {
                        case "module":
                            j = g;
                            break;
                        case "exports":
                            j = g.exports;
                            break;
                        case "global":
                            j = a;
                            break;
                        case "require":
                            j = require;
                            break;
                        case "requireDynamic":
                            j = require;
                            break;
                        case "requireLazy":
                            j = null;
                            break;
                        default:
                            j = require.call(null, h[l])
                    }
                    k.push(j)
                }
                g.factory.apply(a, k);
                c[e] = g.exports;
                return g.exports
            };
            __d = function (e, f, g, h) {
                if (typeof g == "function") {
                    b[e] = {factory: g, deps: d.concat(f), exports: {}};
                    if (h ===
                        3)require.call(null, e)
                } else c[e] = g
            }
        })(this);
        __d("ES5ArrayPrototype", [], function (a, b, c, d, e, f) {
            var g = {};
            g.map = function (h, i) {
                if (typeof h != "function")throw new TypeError;
                var j, k = this.length, l = new Array(k);
                for (j = 0; j < k; ++j)if (j in this)l[j] = h.call(i, this[j], j, this);
                return l
            };
            g.forEach = function (h, i) {
                g.map.call(this, h, i)
            };
            g.filter = function (h, i) {
                if (typeof h != "function")throw new TypeError;
                var j, k, l = this.length, m = [];
                for (j = 0; j < l; ++j)if (j in this) {
                    k = this[j];
                    if (h.call(i, k, j, this))m.push(k)
                }
                return m
            };
            g.every = function (h, i) {
                if (typeof h != "function")throw new TypeError;
                var j = new Object(this), k = j.length;
                for (var l = 0; l < k; l++)if (l in j)if (!h.call(i, j[l], l, j))return false;
                return true
            };
            g.some = function (h, i) {
                if (typeof h != "function")throw new TypeError;
                var j = new Object(this), k = j.length;
                for (var l = 0; l < k; l++)if (l in j)if (h.call(i, j[l], l, j))return true;
                return false
            };
            g.indexOf = function (h, i) {
                var j = this.length;
                i |= 0;
                if (i < 0)i += j;
                for (; i < j; i++)if (i in this && this[i] === h)return i;
                return-1
            };
            e.exports = g
        }, null);
        __d("ES5FunctionPrototype", [],
            function (a, b, c, d, e, f) {
                var g = {};
                g.bind = function (h) {
                    if (typeof this != "function")throw new TypeError("Bind must be called on a function");
                    var i = this, j = Array.prototype.slice.call(arguments, 1);

                    function k() {
                        return i.apply(h, j.concat(Array.prototype.slice.call(arguments)))
                    }

                    k.displayName = "bound:" + (i.displayName || i.name || "(?)");
                    k.toString = function l() {
                        return"bound: " + i
                    };
                    return k
                };
                e.exports = g
            }, null);
        __d("ES5StringPrototype", [], function (a, b, c, d, e, f) {
            var g = {};
            g.trim = function () {
                if (this == null)throw new TypeError("String.prototype.trim called on null or undefined");
                return String.prototype.replace.call(this, /^\s+|\s+$/g, "")
            };
            g.startsWith = function (h) {
                var i = String(this);
                if (this == null)throw new TypeError("String.prototype.startsWith called on null or undefined");
                var j = arguments.length > 1 ? Number(arguments[1]) : 0;
                if (isNaN(j))j = 0;
                var k = Math.min(Math.max(j, 0), i.length);
                return i.indexOf(String(h), j) == k
            };
            g.endsWith = function (h) {
                var i = String(this);
                if (this == null)throw new TypeError("String.prototype.endsWith called on null or undefined");
                var j = i.length, k = String(h), l = arguments.length >
                    1 ? Number(arguments[1]) : j;
                if (isNaN(l))l = 0;
                var m = Math.min(Math.max(l, 0), j), n = m - k.length;
                if (n < 0)return false;
                return i.lastIndexOf(k, n) == n
            };
            g.contains = function (h) {
                if (this == null)throw new TypeError("String.prototype.contains called on null or undefined");
                var i = String(this), j = arguments.length > 1 ? Number(arguments[1]) : 0;
                if (isNaN(j))j = 0;
                return i.indexOf(String(h), j) != -1
            };
            g.repeat = function (h) {
                if (this == null)throw new TypeError("String.prototype.repeat called on null or undefined");
                var i = String(this), j = h ? Number(h) :
                    0;
                if (isNaN(j))j = 0;
                if (j < 0 || j === Infinity)throw RangeError();
                if (j === 1)return i;
                if (j === 0)return"";
                var k = "";
                while (j) {
                    if (j & 1)k += i;
                    if (j >>= 1)i += i
                }
                return k
            };
            e.exports = g
        }, null);
        __d("ES5Array", [], function (a, b, c, d, e, f) {
            var g = {};
            g.isArray = function (h) {
                return Object.prototype.toString.call(h) == "[object Array]"
            };
            e.exports = g
        }, null);
        __d("ES5Object", [], function (a, b, c, d, e, f) {
            var g = {};
            g.create = function (h) {
                var i = typeof h;
                if (i != "object" && i != "function")throw new TypeError("Object prototype may only be a Object or null");
                var j = new Function;
                j.prototype = h;
                return new j
            };
            g.keys = function (h) {
                var i = typeof h;
                if (i != "object" && i != "function" || h === null)throw new TypeError("Object.keys called on non-object");
                var j = [];
                for (var k in h)if (Object.prototype.hasOwnProperty.call(h, k))j.push(k);
                var l = !{toString: true}.propertyIsEnumerable("toString"), m = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "prototypeIsEnumerable", "constructor"];
                if (l)for (var n = 0; n < m.length; n++) {
                    var o = m[n];
                    if (Object.prototype.hasOwnProperty.call(h,
                        o))j.push(o)
                }
                return j
            };
            e.exports = g
        }, null);
        __d("ES5Date", [], function (a, b, c, d, e, f) {
            var g = {};
            g.now = function () {
                return(new Date).getTime()
            };
            e.exports = g
        }, null);
        __d("JSON3", [], function (a, b, c, d, e, f) {
            (function () {
                var g = {}.toString, h, i, j, k = e.exports = {}, l = '{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}', m, n, o, p, q, r, s, t, u, v, w, x, y, z, aa, ba = new Date(-0xc782b5b800cec), ca, da, ea;
                try {
                    ba = ba.getUTCFullYear() == -109252 && ba.getUTCMonth() === 0 && ba.getUTCDate() == 1 && ba.getUTCHours() == 10 && ba.getUTCMinutes() == 37 && ba.getUTCSeconds() ==
                        6 && ba.getUTCMilliseconds() == 708
                } catch (fa) {
                }
                if (!ba) {
                    ca = Math.floor;
                    da = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
                    ea = function (ga, ha) {
                        return da[ha] + 365 * (ga - 1970) + ca((ga - 1969 + (ha = +(ha > 1))) / 4) - ca((ga - 1901 + ha) / 100) + ca((ga - 1601 + ha) / 400)
                    }
                }
                if (typeof JSON == "object" && JSON) {
                    k.stringify = JSON.stringify;
                    k.parse = JSON.parse
                }
                if (m = typeof k.stringify == "function" && !ea) {
                    (ba = function () {
                        return 1
                    }).toJSON = ba;
                    try {
                        m = k.stringify(0) === "0" && k.stringify(new Number) === "0" && k.stringify(new String) == '""' && k.stringify(g) === j && k.stringify(j) ===
                            j && k.stringify() === j && k.stringify(ba) === "1" && k.stringify([ba]) == "[1]" && k.stringify([j]) == "[null]" && k.stringify(null) == "null" && k.stringify([j, g, null]) == "[null,null,null]" && k.stringify({result: [ba, true, false, null, "\x00\b\n\f\r\t"]}) == l && k.stringify(null, ba) === "1" && k.stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" && k.stringify(new Date(-864E13)) == '"-271821-04-20T00:00:00.000Z"' && k.stringify(new Date(864E13)) == '"+275760-09-13T00:00:00.000Z"' && k.stringify(new Date(-621987552E5)) == '"-000001-01-01T00:00:00.000Z"' &&
                            k.stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"'
                    } catch (fa) {
                        m = false
                    }
                }
                if (typeof k.parse == "function")try {
                    if (k.parse("0") === 0 && !k.parse(false)) {
                        ba = k.parse(l);
                        if (r = ba.A.length == 5 && ba.A[0] == 1) {
                            try {
                                r = !k.parse('"\t"')
                            } catch (fa) {
                            }
                            if (r)try {
                                r = k.parse("01") != 1
                            } catch (fa) {
                            }
                        }
                    }
                } catch (fa) {
                    r = false
                }
                ba = l = null;
                if (!m || !r) {
                    if (!(h = {}.hasOwnProperty))h = function (ga) {
                        var ha = {}, ia;
                        if ((ha.__proto__ = null, ha.__proto__ = {toString: 1}, ha).toString != g)h = function (ja) {
                            var ka = this.__proto__, la = ja in(this.__proto__ = null, this);
                            this.__proto__ =
                                ka;
                            return la
                        }; else {
                            ia = ha.constructor;
                            h = function (ja) {
                                var ka = (this.constructor || ia).prototype;
                                return ja in this && !(ja in ka && this[ja] === ka[ja])
                            }
                        }
                        ha = null;
                        return h.call(this, ga)
                    };
                    i = function (ga, ha) {
                        var ia = 0, ja, ka, la, ma;
                        (ja = function () {
                            this.valueOf = 0
                        }).prototype.valueOf = 0;
                        ka = new ja;
                        for (la in ka)if (h.call(ka, la))ia++;
                        ja = ka = null;
                        if (!ia) {
                            ka = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
                            ma = function (na, oa) {
                                var pa = g.call(na) == "[object Function]",
                                    qa, ra;
                                for (qa in na)if (!(pa && qa == "prototype") && h.call(na, qa))oa(qa);
                                for (ra = ka.length; qa = ka[--ra]; h.call(na, qa) && oa(qa));
                            }
                        } else if (ia == 2)ma = function (na, oa) {
                            var pa = {}, qa = g.call(na) == "[object Function]", ra;
                            for (ra in na)if (!(qa && ra == "prototype") && !h.call(pa, ra) && (pa[ra] = 1) && h.call(na, ra))oa(ra)
                        }; else ma = function (na, oa) {
                            var pa = g.call(na) == "[object Function]", qa, ra;
                            for (qa in na)if (!(pa && qa == "prototype") && h.call(na, qa) && !(ra = qa === "constructor"))oa(qa);
                            if (ra || h.call(na, qa = "constructor"))oa(qa)
                        };
                        return ma(ga,
                            ha)
                    };
                    if (!m) {
                        n = {"\\": "\\\\", '"': '\\"', "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "\t": "\\t"};
                        o = function (ga, ha) {
                            return("000000" + (ha || 0)).slice(-ga)
                        };
                        p = function (ga) {
                            var ha = '"', ia = 0, ja;
                            for (; ja = ga.charAt(ia); ia++)ha += '\\"\b\f\n\r\t'.indexOf(ja) > -1 ? n[ja] : ja < " " ? "\\u00" + o(2, ja.charCodeAt(0).toString(16)) : ja;
                            return ha + '"'
                        };
                        q = function (ga, ha, ia, ja, ka, la, ma) {
                            var na = ha[ga], oa, pa, qa, ra, sa, ta, ua, va, wa, xa, ya, za, ab, bb, cb;
                            if (typeof na == "object" && na) {
                                oa = g.call(na);
                                if (oa == "[object Date]" && !h.call(na, "toJSON"))if (na >
                                    -1 / 0 && na < 1 / 0) {
                                    if (ea) {
                                        ra = ca(na / 864E5);
                                        for (pa = ca(ra / 365.2425) + 1970 - 1; ea(pa + 1, 0) <= ra; pa++);
                                        for (qa = ca((ra - ea(pa, 0)) / 30.42); ea(pa, qa + 1) <= ra; qa++);
                                        ra = 1 + ra - ea(pa, qa);
                                        sa = (na % 864E5 + 864E5) % 864E5;
                                        ta = ca(sa / 36E5) % 24;
                                        ua = ca(sa / 6E4) % 60;
                                        va = ca(sa / 1E3) % 60;
                                        wa = sa % 1E3
                                    } else {
                                        pa = na.getUTCFullYear();
                                        qa = na.getUTCMonth();
                                        ra = na.getUTCDate();
                                        ta = na.getUTCHours();
                                        ua = na.getUTCMinutes();
                                        va = na.getUTCSeconds();
                                        wa = na.getUTCMilliseconds()
                                    }
                                    na = (pa <= 0 || pa >= 1E4 ? (pa < 0 ? "-" : "+") + o(6, pa < 0 ? -pa : pa) : o(4, pa)) + "-" + o(2, qa + 1) + "-" + o(2, ra) + "T" + o(2, ta) +
                                        ":" + o(2, ua) + ":" + o(2, va) + "." + o(3, wa) + "Z"
                                } else na = null; else if (typeof na.toJSON == "function" && (oa != "[object Number]" && oa != "[object String]" && oa != "[object Array]" || h.call(na, "toJSON")))na = na.toJSON(ga)
                            }
                            if (ia)na = ia.call(ha, ga, na);
                            if (na === null)return"null";
                            oa = g.call(na);
                            if (oa == "[object Boolean]")return"" + na; else if (oa == "[object Number]")return na > -1 / 0 && na < 1 / 0 ? "" + na : "null"; else if (oa == "[object String]")return p(na);
                            if (typeof na == "object") {
                                for (ab = ma.length; ab--;)if (ma[ab] === na)throw TypeError();
                                ma.push(na);
                                xa = [];
                                bb = la;
                                la += ka;
                                if (oa == "[object Array]") {
                                    for (za = 0, ab = na.length; za < ab; cb || (cb = true), za++) {
                                        ya = q(za, na, ia, ja, ka, la, ma);
                                        xa.push(ya === j ? "null" : ya)
                                    }
                                    return cb ? ka ? "[\n" + la + xa.join(",\n" + la) + "\n" + bb + "]" : "[" + xa.join(",") + "]" : "[]"
                                } else {
                                    i(ja || na, function (db) {
                                        var eb = q(db, na, ia, ja, ka, la, ma);
                                        if (eb !== j)xa.push(p(db) + ":" + (ka ? " " : "") + eb);
                                        cb || (cb = true)
                                    });
                                    return cb ? ka ? "{\n" + la + xa.join(",\n" + la) + "\n" + bb + "}" : "{" + xa.join(",") + "}" : "{}"
                                }
                                ma.pop()
                            }
                        };
                        k.stringify = function (ga, ha, ia) {
                            var ja, ka, la, ma, na, oa;
                            if (typeof ha == "function" ||
                                typeof ha == "object" && ha)if (g.call(ha) == "[object Function]")ka = ha; else if (g.call(ha) == "[object Array]") {
                                la = {};
                                for (ma = 0, na = ha.length; ma < na; oa = ha[ma++], (g.call(oa) == "[object String]" || g.call(oa) == "[object Number]") && (la[oa] = 1));
                            }
                            if (ia)if (g.call(ia) == "[object Number]") {
                                if ((ia -= ia % 1) > 0)for (ja = "", ia > 10 && (ia = 10); ja.length < ia; ja += " ");
                            } else if (g.call(ia) == "[object String]")ja = ia.length <= 10 ? ia : ia.slice(0, 10);
                            return q("", (oa = {}, oa[""] = ga, oa), ka, la, ja, "", [])
                        }
                    }
                    if (!r) {
                        s = String.fromCharCode;
                        t = {"\\": "\\", '"': '"',
                            "/": "/", b: "\b", t: "\t", n: "\n", f: "\f", r: "\r"};
                        u = function () {
                            z = aa = null;
                            throw SyntaxError();
                        };
                        v = function () {
                            var ga = aa, ha = ga.length, ia, ja, ka, la, ma;
                            while (z < ha) {
                                ia = ga.charAt(z);
                                if ("\t\r\n ".indexOf(ia) > -1)z++; else if ("{}[]:,".indexOf(ia) > -1) {
                                    z++;
                                    return ia
                                } else if (ia == '"') {
                                    for (ja = "@", z++; z < ha;) {
                                        ia = ga.charAt(z);
                                        if (ia < " ")u(); else if (ia == "\\") {
                                            ia = ga.charAt(++z);
                                            if ('\\"/btnfr'.indexOf(ia) > -1) {
                                                ja += t[ia];
                                                z++
                                            } else if (ia == "u") {
                                                ka = ++z;
                                                for (la = z + 4; z < la; z++) {
                                                    ia = ga.charAt(z);
                                                    if (!(ia >= "0" && ia <= "9" || ia >= "a" && ia <= "f" || ia >=
                                                        "A" && ia <= "F"))u()
                                                }
                                                ja += s("0x" + ga.slice(ka, z))
                                            } else u()
                                        } else {
                                            if (ia == '"')break;
                                            ja += ia;
                                            z++
                                        }
                                    }
                                    if (ga.charAt(z) == '"') {
                                        z++;
                                        return ja
                                    }
                                    u()
                                } else {
                                    ka = z;
                                    if (ia == "-") {
                                        ma = true;
                                        ia = ga.charAt(++z)
                                    }
                                    if (ia >= "0" && ia <= "9") {
                                        if (ia == "0" && (ia = ga.charAt(z + 1), ia >= "0" && ia <= "9"))u();
                                        ma = false;
                                        for (; z < ha && (ia = ga.charAt(z), ia >= "0" && ia <= "9"); z++);
                                        if (ga.charAt(z) == ".") {
                                            la = ++z;
                                            for (; la < ha && (ia = ga.charAt(la), ia >= "0" && ia <= "9"); la++);
                                            if (la == z)u();
                                            z = la
                                        }
                                        ia = ga.charAt(z);
                                        if (ia == "e" || ia == "E") {
                                            ia = ga.charAt(++z);
                                            if (ia == "+" || ia == "-")z++;
                                            for (la = z; la <
                                                ha && (ia = ga.charAt(la), ia >= "0" && ia <= "9"); la++);
                                            if (la == z)u();
                                            z = la
                                        }
                                        return+ga.slice(ka, z)
                                    }
                                    if (ma)u();
                                    if (ga.slice(z, z + 4) == "true") {
                                        z += 4;
                                        return true
                                    } else if (ga.slice(z, z + 5) == "false") {
                                        z += 5;
                                        return false
                                    } else if (ga.slice(z, z + 4) == "null") {
                                        z += 4;
                                        return null
                                    }
                                    u()
                                }
                            }
                            return"$"
                        };
                        w = function (ga) {
                            var ha, ia, ja;
                            if (ga == "$")u();
                            if (typeof ga == "string") {
                                if (ga.charAt(0) == "@")return ga.slice(1);
                                if (ga == "[") {
                                    ha = [];
                                    for (; ; ia || (ia = true)) {
                                        ga = v();
                                        if (ga == "]")break;
                                        if (ia)if (ga == ",") {
                                            ga = v();
                                            if (ga == "]")u()
                                        } else u();
                                        if (ga == ",")u();
                                        ha.push(w(ga))
                                    }
                                    return ha
                                } else if (ga ==
                                    "{") {
                                    ha = {};
                                    for (; ; ia || (ia = true)) {
                                        ga = v();
                                        if (ga == "}")break;
                                        if (ia)if (ga == ",") {
                                            ga = v();
                                            if (ga == "}")u()
                                        } else u();
                                        if (ga == "," || typeof ga != "string" || ga.charAt(0) != "@" || v() != ":")u();
                                        ha[ga.slice(1)] = w(v())
                                    }
                                    return ha
                                }
                                u()
                            }
                            return ga
                        };
                        y = function (ga, ha, ia) {
                            var ja = x(ga, ha, ia);
                            if (ja === j)delete ga[ha]; else ga[ha] = ja
                        };
                        x = function (ga, ha, ia) {
                            var ja = ga[ha], ka;
                            if (typeof ja == "object" && ja)if (g.call(ja) == "[object Array]")for (ka = ja.length; ka--;)y(ja, ka, ia); else i(ja, function (la) {
                                y(ja, la, ia)
                            });
                            return ia.call(ga, ha, ja)
                        };
                        k.parse =
                            function (ga, ha) {
                                z = 0;
                                aa = ga;
                                var ia = w(v());
                                if (v() != "$")u();
                                z = aa = null;
                                return ha && g.call(ha) == "[object Function]" ? x((ba = {}, ba[""] = ia, ba), "", ha) : ia
                            }
                    }
                }
            }).call(this)
        }, null);
        __d("ES5", ["ES5ArrayPrototype", "ES5FunctionPrototype", "ES5StringPrototype", "ES5Array", "ES5Object", "ES5Date", "JSON3"], function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
            var n = Array.prototype.slice, o = Object.prototype.toString, p = {"JSON.stringify": m.stringify, "JSON.parse": m.parse}, q = {array: g, "function": h, string: i, Object: k, Array: j, Date: l};
            for (var r in q) {
                if (!q.hasOwnProperty(r))continue;
                var s = q[r], t = r === r.toLowerCase() ? window[r.replace(/^\w/, function (x) {
                    return x.toUpperCase()
                })].prototype : window[r];
                for (var u in s) {
                    if (!s.hasOwnProperty(u))continue;
                    var v = t[u];
                    p[r + "." + u] = v && /\{\s+\[native code\]\s\}/.test(v) ? v : s[u]
                }
            }
            function w(x, y, z) {
                var aa = n.call(arguments, 3), ba = z ? /\s(.*)\]/.exec(o.call(x).toLowerCase())[1] : x, ca = p[ba + "." + y] || x[y];
                if (typeof ca === "function")return ca.apply(x, aa)
            }

            e.exports = w
        }, null);
        var ES5 = require("ES5");
        __d("JSSDKRuntimeConfig", [], {"locale": "zh_CN", "rtl": false, "revision": "1272844"});
        __d("JSSDKConfig", [], {"bustCache": true, "tagCountLogRate": 0.01, "errorHandling": {"rate": 4}, "usePluginPipe": true, "features": {"kill_fragment": true, "xfbml_profile_pic_server": true, "error_handling": {"rate": 4}, "e2e_ping_tracking": {"rate": 1E-6}, "xd_timeout": {"rate": 4, "value": 3E4}, "use_bundle": true}, "api": {"mode": "warn", "whitelist": ["Canvas", "Canvas.Prefetcher", "Canvas.Prefetcher.addStaticResource", "Canvas.Prefetcher.setCollectionMode", "Canvas.getPageInfo", "Canvas.hideFlashElement", "Canvas.scrollTo", "Canvas.setAutoGrow",
            "Canvas.setDoneLoading", "Canvas.setSize", "Canvas.setUrlHandler", "Canvas.showFlashElement", "Canvas.startTimer", "Canvas.stopTimer", "Data", "Data.process", "Data.query", "Data.query:wait", "Data.waitOn", "Data.waitOn:wait", "Event", "Event.subscribe", "Event.unsubscribe", "Music.flashCallback", "Music.init", "Music.send", "Payment", "Payment.cancelFlow", "Payment.continueFlow", "Payment.init", "Payment.lockForProcessing", "Payment.unlockForProcessing", "Payment.parse", "Payment.setSize", "ThirdPartyProvider", "ThirdPartyProvider.init",
            "ThirdPartyProvider.sendData", "UA", "UA.nativeApp", "XFBML", "XFBML.RecommendationsBar", "XFBML.RecommendationsBar.markRead", "XFBML.parse", "addFriend", "api", "getAccessToken", "getAuthResponse", "getLoginStatus", "getUserID", "init", "login", "logout", "publish", "share", "ui", "ui:subscribe"]}, "initSitevars": {"enableMobileComments": 1, "iframePermissions": {"read_stream": false, "manage_mailbox": false, "manage_friendlists": false, "read_mailbox": false, "publish_checkins": true, "status_update": true, "photo_upload": true, "video_upload": true,
            "sms": false, "create_event": true, "rsvp_event": true, "offline_access": true, "email": true, "xmpp_login": false, "create_note": true, "share_item": true, "export_stream": false, "publish_stream": true, "publish_likes": true, "ads_management": false, "contact_email": true, "access_private_data": false, "read_insights": false, "read_requests": false, "read_friendlists": true, "manage_pages": false, "physical_login": false, "manage_groups": false, "read_deals": false}}});
        __d("UrlMapConfig", [], {"www": "www.facebook.com", "m": "m.facebook.com",
            "connect": "connect.facebook.net", "business": "business.facebook.com", "api_https": "api.facebook.com", "api_read_https": "api-read.facebook.com", "graph_https": "graph.facebook.com", "fbcdn_http": "static.ak.fbcdn.net", "fbcdn_https": "fbstatic-a.akamaihd.net", "cdn_http": "static.ak.facebook.com", "cdn_https": "s-static.ak.facebook.com"});
        __d("JSSDKXDConfig", [], {"XdUrl": "/connect/xd_arbiter.php?version\x3d41", "XdBundleUrl": "/connect/xd_arbiter/V80PAcvrynR.js?version\x3d41", "Flash": {"path": "https://connect.facebook.net/rsrc.php/v1/yR/r/ks_9ZXiQ0GL.swf"},
            "useCdn": true});
        __d("JSSDKCssConfig", [], {"rules": '.fb_hidden{position:absolute;top:-10000px;z-index:10001}.fb_invisible{display:none}.fb_reset{background:none;border:0;border-spacing:0;color:#000;cursor:auto;direction:ltr;font-family:"lucida grande", tahoma, verdana, arial, sans-serif;font-size:12px;font-style:normal;font-variant:normal;font-weight:normal;letter-spacing:normal;line-height:1;margin:0;overflow:visible;padding:0;text-align:left;text-decoration:none;text-indent:0;text-shadow:none;text-transform:none;visibility:visible;white-space:normal;word-spacing:normal}.fb_reset\x3ediv{overflow:hidden}.fb_link img{border:none}\n.fb_dialog{background:rgba(82, 82, 82, .7);position:absolute;top:-10000px;z-index:10001}.fb_reset .fb_dialog_legacy{overflow:visible}.fb_dialog_advanced{padding:10px;-moz-border-radius:8px;-webkit-border-radius:8px;border-radius:8px}.fb_dialog_content{background:#fff;color:#333}.fb_dialog_close_icon{background:url(http://static.ak.fbcdn.net/rsrc.php/v2/yq/r/IE9JII6Z1Ys.png) no-repeat scroll 0 0 transparent;_background-image:url(http://static.ak.fbcdn.net/rsrc.php/v2/yL/r/s816eWC-2sl.gif);cursor:pointer;display:block;height:15px;position:absolute;right:18px;top:17px;width:15px}.fb_dialog_mobile .fb_dialog_close_icon{top:5px;left:5px;right:auto}.fb_dialog_padding{background-color:transparent;position:absolute;width:1px;z-index:-1}.fb_dialog_close_icon:hover{background:url(http://static.ak.fbcdn.net/rsrc.php/v2/yq/r/IE9JII6Z1Ys.png) no-repeat scroll 0 -15px transparent;_background-image:url(http://static.ak.fbcdn.net/rsrc.php/v2/yL/r/s816eWC-2sl.gif)}.fb_dialog_close_icon:active{background:url(http://static.ak.fbcdn.net/rsrc.php/v2/yq/r/IE9JII6Z1Ys.png) no-repeat scroll 0 -30px transparent;_background-image:url(http://static.ak.fbcdn.net/rsrc.php/v2/yL/r/s816eWC-2sl.gif)}.fb_dialog_loader{background-color:#f2f2f2;border:1px solid #606060;font-size:25px;padding:20px}.fb_dialog_top_left,.fb_dialog_top_right,.fb_dialog_bottom_left,.fb_dialog_bottom_right{height:10px;width:10px;overflow:hidden;position:absolute}.fb_dialog_top_left{background:url(http://static.ak.fbcdn.net/rsrc.php/v2/ye/r/8YeTNIlTZjm.png) no-repeat 0 0;left:-10px;top:-10px}.fb_dialog_top_right{background:url(http://static.ak.fbcdn.net/rsrc.php/v2/ye/r/8YeTNIlTZjm.png) no-repeat 0 -10px;right:-10px;top:-10px}.fb_dialog_bottom_left{background:url(http://static.ak.fbcdn.net/rsrc.php/v2/ye/r/8YeTNIlTZjm.png) no-repeat 0 -20px;bottom:-10px;left:-10px}.fb_dialog_bottom_right{background:url(http://static.ak.fbcdn.net/rsrc.php/v2/ye/r/8YeTNIlTZjm.png) no-repeat 0 -30px;right:-10px;bottom:-10px}.fb_dialog_vert_left,.fb_dialog_vert_right,.fb_dialog_horiz_top,.fb_dialog_horiz_bottom{position:absolute;background:#525252;filter:alpha(opacity\x3d70);opacity:.7}.fb_dialog_vert_left,.fb_dialog_vert_right{width:10px;height:100%}.fb_dialog_vert_left{margin-left:-10px}.fb_dialog_vert_right{right:0;margin-right:-10px}.fb_dialog_horiz_top,.fb_dialog_horiz_bottom{width:100%;height:10px}.fb_dialog_horiz_top{margin-top:-10px}.fb_dialog_horiz_bottom{bottom:0;margin-bottom:-10px}.fb_dialog_iframe{line-height:0}.fb_dialog_content .dialog_title{background:#6d84b4;border:1px solid #3b5998;color:#fff;font-size:15px;font-weight:bold;margin:0}.fb_dialog_content .dialog_title\x3espan{background:url(http://static.ak.fbcdn.net/rsrc.php/v2/yd/r/Cou7n-nqK52.gif) no-repeat 5px 50%;float:left;padding:5px 0 7px 26px}body.fb_hidden{-webkit-transform:none;height:100%;margin:0;overflow:visible;position:absolute;top:-10000px;left:0;width:100%}.fb_dialog.fb_dialog_mobile.loading{background:url(http://static.ak.fbcdn.net/rsrc.php/v2/ya/r/3rhSv5V8j3o.gif) white no-repeat 50% 50%;min-height:100%;min-width:100%;overflow:hidden;position:absolute;top:0;z-index:10001}.fb_dialog.fb_dialog_mobile.loading.centered{max-height:590px;min-height:590px;max-width:500px;min-width:500px}#fb-root #fb_dialog_ipad_overlay{background:rgba(0, 0, 0, .45);position:absolute;left:0;top:0;width:100%;min-height:100%;z-index:10000}#fb-root #fb_dialog_ipad_overlay.hidden{display:none}.fb_dialog.fb_dialog_mobile.loading iframe{visibility:hidden}.fb_dialog_content .dialog_header{-webkit-box-shadow:white 0 1px 1px -1px inset;background:-webkit-gradient(linear, 0% 0%, 0% 100%, from(#738ABA), to(#2C4987));border-bottom:1px solid;border-color:#1d4088;color:#fff;font:14px Helvetica, sans-serif;font-weight:bold;text-overflow:ellipsis;text-shadow:rgba(0, 30, 84, .296875) 0 -1px 0;vertical-align:middle;white-space:nowrap}.fb_dialog_content .dialog_header table{-webkit-font-smoothing:subpixel-antialiased;height:43px;width:100%}.fb_dialog_content .dialog_header td.header_left{font-size:13px;padding-left:5px;vertical-align:middle;width:60px}.fb_dialog_content .dialog_header td.header_right{font-size:13px;padding-right:5px;vertical-align:middle;width:60px}.fb_dialog_content .touchable_button{background:-webkit-gradient(linear, 0% 0%, 0% 100%, from(#4966A6), color-stop(.5, #355492), to(#2A4887));border:1px solid #29447e;-webkit-background-clip:padding-box;-webkit-border-radius:3px;-webkit-box-shadow:rgba(0, 0, 0, .117188) 0 1px 1px inset, rgba(255, 255, 255, .167969) 0 1px 0;display:inline-block;margin-top:3px;max-width:85px;line-height:18px;padding:4px 12px;position:relative}.fb_dialog_content .dialog_header .touchable_button input{border:none;background:none;color:#fff;font:12px Helvetica, sans-serif;font-weight:bold;margin:2px -12px;padding:2px 6px 3px 6px;text-shadow:rgba(0, 30, 84, .296875) 0 -1px 0}.fb_dialog_content .dialog_header .header_center{color:#fff;font-size:17px;font-weight:bold;line-height:18px;text-align:center;vertical-align:middle}.fb_dialog_content .dialog_content{background:url(http://static.ak.fbcdn.net/rsrc.php/v2/y9/r/jKEcVPZFk-2.gif) no-repeat 50% 50%;border:1px solid #555;border-bottom:0;border-top:0;height:150px}.fb_dialog_content .dialog_footer{background:#f2f2f2;border:1px solid #555;border-top-color:#ccc;height:40px}#fb_dialog_loader_close{float:left}.fb_dialog.fb_dialog_mobile .fb_dialog_close_button{text-shadow:rgba(0, 30, 84, .296875) 0 -1px 0}.fb_dialog.fb_dialog_mobile .fb_dialog_close_icon{visibility:hidden}\n.fb_iframe_widget{display:inline-block;position:relative}.fb_iframe_widget span{display:inline-block;position:relative;text-align:justify}.fb_iframe_widget iframe{position:absolute}.fb_iframe_widget_lift{z-index:1}.fb_hide_iframes iframe{position:relative;left:-10000px}.fb_iframe_widget_loader{position:relative;display:inline-block}.fb_iframe_widget_fluid{display:inline}.fb_iframe_widget_fluid span{width:100%}.fb_iframe_widget_loader iframe{min-height:32px;z-index:2;zoom:1}.fb_iframe_widget_loader .FB_Loader{background:url(http://static.ak.fbcdn.net/rsrc.php/v2/y9/r/jKEcVPZFk-2.gif) no-repeat;height:32px;width:32px;margin-left:-16px;position:absolute;left:50%;z-index:4}\n.fb_connect_bar_container div,.fb_connect_bar_container span,.fb_connect_bar_container a,.fb_connect_bar_container img,.fb_connect_bar_container strong{background:none;border-spacing:0;border:0;direction:ltr;font-style:normal;font-variant:normal;letter-spacing:normal;line-height:1;margin:0;overflow:visible;padding:0;text-align:left;text-decoration:none;text-indent:0;text-shadow:none;text-transform:none;visibility:visible;white-space:normal;word-spacing:normal;vertical-align:baseline}.fb_connect_bar_container{position:fixed;left:0 !important;right:0 !important;height:42px !important;padding:0 25px !important;margin:0 !important;vertical-align:middle !important;border-bottom:1px solid #333 !important;background:#3b5998 !important;z-index:99999999 !important;overflow:hidden !important}.fb_connect_bar_container_ie6{position:absolute;top:expression(document.compatMode\x3d\x3d"CSS1Compat"? document.documentElement.scrollTop+"px":body.scrollTop+"px")}.fb_connect_bar{position:relative;margin:auto;height:100%;width:100%;padding:6px 0 0 0 !important;background:none;color:#fff !important;font-family:"lucida grande", tahoma, verdana, arial, sans-serif !important;font-size:14px !important;font-style:normal !important;font-variant:normal !important;font-weight:normal !important;letter-spacing:normal !important;line-height:1 !important;text-decoration:none !important;text-indent:0 !important;text-shadow:none !important;text-transform:none !important;white-space:normal !important;word-spacing:normal !important}.fb_connect_bar a:hover{color:#fff}.fb_connect_bar .fb_profile img{height:30px;width:30px;vertical-align:middle;margin:0 6px 5px 0}.fb_connect_bar div a,.fb_connect_bar span,.fb_connect_bar span a{color:#bac6da;font-size:12px;text-decoration:none}.fb_connect_bar .fb_buttons{float:right;margin-top:7px}\n.fbpluginrecommendationsbarleft,.fbpluginrecommendationsbarright{position:fixed !important;bottom:0;z-index:999}.fbpluginrecommendationsbarleft{left:10px}.fbpluginrecommendationsbarright{right:10px}',
            "components": ["css:fb.css.base", "css:fb.css.dialog", "css:fb.css.iframewidget", "css:fb.css.connectbarwidget", "css:fb.css.plugin.recommendationsbar"]});
        __d("ApiClientConfig", [], {"FlashRequest": {"swfUrl": "https://connect.facebook.net/rsrc.php/v1/yW/r/PvklbuW2Ycn.swf"}});
        __d("JSSDKCanvasPrefetcherConfig", [], {"blacklist": [0x83d70a64a992], "sampleRate": 500});
        __d("JSSDKPluginPipeConfig", [], {"threshold": 0, "enabledApps": {0xbec51e4718e7: 1, 0xaa568c1d5c06: 1}});
        __d("JSSDKConnectBarConfig", [], {"imgs": {"buttonUrl": "rsrc.php/v2/yY/r/h_Y6u1wrZPW.png",
            "missingProfileUrl": "rsrc.php/v2/yo/r/UlIqmHJn-SK.gif"}});
        __d("QueryString", [], function (a, b, c, d, e, f) {
            function g(k) {
                var l = [];
                ES5(ES5("Object", "keys", false, k).sort(), "forEach", true, function (m) {
                    var n = k[m];
                    if (typeof n === "undefined")return;
                    if (n === null) {
                        l.push(m);
                        return
                    }
                    l.push(encodeURIComponent(m) + "\x3d" + encodeURIComponent(n))
                });
                return l.join("\x26")
            }

            function h(k, l) {
                var m = {};
                if (k === "")return m;
                var n = k.split("\x26");
                for (var o = 0; o < n.length; o++) {
                    var p = n[o].split("\x3d", 2), q = decodeURIComponent(p[0]);
                    if (l &&
                        m.hasOwnProperty(q))throw new URIError("Duplicate key: " + q);
                    m[q] = p.length === 2 ? decodeURIComponent(p[1]) : null
                }
                return m
            }

            function i(k, l) {
                return k + (~ES5(k, "indexOf", true, "?") ? "\x26" : "?") + (typeof l === "string" ? l : j.encode(l))
            }

            var j = {encode: g, decode: h, appendToUrl: i};
            e.exports = j
        }, null);
        __d("copyProperties", [], function (a, b, c, d, e, f) {
            function g(h, i, j, k, l, m, n) {
                h = h || {};
                var o = [i, j, k, l, m], p = 0, q;
                while (o[p]) {
                    q = o[p++];
                    for (var r in q)h[r] = q[r];
                    if (q.hasOwnProperty && q.hasOwnProperty("toString") && typeof q.toString != "undefined" &&
                        h.toString !== q.toString)h.toString = q.toString
                }
                return h
            }

            e.exports = g
        }, null);
        __d("ManagedError", [], function (a, b, c, d, e, f) {
            function g(h, i) {
                Error.prototype.constructor.call(this, h);
                this.message = h;
                this.innerError = i
            }

            g.prototype = new Error;
            g.prototype.constructor = g;
            e.exports = g
        }, null);
        __d("AssertionError", ["ManagedError"], function (a, b, c, d, e, f, g) {
            function h(i) {
                g.prototype.constructor.apply(this, arguments)
            }

            h.prototype = new g;
            h.prototype.constructor = h;
            e.exports = h
        }, null);
        __d("sprintf", [], function (a, b, c, d, e, f) {
            function g(h) {
                var i =
                    Array.prototype.slice.call(arguments, 1), j = 0;
                return h.replace(/%s/g, function (k) {
                    return i[j++]
                })
            }

            e.exports = g
        }, null);
        __d("Assert", ["AssertionError", "sprintf"], function (a, b, c, d, e, f, g, h) {
            function i(n, o) {
                if (typeof n !== "boolean" || !n)throw new g(o);
                return n
            }

            function j(n, o, p) {
                var q;
                if (o === undefined)q = "undefined"; else if (o === null)q = "null"; else {
                    var r = Object.prototype.toString.call(o);
                    q = /\s(\w*)/.exec(r)[1].toLowerCase()
                }
                i(ES5(n, "indexOf", true, q) !== -1, p || h("Expression is of type %s, not %s", q, n));
                return o
            }

            function k(n, o, p) {
                i(o instanceof n, p || "Expression not instance of type");
                return o
            }

            function l(n, o) {
                m["is" + n] = o;
                m["maybe" + n] = function (p, q) {
                    if (p != null)o(p, q)
                }
            }

            var m = {isInstanceOf: k, isTrue: i, isTruthy: function (n, o) {
                return i(!!n, o)
            }, type: j, define: function (n, o) {
                n = n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase();
                l(n, function (p, q) {
                    i(o(p), q)
                })
            }};
            ES5(["Array", "Boolean", "Date", "Function", "Null", "Number", "Object", "Regexp", "String", "Undefined"], "forEach", true, function (n) {
                l(n, ES5(j, "bind", true, null, n.toLowerCase()))
            });
            e.exports = m
        }, null);
        __d("Type", ["copyProperties", "Assert"], function (a, b, c, d, e, f, g, h) {
            function i() {
                var m = this.__mixins;
                if (m)for (var n = 0; n < m.length; n++)m[n].apply(this, arguments)
            }

            function j(m, n) {
                if (n instanceof m)return true;
                if (n instanceof i)for (var o = 0; o < n.__mixins.length; o++)if (n.__mixins[o] == m)return true;
                return false
            }

            function k(m, n) {
                var o = m.prototype;
                if (!ES5("Array", "isArray", false, n))n = [n];
                for (var p = 0; p < n.length; p++) {
                    var q = n[p];
                    if (typeof q == "function") {
                        o.__mixins.push(q);
                        q = q.prototype
                    }
                    ES5(ES5("Object",
                        "keys", false, q), "forEach", true, function (r) {
                        o[r] = q[r]
                    })
                }
            }

            function l(m, n, o) {
                var p = n && n.hasOwnProperty("constructor") ? n.constructor : function () {
                    this.parent.apply(this, arguments)
                };
                h.isFunction(p);
                if (m && m.prototype instanceof i === false)throw new Error("parent type does not inherit from Type");
                m = m || i;
                var q = new Function;
                q.prototype = m.prototype;
                p.prototype = new q;
                g(p.prototype, n);
                p.prototype.constructor = p;
                p.parent = m;
                p.prototype.__mixins = m.prototype.__mixins ? Array.prototype.slice.call(m.prototype.__mixins) :
                    [];
                if (o)k(p, o);
                p.prototype.parent = function () {
                    this.parent = m.prototype.parent;
                    m.apply(this, arguments)
                };
                p.prototype.parentCall = function (r) {
                    return m.prototype[r].apply(this, Array.prototype.slice.call(arguments, 1))
                };
                p.extend = function (r, s) {
                    return l(this, r, s)
                };
                return p
            }

            g(i.prototype, {instanceOf: function (m) {
                return j(m, this)
            }});
            g(i, {extend: function (m, n) {
                return typeof m === "function" ? l.apply(null, arguments) : l(null, m, n)
            }, instanceOf: j});
            e.exports = i
        }, null);
        __d("ObservableMixin", [], function (a, b, c, d, e, f) {
            function g() {
                this.__observableEvents =
                {}
            }

            g.prototype = {inform: function (h) {
                var i = Array.prototype.slice.call(arguments, 1), j = Array.prototype.slice.call(this.getSubscribers(h));
                for (var k = 0; k < j.length; k++) {
                    if (j[k] === null)continue;
                    try {
                        j[k].apply(this, i)
                    } catch (l) {
                        setTimeout(function () {
                            throw l;
                        }, 0)
                    }
                }
                return this
            }, getSubscribers: function (h) {
                return this.__observableEvents[h] || (this.__observableEvents[h] = [])
            }, clearSubscribers: function (h) {
                if (h)this.__observableEvents[h] = [];
                return this
            }, clearAllSubscribers: function () {
                this.__observableEvents = {};
                return this
            },
                subscribe: function (h, i) {
                    var j = this.getSubscribers(h);
                    j.push(i);
                    return this
                }, unsubscribe: function (h, i) {
                    var j = this.getSubscribers(h);
                    for (var k = 0; k < j.length; k++)if (j[k] === i) {
                        j.splice(k, 1);
                        break
                    }
                    return this
                }, monitor: function (h, i) {
                    if (!i()) {
                        var j = ES5(function (k) {
                            if (i.apply(i, arguments))this.unsubscribe(h, j)
                        }, "bind", true, this);
                        this.subscribe(h, j)
                    }
                    return this
                }};
            e.exports = g
        }, null);
        __d("sdk.Model", ["Type", "ObservableMixin"], function (a, b, c, d, e, f, g, h) {
            var i = g.extend({constructor: function (j) {
                this.parent();
                var k =
                {}, l = this;
                ES5(ES5("Object", "keys", false, j), "forEach", true, function (m) {
                    k[m] = j[m];
                    l["set" + m] = function (n) {
                        if (n === k[m])return this;
                        k[m] = n;
                        l.inform(m + ".change", n);
                        return l
                    };
                    l["get" + m] = function () {
                        return k[m]
                    }
                })
            }}, h);
            e.exports = i
        }, null);
        __d("sdk.Runtime", ["sdk.Model", "JSSDKRuntimeConfig", "copyProperties"], function (a, b, c, d, e, f, g, h, i) {
            var j = {UNKNOWN: 0, PAGETAB: 1, CANVAS: 2, PLATFORM: 4}, k = new g({AccessToken: "", ClientID: "", CookieUserID: "", Environment: j.UNKNOWN, Initialized: false, IsVersioned: false, KidDirectedSite: undefined,
                Locale: h.locale, LoginStatus: undefined, Revision: h.revision, Rtl: h.rtl, Scope: undefined, Secure: undefined, UseCookie: false, UserID: "", Version: undefined});
            i(k, {ENVIRONMENTS: j, isEnvironment: function (l) {
                var m = this.getEnvironment();
                return(l | m) === m
            }});
            (function () {
                var l = /app_runner/.test(window.name) ? j.PAGETAB : /iframe_canvas/.test(window.name) ? j.CANVAS : j.UNKNOWN;
                if ((l | j.PAGETAB) === l)l = l | j.CANVAS;
                k.setEnvironment(l)
            })();
            e.exports = k
        }, null);
        __d("sdk.Cookie", ["QueryString", "sdk.Runtime"], function (a, b, c, d, e, f, g, h) {
                var i =
                    null;

                function j(m, n, o) {
                    m = m + h.getClientID();
                    var p = i && i !== ".";
                    if (p) {
                        document.cookie = m + "\x3d; expires\x3dWed, 04 Feb 2004 08:00:00 GMT;";
                        document.cookie = m + "\x3d; expires\x3dWed, 04 Feb 2004 08:00:00 GMT;" + "domain\x3d" + location.hostname + ";"
                    }
                    var q = (new Date(o)).toGMTString();
                    document.cookie = m + "\x3d" + n + (n && o === 0 ? "" : "; expires\x3d" + q) + "; path\x3d/" + (p ? "; domain\x3d" + i : "")
                }

                function k(m) {
                    m = m + h.getClientID();
                    var n = new RegExp("\\b" + m + "\x3d([^;]*)\\b");
                    return n.test(document.cookie) ? RegExp.$1 : null
                }

                var l = {setDomain: function (m) {
                    i =
                        m;
                    var n = g.encode({base_domain: i && i !== "." ? i : ""}), o = new Date;
                    o.setFullYear(o.getFullYear() + 1);
                    j("fbm_", n, o.getTime())
                }, getDomain: function () {
                    return i
                }, loadMeta: function () {
                    var m = k("fbm_");
                    if (m) {
                        var n = g.decode(m);
                        if (!i)i = n.base_domain;
                        return n
                    }
                }, loadSignedRequest: function () {
                    return k("fbsr_")
                }, setSignedRequestCookie: function (m, n) {
                    if (!m)throw new Error("Value passed to Cookie.setSignedRequestCookie " + "was empty.");
                    j("fbsr_", m, n)
                }, clearSignedRequestCookie: function () {
                    j("fbsr_", "", 0)
                }, setRaw: j};
                e.exports = l
            },
            null);
        __d("guid", [], function (a, b, c, d, e, f) {
            function g() {
                return"f" + (Math.random() * (1 << 30)).toString(16).replace(".", "")
            }

            e.exports = g
        }, null);
        __d("UserAgent", [], function (a, b, c, d, e, f) {
            var g = false, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v;

            function w() {
                if (g)return;
                g = true;
                var y = navigator.userAgent, z = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(y), aa = /(Mac OS X)|(Windows)|(Linux)/.exec(y);
                s = /\b(iPhone|iP[ao]d)/.exec(y);
                t = /\b(iP[ao]d)/.exec(y);
                q = /Android/i.exec(y);
                u = /FBAN\/\w+;/i.exec(y);
                v = /Mobile/i.exec(y);
                r = !!/Win64/.exec(y);
                if (z) {
                    h = z[1] ? parseFloat(z[1]) : z[5] ? parseFloat(z[5]) : NaN;
                    if (h && document && document.documentMode)h = document.documentMode;
                    var ba = /(?:Trident\/(\d+.\d+))/.exec(y);
                    m = ba ? parseFloat(ba[1]) + 4 : h;
                    i = z[2] ? parseFloat(z[2]) : NaN;
                    j = z[3] ? parseFloat(z[3]) : NaN;
                    k = z[4] ? parseFloat(z[4]) : NaN;
                    if (k) {
                        z = /(?:Chrome\/(\d+\.\d+))/.exec(y);
                        l = z && z[1] ? parseFloat(z[1]) : NaN
                    } else l = NaN
                } else h = i =
                    j = l = k = NaN;
                if (aa) {
                    if (aa[1]) {
                        var ca = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(y);
                        n = ca ? parseFloat(ca[1].replace("_", ".")) : true
                    } else n = false;
                    o = !!aa[2];
                    p = !!aa[3]
                } else n = o = p = false
            }

            var x = {ie: function () {
                return w() || h
            }, ieCompatibilityMode: function () {
                return w() || m > h
            }, ie64: function () {
                return x.ie() && r
            }, firefox: function () {
                return w() || i
            }, opera: function () {
                return w() || j
            }, webkit: function () {
                return w() || k
            }, safari: function () {
                return x.webkit()
            }, chrome: function () {
                return w() || l
            }, windows: function () {
                return w() || o
            }, osx: function () {
                return w() ||
                    n
            }, linux: function () {
                return w() || p
            }, iphone: function () {
                return w() || s
            }, mobile: function () {
                return w() || s || t || q || v
            }, nativeApp: function () {
                return w() || u
            }, android: function () {
                return w() || q
            }, ipad: function () {
                return w() || t
            }};
            e.exports = x
        }, null);
        __d("hasNamePropertyBug", ["guid", "UserAgent"], function (a, b, c, d, e, f, g, h) {
            var i = h.ie() ? undefined : false;

            function j() {
                var l = document.createElement("form"), m = l.appendChild(document.createElement("input"));
                m.name = g();
                i = m !== l.elements[m.name];
                l = m = null;
                return i
            }

            function k() {
                return typeof i ===
                    "undefined" ? j() : i
            }

            e.exports = k
        }, null);
        __d("wrapFunction", [], function (a, b, c, d, e, f) {
            var g = {};

            function h(i, j, k) {
                j = j || "default";
                return function () {
                    var l = j in g ? g[j](i, k) : i;
                    return l.apply(this, arguments)
                }
            }

            h.setWrapper = function (i, j) {
                j = j || "default";
                g[j] = i
            };
            e.exports = h
        }, null);
        __d("DOMEventListener", ["wrapFunction"], function (a, b, c, d, e, f, g) {
            var h, i;
            if (window.addEventListener) {
                h = function (k, l, m) {
                    m.wrapper = g(m, "entry", "DOMEventListener.add " + l);
                    k.addEventListener(l, m.wrapper, false)
                };
                i = function (k, l, m) {
                    k.removeEventListener(l,
                        m.wrapper, false)
                }
            } else if (window.attachEvent) {
                h = function (k, l, m) {
                    m.wrapper = g(m, "entry", "DOMEventListener.add " + l);
                    k.attachEvent("on" + l, m.wrapper)
                };
                i = function (k, l, m) {
                    k.detachEvent("on" + l, m.wrapper)
                }
            } else i = h = function () {
            };
            var j = {add: function (k, l, m) {
                h(k, l, m);
                return{remove: function () {
                    i(k, l, m);
                    k = null
                }}
            }, remove: i};
            e.exports = j
        }, null);
        __d("sdk.createIframe", ["copyProperties", "guid", "hasNamePropertyBug", "DOMEventListener"], function (a, b, c, d, e, f, g, h, i, j) {
            function k(l) {
                l = g({}, l);
                var m, n = l.name || h(), o = l.root, p =
                    l.style || {border: "none"}, q = l.url, r = l.onload;
                if (i())m = document.createElement('\x3ciframe name\x3d"' + n + '"/\x3e'); else {
                    m = document.createElement("iframe");
                    m.name = n
                }
                delete l.style;
                delete l.name;
                delete l.url;
                delete l.root;
                delete l.onload;
                var s = g({frameBorder: 0, allowTransparency: true, scrolling: "no"}, l);
                if (s.width)m.width = s.width + "px";
                if (s.height)m.height = s.height + "px";
                delete s.height;
                delete s.width;
                for (var t in s)if (s.hasOwnProperty(t))m.setAttribute(t, s[t]);
                g(m.style, p);
                m.src = "javascript:false";
                o.appendChild(m);
                if (r)var u = j.add(m, "load", function () {
                    u.remove();
                    r()
                });
                m.src = q;
                return m
            }

            e.exports = k
        }, null);
        __d("DOMWrapper", [], function (a, b, c, d, e, f) {
            var g, h, i = {setRoot: function (j) {
                g = j
            }, getRoot: function () {
                return g || document.body
            }, setWindow: function (j) {
                h = j
            }, getWindow: function () {
                return h || self
            }};
            e.exports = i
        }, null);
        __d("sdk.feature", ["JSSDKConfig"], function (a, b, c, d, e, f, g) {
            function h(i, j) {
                if (g.features && i in g.features) {
                    var k = g.features[i];
                    if (typeof k === "object" && typeof k.rate === "number")if (k.rate && Math.random() * 100 <=
                        k.rate)return k.value || true; else return k.value ? null : false; else return k
                }
                return typeof j !== "undefined" ? j : null
            }

            e.exports = h
        }, null);
        __d("sdk.getContextType", ["UserAgent", "sdk.Runtime"], function (a, b, c, d, e, f, g, h) {
            function i() {
                if (g.nativeApp())return 3;
                if (g.mobile())return 2;
                if (h.isEnvironment(h.ENVIRONMENTS.CANVAS))return 5;
                return 1
            }

            e.exports = i
        }, null);
        __d("UrlMap", ["UrlMapConfig"], function (a, b, c, d, e, f, g) {
            var h = {resolve: function (i, j) {
                var k = typeof j == "undefined" ? location.protocol.replace(":", "") : j ? "https" :
                    "http";
                if (i in g)return k + "://" + g[i];
                if (typeof j == "undefined" && i + "_" + k in g)return k + "://" + g[i + "_" + k];
                if (j !== true && i + "_http"in g)return"http://" + g[i + "_http"];
                if (j !== false && i + "_https"in g)return"https://" + g[i + "_https"]
            }};
            e.exports = h
        }, null);
        __d("sdk.Impressions", ["guid", "QueryString", "sdk.Runtime", "UrlMap"], function (a, b, c, d, e, f, g, h, i, j) {
            function k(m) {
                var n = i.getClientID();
                if (!m.api_key && n)m.api_key = n;
                m.kid_directed_site = i.getKidDirectedSite();
                var o = new Image;
                o.src = h.appendToUrl(j.resolve("www", true) +
                    "/impression.php/" + g() + "/", m)
            }

            var l = {log: function (m, n) {
                if (!n.source)n.source = "jssdk";
                k({lid: m, payload: ES5("JSON", "stringify", false, n)})
            }, impression: k};
            e.exports = l
        }, null);
        __d("Log", ["sprintf"], function (a, b, c, d, e, f, g) {
            var h = {DEBUG: 3, INFO: 2, WARNING: 1, ERROR: 0};

            function i(k, l) {
                var m = Array.prototype.slice.call(arguments, 2), n = g.apply(null, m), o = window.console;
                if (o && j.level >= l)o[k in o ? k : "log"](n)
            }

            var j = {level: -1, Level: h, debug: ES5(i, "bind", true, null, "debug", h.DEBUG), info: ES5(i, "bind", true, null, "info", h.INFO),
                warn: ES5(i, "bind", true, null, "warn", h.WARNING), error: ES5(i, "bind", true, null, "error", h.ERROR)};
            e.exports = j
        }, null);
        __d("Base64", [], function (a, b, c, d, e, f) {
            var g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

            function h(l) {
                l = l.charCodeAt(0) << 16 | l.charCodeAt(1) << 8 | l.charCodeAt(2);
                return String.fromCharCode(g.charCodeAt(l >>> 18), g.charCodeAt(l >>> 12 & 63), g.charCodeAt(l >>> 6 & 63), g.charCodeAt(l & 63))
            }

            var i = "\x3e___?456789:;\x3c\x3d_______" + "\x00\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\x0B\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019" +
                "______\u001a\u001b\u001c\u001d\u001e\u001f !\"#$%\x26'()*+,-./0123";

            function j(l) {
                l = i.charCodeAt(l.charCodeAt(0) - 43) << 18 | i.charCodeAt(l.charCodeAt(1) - 43) << 12 | i.charCodeAt(l.charCodeAt(2) - 43) << 6 | i.charCodeAt(l.charCodeAt(3) - 43);
                return String.fromCharCode(l >>> 16, l >>> 8 & 255, l & 255)
            }

            var k = {encode: function (l) {
                l = unescape(encodeURI(l));
                var m = (l.length + 2) % 3;
                l = (l + "\x00\x00".slice(m)).replace(/[\s\S]{3}/g, h);
                return l.slice(0, l.length + m - 2) + "\x3d\x3d".slice(m)
            }, decode: function (l) {
                l = l.replace(/[^A-Za-z0-9+\/]/g,
                    "");
                var m = l.length + 3 & 3;
                l = (l + "AAA".slice(m)).replace(/..../g, j);
                l = l.slice(0, l.length + m - 3);
                try {
                    return decodeURIComponent(escape(l))
                } catch (n) {
                    throw new Error("Not valid UTF-8");
                }
            }, encodeObject: function (l) {
                return k.encode(ES5("JSON", "stringify", false, l))
            }, decodeObject: function (l) {
                return ES5("JSON", "parse", false, k.decode(l))
            }, encodeNums: function (l) {
                return String.fromCharCode.apply(String, ES5(l, "map", true, function (m) {
                    return g.charCodeAt((m | -(m > 63)) & -(m > 0) & 63)
                }))
            }};
            e.exports = k
        }, null);
        __d("sdk.SignedRequest",
            ["Base64"], function (a, b, c, d, e, f, g) {
                function h(j) {
                    if (!j)return null;
                    var k = j.split(".", 2)[1].replace(/\-/g, "+").replace(/\_/g, "/");
                    return g.decodeObject(k)
                }

                var i = {parse: h};
                e.exports = i
            }, null);
        __d("URIRFC3986", [], function (a, b, c, d, e, f) {
            var g = new RegExp("^" + "([^:/?#]+:)?" + "(//" + "([^\\\\/?#@]*@)?" + "(" + "\\[[A-Fa-f0-9:.]+\\]|" + "[^\\/?#:]*" + ")" + "(:[0-9]*)?" + ")?" + "([^?#]*)" + "(\\?[^#]*)?" + "(#.*)?"), h = {parse: function (i) {
                if (ES5(i, "trim", true) === "")return null;
                var j = i.match(g), k = {};
                k.uri = j[0] ? j[0] : null;
                k.scheme =
                    j[1] ? j[1].substr(0, j[1].length - 1) : null;
                k.authority = j[2] ? j[2].substr(2) : null;
                k.userinfo = j[3] ? j[3].substr(0, j[3].length - 1) : null;
                k.host = j[2] ? j[4] : null;
                k.port = j[5] ? j[5].substr(1) ? parseInt(j[5].substr(1), 10) : null : null;
                k.path = j[6] ? j[6] : null;
                k.query = j[7] ? j[7].substr(1) : null;
                k.fragment = j[8] ? j[8].substr(1) : null;
                k.isGenericURI = k.authority === null && !!k.scheme;
                return k
            }};
            e.exports = h
        }, null);
        __d("createObjectFrom", [], function (a, b, c, d, e, f) {
            function g(h, i) {
                var j = {}, k = ES5("Array", "isArray", false, i);
                if (typeof i == "undefined")i =
                    true;
                for (var l = h.length; l--;)j[h[l]] = k ? i[l] : i;
                return j
            }

            e.exports = g
        }, null);
        __d("URISchemes", ["createObjectFrom"], function (a, b, c, d, e, f, g) {
            var h = g(["fb", "fbcf", "fbconnect", "fb-messenger", "fbrpc", "file", "ftp", "http", "https", "mailto", "ms-app", "itms", "itms-apps", "itms-services", "market", "svn+ssh", "fbstaging", "tel", "sms"]), i = {isAllowed: function (j) {
                if (!j)return true;
                return h.hasOwnProperty(j.toLowerCase())
            }};
            e.exports = i
        }, null);
        __d("eprintf", [], function (a, b, c, d, e, f) {
            var g = function (h) {
                var i = ES5(Array.prototype.slice.call(arguments),
                    "map", true, function (l) {
                        return String(l)
                    }), j = h.split("%s").length - 1;
                if (j !== i.length - 1)return g("eprintf args number mismatch: %s", ES5("JSON", "stringify", false, i));
                var k = 1;
                return h.replace(/%s/g, function (l) {
                    return String(i[k++])
                })
            };
            e.exports = g
        }, null);
        __d("ex", ["eprintf"], function (a, b, c, d, e, f, g) {
            var h = function () {
                var i = Array.prototype.slice.call(arguments, 0);
                i = ES5(i, "map", true, function (j) {
                    return String(j)
                });
                if (i[0].split("%s").length !== i.length)return h("ex args number mismatch: %s", ES5("JSON", "stringify",
                    false, i));
                return h._prefix + ES5("JSON", "stringify", false, i) + h._suffix
            };
            h._prefix = "\x3c![EX[";
            h._suffix = "]]\x3e";
            e.exports = h
        }, null);
        __d("invariant", [], function (a, b, c, d, e, f) {
            var g = function (h) {
                if (!h) {
                    var i = new Error("Minified exception occured; use the non-minified dev environment for " + "the full error message and additional helpful warnings.");
                    i.framesToPop = 1;
                    throw i;
                }
            };
            e.exports = g
        }, null);
        __d("URIBase", ["URIRFC3986", "URISchemes", "copyProperties", "ex", "invariant"], function (a, b, c, d, e, f, g, h, i, j, k) {
            var l =
                new RegExp("[\\x00-\\x2c\\x2f\\x3b-\\x40\\x5c\\x5e\\x60\\x7b-\\x7f" + "\\uFDD0-\\uFDEF\\uFFF0-\\uFFFF" + "\\u2047\\u2048\\uFE56\\uFE5F\\uFF03\\uFF0F\\uFF1F]"), m = new RegExp("^(?:[^/]*:|" + "[\\x00-\\x1f]*/[\\x00-\\x1f]*/)");

            function n(p, q, r, s) {
                if (!q)return true;
                if (q instanceof o) {
                    p.setProtocol(q.getProtocol());
                    p.setDomain(q.getDomain());
                    p.setPort(q.getPort());
                    p.setPath(q.getPath());
                    p.setQueryData(s.deserialize(s.serialize(q.getQueryData())));
                    p.setFragment(q.getFragment());
                    return true
                }
                q = ES5(q.toString(),
                    "trim", true);
                var t = g.parse(q) || {};
                if (!r && !h.isAllowed(t.scheme))return false;
                p.setProtocol(t.scheme || "");
                if (!r && l.test(t.host))return false;
                p.setDomain(t.host || "");
                p.setPort(t.port || "");
                p.setPath(t.path || "");
                if (r)p.setQueryData(s.deserialize(t.query) || {}); else try {
                    p.setQueryData(s.deserialize(t.query) || {})
                } catch (u) {
                    return false
                }
                p.setFragment(t.fragment || "");
                if (t.userinfo !== null)if (r)throw new Error(j("URI.parse: invalid URI (userinfo is not allowed in a URI): %s", p.toString())); else return false;
                if (!p.getDomain() && ES5(p.getPath(), "indexOf", true, "\\") !== -1)if (r)throw new Error(j("URI.parse: invalid URI (no domain but multiple back-slashes): %s", p.toString())); else return false;
                if (!p.getProtocol() && m.test(q))if (r)throw new Error(j("URI.parse: invalid URI (unsafe protocol-relative URLs): %s", p.toString())); else return false;
                return true
            }

            function o(p, q) {
                k(q);
                this.$URIBase0 = q;
                this.$URIBase1 = "";
                this.$URIBase2 = "";
                this.$URIBase3 = "";
                this.$URIBase4 = "";
                this.$URIBase5 = "";
                this.$URIBase6 = {};
                n(this, p, true,
                    q)
            }

            o.prototype.setProtocol = function (p) {
                k(h.isAllowed(p));
                this.$URIBase1 = p;
                return this
            };
            o.prototype.getProtocol = function (p) {
                return this.$URIBase1
            };
            o.prototype.setSecure = function (p) {
                return this.setProtocol(p ? "https" : "http")
            };
            o.prototype.isSecure = function () {
                return this.getProtocol() === "https"
            };
            o.prototype.setDomain = function (p) {
                if (l.test(p))throw new Error(j("URI.setDomain: unsafe domain specified: %s for url %s", p, this.toString()));
                this.$URIBase2 = p;
                return this
            };
            o.prototype.getDomain = function () {
                return this.$URIBase2
            };
            o.prototype.setPort = function (p) {
                this.$URIBase3 = p;
                return this
            };
            o.prototype.getPort = function () {
                return this.$URIBase3
            };
            o.prototype.setPath = function (p) {
                this.$URIBase4 = p;
                return this
            };
            o.prototype.getPath = function () {
                return this.$URIBase4
            };
            o.prototype.addQueryData = function (p, q) {
                if (Object.prototype.toString.call(p) === "[object Object]")i(this.$URIBase6, p); else this.$URIBase6[p] = q;
                return this
            };
            o.prototype.setQueryData = function (p) {
                this.$URIBase6 = p;
                return this
            };
            o.prototype.getQueryData = function () {
                return this.$URIBase6
            };
            o.prototype.removeQueryData = function (p) {
                if (!ES5("Array", "isArray", false, p))p = [p];
                for (var q = 0, r = p.length; q < r; ++q)delete this.$URIBase6[p[q]];
                return this
            };
            o.prototype.setFragment = function (p) {
                this.$URIBase5 = p;
                return this
            };
            o.prototype.getFragment = function () {
                return this.$URIBase5
            };
            o.prototype.isEmpty = function () {
                return!(this.getPath() || this.getProtocol() || this.getDomain() || this.getPort() || ES5("Object", "keys", false, this.getQueryData()).length > 0 || this.getFragment())
            };
            o.prototype.toString = function () {
                var p =
                    "";
                if (this.$URIBase1)p += this.$URIBase1 + "://";
                if (this.$URIBase2)p += this.$URIBase2;
                if (this.$URIBase3)p += ":" + this.$URIBase3;
                if (this.$URIBase4)p += this.$URIBase4; else if (p)p += "/";
                var q = this.$URIBase0.serialize(this.$URIBase6);
                if (q)p += "?" + q;
                if (this.$URIBase5)p += "#" + this.$URIBase5;
                return p
            };
            o.prototype.getOrigin = function () {
                return this.$URIBase1 + "://" + this.$URIBase2 + (this.$URIBase3 ? ":" + this.$URIBase3 : "")
            };
            o.isValidURI = function (p, q) {
                return n(new o(null, q), p, false, q)
            };
            e.exports = o
        }, null);
        __d("sdk.URI", ["Assert",
            "QueryString", "URIBase"], function (a, b, c, d, e, f, g, h, i) {
            var j = /\.facebook\.com$/, k = {serialize: function (o) {
                return o ? h.encode(o) : ""
            }, deserialize: function (o) {
                return o ? h.decode(o) : {}
            }};
            for (var l in i)if (i.hasOwnProperty(l))n[l] = i[l];
            var m = i === null ? null : i.prototype;
            n.prototype = ES5("Object", "create", false, m);
            n.prototype.constructor = n;
            n.__superConstructor__ = i;
            function n(o) {
                g.isString(o, "The passed argument was of invalid type.");
                if (!(this instanceof n))return new n(o);
                i.call(this, o, k)
            }

            n.prototype.isFacebookURI =
                function () {
                    return j.test(this.getDomain())
                };
            n.prototype.valueOf = function () {
                return this.toString()
            };
            e.exports = n
        }, null);
        __d("sdk.domReady", [], function (a, b, c, d, e, f) {
            var g, h = "readyState"in document ? /loaded|complete/.test(document.readyState) : !!document.body;

            function i() {
                if (!g)return;
                var l;
                while (l = g.shift())l();
                g = null
            }

            function j(l) {
                if (g) {
                    g.push(l);
                    return
                } else l()
            }

            if (!h) {
                g = [];
                if (document.addEventListener) {
                    document.addEventListener("DOMContentLoaded", i, false);
                    window.addEventListener("load", i, false)
                } else if (document.attachEvent) {
                    document.attachEvent("onreadystatechange",
                        i);
                    window.attachEvent("onload", i)
                }
                if (document.documentElement.doScroll && window == window.top) {
                    var k = function () {
                        try {
                            document.documentElement.doScroll("left")
                        } catch (l) {
                            setTimeout(k, 0);
                            return
                        }
                        i()
                    };
                    k()
                }
            }
            e.exports = j
        }, 3);
        __d("sdk.Content", ["sdk.domReady", "Log", "UserAgent"], function (a, b, c, d, e, f, g, h, i) {
            var j, k, l = {append: function (m, n) {
                if (!n)if (!j) {
                    j = n = document.getElementById("fb-root");
                    if (!n) {
                        h.warn('The "fb-root" div has not been created, auto-creating');
                        j = n = document.createElement("div");
                        n.id = "fb-root";
                        if (i.ie() || !document.body)g(function () {
                            document.body.appendChild(n)
                        }); else document.body.appendChild(n)
                    }
                    n.className += " fb_reset"
                } else n = j;
                if (typeof m == "string") {
                    var o = document.createElement("div");
                    n.appendChild(o).innerHTML = m;
                    return o
                } else return n.appendChild(m)
            }, appendHidden: function (m) {
                if (!n) {
                    var n = document.createElement("div"), o = n.style;
                    o.position = "absolute";
                    o.top = "-10000px";
                    o.width = o.height = 0;
                    n = l.append(n)
                }
                return l.append(m, n)
            }, submitToTarget: function (m, n) {
                var o = document.createElement("form");
                o.action =
                    m.url;
                o.target = m.target;
                o.method = n ? "GET" : "POST";
                l.appendHidden(o);
                for (var p in m.params)if (m.params.hasOwnProperty(p)) {
                    var q = m.params[p];
                    if (q !== null && q !== undefined) {
                        var r = document.createElement("input");
                        r.name = p;
                        r.value = q;
                        o.appendChild(r)
                    }
                }
                o.submit();
                o.parentNode.removeChild(o)
            }};
            e.exports = l
        }, null);
        __d("sdk.Event", [], function (a, b, c, d, e, f) {
            var g = {subscribers: function () {
                if (!this._subscribersMap)this._subscribersMap = {};
                return this._subscribersMap
            }, subscribe: function (h, i) {
                var j = this.subscribers();
                if (!j[h])j[h] =
                    [i]; else j[h].push(i)
            }, unsubscribe: function (h, i) {
                var j = this.subscribers()[h];
                if (j)ES5(j, "forEach", true, function (k, l) {
                    if (k == i)j[l] = null
                })
            }, monitor: function (h, i) {
                if (!i()) {
                    var j = this, k = function () {
                        if (i.apply(i, arguments))j.unsubscribe(h, k)
                    };
                    this.subscribe(h, k)
                }
            }, clear: function (h) {
                delete this.subscribers()[h]
            }, fire: function (h) {
                var i = Array.prototype.slice.call(arguments, 1), j = this.subscribers()[h];
                if (j)ES5(j, "forEach", true, function (k) {
                    if (k)k.apply(this, i)
                })
            }};
            e.exports = g
        }, null);
        __d("Queue", ["copyProperties"],
            function (a, b, c, d, e, f, g) {
                var h = {};

                function i(j) {
                    this._opts = g({interval: 0, processor: null}, j);
                    this._queue = [];
                    this._stopped = true
                }

                i.prototype._dispatch = function (j) {
                    if (this._stopped || this._queue.length === 0)return;
                    if (!this._opts.processor) {
                        this._stopped = true;
                        throw new Error("No processor available");
                    }
                    if (this._opts.interval) {
                        this._opts.processor.call(this, this._queue.shift());
                        this._timeout = setTimeout(ES5(this._dispatch, "bind", true, this), this._opts.interval)
                    } else while (this._queue.length)this._opts.processor.call(this,
                        this._queue.shift())
                };
                i.prototype.enqueue = function (j) {
                    if (this._opts.processor && !this._stopped)this._opts.processor.call(this, j); else this._queue.push(j);
                    return this
                };
                i.prototype.start = function (j) {
                    if (j)this._opts.processor = j;
                    this._stopped = false;
                    this._dispatch();
                    return this
                };
                i.prototype.isStarted = function () {
                    return!this._stopped
                };
                i.prototype.dispatch = function () {
                    this._dispatch(true)
                };
                i.prototype.stop = function (j) {
                    this._stopped = true;
                    if (j)clearTimeout(this._timeout);
                    return this
                };
                i.prototype.merge = function (j, k) {
                    this._queue[k ? "unshift" : "push"].apply(this._queue, j._queue);
                    j._queue = [];
                    this._dispatch();
                    return this
                };
                i.prototype.getLength = function () {
                    return this._queue.length
                };
                i.get = function (j, k) {
                    var l;
                    if (j in h)l = h[j]; else l = h[j] = new i(k);
                    return l
                };
                i.exists = function (j) {
                    return j in h
                };
                i.remove = function (j) {
                    return delete h[j]
                };
                e.exports = i
            }, null);
        __d("JSONRPC", ["copyProperties", "Log"], function (a, b, c, d, e, f, g, h) {
            function i(j) {
                this._counter = 0;
                this._callbacks = {};
                this.remote = ES5(function (k) {
                        this._context = k;
                        return this.remote
                    },
                    "bind", true, this);
                this.local = {};
                this._write = j
            }

            g(i.prototype, {stub: function (j) {
                this.remote[j] = ES5(function () {
                    var k = Array.prototype.slice.call(arguments), l = {jsonrpc: "2.0", method: j};
                    if (typeof k[k.length - 1] == "function") {
                        l.id = ++this._counter;
                        this._callbacks[l.id] = k.pop()
                    }
                    l.params = k;
                    this._write(ES5("JSON", "stringify", false, l), this._context || {method: j})
                }, "bind", true, this)
            }, read: function (j, k) {
                var l = ES5("JSON", "parse", false, j), m = l.id;
                if (!l.method) {
                    if (!this._callbacks[m]) {
                        h.warn("Could not find callback %s",
                            m);
                        return
                    }
                    var n = this._callbacks[m];
                    delete this._callbacks[m];
                    delete l.id;
                    delete l.jsonrpc;
                    n(l);
                    return
                }
                var o = this, p = this.local[l.method], q;
                if (m)q = function (t, u) {
                    var v = {jsonrpc: "2.0", id: m};
                    v[t] = u;
                    setTimeout(function () {
                        o._write(ES5("JSON", "stringify", false, v), k)
                    }, 0)
                }; else q = function () {
                };
                if (!p) {
                    h.error('Method "%s" has not been defined', l.method);
                    q("error", {code: -32601, message: "Method not found", data: l.method});
                    return
                }
                l.params.push(ES5(q, "bind", true, null, "result"));
                l.params.push(ES5(q, "bind", true, null,
                    "error"));
                try {
                    var s = p.apply(k || null, l.params);
                    if (typeof s !== "undefined")q("result", s)
                } catch (r) {
                    h.error("Invokation of RPC method %s resulted in the error: %s", l.method, r.message);
                    q("error", {code: -32603, message: "Internal error", data: r.message})
                }
            }});
            e.exports = i
        }, null);
        __d("sdk.RPC", ["Assert", "JSONRPC", "Queue"], function (a, b, c, d, e, f, g, h, i) {
            var j = new i, k = new h(function (m) {
                j.enqueue(m)
            }), l = {local: k.local, remote: k.remote, stub: ES5(k.stub, "bind", true, k), setInQueue: function (m) {
                g.isInstanceOf(i, m);
                m.start(function (n) {
                    k.read(n)
                })
            },
                getOutQueue: function () {
                    return j
                }};
            e.exports = l
        }, null);
        __d("sdk.Scribe", ["QueryString", "sdk.Runtime", "UrlMap"], function (a, b, c, d, e, f, g, h, i) {
            function j(l, m) {
                if (typeof m.extra == "object")m.extra.revision = h.getRevision();
                (new Image).src = g.appendToUrl(i.resolve("www", true) + "/common/scribe_endpoint.php", {c: l, m: ES5("JSON", "stringify", false, m)})
            }

            var k = {log: j};
            e.exports = k
        }, null);
        __d("emptyFunction", ["copyProperties"], function (a, b, c, d, e, f, g) {
            function h(j) {
                return function () {
                    return j
                }
            }

            function i() {
            }

            g(i, {thatReturns: h,
                thatReturnsFalse: h(false), thatReturnsTrue: h(true), thatReturnsNull: h(null), thatReturnsThis: function () {
                    return this
                }, thatReturnsArgument: function (j) {
                    return j
                }});
            e.exports = i
        }, null);
        __d("htmlSpecialChars", [], function (a, b, c, d, e, f) {
            var g = /&/g, h = /</g, i = />/g, j = /"/g, k = /'/g;

            function l(m) {
                if (typeof m == "undefined" || m === null || !m.toString)return"";
                if (m === false)return"0"; else if (m === true)return"1";
                return m.toString().replace(g, "\x26amp;").replace(j, "\x26quot;").replace(k, "\x26#039;").replace(h, "\x26lt;").replace(i,
                    "\x26gt;")
            }

            e.exports = l
        }, null);
        __d("Flash", ["DOMEventListener", "DOMWrapper", "QueryString", "UserAgent", "copyProperties", "guid", "htmlSpecialChars"], function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
            var n = {}, o, p = h.getWindow().document;

            function q(v) {
                var w = p.getElementById(v);
                if (w)w.parentNode.removeChild(w);
                delete n[v]
            }

            function r() {
                for (var v in n)if (n.hasOwnProperty(v))q(v)
            }

            function s(v) {
                return v.replace(/\d+/g, function (w) {
                    return"000".substring(w.length) + w
                })
            }

            function t(v) {
                if (!o) {
                    if (j.ie() >= 9)g.add(window, "unload", r);
                    o = true
                }
                n[v] = v
            }

            var u = {embed: function (v, w, x, y) {
                var z = l();
                v = m(v).replace(/&amp;/g, "\x26");
                x = k({allowscriptaccess: "always", flashvars: y, movie: v}, x || {});
                if (typeof x.flashvars == "object")x.flashvars = i.encode(x.flashvars);
                var aa = [];
                for (var ba in x)if (x.hasOwnProperty(ba) && x[ba])aa.push('\x3cparam name\x3d"' + m(ba) + '" value\x3d"' + m(x[ba]) + '"\x3e');
                var ca = w.appendChild(p.createElement("span")), da = "\x3cobject " + (j.ie() ? 'classid\x3d"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ' : 'type\x3d"application/x-shockwave-flash"') +
                    'data\x3d"' + v + '" ' + (x.height ? 'height\x3d"' + x.height + '" ' : "") + (x.width ? 'width\x3d"' + x.width + '" ' : "") + 'id\x3d"' + z + '"\x3e' + aa.join("") + "\x3c/object\x3e";
                ca.innerHTML = da;
                var ea = ca.firstChild;
                t(z);
                return ea
            }, remove: q, getVersion: function () {
                var v = "Shockwave Flash", w = "application/x-shockwave-flash", x = "ShockwaveFlash.ShockwaveFlash", y;
                if (navigator.plugins && typeof navigator.plugins[v] == "object") {
                    var z = navigator.plugins[v].description;
                    if (z && navigator.mimeTypes && navigator.mimeTypes[w] && navigator.mimeTypes[w].enabledPlugin)y =
                        z.match(/\d+/g)
                }
                if (!y)try {
                    y = (new ActiveXObject(x)).GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/);
                    y = Array.prototype.slice.call(y, 1)
                } catch (aa) {
                }
                return y
            }, checkMinVersion: function (v) {
                var w = u.getVersion();
                if (!w)return false;
                return s(w.join(".")) >= s(v)
            }, isAvailable: function () {
                return!!u.getVersion()
            }};
            e.exports = u
        }, null);
        __d("dotAccess", [], function (a, b, c, d, e, f) {
            function g(h, i, j) {
                var k = i.split(".");
                do {
                    var l = k.shift();
                    h = h[l] || j && (h[l] = {})
                } while (k.length && h);
                return h
            }

            e.exports = g
        }, null);
        __d("GlobalCallback",
            ["DOMWrapper", "dotAccess", "guid", "wrapFunction"], function (a, b, c, d, e, f, g, h, i, j) {
                var k, l, m = {setPrefix: function (n) {
                    k = h(g.getWindow(), n, true);
                    l = n
                }, create: function (n, o) {
                    if (!k)this.setPrefix("__globalCallbacks");
                    var p = i();
                    k[p] = j(n, "entry", o || "GlobalCallback");
                    return l + "." + p
                }, remove: function (n) {
                    var o = n.substring(l.length + 1);
                    delete k[o]
                }};
                e.exports = m
            }, null);
        __d("XDM", ["DOMEventListener", "DOMWrapper", "emptyFunction", "Flash", "GlobalCallback", "guid", "Log", "UserAgent", "wrapFunction"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
            var p = {}, q = {transports: []}, r = h.getWindow();

            function s(u) {
                var v = {}, w = u.length, x = q.transports;
                while (w--)v[u[w]] = 1;
                w = x.length;
                while (w--) {
                    var y = x[w], z = p[y];
                    if (!v[y] && z.isAvailable())return y
                }
            }

            var t = {register: function (u, v) {
                m.debug("Registering %s as XDM provider", u);
                q.transports.push(u);
                p[u] = v
            }, create: function (u) {
                if (!u.whenReady && !u.onMessage) {
                    m.error("An instance without whenReady or onMessage makes no sense");
                    throw new Error("An instance without whenReady or " + "onMessage makes no sense");
                }
                if (!u.channel) {
                    m.warn("Missing channel name, selecting at random");
                    u.channel = l()
                }
                if (!u.whenReady)u.whenReady = i;
                if (!u.onMessage)u.onMessage = i;
                var v = u.transport || s(u.blacklist || []), w = p[v];
                if (w && w.isAvailable()) {
                    m.debug("%s is available", v);
                    w.init(u);
                    return v
                }
            }};
            t.register("flash", function () {
                var u = false, v, w = false, x = 15E3, y;
                return{isAvailable: function () {
                    return j.checkMinVersion("8.0.24")
                }, init: function (z) {
                    m.debug("init flash: " + z.channel);
                    var aa = {send: function (da, ea, fa, ga) {
                        m.debug("sending to: %s (%s)",
                            ea, ga);
                        v.postMessage(da, ea, ga)
                    }};
                    if (u) {
                        z.whenReady(aa);
                        return
                    }
                    var ba = z.root.appendChild(r.document.createElement("div")), ca = k.create(function () {
                        k.remove(ca);
                        clearTimeout(y);
                        m.info("xdm.swf called the callback");
                        var da = k.create(function (ea, fa) {
                            ea = decodeURIComponent(ea);
                            fa = decodeURIComponent(fa);
                            m.debug("received message %s from %s", ea, fa);
                            z.onMessage(ea, fa)
                        }, "xdm.swf:onMessage");
                        v.init(z.channel, da);
                        z.whenReady(aa)
                    }, "xdm.swf:load");
                    v = j.embed(z.flashUrl, ba, null, {protocol: location.protocol.replace(":",
                        ""), host: location.host, callback: ca, log: w});
                    y = setTimeout(function () {
                        m.warn("The Flash component did not load within %s ms - " + "verify that the container is not set to hidden or invisible " + "using CSS as this will cause some browsers to not load " + "the components", x)
                    }, x);
                    u = true
                }}
            }());
            t.register("postmessage", function () {
                var u = false;
                return{isAvailable: function () {
                    return!!r.postMessage
                }, init: function (v) {
                    m.debug("init postMessage: " + v.channel);
                    var w = "_FB_" + v.channel, x = {send: function (y, z, aa, ba) {
                        if (r === aa) {
                            m.error("Invalid windowref, equal to window (self)");
                            throw new Error;
                        }
                        m.debug("sending to: %s (%s)", z, ba);
                        var ca = function () {
                            aa.postMessage("_FB_" + ba + y, z)
                        };
                        if (n.ie() == 8 || n.ieCompatibilityMode())setTimeout(ca, 0); else ca()
                    }};
                    if (u) {
                        v.whenReady(x);
                        return
                    }
                    g.add(r, "message", o(function (event) {
                        var y = event.data, z = event.origin || "native";
                        if (!/^(https?:\/\/|native$)/.test(z)) {
                            m.debug("Received message from invalid origin type: %s", z);
                            return
                        }
                        if (typeof y != "string") {
                            m.warn("Received message of type %s from %s, expected a string", typeof y, z);
                            return
                        }
                        m.debug("received message %s from %s",
                            y, z);
                        if (y.substring(0, w.length) == w)y = y.substring(w.length);
                        v.onMessage(y, z)
                    }, "entry", "onMessage"));
                    v.whenReady(x);
                    u = true
                }}
            }());
            e.exports = t
        }, null);
        __d("sdk.XD", ["sdk.Content", "sdk.Event", "Log", "QueryString", "Queue", "sdk.RPC", "sdk.Runtime", "sdk.Scribe", "sdk.URI", "UrlMap", "JSSDKXDConfig", "XDM", "sdk.createIframe", "sdk.feature", "guid"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u) {
            var v = new k, w = new k, x = new k, y, z, aa = u(), ba = q.useCdn ? "cdn" : "www", ca = t("use_bundle") ? q.XdBundleUrl : q.XdUrl, da = p.resolve(ba,
                false) + ca, ea = p.resolve(ba, true) + ca, fa = u(), ga = location.protocol + "//" + location.host, ha, ia = false, ja = "Facebook Cross Domain Communication Frame", ka = {}, la = new k;
            l.setInQueue(la);
            function ma(sa) {
                i.info("Remote XD can talk to facebook.com (%s)", sa);
                m.setEnvironment(sa === "canvas" ? m.ENVIRONMENTS.CANVAS : m.ENVIRONMENTS.PAGETAB)
            }

            function na(sa, ta) {
                if (!ta) {
                    i.error("No senderOrigin");
                    throw new Error;
                }
                var ua = /^https?/.exec(ta)[0];
                switch (sa.xd_action) {
                    case "proxy_ready":
                        var va, wa;
                        if (ua == "https") {
                            va = x;
                            wa = z
                        } else {
                            va =
                                w;
                            wa = y
                        }
                        if (sa.registered) {
                            ma(sa.registered);
                            v = va.merge(v)
                        }
                        i.info("Proxy ready, starting queue %s containing %s messages", ua + "ProxyQueue", va.getLength());
                        va.start(function (ya) {
                            ha.send(typeof ya === "string" ? ya : j.encode(ya), ta, wa.contentWindow, fa + "_" + ua)
                        });
                        break;
                    case "plugin_ready":
                        i.info("Plugin %s ready, protocol: %s", sa.name, ua);
                        ka[sa.name] = {protocol: ua};
                        if (k.exists(sa.name)) {
                            var xa = k.get(sa.name);
                            i.debug("Enqueuing %s messages for %s in %s", xa.getLength(), sa.name, ua + "ProxyQueue");
                            (ua == "https" ? x : w).merge(xa)
                        }
                        break
                }
                if (sa.data)oa(sa.data,
                    ta)
            }

            function oa(sa, ta) {
                if (ta && ta !== "native" && !o(ta).isFacebookURI())return;
                if (typeof sa == "string") {
                    if (/^FB_RPC:/.test(sa)) {
                        la.enqueue(sa.substring(7));
                        return
                    }
                    if (sa.substring(0, 1) == "{")try {
                        sa = ES5("JSON", "parse", false, sa)
                    } catch (ua) {
                        i.warn("Failed to decode %s as JSON", sa);
                        return
                    } else sa = j.decode(sa)
                }
                if (!ta)if (sa.xd_sig == aa)ta = sa.xd_origin;
                if (sa.xd_action) {
                    na(sa, ta);
                    return
                }
                if (sa.access_token)m.setSecure(/^https/.test(ga));
                if (sa.cb) {
                    var va = ra._callbacks[sa.cb];
                    if (!ra._forever[sa.cb])delete ra._callbacks[sa.cb];
                    if (va)va(sa)
                }
            }

            function pa(sa, ta) {
                if (sa == "facebook") {
                    ta.relation = "parent.parent";
                    v.enqueue(ta)
                } else {
                    ta.relation = 'parent.frames["' + sa + '"]';
                    var ua = ka[sa];
                    if (ua) {
                        i.debug("Enqueuing message for plugin %s in %s", sa, ua.protocol + "ProxyQueue");
                        (ua.protocol == "https" ? x : w).enqueue(ta)
                    } else {
                        i.debug("Buffering message for plugin %s", sa);
                        k.get(sa).enqueue(ta)
                    }
                }
            }

            l.getOutQueue().start(function (sa) {
                pa("facebook", "FB_RPC:" + sa)
            });
            function qa(sa) {
                if (ia)return;
                var ta = g.appendHidden(document.createElement("div")), ua = r.create({blacklist: null,
                    root: ta, channel: fa, flashUrl: q.Flash.path, whenReady: function (va) {
                        ha = va;
                        var wa = {channel: fa, origin: location.protocol + "//" + location.host, transport: ua, xd_name: sa}, xa = "#" + j.encode(wa);
                        if (m.getSecure() !== true)y = s({url: da + xa, name: "fb_xdm_frame_http", id: "fb_xdm_frame_http", root: ta, "aria-hidden": true, title: ja, tabindex: -1});
                        z = s({url: ea + xa, name: "fb_xdm_frame_https", id: "fb_xdm_frame_https", root: ta, "aria-hidden": true, title: ja, tabindex: -1})
                    }, onMessage: oa});
                if (!ua)n.log("jssdk_error", {appId: m.getClientID(), error: "XD_TRANSPORT",
                    extra: {message: "Failed to create a valid transport"}});
                ia = true
            }

            var ra = {rpc: l, _callbacks: {}, _forever: {}, _channel: fa, _origin: ga, onMessage: oa, recv: oa, init: qa, sendToFacebook: pa, inform: function (sa, ta, ua, va) {
                pa("facebook", {method: sa, params: ES5("JSON", "stringify", false, ta || {}), behavior: va || "p", relation: ua})
            }, handler: function (sa, ta, ua, va) {
                var wa = "#" + j.encode({cb: this.registerCallback(sa, ua, va), origin: ga + "/" + fa, domain: location.hostname, relation: ta || "opener"});
                return(location.protocol == "https:" ? ea : da) + wa
            },
                registerCallback: function (sa, ta, ua) {
                    ua = ua || u();
                    if (ta)ra._forever[ua] = true;
                    ra._callbacks[ua] = sa;
                    return ua
                }};
            h.subscribe("init:post", function (sa) {
                qa(sa.xdProxyName);
                var ta = t("xd_timeout");
                if (ta)setTimeout(function () {
                    var ua = z && !!y == w.isStarted() && !!z == x.isStarted();
                    if (!ua)n.log("jssdk_error", {appId: m.getClientID(), error: "XD_INITIALIZATION", extra: {message: "Failed to initialize in " + ta + "ms"}})
                }, ta)
            });
            e.exports = ra
        }, null);
        __d("sdk.Auth", ["sdk.Cookie", "copyProperties", "sdk.createIframe", "DOMWrapper", "sdk.feature",
            "sdk.getContextType", "guid", "sdk.Impressions", "Log", "ObservableMixin", "sdk.Runtime", "sdk.SignedRequest", "UrlMap", "sdk.URI", "sdk.XD"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u) {
            var v, w, x = new p;

            function y(ea, fa) {
                var ga = q.getUserID(), ha = "";
                if (ea)if (ea.userID)ha = ea.userID; else if (ea.signedRequest) {
                    var ia = r.parse(ea.signedRequest);
                    if (ia && ia.user_id)ha = ia.user_id
                }
                var ja = q.getLoginStatus(), ka = ja === "unknown" && ea || q.getUseCookie() && q.getCookieUserID() !== ha, la = ga && !ea, ma = ea && ga && ga != ha, na = ea != v, oa =
                    fa != (ja || "unknown");
                q.setLoginStatus(fa);
                q.setAccessToken(ea && ea.accessToken || null);
                q.setUserID(ha);
                v = ea;
                var pa = {authResponse: ea, status: fa};
                if (la || ma)x.inform("logout", pa);
                if (ka || ma)x.inform("login", pa);
                if (na)x.inform("authresponse.change", pa);
                if (oa)x.inform("status.change", pa);
                return pa
            }

            function z() {
                return v
            }

            function aa(ea, fa, ga) {
                return function (ha) {
                    var ia;
                    if (ha && ha.access_token) {
                        var ja = r.parse(ha.signed_request);
                        fa = {accessToken: ha.access_token, userID: ja.user_id, expiresIn: parseInt(ha.expires_in,
                            10), signedRequest: ha.signed_request};
                        if (ha.granted_scopes)fa.grantedScopes = ha.granted_scopes;
                        if (q.getUseCookie()) {
                            var ka = fa.expiresIn === 0 ? 0 : ES5("Date", "now", false) + fa.expiresIn * 1E3, la = g.getDomain();
                            if (!la && ha.base_domain)g.setDomain("." + ha.base_domain);
                            g.setSignedRequestCookie(ha.signed_request, ka)
                        }
                        ia = "connected";
                        y(fa, ia)
                    } else if (ga === "logout" || ga === "login_status") {
                        if (ha.error && ha.error === "not_authorized")ia = "not_authorized"; else ia = "unknown";
                        y(null, ia);
                        if (q.getUseCookie())g.clearSignedRequestCookie()
                    }
                    if (ha &&
                        ha.https == 1)q.setSecure(true);
                    if (ea)ea({authResponse: fa, status: q.getLoginStatus()});
                    return fa
                }
            }

            function ba(ea) {
                var fa, ga = ES5("Date", "now", false);
                if (w) {
                    clearTimeout(w);
                    w = null
                }
                var ha = aa(ea, v, "login_status"), ia = t(s.resolve("www", true) + "/connect/ping").setQueryData({client_id: q.getClientID(), response_type: "token,signed_request,code", domain: location.hostname, origin: l(), redirect_uri: u.handler(function (ja) {
                    if (k("e2e_ping_tracking", true)) {
                        var ka = {init: ga, close: ES5("Date", "now", false), method: "ping"};
                        o.debug("e2e: %s",
                            ES5("JSON", "stringify", false, ka));
                        n.log(114, {payload: ka})
                    }
                    fa.parentNode.removeChild(fa);
                    if (ha(ja))w = setTimeout(function () {
                        ba(function () {
                        })
                    }, 12E5)
                }, "parent"), sdk: "joey", kid_directed_site: q.getKidDirectedSite()});
                fa = i({root: j.getRoot(), name: m(), url: ia.toString(), style: {display: "none"}})
            }

            var ca;

            function da(ea, fa) {
                if (!q.getClientID()) {
                    o.warn("FB.getLoginStatus() called before calling FB.init().");
                    return
                }
                if (ea)if (!fa && ca == "loaded") {
                    ea({status: q.getLoginStatus(), authResponse: z()});
                    return
                } else x.subscribe("FB.loginStatus",
                    ea);
                if (!fa && ca == "loading")return;
                ca = "loading";
                var ga = function (ha) {
                    ca = "loaded";
                    x.inform("FB.loginStatus", ha);
                    x.clearSubscribers("FB.loginStatus")
                };
                ba(ga)
            }

            h(x, {getLoginStatus: da, fetchLoginStatus: ba, setAuthResponse: y, getAuthResponse: z, parseSignedRequest: r.parse, xdResponseWrapper: aa});
            e.exports = x
        }, null);
        __d("toArray", ["invariant"], function (a, b, c, d, e, f, g) {
            function h(i) {
                var j = i.length;
                g(!ES5("Array", "isArray", false, i) && (typeof i === "object" || typeof i === "function"));
                g(typeof j === "number");
                g(j === 0 || j - 1 in
                    i);
                if (i.hasOwnProperty)try {
                    return Array.prototype.slice.call(i)
                } catch (k) {
                }
                var l = Array(j);
                for (var m = 0; m < j; m++)l[m] = i[m];
                return l
            }

            e.exports = h
        }, null);
        __d("createArrayFrom", ["toArray"], function (a, b, c, d, e, f, g) {
            function h(j) {
                return!!j && (typeof j == "object" || typeof j == "function") && "length"in j && !("setInterval"in j) && typeof j.nodeType != "number" && (ES5("Array", "isArray", false, j) || "callee"in j || "item"in j)
            }

            function i(j) {
                if (!h(j))return[j]; else if (ES5("Array", "isArray", false, j))return j.slice(); else return g(j)
            }

            e.exports = i
        }, null);
        __d("sdk.DOM", ["Assert", "createArrayFrom", "sdk.domReady", "UserAgent"], function (a, b, c, d, e, f, g, h, i, j) {
            var k = {};

            function l(z, aa) {
                var ba = z.getAttribute(aa) || z.getAttribute(aa.replace(/_/g, "-")) || z.getAttribute(aa.replace(/-/g, "_")) || z.getAttribute(aa.replace(/-/g, "")) || z.getAttribute(aa.replace(/_/g, "")) || z.getAttribute("data-" + aa) || z.getAttribute("data-" + aa.replace(/_/g, "-")) || z.getAttribute("data-" + aa.replace(/-/g, "_")) || z.getAttribute("data-" + aa.replace(/-/g, "")) || z.getAttribute("data-" +
                    aa.replace(/_/g, ""));
                return ba ? String(ba) : null
            }

            function m(z, aa) {
                var ba = l(z, aa);
                return ba ? /^(true|1|yes|on)$/.test(ba) : null
            }

            function n(z, aa) {
                g.isTruthy(z, "element not specified");
                g.isString(aa);
                try {
                    return String(z[aa])
                } catch (ba) {
                    throw new Error("Could not read property " + aa + " : " + ba.message);
                }
            }

            function o(z, aa) {
                g.isTruthy(z, "element not specified");
                g.isString(aa);
                try {
                    z.innerHTML = aa
                } catch (ba) {
                    throw new Error("Could not set innerHTML : " + ba.message);
                }
            }

            function p(z, aa) {
                g.isTruthy(z, "element not specified");
                g.isString(aa);
                var ba = " " + n(z, "className") + " ";
                return ES5(ba, "indexOf", true, " " + aa + " ") >= 0
            }

            function q(z, aa) {
                g.isTruthy(z, "element not specified");
                g.isString(aa);
                if (!p(z, aa))z.className = n(z, "className") + " " + aa
            }

            function r(z, aa) {
                g.isTruthy(z, "element not specified");
                g.isString(aa);
                var ba = new RegExp("\\s*" + aa, "g");
                z.className = ES5(n(z, "className").replace(ba, ""), "trim", true)
            }

            function s(z, aa, ba) {
                g.isString(z);
                aa = aa || document.body;
                ba = ba || "*";
                if (aa.querySelectorAll)return h(aa.querySelectorAll(ba + "." + z));
                var ca = aa.getElementsByTagName(ba), da = [];
                for (var ea = 0, fa = ca.length; ea < fa; ea++)if (p(ca[ea], z))da[da.length] = ca[ea];
                return da
            }

            function t(z, aa) {
                g.isTruthy(z, "element not specified");
                g.isString(aa);
                aa = aa.replace(/-(\w)/g, function (da, ea) {
                    return ea.toUpperCase()
                });
                var ba = z.currentStyle || document.defaultView.getComputedStyle(z, null), ca = ba[aa];
                if (/backgroundPosition?/.test(aa) && /top|left/.test(ca))ca = "0%";
                return ca
            }

            function u(z, aa, ba) {
                g.isTruthy(z, "element not specified");
                g.isString(aa);
                aa = aa.replace(/-(\w)/g,
                    function (ca, da) {
                        return da.toUpperCase()
                    });
                z.style[aa] = ba
            }

            function v(z, aa) {
                var ba = true;
                for (var ca = 0, da; da = aa[ca++];)if (!(da in k)) {
                    ba = false;
                    k[da] = true
                }
                if (ba)return;
                if (!j.ie()) {
                    var ea = document.createElement("style");
                    ea.type = "text/css";
                    ea.textContent = z;
                    document.getElementsByTagName("head")[0].appendChild(ea)
                } else try {
                    document.createStyleSheet().cssText = z
                } catch (fa) {
                    if (document.styleSheets[0])document.styleSheets[0].cssText += z
                }
            }

            function w() {
                var z = document.documentElement && document.compatMode == "CSS1Compat" ?
                    document.documentElement : document.body;
                return{scrollTop: z.scrollTop || document.body.scrollTop, scrollLeft: z.scrollLeft || document.body.scrollLeft, width: window.innerWidth ? window.innerWidth : z.clientWidth, height: window.innerHeight ? window.innerHeight : z.clientHeight}
            }

            function x(z) {
                g.isTruthy(z, "element not specified");
                var aa = 0, ba = 0;
                do {
                    aa += z.offsetLeft;
                    ba += z.offsetTop
                } while (z = z.offsetParent);
                return{x: aa, y: ba}
            }

            var y = {containsCss: p, addCss: q, removeCss: r, getByClass: s, getStyle: t, setStyle: u, getAttr: l, getBoolAttr: m,
                getProp: n, html: o, addCssRules: v, getViewportInfo: w, getPosition: x, ready: i};
            e.exports = y
        }, null);
        __d("sdk.ErrorHandling", ["sdk.feature", "ManagedError", "sdk.Runtime", "sdk.Scribe", "UserAgent", "wrapFunction"], function (a, b, c, d, e, f, g, h, i, j, k, l) {
            var m = g("error_handling", false), n = "";

            function o(u) {
                var v = u._originalError;
                delete u._originalError;
                j.log("jssdk_error", {appId: i.getClientID(), error: u.name || u.message, extra: u});
                throw v;
            }

            function p(u) {
                var v = {line: u.lineNumber || u.line, message: u.message, name: u.name, script: u.fileName ||
                    u.sourceURL || u.script, stack: u.stackTrace || u.stack};
                v._originalError = u;
                if (k.chrome() && /([\w:\.\/]+\.js):(\d+)/.test(u.stack)) {
                    v.script = RegExp.$1;
                    v.line = parseInt(RegExp.$2, 10)
                }
                for (var w in v)v[w] == null && delete v[w];
                return v
            }

            function q(u, v) {
                return function () {
                    if (!m)return u.apply(this, arguments);
                    try {
                        n = v;
                        return u.apply(this, arguments)
                    } catch (w) {
                        if (w instanceof h)throw w;
                        var x = p(w);
                        x.entry = v;
                        var y = ES5(Array.prototype.slice.call(arguments), "map", true, function (z) {
                            var aa = Object.prototype.toString.call(z);
                            return/^\[object (String|Number|Boolean|Object|Date)\]$/.test(aa) ?
                                z : z.toString()
                        });
                        x.args = ES5("JSON", "stringify", false, y).substring(0, 200);
                        o(x)
                    } finally {
                        n = ""
                    }
                }
            }

            function r(u) {
                if (!u.__wrapper)u.__wrapper = function () {
                    try {
                        return u.apply(this, arguments)
                    } catch (v) {
                        window.setTimeout(function () {
                            throw v;
                        }, 0);
                        return false
                    }
                };
                return u.__wrapper
            }

            function s(u, v) {
                return function (w, x) {
                    var y = v + ":" + (n || "[global]") + ":" + (w.name || "[anonymous]" + (arguments.callee.caller.name ? "(" + arguments.callee.caller.name + ")" : ""));
                    return u(l(w, "entry", y), x)
                }
            }

            if (m) {
                setTimeout = s(setTimeout, "setTimeout");
                setInterval = s(setInterval, "setInterval");
                l.setWrapper(q, "entry")
            }
            var t = {guard: q, unguard: r};
            e.exports = t
        }, null);
        __d("sdk.Insights", ["sdk.Impressions"], function (a, b, c, d, e, f, g) {
            var h = {TYPE: {NOTICE: "notice", WARNING: "warn", ERROR: "error"}, CATEGORY: {DEPRECATED: "deprecated", APIERROR: "apierror"}, log: function (i, j, k) {
                var l = {source: "jssdk", type: i, category: j, payload: k};
                g.log(113, l)
            }, impression: g.impression};
            e.exports = h
        }, null);
        __d("FB", ["sdk.Auth", "copyProperties", "JSSDKCssConfig", "dotAccess", "sdk.domReady", "sdk.DOM",
            "sdk.ErrorHandling", "sdk.Content", "DOMWrapper", "GlobalCallback", "sdk.Insights", "Log", "sdk.Runtime", "sdk.Scribe", "JSSDKConfig"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u) {
            var v, w, x = j(u, "api.mode"), y = {};
            v = window.FB = {};
            var z = {};
            r.level = 1;
            p.setPrefix("FB.__globalCallbacks");
            var aa = document.createElement("div");
            o.setRoot(aa);
            k(function () {
                r.info("domReady");
                n.appendHidden(aa);
                if (i.rules)l.addCssRules(i.rules, i.components)
            });
            s.subscribe("AccessToken.change", function (da) {
                if (!da && s.getLoginStatus() ===
                    "connected")g.getLoginStatus(null, true)
            });
            if (j(u, "api.whitelist.length")) {
                w = {};
                ES5(u.api.whitelist, "forEach", true, function (da) {
                    w[da] = 1
                })
            }
            function ba(da, ea, fa, ga) {
                var ha;
                if (/^_/.test(fa))ha = "hide"; else if (w && !w[ea])ha = x;
                switch (ha) {
                    case "hide":
                        return;
                    case "stub":
                        return function () {
                            r.warn("The method FB.%s has been removed from the JS SDK.", ea)
                        };
                        break;
                    default:
                        return m.guard(function () {
                            if (ha === "warn") {
                                r.warn("The method FB.%s is not officially supported by " + "Facebook and access to it will soon be removed.",
                                    ea);
                                if (!y.hasOwnProperty(ea)) {
                                    q.log(q.TYPE.WARNING, q.CATEGORY.DEPRECATED, "FB." + ea);
                                    t.log("jssdk_error", {appId: s.getClientID(), error: "Private method used", extra: {args: ea}});
                                    y[ea] = true
                                }
                            }
                            function ia(qa) {
                                if (ES5("Array", "isArray", false, qa))return ES5(qa, "map", true, ia);
                                if (qa && typeof qa === "object" && qa.__wrapped)return qa.__wrapped;
                                return typeof qa === "function" && /^function/.test(qa.toString()) ? m.unguard(qa) : qa
                            }

                            var ja = ES5(Array.prototype.slice.call(arguments), "map", true, ia), ka = da.apply(ga, ja), la, ma = true;
                            if (ka &&
                                typeof ka === "object") {
                                var na = Function();
                                na.prototype = ka;
                                la = new na;
                                la.__wrapped = ka;
                                for (var oa in ka) {
                                    var pa = ka[oa];
                                    if (typeof pa !== "function" || oa === "constructor")continue;
                                    ma = false;
                                    la[oa] = ba(pa, ea + ":" + oa, oa, ka)
                                }
                            }
                            if (!ma)return la;
                            return ma ? ka : la
                        }, ea)
                }
            }

            function ca(da, ea) {
                var fa = da ? j(v, da, true) : v;
                ES5(ES5("Object", "keys", false, ea), "forEach", true, function (ga) {
                    var ha = ea[ga];
                    if (typeof ha === "function") {
                        var ia = (da ? da + "." : "") + ga, ja = ba(ha, ia, ga, ea);
                        if (ja)fa[ga] = ja
                    }
                })
            }

            s.setSecure(function () {
                var da = /iframe_canvas|app_runner/.test(window.name),
                    ea = /dialog/.test(window.name);
                if (location.protocol == "https:" && (window == top || !(da || ea)))return true;
                if (/_fb_https?/.test(window.name))return ES5(window.name, "indexOf", true, "_fb_https") != -1
            }());
            h(z, {provide: ca});
            e.exports = z
        }, null);
        __d("ArgumentError", ["ManagedError"], function (a, b, c, d, e, f, g) {
            function h(i, j) {
                g.prototype.constructor.apply(this, arguments)
            }

            h.prototype = new g;
            h.prototype.constructor = h;
            e.exports = h
        }, null);
        __d("CORSRequest", ["wrapFunction", "QueryString"], function (a, b, c, d, e, f, g, h) {
            function i(l, m) {
                if (!self.XMLHttpRequest)return null;
                var n = new XMLHttpRequest, o = function () {
                };
                if ("withCredentials"in n) {
                    n.open(l, m, true);
                    n.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
                } else if (self.XDomainRequest) {
                    n = new XDomainRequest;
                    try {
                        n.open(l, m);
                        n.onprogress = n.ontimeout = o
                    } catch (p) {
                        return null
                    }
                } else return null;
                var q = {send: function (t) {
                    n.send(t)
                }}, r = g(function () {
                    r = o;
                    if ("onload"in q)q.onload(n)
                }, "entry", "XMLHttpRequest:load"), s = g(function () {
                    s = o;
                    if ("onerror"in q)q.onerror(n)
                }, "entry", "XMLHttpRequest:error");
                n.onload = function () {
                    r()
                };
                n.onerror = function () {
                    s()
                };
                n.onreadystatechange = function () {
                    if (n.readyState == 4)if (n.status == 200)r(); else s()
                };
                return q
            }

            function j(l, m, n, o) {
                n.suppress_http_code = 1;
                var p = h.encode(n);
                if (m != "post") {
                    l = h.appendToUrl(l, p);
                    p = ""
                }
                var q = i(m, l);
                if (!q)return false;
                q.onload = function (r) {
                    o(ES5("JSON", "parse", false, r.responseText))
                };
                q.onerror = function (r) {
                    if (r.responseText)o(ES5("JSON", "parse", false, r.responseText)); else o({error: {type: "http", message: "unknown error", status: r.status}})
                };
                q.send(p);
                return true
            }

            var k = {execute: j};
            e.exports = k
        }, null);
        __d("FlashRequest", ["DOMWrapper", "Flash", "GlobalCallback", "QueryString", "Queue"], function (a, b, c, d, e, f, g, h, i, j, k) {
            var l, m = {}, n, o;

            function p() {
                if (!n)throw new Error("swfUrl has not been set");
                var s = i.create(function () {
                    l.start(function (u) {
                        var v = o.execute(u.method, u.url, u.body);
                        if (!v)throw new Error("Could create request");
                        m[v] = u.callback
                    })
                }), t = i.create(function (u, v, w) {
                    var x;
                    try {
                        x = ES5("JSON", "parse", false, decodeURIComponent(w))
                    } catch (y) {
                        x = {error: {type: "SyntaxError",
                            message: y.message, status: v, raw: w}}
                    }
                    m[u](x);
                    delete m[u]
                });
                o = h.embed(n, g.getRoot(), null, {log: false, initCallback: s, requestCallback: t})
            }

            function q(s, t, u, v) {
                u.suppress_http_code = 1;
                if (!u.method)u.method = t;
                var w = j.encode(u);
                if (t === "get" && s.length + w.length < 2E3) {
                    s = j.appendToUrl(s, w);
                    w = ""
                } else t = "post";
                if (!l) {
                    if (!h.isAvailable())return false;
                    l = new k;
                    p()
                }
                l.enqueue({method: t, url: s, body: w, callback: v});
                return true
            }

            var r = {setSwfUrl: function (s) {
                n = s
            }, execute: q};
            e.exports = r
        }, null);
        __d("flattenObject", [], function (a, b, c, d, e, f) {
            function g(h) {
                var i = {};
                for (var j in h)if (h.hasOwnProperty(j)) {
                    var k = h[j];
                    if (null === k || undefined === k)continue; else if (typeof k == "string")i[j] = k; else i[j] = ES5("JSON", "stringify", false, k)
                }
                return i
            }

            e.exports = g
        }, null);
        __d("JSONPRequest", ["DOMWrapper", "GlobalCallback", "QueryString"], function (a, b, c, d, e, f, g, h, i) {
            function j(l, m, n, o) {
                var p = document.createElement("script"), q = function (s) {
                    q = function () {
                    };
                    h.remove(n.callback);
                    o(s);
                    p.parentNode.removeChild(p)
                };
                n.callback = h.create(q);
                if (!n.method)n.method =
                    m;
                l = i.appendToUrl(l, n);
                if (l.length > 2E3) {
                    h.remove(n.callback);
                    return false
                }
                p.onerror = function () {
                    q({error: {type: "http", message: "unknown error"}})
                };
                var r = function () {
                    setTimeout(function () {
                        q({error: {type: "http", message: "unknown error"}})
                    }, 0)
                };
                if (p.addEventListener)p.addEventListener("load", r, false); else p.onreadystatechange = function () {
                    if (/loaded|complete/.test(this.readyState))r()
                };
                p.src = l;
                g.getRoot().appendChild(p);
                return true
            }

            var k = {execute: j};
            e.exports = k
        }, null);
        __d("ApiClient", ["ArgumentError", "Assert",
            "copyProperties", "CORSRequest", "FlashRequest", "flattenObject", "JSONPRequest", "Log", "ObservableMixin", "sprintf", "sdk.URI", "UrlMap", "ApiClientConfig"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
            var t, u, v, w = {get: true, post: true, "delete": true, put: true}, x = {fql_query: true, fql_multiquery: true, friends_get: true, notifications_get: true, stream_get: true, users_getinfo: true};

            function y(da, ea, fa, ga) {
                if (v)fa = i({}, v, fa);
                fa.access_token = fa.access_token || t;
                fa.pretty = fa.pretty || 0;
                fa = l(fa);
                var ha = {jsonp: m, cors: j, flash: k},
                    ia;
                if (fa.transport) {
                    ia = [fa.transport];
                    delete fa.transport
                } else ia = ["jsonp", "cors", "flash"];
                for (var ja = 0; ja < ia.length; ja++) {
                    var ka = ha[ia[ja]], la = i({}, fa);
                    if (ka.execute(da, ea, la, ga))return
                }
                ga({error: {type: "no-transport", message: "Could not find a usable transport for request"}})
            }

            function z(da, ea, fa, ga, ha) {
                ca.inform("request.complete", ea, fa, ga, ha);
                if (da)da(ha)
            }

            function aa(da) {
                h.isString(da, "Invalid path");
                if (!/^https?/.test(da) && da.charAt(0) !== "/")da = "/" + da;
                var ea, fa = {};
                try {
                    ea = new q(da)
                } catch (ga) {
                    throw new g(ga.message,
                        ga);
                }
                ES5(Array.prototype.slice.call(arguments, 1), "forEach", true, function (ma) {
                    fa[typeof ma] = ma
                });
                var ha = (fa.string || "get").toLowerCase();
                h.isTrue(w.hasOwnProperty(ha), p("Invalid method passed to ApiClient: %s", ha));
                var ia = fa["function"];
                if (!ia)n.warn("No callback passed to the ApiClient");
                if (fa.object)ea.addQueryData(fa.object);
                var ja = ea.getQueryData(), ka = ES5(z, "bind", true, null, ia, ea.getPath(), ha, ja), la = ea.getProtocol() && ea.getDomain() ? ea.setQueryData({}).toString() : r.resolve("graph") + ea.getPath();
                ja.method = ha;
                y(la, ha == "get" ? "get" : "post", ja, ka)
            }

            function ba(da, ea) {
                h.isObject(da);
                h.isString(da.method, "method missing");
                if (!ea)n.warn("No callback passed to the ApiClient");
                var fa = da.method.toLowerCase().replace(".", "_");
                da.format = "json-strings";
                da.api_key = u;
                var ga = fa in x ? "api_read" : "api", ha = r.resolve(ga) + "/restserver.php", ia = ES5(z, "bind", true, null, ea, "/restserver.php", "get", da);
                y(ha, "get", da, ia)
            }

            var ca = i(new o, {setAccessToken: function (da) {
                t = da
            }, setClientID: function (da) {
                u = da
            }, setDefaultParams: function (da) {
                v =
                    da
            }, rest: ba, graph: aa});
            k.setSwfUrl(s.FlashRequest.swfUrl);
            e.exports = ca
        }, null);
        __d("sdk.PlatformVersioning", ["sdk.Runtime", "ManagedError"], function (a, b, c, d, e, f, g, h) {
            var i = /^v\d+\.\d\d?$/, j = {REGEX: i, assertVersionIsSet: function () {
                if (!g.getVersion())throw new h("init not called with valid version");
            }, assertValidVersion: function (k) {
                if (!i.test(k))throw new h("invalid version specified");
            }};
            e.exports = j
        }, null);
        __d("sdk.api", ["ApiClient", "sdk.PlatformVersioning", "sdk.Runtime", "sdk.URI"], function (a, b, c, d, e, f, g, h, i, j) {
            var k;
            i.subscribe("ClientID.change", function (m) {
                g.setClientID(m)
            });
            i.subscribe("AccessToken.change", function (m) {
                k = m;
                g.setAccessToken(m)
            });
            g.setDefaultParams({sdk: "joey"});
            g.subscribe("request.complete", function (m, n, o, p) {
                var q = false;
                if (p && typeof p == "object")if (p.error) {
                    if (p.error == "invalid_token" || p.error.type == "OAuthException" && p.error.code == 190)q = true
                } else if (p.error_code)if (p.error_code == "190")q = true;
                if (q && k === i.getAccessToken())i.setAccessToken(null)
            });
            g.subscribe("request.complete",
                function (m, n, o, p) {
                    if ((m == "/me/permissions" && n === "delete" || m == "/restserver.php" && o.method == "Auth.revokeAuthorization") && p === true)i.setAccessToken(null)
                });
            function l(m) {
                if (typeof m === "string")if (i.getIsVersioned()) {
                    h.assertVersionIsSet();
                    if (!/https?/.test(m) && m.charAt(0) !== "/")m = "/" + m;
                    m = j(m).setDomain(null).setProtocol(null).toString();
                    if (!h.REGEX.test(m.substring(1, ES5(m, "indexOf", true, "/", 1))))m = "/" + i.getVersion() + m;
                    var n = [m].concat(Array.prototype.slice.call(arguments, 1));
                    g.graph.apply(g, n)
                } else g.graph.apply(g,
                    arguments); else g.rest.apply(g, arguments)
            }

            e.exports = l
        }, null);
        __d("legacy:fb.api", ["FB", "sdk.api"], function (a, b, c, d, e, f, g, h) {
            g.provide("", {api: h})
        }, 3);
        __d("sdk.Canvas.Environment", ["sdk.RPC"], function (a, b, c, d, e, f, g) {
            function h(k) {
                g.remote.getPageInfo(function (l) {
                    k(l.result)
                })
            }

            function i(k, l) {
                g.remote.scrollTo({x: k || 0, y: l || 0})
            }

            g.stub("getPageInfo");
            g.stub("scrollTo");
            var j = {getPageInfo: h, scrollTo: i};
            e.exports = j
        }, null);
        __d("sdk.Intl", ["Log"], function (a, b, c, d, e, f, g) {
            var h = "[" + ".!?" + "\u3002" + "\uff01" +
                "\uff1f" + "\u0964" + "\u2026" + "\u0eaf" + "\u1801" + "\u0e2f" + "\uff0e" + "]";

            function i(l) {
                if (typeof l != "string")return false;
                return!!l.match(new RegExp(h + "[" + ')"' + "'" + "\u00bb" + "\u0f3b" + "\u0f3d" + "\u2019" + "\u201d" + "\u203a" + "\u3009" + "\u300b" + "\u300d" + "\u300f" + "\u3011" + "\u3015" + "\u3017" + "\u3019" + "\u301b" + "\u301e" + "\u301f" + "\ufd3f" + "\uff07" + "\uff09" + "\uff3d" + "\\s" + "]*$"))
            }

            function j(l, m) {
                if (m !== undefined)if (typeof m != "object")g.error("The second arg to FB.Intl.tx() must be an Object for " + "FB.Intl.tx(" + l + ", ...)");
                else {
                    var n;
                    for (var o in m)if (m.hasOwnProperty(o)) {
                        if (i(m[o]))n = new RegExp("\\{" + o + "\\}" + h + "*", "g"); else n = new RegExp("\\{" + o + "\\}", "g");
                        l = l.replace(n, m[o])
                    }
                }
                return l
            }

            function k() {
                throw new Error("Placeholder function");
            }

            k._ = j;
            e.exports = {tx: k}
        }, null);
        __d("sdk.Dialog", ["sdk.Canvas.Environment", "sdk.Content", "sdk.DOM", "DOMEventListener", "sdk.Intl", "ObservableMixin", "sdk.Runtime", "Type", "UserAgent", "sdk.feature"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
            var q = 590, r = 500, s = 240, t = 575, u = function () {
                var y;
                if (p("dialog_resize_refactor")) {
                    var z = v();
                    y = z && (z.height >= q || z.width >= r)
                } else y = !!o.ipad();
                u = function () {
                    return y
                };
                return y
            };

            function v() {
                if (p("dialog_resize_refactor")) {
                    var y = i.getViewportInfo();
                    if (y.height && y.width)return{width: Math.min(y.width, q), height: Math.min(y.height, r)}
                }
                return null
            }

            var w = n.extend({constructor: function y(z, aa) {
                this.parent();
                this.id = z;
                this.display = aa;
                this._e2e = {};
                if (!x._dialogs) {
                    x._dialogs = {};
                    x._addOrientationHandler()
                }
                x._dialogs[z] = this;
                this.trackEvent("init")
            }, trackEvent: function (y, z) {
                if (this._e2e[y])return this;
                this._e2e[y] = z || ES5("Date", "now", false);
                if (y == "close")this.inform("e2e:end", this._e2e);
                return this
            }, trackEvents: function (y) {
                if (typeof y === "string")y = ES5("JSON", "parse", false, y);
                for (var z in y)if (y.hasOwnProperty(z))this.trackEvent(z, y[z]);
                return this
            }}, l), x = {newInstance: function (y, z) {
                return new w(y, z)
            }, _dialogs: null, _lastYOffset: 0, _loaderEl: null, _overlayEl: null, _stack: [], _active: null, get: function (y) {
                return x._dialogs[y]
            }, _findRoot: function (y) {
                while (y) {
                    if (i.containsCss(y,
                        "fb_dialog"))return y;
                    y = y.parentNode
                }
            }, _createWWWLoader: function (y) {
                y = y ? y : 460;
                return x.create({content: '\x3cdiv class\x3d"dialog_title"\x3e' + '  \x3ca id\x3d"fb_dialog_loader_close"\x3e' + '    \x3cdiv class\x3d"fb_dialog_close_icon"\x3e\x3c/div\x3e' + "  \x3c/a\x3e" + "  \x3cspan\x3eFacebook\x3c/span\x3e" + '  \x3cdiv style\x3d"clear:both;"\x3e\x3c/div\x3e' + "\x3c/div\x3e" + '\x3cdiv class\x3d"dialog_content"\x3e\x3c/div\x3e' + '\x3cdiv class\x3d"dialog_footer"\x3e\x3c/div\x3e', width: y})
            }, _createMobileLoader: function () {
                var y =
                    o.nativeApp() ? "" : "\x3ctable\x3e" + "  \x3ctbody\x3e" + "    \x3ctr\x3e" + '      \x3ctd class\x3d"header_left"\x3e' + '        \x3clabel class\x3d"touchable_button"\x3e' + '          \x3cinput type\x3d"submit" value\x3d"' + k.tx._("\u53d6\u6d88") + '"' + '            id\x3d"fb_dialog_loader_close"/\x3e' + "        \x3c/label\x3e" + "      \x3c/td\x3e" + '      \x3ctd class\x3d"header_center"\x3e' + "        \x3cdiv\x3e" + k.tx._("\u52a0\u8f7d\u4e2d...") + "\x3c/div\x3e" + "      \x3c/td\x3e" + '      \x3ctd class\x3d"header_right"\x3e' +
                        "      \x3c/td\x3e" + "    \x3c/tr\x3e" + "  \x3c/tbody\x3e" + "\x3c/table\x3e";
                return x.create({classes: "loading" + (u() ? " centered" : ""), content: '\x3cdiv class\x3d"dialog_header"\x3e' + y + "\x3c/div\x3e"})
            }, _restoreBodyPosition: function () {
                if (!u()) {
                    var y = document.getElementsByTagName("body")[0];
                    i.removeCss(y, "fb_hidden")
                }
            }, _showTabletOverlay: function () {
                if (!u())return;
                if (!x._overlayEl) {
                    x._overlayEl = document.createElement("div");
                    x._overlayEl.setAttribute("id", "fb_dialog_ipad_overlay");
                    h.append(x._overlayEl, null)
                }
                x._overlayEl.className =
                    ""
            }, _hideTabletOverlay: function () {
                if (u())x._overlayEl.className = "hidden"
            }, showLoader: function (y, z) {
                x._showTabletOverlay();
                if (!x._loaderEl)x._loaderEl = x._findRoot(o.mobile() ? x._createMobileLoader() : x._createWWWLoader(z));
                if (!y)y = function () {
                };
                var aa = document.getElementById("fb_dialog_loader_close");
                i.removeCss(aa, "fb_hidden");
                aa.onclick = function () {
                    x._hideLoader();
                    x._restoreBodyPosition();
                    x._hideTabletOverlay();
                    y()
                };
                var ba = document.getElementById("fb_dialog_ipad_overlay");
                if (ba)ba.ontouchstart = aa.onclick;
                x._makeActive(x._loaderEl)
            }, _hideLoader: function () {
                if (x._loaderEl && x._loaderEl == x._active)x._loaderEl.style.top = "-10000px"
            }, _makeActive: function (y) {
                x._setDialogSizes();
                x._lowerActive();
                x._active = y;
                if (m.isEnvironment(m.ENVIRONMENTS.CANVAS))g.getPageInfo(function (z) {
                    x._centerActive(z)
                });
                x._centerActive()
            }, _lowerActive: function () {
                if (!x._active)return;
                x._active.style.top = "-10000px";
                x._active = null
            }, _removeStacked: function (y) {
                x._stack = ES5(x._stack, "filter", true, function (z) {
                    return z != y
                })
            }, _centerActive: function (y) {
                var z =
                    x._active;
                if (!z)return;
                var aa = i.getViewportInfo(), ba = parseInt(z.offsetWidth, 10), ca = parseInt(z.offsetHeight, 10), da = aa.scrollLeft + (aa.width - ba) / 2, ea = (aa.height - ca) / 2.5;
                if (da < ea)ea = da;
                var fa = aa.height - ca - ea, ga = (aa.height - ca) / 2;
                if (y)ga = y.scrollTop - y.offsetTop + (y.clientHeight - ca) / 2;
                if (ga < ea)ga = ea; else if (ga > fa)ga = fa;
                ga += aa.scrollTop;
                if (o.mobile()) {
                    var ha = 100;
                    if (u())ha += (aa.height - ca) / 2; else {
                        var ia = document.getElementsByTagName("body")[0];
                        i.addCss(ia, "fb_hidden");
                        if (p("dialog_resize_refactor"))ia.style.width =
                            "auto";
                        ga = 1E4
                    }
                    var ja = i.getByClass("fb_dialog_padding", z);
                    if (ja.length)ja[0].style.height = ha + "px"
                }
                z.style.left = (da > 0 ? da : 0) + "px";
                z.style.top = (ga > 0 ? ga : 0) + "px"
            }, _setDialogSizes: function () {
                if (!o.mobile() || u())return;
                for (var y in x._dialogs)if (x._dialogs.hasOwnProperty(y)) {
                    var z = document.getElementById(y);
                    if (z) {
                        z.style.width = x.getDefaultSize().width + "px";
                        z.style.height = x.getDefaultSize().height + "px"
                    }
                }
            }, getDefaultSize: function () {
                if (o.mobile()) {
                    var y = v();
                    if (y)return y;
                    if (o.ipad())return{width: r, height: q};
                    if (o.android())return{width: screen.availWidth, height: screen.availHeight}; else {
                        var z = window.innerWidth, aa = window.innerHeight, ba = z / aa > 1.2;
                        return{width: z, height: Math.max(aa, ba ? screen.width : screen.height)}
                    }
                }
                return{width: t, height: s}
            }, _handleOrientationChange: function (y) {
                var z = p("dialog_resize_refactor", false) ? i.getViewportInfo().width : screen.availWidth;
                if (o.android() && z == x._availScreenWidth) {
                    setTimeout(x._handleOrientationChange, 50);
                    return
                }
                x._availScreenWidth = z;
                if (u())x._centerActive(); else {
                    var aa = x.getDefaultSize().width;
                    for (var ba in x._dialogs)if (x._dialogs.hasOwnProperty(ba)) {
                        var ca = document.getElementById(ba);
                        if (ca)ca.style.width = aa + "px"
                    }
                }
            }, _addOrientationHandler: function () {
                if (!o.mobile())return;
                var y = "onorientationchange"in window ? "orientationchange" : "resize";
                x._availScreenWidth = p("dialog_resize_refactor", false) ? i.getViewportInfo().width : screen.availWidth;
                j.add(window, y, x._handleOrientationChange)
            }, create: function (y) {
                y = y || {};
                var z = document.createElement("div"), aa = document.createElement("div"), ba = "fb_dialog";
                if (y.closeIcon && y.onClose) {
                    var ca = document.createElement("a");
                    ca.className = "fb_dialog_close_icon";
                    ca.onclick = y.onClose;
                    z.appendChild(ca)
                }
                ba += " " + (y.classes || "");
                if (o.ie()) {
                    ba += " fb_dialog_legacy";
                    ES5(["vert_left", "vert_right", "horiz_top", "horiz_bottom", "top_left", "top_right", "bottom_left", "bottom_right"], "forEach", true, function (fa) {
                        var ga = document.createElement("span");
                        ga.className = "fb_dialog_" + fa;
                        z.appendChild(ga)
                    })
                } else ba += o.mobile() ? " fb_dialog_mobile" : " fb_dialog_advanced";
                if (y.content)h.append(y.content,
                    aa);
                z.className = ba;
                var da = parseInt(y.width, 10);
                if (!isNaN(da))z.style.width = da + "px";
                aa.className = "fb_dialog_content";
                z.appendChild(aa);
                if (o.mobile()) {
                    var ea = document.createElement("div");
                    ea.className = "fb_dialog_padding";
                    z.appendChild(ea)
                }
                h.append(z);
                if (y.visible)x.show(z);
                return aa
            }, show: function (y) {
                var z = x._findRoot(y);
                if (z) {
                    x._removeStacked(z);
                    x._hideLoader();
                    x._makeActive(z);
                    x._stack.push(z);
                    if ("fbCallID"in y)x.get(y.fbCallID).inform("iframe_show").trackEvent("show")
                }
            }, hide: function (y) {
                var z = x._findRoot(y);
                x._hideLoader();
                if (z == x._active) {
                    x._lowerActive();
                    x._restoreBodyPosition();
                    x._hideTabletOverlay();
                    if ("fbCallID"in y)x.get(y.fbCallID).inform("iframe_hide").trackEvent("hide")
                }
            }, remove: function (y) {
                y = x._findRoot(y);
                if (y) {
                    var z = x._active == y;
                    x._removeStacked(y);
                    if (z) {
                        x._hideLoader();
                        if (x._stack.length > 0)x.show(x._stack.pop()); else {
                            x._lowerActive();
                            x._restoreBodyPosition();
                            x._hideTabletOverlay()
                        }
                    } else if (x._active === null && x._stack.length > 0)x.show(x._stack.pop());
                    setTimeout(function () {
                            y.parentNode.removeChild(y)
                        },
                        3E3)
                }
            }, isActive: function (y) {
                var z = x._findRoot(y);
                return z && z === x._active
            }};
            e.exports = x
        }, null);
        __d("sdk.Frictionless", ["sdk.Auth", "sdk.api", "sdk.Event", "sdk.Dialog"], function (a, b, c, d, e, f, g, h, i, j) {
            var k = {_allowedRecipients: {}, _useFrictionless: false, _updateRecipients: function () {
                k._allowedRecipients = {};
                h("/me/apprequestformerrecipients", function (l) {
                    if (!l || l.error)return;
                    ES5(l.data, "forEach", true, function (m) {
                        k._allowedRecipients[m.recipient_id] = true
                    })
                })
            }, init: function () {
                k._useFrictionless = true;
                g.getLoginStatus(function (l) {
                    if (l.status ==
                        "connected")k._updateRecipients()
                });
                i.subscribe("auth.login", function (l) {
                    if (l.authResponse)k._updateRecipients()
                })
            }, _processRequestResponse: function (l, m) {
                return function (n) {
                    var o = n && n.updated_frictionless;
                    if (k._useFrictionless && o)k._updateRecipients();
                    if (n) {
                        if (!m && n.frictionless) {
                            j._hideLoader();
                            j._restoreBodyPosition();
                            j._hideIPadOverlay()
                        }
                        delete n.frictionless;
                        delete n.updated_frictionless
                    }
                    l && l(n)
                }
            }, isAllowed: function (l) {
                if (!l)return false;
                if (typeof l === "number")return l in k._allowedRecipients;
                if (typeof l === "string")l = l.split(",");
                l = ES5(l, "map", true, function (o) {
                    return ES5(String(o), "trim", true)
                });
                var m = true, n = false;
                ES5(l, "forEach", true, function (o) {
                    m = m && o in k._allowedRecipients;
                    n = true
                });
                return m && n
            }};
            i.subscribe("init:post", function (l) {
                if (l.frictionlessRequests)k.init()
            });
            e.exports = k
        }, null);
        __d("insertIframe", ["guid", "GlobalCallback"], function (a, b, c, d, e, f, g, h) {
            function i(j) {
                j.id = j.id || g();
                j.name = j.name || g();
                var k = false, l = false, m = function () {
                        if (k && !l) {
                            l = true;
                            j.onload && j.onload(j.root.firstChild)
                        }
                    },
                    n = h.create(m);
                if (document.attachEvent) {
                    var o = "\x3ciframe" + ' id\x3d"' + j.id + '"' + ' name\x3d"' + j.name + '"' + (j.title ? ' title\x3d"' + j.title + '"' : "") + (j.className ? ' class\x3d"' + j.className + '"' : "") + ' style\x3d"border:none;' + (j.width ? "width:" + j.width + "px;" : "") + (j.height ? "height:" + j.height + "px;" : "") + '"' + ' src\x3d"javascript:false;"' + ' frameborder\x3d"0"' + ' scrolling\x3d"no"' + ' allowtransparency\x3d"true"' + ' onload\x3d"' + n + '()"' + "\x3e\x3c/iframe\x3e";
                    j.root.innerHTML = '\x3ciframe src\x3d"javascript:false"' + ' frameborder\x3d"0"' +
                        ' scrolling\x3d"no"' + ' style\x3d"height:1px"\x3e\x3c/iframe\x3e';
                    k = true;
                    setTimeout(function () {
                        j.root.innerHTML = o;
                        j.root.firstChild.src = j.url;
                        j.onInsert && j.onInsert(j.root.firstChild)
                    }, 0)
                } else {
                    var p = document.createElement("iframe");
                    p.id = j.id;
                    p.name = j.name;
                    p.onload = m;
                    p.scrolling = "no";
                    p.style.border = "none";
                    p.style.overflow = "hidden";
                    if (j.title)p.title = j.title;
                    if (j.className)p.className = j.className;
                    if (j.height !== undefined)p.style.height = j.height + "px";
                    if (j.width !== undefined)if (j.width == "100%")p.style.width =
                        j.width; else p.style.width = j.width + "px";
                    j.root.appendChild(p);
                    k = true;
                    p.src = j.url;
                    j.onInsert && j.onInsert(p)
                }
            }

            e.exports = i
        }, null);
        __d("sdk.Native", ["copyProperties", "Log", "UserAgent"], function (a, b, c, d, e, f, g, h, i) {
            var j = "fbNativeReady", k = {onready: function (l) {
                if (!i.nativeApp()) {
                    h.error("FB.Native.onready only works when the page is rendered " + "in a WebView of the native Facebook app. Test if this is the " + "case calling FB.UA.nativeApp()");
                    return
                }
                if (window.__fbNative && !this.nativeReady)g(this, window.__fbNative);
                if (this.nativeReady)l(); else {
                    var m = function (n) {
                        window.removeEventListener(j, m);
                        this.onready(l)
                    };
                    window.addEventListener(j, m, false)
                }
            }};
            e.exports = k
        }, null);
        __d("resolveURI", [], function (a, b, c, d, e, f) {
            function g(h) {
                if (!h)return window.location.href;
                h = h.replace(/&/g, "\x26amp;").replace(/"/g, "\x26quot;");
                var i = document.createElement("div");
                i.innerHTML = '\x3ca href\x3d"' + h + '"\x3e\x3c/a\x3e';
                return i.firstChild.href
            }

            e.exports = g
        }, null);
        __d("sdk.UIServer", ["sdk.Auth", "sdk.Content", "createObjectFrom", "copyProperties",
            "sdk.Dialog", "sdk.DOM", "sdk.Event", "flattenObject", "sdk.Frictionless", "sdk.getContextType", "guid", "insertIframe", "Log", "sdk.Native", "QueryString", "resolveURI", "sdk.RPC", "sdk.Runtime", "JSSDKConfig", "UrlMap", "UserAgent", "sdk.XD"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, aa, ba) {
            var ca = {transform: function (fa) {
                if (fa.params.display === "touch" && fa.params.access_token && window.postMessage) {
                    fa.params.channel = ea._xdChannelHandler(fa.id, "parent");
                    if (!aa.nativeApp())fa.params.in_iframe = 1;
                    return fa
                } else return ea.genericTransform(fa)
            },
                getXdRelation: function (fa) {
                    var ga = fa.display;
                    if (ga === "touch" && window.postMessage && fa.in_iframe)return"parent";
                    return ea.getXdRelation(fa)
                }}, da = {"stream.share": {size: {width: 670, height: 340}, url: "sharer.php", transform: function (fa) {
                if (!fa.params.u)fa.params.u = window.location.toString();
                fa.params.display = "popup";
                return fa
            }}, apprequests: {transform: function (fa) {
                fa = ca.transform(fa);
                fa.params.frictionless = o && o._useFrictionless;
                if (fa.params.frictionless) {
                    if (o.isAllowed(fa.params.to)) {
                        fa.params.display = "iframe";
                        fa.params.in_iframe = true;
                        fa.hideLoader = true
                    }
                    fa.cb = o._processRequestResponse(fa.cb, fa.hideLoader)
                }
                fa.closeIcon = false;
                return fa
            }, getXdRelation: ca.getXdRelation}, feed: ca, "permissions.oauth": {url: "dialog/oauth", size: {width: aa.mobile() ? null : 475, height: aa.mobile() ? null : 183}, transform: function (fa) {
                if (!x.getClientID()) {
                    s.error("FB.login() called before FB.init().");
                    return
                }
                if (g.getAuthResponse() && !fa.params.scope && !fa.params.auth_type) {
                    s.error("FB.login() called when user is already connected.");
                    fa.cb && fa.cb({status: x.getLoginStatus(),
                        authResponse: g.getAuthResponse()});
                    return
                }
                var ga = fa.cb, ha = fa.id;
                delete fa.cb;
                var ia = ES5("Object", "keys", false, j(fa.params.response_type ? i(fa.params.response_type.split(",")) : {}, {token: true, signed_request: true})).join(",");
                if (fa.params.display === "async") {
                    j(fa.params, {client_id: x.getClientID(), origin: p(), response_type: ia, domain: location.hostname});
                    fa.cb = g.xdResponseWrapper(ga, g.getAuthResponse(), "permissions.oauth")
                } else j(fa.params, {client_id: x.getClientID(), redirect_uri: v(ea.xdHandler(ga, ha, "opener",
                    g.getAuthResponse(), "permissions.oauth")), origin: p(), response_type: ia, domain: location.hostname});
                return fa
            }}, "auth.logout": {url: "logout.php", transform: function (fa) {
                if (!x.getClientID())s.error("FB.logout() called before calling FB.init()."); else if (!g.getAuthResponse())s.error("FB.logout() called without an access token."); else {
                    fa.params.next = ea.xdHandler(fa.cb, fa.id, "parent", g.getAuthResponse(), "logout");
                    return fa
                }
            }}, "login.status": {url: "dialog/oauth", transform: function (fa) {
                var ga = fa.cb, ha = fa.id;
                delete fa.cb;
                j(fa.params, {client_id: x.getClientID(), redirect_uri: ea.xdHandler(ga, ha, "parent", g.getAuthResponse(), "login_status"), origin: p(), response_type: "token,signed_request,code", domain: location.hostname});
                return fa
            }}}, ea = {Methods: da, _loadedNodes: {}, _defaultCb: {}, _resultToken: '"xxRESULTTOKENxx"', genericTransform: function (fa) {
                if (fa.params.display == "dialog" || fa.params.display == "iframe")j(fa.params, {display: "iframe", channel: ea._xdChannelHandler(fa.id, "parent.parent")}, true);
                return fa
            }, checkOauthDisplay: function (fa) {
                var ga =
                    fa.scope || fa.perms || x.getScope();
                if (!ga)return fa.display;
                var ha = ga.split(/\s|,/g);
                for (var ia = 0; ia < ha.length; ia++)if (!y.initSitevars.iframePermissions[ES5(ha[ia], "trim", true)])return"popup";
                return fa.display
            }, prepareCall: function (fa, ga) {
                var ha = fa.method.toLowerCase(), ia = j({}, ea.Methods[ha]), ja = q(), ka = x.getSecure() || ha !== "auth.status" && ha != "login.status";
                j(fa, {app_id: x.getClientID(), locale: x.getLocale(), sdk: "joey", access_token: ka && x.getAccessToken() || undefined});
                fa.display = ea.getDisplayMode(ia, fa);
                if (!ia.url)ia.url = "dialog/" + ha;
                if ((ia.url == "dialog/oauth" || ia.url == "dialog/permissions.request") && (fa.display == "iframe" || fa.display == "touch" && fa.in_iframe))fa.display = ea.checkOauthDisplay(fa);
                if (x.getIsVersioned() && ia.url.substring(0, 7) === "dialog/")ia.url = fa.version + "/" + ia.url;
                var la = {cb: ga, id: ja, size: ia.size || ea.getDefaultSize(), url: z.resolve(fa.display == "touch" ? "m" : "www", ka) + "/" + ia.url, params: fa, name: ha, dialog: k.newInstance(ja, fa.display)}, ma = ia.transform ? ia.transform : ea.genericTransform;
                if (ma) {
                    la =
                        ma(la);
                    if (!la)return
                }
                var na = ia.getXdRelation || ea.getXdRelation, oa = na(la.params);
                if (!(la.id in ea._defaultCb) && !("next"in la.params) && !("redirect_uri"in la.params))la.params.next = ea._xdResult(la.cb, la.id, oa, true);
                if (oa === "parent")j(la.params, {channel_url: ea._xdChannelHandler(ja, "parent.parent")}, true);
                la = ea.prepareParams(la);
                return la
            }, prepareParams: function (fa) {
                var ga = fa.params.method;
                if (fa.params.display !== "async")delete fa.params.method;
                fa.params = n(fa.params);
                var ha = u.encode(fa.params);
                if (!aa.nativeApp() &&
                    ea.urlTooLongForIE(fa.url + "?" + ha))fa.post = true; else if (ha)fa.url += "?" + ha;
                return fa
            }, urlTooLongForIE: function (fa) {
                return fa.length > 2E3
            }, getDisplayMode: function (fa, ga) {
                if (ga.display === "hidden" || ga.display === "none")return ga.display;
                var ha = x.isEnvironment(x.ENVIRONMENTS.CANVAS) || x.isEnvironment(x.ENVIRONMENTS.PAGETAB);
                if (ha && !ga.display)return"async";
                if (aa.mobile() || ga.display === "touch")return"touch";
                if (!x.getAccessToken() && (ga.display == "iframe" || ga.display == "dialog") && !fa.loggedOutIframe) {
                    s.error('"dialog" mode can only be used when the user is connected.');
                    return"popup"
                }
                if (fa.connectDisplay && !ha)return fa.connectDisplay;
                return ga.display || (x.getAccessToken() ? "dialog" : "popup")
            }, getXdRelation: function (fa) {
                var ga = fa.display;
                if (ga === "popup" || ga === "touch")return"opener";
                if (ga === "dialog" || ga === "iframe" || ga === "hidden" || ga === "none")return"parent";
                if (ga === "async")return"parent.frames[" + window.name + "]"
            }, popup: function (fa) {
                var ga = typeof window.screenX != "undefined" ? window.screenX : window.screenLeft, ha = typeof window.screenY != "undefined" ? window.screenY : window.screenTop,
                    ia = typeof window.outerWidth != "undefined" ? window.outerWidth : document.documentElement.clientWidth, ja = typeof window.outerHeight != "undefined" ? window.outerHeight : document.documentElement.clientHeight - 22, ka = aa.mobile() ? null : fa.size.width, la = aa.mobile() ? null : fa.size.height, ma = ga < 0 ? window.screen.width + ga : ga, na = parseInt(ma + (ia - ka) / 2, 10), oa = parseInt(ha + (ja - la) / 2.5, 10), pa = [];
                if (ka !== null)pa.push("width\x3d" + ka);
                if (la !== null)pa.push("height\x3d" + la);
                pa.push("left\x3d" + na);
                pa.push("top\x3d" + oa);
                pa.push("scrollbars\x3d1");
                if (fa.name == "permissions.request" || fa.name == "permissions.oauth")pa.push("location\x3d1,toolbar\x3d0");
                pa = pa.join(",");
                var qa;
                if (fa.post) {
                    qa = window.open("about:blank", fa.id, pa);
                    if (qa) {
                        ea.setLoadedNode(fa, qa, "popup");
                        h.submitToTarget({url: fa.url, target: fa.id, params: fa.params})
                    }
                } else {
                    qa = window.open(fa.url, fa.id, pa);
                    if (qa)ea.setLoadedNode(fa, qa, "popup")
                }
                if (!qa)return;
                if (fa.id in ea._defaultCb)ea._popupMonitor()
            }, setLoadedNode: function (fa, ga, ha) {
                if (fa.params && fa.params.display != "popup")ga.fbCallID = fa.id;
                ga = {node: ga, type: ha, fbCallID: fa.id};
                ea._loadedNodes[fa.id] = ga
            }, getLoadedNode: function (fa) {
                var ga = typeof fa == "object" ? fa.id : fa, ha = ea._loadedNodes[ga];
                return ha ? ha.node : null
            }, hidden: function (fa) {
                fa.className = "FB_UI_Hidden";
                fa.root = h.appendHidden("");
                ea._insertIframe(fa)
            }, iframe: function (fa) {
                fa.className = "FB_UI_Dialog";
                var ga = function () {
                    ea._triggerDefault(fa.id)
                };
                fa.root = k.create({onClose: ga, closeIcon: fa.closeIcon === undefined ? true : fa.closeIcon, classes: aa.ipad() ? "centered" : ""});
                if (!fa.hideLoader)k.showLoader(ga,
                    fa.size.width);
                l.addCss(fa.root, "fb_dialog_iframe");
                ea._insertIframe(fa)
            }, touch: function (fa) {
                if (fa.params && fa.params.in_iframe)if (fa.ui_created)k.showLoader(function () {
                    ea._triggerDefault(fa.id)
                }, 0); else ea.iframe(fa); else if (aa.nativeApp() && !fa.ui_created) {
                    fa.frame = fa.id;
                    t.onready(function () {
                        ea.setLoadedNode(fa, t.open(fa.url + "#cb\x3d" + fa.frameName), "native")
                    });
                    ea._popupMonitor()
                } else if (!fa.ui_created)ea.popup(fa)
            }, async: function (fa) {
                fa.params.redirect_uri = location.protocol + "//" + location.host + location.pathname;
                delete fa.params.access_token;
                w.remote.showDialog(fa.params, function (ga) {
                    var ha = ga.result;
                    if (ha && ha.e2e) {
                        var ia = k.get(fa.id);
                        ia.trackEvents(ha.e2e);
                        ia.trackEvent("close");
                        delete ha.e2e
                    }
                    fa.cb(ha)
                })
            }, getDefaultSize: function () {
                return k.getDefaultSize()
            }, _insertIframe: function (fa) {
                ea._loadedNodes[fa.id] = false;
                var ga = function (ha) {
                    if (fa.id in ea._loadedNodes)ea.setLoadedNode(fa, ha, "iframe")
                };
                if (fa.post)r({url: "about:blank", root: fa.root, className: fa.className, width: fa.size.width, height: fa.size.height, id: fa.id,
                    onInsert: ga, onload: function (ha) {
                        h.submitToTarget({url: fa.url, target: ha.name, params: fa.params})
                    }}); else r({url: fa.url, root: fa.root, className: fa.className, width: fa.size.width, height: fa.size.height, id: fa.id, name: fa.frameName, onInsert: ga})
            }, _handleResizeMessage: function (fa, ga) {
                var ha = ea.getLoadedNode(fa);
                if (!ha)return;
                if (ga.height)ha.style.height = ga.height + "px";
                if (ga.width)ha.style.width = ga.width + "px";
                ba.inform("resize.ack", ga || {}, "parent.frames[" + ha.name + "]");
                if (!k.isActive(ha))k.show(ha)
            }, _triggerDefault: function (fa) {
                ea._xdRecv({frame: fa},
                        ea._defaultCb[fa] || function () {
                    })
            }, _popupMonitor: function () {
                var fa;
                for (var ga in ea._loadedNodes)if (ea._loadedNodes.hasOwnProperty(ga) && ga in ea._defaultCb) {
                    var ha = ea._loadedNodes[ga];
                    if (ha.type != "popup" && ha.type != "native")continue;
                    var ia = ha.node;
                    try {
                        if (ia.closed)ea._triggerDefault(ga); else fa = true
                    } catch (ja) {
                    }
                }
                if (fa && !ea._popupInterval)ea._popupInterval = setInterval(ea._popupMonitor, 100); else if (!fa && ea._popupInterval) {
                    clearInterval(ea._popupInterval);
                    ea._popupInterval = null
                }
            }, _xdChannelHandler: function (fa, ga) {
                return ba.handler(function (ha) {
                    var ia = ea.getLoadedNode(fa);
                    if (!ia)return;
                    if (ha.type == "resize")ea._handleResizeMessage(fa, ha); else if (ha.type == "hide")k.hide(ia); else if (ha.type == "rendered") {
                        var ja = k._findRoot(ia);
                        k.show(ja)
                    } else if (ha.type == "fireevent")m.fire(ha.event)
                }, ga, true, null)
            }, _xdNextHandler: function (fa, ga, ha, ia) {
                if (ia)ea._defaultCb[ga] = fa;
                return ba.handler(function (ja) {
                    ea._xdRecv(ja, fa)
                }, ha) + "\x26frame\x3d" + ga
            }, _xdRecv: function (fa, ga) {
                var ha = ea.getLoadedNode(fa.frame);
                if (ha)if (ha.close)try {
                    ha.close();
                    if (/iPhone.*Version\/(5|6)/.test(navigator.userAgent) && RegExp.$1 !== "5")window.focus();
                    ea._popupCount--
                } catch (ia) {
                } else if (l.containsCss(ha, "FB_UI_Hidden"))setTimeout(function () {
                    ha.parentNode.parentNode.removeChild(ha.parentNode)
                }, 3E3); else if (l.containsCss(ha, "FB_UI_Dialog"))k.remove(ha);
                delete ea._loadedNodes[fa.frame];
                delete ea._defaultCb[fa.frame];
                if (fa.e2e) {
                    var ja = k.get(fa.frame);
                    ja.trackEvents(fa.e2e);
                    ja.trackEvent("close");
                    delete fa.e2e
                }
                ga(fa)
            }, _xdResult: function (fa, ga, ha, ia) {
                return ea._xdNextHandler(function (ja) {
                    fa &&
                    fa(ja.result && ja.result != ea._resultToken && ES5("JSON", "parse", false, ja.result))
                }, ga, ha, ia) + "\x26result\x3d" + encodeURIComponent(ea._resultToken)
            }, xdHandler: function (fa, ga, ha, ia, ja) {
                return ea._xdNextHandler(g.xdResponseWrapper(fa, ia, ja), ga, ha, true)
            }};
            w.stub("showDialog");
            e.exports = ea
        }, null);
        __d("sdk.ui", ["Assert", "sdk.Impressions", "Log", "sdk.PlatformVersioning", "sdk.Runtime", "sdk.UIServer", "copyProperties", "sdk.feature"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
            function o(p, q) {
                g.isObject(p);
                g.maybeFunction(q);
                if (k.getIsVersioned()) {
                    j.assertVersionIsSet();
                    if (p.version)j.assertValidVersion(p.version); else p.version = k.getVersion()
                }
                p = m({}, p);
                if (!p.method) {
                    i.error('"method" is a required parameter for FB.ui().');
                    return null
                }
                var r = p.method;
                if (p.redirect_uri) {
                    i.warn("When using FB.ui, you should not specify a redirect_uri.");
                    delete p.redirect_uri
                }
                if ((r == "permissions.request" || r == "permissions.oauth") && (p.display == "iframe" || p.display == "dialog"))p.display = l.checkOauthDisplay(p);
                var s = n("e2e_tracking", true);
                if (s)p.e2e =
                {};
                var t = l.prepareCall(p, q || function () {
                });
                if (!t)return null;
                var u = t.params.display;
                if (u === "dialog")u = "iframe"; else if (u === "none")u = "hidden";
                var v = l[u];
                if (!v) {
                    i.error('"display" must be one of "popup", ' + '"dialog", "iframe", "touch", "async", "hidden", or "none"');
                    return null
                }
                if (s)t.dialog.subscribe("e2e:end", function (w) {
                    w.method = r;
                    w.display = u;
                    i.debug("e2e: %s", ES5("JSON", "stringify", false, w));
                    h.log(114, {payload: w})
                });
                v(t);
                return t.dialog
            }

            e.exports = o
        }, null);
        __d("legacy:fb.auth", ["sdk.Auth", "sdk.Cookie",
            "copyProperties", "sdk.Event", "FB", "Log", "sdk.Runtime", "sdk.SignedRequest", "sdk.ui"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
            k.provide("", {getLoginStatus: function () {
                return g.getLoginStatus.apply(g, arguments)
            }, getAuthResponse: function () {
                return g.getAuthResponse()
            }, getAccessToken: function () {
                return m.getAccessToken() || null
            }, getUserID: function () {
                return m.getUserID() || m.getCookieUserID()
            }, login: function (p, q) {
                if (q && q.perms && !q.scope) {
                    q.scope = q.perms;
                    delete q.perms;
                    l.warn("OAuth2 specification states that 'perms' " +
                        "should now be called 'scope'.  Please update.")
                }
                var r = m.isEnvironment(m.ENVIRONMENTS.CANVAS) || m.isEnvironment(m.ENVIRONMENTS.PAGETAB);
                o(i({method: "permissions.oauth", display: r ? "async" : "popup", domain: location.hostname}, q || {}), p)
            }, logout: function (p) {
                o({method: "auth.logout", display: "hidden"}, p)
            }});
            g.subscribe("logout", ES5(j.fire, "bind", true, j, "auth.logout"));
            g.subscribe("login", ES5(j.fire, "bind", true, j, "auth.login"));
            g.subscribe("authresponse.change", ES5(j.fire, "bind", true, j, "auth.authResponseChange"));
            g.subscribe("status.change", ES5(j.fire, "bind", true, j, "auth.statusChange"));
            j.subscribe("init:post", function (p) {
                if (p.status)g.getLoginStatus();
                if (m.getClientID())if (p.authResponse)g.setAuthResponse(p.authResponse, "connected"); else if (m.getUseCookie()) {
                    var q = h.loadSignedRequest(), r;
                    if (q) {
                        try {
                            r = n.parse(q)
                        } catch (s) {
                            h.clearSignedRequestCookie()
                        }
                        if (r && r.user_id)m.setCookieUserID(r.user_id)
                    }
                    h.loadMeta()
                }
            })
        }, 3);
        __d("sdk.Canvas.Plugin", ["sdk.api", "sdk.RPC", "Log", "UserAgent", "sdk.Runtime", "createArrayFrom"],
            function (a, b, c, d, e, f, g, h, i, j, k, l) {
                var m = "CLSID:D27CDB6E-AE6D-11CF-96B8-444553540000", n = "CLSID:444785F1-DE89-4295-863A-D46C3A781394", o = null, p = !(j.osx() >= 10.9 && (j.chrome() >= 31 || j.webkit() >= 537.71 || j.firefox() >= 25));

                function q(aa) {
                    aa._hideunity_savedstyle = {};
                    aa._hideunity_savedstyle.left = aa.style.left;
                    aa._hideunity_savedstyle.position = aa.style.position;
                    aa._hideunity_savedstyle.width = aa.style.width;
                    aa._hideunity_savedstyle.height = aa.style.height;
                    aa.style.left = "-10000px";
                    aa.style.position = "absolute";
                    aa.style.width =
                        "1px";
                    aa.style.height = "1px"
                }

                function r(aa) {
                    if (aa._hideunity_savedstyle) {
                        aa.style.left = aa._hideunity_savedstyle.left;
                        aa.style.position = aa._hideunity_savedstyle.position;
                        aa.style.width = aa._hideunity_savedstyle.width;
                        aa.style.height = aa._hideunity_savedstyle.height
                    }
                }

                function s(aa) {
                    aa._old_visibility = aa.style.visibility;
                    aa.style.visibility = "hidden"
                }

                function t(aa) {
                    aa.style.visibility = aa._old_visibility || "";
                    delete aa._old_visibility
                }

                function u(aa) {
                    var ba = aa.type ? aa.type.toLowerCase() : null, ca = ba === "application/x-shockwave-flash" ||
                        aa.classid && aa.classid.toUpperCase() == m;
                    if (!ca)return false;
                    var da = /opaque|transparent/i;
                    if (da.test(aa.getAttribute("wmode")))return false;
                    for (var ea = 0; ea < aa.childNodes.length; ea++) {
                        var fa = aa.childNodes[ea];
                        if (/param/i.test(fa.nodeName) && /wmode/i.test(fa.name) && da.test(fa.value))return false
                    }
                    return true
                }

                function v(aa) {
                    var ba = aa.type ? aa.type.toLowerCase() : null;
                    return ba === "application/vnd.unity" || aa.classid && aa.classid.toUpperCase() == n
                }

                function w(aa) {
                    var ba = l(window.document.getElementsByTagName("object"));
                    ba = ba.concat(l(window.document.getElementsByTagName("embed")));
                    var ca = false, da = false;
                    ES5(ba, "forEach", true, function (fa) {
                        var ga = u(fa), ha = p && v(fa);
                        if (!ga && !ha)return;
                        ca = ca || ga;
                        da = da || ha;
                        var ia = function () {
                            if (aa.state === "opened")if (ga)s(fa); else q(fa); else if (ga)t(fa); else r(fa)
                        };
                        if (o) {
                            i.info("Calling developer specified callback");
                            var ja = {state: aa.state, elem: fa};
                            o(ja);
                            setTimeout(ia, 200)
                        } else ia()
                    });
                    if (Math.random() <= 1 / 1E3) {
                        var ea = {unity: da, flash: ca};
                        g(k.getClientID() + "/occludespopups", "post", ea)
                    }
                }

                h.local.hidePluginObjects =
                    function () {
                        i.info("hidePluginObjects called");
                        w({state: "opened"})
                    };
                h.local.showPluginObjects = function () {
                    i.info("showPluginObjects called");
                    w({state: "closed"})
                };
                h.local.showFlashObjects = h.local.showPluginObjects;
                h.local.hideFlashObjects = h.local.hidePluginObjects;
                function x() {
                    s();
                    q()
                }

                function y() {
                    t();
                    r()
                }

                var z = {_setHidePluginCallback: function (aa) {
                    o = aa
                }, hidePluginElement: x, showPluginElement: y};
                e.exports = z
            }, null);
        __d("sdk.Canvas.IframeHandling", ["DOMWrapper", "sdk.RPC"], function (a, b, c, d, e, f, g, h) {
            var i =
                null, j;

            function k() {
                var o = g.getWindow().document, p = o.body, q = o.documentElement, r = Math.max(p.offsetTop, 0), s = Math.max(q.offsetTop, 0), t = p.scrollHeight + r, u = p.offsetHeight + r, v = q.scrollHeight + s, w = q.offsetHeight + s;
                return Math.max(t, u, v, w)
            }

            function l(o) {
                if (typeof o != "object")o = {};
                var p = 0, q = 0;
                if (!o.height) {
                    o.height = k();
                    p = 16;
                    q = 4
                }
                if (!o.frame)o.frame = window.name || "iframe_canvas";
                if (j) {
                    var r = j.height, s = o.height - r;
                    if (s <= q && s >= -p)return false
                }
                j = o;
                h.remote.setSize(o);
                return true
            }

            function m(o, p) {
                if (p === undefined &&
                    typeof o === "number") {
                    p = o;
                    o = true
                }
                if (o || o === undefined) {
                    if (i === null)i = setInterval(function () {
                        l()
                    }, p || 100);
                    l()
                } else if (i !== null) {
                    clearInterval(i);
                    i = null
                }
            }

            h.stub("setSize");
            var n = {setSize: l, setAutoGrow: m};
            e.exports = n
        }, null);
        __d("sdk.Canvas.Navigation", ["sdk.RPC"], function (a, b, c, d, e, f, g) {
            function h(j) {
                g.local.navigate = function (k) {
                    j({path: k})
                };
                g.remote.setNavigationEnabled(true)
            }

            g.stub("setNavigationEnabled");
            var i = {setUrlHandler: h};
            e.exports = i
        }, null);
        __d("sdk.Canvas.Tti", ["sdk.RPC", "sdk.Runtime"], function (a, b, c, d, e, f, g, h) {
            function i(n, o) {
                var p = {appId: h.getClientID(), time: ES5("Date", "now", false), name: o}, q = [p];
                if (n)q.push(function (r) {
                    n(r.result)
                });
                g.remote.logTtiMessage.apply(null, q)
            }

            function j() {
                i(null, "StartIframeAppTtiTimer")
            }

            function k(n) {
                i(n, "StopIframeAppTtiTimer")
            }

            function l(n) {
                i(n, "RecordIframeAppTti")
            }

            g.stub("logTtiMessage");
            var m = {setDoneLoading: l, startTimer: j, stopTimer: k};
            e.exports = m
        }, null);
        __d("legacy:fb.canvas", ["Assert", "sdk.Canvas.Environment", "sdk.Event", "FB", "sdk.Canvas.Plugin", "sdk.Canvas.IframeHandling",
            "Log", "sdk.Canvas.Navigation", "sdk.Runtime", "sdk.Canvas.Tti"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
            j.provide("Canvas", {setSize: function (q) {
                g.maybeObject(q, "Invalid argument");
                return l.setSize.apply(null, arguments)
            }, setAutoGrow: function () {
                return l.setAutoGrow.apply(null, arguments)
            }, getPageInfo: function (q) {
                g.isFunction(q, "Invalid argument");
                return h.getPageInfo.apply(null, arguments)
            }, scrollTo: function (q, r) {
                g.maybeNumber(q, "Invalid argument");
                g.maybeNumber(r, "Invalid argument");
                return h.scrollTo.apply(null,
                    arguments)
            }, setDoneLoading: function (q) {
                g.maybeFunction(q, "Invalid argument");
                return p.setDoneLoading.apply(null, arguments)
            }, startTimer: function () {
                return p.startTimer.apply(null, arguments)
            }, stopTimer: function (q) {
                g.maybeFunction(q, "Invalid argument");
                return p.stopTimer.apply(null, arguments)
            }, getHash: function (q) {
                g.isFunction(q, "Invalid argument");
                return n.getHash.apply(null, arguments)
            }, setHash: function (q) {
                g.isString(q, "Invalid argument");
                return n.setHash.apply(null, arguments)
            }, setUrlHandler: function (q) {
                g.isFunction(q,
                    "Invalid argument");
                return n.setUrlHandler.apply(null, arguments)
            }});
            i.subscribe("init:post", function (q) {
                if (o.isEnvironment(o.ENVIRONMENTS.CANVAS)) {
                    g.isTrue(!q.hideFlashCallback || !q.hidePluginCallback, "cannot specify deprecated hideFlashCallback and new hidePluginCallback");
                    k._setHidePluginCallback(q.hidePluginCallback || q.hideFlashCallback)
                }
            })
        }, 3);
        __d("sdk.Canvas.Prefetcher", ["sdk.api", "createArrayFrom", "JSSDKCanvasPrefetcherConfig", "sdk.Runtime"], function (a, b, c, d, e, f, g, h, i, j) {
            var k = {AUTOMATIC: 0, MANUAL: 1},
                l = i.sampleRate, m = i.blacklist, n = k.AUTOMATIC, o = [];

            function p() {
                var u = {object: "data", link: "href", script: "src"};
                if (n == k.AUTOMATIC)ES5(ES5("Object", "keys", false, u), "forEach", true, function (v) {
                    var w = u[v];
                    ES5(h(document.getElementsByTagName(v)), "forEach", true, function (x) {
                        if (x[w])o.push(x[w])
                    })
                });
                if (o.length === 0)return;
                g(j.getClientID() + "/staticresources", "post", {urls: ES5("JSON", "stringify", false, o), is_https: location.protocol === "https:"});
                o = []
            }

            function q() {
                if (!j.isEnvironment(j.ENVIRONMENTS.CANVAS) || !j.getClientID() || !l)return;
                if (Math.random() > 1 / l || m == "*" || ~ES5(m, "indexOf", true, j.getClientID()))return;
                setTimeout(p, 3E4)
            }

            function r(u) {
                n = u
            }

            function s(u) {
                o.push(u)
            }

            var t = {COLLECT_AUTOMATIC: k.AUTOMATIC, COLLECT_MANUAL: k.MANUAL, addStaticResource: s, setCollectionMode: r, _maybeSample: q};
            e.exports = t
        }, null);
        __d("legacy:fb.canvas.prefetcher", ["FB", "sdk.Canvas.Prefetcher", "sdk.Event", "sdk.Runtime"], function (a, b, c, d, e, f, g, h, i, j) {
                g.provide("Canvas.Prefetcher", h);
                i.subscribe("init:post", function (k) {
                    if (j.isEnvironment(j.ENVIRONMENTS.CANVAS))h._maybeSample()
                })
            },
            3);
        __d("legacy:fb.event", ["FB", "sdk.Event"], function (a, b, c, d, e, f, g, h) {
            g.provide("Event", {subscribe: ES5(h.subscribe, "bind", true, h), unsubscribe: ES5(h.unsubscribe, "bind", true, h)})
        }, 3);
        __d("legacy:fb.frictionless", ["FB", "sdk.Frictionless"], function (a, b, c, d, e, f, g, h) {
            g.provide("Frictionless", h)
        }, 3);
        __d("sdk.init", ["sdk.Cookie", "sdk.ErrorHandling", "sdk.Event", "Log", "ManagedError", "sdk.PlatformVersioning", "QueryString", "sdk.Runtime", "sdk.URI", "copyProperties", "createArrayFrom"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
            function r(t) {
                var u = typeof t == "number" && t > 0 || typeof t == "string" && /^[0-9a-f]{21,}$|^[0-9]{1,21}$/.test(t);
                if (u)return t.toString();
                j.warn("Invalid App Id: Must be a number or numeric string representing " + "the application id.");
                return null
            }

            function s(t) {
                if (n.getInitialized())j.warn("FB.init has already been called - this could indicate a problem");
                if (n.getIsVersioned()) {
                    if (Object.prototype.toString.call(t) !== "[object Object]")throw new k("Invalid argument");
                    if (t.authResponse)throw new k("Setting authResponse is not supported");
                    if (!t.version)t.version = o(location.href).getQueryData().sdk_version;
                    l.assertValidVersion(t.version);
                    n.setVersion(t.version)
                } else {
                    if (/number|string/.test(typeof t)) {
                        j.warn("FB.init called with invalid parameters");
                        t = {apiKey: t}
                    }
                    t = p({status: true}, t || {})
                }
                var u = r(t.appId || t.apiKey);
                if (u !== null)n.setClientID(u);
                if ("scope"in t)n.setScope(t.scope);
                if (t.cookie) {
                    n.setUseCookie(true);
                    if (typeof t.cookie === "string")g.setDomain(t.cookie)
                }
                if (t.kidDirectedSite)n.setKidDirectedSite(true);
                n.setInitialized(true);
                i.fire("init:post",
                    t)
            }

            setTimeout(function () {
                var t = /(connect\.facebook\.net|\.facebook\.com\/assets.php).*?#(.*)/;
                ES5(q(document.getElementsByTagName("script")), "forEach", true, function (u) {
                    if (u.src) {
                        var v = t.exec(u.src);
                        if (v) {
                            var w = m.decode(v[2]);
                            for (var x in w)if (w.hasOwnProperty(x)) {
                                var y = w[x];
                                if (y == "0")w[x] = 0
                            }
                            s(w)
                        }
                    }
                });
                if (window.fbAsyncInit && !window.fbAsyncInit.hasRun) {
                    window.fbAsyncInit.hasRun = true;
                    h.unguard(window.fbAsyncInit)()
                }
            }, 0);
            e.exports = s
        }, null);
        __d("legacy:fb.init", ["FB", "sdk.init"], function (a, b, c, d, e, f, g, h) {
            g.provide("", {init: h})
        }, 3);
        __d("legacy:fb.pay", ["copyProperties", "sdk.Runtime", "sdk.UIServer", "sdk.XD", "FB"], function (a, b, c, d, e, f, g, h, i, j) {
            b("FB");
            var k = {error_code: 1383001, error_message: "An unknown error caused the dialog to be closed"}, l = function (m) {
                return function (n) {
                    m(n && n.response ? ES5("JSON", "parse", false, n.response) : k)
                }
            };
            g(i.Methods, {"pay.prompt": {transform: function (m) {
                var n = j.handler(l(m.cb), "parent.frames[" + (window.name || "iframe_canvas") + "]");
                m.params.channel = n;
                j.inform("Pay.Prompt", m.params)
            }},
                pay: {size: {width: 555, height: 120}, connectDisplay: "popup", transform: function (m) {
                    m.cb = l(m.cb);
                    if (!h.isEnvironment(h.ENVIRONMENTS.CANVAS)) {
                        m.params.order_info = ES5("JSON", "stringify", false, m.params.order_info);
                        return m
                    }
                    var n = j.handler(m.cb, "parent.frames[" + (window.name || "iframe_canvas") + "]");
                    m.params.channel = n;
                    m.params.uiserver = true;
                    j.inform("Pay.Prompt", m.params)
                }}})
        }, 3);
        __d("legacy:fb.ui", ["FB", "sdk.ui"], function (a, b, c, d, e, f, g, h) {
            g.provide("", {ui: h})
        }, 3);
        __d("Miny", [], function (a, b, c, d, e, f) {
            var g = "Miny1",
                h = {encode: [], decode: {}}, i = "wxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_".split("");

            function j(n) {
                for (var o = h.encode.length; o < n; o++) {
                    var p = o.toString(32).split("");
                    p[p.length - 1] = i[parseInt(p[p.length - 1], 32)];
                    p = p.join("");
                    h.encode[o] = p;
                    h.decode[p] = o
                }
                return h
            }

            function k(n) {
                if (/^$|[~\\]|__proto__/.test(n))return n;
                var o = n.match(/\w+|\W+/g), p = {};
                for (var q = 0; q < o.length; q++)p[o[q]] = (p[o[q]] || 0) + 1;
                var r = ES5("Object", "keys", false, p);
                r.sort(function (u, v) {
                    return p[u] < p[v] ? 1 : p[v] < p[u] ? -1 : 0
                });
                var s = j(r.length).encode;
                for (q =
                         0; q < r.length; q++)p[r[q]] = s[q];
                var t = [];
                for (q = 0; q < o.length; q++)t[q] = p[o[q]];
                return[g, r.length].concat(r).concat(t.join("")).join("~")
            }

            function l(n) {
                var o = n.split("~");
                if (o.shift() != g)return n;
                var p = parseInt(o.shift(), 10), q = o.pop();
                q = q.match(/[0-9a-v]*[\-w-zA-Z_]/g);
                var r = o, s = j(p).decode, t = [];
                for (var u = 0; u < q.length; u++)t[u] = r[s[q[u]]];
                return t.join("")
            }

            var m = {encode: k, decode: l};
            e.exports = m
        }, null);
        __d("runOnce", [], function (a, b, c, d, e, f) {
            function g(h) {
                var i, j;
                return function () {
                    if (!i) {
                        i = true;
                        j = h()
                    }
                    return j
                }
            }

            e.exports = g
        }, null);
        __d("XFBML", ["Assert", "copyProperties", "createArrayFrom", "sdk.DOM", "sdk.feature", "sdk.Impressions", "Log", "ObservableMixin", "runOnce", "UserAgent"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
            var q = {}, r = {}, s = 0, t = new n;

            function u(ca, da) {
                return ca[da] + ""
            }

            function v(ca) {
                return ca.scopeName ? ca.scopeName + ":" + ca.nodeName : ""
            }

            function w(ca) {
                return q[u(ca, "nodeName").toLowerCase()] || q[v(ca).toLowerCase()]
            }

            function x(ca) {
                var da = ES5(ES5(u(ca, "className"), "trim", true).split(/\s+/), "filter", true,
                    function (ea) {
                        return r.hasOwnProperty(ea)
                    });
                if (da.length === 0)return undefined;
                if (ca.getAttribute("fb-xfbml-state") || !ca.childNodes || ca.childNodes.length === 0 || ca.childNodes.length === 1 && ca.childNodes[0].nodeType === 3 || ca.children.length === 1 && u(ca.children[0], "className") === "fb-xfbml-parse-ignore")return r[da[0]]
            }

            function y(ca) {
                var da = {};
                ES5(i(ca.attributes), "forEach", true, function (ea) {
                    da[u(ea, "name")] = u(ea, "value")
                });
                return da
            }

            function z(ca, da, ea) {
                var fa = document.createElement("div");
                j.addCss(ca, da + "-" +
                    ea);
                ES5(i(ca.childNodes), "forEach", true, function (ga) {
                    fa.appendChild(ga)
                });
                ES5(i(ca.attributes), "forEach", true, function (ga) {
                    fa.setAttribute(ga.name, ga.value)
                });
                ca.parentNode.replaceChild(fa, ca);
                return fa
            }

            function aa(ca, da, ea) {
                g.isTrue(ca && ca.nodeType && ca.nodeType === 1 && !!ca.getElementsByTagName, "Invalid DOM node passed to FB.XFBML.parse()");
                g.isFunction(da, "Invalid callback passed to FB.XFBML.parse()");
                var fa = ++s;
                m.info("XFBML Parsing Start %s", fa);
                var ga = 1, ha = 0, ia = function () {
                    ga--;
                    if (ga === 0) {
                        m.info("XFBML Parsing Finish %s, %s tags found",
                            fa, ha);
                        da();
                        t.inform("render", fa, ha)
                    }
                    g.isTrue(ga >= 0, "onrender() has been called too many times")
                };
                ES5(i(ca.getElementsByTagName("*")), "forEach", true, function (ka) {
                    if (!ea && ka.getAttribute("fb-xfbml-state"))return;
                    if (ka.nodeType !== 1)return;
                    var la = w(ka) || x(ka);
                    if (!la)return;
                    if (p.ie() < 9 && ka.scopeName)ka = z(ka, la.xmlns, la.localName);
                    ga++;
                    ha++;
                    var ma = new la.ctor(ka, la.xmlns, la.localName, y(ka));
                    ma.subscribe("render", o(function () {
                        ka.setAttribute("fb-xfbml-state", "rendered");
                        ia()
                    }));
                    var na = function () {
                        if (ka.getAttribute("fb-xfbml-state") ==
                            "parsed")t.subscribe("render.queue", na); else {
                            ka.setAttribute("fb-xfbml-state", "parsed");
                            ma.process()
                        }
                    };
                    na()
                });
                t.inform("parse", fa, ha);
                var ja = 3E4;
                setTimeout(function () {
                    if (ga > 0)m.warn("%s tags failed to render in %s ms", ga, ja)
                }, ja);
                ia()
            }

            t.subscribe("render", function () {
                var ca = t.getSubscribers("render.queue");
                t.clearSubscribers("render.queue");
                ES5(ca, "forEach", true, function (da) {
                    da()
                })
            });
            h(t, {registerTag: function (ca) {
                var da = ca.xmlns + ":" + ca.localName;
                g.isUndefined(q[da], da + " already registered");
                q[da] =
                    ca;
                r[ca.xmlns + "-" + ca.localName] = ca
            }, parse: function (ca, da) {
                aa(ca || document.body, da || function () {
                }, true)
            }, parseNew: function () {
                aa(document.body, function () {
                }, false)
            }});
            if (k("log_tag_count")) {
                var ba = function (ca, da) {
                    t.unsubscribe("parse", ba);
                    setTimeout(ES5(l.log, "bind", true, null, 102, {tag_count: da}), 5E3)
                };
                t.subscribe("parse", ba)
            }
            e.exports = t
        }, null);
        __d("PluginPipe", ["sdk.Content", "copyProperties", "sdk.feature", "guid", "insertIframe", "Miny", "ObservableMixin", "JSSDKPluginPipeConfig", "sdk.Runtime", "UrlMap", "UserAgent",
            "XFBML"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
            var s = new m, t = n.threshold, u = [];

            function v() {
                return!!(i("plugin_pipe") && o.getSecure() !== undefined && (q.chrome() || q.firefox()) && n.enabledApps[o.getClientID()])
            }

            function w() {
                var y = u;
                u = [];
                if (y.length <= t) {
                    ES5(y, "forEach", true, function (ba) {
                        k(ba.config)
                    });
                    return
                }
                var z = y.length + 1;

                function aa() {
                    z--;
                    if (z === 0)x(y)
                }

                ES5(y, "forEach", true, function (ba) {
                    var ca = {};
                    for (var da in ba.config)ca[da] = ba.config[da];
                    ca.url = p.resolve("www", o.getSecure()) + "/plugins/plugin_pipe_shell.php";
                    ca.onload = aa;
                    k(ca)
                });
                aa()
            }

            r.subscribe("parse", w);
            function x(y) {
                var z = document.createElement("span");
                g.appendHidden(z);
                var aa = {};
                ES5(y, "forEach", true, function (fa) {
                    aa[fa.config.name] = {plugin: fa.tag, params: fa.params}
                });
                var ba = ES5("JSON", "stringify", false, aa), ca = l.encode(ba);
                ES5(y, "forEach", true, function (fa) {
                    var ga = document.getElementsByName(fa.config.name)[0];
                    ga.onload = fa.config.onload
                });
                var da = p.resolve("www", o.getSecure()) + "/plugins/pipe.php", ea = j();
                k({url: "about:blank", root: z, name: ea, className: "fb_hidden fb_invisible",
                    onload: function () {
                        g.submitToTarget({url: da, target: ea, params: {plugins: ca.length < ba.length ? ca : ba}})
                    }})
            }

            h(s, {add: function (y) {
                var z = v();
                z && u.push({config: y._config, tag: y._tag, params: y._params});
                return z
            }});
            e.exports = s
        }, null);
        __d("IframePlugin", ["sdk.Auth", "sdk.DOM", "sdk.Event", "Log", "ObservableMixin", "sdk.PlatformVersioning", "PluginPipe", "QueryString", "sdk.Runtime", "Type", "sdk.URI", "UrlMap", "UserAgent", "sdk.XD", "copyProperties", "sdk.createIframe", "guid", "resolveURI"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x) {
            var y = {skin: "string", font: "string", width: "px", height: "px", ref: "string", color_scheme: "string"};

            function z(ga, ha, ia) {
                if (ha || ha === 0)ga.style.width = ha + "px";
                if (ia || ia === 0)ga.style.height = ia + "px"
            }

            function aa(ga) {
                return function (ha) {
                    var ia = {width: ha.width, height: ha.height, pluginID: ga};
                    i.fire("xfbml.resize", ia)
                }
            }

            var ba = {string: function (ga) {
                return ga
            }, bool: function (ga) {
                return ga ? /^(?:true|1|yes|on)$/i.test(ga) : undefined
            }, url: function (ga) {
                return x(ga)
            }, url_maybe: function (ga) {
                return ga ?
                    x(ga) : ga
            }, hostname: function (ga) {
                return ga || window.location.hostname
            }, px: function (ga) {
                return/^(\d+)(?:px)?$/.test(ga) ? parseInt(RegExp.$1, 10) : undefined
            }, text: function (ga) {
                return ga
            }};

            function ca(ga, ha) {
                var ia = ga[ha] || ga[ha.replace(/_/g, "-")] || ga[ha.replace(/_/g, "")] || ga["data-" + ha] || ga["data-" + ha.replace(/_/g, "-")] || ga["data-" + ha.replace(/_/g, "")] || undefined;
                return ia
            }

            function da(ga, ha, ia, ja) {
                ES5(ES5("Object", "keys", false, ga), "forEach", true, function (ka) {
                    if (ga[ka] == "text" && !ia[ka]) {
                        ia[ka] = ha.textContent ||
                            ha.innerText || "";
                        ha.setAttribute(ka, ia[ka])
                    }
                    ja[ka] = ba[ga[ka]](ca(ia, ka))
                })
            }

            function ea(ga) {
                return ga || ga === "0" || ga === 0 ? parseInt(ga, 10) : undefined
            }

            var fa = p.extend({constructor: function (ga, ha, ia, ja) {
                this.parent();
                ia = ia.replace(/-/g, "_");
                var ka = ca(ja, "plugin_id");
                this.subscribe("xd.resize", aa(ka));
                this.subscribe("xd.resize.flow", aa(ka));
                this.subscribe("xd.resize.flow", ES5(function (ra) {
                        this._config.root.style.verticalAlign = "bottom";
                        z(this._config.root, ea(ra.width), ea(ra.height));
                        this.updateLift();
                        clearTimeout(this._timeoutID)
                    },
                    "bind", true, this));
                this.subscribe("xd.resize", ES5(function (ra) {
                    this._config.root.style.verticalAlign = "bottom";
                    z(this._config.root, ea(ra.width), ea(ra.height));
                    z(this._iframe, ea(ra.width), ea(ra.height));
                    this.updateLift();
                    clearTimeout(this._timeoutID)
                }, "bind", true, this));
                this.subscribe("xd.resize.iframe", ES5(function (ra) {
                    z(this._iframe, ea(ra.width), ea(ra.height));
                    this.updateLift();
                    clearTimeout(this._timeoutID)
                }, "bind", true, this));
                this.subscribe("xd.sdk_event", function (ra) {
                    var sa = ES5("JSON", "parse", false,
                        ra.data);
                    sa.pluginID = ka;
                    i.fire(ra.event, sa, ga)
                });
                var la = o.getSecure() || window.location.protocol == "https:", ma = r.resolve("www", la) + "/plugins/" + ia + ".php?", na = {};
                da(this.getParams(), ga, ja, na);
                da(y, ga, ja, na);
                na.app_id = o.getClientID();
                na.locale = o.getLocale();
                na.sdk = "joey";
                na.kid_directed_site = o.getKidDirectedSite();
                var oa = ES5(function (ra) {
                    this.inform("xd." + ra.type, ra)
                }, "bind", true, this);
                na.channel = t.handler(oa, "parent.parent", true);
                h.addCss(ga, "fb_iframe_widget");
                var pa = w();
                this.subscribe("xd.verify", function (ra) {
                    t.sendToFacebook(pa,
                        {method: "xd/verify", params: ES5("JSON", "stringify", false, ra.token)})
                });
                this.subscribe("xd.refreshLoginStatus", ES5(g.getLoginStatus, "bind", true, g, ES5(this.inform, "bind", true, this, "login.status"), true));
                var qa = document.createElement("span");
                qa.style.verticalAlign = "top";
                qa.style.width = "0px";
                qa.style.height = "0px";
                this._element = ga;
                this._ns = ha;
                this._tag = ia;
                this._params = na;
                this._config = {root: qa, url: ma + n.encode(na), name: pa, width: s.mobile() ? undefined : na.width || 1E3, height: na.height || 1E3, style: {border: "none",
                    visibility: "hidden"}, title: this._ns + ":" + this._tag + " Facebook Social Plugin", onload: ES5(function () {
                    this.inform("render")
                }, "bind", true, this)}
            }, process: function () {
                if (o.getIsVersioned()) {
                    l.assertVersionIsSet();
                    var ga = q(this._config.url);
                    this._config.url = ga.setPath("/" + o.getVersion() + ga.getPath()).toString()
                }
                var ha = u({}, this._params);
                delete ha.channel;
                var ia = n.encode(ha);
                if (this._element.getAttribute("fb-iframe-plugin-query") == ia) {
                    j.info("Skipping render: %s:%s %s", this._ns, this._tag, ia);
                    this.inform("render");
                    return
                }
                this._element.setAttribute("fb-iframe-plugin-query", ia);
                this.subscribe("render", function () {
                    this._iframe.style.visibility = "visible"
                });
                while (this._element.firstChild)this._element.removeChild(this._element.firstChild);
                this._element.appendChild(this._config.root);
                var ja = s.mobile() ? 120 : 45;
                this._timeoutID = setTimeout(ES5(function () {
                    this._iframe && z(this._iframe, 0, 0);
                    j.warn("%s:%s failed to resize in %ss", this._ns, this._tag, ja)
                }, "bind", true, this), ja * 1E3);
                if (!m.add(this))this._iframe = v(this._config);
                if (s.mobile()) {
                    h.addCss(this._element, "fb_iframe_widget_fluid");
                    this._element.style.display = "block";
                    this._element.style.width = "100%";
                    this._element.style.height = "auto";
                    this._config.root.style.width = "100%";
                    this._config.root.style.height = "auto";
                    this._iframe.style.width = "100%";
                    this._iframe.style.height = "auto";
                    this._iframe.style.position = "static"
                }
            }, updateLift: function () {
                var ga = this._iframe.style.width === this._config.root.style.width && this._iframe.style.height === this._config.root.style.height;
                h[ga ? "removeCss" :
                    "addCss"](this._iframe, "fb_iframe_widget_lift")
            }}, k);
            fa.getVal = ca;
            fa.withParams = function (ga) {
                return fa.extend({getParams: function () {
                    return ga
                }})
            };
            e.exports = fa
        }, null);
        __d("PluginTags", [], function (a, b, c, d, e, f) {
            var g = {activity: {filter: "string", action: "string", max_age: "string", linktarget: "string", header: "bool", recommendations: "bool", site: "hostname"}, composer: {action_type: "string", action_properties: "string"}, create_event_button: {}, degrees: {href: "url"}, facepile: {href: "string", action: "string", size: "string",
                max_rows: "string", show_count: "bool"}, follow: {href: "url", layout: "string", show_faces: "bool"}, like: {href: "url", layout: "string", show_faces: "bool", share: "bool", action: "string", send: "bool"}, like_box: {href: "string", show_faces: "bool", header: "bool", stream: "bool", force_wall: "bool", show_border: "bool", id: "string", connections: "string", profile_id: "string", name: "string"}, open_graph: {href: "url", layout: "string", show_faces: "bool", action_type: "string", action_properties: "string"}, open_graph_preview: {action_type: "string",
                action_properties: "string"}, page_events: {href: "url"}, post: {href: "url", show_border: "bool"}, privacy_selector: {}, profile_pic: {uid: "string", linked: "bool", href: "string", size: "string", facebook_logo: "bool"}, recommendations: {filter: "string", action: "string", max_age: "string", linktarget: "string", header: "bool", site: "hostname"}, share_button: {href: "url", type: "string"}, shared_activity: {header: "bool"}, send: {href: "url"}, send_to_mobile: {max_rows: "string", show_faces: "bool", size: "string"}, story: {href: "url", show_border: "bool"},
                topic: {topic_name: "string", topic_id: "string"}, want: {href: "url", layout: "string", show_faces: "bool"}}, h = {subscribe: "follow", fan: "like_box", likebox: "like_box", friendpile: "facepile"};
            ES5(ES5("Object", "keys", false, h), "forEach", true, function (i) {
                g[i] = g[h[i]]
            });
            e.exports = g
        }, null);
        __d("sdk.Arbiter", [], function (a, b, c, d, e, f) {
            var g = {BEHAVIOR_EVENT: "e", BEHAVIOR_PERSISTENT: "p", BEHAVIOR_STATE: "s"};
            e.exports = g
        }, null);
        __d("sdk.XFBML.Element", ["sdk.DOM", "Type", "ObservableMixin"], function (a, b, c, d, e, f, g, h, i) {
            var j = h.extend({constructor: function (k) {
                this.parent();
                this.dom = k
            }, fire: function () {
                this.inform.apply(this, arguments)
            }, getAttribute: function (k, l, m) {
                var n = g.getAttr(this.dom, k);
                return n ? m ? m(n) : n : l
            }, _getBoolAttribute: function (k, l) {
                var m = g.getBoolAttr(this.dom, k);
                return m === null ? l : m
            }, _getPxAttribute: function (k, l) {
                return this.getAttribute(k, l, function (m) {
                    var n = parseInt(m, 10);
                    return isNaN(n) ? l : n
                })
            }, _getLengthAttribute: function (k, l) {
                return this.getAttribute(k, l, function (m) {
                    if (m === "100%")return m;
                    var n = parseInt(m, 10);
                    return isNaN(n) ? l : n
                })
            }, _getAttributeFromList: function (k, l, m) {
                return this.getAttribute(k, l, function (n) {
                    n = n.toLowerCase();
                    return ES5(m, "indexOf", true, n) > -1 ? n : l
                })
            }, isValid: function () {
                for (var k = this.dom; k; k = k.parentNode)if (k == document.body)return true
            }, clear: function () {
                g.html(this.dom, "")
            }}, i);
            e.exports = j
        }, null);
        __d("sdk.XFBML.IframeWidget", ["sdk.Arbiter", "sdk.Auth", "sdk.Content", "copyProperties", "sdk.DOM", "sdk.Event", "sdk.XFBML.Element", "guid", "insertIframe", "QueryString", "sdk.Runtime", "sdk.ui", "UrlMap", "sdk.XD"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
            var u = m.extend({_iframeName: null, _showLoader: true, _refreshOnAuthChange: false, _allowReProcess: false, _fetchPreCachedLoader: false, _visibleAfter: "load", _widgetPipeEnabled: false, _borderReset: false, _repositioned: false, getUrlBits: function () {
                throw new Error("Inheriting class needs to implement getUrlBits().");
            }, setupAndValidate: function () {
                return true
            }, oneTimeSetup: function () {
            }, getSize: function () {
            }, getIframeName: function () {
                return this._iframeName
            }, getIframeTitle: function () {
                return"Facebook Social Plugin"
            },
                getChannelUrl: function () {
                    if (!this._channelUrl) {
                        var y = this;
                        this._channelUrl = t.handler(function (z) {
                            y.fire("xd." + z.type, z)
                        }, "parent.parent", true)
                    }
                    return this._channelUrl
                }, getIframeNode: function () {
                    return this.dom.getElementsByTagName("iframe")[0]
                }, arbiterInform: function (event, y, z) {
                    t.sendToFacebook(this.getIframeName(), {method: event, params: ES5("JSON", "stringify", false, y || {}), behavior: z || g.BEHAVIOR_PERSISTENT})
                }, _arbiterInform: function (event, y, z) {
                    var aa = 'parent.frames["' + this.getIframeNode().name + '"]';
                    t.inform(event, y, aa, z)
                }, getDefaultWebDomain: function () {
                    return s.resolve("www")
                }, process: function (y) {
                    if (this._done) {
                        if (!this._allowReProcess && !y)return;
                        this.clear()
                    } else this._oneTimeSetup();
                    this._done = true;
                    this._iframeName = this.getIframeName() || this._iframeName || n();
                    if (!this.setupAndValidate()) {
                        this.fire("render");
                        return
                    }
                    if (this._showLoader)this._addLoader();
                    k.addCss(this.dom, "fb_iframe_widget");
                    if (this._visibleAfter != "immediate")k.addCss(this.dom, "fb_hide_iframes"); else this.subscribe("iframe.onload",
                        ES5(this.fire, "bind", true, this, "render"));
                    var z = this.getSize() || {}, aa = this.getFullyQualifiedURL();
                    if (z.width == "100%")k.addCss(this.dom, "fb_iframe_widget_fluid");
                    this.clear();
                    o({url: aa, root: this.dom.appendChild(document.createElement("span")), name: this._iframeName, title: this.getIframeTitle(), className: q.getRtl() ? "fb_rtl" : "fb_ltr", height: z.height, width: z.width, onload: ES5(this.fire, "bind", true, this, "iframe.onload")});
                    this._resizeFlow(z);
                    this.loaded = false;
                    this.subscribe("iframe.onload", ES5(function () {
                        this.loaded =
                            true
                    }, "bind", true, this))
                }, generateWidgetPipeIframeName: function () {
                    v++;
                    return"fb_iframe_" + v
                }, getFullyQualifiedURL: function () {
                    var y = this._getURL();
                    y += "?" + p.encode(this._getQS());
                    if (y.length > 2E3) {
                        y = "about:blank";
                        var z = ES5(function () {
                            this._postRequest();
                            this.unsubscribe("iframe.onload", z)
                        }, "bind", true, this);
                        this.subscribe("iframe.onload", z)
                    }
                    return y
                }, _getWidgetPipeShell: function () {
                    return s.resolve("www") + "/common/widget_pipe_shell.php"
                }, _oneTimeSetup: function () {
                    this.subscribe("xd.resize", ES5(this._handleResizeMsg,
                        "bind", true, this));
                    this.subscribe("xd.resize", ES5(this._bubbleResizeEvent, "bind", true, this));
                    this.subscribe("xd.resize.iframe", ES5(this._resizeIframe, "bind", true, this));
                    this.subscribe("xd.resize.flow", ES5(this._resizeFlow, "bind", true, this));
                    this.subscribe("xd.resize.flow", ES5(this._bubbleResizeEvent, "bind", true, this));
                    this.subscribe("xd.refreshLoginStatus", function () {
                        h.getLoginStatus(function () {
                        }, true)
                    });
                    this.subscribe("xd.logout", function () {
                        r({method: "auth.logout", display: "hidden"}, function () {
                        })
                    });
                    if (this._refreshOnAuthChange)this._setupAuthRefresh();
                    if (this._visibleAfter == "load")this.subscribe("iframe.onload", ES5(this._makeVisible, "bind", true, this));
                    this.subscribe("xd.verify", ES5(function (y) {
                        this.arbiterInform("xd/verify", y.token)
                    }, "bind", true, this));
                    this.oneTimeSetup()
                }, _makeVisible: function () {
                    this._removeLoader();
                    k.removeCss(this.dom, "fb_hide_iframes");
                    this.fire("render")
                }, _setupAuthRefresh: function () {
                    h.getLoginStatus(ES5(function (y) {
                        var z = y.status;
                        l.subscribe("auth.statusChange", ES5(function (aa) {
                            if (!this.isValid())return;
                            if (z == "unknown" || aa.status == "unknown")this.process(true);
                            z = aa.status
                        }, "bind", true, this))
                    }, "bind", true, this))
                }, _handleResizeMsg: function (y) {
                    if (!this.isValid())return;
                    this._resizeIframe(y);
                    this._resizeFlow(y);
                    if (!this._borderReset) {
                        this.getIframeNode().style.border = "none";
                        this._borderReset = true
                    }
                    this._makeVisible()
                }, _bubbleResizeEvent: function (y) {
                    var z = {height: y.height, width: y.width, pluginID: this.getAttribute("plugin-id")};
                    l.fire("xfbml.resize", z)
                }, _resizeIframe: function (y) {
                    var z = this.getIframeNode();
                    if (y.reposition === "true")this._repositionIframe(y);
                    y.height && (z.style.height = y.height + "px");
                    y.width && (z.style.width = y.width + "px");
                    this._updateIframeZIndex()
                }, _resizeFlow: function (y) {
                    var z = this.dom.getElementsByTagName("span")[0];
                    y.height && (z.style.height = y.height + "px");
                    y.width && (z.style.width = y.width + "px");
                    this._updateIframeZIndex()
                }, _updateIframeZIndex: function () {
                    var y = this.dom.getElementsByTagName("span")[0], z = this.getIframeNode(), aa = z.style.height === y.style.height && z.style.width === y.style.width,
                        ba = aa ? "removeCss" : "addCss";
                    k[ba](z, "fb_iframe_widget_lift")
                }, _repositionIframe: function (y) {
                    var z = this.getIframeNode(), aa = parseInt(k.getStyle(z, "width"), 10), ba = k.getPosition(z).x, ca = k.getViewportInfo().width, da = parseInt(y.width, 10);
                    if (ba + da > ca && ba > da) {
                        z.style.left = aa - da + "px";
                        this.arbiterInform("xd/reposition", {type: "horizontal"});
                        this._repositioned = true
                    } else if (this._repositioned) {
                        z.style.left = "0px";
                        this.arbiterInform("xd/reposition", {type: "restore"});
                        this._repositioned = false
                    }
                }, _addLoader: function () {
                    if (!this._loaderDiv) {
                        k.addCss(this.dom,
                            "fb_iframe_widget_loader");
                        this._loaderDiv = document.createElement("div");
                        this._loaderDiv.className = "FB_Loader";
                        this.dom.appendChild(this._loaderDiv)
                    }
                }, _removeLoader: function () {
                    if (this._loaderDiv) {
                        k.removeCss(this.dom, "fb_iframe_widget_loader");
                        if (this._loaderDiv.parentNode)this._loaderDiv.parentNode.removeChild(this._loaderDiv);
                        this._loaderDiv = null
                    }
                }, _getQS: function () {
                    return j({api_key: q.getClientID(), locale: q.getLocale(), sdk: "joey", kid_directed_site: q.getKidDirectedSite(), ref: this.getAttribute("ref")},
                        this.getUrlBits().params)
                }, _getURL: function () {
                    var y = this.getDefaultWebDomain(), z = "";
                    return y + "/plugins/" + z + this.getUrlBits().name + ".php"
                }, _postRequest: function () {
                    i.submitToTarget({url: this._getURL(), target: this.getIframeNode().name, params: this._getQS()})
                }}), v = 0, w = {};

            function x() {
                var y = {};
                for (var z in w) {
                    var aa = w[z];
                    y[z] = {widget: aa.getUrlBits().name, params: aa._getQS()}
                }
                return y
            }

            e.exports = u
        }, null);
        __d("sdk.XFBML.Comments", ["sdk.Event", "sdk.XFBML.IframeWidget", "QueryString", "sdk.Runtime", "JSSDKConfig",
            "UrlMap", "UserAgent"], function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
            var n = h.extend({_visibleAfter: "immediate", _refreshOnAuthChange: true, setupAndValidate: function () {
                var o = {channel_url: this.getChannelUrl(), colorscheme: this.getAttribute("colorscheme"), skin: this.getAttribute("skin"), numposts: this.getAttribute("num-posts", 10), width: this._getLengthAttribute("width"), href: this.getAttribute("href"), permalink: this.getAttribute("permalink"), publish_feed: this.getAttribute("publish_feed"), order_by: this.getAttribute("order_by"),
                    mobile: this._getBoolAttribute("mobile")};
                if (!o.width && !o.permalink)o.width = 550;
                if (k.initSitevars.enableMobileComments && m.mobile() && o.mobile !== false) {
                    o.mobile = true;
                    delete o.width
                }
                if (!o.skin)o.skin = o.colorscheme;
                if (!o.href) {
                    o.migrated = this.getAttribute("migrated");
                    o.xid = this.getAttribute("xid");
                    o.title = this.getAttribute("title", document.title);
                    o.url = this.getAttribute("url", document.URL);
                    o.quiet = this.getAttribute("quiet");
                    o.reverse = this.getAttribute("reverse");
                    o.simple = this.getAttribute("simple");
                    o.css =
                        this.getAttribute("css");
                    o.notify = this.getAttribute("notify");
                    if (!o.xid) {
                        var p = ES5(document.URL, "indexOf", true, "#");
                        if (p > 0)o.xid = encodeURIComponent(document.URL.substring(0, p)); else o.xid = encodeURIComponent(document.URL)
                    }
                    if (o.migrated)o.href = l.resolve("www") + "/plugins/comments_v1.php?" + "app_id\x3d" + j.getClientID() + "\x26xid\x3d" + encodeURIComponent(o.xid) + "\x26url\x3d" + encodeURIComponent(o.url)
                } else {
                    var q = this.getAttribute("fb_comment_id");
                    if (!q) {
                        q = i.decode(document.URL.substring(ES5(document.URL, "indexOf",
                            true, "?") + 1)).fb_comment_id;
                        if (q && ES5(q, "indexOf", true, "#") > 0)q = q.substring(0, ES5(q, "indexOf", true, "#"))
                    }
                    if (q) {
                        o.fb_comment_id = q;
                        this.subscribe("render", ES5(function () {
                            if (!window.location.hash)window.location.hash = this.getIframeNode().id
                        }, "bind", true, this))
                    }
                }
                this._attr = o;
                return true
            }, oneTimeSetup: function () {
                this.subscribe("xd.addComment", ES5(this._handleCommentMsg, "bind", true, this));
                this.subscribe("xd.commentCreated", ES5(this._handleCommentCreatedMsg, "bind", true, this));
                this.subscribe("xd.commentRemoved",
                    ES5(this._handleCommentRemovedMsg, "bind", true, this))
            }, getSize: function () {
                if (!this._attr.permalink)return{width: this._attr.mobile ? "100%" : this._attr.width, height: 160}
            }, getUrlBits: function () {
                return{name: "comments", params: this._attr}
            }, getDefaultWebDomain: function () {
                return l.resolve(this._attr.mobile ? "m" : "www", true)
            }, _handleCommentMsg: function (o) {
                if (!this.isValid())return;
                g.fire("comments.add", {post: o.post, user: o.user, widget: this})
            }, _handleCommentCreatedMsg: function (o) {
                if (!this.isValid())return;
                var p =
                {href: o.href, commentID: o.commentID, parentCommentID: o.parentCommentID};
                g.fire("comment.create", p)
            }, _handleCommentRemovedMsg: function (o) {
                if (!this.isValid())return;
                var p = {href: o.href, commentID: o.commentID};
                g.fire("comment.remove", p)
            }});
            e.exports = n
        }, null);
        __d("mergeArrays", [], function (a, b, c, d, e, f) {
            function g(h, i) {
                for (var j = 0; j < i.length; j++)if (ES5(h, "indexOf", true, i[j]) < 0)h.push(i[j]);
                return h
            }

            e.exports = g
        }, null);
        __d("format", [], function (a, b, c, d, e, f) {
            function g(h, i) {
                i = Array.prototype.slice.call(arguments,
                    1);
                return h.replace(/\{(\d+)\}/g, function (j, k) {
                    var l = i[Number(k)];
                    return l === null || l === undefined ? "" : l.toString()
                })
            }

            e.exports = g
        }, null);
        __d("safeEval", [], function (a, b, c, d, e, f) {
            function g(h, i) {
                if (h === null || typeof h === "undefined")return;
                if (typeof h !== "string")return h;
                if (/^\w+$/.test(h) && typeof window[h] === "function")return window[h].apply(null, i || []);
                return Function('return eval("' + h.replace(/"/g, '\\"') + '");').apply(null, i || [])
            }

            e.exports = g
        }, null);
        __d("sdk.Waitable", ["sdk.Model"], function (a, b, c, d, e, f, g) {
            var h = g.extend({constructor: function () {
                this.parent({Value: undefined})
            }, error: function (i) {
                this.inform("error", i)
            }, wait: function (i, j) {
                if (j)this.subscribe("error", j);
                this.monitor("Value.change", ES5(function () {
                    var k = this.getValue();
                    if (k !== undefined) {
                        this.value = k;
                        i(k);
                        return true
                    }
                }, "bind", true, this))
            }});
            e.exports = h
        }, null);
        __d("sdk.Query", ["format", "safeEval", "Type", "sdk.Waitable"], function (a, b, c, d, e, f, g, h, i, j) {
            function k(p) {
                return ES5(p.split(","), "map", true, function (q) {
                    return ES5(q, "trim", true)
                })
            }

            function l(p) {
                var q = /^\s*(\w+)\s*=\s*(.*)\s*$/i.exec(p), r, s, t = "unknown";
                if (q) {
                    s = q[2];
                    if (/^(["'])(?:\\?.)*?\1$/.test(s)) {
                        s = h(s);
                        t = "index"
                    } else if (/^\d+\.?\d*$/.test(s))t = "index"
                }
                if (t == "index")r = {type: "index", key: q[1], value: s}; else r = {type: "unknown", value: p};
                return r
            }

            function m(p) {
                return typeof p === "string" ? ES5("JSON", "stringify", false, p) : p
            }

            var n = 1, o = j.extend({constructor: function () {
                this.parent();
                this.name = "v_" + n++
            }, hasDependency: function (p) {
                if (arguments.length)this._hasDependency = p;
                return!!this._hasDependency
            },
                parse: function (p) {
                    var q = g.apply(null, p), r = /^select (.*?) from (\w+)\s+where (.*)$/i.exec(q);
                    this.fields = k(r[1]);
                    this.table = r[2];
                    this.where = l(r[3]);
                    for (var s = 1; s < p.length; s++)if (i.instanceOf(o, p[s]))p[s].hasDependency(true);
                    return this
                }, toFql: function () {
                    var p = "select " + this.fields.join(",") + " from " + this.table + " where ";
                    switch (this.where.type) {
                        case "unknown":
                            p += this.where.value;
                            break;
                        case "index":
                            p += this.where.key + "\x3d" + m(this.where.value);
                            break;
                        case "in":
                            if (this.where.value.length == 1)p += this.where.key +
                                "\x3d" + m(this.where.value[0]); else p += this.where.key + " in (" + ES5(this.where.value, "map", true, m).join(",") + ")";
                            break
                    }
                    return p
                }, toString: function () {
                    return"#" + this.name
                }});
            e.exports = o
        }, null);
        __d("sdk.Data", ["sdk.api", "sdk.ErrorHandling", "mergeArrays", "sdk.Query", "safeEval", "sdk.Waitable"], function (a, b, c, d, e, f, g, h, i, j, k, l) {
            var m = {query: function (n, o) {
                var p = (new j).parse(Array.prototype.slice.call(arguments));
                m.queue.push(p);
                m._waitToProcess();
                return p
            }, waitOn: function (n, o) {
                var p = new l, q = n.length;
                if (typeof o ==
                    "string") {
                    var r = o;
                    o = h.unguard(function () {
                        return k(r)
                    })
                }
                ES5(n, "forEach", true, function (s) {
                    s.monitor("Value.change", function () {
                        var t = false;
                        if (m._getValue(s) !== undefined) {
                            s.value = s.getValue();
                            q--;
                            t = true
                        }
                        if (q === 0) {
                            var u = o(ES5(n, "map", true, m._getValue));
                            p.setValue(u !== undefined ? u : true)
                        }
                        return t
                    })
                });
                return p
            }, process: function (n) {
                m._process(n)
            }, _getValue: function (n) {
                return n instanceof l ? n.getValue() : n
            }, _selectByIndex: function (n, o, p, q) {
                var r = new j;
                r.fields = n;
                r.table = o;
                r.where = {type: "index", key: p, value: q};
                m.queue.push(r);
                m._waitToProcess();
                return r
            }, _waitToProcess: function () {
                if (m.timer < 0)m.timer = setTimeout(function () {
                    m._process()
                }, 10)
            }, _process: function (n) {
                m.timer = -1;
                var o = {}, p = m.queue;
                if (!p.length)return;
                m.queue = [];
                for (var q = 0; q < p.length; q++) {
                    var r = p[q];
                    if (r.where.type == "index" && !r.hasDependency())m._mergeIndexQuery(r, o); else o[r.name] = r
                }
                var s = {q: {}};
                for (var t in o)if (o.hasOwnProperty(t))s.q[t] = o[t].toFql();
                if (n)s.access_token = n;
                g("/fql", "GET", s, function (u) {
                    if (u.error)ES5(ES5("Object", "keys", false,
                        o), "forEach", true, function (v) {
                        o[v].error(new Error(u.error.message))
                    }); else ES5(u.data, "forEach", true, function (v) {
                        o[v.name].setValue(v.fql_result_set)
                    })
                })
            }, _mergeIndexQuery: function (n, o) {
                var p = n.where.key, q = n.where.value, r = "index_" + n.table + "_" + p, s = o[r];
                if (!s) {
                    s = o[r] = new j;
                    s.fields = [p];
                    s.table = n.table;
                    s.where = {type: "in", key: p, value: []}
                }
                i(s.fields, n.fields);
                i(s.where.value, [q]);
                s.wait(function (t) {
                    n.setValue(ES5(t, "filter", true, function (u) {
                        return u[p] == q
                    }))
                })
            }, timer: -1, queue: []};
            e.exports = m
        }, null);
        __d("sdk.XFBML.CommentsCount",
            ["sdk.Data", "sdk.DOM", "sdk.XFBML.Element", "sprintf"], function (a, b, c, d, e, f, g, h, i, j) {
                var k = i.extend({process: function () {
                    h.addCss(this.dom, "fb_comments_count_zero");
                    var l = this.getAttribute("href", window.location.href);
                    g._selectByIndex(["commentsbox_count"], "link_stat", "url", l).wait(ES5(function (m) {
                        var n = m[0].commentsbox_count;
                        h.html(this.dom, j('\x3cspan class\x3d"fb_comments_count"\x3e%s\x3c/span\x3e', n));
                        if (n > 0)h.removeCss(this.dom, "fb_comments_count_zero");
                        this.fire("render")
                    }, "bind", true, this))
                }});
                e.exports = k
            }, null);
        __d("sdk.Anim", ["sdk.DOM"], function (a, b, c, d, e, f, g) {
            var h = {ate: function (i, j, k, l) {
                k = !isNaN(parseFloat(k)) && k >= 0 ? k : 750;
                var m = 40, n = {}, o = {}, p = null, q = setInterval(ES5(function () {
                    if (!p)p = ES5("Date", "now", false);
                    var r = 1;
                    if (k != 0)r = Math.min((ES5("Date", "now", false) - p) / k, 1);
                    for (var s in j)if (j.hasOwnProperty(s)) {
                        var t = j[s];
                        if (!n[s]) {
                            var u = g.getStyle(i, s);
                            if (u === false)return;
                            n[s] = this._parseCSS(u + "")
                        }
                        if (!o[s])o[s] = this._parseCSS(t.toString());
                        var v = "";
                        ES5(n[s], "forEach", true, function (w, x) {
                            if (isNaN(o[s][x].numPart) &&
                                o[s][x].textPart == "?")v = w.numPart + w.textPart; else if (isNaN(w.numPart))v = w.textPart; else v += w.numPart + Math.ceil((o[s][x].numPart - w.numPart) * Math.sin(Math.PI / 2 * r)) + o[s][x].textPart + " "
                        });
                        g.setStyle(i, s, v)
                    }
                    if (r == 1) {
                        clearInterval(q);
                        if (l)l(i)
                    }
                }, "bind", true, this), m)
            }, _parseCSS: function (i) {
                var j = [];
                ES5(i.split(" "), "forEach", true, function (k) {
                    var l = parseInt(k, 10);
                    j.push({numPart: l, textPart: k.replace(l, "")})
                });
                return j
            }};
            e.exports = h
        }, null);
        __d("escapeHTML", [], function (a, b, c, d, e, f) {
            var g = /[&<>"'\/]/g, h = {"\x26": "\x26amp;",
                "\x3c": "\x26lt;", "\x3e": "\x26gt;", '"': "\x26quot;", "'": "\x26#039;", "/": "\x26#x2F;"};

            function i(j) {
                return j.replace(g, function (k) {
                    return h[k]
                })
            }

            e.exports = i
        }, null);
        __d("sdk.Helper", ["sdk.ErrorHandling", "sdk.Event", "UrlMap", "safeEval", "sprintf"], function (a, b, c, d, e, f, g, h, i, j, k) {
            var l = {isUser: function (m) {
                return m < 22E8 || m >= 1E14 && m <= 0x5b0a58f100ef || m >= 89E12 && m <= 89999999999999
            }, upperCaseFirstChar: function (m) {
                if (m.length > 0)return m.substr(0, 1).toUpperCase() + m.substr(1); else return m
            }, getProfileLink: function (m, n, o) {
                if (!o && m)o = k("%s/profile.php?id\x3d%s", i.resolve("www"), m.uid || m.id);
                if (o)n = k('\x3ca class\x3d"fb_link" href\x3d"%s"\x3e%s\x3c/a\x3e', o, n);
                return n
            }, invokeHandler: function (m, n, o) {
                if (m)if (typeof m === "string")g.unguard(j)(m, o); else if (m.apply)g.unguard(m).apply(n, o || [])
            }, fireEvent: function (m, n) {
                var o = n._attr.href;
                n.fire(m, o);
                h.fire(m, o, n)
            }, executeFunctionByName: function (m) {
                var n = Array.prototype.slice.call(arguments, 1), o = m.split("."), p = o.pop(), q = window;
                for (var r = 0; r < o.length; r++)q = q[o[r]];
                return q[p].apply(this,
                    n)
            }};
            e.exports = l
        }, null);
        __d("sdk.XFBML.ConnectBar", ["sdk.Anim", "sdk.api", "sdk.Auth", "createArrayFrom", "JSSDKConnectBarConfig", "sdk.Data", "sdk.DOM", "sdk.XFBML.Element", "escapeHTML", "sdk.Event", "format", "sdk.Helper", "sdk.Insights", "sdk.Intl", "sdk.Runtime", "UrlMap", "UserAgent"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w) {
            var x = n.extend({_initialHeight: null, _initTopMargin: 0, _picFieldName: "pic_square", _page: null, _displayed: false, _notDisplayed: false, _container: null, _animationSpeed: 0, process: function () {
                i.getLoginStatus(ES5(function (y) {
                    p.monitor("auth.statusChange",
                        ES5(function () {
                            if (this.isValid() && u.getLoginStatus() == "connected") {
                                this._uid = u.getUserID();
                                h({method: "Connect.shouldShowConnectBar"}, ES5(function (z) {
                                    if (z != 2) {
                                        this._animationSpeed = z == 0 ? 750 : 0;
                                        this._showBar()
                                    } else this._noRender()
                                }, "bind", true, this))
                            } else this._noRender();
                            return false
                        }, "bind", true, this))
                }, "bind", true, this))
            }, _showBar: function () {
                var y = l._selectByIndex(["first_name", "profile_url", this._picFieldName], "user", "uid", this._uid), z = l._selectByIndex(["display_name"], "application", "api_key", u.getClientID());
                l.waitOn([y, z], ES5(function (aa) {
                    aa[0][0].site_name = aa[1][0].display_name;
                    if (!this._displayed) {
                        this._displayed = true;
                        this._notDisplayed = false;
                        this._renderConnectBar(aa[0][0]);
                        this.fire("render");
                        s.impression({lid: 104, name: "widget_load"});
                        this.fire("connectbar.ondisplay");
                        p.fire("connectbar.ondisplay", this);
                        r.invokeHandler(this.getAttribute("on-display"), this)
                    }
                }, "bind", true, this))
            }, _noRender: function () {
                if (this._displayed) {
                    this._displayed = false;
                    this._closeConnectBar()
                }
                if (!this._notDisplayed) {
                    this._notDisplayed =
                        true;
                    this.fire("render");
                    this.fire("connectbar.onnotdisplay");
                    p.fire("connectbar.onnotdisplay", this);
                    r.invokeHandler(this.getAttribute("on-not-display"), this)
                }
            }, _renderConnectBar: function (y) {
                var z = document.createElement("div"), aa = document.createElement("div");
                z.className = "fb_connect_bar";
                aa.className = "fb_reset fb_connect_bar_container";
                aa.appendChild(z);
                document.body.appendChild(aa);
                this._container = aa;
                this._initialHeight = Math.round(parseFloat(m.getStyle(aa, "height")) + parseFloat(m.getStyle(aa, "borderBottomWidth")));
                m.html(z, q('\x3cdiv class\x3d"fb_buttons"\x3e' + '\x3ca href\x3d"#" class\x3d"fb_bar_close"\x3e' + '\x3cimg src\x3d"{1}" alt\x3d"{2}" title\x3d"{2}"/\x3e' + "\x3c/a\x3e" + "\x3c/div\x3e" + '\x3ca href\x3d"{7}" class\x3d"fb_profile" target\x3d"_blank"\x3e' + '\x3cimg src\x3d"{3}" alt\x3d"{4}" title\x3d"{4}"/\x3e' + "\x3c/a\x3e" + "{5}" + " \x3cspan\x3e" + '\x3ca href\x3d"{8}" class\x3d"fb_learn_more" target\x3d"_blank"\x3e{6}\x3c/a\x3e \x26ndash; ' + '\x3ca href\x3d"#" class\x3d"fb_no_thanks"\x3e{0}\x3c/a\x3e' + "\x3c/span\x3e",
                    t.tx._("\u4e0d\uff0c\u8c22\u8c22"), v.resolve("fbcdn") + "/" + k.imgs.buttonUrl, t.tx._("\u5173\u95ed"), y[this._picFieldName] || v.resolve("fbcdn") + "/" + k.imgs.missingProfileUrl, o(y.first_name), t.tx._("\u4f60\u597d\uff0c{firstName}\u3002\x3cstrong\x3e{siteName}\x3c/strong\x3e\u6b63\u5728\u4f7f\u7528 Facebook \u4e2a\u6027\u5316\u4f60\u7684\u4f53\u9a8c\u3002", {firstName: o(y.first_name), siteName: o(y.site_name)}), t.tx._("\u4e86\u89e3\u66f4\u591a"), y.profile_url, v.resolve("www") + "/sitetour/connect.php"));
                ES5(j(z.getElementsByTagName("a")),
                    "forEach", true, function (da) {
                        da.onclick = ES5(this._clickHandler, "bind", true, this)
                    }, this);
                this._page = document.body;
                var ba = 0;
                if (this._page.parentNode)ba = Math.round((parseFloat(m.getStyle(this._page.parentNode, "height")) - parseFloat(m.getStyle(this._page, "height"))) / 2); else ba = parseInt(m.getStyle(this._page, "marginTop"), 10);
                ba = isNaN(ba) ? 0 : ba;
                this._initTopMargin = ba;
                if (!window.XMLHttpRequest)aa.className += " fb_connect_bar_container_ie6"; else {
                    aa.style.top = -1 * this._initialHeight + "px";
                    g.ate(aa, {top: "0px"}, this._animationSpeed)
                }
                var ca =
                {marginTop: this._initTopMargin + this._initialHeight + "px"};
                if (w.ie())ca.backgroundPositionY = this._initialHeight + "px"; else ca.backgroundPosition = "? " + this._initialHeight + "px";
                g.ate(this._page, ca, this._animationSpeed)
            }, _clickHandler: function (y) {
                y = y || window.event;
                var z = y.target || y.srcElement;
                while (z.nodeName != "A")z = z.parentNode;
                switch (z.className) {
                    case "fb_bar_close":
                        h({method: "Connect.connectBarMarkAcknowledged"});
                        s.impression({lid: 104, name: "widget_user_closed"});
                        this._closeConnectBar();
                        break;
                    case "fb_learn_more":
                    case "fb_profile":
                        window.open(z.href);
                        break;
                    case "fb_no_thanks":
                        this._closeConnectBar();
                        h({method: "Connect.connectBarMarkAcknowledged"});
                        s.impression({lid: 104, name: "widget_user_no_thanks"});
                        h({method: "auth.revokeAuthorization", block: true}, ES5(function () {
                            this.fire("connectbar.ondeauth");
                            p.fire("connectbar.ondeauth", this);
                            r.invokeHandler(this.getAttribute("on-deauth"), this);
                            if (this._getBoolAttribute("auto-refresh", true))window.location.reload()
                        }, "bind", true, this));
                        break
                }
                return false
            }, _closeConnectBar: function () {
                this._notDisplayed = true;
                var y = {marginTop: this._initTopMargin + "px"};
                if (w.ie())y.backgroundPositionY = "0px"; else y.backgroundPosition = "? 0px";
                var z = this._animationSpeed == 0 ? 0 : 300;
                g.ate(this._page, y, z);
                g.ate(this._container, {top: -1 * this._initialHeight + "px"}, z, function (aa) {
                    aa.parentNode.removeChild(aa)
                });
                this.fire("connectbar.onclose");
                p.fire("connectbar.onclose", this);
                r.invokeHandler(this.getAttribute("on-close"), this)
            }});
            e.exports = x
        }, null);
        __d("sdk.XFBML.LoginButton", ["sdk.Helper", "IframePlugin"], function (a, b, c, d, e, f, g, h) {
            var i =
                h.extend({constructor: function (j, k, l, m) {
                    this.parent(j, k, l, m);
                    var n = h.getVal(m, "on_login");
                    if (n)this.subscribe("login.status", function (o) {
                        g.invokeHandler(n, null, [o])
                    })
                }, getParams: function () {
                    return{scope: "string", perms: "string", size: "string", login_text: "text", show_faces: "bool", max_rows: "string", show_login_face: "bool", registration_url: "url_maybe", auto_logout_link: "bool", one_click: "bool", show_banner: "bool", auth_type: "string"}
                }});
            e.exports = i
        }, null);
        __d("sdk.XFBML.Name", ["copyProperties", "sdk.Data", "escapeHTML",
            "sdk.Event", "sdk.XFBML.Element", "sdk.Helper", "Log", "sdk.Runtime"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
            var o = k.extend({process: function () {
                g(this, {_uid: this.getAttribute("uid"), _firstnameonly: this._getBoolAttribute("first-name-only"), _lastnameonly: this._getBoolAttribute("last-name-only"), _possessive: this._getBoolAttribute("possessive"), _reflexive: this._getBoolAttribute("reflexive"), _objective: this._getBoolAttribute("objective"), _linked: this._getBoolAttribute("linked", true), _subjectId: this.getAttribute("subject-id")});
                if (!this._uid) {
                    m.error('"uid" is a required attribute for \x3cfb:name\x3e');
                    this.fire("render");
                    return
                }
                var p = [];
                if (this._firstnameonly)p.push("first_name"); else if (this._lastnameonly)p.push("last_name"); else p.push("name");
                if (this._subjectId) {
                    p.push("sex");
                    if (this._subjectId == n.getUserID())this._reflexive = true
                }
                var q;
                j.monitor("auth.statusChange", ES5(function () {
                    if (!this.isValid()) {
                        this.fire("render");
                        return true
                    }
                    if (!this._uid || this._uid == "loggedinuser")this._uid = n.getUserID();
                    if (!this._uid)return;
                    if (l.isUser(this._uid))q = h._selectByIndex(p, "user", "uid", this._uid); else q = h._selectByIndex(["name", "id"], "profile", "id", this._uid);
                    q.wait(ES5(function (r) {
                        if (this._subjectId == this._uid)this._renderPronoun(r[0]); else this._renderOther(r[0]);
                        this.fire("render")
                    }, "bind", true, this))
                }, "bind", true, this))
            }, _renderPronoun: function (p) {
                var q = "", r = this._objective;
                if (this._subjectId) {
                    r = true;
                    if (this._subjectId === this._uid)this._reflexive = true
                }
                if (this._uid == n.getUserID() && this._getBoolAttribute("use-you", true))if (this._possessive)if (this._reflexive)q =
                    "your own"; else q = "your"; else if (this._reflexive)q = "yourself"; else q = "you"; else switch (p.sex) {
                    case "male":
                        if (this._possessive)q = this._reflexive ? "his own" : "his"; else if (this._reflexive)q = "himself"; else if (r)q = "him"; else q = "he";
                        break;
                    case "female":
                        if (this._possessive)q = this._reflexive ? "her own" : "her"; else if (this._reflexive)q = "herself"; else if (r)q = "her"; else q = "she";
                        break;
                    default:
                        if (this._getBoolAttribute("use-they", true))if (this._possessive)if (this._reflexive)q = "their own"; else q = "their"; else if (this._reflexive)q =
                            "themselves"; else if (r)q = "them"; else q = "they"; else if (this._possessive)if (this._reflexive)q = "his/her own"; else q = "his/her"; else if (this._reflexive)q = "himself/herself"; else if (r)q = "him/her"; else q = "he/she";
                        break
                }
                if (this._getBoolAttribute("capitalize", false))q = l.upperCaseFirstChar(q);
                this.dom.innerHTML = q
            }, _renderOther: function (p) {
                var q = "", r = "";
                if (this._uid == n.getUserID() && this._getBoolAttribute("use-you", true))if (this._reflexive)if (this._possessive)q = "your own"; else q = "yourself"; else if (this._possessive)q =
                    "your"; else q = "you"; else if (p) {
                    if (null === p.first_name)p.first_name = "";
                    if (null === p.last_name)p.last_name = "";
                    if (this._firstnameonly && p.first_name !== undefined)q = i(p.first_name); else if (this._lastnameonly && p.last_name !== undefined)q = i(p.last_name);
                    if (!q)q = i(p.name);
                    if (q !== "" && this._possessive)q += "'s"
                }
                if (!q)q = i(this.getAttribute("if-cant-see", "Facebook User"));
                if (q) {
                    if (this._getBoolAttribute("capitalize", false))q = l.upperCaseFirstChar(q);
                    if (p && this._linked)r = l.getProfileLink(p, q, this.getAttribute("href",
                        null)); else r = q
                }
                this.dom.innerHTML = r
            }});
            e.exports = o
        }, null);
        __d("sdk.XFBML.RecommendationsBar", ["sdk.Arbiter", "DOMEventListener", "sdk.Event", "sdk.XFBML.IframeWidget", "resolveURI", "sdk.Runtime"], function (a, b, c, d, e, f, g, h, i, j, k, l) {
            var m = j.extend({getUrlBits: function () {
                return{name: "recommendations_bar", params: this._attr}
            }, setupAndValidate: function () {
                function n(w, x) {
                    var y = 0, z = null;

                    function aa() {
                        x();
                        z = null;
                        y = ES5("Date", "now", false)
                    }

                    return function () {
                        if (!z) {
                            var ba = ES5("Date", "now", false);
                            if (ba - y < w)z = setTimeout(aa,
                                    w - (ba - y)); else aa()
                        }
                        return true
                    }
                }

                function o(w) {
                    if (w.match(/^\d+(?:\.\d+)?%$/)) {
                        var x = Math.min(Math.max(parseInt(w, 10), 0), 100);
                        w = x / 100
                    } else if (w != "manual" && w != "onvisible")w = "onvisible";
                    return w
                }

                function p(w) {
                    return Math.max(parseInt(w, 10) || 30, 10)
                }

                function q(w) {
                    if (w == "left" || w == "right")return w;
                    return l.getRtl() ? "left" : "right"
                }

                this._attr = {channel: this.getChannelUrl(), api_key: l.getClientID(), font: this.getAttribute("font"), colorscheme: this.getAttribute("colorscheme"), href: k(this.getAttribute("href")),
                    side: q(this.getAttribute("side")), site: this.getAttribute("site"), action: this.getAttribute("action"), ref: this.getAttribute("ref"), max_age: this.getAttribute("max_age"), trigger: o(this.getAttribute("trigger", "")), read_time: p(this.getAttribute("read_time")), num_recommendations: parseInt(this.getAttribute("num_recommendations"), 10) || 2};
                this._showLoader = false;
                this.subscribe("iframe.onload", ES5(function () {
                    var w = this.dom.children[0];
                    w.className = "fbpluginrecommendationsbar" + this._attr.side
                }, "bind", true, this));
                var r = ES5(function () {
                    h.remove(window, "scroll", r);
                    h.remove(document.documentElement, "click", r);
                    h.remove(document.documentElement, "mousemove", r);
                    setTimeout(ES5(this.arbiterInform, "bind", true, this, "platform/plugins/recommendations_bar/action", null, g.BEHAVIOR_STATE), this._attr.read_time * 1E3);
                    return true
                }, "bind", true, this);
                h.add(window, "scroll", r);
                h.add(document.documentElement, "click", r);
                h.add(document.documentElement, "mousemove", r);
                if (this._attr.trigger == "manual") {
                    var s = ES5(function (w) {
                        if (w == this._attr.href) {
                            i.unsubscribe("xfbml.recommendationsbar.read",
                                s);
                            this.arbiterInform("platform/plugins/recommendations_bar/trigger", null, g.BEHAVIOR_STATE)
                        }
                        return true
                    }, "bind", true, this);
                    i.subscribe("xfbml.recommendationsbar.read", s)
                } else {
                    var t = n(500, ES5(function () {
                        if (this.calculateVisibility()) {
                            h.remove(window, "scroll", t);
                            h.remove(window, "resize", t);
                            this.arbiterInform("platform/plugins/recommendations_bar/trigger", null, g.BEHAVIOR_STATE)
                        }
                        return true
                    }, "bind", true, this));
                    h.add(window, "scroll", t);
                    h.add(window, "resize", t);
                    t()
                }
                this.visible = false;
                var u = n(500, ES5(function () {
                    if (!this.visible &&
                        this.calculateVisibility()) {
                        this.visible = true;
                        this.arbiterInform("platform/plugins/recommendations_bar/visible")
                    } else if (this.visible && !this.calculateVisibility()) {
                        this.visible = false;
                        this.arbiterInform("platform/plugins/recommendations_bar/invisible")
                    }
                    return true
                }, "bind", true, this));
                h.add(window, "scroll", u);
                h.add(window, "resize", u);
                u();
                this.focused = true;
                var v = ES5(function () {
                    this.focused = !this.focused;
                    return true
                }, "bind", true, this);
                h.add(window, "blur", v);
                h.add(window, "focus", v);
                this.resize_running =
                    false;
                this.animate = false;
                this.subscribe("xd.signal_animation", ES5(function () {
                    this.animate = true
                }, "bind", true, this));
                return true
            }, getSize: function () {
                return{height: 25, width: this._attr.action == "recommend" ? 140 : 96}
            }, calculateVisibility: function () {
                var n = document.documentElement.clientHeight;
                if (!this.focused && window.console && window.console.firebug)return this.visible;
                switch (this._attr.trigger) {
                    case "manual":
                        return false;
                    case "onvisible":
                        var o = this.dom.getBoundingClientRect().top;
                        return o <= n;
                    default:
                        var p =
                            window.pageYOffset || document.body.scrollTop, q = document.documentElement.scrollHeight;
                        return(p + n) / q >= this._attr.trigger
                }
            }});
            e.exports = m
        }, null);
        __d("sdk.XFBML.Registration", ["sdk.Auth", "sdk.Helper", "sdk.XFBML.IframeWidget", "sdk.Runtime", "UrlMap"], function (a, b, c, d, e, f, g, h, i, j, k) {
            var l = i.extend({_visibleAfter: "immediate", _baseHeight: 167, _fieldHeight: 28, _skinnyWidth: 520, _skinnyBaseHeight: 173, _skinnyFieldHeight: 52, setupAndValidate: function () {
                this._attr = {action: this.getAttribute("action"), border_color: this.getAttribute("border-color"),
                    channel_url: this.getChannelUrl(), client_id: j.getClientID(), fb_only: this._getBoolAttribute("fb-only", false), fb_register: this._getBoolAttribute("fb-register", false), fields: this.getAttribute("fields"), height: this._getPxAttribute("height"), redirect_uri: this.getAttribute("redirect-uri", window.location.href), no_footer: this._getBoolAttribute("no-footer"), no_header: this._getBoolAttribute("no-header"), onvalidate: this.getAttribute("onvalidate"), width: this._getPxAttribute("width", 600), target: this.getAttribute("target")};
                if (this._attr.onvalidate)this.subscribe("xd.validate", ES5(function (m) {
                    var n = ES5("JSON", "parse", false, m.value), o = ES5(function (q) {
                        this.arbiterInform("Registration.Validation", {errors: q, id: m.id})
                    }, "bind", true, this), p = h.executeFunctionByName(this._attr.onvalidate, n, o);
                    if (p)o(p)
                }, "bind", true, this));
                this.subscribe("xd.authLogin", ES5(this._onAuthLogin, "bind", true, this));
                this.subscribe("xd.authLogout", ES5(this._onAuthLogout, "bind", true, this));
                return true
            }, getSize: function () {
                return{width: this._attr.width,
                    height: this._getHeight()}
            }, _getHeight: function () {
                if (this._attr.height)return this._attr.height;
                var m;
                if (!this._attr.fields)m = ["name"]; else try {
                    m = ES5("JSON", "parse", false, this._attr.fields)
                } catch (n) {
                    m = this._attr.fields.split(/,/)
                }
                if (this._attr.width < this._skinnyWidth)return this._skinnyBaseHeight + m.length * this._skinnyFieldHeight; else return this._baseHeight + m.length * this._fieldHeight
            }, getUrlBits: function () {
                return{name: "registration", params: this._attr}
            }, getDefaultWebDomain: function () {
                return k.resolve("www",
                    true)
            }, _onAuthLogin: function () {
                if (!g.getAuthResponse())g.getLoginStatus();
                h.fireEvent("auth.login", this)
            }, _onAuthLogout: function () {
                if (!g.getAuthResponse())g.getLoginStatus();
                h.fireEvent("auth.logout", this)
            }});
            e.exports = l
        }, null);
        __d("sdk.XFBML.SocialContext", ["sdk.Event", "sdk.XFBML.IframeWidget"], function (a, b, c, d, e, f, g, h) {
            var i = h.extend({setupAndValidate: function () {
                var j = this.getAttribute("size", "small");
                this._attr = {channel: this.getChannelUrl(), width: this._getPxAttribute("width", 400), height: this._getPxAttribute("height",
                    100), ref: this.getAttribute("ref"), size: this.getAttribute("size"), keywords: this.getAttribute("keywords"), urls: this.getAttribute("urls"), object_id: this.getAttribute("object_id")};
                this.subscribe("xd.social_context_stats", ES5(this._bubbleSocialContextStats, "bind", true, this));
                return true
            }, _bubbleSocialContextStats: function (j) {
                var k = {pluginID: this.getAttribute("plugin-id"), socialContextPageIDs: ES5("JSON", "parse", false, j.social_context_page_ids)};
                g.fire("xfbml.social_context_stats", k)
            }, getSize: function () {
                return{width: this._attr.width,
                    height: this._attr.height}
            }, getUrlBits: function () {
                return{name: "social_context", params: this._attr}
            }});
            e.exports = i
        }, null);
        __d("legacy:fb.xfbml", ["Assert", "sdk.domReady", "sdk.Event", "FB", "IframePlugin", "PluginTags", "wrapFunction", "XFBML", "sdk.XFBML.Comments", "sdk.XFBML.CommentsCount", "sdk.XFBML.ConnectBar", "sdk.XFBML.LoginButton", "sdk.XFBML.Name", "sdk.XFBML.RecommendationsBar", "sdk.XFBML.Registration", "sdk.XFBML.SocialContext"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
            var o = {comments: b("sdk.XFBML.Comments"),
                comments_count: b("sdk.XFBML.CommentsCount"), connect_bar: b("sdk.XFBML.ConnectBar"), login_button: b("sdk.XFBML.LoginButton"), name: b("sdk.XFBML.Name"), recommendations_bar: b("sdk.XFBML.RecommendationsBar"), registration: b("sdk.XFBML.Registration"), social_context: b("sdk.XFBML.SocialContext")};
            ES5(ES5("Object", "keys", false, l), "forEach", true, function (q) {
                n.registerTag({xmlns: "fb", localName: q.replace(/_/g, "-"), ctor: k.withParams(l[q])})
            });
            ES5(ES5("Object", "keys", false, o), "forEach", true, function (q) {
                n.registerTag({xmlns: "fb",
                    localName: q.replace(/_/g, "-"), ctor: o[q]})
            });
            j.provide("XFBML", {parse: function (q) {
                g.maybeXfbml(q, "Invalid argument");
                if (q && q.nodeType === 9)q = q.body;
                return n.parse.apply(null, arguments)
            }});
            n.subscribe("parse", ES5(i.fire, "bind", true, i, "xfbml.parse"));
            n.subscribe("render", ES5(i.fire, "bind", true, i, "xfbml.render"));
            i.subscribe("init:post", function (q) {
                if (q.xfbml)setTimeout(m(ES5(h, "bind", true, null, n.parse), "entry", "init:post:xfbml.parse"), 0)
            });
            g.define("Xfbml", function (q) {
                return(q.nodeType === 1 || q.nodeType ===
                    9) && typeof q.nodeName === "string"
            });
            try {
                if (document.namespaces && !document.namespaces.item.fb)document.namespaces.add("fb")
            } catch (p) {
            }
        }, 3);
        __d("legacy:fb.versioned-sdk", ["sdk.Runtime"], function (a, b, c, d, e, f, g) {
            g.setIsVersioned(true)
        }, 3)
    }.call({}, window.inDapIF ? parent.window : window)
} catch (e) {
    (new Image).src = "http://www.facebook.com/" + "common/scribe_endpoint.php?c\x3djssdk_error\x26m\x3d" + encodeURIComponent('{"error":"LOAD", "extra": {"name":"' + e.name + '","line":"' + (e.lineNumber || e.line) + '","script":"' +
        (e.fileName || e.sourceURL || e.script) + '","stack":"' + (e.stackTrace || e.stack) + '","revision":"1272844","message":"' + e.message + '"}}')
}
;
plugin.extend("facebook", {name: "", version: "", loggedIn: false, userInfo: null, HttpMethod: {"Get": "get", "Post": "post", "Delete": "delete"}, ctor: function (config) {
    this.name = "facebook";
    this.version = "2.0";
    this.userInfo = {};
    if (!FB)return;
    var self = this;
    FB.init({appId: config["appId"], xfbml: config["xfbml"], version: config["version"]});
    FB.getLoginStatus(function (response) {
        if (response && response.status === "connected") {
            self._isLogined = true;
            self.userInfo = response.authResponse
        } else self._isLogined = false
    });
    plugin.FacebookAgent =
        this
}, getInstance: function () {
    return this
}, login: function (callback) {
    var self = this;
    FB.login(function (response) {
        if (response.authResponse) {
            self.userInfo = response.authResponse;
            typeof callback === "function" && callback(0)
        } else typeof callback === "function" && callback(1)
    }, {scope: ""})
}, isLogedIn: function (callback) {
    return this.isLoggedIn(callback)
}, isLoggedIn: function (callback) {
    var self = this;
    FB.getLoginStatus(function (response) {
        if (response && response.status === "connected") {
            self.userInfo = response.authResponse;
            typeof callback ===
            "function" && callback(0, "logged")
        } else typeof callback === "function" && callback(1)
    })
}, logout: function (callback) {
    var self = this;
    FB.logout(function (response) {
        if (response.authResponse) {
            self.userInfo = {};
            typeof callback === "function" && callback(0)
        } else typeof callback === "function" && callback(1)
    })
}, requestPermissions: function (permissions, callback) {
    var permissionsStr = permissions.join(",");
    var self = this;
    FB.login(function (response) {
        if (response.authResponse) {
            self.userInfo = response.authResponse;
            typeof callback === "function" &&
            callback(0)
        } else typeof callback === "function" && callback(1)
    }, {scope: permissionsStr})
}, requestAccessToken: function (callback) {
    if (typeof callback !== "function")return;
    if (this.userInfo.accessToken)callback(0, this.userInfo.accessToken); else {
        var self = this;
        FB.getLoginStatus(function (response) {
            if (response && response.status === "connected") {
                self.userInfo = response.authResponse;
                callback(0, response.authResponse.accessToken)
            } else callback(1, undefined)
        })
    }
}, share: function (info, callback) {
    FB.ui({method: "share", name: info["title"],
        caption: info["caption"], description: info["text"], href: info["link"], picture: info["imageUrl"]}, function (response) {
        if (response)if (response.post_id)typeof callback === "function" && callback(0); else typeof callback === "function" && callback(3); else typeof callback === "function" && callback(4)
    })
}, dialog: function (info, callback) {
    if (!info)return;
    info["method"] = info["dialog"] == "share_open_graph" ? "share_open_graph" : "share";
    delete info["dialog"];
    info["name"] = info["site"] || info["name"];
    delete info["site"];
    delete info["name"];
    info["href"] = info["siteUrl"] || info["link"];
    delete info["siteUrl"];
    delete info["link"];
    info["picture"] = info["imageUrl"] || info["imagePath"] || info["photo"] || info["picture"] || info["image"];
    delete info["imageUrl"];
    delete info["imagePath"];
    delete info["photo"];
    delete info["image"];
    info["caption"] = info["title"] || info["caption"];
    delete info["title"];
    info["description"] = info["text"] || info["description"];
    delete info["text"];
    delete info["description"];
    if (info["method"] == "share_open_graph" && info["url"])if (info["url"])info["action_properties"] =
        JSON.stringify({object: info["url"]}); else return; else if (!info["href"])return;
    if (info["method"] != "share_open_graph" && info["method"] != "share_link") {
        cc.log("web is not supported what this it method");
        return
    }
    FB.ui(info, function (response) {
        if (response)if (response.post_id)typeof callback === "function" && callback(0); else typeof callback === "function" && callback(response.error_code, response.error_message); else typeof callback === "function" && callback(1)
    })
}, request: function (path, httpmethod, params, callback) {
    FB.api(path,
        httpmethod, params, function (response) {
            if (response.error)callback(response.error.code, "{}"); else callback(0, JSON.stringify(response))
        })
}, destroyInstance: function () {
    void 69
}});
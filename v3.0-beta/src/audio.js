if (cc.sys._supportWebAudio) {
    var _ctx = cc.webAudioContext = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
    cc.WebAudio = cc.Class.extend({_events: null, _buffer: null, _sourceNode: null, _volumeNode: null, src: null, preload: null, autoplay: null, controls: null, mediagroup: null, currentTime: 0, startTime: 0, duration: 0, _loop: null, _volume: 1, _pauseTime: 0, _paused: false, _stopped: true, _loadState: -1, ctor: function (src) {
        var self = this;
        self._events = {};
        self.src = src;
        if (_ctx["createGain"])self._volumeNode =
            _ctx["createGain"](); else self._volumeNode = _ctx["createGainNode"]();
        self._onSuccess1 = self._onSuccess.bind(this);
        self._onError1 = self._onError.bind(this)
    }, _play: function (offset) {
        var self = this;
        var sourceNode = self._sourceNode = _ctx["createBufferSource"]();
        var volumeNode = self._volumeNode;
        offset = offset || 0;
        sourceNode.buffer = self._buffer;
        volumeNode["gain"].value = self._volume;
        sourceNode["connect"](volumeNode);
        volumeNode["connect"](_ctx["destination"]);
        sourceNode.loop = self._loop;
        self._paused = false;
        self._stopped =
            false;
        if (sourceNode.start)sourceNode.start(0, offset); else if (sourceNode["noteGrainOn"]) {
            var duration = sourceNode.buffer.duration;
            if (self.loop)sourceNode["noteGrainOn"](0, offset, duration); else sourceNode["noteGrainOn"](0, offset, duration - offset)
        } else sourceNode["noteOn"](0);
        self._pauseTime = 0
    }, _stop: function () {
        var self = this, sourceNode = self._sourceNode;
        if (self._stopped)return;
        if (sourceNode.stop)sourceNode.stop(0); else sourceNode.noteOff(0);
        self._stopped = true
    }, play: function () {
        var self = this;
        if (self._loadState == -1) {
            self._loadState = 0;
            return
        } else if (self._loadState != 1)return;
        var sourceNode = self._sourceNode;
        if (!self._stopped && sourceNode && sourceNode["playbackState"] == 2)return;
        self.startTime = _ctx.currentTime;
        this._play(0)
    }, pause: function () {
        this._pauseTime = _ctx.currentTime;
        this._paused = true;
        this._stop()
    }, resume: function () {
        var self = this;
        if (self._paused) {
            var offset = self._buffer ? (self._pauseTime - self.startTime) % self._buffer.duration : 0;
            this._play(offset)
        }
    }, stop: function () {
        this._pauseTime = 0;
        this._paused = false;
        this._stop()
    },
        load: function () {
            var self = this;
            if (self._loadState == 1)return;
            self._loadState = -1;
            self.played = false;
            self.ended = true;
            var request = new XMLHttpRequest;
            request.open("GET", self.src, true);
            request.responseType = "arraybuffer";
            request.onload = function () {
                _ctx["decodeAudioData"](request.response, self._onSuccess1, self._onError1)
            };
            request.send()
        }, addEventListener: function (eventName, event) {
            this._events[eventName] = event.bind(this)
        }, removeEventListener: function (eventName) {
            delete this._events[eventName]
        }, canplay: function () {
            return cc.sys._supportWebAudio
        },
        _onSuccess: function (buffer) {
            var self = this;
            self._buffer = buffer;
            var success = self._events["success"], canplaythrough = self._events["canplaythrough"];
            if (success)success();
            if (canplaythrough)canplaythrough();
            if (self._loadState == 0 || self.autoplay == "autoplay" || self.autoplay == true)self._play();
            self._loadState = 1
        }, _onError: function () {
            var error = this._events["error"];
            if (error)error();
            this._loadState = -2
        }, cloneNode: function () {
            var self = this, obj = new cc.WebAudio(self.src);
            obj.volume = self.volume;
            obj._loadState = self._loadState;
            obj._buffer = self._buffer;
            if (obj._loadState == 0 || obj._loadState == -1)obj.load();
            return obj
        }});
    var _p = cc.WebAudio.prototype;
    _p.loop;
    cc.defineGetterSetter(_p, "loop", function () {
        return this._loop
    }, function (loop) {
        this._loop = loop;
        if (this._sourceNode)this._sourceNode.loop = loop
    });
    _p.volume;
    cc.defineGetterSetter(_p, "volume", function () {
        return this._volume
    }, function (volume) {
        this._volume = volume;
        this._volumeNode["gain"].value = volume
    });
    _p.ended;
    cc.defineGetterSetter(_p, "paused", function () {
        return this._paused
    });
    _p.ended;
    cc.defineGetterSetter(_p, "ended", function () {
        var sourceNode = this._sourceNode;
        return!this._paused && (this._stopped || !sourceNode || sourceNode["playbackState"] == 3)
    });
    _p.played;
    cc.defineGetterSetter(_p, "played", function () {
        var sourceNode = this._sourceNode;
        return sourceNode && sourceNode["playbackState"] == 2
    })
}
cc.AudioEngine = cc.Class.extend({_soundSupported: false, _currMusic: null, _currMusicPath: null, _musicPlayState: 0, _audioID: 0, _effects: {}, _audioPool: {}, _effectsVolume: 1, _maxAudioInstance: 5, _effectPauseCb: null, _playings: [], ctor: function () {
    var self = this;
    self._soundSupported = cc._audioLoader._supportedAudioTypes.length > 0;
    if (self._effectPauseCb)self._effectPauseCb = self._effectPauseCb.bind(self)
}, willPlayMusic: function () {
    return false
}, getEffectsVolume: function () {
    return this._effectsVolume
}, playMusic: function (url, loop) {
    var self = this;
    if (!self._soundSupported)return;
    var audio = self._currMusic;
    if (audio)this._stopAudio(audio);
    if (url != self._currMusicPath) {
        audio = self._getAudioByUrl(url);
        self._currMusic = audio;
        self._currMusicPath = url
    }
    if (!audio)return;
    audio.loop = loop || false;
    self._playMusic(audio)
}, _getAudioByUrl: function (url) {
    var locLoader = cc.loader, audio = locLoader.getRes(url);
    if (!audio) {
        locLoader.load(url);
        audio = locLoader.getRes(url)
    }
    return audio
}, _playMusic: function (audio) {
    if (!audio.ended)if (audio.stop)audio.stop();
    else {
        audio.pause();
        audio.duration && (audio.currentTime = audio.duration)
    }
    this._musicPlayState = 2;
    audio.play()
}, stopMusic: function (releaseData) {
    if (this._musicPlayState > 0) {
        var audio = this._currMusic;
        if (!audio)return;
        if (!this._stopAudio(audio))return;
        if (releaseData)cc.loader.release(this._currMusicPath);
        this._currMusic = null;
        this._currMusicPath = null;
        this._musicPlayState = 0
    }
}, _stopAudio: function (audio) {
    if (audio && !audio.ended) {
        if (audio.stop)audio.stop(); else {
            audio.pause();
            audio.duration && (audio.currentTime = audio.duration)
        }
        return true
    }
    return false
},
    pauseMusic: function () {
        if (this._musicPlayState == 2) {
            this._currMusic.pause();
            this._musicPlayState = 1
        }
    }, resumeMusic: function () {
        if (this._musicPlayState == 1) {
            var audio = this._currMusic;
            this._resumeAudio(audio);
            this._musicPlayState = 2
        }
    }, _resumeAudio: function (audio) {
        if (audio && !audio.ended)if (audio.resume)audio.resume(); else audio.play()
    }, rewindMusic: function () {
        if (this._currMusic)this._playMusic(this._currMusic)
    }, getMusicVolume: function () {
        return this._musicPlayState == 0 ? 0 : this._currMusic.volume
    }, setMusicVolume: function (volume) {
        if (this._musicPlayState >
            0)this._currMusic.volume = Math.min(Math.max(volume, 0), 1)
    }, isMusicPlaying: function () {
        return this._musicPlayState == 2 && this._currMusic && !this._currMusic.ended
    }, _getEffectList: function (url) {
        var list = this._audioPool[url];
        if (!list)list = this._audioPool[url] = [];
        return list
    }, _getEffect: function (url) {
        var self = this, audio;
        if (!self._soundSupported)return null;
        var effList = this._getEffectList(url);
        for (var i = 0, li = effList.length; i < li; i++) {
            var eff = effList[i];
            if (eff.ended) {
                audio = eff;
                audio.currentTime = 0;
                if (window.chrome)audio.load();
                break
            }
        }
        if (!audio) {
            if (effList.length >= this._maxAudioInstance) {
                cc.log("Error: " + url + " greater than " + this._maxAudioInstance);
                return null
            }
            audio = self._getAudioByUrl(url);
            if (!audio)return null;
            audio = audio.cloneNode(true);
            if (self._effectPauseCb)cc._addEventListener(audio, "pause", self._effectPauseCb);
            audio.volume = this._effectsVolume;
            effList.push(audio)
        }
        return audio
    }, playEffect: function (url, loop) {
        var audio = this._getEffect(url);
        if (!audio)return null;
        audio.loop = loop || false;
        audio.play();
        var audioId = this._audioID++;
        this._effects[audioId] = audio;
        return audioId
    }, setEffectsVolume: function (volume) {
        volume = this._effectsVolume = Math.min(Math.max(volume, 0), 1);
        var effects = this._effects;
        for (var key in effects)effects[key].volume = volume
    }, pauseEffect: function (audioID) {
        var audio = this._effects[audioID];
        if (audio && !audio.ended)audio.pause()
    }, pauseAllEffects: function () {
        var effects = this._effects;
        for (var key in effects) {
            var eff = effects[key];
            if (!eff.ended)eff.pause()
        }
    }, resumeEffect: function (effectId) {
        this._resumeAudio(this._effects[effectId])
    },
    resumeAllEffects: function () {
        var effects = this._effects;
        for (var key in effects)this._resumeAudio(effects[key])
    }, stopEffect: function (effectId) {
        this._stopAudio(this._effects[effectId]);
        delete this._effects[effectId]
    }, stopAllEffects: function () {
        var effects = this._effects;
        for (var key in effects) {
            this._stopAudio(effects[key]);
            delete effects[key]
        }
    }, unloadEffect: function (url) {
        var locLoader = cc.loader, locEffects = this._effects, effectList = this._getEffectList(url);
        locLoader.release(url);
        if (effectList.length == 0)return;
        var realUrl = effectList[0].src;
        delete this._audioPool[url];
        for (var key in locEffects)if (locEffects[key].src == realUrl) {
            this._stopAudio(locEffects[key]);
            delete locEffects[key]
        }
    }, end: function () {
        this.stopMusic();
        this.stopAllEffects()
    }, _pausePlaying: function () {
        var self = this, effects = self._effects, eff;
        for (var key in effects) {
            eff = effects[key];
            if (eff && !eff.ended && !eff.paused) {
                self._playings.push(eff);
                eff.pause()
            }
        }
        if (self.isMusicPlaying()) {
            self._playings.push(self._currMusic);
            self._currMusic.pause()
        }
    }, _resumePlaying: function () {
        var self =
            this, playings = this._playings;
        for (var i = 0, li = playings.length; i < li; i++)self._resumeAudio(playings[i]);
        playings.length = 0
    }});
if (!cc.sys._supportWebAudio && cc.sys._supportMultipleAudio < 0)cc.AudioEngineForSingle = cc.AudioEngine.extend({_waitingEffIds: [], _pausedEffIds: [], _currEffect: null, _maxAudioInstance: 2, _effectCache4Single: {}, _needToResumeMusic: false, _expendTime4Music: 0, _isHiddenMode: false, _playMusic: function (audio) {
    this._stopAllEffects();
    this._super(audio)
}, resumeMusic: function () {
    var self = this;
    if (self._musicPlayState == 1) {
        self._stopAllEffects();
        self._needToResumeMusic = false;
        self._expendTime4Music = 0;
        self._super()
    }
}, playEffect: function (url, loop) {
    var self = this, currEffect = self._currEffect;
    var audio = loop ? self._getEffect(url) : self._getSingleEffect(url);
    if (!audio)return null;
    audio.loop = loop || false;
    var audioId = self._audioID++;
    self._effects[audioId] = audio;
    if (self.isMusicPlaying()) {
        self.pauseMusic();
        self._needToResumeMusic = true
    }
    if (currEffect) {
        if (currEffect != audio)self._waitingEffIds.push(self._currEffectId);
        self._waitingEffIds.push(audioId);
        currEffect.pause()
    } else {
        self._currEffect = audio;
        self._currEffectId = audioId;
        audio.play()
    }
    return audioId
},
    pauseEffect: function (effectId) {
        cc.log("pauseEffect not supported in single audio mode!")
    }, pauseAllEffects: function () {
        var self = this, waitings = self._waitingEffIds, pauseds = self._pausedEffIds, currEffect = self._currEffect;
        if (!currEffect)return;
        for (var i = 0, li = waitings.length; i < li; i++)pauseds.push(waitings[i]);
        waitings.length = 0;
        pauseds.push(self._currEffectId);
        currEffect.pause()
    }, resumeEffect: function (effectId) {
        cc.log("resumeEffect not supported in single audio mode!")
    }, resumeAllEffects: function () {
        var self =
            this, waitings = self._waitingEffIds, pauseds = self._pausedEffIds;
        if (self.isMusicPlaying()) {
            self.pauseMusic();
            self._needToResumeMusic = true
        }
        for (var i = 0, li = pauseds.length; i < li; i++)waitings.push(pauseds[i]);
        pauseds.length = 0;
        if (!self._currEffect && waitings.length >= 0) {
            var effId = waitings.pop();
            var eff = self._effects[effId];
            if (eff) {
                self._currEffectId = effId;
                self._currEffect = eff;
                self._resumeAudio(eff)
            }
        }
    }, stopEffect: function (effectId) {
        var self = this, currEffect = self._currEffect, waitings = self._waitingEffIds, pauseds =
            self._pausedEffIds;
        if (currEffect && this._currEffectId == effectId)this._stopAudio(currEffect); else {
            var index = waitings.indexOf(effectId);
            if (index >= 0)waitings.splice(index, 1); else {
                index = pauseds.indexOf(effectId);
                if (index >= 0)pauseds.splice(index, 1)
            }
        }
    }, stopAllEffects: function () {
        var self = this;
        self._stopAllEffects();
        if (!self._currEffect && self._needToResumeMusic) {
            self._resumeAudio(self._currMusic);
            self._musicPlayState = 2;
            self._needToResumeMusic = false;
            self._expendTime4Music = 0
        }
    }, unloadEffect: function (url) {
        var self =
            this, locLoader = cc.loader, locEffects = self._effects, effCache = self._effectCache4Single, effectList = self._getEffectList(url), currEffect = self._currEffect;
        locLoader.release(url);
        if (effectList.length == 0 && !effCache[url])return;
        var realUrl = effectList.length > 0 ? effectList[0].src : effCache[url].src;
        delete self._audioPool[url];
        delete effCache[url];
        for (var key in locEffects)if (locEffects[key].src == realUrl)delete locEffects[key];
        if (currEffect && currEffect.src == realUrl)self._stopAudio(currEffect)
    }, _getSingleEffect: function (url) {
        var self =
            this, audio = self._effectCache4Single[url], locLoader = cc.loader, waitings = self._waitingEffIds, pauseds = self._pausedEffIds, effects = self._effects;
        if (audio)audio.duration && (audio.currentTime = 0); else {
            audio = self._getAudioByUrl(url);
            if (!audio)return null;
            audio = audio.cloneNode(true);
            if (self._effectPauseCb)cc._addEventListener(audio, "pause", self._effectPauseCb);
            audio.volume = self._effectsVolume;
            self._effectCache4Single[url] = audio
        }
        for (var i = 0, li = waitings.length; i < li;)if (effects[waitings[i]] == audio)waitings.splice(i,
            1); else i++;
        for (var i = 0, li = pauseds.length; i < li;)if (effects[pauseds[i]] == audio)pauseds.splice(i, 1); else i++;
        audio._isToPlay = true;
        return audio
    }, _stopAllEffects: function () {
        var self = this, currEffect = self._currEffect, audioPool = self._audioPool, sglCache = self._effectCache4Single, waitings = self._waitingEffIds, pauseds = self._pausedEffIds;
        if (!currEffect && waitings.length == 0 && pauseds.length == 0)return;
        for (var key in sglCache) {
            var eff = sglCache[key];
            eff.duration && (eff.currentTime = eff.duration)
        }
        waitings.length = 0;
        pauseds.length =
            0;
        for (var key in audioPool) {
            var list = audioPool[key];
            for (var i = 0, li = list.length; i < li; i++) {
                var eff = list[i];
                eff.loop = false;
                eff.duration && (eff.currentTime = eff.duration)
            }
        }
        if (currEffect)self._stopAudio(currEffect)
    }, _effectPauseCb: function () {
        var self = this;
        if (self._isHiddenMode)return;
        var currEffect = self._getWaitingEffToPlay();
        if (currEffect)if (currEffect._isToPlay) {
            delete currEffect._isToPlay;
            currEffect.play()
        } else self._resumeAudio(currEffect); else if (self._needToResumeMusic) {
            var currMusic = self._currMusic;
            if (currMusic.duration) {
                var temp = currMusic.currentTime + self._expendTime4Music;
                temp = temp - currMusic.duration * (temp / currMusic.duration | 0);
                currMusic.currentTime = temp
            }
            self._expendTime4Music = 0;
            self._resumeAudio(currMusic);
            self._musicPlayState = 2;
            self._needToResumeMusic = false
        }
    }, _getWaitingEffToPlay: function () {
        var self = this, waitings = self._waitingEffIds, effects = self._effects, currEffect = self._currEffect;
        var expendTime = currEffect ? currEffect.currentTime - (currEffect.startTime || 0) : 0;
        self._expendTime4Music += expendTime;
        while (true) {
            if (waitings.length == 0)break;
            var effId = waitings.pop();
            var eff = effects[effId];
            if (!eff)continue;
            if (eff._isToPlay || eff.loop || eff.duration && eff.currentTime + expendTime < eff.duration) {
                self._currEffectId = effId;
                self._currEffect = eff;
                if (!eff._isToPlay && eff.duration) {
                    var temp = eff.currentTime + expendTime;
                    temp = temp - eff.duration * (temp / eff.duration | 0);
                    eff.currentTime = temp
                }
                eff._isToPlay = false;
                return eff
            } else eff.duration && (eff.currentTime = eff.duration)
        }
        self._currEffectId = null;
        self._currEffect = null;
        return null
    },
    _pausePlaying: function () {
        var self = this, currEffect = self._currEffect;
        self._isHiddenMode = true;
        var audio = self._musicPlayState == 2 ? self._currMusic : currEffect;
        if (audio) {
            self._playings.push(audio);
            audio.pause()
        }
    }, _resumePlaying: function () {
        var self = this, playings = self._playings;
        self._isHiddenMode = false;
        if (playings.length > 0) {
            self._resumeAudio(playings[0]);
            playings.length = 0
        }
    }});
cc._audioLoader = {_supportedAudioTypes: null, getBasePath: function () {
    return cc.loader.audioPath
}, _load: function (realUrl, url, res, count, tryArr, audio, cb) {
    var self = this, locLoader = cc.loader, path = cc.path;
    var types = this._supportedAudioTypes;
    var extname = "";
    if (types.length == 0)return cb("can not support audio!");
    if (count == -1) {
        extname = (path.extname(realUrl) || "").toLowerCase();
        if (!self.audioTypeSupported(extname)) {
            extname = types[0];
            count = 0
        }
    } else if (count < types.length)extname = types[count]; else return cb("can not found the resource of audio! Last match url is : " +
        realUrl);
    if (tryArr.indexOf(extname) >= 0)return self._load(realUrl, url, res, count + 1, tryArr, audio, cb);
    realUrl = path.changeExtname(realUrl, extname);
    tryArr.push(extname);
    audio = self._loadAudio(realUrl, audio, function (err) {
        if (err)return self._load(realUrl, url, res, count + 1, tryArr, audio, cb);
        cb(null, audio)
    });
    locLoader.cache[url] = audio
}, audioTypeSupported: function (type) {
    if (!type)return false;
    return this._supportedAudioTypes.indexOf(type.toLowerCase()) >= 0
}, _loadAudio: function (url, audio, cb) {
    var _Audio = location.origin ==
        "file://" ? Audio : cc.WebAudio || Audio;
    if (arguments.length == 2)cb = audio, audio = new _Audio; else if (arguments.length == 3 && !audio)audio = new _Audio;
    audio.src = url;
    audio.preload = "auto";
    var ua = navigator.userAgent;
    if (/Mobile/.test(ua) && (/iPhone OS/.test(ua) || /iPad/.test(ua) || /Firefox/.test(ua)) || /MSIE/.test(ua)) {
        audio.load();
        cb(null, audio)
    } else {
        var canplaythrough = "canplaythrough", error = "error";
        cc._addEventListener(audio, canplaythrough, function () {
            cb(null, audio);
            this.removeEventListener(canplaythrough, arguments.callee,
                false);
            this.removeEventListener(error, arguments.callee, false)
        }, false);
        cc._addEventListener(audio, error, function () {
            cb("load " + url + " failed");
            this.removeEventListener(canplaythrough, arguments.callee, false);
            this.removeEventListener(error, arguments.callee, false)
        }, false);
        audio.load()
    }
    return audio
}, load: function (realUrl, url, res, cb) {
    var tryArr = [];
    this._load(realUrl, url, res, -1, tryArr, null, cb)
}};
cc._audioLoader._supportedAudioTypes = function () {
    var au = cc.newElement("audio"), arr = [];
    if (au.canPlayType) {
        var _check = function (typeStr) {
            var result = au.canPlayType(typeStr);
            return result != "no" && result != ""
        };
        if (_check('audio/ogg; codecs\x3d"vorbis"'))arr.push(".ogg");
        if (_check("audio/mpeg"))arr.push(".mp3");
        if (_check('audio/wav; codecs\x3d"1"'))arr.push(".wav");
        if (_check("audio/mp4"))arr.push(".mp4");
        if (_check("audio/x-m4a") || _check("audio/aac"))arr.push(".m4a")
    }
    return arr
}();
cc.loader.register(["mp3", "ogg", "wav", "mp4", "m4a"], cc._audioLoader);
cc.audioEngine = cc.AudioEngineForSingle ? new cc.AudioEngineForSingle : new cc.AudioEngine;
cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
    cc.audioEngine._pausePlaying()
});
cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
    cc.audioEngine._resumePlaying()
});
if(cc.sys._supportWebAudio){var _ctx=cc.webAudioContext=new (window.AudioContext||window.webkitAudioContext||window.mozAudioContext);cc.WebAudio=cc.Class.extend({_events:null,_buffer:null,_sourceNode:null,_volumeNode:null,src:null,preload:null,autoplay:null,controls:null,mediagroup:null,currentTime:0,startTime:0,duration:0,_loop:null,_volume:1,_pauseTime:0,_paused:!1,_stopped:!0,_loadState:-1,ctor:function(a){this._events={};this.src=a;this._volumeNode=_ctx.createGain?_ctx.createGain():_ctx.createGainNode();
this._onSuccess1=this._onSuccess.bind(this);this._onError1=this._onError.bind(this)},_play:function(a){var b=this._sourceNode=_ctx.createBufferSource(),c=this._volumeNode;a=a||0;b.buffer=this._buffer;c.gain.value=this._volume;b.connect(c);c.connect(_ctx.destination);b.loop=this._loop;this._stopped=this._paused=!1;b.start?b.start(0,a):b.noteGrainOn?(c=b.buffer.duration,this.loop?b.noteGrainOn(0,a,c):b.noteGrainOn(0,a,c-a)):b.noteOn(0);this._pauseTime=0},_stop:function(){var a=this._sourceNode;this._stopped||
(a.stop?a.stop(0):a.noteOff(0),this._stopped=!0)},play:function(){if(-1==this._loadState)this._loadState=0;else if(1==this._loadState){var a=this._sourceNode;if(this._stopped||!(a&&2==a.playbackState))this.startTime=_ctx.currentTime,this._play(0)}},pause:function(){this._pauseTime=_ctx.currentTime;this._paused=!0;this._stop()},resume:function(){this._paused&&this._play(this._buffer?(this._pauseTime-this.startTime)%this._buffer.duration:0)},stop:function(){this._pauseTime=0;this._paused=!1;this._stop()},
load:function(){var a=this;if(1!=a._loadState){a._loadState=-1;a.played=!1;a.ended=!0;var b=new XMLHttpRequest;b.open("GET",a.src,!0);b.responseType="arraybuffer";b.onload=function(){_ctx.decodeAudioData(b.response,a._onSuccess1,a._onError1)};b.send()}},addEventListener:function(a,b){this._events[a]=b.bind(this)},removeEventListener:function(a){delete this._events[a]},canplay:function(){return cc.sys._supportWebAudio},_onSuccess:function(a){this._buffer=a;a=this._events.success;var b=this._events.canplaythrough;
a&&a();b&&b();(0==this._loadState||"autoplay"==this.autoplay||!0==this.autoplay)&&this._play();this._loadState=1},_onError:function(){var a=this._events.error;a&&a();this._loadState=-2},cloneNode:function(){var a=new cc.WebAudio(this.src);a.volume=this.volume;a._loadState=this._loadState;a._buffer=this._buffer;(0==a._loadState||-1==a._loadState)&&a.load();return a}});var _p=cc.WebAudio.prototype;cc.defineGetterSetter(_p,"loop",function(){return this._loop},function(a){this._loop=a;this._sourceNode&&
(this._sourceNode.loop=a)});cc.defineGetterSetter(_p,"volume",function(){return this._volume},function(a){this._volume=a;this._volumeNode.gain.value=a});cc.defineGetterSetter(_p,"paused",function(){return this._paused});cc.defineGetterSetter(_p,"ended",function(){var a=this._sourceNode;return!this._paused&&(this._stopped||!a||3==a.playbackState)});cc.defineGetterSetter(_p,"played",function(){var a=this._sourceNode;return a&&2==a.playbackState})}
cc.AudioEngine=cc.Class.extend({_soundSupported:!1,_currMusic:null,_currMusicPath:null,_musicPlayState:0,_audioID:0,_effects:{},_audioPool:{},_effectsVolume:1,_maxAudioInstance:5,_effectPauseCb:null,_playings:[],ctor:function(){this._soundSupported=0<cc._audioLoader._supportedAudioTypes.length;this._effectPauseCb&&(this._effectPauseCb=this._effectPauseCb.bind(this))},willPlayMusic:function(){return!1},getEffectsVolume:function(){return this._effectsVolume},playMusic:function(a,b){if(this._soundSupported){var c=
this._currMusic;c&&this._stopAudio(c);a!=this._currMusicPath&&(this._currMusic=c=this._getAudioByUrl(a),this._currMusicPath=a);c&&(c.loop=b||!1,this._playMusic(c))}},_getAudioByUrl:function(a){var b=cc.loader,c=b.getRes(a);c||(b.load(a),c=b.getRes(a));return c},_playMusic:function(a){a.ended||(a.stop?a.stop():(a.pause(),a.currentTime=0));this._musicPlayState=2;a.play()},stopMusic:function(a){if(0<this._musicPlayState){var b=this._currMusic;b&&this._stopAudio(b)&&(a&&cc.loader.release(this._currMusicPath),
this._currMusicPath=this._currMusic=null,this._musicPlayState=0)}},_stopAudio:function(a){return a&&!a.ended?(a.stop?a.stop():a.duration&&Infinity!=a.duration?a.currentTime=a.duration:a.pause(),!0):!1},pauseMusic:function(){2==this._musicPlayState&&(this._currMusic.pause(),this._musicPlayState=1)},resumeMusic:function(){1==this._musicPlayState&&(this._resumeAudio(this._currMusic),this._musicPlayState=2)},_resumeAudio:function(a){a&&!a.ended&&(a.resume?a.resume():a.play())},rewindMusic:function(){this._currMusic&&
this._playMusic(this._currMusic)},getMusicVolume:function(){return 0==this._musicPlayState?0:this._currMusic.volume},setMusicVolume:function(a){0<this._musicPlayState&&(this._currMusic.volume=Math.min(Math.max(a,0),1))},isMusicPlaying:function(){return 2==this._musicPlayState&&this._currMusic&&!this._currMusic.ended},_getEffectList:function(a){var b=this._audioPool[a];b||(b=this._audioPool[a]=[]);return b},_getEffect:function(a){var b;if(!this._soundSupported)return null;for(var c=this._getEffectList(a),
d=0,e=c.length;d<e;d++){var f=c[d];if(f.ended){b=f;b.currentTime=0;window.chrome&&b.load();break}}if(!b){if(c.length>=this._maxAudioInstance)return cc.log("Error: "+a+" greater than "+this._maxAudioInstance),null;b=this._getAudioByUrl(a);if(!b)return null;b=b.cloneNode(!0);this._effectPauseCb&&cc._addEventListener(b,"pause",this._effectPauseCb);b.volume=this._effectsVolume;c.push(b)}return b},playEffect:function(a,b){var c=this._getEffect(a);if(!c)return null;c.loop=b||!1;c.play();var d=this._audioID++;
this._effects[d]=c;return d},setEffectsVolume:function(a){a=this._effectsVolume=Math.min(Math.max(a,0),1);var b=this._effects,c;for(c in b)b[c].volume=a},pauseEffect:function(a){(a=this._effects[a])&&!a.ended&&a.pause()},pauseAllEffects:function(){var a=this._effects,b;for(b in a){var c=a[b];c.ended||c.pause()}},resumeEffect:function(a){this._resumeAudio(this._effects[a])},resumeAllEffects:function(){var a=this._effects,b;for(b in a)this._resumeAudio(a[b])},stopEffect:function(a){this._stopAudio(this._effects[a]);
delete this._effects[a]},stopAllEffects:function(){var a=this._effects,b;for(b in a)this._stopAudio(a[b]),delete a[b]},unloadEffect:function(a){var b=cc.loader,c=this._effects,d=this._getEffectList(a);b.release(a);if(0!=d.length){b=d[0].src;delete this._audioPool[a];for(var e in c)c[e].src==b&&(this._stopAudio(c[e]),delete c[e])}},end:function(){this.stopMusic();this.stopAllEffects()},_pausePlaying:function(){var a=this._effects,b,c;for(c in a)if((b=a[c])&&!b.ended&&!b.paused)this._playings.push(b),
b.pause();this.isMusicPlaying()&&(this._playings.push(this._currMusic),this._currMusic.pause())},_resumePlaying:function(){for(var a=this._playings,b=0,c=a.length;b<c;b++)this._resumeAudio(a[b]);a.length=0}});
!cc.sys._supportWebAudio&&0>cc.sys._supportMultipleAudio&&(cc.AudioEngineForSingle=cc.AudioEngine.extend({_waitingEffIds:[],_pausedEffIds:[],_currEffect:null,_maxAudioInstance:2,_effectCache4Single:{},_needToResumeMusic:!1,_expendTime4Music:0,_isHiddenMode:!1,_playMusic:function(a){this._stopAllEffects();this._super(a)},resumeMusic:function(){1==this._musicPlayState&&(this._stopAllEffects(),this._needToResumeMusic=!1,this._expendTime4Music=0,this._super())},playEffect:function(a,b){var c=this._currEffect,
d=b?this._getEffect(a):this._getSingleEffect(a);if(!d)return null;d.loop=b||!1;var e=this._audioID++;this._effects[e]=d;this.isMusicPlaying()&&(this.pauseMusic(),this._needToResumeMusic=!0);c?(c!=d&&this._waitingEffIds.push(this._currEffectId),this._waitingEffIds.push(e),c.pause()):(this._currEffect=d,this._currEffectId=e,d.play());return e},pauseEffect:function(a){cc.log("pauseEffect not supported in single audio mode!")},pauseAllEffects:function(){var a=this._waitingEffIds,b=this._pausedEffIds,
c=this._currEffect;if(c){for(var d=0,e=a.length;d<e;d++)b.push(a[d]);a.length=0;b.push(this._currEffectId);c.pause()}},resumeEffect:function(a){cc.log("resumeEffect not supported in single audio mode!")},resumeAllEffects:function(){var a=this._waitingEffIds,b=this._pausedEffIds;this.isMusicPlaying()&&(this.pauseMusic(),this._needToResumeMusic=!0);for(var c=0,d=b.length;c<d;c++)a.push(b[c]);b.length=0;if(!this._currEffect&&0<=a.length&&(a=a.pop(),b=this._effects[a]))this._currEffectId=a,this._currEffect=
b,this._resumeAudio(b)},stopEffect:function(a){var b=this._currEffect,c=this._waitingEffIds,d=this._pausedEffIds;b&&this._currEffectId==a?this._stopAudio(b):(b=c.indexOf(a),0<=b?c.splice(b,1):(b=d.indexOf(a),0<=b&&d.splice(b,1)))},stopAllEffects:function(){this._stopAllEffects();!this._currEffect&&this._needToResumeMusic&&(this._resumeAudio(this._currMusic),this._musicPlayState=2,this._needToResumeMusic=!1,this._expendTime4Music=0)},unloadEffect:function(a){var b=cc.loader,c=this._effects,d=this._effectCache4Single,
e=this._getEffectList(a),f=this._currEffect;b.release(a);if(0!=e.length||d[a]){b=0<e.length?e[0].src:d[a].src;delete this._audioPool[a];delete d[a];for(var g in c)c[g].src==b&&delete c[g];f&&f.src==b&&this._stopAudio(f)}},_getSingleEffect:function(a){var b=this._effectCache4Single[a],c=this._waitingEffIds,d=this._pausedEffIds,e=this._effects;if(b)b.currentTime=0;else{b=this._getAudioByUrl(a);if(!b)return null;b=b.cloneNode(!0);this._effectPauseCb&&cc._addEventListener(b,"pause",this._effectPauseCb);
b.volume=this._effectsVolume;this._effectCache4Single[a]=b}a=0;for(var f=c.length;a<f;)e[c[a]]==b?c.splice(a,1):a++;a=0;for(f=d.length;a<f;)e[d[a]]==b?d.splice(a,1):a++;b._isToPlay=!0;return b},_stopAllEffects:function(){var a=this._currEffect,b=this._audioPool,c=this._effectCache4Single,d=this._waitingEffIds,e=this._pausedEffIds;if(a||!(0==d.length&&0==e.length)){for(var f in c){var g=c[f];g.duration&&Infinity!=g.duration&&(g.currentTime=g.duration)}d.length=0;e.length=0;for(f in b){c=b[f];d=0;for(e=
c.length;d<e;d++)g=c[d],g.loop=!1,g.duration&&Infinity!=g.duration&&(g.currentTime=g.duration)}a&&this._stopAudio(a)}},_effectPauseCb:function(){if(!this._isHiddenMode){var a=this._getWaitingEffToPlay();if(a)a._isToPlay?(delete a._isToPlay,a.play()):this._resumeAudio(a);else if(this._needToResumeMusic){a=this._currMusic;if(a.duration&&Infinity!=a.duration){var b=a.currentTime+this._expendTime4Music,b=b-a.duration*(b/a.duration|0);a.currentTime=b}this._expendTime4Music=0;this._resumeAudio(a);this._musicPlayState=
2;this._needToResumeMusic=!1}}},_getWaitingEffToPlay:function(){var a=this._waitingEffIds,b=this._effects,c=this._currEffect,d=c?c.currentTime-(c.startTime||0):0;for(this._expendTime4Music+=d;0!=a.length;){var e=a.pop();if(c=b[e]){if(c._isToPlay||c.loop||c.duration&&c.currentTime+d<c.duration)return this._currEffectId=e,this._currEffect=c,!c._isToPlay&&(c.duration&&Infinity!=c.duration)&&(a=c.currentTime+d,a-=c.duration*(a/c.duration|0),c.currentTime=a),c._isToPlay=!1,c;c.duration&&Infinity!=c.duration&&
(c.currentTime=c.duration)}}return this._currEffect=this._currEffectId=null},_pausePlaying:function(){var a=this._currEffect;this._isHiddenMode=!0;if(a=2==this._musicPlayState?this._currMusic:a)this._playings.push(a),a.pause()},_resumePlaying:function(){var a=this._playings;this._isHiddenMode=!1;0<a.length&&(this._resumeAudio(a[0]),a.length=0)}}));
cc._audioLoader={_supportedAudioTypes:null,getBasePath:function(){return cc.loader.audioPath},_load:function(a,b,c,d,e,f,g){var l=this,n=cc.loader,m=cc.path,k=this._supportedAudioTypes,h="";if(0==k.length)return g("can not support audio!");if(-1==d)h=(m.extname(a)||"").toLowerCase(),l.audioTypeSupported(h)||(h=k[0],d=0);else if(d<k.length)h=k[d];else return g("can not found the resource of audio! Last match url is : "+a);if(0<=e.indexOf(h))return l._load(a,b,c,d+1,e,f,g);a=m.changeExtname(a,h);e.push(h);
f=l._loadAudio(a,f,function(h){if(h)return l._load(a,b,c,d+1,e,f,g);g(null,f)},d==k.length-1);n.cache[b]=f},audioTypeSupported:function(a){return!a?!1:0<=this._supportedAudioTypes.indexOf(a.toLowerCase())},_loadAudio:function(a,b,c,d){var e="file://"==location.origin?Audio:cc.WebAudio||Audio;2==arguments.length?(c=b,b=new e):3<arguments.length&&!b&&(b=new e);b.src=a;b.preload="auto";e=navigator.userAgent;/Mobile/.test(e)&&(/iPhone OS/.test(e)||/iPad/.test(e)||/Firefox/.test(e))||/MSIE/.test(e)?(b.load(),
c(null,b)):(cc._addEventListener(b,"canplaythrough",function(){c(null,b);this.removeEventListener("canplaythrough",arguments.callee,!1);this.removeEventListener("error",arguments.callee,!1)},!1),cc._addEventListener(b,"error",function(){c("load "+a+" failed");d&&(this.removeEventListener("canplaythrough",arguments.callee,!1),this.removeEventListener("error",arguments.callee,!1))},!1),b.load());return b},load:function(a,b,c,d){this._load(a,b,c,-1,[],null,d)}};
cc._audioLoader._supportedAudioTypes=function(){var a=cc.newElement("audio"),b=[];if(a.canPlayType){var c=function(b){b=a.canPlayType(b);return"no"!=b&&""!=b};c('audio/ogg; codecs\x3d"vorbis"')&&b.push(".ogg");c("audio/mpeg")&&b.push(".mp3");c('audio/wav; codecs\x3d"1"')&&b.push(".wav");c("audio/mp4")&&b.push(".mp4");(c("audio/x-m4a")||c("audio/aac"))&&b.push(".m4a")}return b}();cc.loader.register(["mp3","ogg","wav","mp4","m4a"],cc._audioLoader);
cc.audioEngine=cc.AudioEngineForSingle?new cc.AudioEngineForSingle:new cc.AudioEngine;cc.eventManager.addCustomListener(cc.game.EVENT_HIDE,function(){cc.audioEngine._pausePlaying()});cc.eventManager.addCustomListener(cc.game.EVENT_SHOW,function(){cc.audioEngine._resumePlaying()});
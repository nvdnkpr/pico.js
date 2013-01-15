(function(){"use strict";var e=null;if(typeof webkitAudioContext!=="undefined"){e=function(e){var t=new webkitAudioContext;var i,s;this.maxSamplerate=t.sampleRate;this.defaultSamplerate=t.sampleRate;this.env="webkit";var a=navigator.userAgent;if(a.match(/linux/i)||a.match(/win(dows)?\s*(nt5\.1|xp)/i)){e.streammsec*=8}this.play=function(){var a;var n=e.getAdjustSamples(t.sampleRate);var r;var l,o;if(e.samplerate===t.sampleRate){a=function(t){var i=e.strmL,s=e.strmR,a=t.outputBuffer.getChannelData(0),n=t.outputBuffer.getChannelData(1),r=a.length;e.process();while(r--){a[r]=i[r];n[r]=s[r]}}}else{r=e.streamsize;l=r;o=e.samplerate/t.sampleRate;a=function(t){var i=e.strmL,s=e.strmR,a=t.outputBuffer.getChannelData(0),n=t.outputBuffer.getChannelData(1),u,p=a.length;for(u=0;u<p;++u){if(l>=r){e.process();l-=r}a[u]=i[l|0];n[u]=s[l|0];l+=o}}}i=t.createBufferSource();s=t.createJavaScriptNode(n,2,e.channels);s.onaudioprocess=a;i.noteOn(0);i.connect(s);s.connect(t.destination)};this.pause=function(){i.disconnect();s.disconnect()}}}else if(typeof Audio==="function"&&typeof(new Audio).mozSetup==="function"){e=function(e){var t=function(){var e="var t=0;onmessage=function(e){if(t)t=clearInterval(t),0;if(typeof e.data=='number'&&e.data>0)t=setInterval(function(){postMessage(0);},e.data);};";var t=new Blob([e],{type:"text/javascript"});var i=URL.createObjectURL(t);return new Worker(i)}();this.maxSamplerate=48e3;this.defaultSamplerate=44100;this.env="moz";this.play=function(){var i=new Audio;var s;var a=new Float32Array(e.streamsize*e.channels);var n=e.streammsec;var r=0;var l=e.streamsize<<4;s=function(){var t=i.mozCurrentSampleOffset();if(r>t+l){return}var s=e.strmL,n=e.strmR,o=a.length,u=s.length;e.process();while(u--){a[--o]=n[u];a[--o]=s[u]}i.mozWriteAudio(a)};i.mozSetup(e.channels,e.samplerate);t.onmessage=s;t.postMessage(n)};this.pause=function(){t.postMessage(0)}}}else{e=function(e){this.maxSamplerate=48e3;this.defaultSamplerate=8e3;this.env="nop";this.play=function(){};this.pause=function(){}}}var t=[8e3,11025,12e3,16e3,22050,24e3,32e3,44100,48e3];var i=[32,64,128,256];function s(e){this.impl=null;this.isPlaying=false;this.samplerate=44100;this.channels=2;this.cellsize=128;this.streammsec=20;this.streamsize=0;this.generator=null}s.prototype.bind=function(e,t){if(typeof e==="function"){var i=new e(this,t);if(typeof i.play==="function"&&typeof i.pause==="function"){this.impl=i;if(this.impl.defaultSamplerate){this.samplerate=this.impl.defaultSamplerate}}}return this};s.prototype.setup=function(e){if(typeof e==="object"){if(t.indexOf(e.samplerate)!==-1){if(e.samplerate<=this.impl.maxSamplerate){this.samplerate=e.samplerate}else{this.samplerate=this.impl.maxSamplerate}}if(i.indexOf(e.cellsize)!==-1){this.cellsize=e.cellsize}}else if(typeof e==="string"){switch(e){case"mobile":this.samplerate=22050;this.cellsize=128;break;case"high-res":this.cellsize=32;break;case"low-res":this.cellsize=256;break}}else{}return this};s.prototype.getAdjustSamples=function(e){var t,i;e=e||this.samplerate;t=this.streammsec/1e3*e;i=Math.ceil(Math.log(t)*Math.LOG2E);i=i<8?8:i>14?14:i;return 1<<i};s.prototype.play=function(e){if(this.isPlaying||typeof e!=="object"){return this}this.isPlaying=true;this.generator=e;this.streamsize=this.getAdjustSamples();this.strmL=new Float32Array(this.streamsize);this.strmR=new Float32Array(this.streamsize);this.cellL=new Float32Array(this.cellsize);this.cellR=new Float32Array(this.cellsize);this.impl.play();return this};s.prototype.pause=function(){if(this.isPlaying){this.isPlaying=false;this.impl.pause()}return this};s.prototype.process=function(){var e=this.cellL,t=this.cellR;var i=this.strmL,s=this.strmR;var a=this.generator;var n,r=e.length;var l=0,o=this.streamsize/this.cellsize;var u;while(o--){a.process(e,t);for(n=0;n<r;++n,++l){u=e[n];i[l]=u<-1?-1:u>1?1:u;u=t[n];s[l]=u<-1?-1:u>1?1:u}}};var a=(new s).bind(e);var n={setup:function(e){a.setup(e);return this},bind:function(e,t){a.bind(e,t);return this},play:function(e){a.play(e);return this},pause:function(){a.pause();return this}};Object.defineProperties(n,{env:{get:function(){return a.impl.env}},samplerate:{get:function(){return a.samplerate}},channels:{get:function(){return a.channels}},cellsize:{get:function(){return a.cellsize}},isPlaying:{get:function(){return a.isPlaying}}});if(typeof module!=="undefined"&&module.exports){module.exports=global.pico=n}else if(typeof window!=="undefined"){if(typeof window.Float32Array==="undefined"){window.Float32Array=Array}n.noConflict=function(){var e=window.pico;return function(){if(window.pico===n){window.pico=e}return n}}();window.pico=n}})();
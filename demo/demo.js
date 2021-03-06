// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var Envelope, FMSynthBass, FMSynthLead, MMLCommands, MMLSequencer, MMLTrack, NoiseGenerator, PwmGenerator, ToneGenerator, demo, i, mmldata, sinewave,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  sinewave = new Float32Array((function() {
    var _i, _results;
    _results = [];
    for (i = _i = 0; _i < 1024; i = ++_i) {
      _results.push(Math.sin(2 * Math.PI * (i / 1024)));
    }
    return _results;
  })());

  ToneGenerator = (function() {

    function ToneGenerator() {
      this.samplerate = pico.samplerate;
      this.velocity = 0.8;
      this.cell = new Float32Array(pico.cellsize);
    }

    ToneGenerator.prototype.setVelocity = function(val) {
      return this.velocity = val / 16;
    };

    ToneGenerator.prototype.setParams = function(val) {
      var _ref;
      return (_ref = this.env) != null ? _ref.setParams(val) : void 0;
    };

    return ToneGenerator;

  })();

  FMSynthBass = (function(_super) {

    __extends(FMSynthBass, _super);

    function FMSynthBass() {
      FMSynthBass.__super__.constructor.call(this);
      this.op = [
        {
          phase: 0,
          phaseStep: 0,
          amp: 1
        }, {
          phase: 0,
          phaseStep: 0,
          amp: 1
        }
      ];
      this.fb = 0;
      this.fblv = 0.097;
    }

    FMSynthBass.prototype.setFreq = function(val) {
      this.op[0].phaseStep = (1024 * val / this.samplerate) * 0.5;
      this.op[1].phaseStep = 1024 * val / this.samplerate;
      this.op[0].amp = 0.5;
      return this.op[1].amp = 1;
    };

    FMSynthBass.prototype.process = function() {
      var amp0, amp1, cell, fb, fblv, op, phase0, phase1, phaseStep0, phaseStep1, velocity, wave, x0, x1, _i, _ref;
      cell = this.cell;
      op = this.op;
      wave = this.wave;
      fb = this.fb;
      fblv = this.fblv * 1024;
      velocity = this.velocity * 0.15;
      phase0 = op[0].phase;
      phaseStep0 = op[0].phaseStep;
      amp0 = op[0].amp;
      phase1 = op[1].phase;
      phaseStep1 = op[1].phaseStep;
      amp1 = op[1].amp;
      for (i = _i = 0, _ref = cell.length; _i < _ref; i = _i += 1) {
        x0 = fb = sinewave[(phase0 + fb * fblv) & 1023] * amp0;
        x1 = sinewave[(phase1 + x0 * 1024) & 1023] * amp1;
        cell[i] = x1 * velocity;
        phase0 += phaseStep0;
        phase1 += phaseStep1;
      }
      op[0].phase = phase0;
      op[1].phase = phase1;
      op[0].amp *= 0.995;
      this.fb = fb;
      return cell;
    };

    return FMSynthBass;

  })(ToneGenerator);

  FMSynthLead = (function(_super) {

    __extends(FMSynthLead, _super);

    function FMSynthLead() {
      FMSynthLead.__super__.constructor.call(this);
      this.op = [
        {
          phase: 0,
          phaseStep: 0,
          amp: 1
        }, {
          phase: 0,
          phaseStep: 0,
          amp: 1
        }, {
          phase: 0,
          phaseStep: 0,
          amp: 1
        }, {
          phase: 0,
          phaseStep: 0,
          amp: 1
        }
      ];
      this.fb = 0;
      this.fblv = 0.3;
      this.env = new Envelope();
      this.delay = new pico.DelayNode({
        time: 225,
        feedback: 0.35,
        wet: 0.3
      });
    }

    FMSynthLead.prototype.setFreq = function(val) {
      this.op[0].phaseStep = 1024 * val / this.samplerate;
      this.op[1].phaseStep = 1024 * val / this.samplerate;
      this.op[2].phaseStep = 1024 * val / this.samplerate;
      this.op[3].phaseStep = 1024 * val / this.samplerate;
      this.op[0].amp = 0.5;
      this.op[1].amp = 1;
      this.op[2].amp = 8;
      this.op[3].amp = 1;
      return this.env.bang();
    };

    FMSynthLead.prototype.process = function() {
      var amp0, amp1, amp2, amp3, cell, fb, fblv, op, phase0, phase1, phase2, phase3, phaseStep0, phaseStep1, phaseStep2, phaseStep3, velocity, wave, x0, x1, x2, x3, _i, _ref;
      cell = this.cell;
      op = this.op;
      wave = this.wave;
      fb = this.fb;
      fblv = this.fblv * 1024;
      velocity = this.velocity * 0.125;
      phase0 = op[0].phase;
      phaseStep0 = op[0].phaseStep;
      amp0 = op[0].amp;
      phase1 = op[1].phase;
      phaseStep1 = op[1].phaseStep;
      amp1 = op[1].amp;
      phase2 = op[2].phase;
      phaseStep2 = op[2].phaseStep;
      amp2 = op[2].amp;
      phase3 = op[3].phase;
      phaseStep3 = op[3].phaseStep;
      amp3 = op[3].amp;
      for (i = _i = 0, _ref = cell.length; _i < _ref; i = _i += 1) {
        x0 = fb = sinewave[(phase0 + fb * fblv) & 1023] * amp0;
        x1 = sinewave[(phase1 + x0 * 1024) & 1023] * amp1;
        x2 = sinewave[phase2 & 1023] * amp2;
        x3 = sinewave[(phase3 + x2 * 1024) & 1023] * amp3;
        cell[i] = (x1 + x3) * velocity;
        phase0 += phaseStep0;
        phase1 += phaseStep1;
        phase2 += phaseStep2;
        phase3 += phaseStep3;
      }
      op[0].phase = phase0;
      op[1].phase = phase1;
      op[2].phase = phase2;
      op[3].phase = phase3;
      op[0].amp *= 0.9988;
      op[2].amp *= 0.9998;
      this.fb = fb;
      this.env.process(cell);
      this.delay.process(cell, true);
      return cell;
    };

    return FMSynthLead;

  })(ToneGenerator);

  PwmGenerator = (function(_super) {

    __extends(PwmGenerator, _super);

    function PwmGenerator() {
      PwmGenerator.__super__.constructor.call(this);
      this.env = new Envelope();
      this.phase = 0;
      this.phaseStep = 0;
      this.width = 0.5;
    }

    PwmGenerator.prototype.setFreq = function(val) {
      this.phaseStep = val / this.samplerate;
      return this.env.bang();
    };

    PwmGenerator.prototype.setWidth = function(val) {
      return this.width = val * 0.01;
    };

    PwmGenerator.prototype.process = function() {
      var cell, phase, phaseStep, velocity, width, x, _i, _ref;
      cell = this.cell;
      width = this.width;
      phase = this.phase;
      phaseStep = this.phaseStep;
      velocity = this.velocity;
      for (i = _i = 0, _ref = cell.length; _i < _ref; i = _i += 1) {
        x = phase < width ? +0.1 : -0.1;
        cell[i] = x * velocity;
        phase += phaseStep;
        while (phase >= 1) {
          phase -= 1;
        }
      }
      this.phase = phase;
      this.env.process(cell);
      return cell;
    };

    return PwmGenerator;

  })(ToneGenerator);

  NoiseGenerator = (function(_super) {

    __extends(NoiseGenerator, _super);

    function NoiseGenerator() {
      NoiseGenerator.__super__.constructor.call(this);
      this.env = new Envelope();
      this.phase = 0;
      this.phaseStep = 1;
      this.value = Math.random();
    }

    NoiseGenerator.prototype.setFreq = function(val) {
      return this.env.bang();
    };

    NoiseGenerator.prototype.setNoise = function(val) {
      if (val > 0) {
        return this.phaseStep = 6 / val;
      } else {
        return this.phaseStep = 0;
      }
    };

    NoiseGenerator.prototype.process = function() {
      var cell, phase, phaseStep, value, velocity, _i, _ref;
      cell = this.cell;
      value = this.value;
      phase = this.phase;
      phaseStep = this.phaseStep;
      velocity = this.velocity;
      for (i = _i = 0, _ref = cell.length; _i < _ref; i = _i += 1) {
        cell[i] = value * 0.1;
        phase += phaseStep;
        if (phase >= 1) {
          phase -= 1;
          value = Math.random() * velocity;
        }
      }
      this.value = value;
      this.phase = phase;
      this.env.process(cell);
      return cell;
    };

    return NoiseGenerator;

  })(ToneGenerator);

  Envelope = (function() {

    function Envelope() {
      this.samplerate = pico.samplerate;
      this.a = 0;
      this.d = 64;
      this.s = 32;
      this.r = 0;
      this.samples = 0;
      this.status = 0;
      this.x = 1;
      this.dx = 0;
    }

    Envelope.prototype.setParams = function(params) {
      return this.a = params[0], this.d = params[1], this.s = params[2], this.r = params[3], params;
    };

    Envelope.prototype.bang = function() {
      this.samples = 0;
      this.status = 0;
      this.x = 1;
      return this.dx = 0;
    };

    Envelope.prototype.process = function(cell) {
      var x, _i, _ref;
      while (this.samples <= 0) {
        switch (this.status) {
          case 0:
            this.status = 1;
            this.samples = this.a * this.samplerate * 0.005;
            this.x = 0;
            this.dx = (1 / this.samples) * cell.length;
            break;
          case 1:
            this.status = 2;
            this.samples = this.d * this.samplerate * 0.005;
            this.x = 1;
            this.dx = -(1 / this.samples) * cell.length;
            if (this.s > 0) {
              this.dx *= this.s / 127;
            }
            break;
          case 2:
            this.status = 3;
            this.samples = Infinity;
            this.dx = 0;
            if (this.s === 0) {
              this.x = 0;
            }
        }
      }
      x = this.x;
      for (i = _i = 0, _ref = cell.length; _i < _ref; i = _i += 1) {
        cell[i] *= x;
      }
      this.x += this.dx;
      return this.samples -= cell.length;
    };

    return Envelope;

  })();

  MMLTrack = (function() {

    function MMLTrack(mml) {
      this.samplerate = pico.samplerate;
      this.tempo = 120;
      this.len = 4;
      this.octave = 5;
      this.tie = false;
      this.curFreq = 0;
      this.index = -1;
      this.samples = 0;
      this.loopStack = [];
      this.commands = this.compile(mml);
      this.toneGenerator = null;
    }

    MMLTrack.prototype.compile = function(mml) {
      var checked, cmd, commands, def, m, mask, re, x, _i, _len;
      commands = [];
      checked = {};
      for (_i = 0, _len = MMLCommands.length; _i < _len; _i++) {
        def = MMLCommands[_i];
        re = def.re;
        while (m = re.exec(mml)) {
          if (!checked[m.index]) {
            checked[m.index] = true;
            cmd = def.func(m);
            cmd.index = m.index;
            cmd.origin = m[0];
            commands.push(cmd);
            mask = ((function() {
              var _j, _ref, _results;
              _results = [];
              for (x = _j = 0, _ref = m[0].length; 0 <= _ref ? _j < _ref : _j > _ref; x = 0 <= _ref ? ++_j : --_j) {
                _results.push(' ');
              }
              return _results;
            })()).join('');
            mml = mml.substr(0, m.index) + mask + mml.substr(m.index + mask.length);
          }
        }
      }
      commands.sort(function(a, b) {
        return a.index - b.index;
      });
      return commands;
    };

    MMLTrack.prototype.doCommand = function(cmd) {
      var freq, len, peek, _ref, _ref1, _ref2;
      switch (cmd != null ? cmd.name : void 0) {
        case '@':
          switch (cmd.val) {
            case 3:
              return this.toneGenerator = new PwmGenerator();
            case 4:
              return this.toneGenerator = new NoiseGenerator();
            case 5:
              return this.toneGenerator = new FMSynthBass();
            case 6:
              return this.toneGenerator = new FMSynthLead();
          }
          break;
        case '@w':
          return (_ref = this.toneGenerator) != null ? typeof _ref.setWidth === "function" ? _ref.setWidth(cmd.val) : void 0 : void 0;
        case '@n':
          return (_ref1 = this.toneGenerator) != null ? typeof _ref1.setNoise === "function" ? _ref1.setNoise(cmd.val) : void 0 : void 0;
        case '@e1':
          return (_ref2 = this.toneGenerator) != null ? typeof _ref2.setParams === "function" ? _ref2.setParams(cmd.val) : void 0 : void 0;
        case 't':
          return this.tempo = cmd.val;
        case 'l':
          return this.len = cmd.val;
        case 'o':
          return this.octave = cmd.val;
        case '<':
          return this.octave += 1;
        case '>':
          return this.octave -= 1;
        case '&':
          return this.tie = true;
        case '/:':
          return this.loopStack.push({
            index: this.index,
            count: cmd.val || 2,
            exit: 0
          });
        case ':/':
          peek = this.loopStack[this.loopStack.length - 1];
          peek.exit = this.index;
          peek.count -= 1;
          if (peek.count <= 0) {
            return this.loopStack.pop();
          } else {
            return this.index = peek.index;
          }
          break;
        case '/':
          peek = this.loopStack[this.loopStack.length - 1];
          if (peek.count === 1) {
            this.loopStack.pop();
            return this.index = peek.exit;
          }
          break;
        case 'v':
          return this.toneGenerator.setVelocity(cmd.val);
        case 'note':
        case 'rest':
          len = cmd.len || this.len;
          this.samples += ((60 / this.tempo) * (4 / len) * this.samplerate) | 0;
          this.samples *= [1, 1.5, 1.75][cmd.dot] || 1;
          freq = cmd.name === 'rest' ? 0 : 440 * Math.pow(Math.pow(2, 1 / 12), cmd.tone + this.octave * 12 - 69);
          if (this.curFreq !== freq) {
            this.tie = false;
          }
          if (!this.tie) {
            this.toneGenerator.setFreq(freq);
            return this.curFreq = freq;
          } else {
            return this.tie = false;
          }
      }
    };

    MMLTrack.prototype.process = function() {
      var _ref;
      while (this.samples <= 0) {
        this.index += 1;
        if (this.index >= this.commands.length) {
          this.samples = Infinity;
        } else {
          this.doCommand(this.commands[this.index]);
        }
      }
      this.samples -= pico.cellsize;
      if (this.samples !== Infinity) {
        return (_ref = this.toneGenerator) != null ? _ref.process() : void 0;
      }
    };

    return MMLTrack;

  })();

  MMLSequencer = (function() {

    function MMLSequencer(mml) {
      this.tracks = (function() {
        var _i, _len, _ref, _results;
        _ref = mml.split(';').filter(function(x) {
          return x;
        });
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          mml = _ref[_i];
          _results.push(new MMLTrack(mml));
        }
        return _results;
      })();
      this.cell = new Float32Array(pico.cellsize);
    }

    MMLSequencer.prototype.process = function(L, R) {
      var cell, tmp, track, _i, _j, _k, _l, _len, _ref, _ref1, _ref2, _ref3;
      cell = this.cell;
      for (i = _i = 0, _ref = cell.length; _i < _ref; i = _i += 1) {
        cell[i] = 0;
      }
      _ref1 = this.tracks;
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        track = _ref1[_j];
        tmp = track.process();
        if (tmp) {
          for (i = _k = 0, _ref2 = cell.length; _k < _ref2; i = _k += 1) {
            cell[i] += tmp[i];
          }
        }
      }
      for (i = _l = 0, _ref3 = cell.length; _l < _ref3; i = _l += 1) {
        L[i] = R[i] = cell[i];
      }
      return void 0;
    };

    return MMLSequencer;

  })();

  MMLCommands = [
    {
      re: /@e1,(\d+,\d+,\d+,\d+)/g,
      func: function(m) {
        return {
          name: '@e1',
          val: m[1].split(',').map(function(x) {
            return x | 0;
          })
        };
      }
    }, {
      re: /@w(\d*)/g,
      func: function(m) {
        return {
          name: '@w',
          val: m[1] | 0
        };
      }
    }, {
      re: /@n(\d*)/g,
      func: function(m) {
        return {
          name: '@n',
          val: m[1] | 0
        };
      }
    }, {
      re: /@(\d*)/g,
      func: function(m) {
        return {
          name: '@',
          val: m[1] | 0
        };
      }
    }, {
      re: /t(\d*)/g,
      func: function(m) {
        return {
          name: 't',
          val: m[1] | 0
        };
      }
    }, {
      re: /l(\d*)/g,
      func: function(m) {
        return {
          name: 'l',
          val: m[1] | 0
        };
      }
    }, {
      re: /v(\d*)/g,
      func: function(m) {
        return {
          name: 'v',
          val: m[1] | 0
        };
      }
    }, {
      re: /o(\d*)/g,
      func: function(m) {
        return {
          name: 'o',
          val: m[1] | 0
        };
      }
    }, {
      re: /[<>]/g,
      func: function(m) {
        return {
          name: m[0]
        };
      }
    }, {
      re: /\/:(\d*)/g,
      func: function(m) {
        return {
          name: '/:',
          val: m[1] | 0
        };
      }
    }, {
      re: /:\//g,
      func: function(m) {
        return {
          name: ':/'
        };
      }
    }, {
      re: /\//g,
      func: function(m) {
        return {
          name: '/'
        };
      }
    }, {
      re: /([cdefgab])([-+]?)(\d*)(\.*)/g,
      func: function(m) {
        return {
          name: 'note',
          note: m[1],
          len: m[3] | 0,
          dot: m[4].length,
          tone: {
            c: 0,
            d: 2,
            e: 4,
            f: 5,
            g: 7,
            a: 9,
            b: 11
          }[m[1]] + ({
            '-': -1,
            '+': +1
          }[m[2]] | 0)
        };
      }
    }, {
      re: /([r])([-+]?)(\d*)(\.*)/g,
      func: function(m) {
        return {
          name: 'rest',
          note: m[1],
          len: m[3] | 0,
          dot: m[4].length
        };
      }
    }, {
      re: /&/g,
      func: function(m) {
        return {
          name: '&'
        };
      }
    }
  ];

  demo = function() {
    return new MMLSequencer(mmldata);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = demo;
  } else {
    window.demo = demo;
  }

  mmldata = 't200l8 @6 @w60 @e1,0,64,64,10 v15o4\nr4. /:2\nefga4.>a4 <c+dee4ede r1 r1 <c+>ab-gafge b-gafgefd c+defgab-<c+ ec+>b-<f>c+b-r4 >g2.ab- <c+2.ef gfefgab-<c+ ee4.f4g4\nfecd&d2&d2>a<cdc fecd&d2&d2>agfe f4.d4.f4 g4.e4.g4 a4.f4.d4 e4.g4.b-4\na1 <defgagfe g4.e4.c4 >g4.<c4.e4 fd>afda<df ec>gecg<ce >dfa<c+dfa<c+d1\n>fecd&d2&d2>a<cdc fecd&d2&d2>agfe f4.d4.f4 g4.e4.g4 a4.f4.d4 e4.g4.b-4\na1 <defgagfe g4.e4.c4 >g4.<c4.e4 fd>afda<df ec>gecg<ce >e-4.e-g4.e-16g16 b-4.g16b-16<e-2\n/\na2dfg a&a4g4fg4 <d&d4>a4gf4 e&e4f4.g4. a2dfg a&a4g4fg4 <d&d2e4d4 d2c+2\n> /:2 /:4dfa:/ e-gb-g /:4dfa:/cceg :/ > :/\n\narrar4aa;\n\nt200l8 @3@w40 v10 o5\nr4. /:2\ne1 g1 /:2d+16e16d+16e16:/</:2d+16e16d+16e16:/ > efg+fefg+a /:4r4.e&e2 / r1:/ c+c+c+c+ddee\n/:2dc>ga&a2 <a4g4f4e4:/ d4.>b-4.<d4 e4.c4.e4 f4.d4.>a4 a4.<e4.g4\nd1 >a2<d2 e1 c1 f1 e1 d1 d4c+4>b4<c+4\n/:2dc>ga&a2 <a4g4f4e4:/ d4.>b-4.<d4 e4.c4.e4 f4.d4.>a4 a4.<e4.g4\nd1 >a2<d2 e1 c1 f1 e1 b-1&b-1\n/\n>a1&a1 b-1 a1 < /:2v6ffv2fv6fv2fv6fff:/ b-b-v5b-v10b-v5b-v10b-b-b- aav5av10av5av10aec+\n> /:2 /:4fa<d>:/gb-<d+>b- /:4fa<d>:/gg<ce> :/ < :/\n\ndrrdr4dd;\n\nt200l8 @3@w40 v10 o4\nr4. /:2\na1 < c+1 > /:2g+16a16g+16a16:/ <  /:2g+16a16g+16a16:/ >ab-<c+>b-ab-<c+d >/:4r4.a&a2 / r1:/ aaaabb<c+c+\n> /:2agef&f2 <f4e4d4c4>:/ b-4.f4.b-4 <c4.>g4.<c4 d4.>a4.f4 e4.<c+4.e4\n>a1 f2a2 <c1 >g1 <d1 c1 r1 <d4c+4>b4<c+4>\n> /:2agef&f2 <f4e4d4c4>:/ b-4.f4.b-4 <c4.>g4.<c4 d4.>a4.f4 e4.<c+4.e4\n>a1 f2a2 <c1 >g1 <d1 c1 g1&g1>\n/\nf1&f1 f1 e1 < /:2v6ddv2dv6dv2dv6ddd:/ ggv5gv10gv5gv10ggg eev5ev10ev5ev10ec+>a\n/:8r1:/ :/\n\n>arrar4aa;\n\nt200l8 @5 v11o3\nr4. /:2\naaaaaa<e>a aa<e>a<g>a<f>a aa<g>a<f>a<e>a <c+>ab-<c+>b-agb- /:4a4r2<a4 / ae>a4a4<c+e >:/ >a4<a4>b4<c+4\n/:16d:/ /:16c:/ >b-b-<fb-<d>b-fb- ccg<cec>g<c >ddfa<d>afd >a<aec+>aaaa\n</:16d:/ /:16c:/ >b-b-<fb-<d>b-fb- ccg<cec>g<c >ddfa<d>afd >a<aec+>aaaa\n</:16d:/ /:16c:/ >b-b-<fb-<d>b-fb- ccg<cec>g<c >ddfa<d>afd >a<aec+>aaaa\n</:16d:/ /:16c:/ >b-b-<fb-<d>b-fb- ccg<cec>g<c >e-e-b-e-ge-b-f ge-b-e-<e->e-<g>e- >\n/\n< /:2dd<d>dga<cd >ff<f>fff<f>f b-b-<b->b-b-b-<b->b- aa<a>a / <g>a<a>a :/ <aec+>a\n/:2 drrdr4<c&d >rdfde-e-gb- drrdr4<c&d >rdfdccec :/ > :/\n\ndd<d>dga<cd;\n\nt200l8 @4 @n5 @e1,0,5,0,8 v11\nr4.\n/:4r1:/ /:7cccrr2:/ cr4.r2 /:15ccrc:/ r2 /:14ccrc:/ cr4.r2 /:15ccr4:/ r2 /:14ccr4:/ cr4.r2\n/:15ccr4:/ r2 /:4rccrccr4 r1:/\n/:4r1:/ /:7cccrr2:/ cr4.r2 /:15ccrc:/ r2 /:14ccrc:/ cr4.r2 /:15ccr4:/ r2 /:14ccr4:/ cr4.r2\nr1;\n\nt200l8 @4 @n100 @e1,0,35,0,40 v10\nr8 cr\n/:8r4cr:/ /:3r4.crcr4:/ r4.crccc /:3r4.crcr4:/ r8ccccccc /:15r4cr:/cccc /:14r4cr:/ rccrccrc /:15r4cr:/cccc /:14r4cr:/ r@n105c@n100c@n105c @n110c16c16c16c16 @n120c16c16c16c16@n100\n/:15r4cr:/r2 /:4 r2.cr r4crr4cr :/\n/:8r4cr:/ /:3r4.crcr4:/ r4.crccc /:3r4.crcr4:/ r8ccccccc /:15r4cr:/cccc /:14r4cr:/ rccrccrc /:15r4cr:/cccc /:14r4cr:/ r@n105c@n100c@n105c @n110c16c16c16c16 @n120c16c16c16c16@n100\n\ncrrcr4cc;\n\nt200l8 @4@n127 @e1,0,15,0,10 v15\ncr4\n/:8crr4:/ /:7crr4crcc:/ cr4.r2 /:64crr4:/\n/:15crr4:/ cccc /:4 crrcr2 ccrccccc :/\n/:8crr4:/ /:7crr4crcc:/ cr4.r2 /:64crr4:/\n\nrccrccr4;';

}).call(this);

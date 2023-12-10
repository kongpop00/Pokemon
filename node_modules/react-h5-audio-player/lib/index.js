"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RHAP_UI", {
  enumerable: true,
  get: function () {
    return _constants.RHAP_UI;
  }
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _react2 = require("@iconify/react");
var _ProgressBar = _interopRequireDefault(require("./ProgressBar"));
var _CurrentTime = _interopRequireDefault(require("./CurrentTime"));
var _Duration = _interopRequireDefault(require("./Duration"));
var _VolumeBar = _interopRequireDefault(require("./VolumeBar"));
var _constants = require("./constants");
var _utils = require("./utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
class H5AudioPlayer extends _react.Component {
  constructor() {
    super(...arguments);
    (0, _defineProperty2.default)(this, "audio", (0, _react.createRef)());
    (0, _defineProperty2.default)(this, "progressBar", (0, _react.createRef)());
    (0, _defineProperty2.default)(this, "container", (0, _react.createRef)());
    (0, _defineProperty2.default)(this, "lastVolume", this.props.volume);
    (0, _defineProperty2.default)(this, "listenTracker", void 0);
    (0, _defineProperty2.default)(this, "volumeAnimationTimer", void 0);
    (0, _defineProperty2.default)(this, "downloadProgressAnimationTimer", void 0);
    (0, _defineProperty2.default)(this, "togglePlay", e => {
      e.stopPropagation();
      const audio = this.audio.current;
      if ((audio.paused || audio.ended) && audio.src) {
        this.playAudioPromise();
      } else if (!audio.paused) {
        audio.pause();
      }
    });
    (0, _defineProperty2.default)(this, "playAudioPromise", () => {
      const playPromise = this.audio.current.play();
      if (playPromise) {
        playPromise.then(null).catch(err => {
          const {
            onPlayError
          } = this.props;
          onPlayError && onPlayError(new Error(err));
        });
      } else {
        this.forceUpdate();
      }
    });
    (0, _defineProperty2.default)(this, "isPlaying", () => {
      const audio = this.audio.current;
      if (!audio) return false;
      return !audio.paused && !audio.ended;
    });
    (0, _defineProperty2.default)(this, "handlePlay", e => {
      this.forceUpdate();
      this.props.onPlay && this.props.onPlay(e);
    });
    (0, _defineProperty2.default)(this, "handlePause", e => {
      if (!this.audio) return;
      this.forceUpdate();
      this.props.onPause && this.props.onPause(e);
    });
    (0, _defineProperty2.default)(this, "handleEnded", e => {
      if (!this.audio) return;
      this.forceUpdate();
      this.props.onEnded && this.props.onEnded(e);
    });
    (0, _defineProperty2.default)(this, "handleAbort", e => {
      this.props.onAbort && this.props.onAbort(e);
    });
    (0, _defineProperty2.default)(this, "handleClickVolumeButton", () => {
      const audio = this.audio.current;
      if (audio.volume > 0) {
        this.lastVolume = audio.volume;
        audio.volume = 0;
      } else {
        audio.volume = this.lastVolume;
      }
    });
    (0, _defineProperty2.default)(this, "handleMuteChange", () => {
      this.forceUpdate();
    });
    (0, _defineProperty2.default)(this, "handleClickLoopButton", () => {
      this.audio.current.loop = !this.audio.current.loop;
      this.forceUpdate();
    });
    (0, _defineProperty2.default)(this, "handleClickRewind", () => {
      const {
        progressJumpSteps,
        progressJumpStep
      } = this.props;
      const jumpStep = progressJumpSteps.backward || progressJumpStep;
      this.setJumpTime(-jumpStep);
    });
    (0, _defineProperty2.default)(this, "handleClickForward", () => {
      const {
        progressJumpSteps,
        progressJumpStep
      } = this.props;
      const jumpStep = progressJumpSteps.forward || progressJumpStep;
      this.setJumpTime(jumpStep);
    });
    (0, _defineProperty2.default)(this, "setJumpTime", time => {
      const audio = this.audio.current;
      const {
        duration,
        currentTime: prevTime
      } = audio;
      if (audio.readyState === audio.HAVE_NOTHING || audio.readyState === audio.HAVE_METADATA || !isFinite(duration) || !isFinite(prevTime)) {
        return this.props.onChangeCurrentTimeError && this.props.onChangeCurrentTimeError();
      }
      let currentTime = prevTime + time / 1000;
      if (currentTime < 0) {
        audio.currentTime = 0;
        currentTime = 0;
      } else if (currentTime > duration) {
        audio.currentTime = duration;
        currentTime = duration;
      } else {
        audio.currentTime = currentTime;
      }
    });
    (0, _defineProperty2.default)(this, "setJumpVolume", volume => {
      let newVolume = this.audio.current.volume + volume;
      if (newVolume < 0) newVolume = 0;else if (newVolume > 1) newVolume = 1;
      this.audio.current.volume = newVolume;
    });
    (0, _defineProperty2.default)(this, "handleKeyDown", e => {
      if (this.props.hasDefaultKeyBindings) {
        switch (e.key) {
          case ' ':
            if (e.target === this.container.current || e.target === this.progressBar.current) {
              e.preventDefault();
              this.togglePlay(e);
            }
            break;
          case 'ArrowLeft':
            this.handleClickRewind();
            break;
          case 'ArrowRight':
            this.handleClickForward();
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.setJumpVolume(this.props.volumeJumpStep);
            break;
          case 'ArrowDown':
            e.preventDefault();
            this.setJumpVolume(-this.props.volumeJumpStep);
            break;
          case 'l':
            this.handleClickLoopButton();
            break;
          case 'm':
            this.handleClickVolumeButton();
            break;
        }
      }
    });
    (0, _defineProperty2.default)(this, "renderUIModules", modules => {
      return modules.map((comp, i) => this.renderUIModule(comp, i));
    });
    (0, _defineProperty2.default)(this, "renderUIModule", (comp, key) => {
      const {
        defaultCurrentTime,
        progressUpdateInterval,
        showDownloadProgress,
        showFilledProgress,
        showFilledVolume,
        defaultDuration,
        customIcons,
        showSkipControls,
        onClickPrevious,
        onClickNext,
        onChangeCurrentTimeError,
        showJumpControls,
        customAdditionalControls,
        customVolumeControls,
        muted,
        timeFormat,
        volume: volumeProp,
        loop: loopProp,
        mse,
        i18nAriaLabels
      } = this.props;
      switch (comp) {
        case _constants.RHAP_UI.CURRENT_TIME:
          return _react.default.createElement("div", {
            key: key,
            id: "rhap_current-time",
            className: "rhap_time rhap_current-time"
          }, _react.default.createElement(_CurrentTime.default, {
            audio: this.audio.current,
            isLeftTime: false,
            defaultCurrentTime: defaultCurrentTime,
            timeFormat: timeFormat
          }));
        case _constants.RHAP_UI.CURRENT_LEFT_TIME:
          return _react.default.createElement("div", {
            key: key,
            id: "rhap_current-left-time",
            className: "rhap_time rhap_current-left-time"
          }, _react.default.createElement(_CurrentTime.default, {
            audio: this.audio.current,
            isLeftTime: true,
            defaultCurrentTime: defaultCurrentTime,
            timeFormat: timeFormat
          }));
        case _constants.RHAP_UI.PROGRESS_BAR:
          return _react.default.createElement(_ProgressBar.default, {
            key: key,
            ref: this.progressBar,
            audio: this.audio.current,
            progressUpdateInterval: progressUpdateInterval,
            showDownloadProgress: showDownloadProgress,
            showFilledProgress: showFilledProgress,
            onSeek: mse && mse.onSeek,
            onChangeCurrentTimeError: onChangeCurrentTimeError,
            srcDuration: mse && mse.srcDuration,
            i18nProgressBar: i18nAriaLabels.progressControl
          });
        case _constants.RHAP_UI.DURATION:
          return _react.default.createElement("div", {
            key: key,
            className: "rhap_time rhap_total-time"
          }, mse && mse.srcDuration ? (0, _utils.getDisplayTimeBySeconds)(mse.srcDuration, mse.srcDuration, this.props.timeFormat) : _react.default.createElement(_Duration.default, {
            audio: this.audio.current,
            defaultDuration: defaultDuration,
            timeFormat: timeFormat
          }));
        case _constants.RHAP_UI.ADDITIONAL_CONTROLS:
          return _react.default.createElement("div", {
            key: key,
            className: "rhap_additional-controls"
          }, this.renderUIModules(customAdditionalControls));
        case _constants.RHAP_UI.MAIN_CONTROLS:
          {
            const isPlaying = this.isPlaying();
            let actionIcon;
            if (isPlaying) {
              actionIcon = customIcons.pause ? customIcons.pause : _react.default.createElement(_react2.Icon, {
                icon: "mdi:pause-circle"
              });
            } else {
              actionIcon = customIcons.play ? customIcons.play : _react.default.createElement(_react2.Icon, {
                icon: "mdi:play-circle"
              });
            }
            return _react.default.createElement("div", {
              key: key,
              className: "rhap_main-controls"
            }, showSkipControls && _react.default.createElement("button", {
              "aria-label": i18nAriaLabels.previous,
              className: "rhap_button-clear rhap_main-controls-button rhap_skip-button",
              type: "button",
              onClick: onClickPrevious
            }, customIcons.previous ? customIcons.previous : _react.default.createElement(_react2.Icon, {
              icon: "mdi:skip-previous"
            })), showJumpControls && _react.default.createElement("button", {
              "aria-label": i18nAriaLabels.rewind,
              className: "rhap_button-clear rhap_main-controls-button rhap_rewind-button",
              type: "button",
              onClick: this.handleClickRewind
            }, customIcons.rewind ? customIcons.rewind : _react.default.createElement(_react2.Icon, {
              icon: "mdi:rewind"
            })), _react.default.createElement("button", {
              "aria-label": isPlaying ? i18nAriaLabels.pause : i18nAriaLabels.play,
              className: "rhap_button-clear rhap_main-controls-button rhap_play-pause-button",
              type: "button",
              onClick: this.togglePlay
            }, actionIcon), showJumpControls && _react.default.createElement("button", {
              "aria-label": i18nAriaLabels.forward,
              className: "rhap_button-clear rhap_main-controls-button rhap_forward-button",
              type: "button",
              onClick: this.handleClickForward
            }, customIcons.forward ? customIcons.forward : _react.default.createElement(_react2.Icon, {
              icon: "mdi:fast-forward"
            })), showSkipControls && _react.default.createElement("button", {
              "aria-label": i18nAriaLabels.next,
              className: "rhap_button-clear rhap_main-controls-button rhap_skip-button",
              type: "button",
              onClick: onClickNext
            }, customIcons.next ? customIcons.next : _react.default.createElement(_react2.Icon, {
              icon: "mdi:skip-next"
            })));
          }
        case _constants.RHAP_UI.VOLUME_CONTROLS:
          return _react.default.createElement("div", {
            key: key,
            className: "rhap_volume-controls"
          }, this.renderUIModules(customVolumeControls));
        case _constants.RHAP_UI.LOOP:
          {
            const loop = this.audio.current ? this.audio.current.loop : loopProp;
            let loopIcon;
            if (loop) {
              loopIcon = customIcons.loop ? customIcons.loop : _react.default.createElement(_react2.Icon, {
                icon: "mdi:repeat"
              });
            } else {
              loopIcon = customIcons.loopOff ? customIcons.loopOff : _react.default.createElement(_react2.Icon, {
                icon: "mdi:repeat-off"
              });
            }
            return _react.default.createElement("button", {
              key: key,
              "aria-label": loop ? i18nAriaLabels.loop : i18nAriaLabels.loopOff,
              className: "rhap_button-clear rhap_repeat-button",
              type: "button",
              onClick: this.handleClickLoopButton
            }, loopIcon);
          }
        case _constants.RHAP_UI.VOLUME:
          {
            const {
              volume = muted ? 0 : volumeProp
            } = this.audio.current || {};
            let volumeIcon;
            if (volume) {
              volumeIcon = customIcons.volume ? customIcons.volume : _react.default.createElement(_react2.Icon, {
                icon: "mdi:volume-high"
              });
            } else {
              volumeIcon = customIcons.volume ? customIcons.volumeMute : _react.default.createElement(_react2.Icon, {
                icon: "mdi:volume-mute"
              });
            }
            return _react.default.createElement("div", {
              key: key,
              className: "rhap_volume-container"
            }, _react.default.createElement("button", {
              "aria-label": volume ? i18nAriaLabels.volume : i18nAriaLabels.volumeMute,
              onClick: this.handleClickVolumeButton,
              type: "button",
              className: "rhap_button-clear rhap_volume-button"
            }, volumeIcon), _react.default.createElement(_VolumeBar.default, {
              audio: this.audio.current,
              volume: volume,
              onMuteChange: this.handleMuteChange,
              showFilledVolume: showFilledVolume,
              i18nVolumeControl: i18nAriaLabels.volumeControl
            }));
          }
        default:
          if (!(0, _react.isValidElement)(comp)) {
            return null;
          }
          return comp.key ? comp : (0, _react.cloneElement)(comp, {
            key
          });
      }
    });
  }
  componentDidMount() {
    this.forceUpdate();
    const audio = this.audio.current;
    if (this.props.muted) {
      audio.volume = 0;
    } else {
      audio.volume = this.lastVolume;
    }
    audio.addEventListener('error', e => {
      this.props.onError && this.props.onError(e);
    });
    audio.addEventListener('canplay', e => {
      this.props.onCanPlay && this.props.onCanPlay(e);
    });
    audio.addEventListener('canplaythrough', e => {
      this.props.onCanPlayThrough && this.props.onCanPlayThrough(e);
    });
    audio.addEventListener('play', this.handlePlay);
    audio.addEventListener('abort', this.handleAbort);
    audio.addEventListener('ended', this.handleEnded);
    audio.addEventListener('playing', e => {
      this.props.onPlaying && this.props.onPlaying(e);
    });
    audio.addEventListener('seeking', e => {
      this.props.onSeeking && this.props.onSeeking(e);
    });
    audio.addEventListener('seeked', e => {
      this.props.onSeeked && this.props.onSeeked(e);
    });
    audio.addEventListener('waiting', e => {
      this.props.onWaiting && this.props.onWaiting(e);
    });
    audio.addEventListener('emptied', e => {
      this.props.onEmptied && this.props.onEmptied(e);
    });
    audio.addEventListener('stalled', e => {
      this.props.onStalled && this.props.onStalled(e);
    });
    audio.addEventListener('suspend', e => {
      this.props.onSuspend && this.props.onSuspend(e);
    });
    audio.addEventListener('loadstart', e => {
      this.props.onLoadStart && this.props.onLoadStart(e);
    });
    audio.addEventListener('loadedmetadata', e => {
      this.props.onLoadedMetaData && this.props.onLoadedMetaData(e);
    });
    audio.addEventListener('loadeddata', e => {
      this.props.onLoadedData && this.props.onLoadedData(e);
    });
    audio.addEventListener('pause', this.handlePause);
    audio.addEventListener('timeupdate', (0, _utils.throttle)(e => {
      this.props.onListen && this.props.onListen(e);
    }, this.props.listenInterval));
    audio.addEventListener('volumechange', e => {
      this.props.onVolumeChange && this.props.onVolumeChange(e);
    });
    audio.addEventListener('encrypted', e => {
      const {
        mse
      } = this.props;
      mse && mse.onEcrypted && mse.onEcrypted(e);
    });
  }
  componentDidUpdate(prevProps) {
    const {
      src,
      autoPlayAfterSrcChange
    } = this.props;
    if (prevProps.src !== src) {
      if (autoPlayAfterSrcChange) {
        this.playAudioPromise();
      } else {
        this.forceUpdate();
      }
    }
  }
  render() {
    const {
      className,
      src,
      loop: loopProp,
      preload,
      autoPlay,
      crossOrigin,
      mediaGroup,
      header,
      footer,
      layout,
      customProgressBarSection,
      customControlsSection,
      children,
      style,
      i18nAriaLabels
    } = this.props;
    const loop = this.audio.current ? this.audio.current.loop : loopProp;
    const loopClass = loop ? 'rhap_loop--on' : 'rhap_loop--off';
    const isPlayingClass = this.isPlaying() ? 'rhap_play-status--playing' : 'rhap_play-status--paused';
    return _react.default.createElement("div", {
      role: "group",
      tabIndex: 0,
      "aria-label": i18nAriaLabels.player,
      className: `rhap_container ${loopClass} ${isPlayingClass} ${className}`,
      onKeyDown: this.handleKeyDown,
      ref: this.container,
      style: style
    }, _react.default.createElement("audio", {
      src: src,
      controls: false,
      loop: loop,
      autoPlay: autoPlay,
      preload: preload,
      crossOrigin: crossOrigin,
      mediaGroup: mediaGroup,
      ref: this.audio
    }, children), header && _react.default.createElement("div", {
      className: "rhap_header"
    }, header), _react.default.createElement("div", {
      className: `rhap_main ${(0, _utils.getMainLayoutClassName)(layout)}`
    }, _react.default.createElement("div", {
      className: "rhap_progress-section"
    }, this.renderUIModules(customProgressBarSection)), _react.default.createElement("div", {
      className: "rhap_controls-section"
    }, this.renderUIModules(customControlsSection))), footer && _react.default.createElement("div", {
      className: "rhap_footer"
    }, footer));
  }
}
(0, _defineProperty2.default)(H5AudioPlayer, "defaultProps", {
  autoPlay: false,
  autoPlayAfterSrcChange: true,
  listenInterval: 1000,
  progressJumpStep: 5000,
  progressJumpSteps: {},
  volumeJumpStep: 0.1,
  loop: false,
  muted: false,
  preload: 'auto',
  progressUpdateInterval: 20,
  defaultCurrentTime: '--:--',
  defaultDuration: '--:--',
  timeFormat: 'auto',
  volume: 1,
  className: '',
  showJumpControls: true,
  showSkipControls: false,
  showDownloadProgress: true,
  showFilledProgress: true,
  showFilledVolume: false,
  customIcons: {},
  customProgressBarSection: [_constants.RHAP_UI.CURRENT_TIME, _constants.RHAP_UI.PROGRESS_BAR, _constants.RHAP_UI.DURATION],
  customControlsSection: [_constants.RHAP_UI.ADDITIONAL_CONTROLS, _constants.RHAP_UI.MAIN_CONTROLS, _constants.RHAP_UI.VOLUME_CONTROLS],
  customAdditionalControls: [_constants.RHAP_UI.LOOP],
  customVolumeControls: [_constants.RHAP_UI.VOLUME],
  layout: 'stacked',
  hasDefaultKeyBindings: true,
  i18nAriaLabels: {
    player: 'Audio player',
    progressControl: 'Audio progress control',
    volumeControl: 'Volume control',
    play: 'Play',
    pause: 'Pause',
    rewind: 'Rewind',
    forward: 'Forward',
    previous: 'Previous',
    next: 'Skip',
    loop: 'Disable loop',
    loopOff: 'Enable loop',
    volume: 'Mute',
    volumeMute: 'Unmute'
  }
});
var _default = H5AudioPlayer;
exports.default = _default;
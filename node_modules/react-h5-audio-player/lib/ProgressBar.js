"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ProgressBarForwardRef = exports.ProgressBar = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _utils = require("./utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
class ProgressBar extends _react.Component {
  constructor() {
    super(...arguments);
    (0, _defineProperty2.default)(this, "audio", void 0);
    (0, _defineProperty2.default)(this, "timeOnMouseMove", 0);
    (0, _defineProperty2.default)(this, "hasAddedAudioEventListener", false);
    (0, _defineProperty2.default)(this, "downloadProgressAnimationTimer", void 0);
    (0, _defineProperty2.default)(this, "state", {
      isDraggingProgress: false,
      currentTimePos: '0%',
      hasDownloadProgressAnimation: false,
      downloadProgressArr: [],
      waitingForSeekCallback: false
    });
    (0, _defineProperty2.default)(this, "getCurrentProgress", event => {
      const {
        audio,
        progressBar
      } = this.props;
      const isSingleFileProgressiveDownload = audio.src.indexOf('blob:') !== 0 && typeof this.props.srcDuration === 'undefined';
      if (isSingleFileProgressiveDownload && (!audio.src || !isFinite(audio.currentTime) || !progressBar.current)) {
        return {
          currentTime: 0,
          currentTimePos: '0%'
        };
      }
      const progressBarRect = progressBar.current.getBoundingClientRect();
      const maxRelativePos = progressBarRect.width;
      let relativePos = (0, _utils.getPosX)(event) - progressBarRect.left;
      if (relativePos < 0) {
        relativePos = 0;
      } else if (relativePos > maxRelativePos) {
        relativePos = maxRelativePos;
      }
      const duration = this.getDuration();
      const currentTime = duration * relativePos / maxRelativePos;
      return {
        currentTime,
        currentTimePos: `${(relativePos / maxRelativePos * 100).toFixed(2)}%`
      };
    });
    (0, _defineProperty2.default)(this, "handleContextMenu", event => {
      event.preventDefault();
    });
    (0, _defineProperty2.default)(this, "handleMouseDownOrTouchStartProgressBar", event => {
      event.stopPropagation();
      const {
        currentTime,
        currentTimePos
      } = this.getCurrentProgress(event.nativeEvent);
      if (isFinite(currentTime)) {
        this.timeOnMouseMove = currentTime;
        this.setState({
          isDraggingProgress: true,
          currentTimePos
        });
        if (event.nativeEvent instanceof MouseEvent) {
          window.addEventListener('mousemove', this.handleWindowMouseOrTouchMove);
          window.addEventListener('mouseup', this.handleWindowMouseOrTouchUp);
        } else {
          window.addEventListener('touchmove', this.handleWindowMouseOrTouchMove);
          window.addEventListener('touchend', this.handleWindowMouseOrTouchUp);
        }
      }
    });
    (0, _defineProperty2.default)(this, "handleWindowMouseOrTouchMove", event => {
      if (event instanceof MouseEvent) {
        event.preventDefault();
      }
      event.stopPropagation();
      const windowSelection = window.getSelection();
      if (windowSelection && windowSelection.type === 'Range') {
        windowSelection.empty();
      }
      const {
        isDraggingProgress
      } = this.state;
      if (isDraggingProgress) {
        const {
          currentTime,
          currentTimePos
        } = this.getCurrentProgress(event);
        this.timeOnMouseMove = currentTime;
        this.setState({
          currentTimePos
        });
      }
    });
    (0, _defineProperty2.default)(this, "handleWindowMouseOrTouchUp", event => {
      event.stopPropagation();
      const newTime = this.timeOnMouseMove;
      const {
        audio,
        onChangeCurrentTimeError,
        onSeek
      } = this.props;
      if (onSeek) {
        this.setState({
          isDraggingProgress: false,
          waitingForSeekCallback: true
        }, () => {
          onSeek(audio, newTime).then(() => this.setState({
            waitingForSeekCallback: false
          }), err => {
            throw new Error(err);
          });
        });
      } else {
        const newProps = {
          isDraggingProgress: false
        };
        if (audio.readyState === audio.HAVE_NOTHING || audio.readyState === audio.HAVE_METADATA || !isFinite(newTime)) {
          newProps.currentTimePos = '0%';
          onChangeCurrentTimeError && onChangeCurrentTimeError();
        } else {
          audio.currentTime = newTime;
        }
        this.setState(newProps);
      }
      if (event instanceof MouseEvent) {
        window.removeEventListener('mousemove', this.handleWindowMouseOrTouchMove);
        window.removeEventListener('mouseup', this.handleWindowMouseOrTouchUp);
      } else {
        window.removeEventListener('touchmove', this.handleWindowMouseOrTouchMove);
        window.removeEventListener('touchend', this.handleWindowMouseOrTouchUp);
      }
    });
    (0, _defineProperty2.default)(this, "handleAudioTimeUpdate", (0, _utils.throttle)(e => {
      const {
        isDraggingProgress
      } = this.state;
      const audio = e.target;
      if (isDraggingProgress || this.state.waitingForSeekCallback === true) return;
      const {
        currentTime
      } = audio;
      const duration = this.getDuration();
      this.setState({
        currentTimePos: `${(currentTime / duration * 100 || 0).toFixed(2)}%`
      });
    }, this.props.progressUpdateInterval));
    (0, _defineProperty2.default)(this, "handleAudioDownloadProgressUpdate", e => {
      const audio = e.target;
      const duration = this.getDuration();
      const downloadProgressArr = [];
      for (let i = 0; i < audio.buffered.length; i++) {
        const bufferedStart = audio.buffered.start(i);
        const bufferedEnd = audio.buffered.end(i);
        downloadProgressArr.push({
          left: `${Math.round(100 / duration * bufferedStart) || 0}%`,
          width: `${Math.round(100 / duration * (bufferedEnd - bufferedStart)) || 0}%`
        });
      }
      clearTimeout(this.downloadProgressAnimationTimer);
      this.setState({
        downloadProgressArr,
        hasDownloadProgressAnimation: true
      });
      this.downloadProgressAnimationTimer = setTimeout(() => {
        this.setState({
          hasDownloadProgressAnimation: false
        });
      }, 200);
    });
  }
  getDuration() {
    const {
      audio,
      srcDuration
    } = this.props;
    return typeof srcDuration === 'undefined' ? audio.duration : srcDuration;
  }
  componentDidUpdate() {
    const {
      audio
    } = this.props;
    if (audio && !this.hasAddedAudioEventListener) {
      this.audio = audio;
      this.hasAddedAudioEventListener = true;
      audio.addEventListener('timeupdate', this.handleAudioTimeUpdate);
      audio.addEventListener('progress', this.handleAudioDownloadProgressUpdate);
    }
  }
  componentWillUnmount() {
    if (this.audio && this.hasAddedAudioEventListener) {
      this.audio.removeEventListener('timeupdate', this.handleAudioTimeUpdate);
      this.audio.removeEventListener('progress', this.handleAudioDownloadProgressUpdate);
    }
    clearTimeout(this.downloadProgressAnimationTimer);
  }
  render() {
    const {
      showDownloadProgress,
      showFilledProgress,
      progressBar,
      i18nProgressBar
    } = this.props;
    const {
      currentTimePos,
      downloadProgressArr,
      hasDownloadProgressAnimation
    } = this.state;
    return _react.default.createElement("div", {
      className: "rhap_progress-container",
      ref: progressBar,
      "aria-label": i18nProgressBar,
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Number(currentTimePos.split('%')[0]),
      tabIndex: 0,
      onMouseDown: this.handleMouseDownOrTouchStartProgressBar,
      onTouchStart: this.handleMouseDownOrTouchStartProgressBar,
      onContextMenu: this.handleContextMenu
    }, _react.default.createElement("div", {
      className: `rhap_progress-bar ${showDownloadProgress ? 'rhap_progress-bar-show-download' : ''}`
    }, _react.default.createElement("div", {
      className: "rhap_progress-indicator",
      style: {
        left: currentTimePos
      }
    }), showFilledProgress && _react.default.createElement("div", {
      className: "rhap_progress-filled",
      style: {
        width: currentTimePos
      }
    }), showDownloadProgress && downloadProgressArr.map((_ref, i) => {
      let {
        left,
        width
      } = _ref;
      return _react.default.createElement("div", {
        key: i,
        className: "rhap_download-progress",
        style: {
          left,
          width,
          transitionDuration: hasDownloadProgressAnimation ? '.2s' : '0s'
        }
      });
    })));
  }
}
exports.ProgressBar = ProgressBar;
const ProgressBarForwardRef = (props, ref) => _react.default.createElement(ProgressBar, (0, _extends2.default)({}, props, {
  progressBar: ref
}));
exports.ProgressBarForwardRef = ProgressBarForwardRef;
var _default = (0, _react.forwardRef)(ProgressBarForwardRef);
exports.default = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _utils = require("./utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
class VolumeControls extends _react.Component {
  constructor() {
    super(...arguments);
    (0, _defineProperty2.default)(this, "audio", void 0);
    (0, _defineProperty2.default)(this, "hasAddedAudioEventListener", false);
    (0, _defineProperty2.default)(this, "volumeBar", (0, _react.createRef)());
    (0, _defineProperty2.default)(this, "volumeAnimationTimer", 0);
    (0, _defineProperty2.default)(this, "lastVolume", this.props.volume);
    (0, _defineProperty2.default)(this, "state", {
      currentVolumePos: `${(this.lastVolume / 1 * 100 || 0).toFixed(2)}%`,
      hasVolumeAnimation: false,
      isDraggingVolume: false
    });
    (0, _defineProperty2.default)(this, "getCurrentVolume", event => {
      const {
        audio
      } = this.props;
      if (!this.volumeBar.current) {
        return {
          currentVolume: audio.volume,
          currentVolumePos: this.state.currentVolumePos
        };
      }
      const volumeBarRect = this.volumeBar.current.getBoundingClientRect();
      const maxRelativePos = volumeBarRect.width;
      const relativePos = (0, _utils.getPosX)(event) - volumeBarRect.left;
      let currentVolume;
      let currentVolumePos;
      if (relativePos < 0) {
        currentVolume = 0;
        currentVolumePos = '0%';
      } else if (relativePos > volumeBarRect.width) {
        currentVolume = 1;
        currentVolumePos = '100%';
      } else {
        currentVolume = relativePos / maxRelativePos;
        currentVolumePos = `${relativePos / maxRelativePos * 100}%`;
      }
      return {
        currentVolume,
        currentVolumePos
      };
    });
    (0, _defineProperty2.default)(this, "handleContextMenu", event => {
      event.preventDefault();
    });
    (0, _defineProperty2.default)(this, "handleClickVolumeButton", () => {
      const {
        audio
      } = this.props;
      if (audio.volume > 0) {
        this.lastVolume = audio.volume;
        audio.volume = 0;
      } else {
        audio.volume = this.lastVolume;
      }
    });
    (0, _defineProperty2.default)(this, "handleVolumnControlMouseOrTouchDown", event => {
      event.stopPropagation();
      const {
        audio
      } = this.props;
      const {
        currentVolume,
        currentVolumePos
      } = this.getCurrentVolume(event.nativeEvent);
      audio.volume = currentVolume;
      this.setState({
        isDraggingVolume: true,
        currentVolumePos
      });
      if (event.nativeEvent instanceof MouseEvent) {
        window.addEventListener('mousemove', this.handleWindowMouseOrTouchMove);
        window.addEventListener('mouseup', this.handleWindowMouseOrTouchUp);
      } else {
        window.addEventListener('touchmove', this.handleWindowMouseOrTouchMove);
        window.addEventListener('touchend', this.handleWindowMouseOrTouchUp);
      }
    });
    (0, _defineProperty2.default)(this, "handleWindowMouseOrTouchMove", event => {
      if (event instanceof MouseEvent) {
        event.preventDefault();
      }
      event.stopPropagation();
      const {
        audio
      } = this.props;
      const windowSelection = window.getSelection();
      if (windowSelection && windowSelection.type === 'Range') {
        windowSelection.empty();
      }
      const {
        isDraggingVolume
      } = this.state;
      if (isDraggingVolume) {
        const {
          currentVolume,
          currentVolumePos
        } = this.getCurrentVolume(event);
        audio.volume = currentVolume;
        this.setState({
          currentVolumePos
        });
      }
    });
    (0, _defineProperty2.default)(this, "handleWindowMouseOrTouchUp", event => {
      event.stopPropagation();
      this.setState({
        isDraggingVolume: false
      });
      if (event instanceof MouseEvent) {
        window.removeEventListener('mousemove', this.handleWindowMouseOrTouchMove);
        window.removeEventListener('mouseup', this.handleWindowMouseOrTouchUp);
      } else {
        window.removeEventListener('touchmove', this.handleWindowMouseOrTouchMove);
        window.removeEventListener('touchend', this.handleWindowMouseOrTouchUp);
      }
    });
    (0, _defineProperty2.default)(this, "handleAudioVolumeChange", e => {
      const {
        isDraggingVolume
      } = this.state;
      const {
        volume
      } = e.target;
      if (this.lastVolume > 0 && volume === 0 || this.lastVolume === 0 && volume > 0) {
        this.props.onMuteChange();
      }
      this.lastVolume = volume;
      if (isDraggingVolume) return;
      this.setState({
        hasVolumeAnimation: true,
        currentVolumePos: `${(volume / 1 * 100 || 0).toFixed(2)}%`
      });
      clearTimeout(this.volumeAnimationTimer);
      this.volumeAnimationTimer = setTimeout(() => {
        this.setState({
          hasVolumeAnimation: false
        });
      }, 100);
    });
  }
  componentDidUpdate() {
    const {
      audio
    } = this.props;
    if (audio && !this.hasAddedAudioEventListener) {
      this.audio = audio;
      this.hasAddedAudioEventListener = true;
      audio.addEventListener('volumechange', this.handleAudioVolumeChange);
    }
  }
  componentWillUnmount() {
    if (this.audio && this.hasAddedAudioEventListener) {
      this.audio.removeEventListener('volumechange', this.handleAudioVolumeChange);
    }
    clearTimeout(this.volumeAnimationTimer);
  }
  render() {
    const {
      audio,
      showFilledVolume,
      i18nVolumeControl
    } = this.props;
    const {
      currentVolumePos,
      hasVolumeAnimation
    } = this.state;
    const {
      volume
    } = audio || {};
    return _react.default.createElement("div", {
      ref: this.volumeBar,
      onMouseDown: this.handleVolumnControlMouseOrTouchDown,
      onTouchStart: this.handleVolumnControlMouseOrTouchDown,
      onContextMenu: this.handleContextMenu,
      role: "progressbar",
      "aria-label": i18nVolumeControl,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Number((volume * 100).toFixed(0)),
      tabIndex: 0,
      className: "rhap_volume-bar-area"
    }, _react.default.createElement("div", {
      className: "rhap_volume-bar"
    }, _react.default.createElement("div", {
      className: "rhap_volume-indicator",
      style: {
        left: currentVolumePos,
        transitionDuration: hasVolumeAnimation ? '.1s' : '0s'
      }
    }), showFilledVolume && _react.default.createElement("div", {
      className: "rhap_volume-filled",
      style: {
        width: currentVolumePos
      }
    })));
  }
}
var _default = VolumeControls;
exports.default = _default;
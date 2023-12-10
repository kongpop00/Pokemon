"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = require("react");
var _utils = require("./utils");
class CurrentTime extends _react.PureComponent {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "audio", void 0);
    (0, _defineProperty2.default)(this, "hasAddedAudioEventListener", false);
    (0, _defineProperty2.default)(this, "state", {
      currentTime: this.props.defaultCurrentTime
    });
    (0, _defineProperty2.default)(this, "handleAudioCurrentTimeChange", e => {
      const audio = e.target;
      const {
        isLeftTime,
        timeFormat,
        defaultCurrentTime
      } = this.props;
      this.setState({
        currentTime: (0, _utils.getDisplayTimeBySeconds)(isLeftTime ? audio.duration - audio.currentTime : audio.currentTime, audio.duration, timeFormat) || defaultCurrentTime
      });
    });
    (0, _defineProperty2.default)(this, "addAudioEventListeners", () => {
      const {
        audio
      } = this.props;
      if (audio && !this.hasAddedAudioEventListener) {
        this.audio = audio;
        this.hasAddedAudioEventListener = true;
        audio.addEventListener('timeupdate', this.handleAudioCurrentTimeChange);
        audio.addEventListener('loadedmetadata', this.handleAudioCurrentTimeChange);
      }
    });
    const {
      audio: _audio,
      defaultCurrentTime: _defaultCurrentTime,
      isLeftTime: _isLeftTime,
      timeFormat: _timeFormat
    } = props;
    let currentTime = _defaultCurrentTime;
    if (_audio) {
      currentTime = (0, _utils.getDisplayTimeBySeconds)(_isLeftTime ? _audio.duration - _audio.currentTime : _audio.currentTime, _audio.duration, _timeFormat);
    }
    this.state = {
      currentTime
    };
  }
  componentDidMount() {
    this.addAudioEventListeners();
  }
  componentDidUpdate() {
    this.addAudioEventListeners();
  }
  componentWillUnmount() {
    if (this.audio && this.hasAddedAudioEventListener) {
      this.audio.removeEventListener('timeupdate', this.handleAudioCurrentTimeChange);
      this.audio.removeEventListener('loadedmetadata', this.handleAudioCurrentTimeChange);
    }
  }
  render() {
    return this.state.currentTime;
  }
}
var _default = CurrentTime;
exports.default = _default;
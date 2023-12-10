"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = require("react");
var _utils = require("./utils");
class Duration extends _react.PureComponent {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "audio", void 0);
    (0, _defineProperty2.default)(this, "hasAddedAudioEventListener", false);
    (0, _defineProperty2.default)(this, "state", {
      duration: this.props.audio ? (0, _utils.getDisplayTimeBySeconds)(this.props.audio.duration, this.props.audio.duration, this.props.timeFormat) : this.props.defaultDuration
    });
    (0, _defineProperty2.default)(this, "handleAudioDurationChange", e => {
      const audio = e.target;
      const {
        timeFormat,
        defaultDuration
      } = this.props;
      this.setState({
        duration: (0, _utils.getDisplayTimeBySeconds)(audio.duration, audio.duration, timeFormat) || defaultDuration
      });
    });
    (0, _defineProperty2.default)(this, "addAudioEventListeners", () => {
      const {
        audio
      } = this.props;
      if (audio && !this.hasAddedAudioEventListener) {
        this.audio = audio;
        this.hasAddedAudioEventListener = true;
        audio.addEventListener('durationchange', this.handleAudioDurationChange);
        audio.addEventListener('abort', this.handleAudioDurationChange);
      }
    });
    const {
      audio: _audio,
      timeFormat: _timeFormat,
      defaultDuration: _defaultDuration
    } = props;
    this.state = {
      duration: _audio ? (0, _utils.getDisplayTimeBySeconds)(_audio.duration, _audio.duration, _timeFormat) : _defaultDuration
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
      this.audio.removeEventListener('durationchange', this.handleAudioDurationChange);
      this.audio.removeEventListener('abort', this.handleAudioDurationChange);
    }
  }
  render() {
    return this.state.duration;
  }
}
var _default = Duration;
exports.default = _default;
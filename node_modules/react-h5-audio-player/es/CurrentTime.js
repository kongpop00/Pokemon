import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { PureComponent } from 'react';
import { getDisplayTimeBySeconds } from './utils';
class CurrentTime extends PureComponent {
  constructor(props) {
    super(props);
    _defineProperty(this, "audio", void 0);
    _defineProperty(this, "hasAddedAudioEventListener", false);
    _defineProperty(this, "state", {
      currentTime: this.props.defaultCurrentTime
    });
    _defineProperty(this, "handleAudioCurrentTimeChange", e => {
      const audio = e.target;
      const {
        isLeftTime,
        timeFormat,
        defaultCurrentTime
      } = this.props;
      this.setState({
        currentTime: getDisplayTimeBySeconds(isLeftTime ? audio.duration - audio.currentTime : audio.currentTime, audio.duration, timeFormat) || defaultCurrentTime
      });
    });
    _defineProperty(this, "addAudioEventListeners", () => {
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
      currentTime = getDisplayTimeBySeconds(_isLeftTime ? _audio.duration - _audio.currentTime : _audio.currentTime, _audio.duration, _timeFormat);
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
export default CurrentTime;
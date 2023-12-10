import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { PureComponent } from 'react';
import { getDisplayTimeBySeconds } from './utils';
class Duration extends PureComponent {
  constructor(props) {
    super(props);
    _defineProperty(this, "audio", void 0);
    _defineProperty(this, "hasAddedAudioEventListener", false);
    _defineProperty(this, "state", {
      duration: this.props.audio ? getDisplayTimeBySeconds(this.props.audio.duration, this.props.audio.duration, this.props.timeFormat) : this.props.defaultDuration
    });
    _defineProperty(this, "handleAudioDurationChange", e => {
      const audio = e.target;
      const {
        timeFormat,
        defaultDuration
      } = this.props;
      this.setState({
        duration: getDisplayTimeBySeconds(audio.duration, audio.duration, timeFormat) || defaultDuration
      });
    });
    _defineProperty(this, "addAudioEventListeners", () => {
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
      duration: _audio ? getDisplayTimeBySeconds(_audio.duration, _audio.duration, _timeFormat) : _defaultDuration
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
export default Duration;
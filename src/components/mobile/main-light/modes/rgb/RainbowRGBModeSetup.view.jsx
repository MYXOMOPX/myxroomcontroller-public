import React, { Component } from 'react'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {ActionsRGBRainbow} from "../../../../../actions/main-light.actions";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import Button from '@material-ui/core/Button';
import {Debounce} from "../../../../../decorators/debounce.decorator";


const stateToProps = (state) => ({
    mode: state.mainLight.rgbRainbow,
});
const dispatchToProps = (dispatch) => ({
    updateMode: bindActionCreators(ActionsRGBRainbow.update, dispatch),
    sendMode: bindActionCreators(ActionsRGBRainbow.send, dispatch),
    activateMode: bindActionCreators(ActionsRGBRainbow.activate, dispatch),
});


@connect(stateToProps,dispatchToProps)
class RainbowRGBModeSetup extends Component {

    constructor(props){
        super(props);
        this.props.updateMode();
        this.state = {
            displayedPeriod: this.props.mode.period,
            displayedBrightness: this.props.mode.brightness,
            displayedDepth: this.props.mode.depth,
        }
    }

    componentWillReceiveProps(newProps){
        if (this.props.mode != newProps.mode) {
            this.setState({
                displayedPeriod: newProps.mode.period,
                displayedBrightness: newProps.mode.brightness,
                displayedDepth: newProps.mode.depth,
            })
        }
    }

    render() {
        return (
            <div className="strip-mode-page mode-rgb-rainbow">
                <div className="mode-rgb-rainbow__input">
                    <FormControl className="mode-rgb-rainbow__input__form-control">
                        <InputLabel htmlFor="name-helper">Период</InputLabel>
                        <Input type="number" id="name-helper" value={this.state.displayedPeriod} onChange={::this.onChangePeriod} />
                        <FormHelperText id="name-helper-text">В миллисекундах</FormHelperText>
                    </FormControl>
                </div>
                <div className="mode-rgb-rainbow__slider-ctr" >
                    <Typography id="label">Яркость</Typography>
                    <Slider min={0.1}
                            max={1}
                            value={this.state.displayedBrightness}
                            onChange={::this.onChangeBrightness}
                            className="mode-rgb-rainbow__slider-ctr__slider"
                    />
                </div>
                <div className="mode-rgb-rainbow__slider-ctr">
                    <Typography id="label">Глубина</Typography>
                    <Slider min={0.1}
                            max={1}
                            value={this.state.displayedDepth}
                            onChange={::this.onChangeDepth}
                            className="mode-rgb-rainbow__slider-ctr__slider"
                    />
                </div>
                <Button variant="contained" className="mode-rgb-rainbow__button" onClick={::this.onClickActivate}>
                    Включить режим
                </Button>
            </div>
        )
    }

    onClickActivate() {
        this.props.activateMode(this.props.mode);
    }


    onChangePeriod(event) {
        const time = event.target.value;
        this.setState({...this.state, displayedPeriod: time});
        this.sendPeriod(time)
    }
    @Debounce(1000)
    sendPeriod(value) {
        const mode = this.props.mode.setPeriod(value);
        this.props.sendMode(mode);
    }

    onChangeBrightness(event, value) {
        this.setState({...this.state, displayedBrightness: value});
        this.sendBrightness(value);
    }
    @Debounce(500)
    sendBrightness(value) {
        const mode = this.props.mode.setBrightness(value);
        this.props.sendMode(mode);
    }

    onChangeDepth(event, value) {
        this.setState({...this.state, displayedDepth: value});
        this.sendDepth(value);
    }
    @Debounce(500)
    sendDepth(value) {
        const mode = this.props.mode.setDepth(value);
        this.props.sendMode(mode);
    }
}

export {RainbowRGBModeSetup}
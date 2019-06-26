import React, { Component } from 'react'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Slider from '@material-ui/lab/Slider';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import {ActionsMonoDefault} from "../../../../../actions/main-light.actions";
import {Debounce} from "../../../../../decorators/debounce.decorator";


const stateToProps = (state) => ({
    mode: state.mainLight.monoDefault,
});
const dispatchToProps = (dispatch) => ({
    updateMode: bindActionCreators(ActionsMonoDefault.update, dispatch),
    sendMode: bindActionCreators(ActionsMonoDefault.send, dispatch),
    activateMode: bindActionCreators(ActionsMonoDefault.activate, dispatch),
});


@connect(stateToProps,dispatchToProps)
class DefaultMonoModeSetup extends Component {

    constructor(props){
        super(props);
        this.props.updateMode();
        this.state = {
            displayedSoftTime: this.props.mode.softTime,
            displayedBrightness: this.props.mode.brightness,
        }
    }

    componentWillReceiveProps(newProps){
        if (this.props.mode != newProps.mode) {
            this.setState({
                displayedSoftTime: newProps.mode.softTime,
                displayedBrightness: newProps.mode.brightness,
            })
        }
    }


    render() {
        return (
            <div className="strip-mode-page mode-mono-default">
                <div className="mode-mono-default__slider-ctr">
                    <Typography id="label">Яркость</Typography>
                    <Slider min={0}
                            max={1023}
                            value={this.state.displayedBrightness}
                            onChange={::this.onChangeBrightness}
                            className="mode-mono-default__slider-ctr__slider"
                    />
                </div>
                <div className="mode-mono-default__input">
                    <FormControl className="mode-mono-default__input__form-control">
                        <InputLabel htmlFor="name-helper">Плавное переключение</InputLabel>
                        <Input type="number" id="name-helper" value={this.state.displayedSoftTime} onChange={::this.onChangeSoftTime} />
                        <FormHelperText id="name-helper-text">В миллисекундах</FormHelperText>
                    </FormControl>
                </div>
                <Button variant="contained" className="mode-mono-default__button" onClick={::this.onClickActivate}>
                    Включить режим
                </Button>
            </div>
        )
    }

    onClickActivate() {
        this.props.activateMode(this.props.mode);
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


    onChangeSoftTime(event) {
        const time = event.target.value;
        this.setState({...this.state, displayedSoftTime: time});
        this.sendSoftTime()
    }
    @Debounce(500)
    sendSoftTime(time) {
        const mode = this.props.mode.setSoftTime(time);
        this.props.sendMode(mode);
    }

}

export {DefaultMonoModeSetup}
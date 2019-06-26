import React, { Component } from 'react'
import {connect} from "react-redux";
import {CircleColorPicker} from "../../../../utils/CircleColorPicker.view";
import {bindActionCreators} from "redux";
import {ActionsRGBDefault} from "../../../../../actions/main-light.actions";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import {Debounce} from "../../../../../decorators/debounce.decorator";


const stateToProps = (state) => ({
    mode: state.mainLight.rgbDefault,
});
const dispatchToProps = (dispatch) => ({
    updateMode: bindActionCreators(ActionsRGBDefault.update, dispatch),
    sendMode: bindActionCreators(ActionsRGBDefault.send, dispatch),
    activateMode: bindActionCreators(ActionsRGBDefault.activate, dispatch),
});


@connect(stateToProps,dispatchToProps)
class DefaultRGBModeSetup extends Component {

    constructor(props){
        super(props);
        this.props.updateMode();
        this.state = {
            displayedSoftTime: this.props.mode.softTime,
        }
    }

    componentWillReceiveProps(newProps){
        if (this.props.mode != newProps.mode) {
            this.setState({
                displayedSoftTime: newProps.mode.softTime,
            })
        }
    }

    render() {
        return (
            <div className="strip-mode-page mode-rgb-default">
                <CircleColorPicker onSelectColor={::this.onChangeColor} color={`#${this.modeHexColor}`}/>
                <div className="mode-rgb-default__input" onClick={() => this.props.updateMode()}>
                    <FormControl className="mode-rgb-default__input__form-control">
                        <InputLabel htmlFor="name-helper">Плавное переключение</InputLabel>
                        <Input type="number" id="name-helper" value={this.state.displayedSoftTime} onChange={::this.onChangeSoftTime} />
                        <FormHelperText id="name-helper-text">В миллисекундах</FormHelperText>
                    </FormControl>
                </div>
                <Button variant="contained" className="mode-rgb-default__button" onClick={::this.onClickActivate}>
                    Включить режим
                </Button>
            </div>
        )
    }

    get modeHexColor() {
        const {red, green, blue} = this.props.mode;
        return [red,green,blue]
            .map(number => number >= 1020 ? 255 : number/4)
            .map(number => number.toString(16))
            .map(hexNumber => hexNumber.length < 2 ? "0"+hexNumber : hexNumber)
            .join("");
    }

    onClickActivate() {
        this.props.activateMode(this.props.mode);
    }

    onChangeColor(color) {
        const {r,g,b} = color.rgb;
        const mode = this.props.mode.setFields({red: r*4, green: g*4, blue: b*4});
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

export {DefaultRGBModeSetup}
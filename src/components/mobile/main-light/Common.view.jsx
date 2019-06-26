import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import connect from "react-redux/es/connect/connect";
import {bindActionCreators} from "redux";
import {ActionsCommonLight, ActionsRGBDefault, ActionsMonoDefault} from "../../../actions/main-light.actions";

const stateToProps = (state) => ({
    commonLight: state.mainLight.common,
    rgbMode: state.mainLight.rgbDefault,
    monoMode: state.mainLight.monoDefault,
});
const dispatchToProps = (dispatch) => ({
    turnLightOn: bindActionCreators(ActionsCommonLight.turnOn, dispatch),
    turnLightOff: bindActionCreators(ActionsCommonLight.turnOff, dispatch),
    updateLightInfo: bindActionCreators(ActionsCommonLight.update, dispatch),
    sendRGB: bindActionCreators(ActionsRGBDefault.send, dispatch),
    activateRGB: bindActionCreators(ActionsRGBDefault.activate, dispatch),
    sendMono: bindActionCreators(ActionsMonoDefault.send, dispatch),
    activateMono: bindActionCreators(ActionsMonoDefault.activate, dispatch),
});


@connect(stateToProps,dispatchToProps)
export class Common extends Component {

    constructor(props){
        super(props);
        this.updateMode();
    }

    componentDidMount(){
        this.updateInterval = setInterval(::this.updateMode,973)
    }

    componentWillUnmount(){
        clearInterval(this.updateInterval);
    }

    get monoLedColor(){
        return `rgba(0,0,0, ${1-this.props.commonLight.white/1024})`
    }

    get rgbLedColor(){
        const {red,green,blue} = this.props.commonLight;
        return `rgb(${red/4},${green/4},${blue/4})`
    }

    render() {
        return (
            <div className="page-common">
                <div className="page-common__strip page-common__strip_mono"
                     style={{backgroundColor: this.monoLedColor}}
                     onClick={::this.switchMono}
                     title="Переключить"
                >
                </div>
                <div className="page-common__strip page-common__strip_rgb"
                     style={{backgroundColor: this.rgbLedColor}}
                     onClick={::this.switchRGB}
                     title="Переключить"
                >
                </div>
                <Button variant="contained"
                        className="page-common__button page-common__button_on"
                        onClick={::this.turnLightOn}
                >
                    Включить свет
                </Button>
                <Button variant="contained"
                        className="page-common__button page-common__button_off"
                        onClick={::this.turnLightOff}
                >
                    Выключить свет
                </Button>
            </div>
        )
    }

    updateMode(){
        this.props.updateLightInfo();
    }

    turnLightOn(){
        this.props.turnLightOn()
    }

    turnLightOff(){
        this.props.turnLightOff()
    }

    switchRGB(){
        let {red,green,blue} = this.props.commonLight;
        if (red == 0 && green == 0 && blue == 0) [red,green,blue] = new Array(3).fill(1024);
        else [red,green,blue] = new Array(3).fill(0);
        const mode = this.props.rgbMode.setFields({red,green,blue});
        this.props.sendRGB(mode);
        this.props.activateRGB(mode);
    }

    switchMono(){
        const val = this.props.commonLight.white ? 0 : 1024;
        const mode = this.props.monoMode.setBrightness(val);
        this.props.sendMono(mode);
        this.props.activateMono(mode);
    }
}

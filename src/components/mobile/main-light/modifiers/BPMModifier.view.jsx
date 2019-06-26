import React, { Component } from 'react'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import IconMicrophone from '@material-ui/icons/Mic'
import IconTouch from '@material-ui/icons/TouchApp'
import {ActionsBPMModifier, ActionsNoModifier} from "../../../../actions/main-light.actions";
import {Debounce, PostDebounce} from "../../../../decorators/debounce.decorator";
import {MicrophoneBpmRecognizer} from "../../../utils/bpm/MicrophoneBpmRecognizer";
import {sagaNoModifiersActionCreator} from "../../../../actions/saga.actions";


const stateToProps = (state) => ({
    modifier: state.mainLight.bpmModifier,
    mod: state.mainLight.modifier,
});
const dispatchToProps = (dispatch) => ({
    updateModifier: bindActionCreators(ActionsBPMModifier.update, dispatch),
    sendModifier: bindActionCreators(ActionsBPMModifier.send, dispatch),
    activateModifier: bindActionCreators(ActionsBPMModifier.activate, dispatch),
    sendStart: bindActionCreators(ActionsBPMModifier.start, dispatch),
    disableModifier: bindActionCreators(ActionsNoModifier.activate, dispatch),
    disableModifiers: bindActionCreators(sagaNoModifiersActionCreator, dispatch),
});

@connect(stateToProps,dispatchToProps)
class BPMModifier extends Component {

    MicBPMComponent = <MicrophoneBpmRecognizer onBPM={::this.onGetBPM}/>;

    constructor(props){
        super(props);
        this.props.updateModifier();
        this.state = {
            displayedBPM: this.props.modifier.bpm,
            bpmComponent: undefined,
        }
    }

    componentWillReceiveProps(newProps){
        console.log(newProps.modifier);
        if (this.props.modifier != newProps.modifier) {
            this.setState({
                displayedBPM: newProps.modifier.bpm,
            })
        }
    }

    render() {
        return (
            <div className="strip-mode-page modifier-bpm">
                <div className="modifier-bpm__input">
                    <FormControl className="modifier-bpm__input__form-control">
                        <InputLabel htmlFor="name-helper">BPM</InputLabel>
                        <Input type="number" id="name-helper" value={this.state.displayedBPM} onChange={::this.onChangeTextBPM} />
                        <FormHelperText id="name-helper-text">Ударов в минуту</FormHelperText>
                    </FormControl>
                </div>
                <Button variant="contained" className="modifier-bpm__button" onClick={::this.activateModifier}>
                    Включить режим
                </Button>
                <Button variant="contained" className="modifier-bpm__button" onClick={::this.sendStart}>
                    Вот сейчас!
                </Button>
                <Button variant="contained"
                        className="modifier-bpm__button"
                        onClick={this.toggleBPMComponent.bind(this,this.MicBPMComponent)}
                >
                    <IconMicrophone/> Определить BPM
                </Button>
                <Button variant="contained"
                        className="modifier-bpm__button"
                >
                    <IconTouch/> Tap-Tap-Tap
                </Button>
                <Button variant="contained"
                        className="modifier-bpm__button"
                        onClick={this.disableAllModifiers}
                >
                    <IconTouch/> Disable-all
                </Button>
                {this.state.bpmComponent}
                {'mod = ' + this.props.mod}
            </div>
        )
    }

    @PostDebounce(200)
    sendStart(){
        this.props.sendStart();
    }

    activateModifier() {
        this.props.activateModifier();
    }

    onChangeTextBPM(event) {
        const value = event.target.value;
        this.setState({...this.state, displayedBPM: value});
        this.sendBPM(value);
    }
    @Debounce(350)
    sendBPM(bpm){
        const modifier = this.props.modifier.setBpm(bpm);
        this.props.sendModifier(modifier);
    }

    onGetBPM(bpm){
        if (bpm == null) this.props.disableModifier();
        else {
            this.activateModifier();
            this.sendBPM(bpm)
        }
    }

    toggleBPMComponent(component) {
        const newComponent = this.state.bpmComponent == component ? null : component;
        this.setState({...this.state, bpmComponent: newComponent})
    }

    disableAllModifiers = () => {
        this.props.disableModifiers();
    }
}

export {BPMModifier}
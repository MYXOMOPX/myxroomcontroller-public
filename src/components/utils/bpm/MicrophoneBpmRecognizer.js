import React, { Component } from 'react'
import {BPMRecognizer} from "../../../api/BPMRecognizer";
import ImageMic from "@material-ui/icons/Mic";
import classnames from "classnames";


export class MicrophoneBpmRecognizer extends Component {

    constructor(props){
        super(props);
        this.state = {
            recording: false,
            bpm: null,
        };
        this.bpmRecognizer = new BPMRecognizer();
        this.bpmRecognizer.onBPM = (bpm) => this.onBPM(bpm);
        this.bpmRecognizer.onNoBPM = () => this.onBPM(null);

    }

    onBPM(bpm){
        this.setState({...this.state, bpm:bpm});
        this.props.onBPM(bpm);
    }

    async toggleRecording(){
        if (!this.bpmRecognizer.isInited) {
            await this.bpmRecognizer.init()
        }
        if (this.state.recording) {
            this.bpmRecognizer.stop();
        } else {
            this.bpmRecognizer.start();
        }
        this.setState({...this.state,recording: !this.state.recording})
    }

    render() {
        return (
            <div className="bpm-mic-circle" onClick={::this.toggleRecording}>
                <div className={classnames("bpm-mic-circle__sub", {record: this.state.recording})}>
                </div>
                <div className="bpm-mic-circle__bpm-text">
                    {this.state.bpm || "~~~"}
                </div>
                <div className={classnames("bpm-mic-circle__icon-container", {record: this.state.recording})}>
                    <ImageMic className="bpm-mic-circle__icon-container__icon"/>
                </div>
            </div>
        )
    }

    componentWillUnmount(){
        if (this.bpmRecognizer.isStarted) this.bpmRecognizer.stop();
    }
}
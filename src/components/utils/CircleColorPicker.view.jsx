import React, { Component } from 'react'
import { ChromePicker  } from 'react-color'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';


class CircleColorPicker extends Component {

    constructor(props){
        super(props);
        this.state = {dialogOpened: false, selectedColor: this.props.color || "#000"}
    }

    componentWillReceiveProps(newProps){
        if(newProps.color != this.props.color) this.setState({...this.state, selectedColor: newProps.color })
    }

    get circleStyle() {
        return {
            backgroundColor: this.state.selectedColor,
            color: getTextColorFor(this.state.selectedColor)
        }
    }

    render() {
        console.log("Re-render circle", this.state.selectedColor)
        return (
            <div className="color-picker">
                <div className="color-picker__circle" style={this.circleStyle} onClick={::this.openDialog}>
                    <div className="color-picker__circle__text">
                        Нажмите, чтобы выбрать цвет
                        <br/>
                        <br/>
                        {this.state.selectedColor.toUpperCase()}
                    </div>
                </div>
                {this.renderDialog()}
            </div>
        )
    }

    closeDialog(){
        this.setState({...this.state, dialogOpened: false});
    }

    openDialog(){
        this.setState({...this.state, dialogOpened: true});
    }

    onSelectColor(color){
        this.setState({...this.state, selectedColor: color.hex});
        this.props.onSelectColor(color);
    }

    renderDialog() {
        return (
            <Dialog className="color-picker__dialog" classes={{}} open={this.state.dialogOpened} onClose={::this.closeDialog}>
                <DialogTitle className="color-picker__dialog__title" classes={{}}>Выберите цвет</DialogTitle>
                <div className="color-picker__dialog__body">
                    <ChromePicker
                        className="color-picker__dialog__body__picker"
                        color={this.state.selectedColor}
                        disableAlpha={true}
                        onChangeComplete={ ::this.onSelectColor }
                    />
                    <Button variant="contained" color="primary"
                            className="color-picker__dialog__body__button"
                            onClick={::this.closeDialog}
                    >
                        ОК
                    </Button>
                </div>
            </Dialog>
        )
    }

}

CircleColorPicker.propTypes = {
    onSelectColor: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired
};

function getTextColorFor(hex) {
    hex = hex.slice(1);
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.slice(0, 2), 16),
          g = parseInt(hex.slice(2, 4), 16),
          b = parseInt(hex.slice(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
        ? '#000000'
        : '#FFFFFF';
}

export {CircleColorPicker}
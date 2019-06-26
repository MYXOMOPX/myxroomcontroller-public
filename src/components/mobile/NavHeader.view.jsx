import React, { Component } from 'react'
import {connect} from "react-redux";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import * as Colors from "@material-ui/core/es/colors/index";
import bindActionCreators from "redux/src/bindActionCreators";
import {ActionsSideMenu} from "../../actions/ui.actions";

const dispatchToProps = (dispatch) => ({
    toggleSideMenu: bindActionCreators(ActionsSideMenu.toggle, dispatch),
});


@connect(null,dispatchToProps)
class NavHeader extends Component {


    render() {
        return (
            <AppBar position="fixed" className="appbar">
                <Toolbar className="appbar__toolbar">
                    <IconButton onClick={this.props.toggleSideMenu} className="appbar__toolbar__menu-icon" color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" className="appbar__toolbar__title">
                        MyxRoomController
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }

}

export {NavHeader}
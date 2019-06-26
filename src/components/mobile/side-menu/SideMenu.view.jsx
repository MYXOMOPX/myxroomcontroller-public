import React, { Component } from 'react'
import {connect} from "react-redux";
import sideMenuStructure from "./side-menu-sturctore.json"
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import IconBlurOn from '@material-ui/icons/BlurOn';
import IconBrightness5 from '@material-ui/icons/Brightness5';
import IconAssessment from '@material-ui/icons/AssessmentOutlined';
import IconInfo from '@material-ui/icons/InfoOutlined';
import { replace } from 'connected-react-router'
import bindActionCreators from "redux/src/bindActionCreators";
import {ActionsSideMenu} from "../../../actions/ui.actions";
import classnames from "classnames"

const ICONS = {
    blurOn: <IconBlurOn/>,
    sun: <IconBrightness5/>,
    assessment: <IconAssessment/>,
    info: <IconInfo/>
};

const stateToProps = (state) => ({
    menuOpened: state.ui.sideMenuOpened,
    currentPathname: state.router.location.pathname,
});
const dispatchToProps = (dispatch) => ({
    toggleMenu: bindActionCreators(ActionsSideMenu.toggle, dispatch),
    goToPage: bindActionCreators(replace, dispatch),
});


@connect(stateToProps,dispatchToProps)
class SideMenu extends Component {

    constructor(props){
        super(props);

        this.state = {
            containers: {}
        };
        this.autoOpenCurrentContainers(this.props.currentPathname,"silent")
    }

    componentWillReceiveProps(newProps){
        if (newProps.currentPathname != this.props.currentPathname) {
            if( this.props.menuOpened == true) this.autoOpenCurrentContainers(newProps.currentPathname);
        } else if (newProps.menuOpened != this.props.menuOpened && newProps.menuOpened == true) {
            this.autoOpenCurrentContainers(this.props.currentPathname);
        }

    }

    autoOpenCurrentContainers(currentUrlPath, silent = false) {
        const openedContainers = {};
        function openChilds(list, parentUrlPath = "", parentContainerPath = "root") {
            list
                .filter(x => x.type == "container")
                .filter(x => x.path != null)
                .forEach(el => {
                    const index = currentUrlPath.indexOf(parentUrlPath+el.path);
                    if (index == 1 || index == 0) {
                        openedContainers[parentContainerPath +"-"+ el.name] = true;
                        console.log("Toggling",parentContainerPath +"-"+ el.name);
                        openChilds(el.childs, el.path, parentContainerPath+"-"+el.name);
                    }
                })
        }
        openChilds(sideMenuStructure);
        const newContainers = {...this.state.containers, ...openedContainers};
        const newState = {...this.state, containers: newContainers};
        if (silent) this.state = newState;
        else this.setState(newState);
    }

    render() {
        return (
            <SwipeableDrawer anchor="left" open={this.props.menuOpened} onClose={::this.toggleMenu} onOpen={::this.toggleMenu}>
                <List classes={{}}>
                    {this.renderListItems(sideMenuStructure)}
                </List>
            </SwipeableDrawer>
        )
    }

    getIconFor(element){
        return ICONS[element.icon];
    }

    toggleMenu(){
        this.state = {...this.state, containers: {}}; // Жесткий хак. Не обновляем стейт, т.к. позже его обновит redux (через props)
        this.props.toggleMenu();
    }

    renderListItems(list, containerName = "root") {
        return list.map(((element,index) => {
            const key = containerName+"-"+(element.name||`unnamed-${index}`);
            switch (element.type) {
                case "category": return this.renderCategory(element,key);
                case "container": return this.renderContainer(element,key);
                case "link": return this.renderLink(element,key);
                case "divider": return this.renderDivider(element,key);
                default: return "Default"
            }
        }));
    }

    renderCategory(element,key) {
        return (
            <ListItem key={key} disabled>
                {element.name}
            </ListItem>
        )
    }

    getContainerOpened(containerKey) {
        return this.state.containers[containerKey]

    }

    toggleContainer(containerKey) {
        const containers = this.state.containers;
        let newContainers = {...containers};
        newContainers[containerKey] = !this.state.containers[containerKey];
        this.setState({...this.state, containers: newContainers})
    }

    renderContainer(element,key) {
        const icon = this.getIconFor(element);
        return ([
            <ListItem key={`${key}-button`} button onClick={this.toggleContainer.bind(this,key)}>
                {icon}
                <div style={{paddingLeft: 5}}>{element.name}</div>
            </ListItem>
            ,
            <Collapse key={`${key}-collapse`}  component={"li"} in={this.getContainerOpened(key,element.path)}>
                <div style={{paddingLeft: 15, fontSize: "95%"}}>
                    <List>
                        {this.renderListItems(element.childs,key)}
                    </List>
                </div>
            </Collapse>

        ])
    }


    clickLink(link){
        this.toggleMenu();
        this.props.goToPage(link);
    }
    renderLink(element,key) {
        const isCurrentPage = (element.link == this.props.currentPathname);
        const onClickLink = this.clickLink.bind(this,element.link);
        const icon = this.getIconFor(element);
        return (
            <ListItem key={key}
                      button
                      onClick={onClickLink}
                      className={classnames({"link-active": isCurrentPage})}
            >
                {icon}<span style={{paddingLeft: 5}}>{element.name}</span>
            </ListItem>
        )
    }

    renderDivider(element, key) {
        return (<ListItem key={key} divider={true} />)
    }
}

export {SideMenu}
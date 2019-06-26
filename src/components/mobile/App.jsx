import React, { Component } from 'react'
import {NavHeader} from "./NavHeader.view";
import {DefaultRGBModeSetup} from "./main-light/modes/rgb/DefaultRGBModeSetup.view";
import {Route} from "react-router-dom";
import {DefaultMonoModeSetup} from "./main-light/modes/mono/DefaultMonoModeSetup.view";
import {SideMenu} from "./side-menu/SideMenu.view";
import {RainbowRGBModeSetup} from "./main-light/modes/rgb/RainbowRGBModeSetup.view";
import {MainPage} from "./MainPage.view";
import {Common} from "./main-light/Common.view";
import {BPMModifier} from "./main-light/modifiers/BPMModifier.view";



export class App extends Component {
    render() {
        return (
            <div className="page">
                <NavHeader/>
                <SideMenu/>
                <div className="page__body">
                    <Route exact path="/" component={MainPage} />
                    <Route path="/myx/main/common" component={Common} />
                    <Route path="/myx/main/rgb/default" component={DefaultRGBModeSetup} />
                    <Route path="/myx/main/rgb/rainbow" component={RainbowRGBModeSetup} />
                    <Route path="/myx/main/mono/default" component={DefaultMonoModeSetup} />
                    <Route path="/myx/main/modifier/bpm" component={BPMModifier} />
                </div>
            </div>
        )
    }
}


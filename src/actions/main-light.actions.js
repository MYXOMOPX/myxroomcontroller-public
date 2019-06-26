/**
 * Created by MYXOMOPX on 031 31.07.18.
 */
import {ACTION_MODE_RGBDefault_UPDATE, ACTION_MODE_MonoDefault_UPDATE, ACTION_COMMON_LIGHT_UPDATE,
    ACTION_MODE_RGBRainbow_UPDATE, ACTION_MODIFIER_BPM_UPDATE
} from "../constants/main-light.constant";
import {DefaultRGBMode} from "../api/model/strip-modes/DefaultRGBMode";
import {DefaultMonoMode} from "../api/model/strip-modes/DefaultMonoMode";
import {RainbowRGBMode} from "../api/model/strip-modes/RainbowRGBMode";
import {CommonLight} from "../api/model/CommonLight";
import {BPMModifier} from "../api/model/modifier/BPMModifier";
import {NoModifier} from "../api/model/modifier/NoModifier";


function SettingsModelActions(modelClass, actionType) {
    const serverUpdateData = (instance) => (dispatch) => {
        dispatch({
            type: actionType,
            payload: instance,
        })
    };

    const update = () => async (dispatch) => {
        const mode = await new modelClass().updateSettings();
        serverUpdateData(mode)(dispatch);
        return mode;
    };

    const send = (instance) => async (dispatch) => {
        const mode = await instance.sendSettings();
        serverUpdateData(mode)(dispatch);
        return mode;
    };

    const activate = (instance) => async (dispatch) => {
        await (instance || new modelClass()).activate();
    };

    return {
        send, update, activate, serverUpdateData, modelClass, actionType
    }
}

export const ActionsRGBDefault = new SettingsModelActions(DefaultRGBMode,ACTION_MODE_RGBDefault_UPDATE);
export const ActionsRGBRainbow = new SettingsModelActions(RainbowRGBMode,ACTION_MODE_RGBRainbow_UPDATE);
export const ActionsMonoDefault = new SettingsModelActions(DefaultMonoMode,ACTION_MODE_MonoDefault_UPDATE);

export const ActionsBPMModifier = new SettingsModelActions(BPMModifier,ACTION_MODIFIER_BPM_UPDATE);
ActionsBPMModifier.start = (bpm) => async (dispatch) => {
    const mode = await new ActionsBPMModifier.modelClass().start();
    ActionsBPMModifier.serverUpdateData(mode)(dispatch);
    return mode;
};

export const ActionsNoModifier = {
    activate: (instance) => async (dispatch) => {
        await new NoModifier().activate();
    }
};



export const ActionsCommonLight = {
    update: () => async (dispatch) => {
        const light = await new CommonLight().updateSettings();
        ActionsCommonLight.serverUpdateData(light)(dispatch);
        return light;
    },

    turnOn: (currentMode) => async (dispatch) => {
        const mode = await new CommonLight().turnOn();
        ActionsCommonLight.serverUpdateData(mode)(dispatch);
        return mode;
    },

    turnOff: (currentMode) => async (dispatch) => {
        const mode = await new CommonLight().turnOff();
        ActionsCommonLight.serverUpdateData(mode)(dispatch);
        return mode;
    },

    serverUpdateData: (data) => (dispatch) => {
        dispatch({
            type: ACTION_COMMON_LIGHT_UPDATE,
            payload: data,
        });
    }
};
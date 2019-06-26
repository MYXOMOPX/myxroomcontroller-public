import {DefaultRGBMode} from "../api/model/strip-modes/DefaultRGBMode";
import {RainbowRGBMode} from "../api/model/strip-modes/RainbowRGBMode";
import {DefaultMonoMode} from "../api/model/strip-modes/DefaultMonoMode";
import {ACTION_MODE_RGBDefault_UPDATE, ACTION_MODE_RGBRainbow_UPDATE, ACTION_MODE_MonoDefault_UPDATE,
    ACTION_COMMON_LIGHT_UPDATE, ACTION_MODIFIER_BPM_UPDATE
} from "../constants/main-light.constant";
import {CommonLight} from "../api/model/CommonLight";
import {BPMModifier} from "../api/model/modifier/BPMModifier";


const initialState = {
    rgbDefault: new DefaultRGBMode(),
    rgbRainbow: new RainbowRGBMode(),
    monoDefault: new DefaultMonoMode(),
    bpmModifier: new BPMModifier(),
    common: new CommonLight()
};

export function mainLightReducer(state = initialState, action){
    switch (action.type) {
        case ACTION_MODE_RGBDefault_UPDATE: return {...state, rgbDefault: action.payload};
        case ACTION_MODE_RGBRainbow_UPDATE: return {...state, rgbRainbow: action.payload};
        case ACTION_MODIFIER_BPM_UPDATE: return {...state, bpmModifier: action.payload};
        case ACTION_MODE_MonoDefault_UPDATE: return {...state, monoDefault: action.payload};
        case ACTION_COMMON_LIGHT_UPDATE: return {...state, common: action.payload};
        default: return {...state}
    }
}
import {Model} from "./Model";
import {NODEMCU_CONNECTOR} from "./../HttpConnector";
import {ImmutableMethod} from "./../../decorators/immutable/immutable-model.decorator";
import {ImmutableField} from "../../decorators/immutable/immutable-model.decorator";
import {Parse} from "../../decorators/json/parse.decorator";

export class CommonLight extends Model {


    @ImmutableField() @Parse("r")
    red = 0;

    @ImmutableField() @Parse("g")
    green = 0;

    @ImmutableField() @Parse("b")
    blue = 0;

    @ImmutableField() @Parse("w")
    white = 0;

    @ImmutableField() @Parse()
    rgbMode;

    @ImmutableField() @Parse()
    monoMode;

    @ImmutableField() @Parse()
    stateModifier = 0;

    @ImmutableField() @Parse(Boolean)
    rgbButton = false;

    @ImmutableField() @Parse(Boolean)
    monoButton = false;

    @ImmutableMethod()
    async updateSettings(){
        const responseData = await NODEMCU_CONNECTOR.get(`info`);
        return this._updateData(responseData);
    }

    @ImmutableMethod()
    async turnOn(){
        const responseData = await NODEMCU_CONNECTOR.post(`turnOn`);
        ["r","g","b","w"].forEach(x => responseData[x] = 1024); // Небольшой костыль. С сервера данные не приходят.
        return this._updateData(responseData);
    }

    @ImmutableMethod()
    async turnOff(){
        const responseData = await NODEMCU_CONNECTOR.post(`turnOff`);
        ["r","g","b","w"].forEach(x => responseData[x] = 0); // Небольшой костыль. С сервера данные не приходят.
        return this._updateData(responseData);
    }
}
import {Parse} from "../../../decorators/json/parse.decorator";
import {ImmutableField, ImmutableMethod} from "../../../decorators/immutable/immutable-model.decorator";
import {Serialize} from "../../../decorators/json/serialize.decorator";
import {SettingsModel} from "../SettingsModel";
import {NODEMCU_CONNECTOR} from "../../HttpConnector";

export class BPMModifier extends SettingsModel {
    path = "Modifier/BPM";
    name = "BPM";

    @ImmutableField() @Serialize() @Parse()
    bpm = 60;

    @ImmutableMethod()
    async start(){
        const responseData = await NODEMCU_CONNECTOR.post(`${this.path}/start`);
        return this._updateData(responseData);
    }
}
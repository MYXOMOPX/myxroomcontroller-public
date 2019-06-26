import {Parse} from "../../../decorators/json/parse.decorator";
import {ImmutableField, ImmutableMethod} from "../../../decorators/immutable/immutable-model.decorator";
import {Serialize} from "../../../decorators/json/serialize.decorator";
import {SettingsModel} from "../SettingsModel";
import {NODEMCU_CONNECTOR} from "../../HttpConnector";

export class NoModifier {
    path = "Modifier/NO";
    name = "NO";


    activate = async () => {
        const responseData = await NODEMCU_CONNECTOR.post(`${this.path}`);
        return responseData;
    }
}
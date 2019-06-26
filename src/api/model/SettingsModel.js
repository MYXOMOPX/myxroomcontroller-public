import {Model} from "./Model";
import {NODEMCU_CONNECTOR} from "./../HttpConnector";
import {ImmutableMethod} from "./../../decorators/immutable/immutable-model.decorator";

export class SettingsModel extends Model {
    path = "Change/Me1";
    name = "ChangeMeToo";

    @ImmutableMethod()
    async sendSettings(){
        const data = this._serializeData();
        const responseData = await NODEMCU_CONNECTOR.post(`${this.path}/set`,data);
        return this._updateData(responseData);
    }

    @ImmutableMethod()
    async updateSettings(){
        const responseData = await NODEMCU_CONNECTOR.get(`${this.path}/info`);
        return this._updateData(responseData);
    }

    @ImmutableMethod()
    async activate(){
        const responseData = await NODEMCU_CONNECTOR.post(`${this.path}`);
        // return this._updateData(responseData);
    }
}
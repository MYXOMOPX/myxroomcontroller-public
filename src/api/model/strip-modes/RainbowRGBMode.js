import {Parse} from "../../../decorators/json/parse.decorator";
import {ImmutableField} from "../../../decorators/immutable/immutable-model.decorator";
import {Serialize} from "../../../decorators/json/serialize.decorator";
import {SettingsModel} from "../SettingsModel";

export class RainbowRGBMode extends SettingsModel {
    path = "RGB/Rainbow";
    name = "Rainbow";
    displayName = "Радуга";

    @ImmutableField() @Serialize() @Parse()
    period = 5000;

    @ImmutableField() @Serialize() @Parse()
    brightness = 1;

    @ImmutableField() @Serialize() @Parse()
    depth = 1;
}
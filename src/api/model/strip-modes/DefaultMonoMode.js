import {Parse} from "../../../decorators/json/parse.decorator";
import {ImmutableField} from "../../../decorators/immutable/immutable-model.decorator";
import {Serialize} from "../../../decorators/json/serialize.decorator";
import {SettingsModel} from "../SettingsModel";

export class DefaultMonoMode extends SettingsModel {
    path = "Mono/Default";
    name = "Default";
    displayName = "Стандартный";

    @ImmutableField() @Serialize("w") @Parse("w")
    brightness = 0;

    @ImmutableField() @Serialize() @Parse()
    softTime = 1;
}

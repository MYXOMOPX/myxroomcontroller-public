import {Parse} from "../../../decorators/json/parse.decorator";
import {ImmutableField} from "../../../decorators/immutable/immutable-model.decorator";
import {Serialize} from "../../../decorators/json/serialize.decorator";
import {SettingsModel} from "../SettingsModel";

export class DefaultRGBMode extends SettingsModel {
    path = "RGB/Default";
    name = "Default";
    displayName = "Стандартный";

    @ImmutableField() @Serialize("r") @Parse("r")

    red = 0;
    @ImmutableField() @Serialize("g") @Parse("g")

    green = 0;
    @ImmutableField() @Serialize("b") @Parse("b")

    blue = 0;
    @ImmutableField() @Serialize() @Parse()

    softTime = 1;
}
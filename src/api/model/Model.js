import {PARSE_MAP} from "../../decorators/json/parse.decorator";
import {ImmutableModel} from "../../decorators/immutable/immutable-model.decorator";
import {SERIALIZE_MAP} from "../../decorators/json/serialize.decorator";


@ImmutableModel()
class Model {
    /**
     * Обновляет объект с помощью json-данных
     * @see Parse
     * @param {object} data - json данные
     * @chain
     */
    _updateData(data) {
        // const cached = this.$data;
        const parserMap = Object.create(null);
        let obj = this;
        let sourceObject = this;
        while (obj = Object.getPrototypeOf(obj)) {
            const map = obj[PARSE_MAP];
            if (!map) continue;
            for (const val in map) {
                parserMap[val] = parserMap[val] || map[val];
            }
        }

        function parseValue(key,value){
            if (typeof value === "object") for (const subkey in value)  {
                const newKey = key ? key+"."+subkey : subkey;
                parseValue(newKey,value[subkey]);
            }
            if (!key) return;
            const mapDescriptor = parserMap[key];
            if (!mapDescriptor) return;
            const parse = mapDescriptor.parse;
            const result = parse.call(sourceObject,value,data,key,sourceObject);
            if (result !== undefined) sourceObject[mapDescriptor.propertyName] = result;
        }
        parseValue(null,data);
        return this;
    }

    _serializeData() {
        const serializeData = Object.create(null);
        let obj = this;
        while (obj = Object.getPrototypeOf(obj)) {
            const map = obj[SERIALIZE_MAP];
            if (!map) continue;
            for (const val in map) {
                serializeData[val] = serializeData[val] || map[val];
            }
        }
        const json = Object.create(null);

        for (const key in this) {
            const value = this[key];
            if (this[key] === undefined) continue;
            const serializeDescriptor = serializeData[key];
            if (!serializeDescriptor) continue;
            const serialize = serializeDescriptor.serialize;
            const serializedName = serializeDescriptor.serializedName;
            let result = null;
            // Если значение поля null, то на него не срабатывает функция сериализации
            if (this[key] !== null) {
                result = serialize(value,serializedName);
                if (result === undefined) continue;
            }
            // Сериализация для сложных ключей. Например assignment.status.oid
            // В этом случае, если @Serialize вернет 10, то произойдет json.assignment.status.oid = 10
            const parts = serializedName.split(".");
            let obj = json;
            for (let i = 0 ; i < parts.length-1; i++) { // Создаем нужные объекты по цепочке
                obj[parts[i]] = obj[parts[i]] || {};
                obj = obj[parts[i]]
            }
            obj[parts[parts.length-1]] = result; // В финальный ключ заносим значение
        }

        return json;
    }
}

export {Model};
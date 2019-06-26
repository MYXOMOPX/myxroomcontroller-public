const SERIALIZE_MAP = Symbol("Serialize:SERIALIZE_MAP");


/**
 * Аннотация. Используется у SD.Entity для внесения данных из json внутрь объекта
 * ` @Serialize() field = defaultValue
 * ` @Serialize(serializeFunction) field
 * ` @Serialize("jsonFieldName") field
 * ` @Serialize("jsonFieldName",serializeFunction) field
 * jsonFieldName - название, под которым будет лежать значение этого поля в json
 * serializeFunction - функция сериализации
 * Если serializeFunction вернет undefined в json ничего не занесется.
 * @param {(string|Function)} serializeParams
 * @returns {Function}
 */
function Serialize(...serializeParams) {
    const serialize = serializeParams.find(arg => typeof arg === "function") || (_=>_);
    const dataName = serializeParams.find(arg => typeof arg === "string");

    return function decorateParse(prototype, propertyName, descriptor) {
        const serializedName = dataName || propertyName;
        const map = prototype[SERIALIZE_MAP] = prototype[SERIALIZE_MAP] || Object.create(null);
        map[propertyName] = {serializedName, serialize};
        descriptor.writable = true;
        return descriptor;
    }
}

export {Serialize,SERIALIZE_MAP};
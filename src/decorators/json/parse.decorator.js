const PARSE_MAP = Symbol("Parse:PARSE_MAP");


/**
 * Аннотация. Используется у SD.Entity для внесения данных из json внутрь объекта
 * ` @Parse() field = defaultValue
 * ` @Parse(mapperFunction) field
 * ` @Parse("dataFieldName") field
 * ` @Parse("dataFieldName",mapperFunction) field
 * dataFieldName - название поля в json данных, приходящих с сервера
 * mapperFunction - функция обработки данных перед внесением в объект
 * @param {(string|Function)} parseParams
 * @returns {Function}
 */
function Parse(...parseParams) {
    const parse = parseParams.find(arg => typeof arg === "function") || (_=>_);
    const dataName = parseParams.find(arg => typeof arg === "string");

    return function decorateParse(prototype, propertyName, descriptor) {
        const name = dataName || propertyName;
        const map = prototype[PARSE_MAP] = prototype[PARSE_MAP] || Object.create(null);
        map[name] = {propertyName, parse};
        descriptor.writable = true;
        return descriptor;
    }
}

export {PARSE_MAP,Parse};
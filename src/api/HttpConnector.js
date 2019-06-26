
class Connector {
    address;
    errorHandler;

    constructor(address, errorHandler) {
        this.address = address;
        this.errorHandler = errorHandler;
    }


    /**
     * Отправляет GET запрос к серверу. Вернет промис,
     * в котором можно работать сразу с json данными
     * @param path - относительный путь
     * @param params - параметры для get запроса
     * @param timeout - время ожидания ответа
     */
    async get(path, params, timeout) {
        return this._doRequest(path,"GET",params,null,timeout);
    }

    /**
     * Отправляет POST запрос к серверу. Вернет промис
     * в котором можно работать сразу с json данными
     * @param path - относительный путь
     * @param params - параметры для запроса
     * @param data - json данные, для отправки
     * @param timeout - время ожидания ответа
     */
    async post(path, params, data, timeout) {
        return this._doRequest(path,"POST",params,data,timeout);
    }

    /**
     * Отправляет PUT запрос к серверу. Вернет промис
     * в котором можно работать сразу с json данными
     * @param path - относительный путь
     * @param params - параметры для запроса
     * @param data - json данные, для отправки
     * @param timeout - время ожидания ответа
     */
    async put(path, params, data, timeout) {
        return this._doRequest(path,"PUT",params,data,timeout);
    }


    async _doRequest(path, method, params, data, timeout) {
        let fullPath = `${this.address}/${path}`;
        if (params) fullPath += `?${_encodeQueryData(params)}`;
        const settings = {method};
        if (data) settings["body"] = JSON.stringify(data);
        if (timeout) settings["timeout"] = timeout;

        try {
            const response = await fetch(fullPath, settings);
            return response.json();
        } catch (er) {
            if (this.errorHandler) this.errorHandler(er, {path, method, params, data, timeout});
            else throw er;
        }
    }

}


function _encodeQueryData(data) {
    return Object.keys(data)
        .map(key => `${key}=${data[key]}`)
        .join("&")
    ;
}
let nodeMcuAddress = "http://##HIDDEN##";
const isHttps = window.location.protocol === "https:";
if (isHttps) nodeMcuAddress = `##HIDDEN##`;
const NODEMCU_CONNECTOR = new Connector(nodeMcuAddress, console.warn); // "WEBPACK:IP_NODEMCU"

export {Connector, NODEMCU_CONNECTOR}
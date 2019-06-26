export function ImmutableModel() {
    return function (target) {
        target.prototype.setFields = function (opts) {
            const clone = Object.create(this);
            for (let key of Object.keys(opts)) {
                clone[key] = opts[key];
            }
            return clone;
        }
    }
}

export function ImmutableField() {
    return function (target, key, descriptor) {
        const setterKey =`set${key[0].toUpperCase()+key.slice(1)}`; // field => setField
        const getterKey =`get${key[0].toUpperCase()+key.slice(1)}`; // field => getField
        target[setterKey] = createSetter(key);
        target[getterKey] = function(){return this[key]};
        return {...descriptor, writable: true}
    }
}

export function ImmutableMethod() {
    return function (target, key) {
        const oldMethod = target[key];
        target[key] = function () {
            const clone = Object.create(this);
            return clone::oldMethod(...arguments)
        }
    }
}

function createSetter(fieldName) {
    return function (val) {
        const clone = Object.create(this);
        clone[fieldName] = val;
        return clone;
    }
}

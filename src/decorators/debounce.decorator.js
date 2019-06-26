export function Debounce(timeMs) {
    return function (target, key, descriptor) {
        return {...descriptor, value: debouncify(target[key], timeMs)}
    }
}

export function debouncify(fn, time) {
    let timeoutId = -1;
    return function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn.call(this,...arguments)
        },time)
    }
}

export function postDebouncify(fn, time) {
    let lastTimeCalled = 0;
    return function () {
        if (Date.now() - lastTimeCalled < time) return;
        lastTimeCalled = Date.now();
        fn.call(this,...arguments)
    }
}

export function PostDebounce(timeMs) {
    return function (target, key, descriptor) {
        return {...descriptor, value: postDebouncify(target[key], timeMs)}
    }
}
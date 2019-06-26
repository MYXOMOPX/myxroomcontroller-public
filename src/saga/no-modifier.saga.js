import { takeLatest, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

function* setNoModifier() {
    yield call(delay, 1000);
    console.log('saga nomod start');
    const noModifier = new NoModifier();
    const result = yield call(noModifier.activate);
    yield put({type: "SAGA_NO_MODIFIER_SUCCESS", payload: "OK"});
    yield call(delay, 1000);
    console.log('saga nomod success');
}

export function* noModifierSaga() {
    yield takeLatest('SAGA_NO_MODIFIERS', setNoModifier)
}

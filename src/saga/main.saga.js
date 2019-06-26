import { takeLatest, call, put, all } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import {NoModifier} from "../api/model/modifier/NoModifier";
import {noModifierSaga} from "./no-modifier.saga";


export function* mainSaga() {
    yield all([
        noModifierSaga(),
    ]);
}
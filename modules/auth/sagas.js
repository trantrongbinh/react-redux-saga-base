import { takeEvery, call, put, takeLatest } from 'redux-saga/effects';
import { registerAuth, loginAuth, refreshAuth } from './api';
import * as Types from './types'
import { recLoginAuth } from './actions';
import { recErrorsMessage, recSuccessMessage, recErrorMessage } from './../alert/actions';
import { setCookie, removeCookie } from './../../utils/cookie';

function* callRegisterAuth(action) {
    try {
        let user = yield call(registerAuth, action.data);
        yield call(action.router.push, '/auth/login');
        yield put(recSuccessMessage(user.data.message))
    } catch (e) {
        yield put(recErrorsMessage(e.response.data.errors))
    }
}

export function* registerAuthSaga() {
    yield takeLatest(Types.REQUEST_REGISTER_AUTH, callRegisterAuth);
}

function* callLoginAuth(action) {
    try {
        let user = yield call(loginAuth, action.data);
        if (user.data) {
            let token = user.data.token;
            setCookie("token", token);
            yield put(recLoginAuth(token));
            yield call(action.router.push, '/');
        }
    } catch (e) {
        if (e.response.data.error) {
            yield put(recErrorMessage(e.response.data.error))
        } else {
            yield put(recErrorsMessage(e.response.data.errors))
        }
    }
}

export function* loginAuthSaga() {
    yield takeLatest(Types.REQUEST_LOGIN_AUTH, callLoginAuth);
}

function* callReAuthenticate(action) {
    try {
        yield put(recLoginAuth(action));
    } catch (e) {
        console.log(e.message);
    }
}

export function* reAuthenticateSaga() {
    yield takeEvery(Types.RE_REQUEST_LOGIN_AUTH, callReAuthenticate);
}

function* callLogoutAuthenticate() {
    try {
        removeCookie("token");
        yield put(recLoginAuth(null));
    } catch (e) {
        console.log(e.message);
    }
}

export function* logoutAuthSaga() {
    yield takeLatest(Types.REQUEST_LOGOUT_AUTH, callLogoutAuthenticate);
}

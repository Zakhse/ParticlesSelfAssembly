import messages from './Messages';
import { showErrorActionName, defaultErrorMsg } from './ErrorHandlerConfig';

function errorReasonMessage(reason, { defaultMsg = defaultErrorMsg, customDict, onlyCustomDict } = {}) {
    let msg;
    if (customDict) {
        msg = customDict[reason];
    }
    if ((!customDict || !msg) && !onlyCustomDict) {
        msg = messages[reason];
    }
    return msg || defaultMsg;
}

function errorMessage(error, { defaultMsg, customDict, onlyCustomDict } = {}) {
    return errorReasonMessage(error.reason, { defaultMsg, customDict, onlyCustomDict });
}

function showErrorMessage(dispatch, error, { defaultMsg, customDict, onlyCustomDict } = {}) {
    return dispatch(showErrorActionName, errorMessage(error, { defaultMsg, customDict, onlyCustomDict }));
}

/*
    Custom dict example:
    {
        'smth_was_broken': 'Что-то сломалось',
        'action_is_not_allowed': 'Действие запрещено'
    }
 */
function catchError(dispatch, error, { defaultMsg, reject = true, onlyCustom = false, customDict } = {}) {
    if (onlyCustom && !customDict) {
        throw new SyntaxError('If \'onlyCustom\' property is used, pass \'customDict\' also!');
    }
    showErrorMessage(dispatch, error, { defaultMsg, customDict, onlyCustomDict: onlyCustom });
    if (!reject) {
        return Promise.resolve(error);
    }
    return Promise.reject(error);
}

export {
    catchError,
    showErrorMessage,
    errorMessage,
    errorReasonMessage,
};

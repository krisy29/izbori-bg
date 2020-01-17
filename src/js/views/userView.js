import { elements } from './base';

export const formToJSON = elements => {
    const data = {};
    for (let i = 0; i < 6; i++) {
        data[elements[i].name] = elements[i].value;
    }
    return data;
}

export const getLoginInput = () => {
    const data = {};
    data.email = elements.loginEmail.value;
    data.password = elements.loginPass.value;
    if (data.password.length < 7 || data.password.indexOf('password') >= 0 || data.email.indexOf('@') < 0) {
        elements.loginMessage.text('Моля, въведете валидни данни!');
    } else {
        elements.loginMessage.text('');
        return data;
    }
}

const clearLoginForm = () => {
    elements.loginEmail.value = '';
    elements.loginPass.value = '';
}

export const closeLoginForm = () => {
    clearLoginForm();
    elements.modalLogin.style.display = 'none';
}

export const afterLoginUI = (name) => {
    elements.logInBtn.style.display = 'none';
    elements.profileBtn.style.display = 'inline-block';
    const n = name.split(' ')[0];
    elements.profileBtn2.text(n);
    elements.logOutBtn.style.display = 'inline-block';
}

export const afterLogoutUI = () => {
    window.location.pathname = "";
    elements.logInBtn.style.display = 'inline-block';
    elements.profileBtn.style.display = 'none';
    elements.logOutBtn.style.display = 'none';
}

export const renderProfileData = (user) => {
    const arr = elements.readProfileInputs.get();
    arr[0].value = user.name;
    arr[1].value = user.email;
    arr[2].value = user.permanentAddress;
    arr[3].value = user.currentAddress;
    arr[4].value = user.memberOf;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].value == "undefined") {
            arr[i].value = '';
        }
    }
}
const axios = require('axios');
import User from './models/User';
import Party from './models/Party';
import * as userView from './views/userView';
import { elements } from './views/base';

const state = {};
state.user = new User();
state.party = new Party();

//Read storage and get user data
const startFromStorage = async () => {
    state.user.readStorage();
    if (!state.user.token) {
        return;
    }
    state.user.setAxiosToken();
    try {
        await state.user.readProfile();
        if (state.user.name) {
            userView.afterLoginUI(state.user.name);
        }

        await state.party.getPartyAccess();
    } catch (e) {
        alert('Няма такъв потребител!');
    }
};

//Registration
const register = () => {
    elements.regForm.submit(async function (e) {
        e.preventDefault();
        const inputs = elements.regForm.get()[0].elements;
        if (inputs[1].value.indexOf('@') < 0) {
            elements.regMessage.text('Моля, въведете валиден имейл адрес!');
        } else if (inputs[5].value.length < 7 || inputs[5].value.indexOf('password') >= 0) {
            elements.regMessage.text('Моля, въведете валидна парола!');
        } else if (inputs[5].value !== inputs[6].value) {
            elements.regMessage.text('Паролите не съвпадат!');
        } else {
            let data = userView.formToJSON(inputs);
            try {
                await state.user.createUser(data);
                state.user.setAxiosToken();
                userView.afterLoginUI(state.user.name);
                window.location.pathname = '';
                await state.party.getPartyAccess();
            } catch (er) {
                alert(er);
            }
        }
    });
};


//Login
const loginControl = async () => {
    const data = userView.getLoginInput();
    if (data) {
        try {
            await state.user.loginUser(data);
            state.user.setAxiosToken();
            if (state.user.name) {
                userView.closeLoginForm();
                userView.afterLoginUI(state.user.name);
            }
            await state.party.getPartyAccess();
        } catch (e) {
            alert(e);
        }
    }
};

//Logout
const logoutControl = async () => {
    try {
        await state.user.logOut();
        userView.afterLogoutUI();
    } catch (e) {
        alert('Неуспешен изход!');
    }
};

// Load profile data
const loadProfileData = () => {
    userView.renderProfileData(state.user);
    if (state.party.name) {
        elements.sendEmailDiv.style.display = 'flex';
    }
    elements.sendEmailBtn.click(async function (e) {
        e.preventDefault();
        try {
            await state.party.getPartyEmail();
        } catch (er) {
            alert(er);
        }
    });

    let changes = {};
    elements.readProfileInputs.change(function () {
        const key = this.name;
        const val = this.value;
        changes[key] = val;
    });
    elements.updateProfileBtn.click(async function (e) {
        e.preventDefault();
        if (!jQuery.isEmptyObject(changes)) {
            try {
                await state.user.updateProfile(changes);
                location.reload();
            } catch (er) {
                alert('Няма такъв потребител!');
            }
        }
    });
};

// Voting processes
const voteControl = () => {
    let partyName = {};
    elements.voteInputs.change(function () {
        partyName = {
            name: this.value
        };
        elements.voteSubmitBtn.removeAttr('disabled');
        elements.voteSubmitBtn.removeClass('disabled');
    });
    $('#voteSubmit').click(async function (e) {
        e.preventDefault();
        try {
            const voted = state.user.voted;
            await state.user.vote(partyName);
            await state.user.readProfile();
            if (state.user.voted !== voted) {
                elements.voteSuccessModal.click();
            }
        } catch (er) {
            alert(er);
        }

    });
};

// FAQ Accordion handling
const accordionControl = () => {
    $("#accordion").accordion({
        heightStyle: "content",
        collapsible: true,
        active: false,
        activate: function (event, ui) {
            if (!$.isEmptyObject(ui.newHeader.offset())) {
                $('html:not(:animated), body:not(:animated)').animate({ scrollTop: ui.newHeader.offset().top }, 'slow');
            }
        }
    });
};

// ----------------------- Event handlers --------------------------//

// Load
$(window).on('load', async () => {
    await startFromStorage();

    if (window.location.pathname == "/profile") {
        loadProfileData();
    }
    if (window.location.pathname == "/vote") {
        voteControl();
    }
    if (window.location.pathname == "/register") {
        register();
    }
    if (window.location.pathname == "/faq") {
        accordionControl();
    }

    if (window.location.pathname == "/archive") {
        $(window).scroll(function () {            
            elements.archiveImages.addClass('animateImage');
            // elements.archiveImages.style.display = 'block';           
        });
    }

    // Open modal
    $("#login").click(function (e) {
        e.preventDefault();
        elements.modalLogin.style.display = 'block';
    });

    // Login submit
    $('.modal-content').submit(async function (e) {
        e.preventDefault();
        loginControl();
    });

    // Close modal
    window.onclick = function (event) {
        if (event.target == elements.modalLogin && event.target !== elements.modalLoginForm || event.target == elements.loginCloseBtn) {
            userView.closeLoginForm();
        }
    };

    //Logout user
    $('#logout').click(async function (e) {
        e.preventDefault();
        logoutControl();
    });

    // Mobile nav showing
    $('.btn-mob-nav').click(function () {
        $('nav ul').toggleClass('mob-nav');
    });

    // Scroll to top
    $('#up').click(function (event) {
        $('html, body').animate({ scrollTop: 0 }, 800);
    });
});

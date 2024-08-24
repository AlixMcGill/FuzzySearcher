import api from './modules/apiCalls.js';

const apiC = new api;
const createAccBtn = document.getElementById('create-acc-button');
const newAccContainer = document.getElementById('new-account-container');

createAccBtn.addEventListener('click', () => {
    createAccountPopup(newAccContainer);
});

function createInputAndLabel(parentToAppend, labelInnerText, inputName, inputType, inputId) {
    const label = document.createElement('label');
    const input = document.createElement('input');

    label.innerText = labelInnerText;
    label.for = inputName;
    input.id = inputId;
    input.type = inputType;
    input.name = inputName;

    parentToAppend.appendChild(label);
    parentToAppend.appendChild(input);
}

function createAccountPopup(parent) {
    const newAccountWrapper = document.createElement('div');
    newAccountWrapper.id = 'new-account-wrapper';
    newAccountWrapper.classList = 'roboto-regular text-color';
    
    const newAccountHeaderContainer = document.createElement('div');
    newAccountHeaderContainer.classList = 'new-account-header-container';

    const newAccountHeaderTitle = document.createElement('p');
    newAccountHeaderTitle.classList = 'new-account-header-title';
    newAccountHeaderTitle.innerText = 'Create New Account';

    const newAccountHeaderClosing = document.createElement('span');
    newAccountHeaderClosing.className = 'material-symbols-outlined';
    newAccountHeaderClosing.id = 'close-new-account-creation';
    newAccountHeaderClosing.innerText = 'close';

    newAccountHeaderClosing.addEventListener('click', () => {
        const accWrapper = document.getElementById('new-account-container');
        accWrapper.innerHTML = '';
    })

    newAccountHeaderContainer.appendChild(newAccountHeaderTitle);
    newAccountHeaderContainer.appendChild(newAccountHeaderClosing);
    newAccountWrapper.appendChild(newAccountHeaderContainer);
 
    createInputAndLabel(newAccountWrapper, 'First Name:', 'create-account-first-name','text','create-account-first-name-id');

    createInputAndLabel(newAccountWrapper,'Last Name:','create-account-last-name','text','create-account-last-name-id');

    createInputAndLabel(newAccountWrapper,'Username:','create-account-username','text','create-account-username-id');

    createInputAndLabel(newAccountWrapper,'Password:','create-account-password','password','create-account-password-id');

    createInputAndLabel(newAccountWrapper,'Re-Enter Password:','create-account-password-reenter','password','create-account-password-reenter-id');

    const createAccountBtn = document.createElement('button');
    createAccountBtn.id = 'create-account-button';
    createAccountBtn.innerText = 'Create Account';
    createAccountBtn.addEventListener('click', () => {
        postNewAccount();
    });
    newAccountWrapper.appendChild(createAccountBtn);

    parent.appendChild(newAccountWrapper);
}

function checkMatchingPasswords(passwordOne, passwordTwo) {
    if (passwordOne === passwordTwo) {
        return true
    } else {
        window.alert('Passwords do not match.')
        return false
    }
}

async function checkExsitingUsername(username) {
    const url = `${apiC.hostAddress}/DbSearch/filter=${username}`
    try {
        const response = await fetch(url, {
           method: "GET"
        });
        
        if (response.ok) {
            window.alert('Username already exists');
            return false;
        } else {
            return true;
        }
    } catch (error) { 
        console.error(error.message);
    }
}

async function postNewAccount() {
    const firstName = document.getElementById('create-account-first-name-id').value;
    const lastName = document.getElementById('create-account-last-name-id').value;
    const username = document.getElementById('create-account-username-id').value;
    const passwordOne = document.getElementById('create-account-password-id').value;
    const passwordTwo = document.getElementById('create-account-password-reenter-id').value;
    const url = `${apiC.hostAddress}/DbSearch`
    if (checkMatchingPasswords(passwordOne, passwordTwo) && await checkExsitingUsername(username)) {
        try { 
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "firstName": `${firstName}`,
                    "lastName": `${lastName}`,
                    "userName": `${username}`,
                    "password": `${passwordOne}`
                })
            });
            if (response.ok) {
                window.alert('Account Created Please Login');
            }
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
        } catch (error) {
            console.error(error.message);
        }
    } else {
        window.alert('Cannot create new account');
    }
}

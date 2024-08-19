// Really regretting not getting js modules working
const hostAddress = 'http://localhost:5273';
checkAlreadyLoggedInAndReroute(getCookie('userJwt', 1), '/login.html')
let loggedInUser = {
    id: '',
    firstName: '',
    lastName: '',
    username: getCookie('username', 1)
}
getUsernameId(getCookie('username', 1));

function getCookie(cookieName, index) {
    return document.cookie.split('; ').find((row) => row.startsWith(`${cookieName}=`))?.split("=")[index]
}

function checkAlreadyLoggedInAndReroute(cookie, route) {
    if (!cookie) {
        window.location = `${hostAddress}${route}`;
    }
}

function populateUserAccount() {
    const userFirstName = document.getElementById('user-first-name-span');
    const userLastName = document.getElementById('user-last-name-span');
    const userUsername = document.getElementById('user-username-span');
        
    userFirstName.innerText = loggedInUser.firstName;
    userLastName.innerText = loggedInUser.lastName;
    userUsername.innerText = loggedInUser.username;
}

async function getUsernameId(usernameCookie) {
    const url = `${hostAddress}/DbSearch/filterbyusername=${usernameCookie}`;
    const jwtValue = getCookie('userJwt', 1);
    const bearer = 'Bearer ' + jwtValue;

    try {
       const response = await fetch(url,{
           method: "GET",
           headers: {
               Authorization: bearer,
               "Content-Type": "application/json"
           }
       });
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    if (response.ok) {
        const res = await response.json();
        loggedInUser.id = res[0].id
        fetchUserInformation(loggedInUser.id);
    }
    } catch (error) {
        
    }
}

async function fetchUserInformation(idToFetch) {
    const url = `${hostAddress}/DbSearch/userInformation/${idToFetch}`;
    const jwtValue = getCookie('userJwt', 1);
    const bearer = 'Bearer ' + jwtValue;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: bearer,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
    
        const usernames = await response.json();
        loggedInUser.firstName = usernames[0].firstName;
        loggedInUser.lastName = usernames[0].lastName;
        populateUserAccount()
        
    } catch (error) {
        console.error(error.message);
    }
}

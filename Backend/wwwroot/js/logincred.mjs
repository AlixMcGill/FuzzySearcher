const hostAddress = 'http://localhost:5273';
checkAlreadyLoggedInAndReroute(getCookie('userJwt', 1), '/index.html');
const username = document.getElementById("username-form");
const password = document.getElementById("password-form");
const submitBtn = document.getElementById("submit-login");

submitBtn.addEventListener('click', () => {
  sendLogin(username, password);
  cleanLoginForm(username, password);
});

function setCookie(cookieName, cookieValue, extraDays) {
    const date = new Date();
    date.setTime(date.getTime() + (extraDays * 24 * 60 * 60));
    let expires = `max-age=${date.toUTCString}`;
    document.cookie = `${cookieName}=${cookieValue};${expires};SameSite=None; Secure`;
}

function getCookie(cookieName, index) {
    return document.cookie.split('; ').find((row) => row.startsWith(`${cookieName}=`))?.split("=")[index]
}

function checkAlreadyLoggedInAndReroute(cookie, route) {
    if (cookie) {
        window.location = `${hostAddress}${route}`;
    }
}

async function sendLogin(loginUsername, loginPassword) {
    let username = loginUsername.value;
    let password = loginPassword.value;
    let url = `${hostAddress}/DbSearch/Login`;

    try {
        const response = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": `${username}`,
                "password": `${password}`
            })
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const jwt = await response.json();
        setCookie("userJwt", jwt, 15);
        setCookie("username", username, 15);
        checkAlreadyLoggedInAndReroute(getCookie('userJwt', 1), '/index.html')

    } catch (error) {
        console.error(error.message);
    }
}

function cleanLoginForm(loginUsername, loginPassword) {
  loginUsername.value = "";
  loginPassword.value = "";
}

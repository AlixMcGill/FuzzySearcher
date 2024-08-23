export default class cookies {
    getCookie(cookieName, index) {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${cookieName}=`))
            ?.split("=")[index];
    }

    setCookie(cookieName, cookieValue, extraDays) {
        const date = new Date();
        date.setTime(date.getTime() + (extraDays * 24 * 60 * 60));
        let expires = `max-age=${date.toUTCString}`;
        document.cookie = `${cookieName}=${cookieValue};${expires};SameSite=None; Secure`;
    }
}

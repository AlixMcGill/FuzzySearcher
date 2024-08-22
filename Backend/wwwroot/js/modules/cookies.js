export default class cookies {
    getCookie(cookieName, index) {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${cookieName}=`))
            ?.split("=")[index];
    }
}

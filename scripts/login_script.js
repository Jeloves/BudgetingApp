export function setSessionCookie(sessionID, minutesTillExpired) {
    const currentDateTime = new Date();
    let expires = "expires=" + new Date(currentDateTime.getTime() + minutesTillExpired * 60000).toUTCString();
    document.cookie = `name = sesh;sessionID = ${sessionID};${expires};path=/`;
    console.log("Session cookie created.")
    console.log(document.cookie)
}

export function getSessionCookie() {
    let name = 'sesh';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
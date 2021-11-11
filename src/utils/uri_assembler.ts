const BASE_MAIL_URL = "https://mail.studenti.polito.it/"

export function emailUrlGenerator(token: string):string {
    return BASE_MAIL_URL + "?_task=mail&token=" + token;
}
const BASE_APP_URL = 'https://app.didattica.polito.it/';

export async function emailUrlGenerator(
  uuid: string,
  token: string,
): Promise<string> {
  const _data = JSON.stringify({
    regID: uuid,
    token: token,
  });
  const response = await fetch(BASE_APP_URL + 'goto_webmail.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: 'data=' + encodeURIComponent(_data),
  });
  const data = await response.json();
  return data.data.url;
}

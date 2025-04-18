import finnhub from 'npm:finnhub';

const finnhub_api_key = finnhub.ApiClient.instance.authentications['ckvneppr01qq199j3130ckvneppr01qq199j313g'];
const finnhubClient = new finnhub.DefaultApi();

export {finnhubClient, finnhub_api_key};
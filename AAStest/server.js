const msRestAzure = require('ms-rest-azure');
const analysisServicesManagement = require('azure-arm-analysisservices');

const subscriptionId = 'louw.visagie@rockend.com.au';
let analysisServicesClient;

msRestAzure
  .interactiveLogin()
  .then(credentials => {
    analysisServicesClient = new analysisServicesManagement(credentials, subscriptionId);

    analysisServicesClient.servers
      .list()
      .then(servers => console.log('Retrieved analysis services servers: ', servers))
      .catch(e => {
        console.log('hello' + e, credentials);
      });
  })
  .catch(e => {
    console.log('hello' + e, credentials);
  });

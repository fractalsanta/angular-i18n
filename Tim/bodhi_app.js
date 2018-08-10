var api     = require('bodhi-driver-superagent');
var Client  = api.Client;
var Basic   = api.BasicCredential;
var Bearer  = api.BearerToken;

const uri = 'https://api.bodhi-dev.io';
const ns = 'mx_dev';
const username = 'tcarthew';
const password = 'T1m0thyc123!@#';

var client = new Client({
    'uri'           : uri,
    'namespace'     : ns,
    'credentials'   : new Basic(username, password),
    'direct'        : false
});

(() => {
    
    console.log('Sync proto v1.0....');    
    console.log('-------------------------------');
    console.log('');

    client.get('resources/Store', (err, data, response) => {
        if (err){
            console.log('************************');
            console.log('Error: ', err);            
            console.log('************************');
        }
        else {
            console.log('************************');
            console.log(`${data.length} Storees Found`);
            
            data.forEach((store) => {                               
                console.log(`Store: ${store.name} - ${store.store_number}`);
            });

            console.log('************************');            
        }
    });

})();
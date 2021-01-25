'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require('axios');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {                               //welcome function called by its intent
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {                             //fallback function called by its intent
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  function infoHandler(agent)                            //infoHandler function called by Size_Number intent
  {
     const {
       pizza_size,amount,name,phone,address
       
     } = agent.parameters;
    //passing the user's data as parameters to the spreadsheet via axios POST call
    axios.post('https://sheetdb.io/api/v1/2owcg8en7k60h',{"data":{"Size": pizza_size,"Amount": amount,"Name": name,"Phone": phone,"Address": address
           }}).then(response => {
      console.log(response.data);                      
    });
    agent.end("");
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);             //welcome intent call
  intentMap.set('Default Fallback Intent', fallback);           //fallback intent call
  intentMap.set('Size_number',infoHandler);                     //this intent takes data from the user(pizza size,name,number etc)
  agent.handleRequest(intentMap);
});

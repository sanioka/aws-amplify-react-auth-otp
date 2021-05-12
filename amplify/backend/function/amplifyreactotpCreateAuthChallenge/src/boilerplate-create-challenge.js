/* tslint:disable */
/* eslint-disable */
const AWS = require('aws-sdk');
const axios = require('axios');

exports.handler = async (event, context, callback) => {
  //Create a random number for otp
  const challengeAnswer = Math.random().toString(10).substr(2, 6);
  const phoneNumber = event.request.userAttributes.phone_number;

  //For Debugging
  console.log(event, context);

  try {
    const smsUrl = 'https://sms.ru/sms/send?api_id=D05D0136-7B0F-F168-E93F-BCBB36C365E2';
    const smsMessage = encodeURIComponent(`Код LetsGo: ${challengeAnswer}. Ни с кем не делитесь кодом.`);
    const smsGateResult = await axios.get(`${smsUrl}&to=${phoneNumber}&msg=${smsMessage}&json=1`);
    // axios.get('https://sms.ru/sms/send?api_id=D05D0136-7B0F-F168-E93F-BCBB36C365E2&to=79268370322&msg=hello+world&json=1');
  } catch (error) {
    throw new Error(error);
  }

  //sns sms
  // const sns = new AWS.SNS({ region: 'eu-central-1' });
  // sns.publish(
  //   {
  //     Message: 'your otp: ' + challengeAnswer,
  //     PhoneNumber: phoneNumber,
  //     MessageStructure: 'string',
  //     MessageAttributes: {
  //       'AWS.SNS.SMS.SenderID': {
  //         DataType: 'String',
  //         StringValue: 'AMPLIFY',
  //       },
  //       'AWS.SNS.SMS.SMSType': {
  //         DataType: 'String',
  //         StringValue: 'Transactional',
  //       },
  //     },
  //   },
  //   function (err, data) {
  //     if (err) {
  //       console.log(err.stack);
  //       console.log(data);
  //       return;
  //     }
  //     console.log(`SMS sent to ${phoneNumber} and otp = ${challengeAnswer}`);
  //     return data;
  //   }
  // );

  //set return params
  event.response.privateChallengeParameters = {};
  event.response.privateChallengeParameters.answer = challengeAnswer;
  event.response.challengeMetadata = 'CUSTOM_CHALLENGE';

  callback(null, event);
};

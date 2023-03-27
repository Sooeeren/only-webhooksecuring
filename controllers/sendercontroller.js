const request = require('request');

function sendWebhook(webhook, message) {
  request.post(webhook, {
    json: {
      content: message
    }
  }, (error, res, body) => {
    if (error) {
      console.error(error);
      return false;
    }
    return true;
  });
}

exports.sendWebhook = sendWebhook;
console.log('sendercontroller loaded');
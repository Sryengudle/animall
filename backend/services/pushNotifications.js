const webpush = require('web-push');
const { getSubscriptions, removeSubscription } = require('./pushSubscriptions');

function getAbsoluteUrl(req, relativeUrl) {
  if (!relativeUrl) return '';
  if (/^https?:\/\//i.test(relativeUrl)) return relativeUrl;

  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:5002';
  return `${protocol}://${host}${relativeUrl}`;
}

function broadcastPushNotification(notificationPayload) {
  const activeSubscriptions = getSubscriptions();
  if (!activeSubscriptions.length) return;

  const pushPromises = activeSubscriptions.map((sub) => {
    return webpush.sendNotification(sub, notificationPayload)
      .catch((err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          removeSubscription(sub.endpoint);
        }
        console.error('Failed to send notification:', err.message || err);
      });
  });

  Promise.all(pushPromises).catch((err) => {
    console.error('Broadcast error encountered', err);
  });
}

function broadcastAnimalCreatedNotification(animal, req) {
  const animalName = animal.breed ? `${animal.breed} ${animal.type}` : animal.type;
  const addedBy = animal.sellerName || 'A seller';
  const template = `हे बघा, ${addedBy} यांच्याकडे एक उत्कृष्ट ${animalName} विक्रीसाठी आली आहे. त्वरित माहिती मिळवण्यासाठी येथे क्लिक करा!`;

  const notificationPayload = JSON.stringify({
    title: '🐄 Animal Alert!',
    body: template,
    image: getAbsoluteUrl(req, animal.images?.[0] || ''),
    url: '/buy',
    // url: `/buy/${animal._id}`,
  });

  broadcastPushNotification(notificationPayload);
}

module.exports = {
  broadcastAnimalCreatedNotification,
};

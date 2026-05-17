let activeSubscriptions = [];

function addSubscription(subscription) {
  if (!subscription || !subscription.endpoint) return false;

  const exists = activeSubscriptions.some(sub => sub.endpoint === subscription.endpoint);
  if (!exists) {
    activeSubscriptions.push(subscription);
  }

  return true;
}

function removeSubscription(endpoint) {
  activeSubscriptions = activeSubscriptions.filter(sub => sub.endpoint !== endpoint);
}

function getSubscriptions() {
  return activeSubscriptions;
}

module.exports = {
  addSubscription,
  removeSubscription,
  getSubscriptions,
};

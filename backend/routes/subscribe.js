const express = require('express');
const router = express.Router();
const { addSubscription } = require('../services/pushSubscriptions');

router.post('/', (req, res) => {
  const subscription = req.body;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ message: 'Invalid subscription payload' });
  }

  addSubscription(subscription);
  res.status(201).json({ status: 'success' });
});

module.exports = router;


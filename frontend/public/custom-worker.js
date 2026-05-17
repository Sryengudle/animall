// Listen for push notifications broadcast from the backend server
self.addEventListener('push', event => {
  let data = { title: 'New Animal Added!', body: 'Check out the new animal profile now.' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      // ignore parse errors and use default data
    }
  }

  const options = {
    body: data.body,
    icon: './images/logo-green.svg',
    badge: './images/logo-green.svg',
    image: data.image,
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});


// Redirect the user when they click the notification box
// Redirect the user when they click the notification box
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
// self.addEventListener('push', event => {
//   const data = event.data ? event.data.json() : { title: 'New Update', body: 'Something happened!' };

//   const options = {
//     body: data.body,
//     icon: '/images/icon.png',
//     badge: '/images/badge.png',
//     data: { url: data?.url || '/' } // Pass a target URL
//   };

//   event.waitUntil(
//     self.registration.showNotification(data.title, options)
//   );
// });

// // Open the URL when the user clicks the notification
// self.addEventListener('notificationclick', event => {
//   event.notification.close();
//   event.waitUntil(
//     clients.openWindow(event.notification.data.url)
//   );
// });

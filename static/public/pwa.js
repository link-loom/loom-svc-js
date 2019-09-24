// Add this below content to your HTML page, or add the js file to your page at the very top to register service worker

// Check compatibility for the browser we're running this in
if ('serviceWorker' in navigator) {
  if (!navigator.serviceWorker.controller) {
    // Register the service worker
    navigator.serviceWorker
      .register('service-worker.js', {
        scope: './'
      })
      .then(function (registration) {
        console.log('SW registered, scope is: ', registration.scope)
      })
  }
}

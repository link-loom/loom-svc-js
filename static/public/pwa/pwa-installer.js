/* global
*/

var deferredPrompt

window.addEventListener('beforeinstallprompt', function (e) {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()
  // Stash the event so it can be triggered later.
  deferredPrompt = e

  showInstallBanner()
})

function showInstallBanner () {
  var pwaPrompt = document.querySelector('.pwa-prompt')
  var pwaInstallBtn = document.querySelector('.btn-install')
  var pwaNotNowBtn = document.querySelector('.btn-notnow')

  var pwaSession = JSON.parse(window.localStorage.getItem('pwa-session'))

  if (!pwaPrompt || !pwaInstallBtn || !pwaNotNowBtn) {
    return
  }

  if (pwaSession && pwaSession.action === 'installed') {
    return
  }

  if (pwaSession && pwaSession.action === 'not-now') {
    if ((new Date()).getTime() < +pwaSession.date) {
      return
    }
  }

  pwaPrompt.style.display = 'block'
  pwaInstallBtn.addEventListener('click', installOnClick)
  pwaNotNowBtn.addEventListener('click', notNowOnClick)
}

function installOnClick (event) {
  if (event) { event.preventDefault() }

  // hide our user interface
  var pwaPrompt = document.querySelector('.pwa-prompt')
  // Show the prompt
  pwaPrompt.style.display = 'none'
  // Wait for the user to respond to the prompt
  deferredPrompt.prompt()
  deferredPrompt.userChoice
    .then(function (choiceResult) {
      if (choiceResult.outcome === 'accepted') {
        window.localStorage.setItem('pwa-session', JSON.stringify({
          action: 'installed',
          date: (new Date()).getTime() + ''
        }))
      } else {
        window.localStorage.setItem('pwa-session', JSON.stringify({
          action: 'not-now',
          date: (new Date()).getTime() + (2 * 24 * 60 * 60 * 1000) + ''
        }))
      }

      deferredPrompt = null
    })
}

function notNowOnClick (event) {
  if (event) { event.preventDefault() }

  var pwaPrompt = document.querySelector('.pwa-prompt')
  pwaPrompt.style.display = 'none'

  window.localStorage.setItem('pwa-session', JSON.stringify({
    action: 'not-now',
    date: (new Date()).getTime() + (2 * 24 * 60 * 60 * 1000) + ''
  }))
}

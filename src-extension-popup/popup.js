// console.log('popup')
// document.getElementById('aaa').innerHTML = 'Hello JavaScript!'
// setInterval(() => {
//   let favorites = JSON.parse(localStorage.getItem('favorites') || '{}')
//   console.log('favorites', favorites)
//   document.getElementById('aaa').innerHTML = JSON.stringify(favorites)
// }, 1000)

// chrome.runtime.sendMessage('hello', () => {
//   console.log('response')
// })

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { greeting: 'hello' },
    function (response) {
      console.log('response', response)
      if (!chrome.runtime.lastError) {
        document.getElementById('aaa').innerHTML = JSON.stringify(response)
      } else {
        alert(`Error: ${JSON.stringify(chrome.runtime.lastError)}`)
      }
    }
  )
})

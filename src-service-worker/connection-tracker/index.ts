let active = 0

export function initConnectionsTracker(): void {
  chrome.webRequest.onBeforeRequest.addListener(
    function () {
      active++
      return
    },
    { urls: ["<all_urls>"] },
  )

  chrome.webRequest.onCompleted.addListener(
    function (details) {
      active--
      return details
    },
    { urls: ["<all_urls>"] },
  )
}

export function getActiveConnections(): number {
  return active
}
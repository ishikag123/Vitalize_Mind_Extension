let notification
let userId

chrome.history.onVisited.addListener(function(historyItem) {
    // Check if the URL uses HTTPS
	chrome.storage.local.get(['userId', 'userName'], function(result) {
		userId = result.userId
		userName = result.userName
		console.log("Received from local: ", userId)
	})

	if (userId) {
		if (historyItem.url.startsWith("")) {
			const apiURL = "http://localhost:3500/user/addBrowserSearch"
			const searchData = {
				search: historyItem.title,
				_id: userId
			}
		
			fetch(apiURL, {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify(searchData)
			})
			.then(response => response.json())
			.then(data => {
				console.log('API response:', data.message)
				if (notification) {
					chrome.notifications.clear(notification.notificationId)
				}
				
				if (data.score < 0) {
					notification = {
						type: "basic",
						title: "Mental App",
						iconUrl: "puzzle64.png",
						message: data.message
					}
					chrome.notifications.create(notification, (id) => {
						notification.notificationId = id
					})

					const apiURL2 = 'http://localhost:3500/user/sendAlert'
					const alertData = { _id: userId }
					fetch(apiURL2, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(alertData)
					})
					.then (response => response.json())
					.then (data => {
						console.log(data)
					})
					.catch (error => {
						console.log('Error', error)
					})

				}
			})
			.catch(error => {
				console.log('Error:', error);
			})
		}
	}
});

chrome.notifications.onClicked.addListener(() => {
	if (notification) {
		chrome.notifications.clear(notification.notificationId)
		notification = null
	}
	chrome.tabs.create({ url: `http://localhost:3000/dashboard?user_id=${userId}&user_name=${userName}` })
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.userId) {
		userId = request.userId
		userName = request.userName
		console.log('Receieved from background: ', userId)
		chrome.storage.local.set({ userId: userId, userName: userName })
		console.log('UserId saved to local')
	}
})
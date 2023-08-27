const authApiURL = "http://localhost:3500/user/compareAuthKey"

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('authForm')

    form.addEventListener('submit', function(e) {
        e.preventDefault()

        const formData = new FormData(form)
        const tempData = {}

        formData.forEach((value, key) => {
            tempData[key] = value;
        })

        const requestData = { authKey: tempData.authKey }

        fetch(authApiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (response.status === 200) {
                return response.json()
            } else {
                console.log("Code is invalid. Please try again.")
            }
        })
        .then(data => {
            // console.log(data)
            console.log(data._id, data.name)
            responseForBackground = { userId: data._id, userName: data.name }
            chrome.runtime.sendMessage(responseForBackground);
            window.close();
            // authKey.value = ''
        })
    })
})
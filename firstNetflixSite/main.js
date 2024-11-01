fetch('/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
})
.then(response => response.json())
.then(data => {
    document.getElementById('message').innerText = data.msg;
    window.location.href = "http://localhost:7000/welcome.html"
    console.log("http://localhost:7000/signIn.html?");
    
})
.catch(error => {
    console.error('Error:', error);
});
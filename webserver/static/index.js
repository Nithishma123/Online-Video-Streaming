document.getElementById('signupForm').style.display = 'none';


document.getElementById('toggleSignup').addEventListener('click', function () {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
});

document.getElementById('toggleLogin').addEventListener('click', function () {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('signupForm').style.display = 'none';
});


document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                window.location.href = '/home.html';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('signupForm');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const emailid = document.getElementById('emailid').value;
        const phone = document.getElementById('phone').value;
        const age = parseInt(document.getElementById('age').value, 10);
        const gender = document.getElementById('gender').value;
        const pass = document.getElementById('pass').value;
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, emailid, phone, age, gender, pass }),
            });

            const data = await response.json();

            if (response.status === 200) {
                window.location.href = '/home.html';
            } else {
                alert(data.message); 
            }
        } catch (error) {
            alert('Please check the details again');
            console.error('Error:', error);
        }
    });
        
});

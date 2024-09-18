const loginUrl = '/api/v1/users/login';
const loginform = document.getElementById('login');


loginform.addEventListener('submit', userauth);

async function userauth(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const data = {
        'email': email,
        'password': password
    };
    const reqbody = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    try {
        const response = await fetch(loginUrl, reqbody);
        if (response.ok) {
            window.location.href = '/host';
        }
        else {
            window.location.href = '/login';
        }
    } catch(error){
        console.error('Error: ', error);
    }

}
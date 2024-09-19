const signinUrl = '/api/v1/users/signup';
const signinform = document.getElementById('signin');

signinform.addEventListener('submit', newuserauth);

async function newuserauth(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const data = {
        'name': name,
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
        const response = await fetch(signinUrl, reqbody);
        if (response.ok) {
            window.location.href = '/host';
        }
        else {
            window.location.href = '/signin';
        }
    } catch(error){
        console.error('Error: ', error);
    }

}


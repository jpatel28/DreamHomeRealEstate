document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('registerButton');
    const messageDiv = document.getElementById('message');

    function hideMessage() {
        messageDiv.textContent = '';
        messageDiv.classList.remove('message-success', 'message-error');
    }

    registerButton.addEventListener('click', async () => {
        const clientNo = document.getElementById('clientNo').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const telNo = document.getElementById('telNo').value;
        const street = document.getElementById('street').value;
        const city = document.getElementById('city').value;
        const email = document.getElementById('email').value;
        const prefType = document.getElementById('prefType').value;
        const maxRent = document.getElementById('maxRent').value;

        if (!clientNo || !firstName || !lastName || !telNo || !street || !city || !email || !prefType || !maxRent) {
            messageDiv.textContent = 'Please fill in all required fields.';
            messageDiv.style.color = 'red';
            return;
        }

        const clientData = {
            clientNo,
            firstName,
            lastName,
            telNo,
            street,
            city,
            email,
            prefType,
            maxRent: parseFloat(maxRent)
        };

        try {
            const response = await fetch('/api/client/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clientData)
            });

            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                const text = await response.text();
                console.error("Non-JSON response:", text);
                throw new Error("Invalid server response");
            }

            if (response.ok) {
                messageDiv.textContent = result.message || 'Client Successfully Registered!';
                messageDiv.style.color = 'green';

                // Clear form fields after successful registration
                document.getElementById('clientNo').value = '';
                document.getElementById('firstName').value = '';
                document.getElementById('lastName').value = '';
                document.getElementById('telNo').value = '';
                document.getElementById('street').value = '';
                document.getElementById('city').value = '';
                document.getElementById('email').value = '';
                document.getElementById('prefType').value = '';
                document.getElementById('maxRent').value = '';
            } else {
                messageDiv.textContent = `Error: ${result.message || 'Something went wrong'}`;
                messageDiv.classList.remove('message-success');
                messageDiv.classList.add('message-error');
                setTimeout(hideMessage, 4000);
            }
        } catch (error) {
            console.error('Network error:', error);
            messageDiv.textContent = 'Network error. Could not connect to the server.';
            messageDiv.classList.remove('message-success');
            messageDiv.classList.add('message-error');
            setTimeout(hideMessage, 4000);
        }
    });
}); 
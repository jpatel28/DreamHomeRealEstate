document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitButton');
    const messageDiv = document.getElementById('message');

    function hideMessage() {
        messageDiv.textContent = '';
        messageDiv.classList.remove('message-success', 'message-error');
    }

    submitButton.addEventListener('click', async () => {
        const branchNo = document.getElementById('newBranchNo').value.trim();
        const street = document.getElementById('newStreet').value.trim();
        const city = document.getElementById('newCity').value.trim();
        const postCode = document.getElementById('newPostCode').value.trim();

        if (!branchNo || !street || !city || !postCode) {
            messageDiv.textContent = 'Please fill in all fields.';
            messageDiv.style.color = 'red';
            return;
        }

        const branchData = {
            branchNo,
            street,
            city,
            postCode
        };

        try {
            const response = await fetch('/api/branch/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(branchData)
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.textContent = result.message || 'New Branch Opened Successfully!';
                messageDiv.classList.remove('message-error');
                messageDiv.classList.add('message-success');
                setTimeout(hideMessage, 4000);

                document.getElementById('newBranchNo').value = '';
                document.getElementById('newStreet').value = '';
                document.getElementById('newCity').value = '';
                document.getElementById('newPostCode').value = '';
            } else {
                messageDiv.textContent = `Error: ${result.message || 'Something went wrong opening branch.'}`;
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
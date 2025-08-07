document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.getElementById('deleteButton');
    const messageDiv = document.getElementById('message');
    const clientNoSelect = document.getElementById('clientNo');


    function hideMessage() {
        messageDiv.textContent = '';
        messageDiv.classList.remove('message-success', 'message-error');
    }

    async function fetchClients() {
        try {
            const response = await fetch('/api/clients');
            if (!response.ok) {
                throw new Error('Failed to fetch client numbers.');
            }
            const clients = await response.json();
            
            clients.forEach(clientNo => {
                const option = document.createElement('option');
                option.value = clientNo;
                option.textContent = clientNo;
                clientNoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching clients:', error);
            messageDiv.textContent = 'Could not load client numbers. ' + error.message;
            messageDiv.style.color = 'red';
        }
    }

    fetchClients();
    
    deleteButton.addEventListener('click', async () => {
        const clientNo = document.getElementById('clientNo').value;

        if (!clientNo) {
            messageDiv.textContent = 'Please enter a client number to delete.';
            messageDiv.style.color = 'red';
            return;
        }

        // Confirm deletion
        if (!confirm(`Are you sure you want to delete client ${clientNo}?`)) {
            return;
        }

        try {
            const response = await fetch('/api/client/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ clientNo })
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
                messageDiv.textContent = result.message || 'Client Successfully Deleted!';
                messageDiv.style.color = 'green';

                // Clear form field after successful deletion
                document.getElementById('clientNo').value = '';
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
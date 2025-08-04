document.addEventListener('DOMContentLoaded', () => {
    const clientTableBody = document.getElementById('clientTableBody');
    const refreshButton = document.getElementById('refreshButton');
    const messageDiv = document.getElementById('message');

    function hideMessage() {
        messageDiv.textContent = '';
        messageDiv.classList.remove('message-success', 'message-error');
    }

    async function loadClientList() {
        try {
            const response = await fetch('/api/client/list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
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
                displayClients(result);
                messageDiv.textContent = `Successfully loaded ${result.length} client(s)`;
                messageDiv.classList.remove('message-error');
                messageDiv.classList.add('message-success');
                setTimeout(hideMessage, 4000);
            } else {
                messageDiv.textContent = `Error: ${result.message || 'Failed to load client list'}`;
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
    }

    function displayClients(clients) {
        clientTableBody.innerHTML = '';
        
        if (clients.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="9" style="text-align: center;">No clients found</td>';
            clientTableBody.appendChild(row);
            return;
        }

        clients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.clientNo || ''}</td>
                <td>${client.firstName || ''}</td>
                <td>${client.lastName || ''}</td>
                <td>${client.telNo || ''}</td>
                <td>${client.street || ''}</td>
                <td>${client.city || ''}</td>
                <td>${client.email || ''}</td>
                <td>${client.prefType || ''}</td>
                <td>${client.maxRent ? `$${client.maxRent.toFixed(2)}` : ''}</td>
            `;
            clientTableBody.appendChild(row);
        });
    }

    refreshButton.addEventListener('click', loadClientList);

    loadClientList();
}); 
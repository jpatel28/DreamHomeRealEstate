document.addEventListener('DOMContentLoaded', () => {
    const branchNoInput = document.getElementById('branchNoLookup');
    const lookupButton = document.getElementById('lookupBranchButton');
    const messageDiv = document.getElementById('message');
    const addressDisplayContainer  = document.getElementById('addressDisplayContainer');

    function hideMessage() {
        messageDiv.textContent = '';
        messageDiv.classList.remove('message-success', 'message-error');
    }

    lookupButton.addEventListener('click', async () => {
        const branchNo = branchNoInput.value.trim();

        messageDiv.textContent = '';
        addressDisplayContainer .innerHTML = '';

        if (!branchNo) {
            messageDiv.textContent = 'Please enter a Branch Number.';
            messageDiv.classList.remove('message-success');
            messageDiv.classList.add('message-error');
            setTimeout(hideMessage, 4000);
            return;
        }

        try {
            const response = await fetch('/api/branch/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ branchNo: branchNo })
            });

            const result = await response.json();

            if (response.ok) {
                if (result.address) {
                    const label = document.createElement('label');
                    label.textContent = 'Full Address:';
                    label.style.fontWeight = 'bold';
                    label.style.display = 'block';
                    label.style.marginBottom = '0.5rem';

                    const addressInput = document.createElement('input');
                    addressInput.type = 'text';
                    addressInput.id = 'fullAddressDisplay';
                    addressInput.value = result.address;
                    addressInput.readOnly = true;
                   
                    addressInput.classList.add('display-input');

                    addressDisplayContainer.appendChild(label);
                    addressDisplayContainer.appendChild(addressInput);
                    addressDisplayContainer.style.color = 'green';

                    messageDiv.textContent = '';
                } else {
                    messageDiv.textContent = result.message || 'Branch not found.';
                    messageDiv.classList.remove('message-success');
                    messageDiv.classList.add('message-error');
                    setTimeout(hideMessage, 4000);
                }
            } else {
                messageDiv.textContent = `Error: ${result.message || 'Something went wrong fetching address.'}`;
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
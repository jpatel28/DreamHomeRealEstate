document.addEventListener('DOMContentLoaded', () => {
    const branchTableBody = document.querySelector('#branchTable tbody');
    const messageDiv = document.getElementById('message');

    function hideMessage() {
        messageDiv.textContent = '';
        messageDiv.classList.remove('message-success', 'message-error');
    }

    async function fetchBranches() {
        try {
            const response = await fetch('/api/branch/list');
            const branchList = await response.json();

            if (response.ok) {
                branchTableBody.innerHTML = '';
                branchList.forEach(field => {
                    const row = branchTableBody.insertRow();
                    row.insertCell().textContent = field.branchNo;
                    
                    const streetField = row.insertCell();
                    streetField.innerHTML = `<input type="text" value="${field.street}" data-field="street" data-branchno="${field.branchNo}">`;

                    const cityField = row.insertCell();
                    cityField.innerHTML = `<input type="text" value="${field.city}" data-field="city" data-branchno="${field.branchNo}">`;

                    const postCodeField = row.insertCell();
                    postCodeField.innerHTML = `<input type="text" value="${field.postCode}" data-field="postCode" data-branchno="${field.branchNo}">`;

                    const actionsCell = row.insertCell();
                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update';
                    updateButton.className = 'update-button';
                    updateButton.onclick = () => updateBranchRecord(field.branchNo, row);
                    actionsCell.appendChild(updateButton);
                    
                });
            } else {
                messageDiv.textContent = `Error: ${branchList.message || 'Failed to load branch data.'}`;
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

    async function updateBranchRecord(branchNo, row) {
        const streetInput = row.querySelector(`input[data-branchno="${branchNo}"][data-field="street"]`);
        const cityInput = row.querySelector(`input[data-branchno="${branchNo}"][data-field="city"]`);
        const postCodeInput = row.querySelector(`input[data-branchno="${branchNo}"][data-field="postCode"]`);

        const updatedData = {
            branchNo: branchNo,
            street: streetInput.value,
            city: cityInput.value,
            postCode: postCodeInput.value
        };

        try {
            const response = await fetch('/api/branch/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                messageDiv.textContent = 'Branch Updated Successfully!';
                messageDiv.classList.remove('message-error');
                messageDiv.classList.add('message-success');
                setTimeout(hideMessage, 4000);
                fetchBranches();
            } else {
                const errorData = await response.json();
                messageDiv.textContent = `Error: ${errorData.message || 'Failed to update branch.'}`;
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

    fetchBranches();
});
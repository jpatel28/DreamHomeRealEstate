document.addEventListener('DOMContentLoaded', () => {
    const staffTableBody = document.querySelector('#staffTable tbody');
    const messageDiv = document.getElementById('message');

    function hideMessage() {
        messageDiv.textContent = '';
        messageDiv.classList.remove('message-success', 'message-error');
    }

    async function fetchStaff() {
        try {
            const response = await fetch('/api/staff/list');
            const staffList = await response.json();
            
            if(response.ok) {
                staffTableBody.innerHTML = '';
                staffList.forEach(field => {
                    const row = staffTableBody.insertRow();
                    row.insertCell().textContent = field.staffNo;
                    row.insertCell().textContent = field.firstName;
                    row.insertCell().textContent = field.lastName;
                    row.insertCell().textContent = field.position;
                    row.insertCell().textContent = field.branchNo;
                    row.insertCell().textContent = field.sex;
                    row.insertCell().textContent = field.dob;

                    const salaryField = row.insertCell();
                    salaryField.innerHTML = `<input type="text" value="${field.salary}"data-field="salary" data-staffno="${field.staffNo}">`;

                    const telephoneField = row.insertCell();
                    telephoneField.innerHTML = `<input type="text" value="${field.telephone}"data-field="telephone" data-staffno="${field.staffNo}">`;

                    const mobileField = row.insertCell();
                    mobileField.innerHTML = `<input type="text" value="${field.mobile}"data-field="mobile" data-staffno="${field.staffNo}">`;

                    const emailField = row.insertCell();
                    emailField.innerHTML = `<input type="text" value="${field.email}"data-field="email" data-staffno="${field.staffNo}">`;

                    const actionsCell = row.insertCell();
                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update';
                    updateButton.className = 'update-button';
                    updateButton.onclick = () => updateStaffRecord(field.staffNo, row);
                    actionsCell.appendChild(updateButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = () => deleteStaffRecord(field.staffNo);
                    actionsCell.appendChild(deleteButton);
                });
            } else {
                messageDiv.textContent = `Error: ${staffList.message || 'Failed to load staff data.'}`;
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

    async function updateStaffRecord(staffNo, row) {
        const salaryInput = row.querySelector(`input[data-staffno="${staffNo}"][data-field="salary"]`);
        const telephoneInput = row.querySelector(`input[data-staffno="${staffNo}"][data-field="telephone"]`);
        const mobileInput = row.querySelector(`input[data-staffno="${staffNo}"][data-field="mobile"]`);
        const emailInput = row.querySelector(`input[data-staffno="${staffNo}"][data-field="email"]`);

        const updatedData = {
            staffNo: staffNo,
            salary: parseFloat(salaryInput.value),
            telephone: telephoneInput.value,
            mobile: mobileInput.value,
            email: emailInput.value
        };

        try {
            const response = await fetch('/api/staff/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();
            if (response.ok) {
                messageDiv.textContent = result.message || 'Staff record updated successfully.';
                messageDiv.classList.remove('message-error');
                messageDiv.classList.add('message-success');
                setTimeout(hideMessage, 4000);
                fetchStaff();
            } else {
                messageDiv.textContent = `Error: ${result.message || 'Failed to update staff.'}`;
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

    async function deleteStaffRecord(staffNo) {
        if (!confirm(`Are you sure you want to delete staff number ${staffNo}?`)) {
            return;
        }

        try {
            const response = await fetch('/api/staff/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ staffNo: staffNo })
            });

            const result = await response.json();
            if (response.ok) {
                messageDiv.textContent = result.message || 'Staff record deleted successfully.';
                messageDiv.classList.remove('message-error');
                messageDiv.classList.add('message-success');
                setTimeout(hideMessage, 4000);
                fetchStaff();
            } else {
                messageDiv.textContent = `Error: ${result.message || 'Failed to update staff.'}`;
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

    fetchStaff();
});
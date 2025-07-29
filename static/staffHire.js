document.addEventListener('DOMContentLoaded', () => {
    const hireButton = document.getElementById('hireButton');
    const messageDiv = document.getElementById('message');

    hireButton.addEventListener('click', async () => {
        const staffNo = document.getElementById('staffNo').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const position = document.getElementById('position').value;
        const branchNo = document.getElementById('branchNo').value;
        const sex = document.getElementById('sex').value;
        const dob = document.getElementById('dob').value;
        const salary = document.getElementById('salary').value;
        const telephone = document.getElementById('telephone').value;
        const mobile = document.getElementById('mobile').value;
        const email = document.getElementById('email').value;

        if (!staffNo || !firstName || !lastName || !position || !branchNo || !sex || !dob || !salary || !telephone || !mobile || !email) {
            messageDiv.textContent = 'Please fill in all required fields.';
            messageDiv.style.color = 'red';
            return;
        }

        const staffData = {
            staffNo,
            firstName,
            lastName,
            position,
            branchNo,
            sex,
            dob,
            salary: parseFloat(salary),
            telephone,
            mobile,
            email
        };

        try {
            const response = await fetch('/api/staff/hire', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(staffData)
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
                messageDiv.textContent = result.message || 'Staff successfully hired.';
                messageDiv.style.color = 'green';

                document.getElementById('staffNo').value = '';
                document.getElementById('firstName').value = '';
                document.getElementById('lastName').value = '';
                document.getElementById('position').value = '';
                document.getElementById('branchNo').value = '';
                document.getElementById('sex').value = '';
                document.getElementById('dob').value = '';
                document.getElementById('salary').value = '';
                document.getElementById('telephone').value = '';
                document.getElementById('mobile').value = '';
                document.getElementById('email').value = '';
            } else {
                messageDiv.textContent = `Error: ${result.message || 'Something went wrong'}`;
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Network error:', error);
            messageDiv.textContent = 'Network error. Could not connect to the server.';
            messageDiv.style.color = 'red';
        }
    });
});

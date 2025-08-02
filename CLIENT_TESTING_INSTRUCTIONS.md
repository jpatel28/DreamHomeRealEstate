# Client Management Testing Instructions

## Task 3.1 - Client Registration Testing

### 1. Database Setup
First, execute the stored procedures in your Oracle database:

```sql
-- Execute CLIENT_REGISTER_SP.sql
create or replace PROCEDURE CLIENT_REGISTER_SP (
    p_clientno IN dh_client.clientno%TYPE,
    p_fname IN dh_client.fname%TYPE,
    p_lname IN dh_client.lname%TYPE,
    p_telno IN dh_client.telno%TYPE,
    p_street IN dh_client.street%TYPE,
    p_city IN dh_client.city%TYPE,
    p_email IN dh_client.email%TYPE,
    p_preftype IN dh_client.preftype%TYPE,
    p_maxrent IN dh_client.maxrent%TYPE
) IS
BEGIN
    INSERT INTO dh_client (CLIENTNO, FNAME, LNAME, TELNO, STREET, CITY, EMAIL, PREFTYPE, MAXRENT)
    VALUES (p_clientno, p_fname, p_lname, p_telno, p_street, p_city, p_email, p_preftype, p_maxrent);
    COMMIT;
END CLIENT_REGISTER_SP;
```

### 2. Web Application Testing
1. Start the Flask application: `python app.py`
2. Navigate to `http://localhost:3000`
3. Click on "Client Main Menu"
4. Click on "Register New Client"
5. Fill in the form with test data:
   - Client No.: `CR99`
   - First Name: `John`
   - Last Name: `Doe`
   - Telephone: `416-555-0123`
   - Street: `123 Main St`
   - City: `Toronto`
   - Email: `john.doe@email.com`
   - Property Type: `House`
   - Maximum Rent: `2500`
6. Click "Register Client"
7. Verify success message appears

### 3. Database Verification
Check that the record was inserted:
```sql
SELECT * FROM DH_CLIENT WHERE CLIENTNO = 'CR99';
```

## Task 3.2 - Client Deletion Testing

### 1. Database Setup
Execute the delete stored procedure:

```sql
-- Execute DELETE_CLIENT_SP.sql
create or replace PROCEDURE DELETE_CLIENT_SP (
    p_clientno IN dh_client.clientno%TYPE
) IS
BEGIN
    DELETE FROM DH_CLIENT
    WHERE CLIENTNO = p_clientno;
    COMMIT;
END DELETE_CLIENT_SP;
```

### 2. Test with CR74 (Albert Johstone)
1. First, verify CR74 exists in the database:
```sql
SELECT * FROM DH_CLIENT WHERE CLIENTNO = 'CR74';
```

2. Navigate to the web application
3. Go to "Client Main Menu" → "Delete Client"
4. Enter `CR74` in the Client No. field
5. Click "Delete Client"
6. Confirm the deletion when prompted
7. Verify success message appears

### 3. Database Verification
Check that the record was deleted:
```sql
SELECT * FROM DH_CLIENT WHERE CLIENTNO = 'CR74';
-- Should return no rows
```

## Additional Testing

### View Client List
1. Navigate to "Client Main Menu" → "View Client List"
2. Verify all clients are displayed in a table format
3. Test the "Refresh List" button

### Error Handling
1. Try registering a client with missing fields
2. Try deleting a non-existent client number
3. Verify appropriate error messages are displayed

## File Structure Created

### Stored Procedures
- `Procedures(To be configured in DB)/CLIENT_REGISTER_SP.sql`
- `Procedures(To be configured in DB)/DELETE_CLIENT_SP.sql`

### HTML Templates
- `templates/clientMainMenu.html` - Main client management menu
- `templates/clientRegistrationForm.html` - Client registration form
- `templates/clientDeleteForm.html` - Client deletion form
- `templates/clientList.html` - Client list display

### JavaScript Files
- `static/clientRegistration.js` - Client registration functionality
- `static/clientDelete.js` - Client deletion functionality
- `static/clientList.js` - Client list display functionality

### API Endpoints Added to app.py
- `POST /api/client/register` - Register new client
- `GET /api/client/list` - Get all clients
- `DELETE /api/client/delete` - Delete client

## Notes
- All forms follow the same styling and structure as existing staff and branch forms
- Error handling is consistent with existing functionality
- Database connections are properly managed with try-catch blocks
- All operations use stored procedures as required
- The web interface provides a user-friendly way to test the stored procedures 
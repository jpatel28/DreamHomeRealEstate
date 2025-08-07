# DreamHomeRealEstate
Dream Home Real Estate Application

# Project Structure
The project is organized into the following main directories and files:
<img width="923" height="267" alt="image" src="https://github.com/user-attachments/assets/621f1729-138a-41db-ba77-b7e85fa71479" />

# Setup and Running the Application
Follow these steps to set up and run the Dream Home Real Estate application:

### Prerequisites

1. Python 3: Ensure you have Python 3 installed.
2. Create a virtual environment (Optional):
```
python -m venv venv
```
3. Activate the virtual environment:
    - Windows:
    ```
    .\venv\Scripts\activate
    ```
    - MacOS/Linux
    ```
    source venv/bin/activate
    ```
4. Flask: Install Flask using pip:
```   
pip install Flask
```
3. oracledb: Install the Oracle Database driver for Python:

```
pip install python-oracledb
```
5. Oracle Instant Client:The App uses oracledb in thick mode (which is configured in app.py), you need to download and configure the Oracle Instant Client.
    - Download the "Basic" or "Basic Light" package for your operating system from the [Oracle Instant Client Downloads page](https://www.oracle.com/database/technologies/instant-client/downloads.html).
    - Extract the contents to a directory
    - Update the lib_dir variable in app.py to point to the directory where you extracted the Instant Client.
    - Update the `app.py` file to have the correct path for Oracle Instant Client
      ```
      oracledb.init_oracle_client(lib_dir=r"-----Absolute Path------")
      ``` 

# Database Configuration
1. Oracle Database: Ensure you have an Oracle database instance running and accessible.
2. User Credentials: Update the db_config dictionary in app.py with your Oracle database username, password, and connection string (DSN).
```
dsn = oracledb.makedsn(
    host="oracle.cs.torontomu.ca", # Replace with your Oracle host
    port=1521,                     # Replace with your Oracle port
    sid="orcl"                     # Replace with your Oracle SID
)

db_config = {
    "user": "your_username",       # Your Oracle username
    "password": "your_password",   # Your Oracle password
    "dsn": dsn
}
```

# Running the Application

1. Navigate to the project directory: Open terminal or command prompt and change the directory to where your app.py file is located.
```
cd /path/to/your/project
```
2. Run the Flask Server
```
flask run
```
3. Access the application: Open your web browser and go to http://127.0.0.1:5000 (or the address shown in your terminal). This will load the dreamHome.html page.

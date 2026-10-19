# Dream Home Real Estate Application

A web-based database management application for **Dream Home Real Estate**, built with Python Flask and Oracle Database (`oracledb`). The system provides interactive web interfaces and backend stored procedures/functions to manage real estate staff, branch operations, and client registrations.

---

## Table of Contents
- [Features](#features)
  - [Staff Management](#staff-management)
  - [Branch Management](#branch-management)
  - [Client Management](#client-management)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)

---

## Features

### Staff Management
- **Hire Staff (`Staff_hire_sp`):** Interface to register new staff members and execute backend stored procedures to insert records into `DH_STAFF`.
- **View & Update Staff Details:** Display staff lists and allow updates for designated fields such as `SALARY`, `TELEPHONE`, or `EMAIL`.

### Branch Management
- **Search Branch Address (`get_branch_Address`):** Retrieve street and city information by entering a branch number (`BRANCHNO`).
- **Update Branch Details:** Grid interface to update branch address information in `DH_BRANCH`.
- **Register New Branch (`new_branch`):** Execute database procedures to register new branch locations.

### Client Management
- **Register Client (`client_register_sp`):** Form interface to register new clients into `DH_CLIENT`.
- **Delete Client (`delete_client_sp`):** Procedure execution to remove client records from the database.

---

## Project Structure

```
├── app.py                     # Main Flask application & database routes
├── static/                    # Static assets (CSS, JS, images)
├── templates/                 # HTML templates
│   └── dreamHome.html         # Main application dashboard/UI
├── README.md                  # Project documentation
└── sql/                       # PL/SQL scripts for Stored Procedures & Functions
```

---

## Prerequisites

Before running the application, ensure you have the following installed:
1. **Python 3.x**
2. **Oracle Instant Client** (Required for `oracledb` Thick Mode)
3. **Oracle Database Access** (Credentials & host connectivity)

---

## Installation & Setup

### 1. Environment Setup

Clone the repository and navigate to the project root directory:

```bash
cd DreamHomeRealEstate
```

*(Optional)* Create and activate a virtual environment:

- **Windows:**
  ```bash
  python -m venv venv
  .\venv\Scripts\activate
  ```
- **macOS / Linux:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

### 2. Install Dependencies

Install Flask and the Oracle Database driver:

```bash
pip install Flask python-oracledb
```

### 3. Oracle Instant Client Configuration

This application uses `oracledb` in **Thick mode**.

1. Download the **Basic** or **Basic Light** package from the [Oracle Instant Client Downloads](https://www.oracle.com/database/technologies/instant-client/downloads.html).
2. Extract the package contents to a directory on your machine.
3. Open `app.py` and update the `lib_dir` path pointing to your extracted Oracle Instant Client folder:

```python
import oracledb

# Update with your absolute local path
oracledb.init_oracle_client(lib_dir=r"/path/to/instantclient_xx_x")
```

---

## Database Configuration

Update the database connection settings in `app.py` with your Oracle Database credentials and host information:

```python
dsn = oracledb.makedsn(
    host="oracle.cs.torontomu.ca",  # Oracle host address
    port=1521,                     # Oracle port
    sid="orcl"                     # Oracle SID or Service Name
)

db_config = {
    "user": "YOUR_USERNAME",        # Oracle username
    "password": "YOUR_PASSWORD",    # Oracle password
    "dsn": dsn
}
```

---

## Running the Application

1. Start the Flask server:
   ```bash
   python app.py
   ```

2. Open your web browser and navigate to:
   ```
   http://127.0.0.1:3000
   ```
   *(or the address displayed in your terminal output)*.

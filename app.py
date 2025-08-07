from flask import Flask, render_template, request, jsonify
import oracledb
from datetime import datetime

app = Flask(__name__, static_folder='static')

dsn = oracledb.makedsn(
    host="oracle.cs.torontomu.ca",
    port=1521,
    sid="orcl"
)

db_config = {
    "user": "",        # UserName
    "password": "",    # Password
    "dsn": dsn
}

try:
    oracledb.init_oracle_client(lib_dir=r"C:\Users\jaypa\DATA\CS\Sem 7\CCPS 610\Assignment2\instantclient-basic-windows.x64-23.8.0.25.04\instantclient_23_8")
    print("Oracle Client (thick mode) initialized successfully.")
except Exception as err:
    print("Error initializing Oracle Client (thick mode):", err)
    print("Falling back to thin mode or unable to connect.")

@app.route('/')
def index():
    return render_template('dreamHome.html')

@app.route('/dreamHome.html')
def dream_home():
    return render_template('dreamHome.html')

@app.route('/staffMainMenu.html')
def staff_main_menu():
    return render_template('staffMainMenu.html')

@app.route('/employeeHireForm.html')
def staff_main_menu_form():
    return render_template('employeeHireForm.html')

@app.route('/staffListUpdate.html')
def staff_list_update():
    return render_template('staffListUpdate.html')

@app.route('/branchMainMenu.html')
def branch_main_menu():
    return render_template('branchMainMenu.html')

@app.route('/branchAddressLookup.html')
def branch_address_lookup():
    return render_template('branchAddressLookup.html')

@app.route('/branchUpdateList.html')
def branch_address_update():
    return render_template('branchUpdateList.html')

@app.route('/newBranchForm.html')
def add_new_branch():
    return render_template('newBranchForm.html')

@app.route('/clientMainMenu.html')
def client_main_menu():
    return render_template('clientMainMenu.html')

@app.route('/clientRegistrationForm.html')
def client_registration_form():
    return render_template('clientRegistrationForm.html')

@app.route('/clientDeleteForm.html')
def client_delete_form():
    return render_template('clientDeleteForm.html')

@app.route('/clientList.html')
def client_list():
    return render_template('clientList.html')


###### Staff Hire API #######
@app.route('/api/staff/hire', methods=['POST'])
def staff_hire():
    connection = None
    try:
        data = request.get_json()
        staffno = data.get('staffNo')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        position = data.get('position')
        branch_no = data.get('branchNo')
        sex = data.get('sex')
        dob = data.get('dob')
        salary = data.get('salary')
        telephone = data.get('telephone')
        mobile = data.get('mobile')
        email = data.get('email')

        if not all([staffno, first_name, last_name, position, branch_no, sex, dob, salary, telephone, mobile, email]):
            return jsonify({"error": "All fields are required"}), 400
        
        connection = oracledb.connect(**db_config)
        print("Connection successful!")
        
        dob_str = data.get('dob')
        try:
            dob_date = datetime.strptime(dob_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Invalid DOB format. Please use YYYY-MM-DD."}), 400

        cursor = connection.cursor()
        cursor.callproc(
            "Staff_hire_sp",
            [   
                staffno,
                first_name,
                last_name,
                position,
                branch_no,
                sex,
                dob_date,
                salary,
                telephone,
                mobile,
                email
            ]
        )
        connection.commit()

        return jsonify({"message": "Staff hired successfully!"}), 201

    except oracledb.DatabaseError as e:
        error, = e.args
        print("Database connection failed:", e)
        print("Oracle Error:", error.message)
        connection.rollback()
        return jsonify({"message": f"Failed to hire staff: {error.message}"}), 500
    
    except Exception as e:
        print("General Error:", e)
        if connection:
            connection.rollback()
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")

###### API to get a list of branch numbers #######
@app.route('/api/branches', methods=['GET'])
def get_branches():
    connection = None
    try:
        connection = oracledb.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("SELECT branchNo FROM DH_BRANCH ORDER BY branchNo")
        branch_nos = [row[0] for row in cursor.fetchall()]

        return jsonify(branch_nos), 200

    except oracledb.DatabaseError as e:
        error, = e.args
        print("Database error:", error.message)
        return jsonify({"message": f"Failed to retrieve branches: {error.message}"}), 500
    except Exception as e:
        print("General Error:", e)
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")

###### API to get a list of unique positions #######
@app.route('/api/staff/positions', methods=['GET'])
def get_unique_positions():
    connection = None
    try:
        connection = oracledb.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("SELECT DISTINCT position FROM DH_STAFF ORDER BY position")
        positions = [row[0] for row in cursor.fetchall()]

        return jsonify(positions), 200

    except oracledb.DatabaseError as e:
        error, = e.args
        print("Database error:", error.message)
        return jsonify({"message": f"Failed to retrieve positions: {error.message}"}), 500
    except Exception as e:
        print("General Error:", e)
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")

###### Staff List API #######
@app.route('/api/staff/list', methods=['GET'])
def get_staff_list():
    connection = None
    try:
        connection = oracledb.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("SELECT staffNo, fName, lName, position, branchNo, sex, dob, salary, telephone, mobile, email FROM DH_STAFF")
        staff_records = cursor.fetchall()

        staff_list = []
        for record in staff_records:
            staff_list.append({
                "staffNo": record[0],
                "firstName": record[1],
                "lastName": record[2],
                "position": record[3],
                "branchNo": record[4],
                "sex": record[5],
                "dob": record[6].strftime('%Y-%m-%d') if record[6] else None,
                "salary": record[7],
                "telephone": record[8],
                "mobile": record[9],
                "email": record[10]
            })
        return jsonify(staff_list), 200

    except oracledb.DatabaseError as e:
        error, = e.args
        print("Database error:", error.message)
        return jsonify({"message": f"Failed to retrieve staff list: {error.message}"}), 500
    except Exception as e:
        print("General Error:", e)
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")


###### Staff Update API #######
@app.route('/api/staff/update', methods=['POST'])
def staff_update():
    connection = None
    try:
        data = request.get_json()
        staffno = data.get('staffNo')
        salary = data.get('salary')
        telephone = data.get('telephone')
        mobile = data.get('mobile')
        email = data.get('email')

        if not all([staffno, salary, telephone, mobile, email]):
            return jsonify({"error": "All fields are required"}), 400
        
        connection = oracledb.connect(**db_config)
        cursor = connection.cursor()
        cursor.callproc("Staff_Update_sp", [staffno, salary, telephone, mobile, email])
        connection.commit()
        return jsonify({"message": "Staff Record Updated Successfully!"}), 200
    
    except oracledb.DatabaseError as e:
        error, = e.args
        connection.rollback()
        return jsonify({"message": f"Failed to update staff: {error.message}"}), 500
    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")

###### Staff Delete API #######
@app.route('/api/staff/delete', methods=['DELETE'])
def staff_delete():
    connection = None
    try:
        data = request.get_json()
        staffno = data.get('staffNo')

        if not staffno:
            return jsonify({"error": "Staff number is required"}), 400
        
        connection = oracledb.connect(**db_config)
        cursor = connection.cursor()
        cursor.callproc("Staff_terminate_sp", [staffno])
        connection.commit()
        return jsonify({"message": "Staff Record Deleted Successfully!"}), 200
    
    except oracledb.DatabaseError as e:
        error, = e.args
        connection.rollback()
        return jsonify({"message": f"Failed to delete staff: {error.message}"}), 500
    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")

###### Branch Address Lookup API #######
@app.route('/api/branch/address', methods=['POST'])
def get_branch_address():
    connection = None
    try:
        data = request.get_json()
        branch_no = data.get('branchNo')

        if not branch_no:
            return jsonify({"error": "Branch number is required"}), 400

        connection = oracledb.connect(**db_config)
        cursor = connection.cursor()

        result_address = cursor.callfunc("GET_BRANCH_ADDRESS", oracledb.STRING, [branch_no])

        if result_address and result_address not in ['Branch not found', 'Error retrieving branch address']:
            return jsonify({"address": result_address}), 200
        elif result_address == 'Branch not found':
            return jsonify({"message": "Branch not found for the given number."}), 404
        else:
            return jsonify({"message": result_address or "An error occurred fetching branch address."}), 500

    except oracledb.DatabaseError as e:
        error, = e.args
        print("Database error:", error.message)
        return jsonify({"message": f"Failed to retrieve branch address: {error.message}"}), 500
    except Exception as e:
        print("General Error:", e)
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")

###### Branch List API #######
@app.route('/api/branch/list', methods=['GET'])
def get_branch_list():
    connection = None
    try:
        connection = oracledb.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("SELECT branchNo, street, city, postcode FROM DH_BRANCH")
        branch_records = cursor.fetchall()

        branch_list = []
        for record in branch_records:
            branch_list.append({
                "branchNo": record[0],
                "street": record[1],
                "city": record[2],
                "postCode": record[3]
            })
        return jsonify(branch_list), 200

    except oracledb.DatabaseError as e:
        error, = e.args
        print("Database error:", error.message)
        return jsonify({"message": f"Failed to retrieve branch list: {error.message}"}), 500
    except Exception as e:
        print("General Error:", e)
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")

###### Branch Update API #######
@app.route('/api/branch/update', methods=['POST'])
def branch_update():
    connection = None
    try:
        data = request.get_json()
        branch_no = data.get('branchNo')
        street = data.get('street')
        city = data.get('city')
        postCode = data.get('postCode')

        if not all([branch_no, street, city, postCode]):
            return jsonify({"error": "All fields are required"}), 400

        connection = oracledb.connect(**db_config)
        cursor = connection.cursor()
        cursor.callproc("UPDATE_BRANCH_ADDRESS", [branch_no, street, city, postCode])
        connection.commit()
        return jsonify({"message": "Branch Record Updated Successfully!"}), 200

    except oracledb.DatabaseError as e:
        error, = e.args
        if connection:
            connection.rollback()
        print("Database error:", error.message)
        return jsonify({"message": f"Failed to update branch: {error.message}"}), 500
    except Exception as e:
        if connection:
            connection.rollback()
        print("General Error:", e)
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")

###### Open New Branch API #######
@app.route('/api/branch/new', methods=['POST'])
def new_branch():
    connection = None
    try:
        data = request.get_json()
        branch_no = data.get('branchNo')
        street = data.get('street')
        city = data.get('city')
        postCode = data.get('postCode')

        if not all([branch_no, street, city, postCode]):
            return jsonify({"error": "All fields are required"}), 400

        connection = oracledb.connect(**db_config)
        cursor = connection.cursor()
        cursor.callproc("new_branch", [branch_no, street, city, postCode])
        connection.commit()
        return jsonify({"message": "Branch opened successfully!"}), 201

    except oracledb.DatabaseError as e:
        error, = e.args
        if connection:
            connection.rollback()
        print("Database error:", error.message)
        return jsonify({"message": f"Failed to open branch: {error.message}"}), 500
    except Exception as e:
        if connection:
            connection.rollback()
        print("General Error:", e)
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")


###### Client Registration API #######
@app.route('/api/client/register', methods=['POST'])
def client_register():
    connection = None
    try:
        data = request.get_json()
        clientno = data.get('clientNo')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        telno = data.get('telNo')
        street = data.get('street')
        city = data.get('city')
        email = data.get('email')
        preftype = data.get('prefType')
        maxrent = data.get('maxRent')

        if not all([clientno, first_name, last_name, telno, street, city, email, preftype, maxrent]):
            return jsonify({"error": "All fields are required"}), 400
        
        connection = oracledb.connect(**db_config)
        print("Connection successful!")
        
        cursor = connection.cursor()
        cursor.callproc(
            "CLIENT_REGISTER_SP",
            [   
                clientno,
                first_name,
                last_name,
                telno,
                street,
                city,
                email,
                preftype,
                maxrent
            ]
        )
        connection.commit()

        return jsonify({"message": "Client registered successfully!"}), 201

    except oracledb.DatabaseError as e:
        error, = e.args
        print("Database connection failed:", e)
        print("Oracle Error:", error.message)
        if connection:
            connection.rollback()
        return jsonify({"message": f"Failed to register client: {error.message}"}), 500
    
    except Exception as e:
        print("General Error:", e)
        if connection:
            connection.rollback()
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")

###### Client List API #######
@app.route('/api/client/list', methods=['GET'])
def get_client_list():
    connection = None
    try:
        connection = oracledb.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("SELECT clientno, fname, lname, telno, street, city, email, preftype, maxrent FROM DH_CLIENT")
        client_records = cursor.fetchall()

        client_list = []
        for record in client_records:
            client_list.append({
                "clientNo": record[0],
                "firstName": record[1],
                "lastName": record[2],
                "telNo": record[3],
                "street": record[4],
                "city": record[5],
                "email": record[6],
                "prefType": record[7],
                "maxRent": record[8]
            })
        return jsonify(client_list), 200

    except oracledb.DatabaseError as e:
        error, = e.args
        print("Database error:", error.message)
        return jsonify({"message": f"Failed to retrieve client list: {error.message}"}), 500
    except Exception as e:
        print("General Error:", e)
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")

###### Client Delete API #######
@app.route('/api/client/delete', methods=['DELETE'])
def client_delete():
    connection = None
    try:
        data = request.get_json()
        clientno = data.get('clientNo')

        if not clientno:
            return jsonify({"error": "Client number is required"}), 400
        
        connection = oracledb.connect(**db_config)
        cursor = connection.cursor()
        cursor.callproc("DELETE_CLIENT_SP", [clientno])
        connection.commit()
        return jsonify({"message": "Client Record Deleted Successfully!"}), 200
    
    except oracledb.DatabaseError as e:
        error, = e.args
        if connection:
            connection.rollback()
        return jsonify({"message": f"Failed to delete client: {error.message}"}), 500
    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if connection:
            connection.close()
            print("Connection closed successfully.")

if __name__ == '__main__':
    app.run(debug=True, port=3000)

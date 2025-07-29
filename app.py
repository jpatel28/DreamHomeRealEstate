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
    "user": "j16patel",
    "password": "07283346",
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

@app.route('/staffMainMenuForm.html')
def staff_main_menu_form():
    return render_template('staffMainMenuForm.html')

@app.route('/staffListUpdate.html')
def staff_list_update():
    return render_template('staffListUpdate.html')



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


if __name__ == '__main__':
    app.run(debug=True, port=3000)
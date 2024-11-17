# Library Management System with Automated Fine CAluculation


---


## Database Setup

1. **Create the Database**:
   - Open **MySQL Workbench**.
   - Create a new database named `library_management_system`.
   - Run all the queries from database file in this branch.

2. **Configure Database in Django**:
   - Open the `settings.py` file in your Django project.
   - Update the database configuration:
     ```python
     DATABASES = {
         'default': {
             'ENGINE': 'django.db.backends.mysql',
             'NAME': 'library_management_system',
             'USER': 'your_mysql_username',
             'PASSWORD': 'your_mysql_password',
             'HOST': 'localhost',
             'PORT': '3306',
         }
     }
     ```

---

## Backend Setup (Django)

1. **Install Dependencies**:
   - Open the project folder in PyCharm.
   - In the PyCharm terminal, navigate to the main project directory:
     ```bash
     cd librarymanagementsystem
     ```
   - Install required dependencies:
     ```bash
     pip install django mysqlclient
     ```

2. **Database Migrations**:
   - If running the project for the first time or after making database changes, run:
     ```bash
     python manage.py makemigrations
     python manage.py migrate
     ```

3. **Run the Backend Server**:
   - Start the backend server using:
     ```bash
     python manage.py runserver
     ```

---

## Frontend Setup (React)

1. **Navigate to Frontend Directory**:
   - Open a terminal or command prompt.
   - Navigate to the React frontend folder.

2. **Install Dependencies**:
   - Run the following command to install required dependencies:
     ```bash
     npm install
     ```
   - Additional dependencies to install:
     ```bash
     npm install axios react-router-dom
     npm install react-chartjs-2 chart.js
     npm install chartjs-plugin-datalabels
     ```

3. **Start the Frontend**:
   - Run the following command to start the frontend:
     ```bash
     npm start
     ```

4. **Access the Application**:
   - Open your web browser and navigate to:
     ```
     http://localhost:3000
     ```

---

## Running the Full Application

1. **Start MySQL Database**:
   - Open **MySQL Workbench** and ensure the `library_management_system` database is running.

2. **Start the Backend Server**:
   - Open the PyCharm terminal, navigate to the main project folder, and run:
     ```bash
     python manage.py runserver
     ```

3. **Start the React Frontend**:
   - Open a terminal, navigate to the React frontend folder, and run:
     ```bash
     npm start
     ```

4. **Access the Application**:
   - The application will be accessible at:
     ```
     http://localhost:3000
     ```

---

## Branches

- **Main Branch**: Contains the main application code for both frontend and backend.

---

## Technologies Used

### Backend:
- Django
- MySQL
- Python

### Frontend:
- React
- Axios
- React Router DOM
- React Chart.js 2
- Chart.js Plugin Datalabels

---

## Notes

- Ensure that the MySQL database, backend server, and frontend are all running before accessing the application.
- If you encounter database errors, ensure the `library_management_system` database exists and matches the configuration in `settings.py`.
- For major database changes, or running for the first time always run `python manage.py makemigrations` and `python manage.py migrate` before starting the backend server.



# Getting Started
Follow the steps below to set up the project on your local machine.

## Step 1: Clone the Repository
Using SSH:
```
git clone git@github.com:<username>/<repository-name>.git
```
OR

Using HTTPS:
```
git clone https://github.com/<username>/<repository-name>.git
```

## Step 2: Change the directory
After cloning the repository, you need to move into the project’s directory to access its files and run commands. Use the following command:
```
cd <repository-name>
```

## Step 3: Install Dependencies
Once inside the project directory, run the following command:
```
npm install
```

## Step 4: Start the Client (Frontend)
In the same terminal, start the frontend by running:
```
npm start
```

## Step 5: Start the Server (Backend)
Open a new terminal tab or PowerShell window and run the following command to start the backend server:
```
json-server --watch db.json --port 5000
```

### Note:
Ensure you have Node.js and npm installed on your machine.

The backend is powered by json-server for quick API prototyping. You can modify the db.json file to customize the data.
 

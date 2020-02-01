# Employee-Tracker

A command-line Content Management System (CMS) application that manages a company's employees.

# Programming Languages Used

Application uses Node, Inquirer, and MySQL.

# Functionality

The program allows the user to do the following to a company’s employees.

"View Employees",
"View Employees By Department",
"View Employees By Role",
"View Employees By Manager",
"Add Department",
"Add Role",
"Add Employee",
"Update Employee Role",
"Update Employee Managers",
"Remove Department",
"Remove Role",
"Remove Employee",
"View a Department's Budget"

# Deployment

In order to run this application, please following the following instructions in order.

# Set Up Database

To create the database, user must insert their username and password in the appropriate fields in the index.js file. Find these on lines 12 and 15 respectively. Once this is done, copy the text in the schema.sql file. Paste and then run this text in your MySQL server. Next, copy the text from the seed.sql file. Again, paste and run this text in your MySQL server. User has now created the database that the CMS will use in the application.

# Install Files

Before the user can run the program, they must install the necessary files that the application uses. In the command line, user needs to type the following separately. 

# "npm install mysql"
# "npm install inquirer"
# "npm install console.table"

Once these packages have been installed, the program is ready to run.

# Run Program

In the command line, type "node index.js". The user can use the arrow keys to navigate through the program to do various actions to the team as listed above. Navigate to the Exit tab to end the program.

# Screenshots

![Employee-Tracker](./assets/screenshots.PNG "Employee-Tracker Home Questions")

![Employee-Tracker](./assets/screenshots1.PNG "Employee-Tracker View Table")

![Employee-Tracker](./assets/screenshots2.PNG "Employee-Tracker Budget")

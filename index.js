let mysql = require("mysql");
let inquirer = require("inquirer");
let conTab = require("console.table");


let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "dylan",

    // Your password
    password: "hockey_rules",
    database: "employee_tracker_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Employee",
                "Add Department",
                "Add Role",
                "Add Employee",
                "View Employee's By Department",
                "View Role",
                "Update Employee's Role",
                "Update Employee Managers",
                "View Employees By Manager",
                "Remove Department",
                "Remove Role",
                "Remove Employee",
                "View a Department's Budget",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add Department":
                    addDepartment();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "View Department":
                    viewEmployeesByDepartment();
                    break;

                case "View Role":
                    viewRole();
                    break;

                case "View Employee":
                    viewEmployees();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                case "Update Employee Managers":
                    updateEmployeeManager();
                    break;

                case "View Employees By Manager":
                    viewEmployeeByManager();
                    break;

                case "Remove Department":
                    removeDepartment();
                    break;

                case "Remove Role":
                    removeRole();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "View a Department's Budget":
                    viewDepartmentsBudget();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

function viewEmployees() {
    //    console.log("You are now viewing all employee's. YAY!!!")
    let query = `select 
	E1.id,
    E1.first_name,
	E1.last_name,
	R.title,
    D.name,
    R.salary,
	concat(E2.first_name, " ", E2.last_name) as Manager
from 
	employee E1
left join employee E2
	on E1.manager_id = E2.id
inner join role R
	on E1.role_id = R.id
inner join department D
    on D.id = R.department_id`;
    connection.query(query, function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        console.table(res);
        start();
    });
}

function addDepartment() {

}

function addRole() {

}

function addEmployee() {

}

function viewEmployeesByDepartment() {

}

function viewRole() {

}

function updateEmployeeRole() {

}

function updateEmployeeManager() {

}

function viewEmployeeByManager() {

}

function removeDepartment() {

}

function removeRole() {

}

function removeEmployee() {

}

function viewDepartmentsBudget() {

}
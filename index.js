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
    // console.log("connected as id " + connection.threadId);
    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What Would You Like To Do?",
            choices: [
                "View Employees",
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

                case "View Employee's By Department":
                    viewEmployeesByDepartment();
                    break;

                case "View Role":
                    viewRole();
                    break;

                case "View Employees":
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
    E1.id,E1.first_name,E1.last_name,R.title,D.name,R.salary,concat(E2.first_name, " ", E2.last_name) as Manager
    from employee E1
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
    start();
}

function addRole() {
    start();
}

function addEmployee() {
    let role = [];
    let manager = [];
    connection.query(`select 
    E1.id,E1.first_name,E1.last_name,R.title,D.name,R.salary,concat(E2.first_name, " ", E2.last_name) as Manager, R.id as Role_ID, D.id as Department_ID
    from employee E1
    left join employee E2
    on E1.manager_id = E2.id
    inner join role R
    on E1.role_id = R.id
    inner join department D
    on D.id = R.department_id`, function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            role.push({value:res[i].Role_ID,name:res[i].title})
            if(res[i].Manager){
            manager.push(res[i].Manager)
            }
        }
        // console.log(manager)
        
        // connection.query(`select concat(E2.first_name, " ", E2.last_name) as Manager from employee E1 left join employee E2 on E1.manager_id = E2.id;`, function (err, res) {
        //     if (err) {
        //         console.error("error connecting: " + err.stack);
        //         return;
        //     }
        //     for (j = 0; j < res.length; j++) {
        //         manager.push(res[j].Manager)

        //     }

        //     console.log(res[j].manager)
            inquirer.prompt([
                {
                    name: "newEmployeeFirstName",
                    type: "input",
                    message: "Please Enter New Employee's First Name!"
                },
                {
                    name: "newEmployeeLastName",
                    type: "input",
                    message: "Please Enter New Employee's Last Name!"
                },
                {
                    name: "newEmployeeRole",
                    type: "list",
                    message: "What Will Your Employee's Role Be?",
                    choices: role
                },
                {
                    name: "newEmployeeManager",
                    type: "list",
                    message: "Who Will Be Your New Employee's Manager?",
                    choices: manager
                }
            ])
            .then(function ({newEmployeeFirstName, newEmployeeLastName, newEmployeeRole, newEmployeeManager}) {
                // console.log(newEmployeeFirstName, newEmployeeLastName, newEmployeeRole, newEmployeeManager);
                let manager = newEmployeeManager.split(" ")
                manager = res.filter(row=>row.first_name === manager[0]&&row.last_name === manager[1])[0].id
                
               
                console.log(role)
                connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",[newEmployeeFirstName, newEmployeeLastName, newEmployeeRole, manager], function (err, res){
                    if (err) throw err
                    // console.table(res)
                    start();
                })
                
                
            })
        })
    // })
}

async function viewEmployeesByDepartment() {
    // console.log("Is this working?")
    let departments = [];
    connection.query("select name from department", function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            departments.push(res[i].name)

        }
        // console.log(departments);

        // console.log(departments)
        inquirer.prompt(
            {
                name: "department",
                type: "list",
                message: "Which Department Would You Like To Look At?",
                choices: departments
            }
        )
            .then(function (answer) {
                console.log(answer.department);
                let query = `select
                E1.id, E1.first_name, E1.last_name, R.title, D.name, R.salary, concat(E2.first_name, " ", E2.last_name) as Manager
                from employee E1
                left join employee E2
                on E1.manager_id = E2.id
                inner join role R
                on E1.role_id = R.id
                inner join department D
                on D.id = R.department_id
                where D.name = ?`;
                connection.query(query, [answer.department], function (err, res) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    console.table(res);
                    start();
                })
            })
    })
}

function viewRole() {
    start();
}

function updateEmployeeRole() {
    start();
}

function updateEmployeeManager() {
    start();
}

function viewEmployeeByManager() {
    // console.log("Is this working?")
    let manager = [];
    connection.query("select name from department", function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            departments.push(res[i].name)
            // console.log(departments);
        }

    })

    inquirer.prompt([
        {
            name: "department",
            type: "list",
            message: "Which Manager Would You Like To Look At?",
            choices: [
                "SALES",
                "ENGINEERING",
                "LEGAL",
                "FINANCE"
            ]
        }
    ]).then(function (answer) {
        console.log(departments);
        let query = `select
            E1.id, E1.first_name, E1.last_name, R.title, D.name, R.salary, concat(E2.first_name, " ", E2.last_name) as Manager
            from employee E1
            left join employee E2
            on E1.manager_id = E2.id
            inner join role R
            on E1.role_id = R.id
            inner join department D
            on D.id = R.department_id
            where E1.manager_id = 3`;
        connection.query(query, function (err, res) {
            if (err) {
                console.error("error connecting: " + err.stack);
                return;
            }
            console.table(res);
            start();
        })
    })
}

function removeDepartment() {
    start();
}

function removeRole() {
    start();
}

function removeEmployee() {
    start();
}

function viewDepartmentsBudget() {
    start();
}
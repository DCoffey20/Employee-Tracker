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

                case "View Employees By Department":
                    viewEmployeesByDepartment();
                    break;

                case "View Employees By Role":
                    viewEmployeesByRole();
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
    let query = `select 
    E1.id,E1.first_name,E1.last_name,R.title,D.name,R.salary,concat(E2.first_name, " ", E2.last_name) as Manager
    from employee E1
    left join employee E2
    on E1.manager_id = E2.id
    inner join role R
    on E1.role_id = R.id
    inner join department D
    on D.id = R.department_id
    order by E1.id`;
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
    inquirer.prompt(
        {
            name: "newDepartment",
            type: "input",
            message: "Please Enter The New Department Name."
        }
    )
        .then(function ({ newDepartment }) {
            connection.query("INSERT INTO department (name) VALUES (?)", [newDepartment], function (err, res) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                start();
            })
        })
}

function addRole() {
    let department = [];
    connection.query(`select name, id from department`, function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            department.push({ value: res[i].id, name: res[i].name })
        }
        inquirer.prompt([
            {
                name: "roleDepartment",
                type: "list",
                message: "Which Department Does The New Role Belong To?",
                choices: department
            },
            {
                name: "newRole",
                type: "input",
                message: "Please Enter The New Role Name."
            },
            {
                name: "newSalary",
                type: "number",
                message: "What Is The Salary Of The New Role?",
            }
        ])
            .then(function ({ newRole, newSalary, roleDepartment }) {
                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?)", [newRole, newSalary, roleDepartment], function (err, res) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    start();
                })
            })
    })
}

function addEmployee() {
    let role = [];
    let manager = [];
    connection.query(`select 
    E1.id,E1.first_name,E1.last_name,R.title,D.name,R.salary,concat(E2.first_name, " ", E2.last_name) as Manager, R.id as Role_ID, D.id as Department_ID, E1.manager_id as Man_ID
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
            role.push({ value: res[i].Role_ID, name: res[i].title })
            if (res[i].Manager) {
                manager.push({ value: res[i].Man_ID, name: res[i].Manager })
            }
        }
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
            .then(function ({ newEmployeeFirstName, newEmployeeLastName, newEmployeeRole, newEmployeeManager }) {
                connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [newEmployeeFirstName, newEmployeeLastName, newEmployeeRole, newEmployeeManager], function (err, res) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    start();
                })
            })
    })
}

function viewEmployeesByDepartment() {
    let departments = [];
    connection.query("select name from department", function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            departments.push(res[i].name)
        }
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

function viewEmployeesByRole() {
    let role = [];
    connection.query("select title from role", function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            role.push(res[i].title)
        }
        inquirer.prompt(
            {
                name: "role",
                type: "list",
                message: "Which Department Would You Like To Look At?",
                choices: role
            }
        )
            .then(function (answer) {
                console.log(answer.role);
                let query = `select
                E1.id, E1.first_name, E1.last_name, R.title, D.name, R.salary, concat(E2.first_name, " ", E2.last_name) as Manager
                from employee E1
                left join employee E2
                on E1.manager_id = E2.id
                inner join role R
                on E1.role_id = R.id
                inner join department D
                on D.id = R.department_id
                where R.title = ?`;
                connection.query(query, [answer.role], function (err, res) {
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

function updateEmployeeRole() {
    let employee = [];
    let role = [];
    connection.query(`select 
    concat(E1.first_name, " ", E1.last_name) as Employee, R.title, R.id as Role_ID, E1.id as Emp_ID
    from employee E1
    inner join role R
    on E1.role_id = R.id`, function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            role.push({ value: res[i].Role_ID, name: res[i].title })
            if (res[i].Employee)
                employee.push({ value: res[i].Emp_ID, name: res[i].Employee })
        }
        inquirer.prompt([
            {
                name: "updateEmployee",
                type: "list",
                message: "Which Employee's Role Do You Want To Update?",
                choices: employee
            },
            {
                name: "newRole",
                type: "list",
                message: "Please Select Employee's New Role.",
                choices: role
            }
        ])
            .then(function ({ updateEmployee, newRole }) {
                connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [newRole, updateEmployee], function (err, res) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    start();
                })
            })
    })
}

function updateEmployeeManager() {
    let employee = [];
    let manager = [];
    connection.query(`select 
    E1.id, concat(E1.first_name," ", E1.last_name) as Employee, concat(E2.first_name, " ", E2.last_name) as Manager, E1.manager_id as Man_ID, E1.id as Emp_ID
    from employee E1
    left join employee E2
    on E1.manager_id = E2.id`, function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            manager.push({ value: res[i].Man_ID, name: res[i].Manager })
            if (res[i].Employee)
                employee.push({ value: res[i].Emp_ID, name: res[i].Employee })
        }
        inquirer.prompt([
            {
                name: "updateEmployee",
                type: "list",
                message: "Which Employee's Manager Do You Want To Update?",
                choices: employee
            },
            {
                name: "newManager",
                type: "list",
                message: "Please Select The Employee's New Manager.",
                choices: manager
            }
        ])
            .then(function ({ updateEmployee, newManager }) {
                connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [newManager, updateEmployee], function (err, res) {
                    if (err) {
                        console.error("error connecting: " + err.stack);
                        return;
                    }
                    start();
                })
            })
    })
}

function viewEmployeeByManager() {
    let manager = [];
    connection.query(`select 
    concat(employee.first_name, " ", employee.last_name) as Manager, employee.manager_id as Man_ID
    from employee`, function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            manager.push(res[i].Manager)
        }
        inquirer.prompt([
            {
                name: "manager",
                type: "list",
                message: "Which Manager Would You Like To Look At?",
                choices: manager
            }
        ]).then(function (answer) {
            let query = `select
            E1.id, E1.first_name, E1.last_name, R.title, D.name, R.salary, concat(E2.first_name, " ", E2.last_name) as Manager
            from employee E1
            left join employee E2
            on E1.manager_id = E2.id
            inner join role R
            on E1.role_id = R.id
            inner join department D
            on D.id = R.department_id
            where concat(E2.first_name, " ", E2.last_name) = ?`;
            connection.query(query, [answer.manager], function (err, res) {
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

function removeDepartment() {
    let department = [];
    connection.query(`select name, id from department`, function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            department.push({value: res[i].id, name:res[i].name})
        }
        inquirer.prompt([
            {
                name: "deleteDepartment",
                type: "list",
                message: "Which Department Would You Like To Delete? (!DELETING A DEPARTMENT WILL DELETE ALL EMPLOYEES IN THAT DEPARTMENT!)",
                choices: department
            }
        ]).then(function ({deleteDepartment}) {
            connection.query(`delete from department where id = ?`, [deleteDepartment], function (err, res) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                start();
            })
        })
    })
}

function removeRole() {
    let role = [];
    connection.query(`select title, id from role`, function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            role.push({value: res[i].id, name:res[i].title})
        }
        inquirer.prompt([
            {
                name: "deleteRole",
                type: "list",
                message: "Which Role Would You Like To Delete? (!DELETING A ROLE WILL DELETE ALL EMPLOYEES IN THAT ROLE!)",
                choices: role
            }
        ]).then(function ({deleteRole}) {
            connection.query(`delete from role where id = ?`, [deleteRole], function (err, res) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                start();
            })
        })
    })
}

function removeEmployee() {
    let employee = [];
    connection.query(`select concat(E1.first_name, " ", E1.last_name) as Employee, id from employee as E1`, function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            employee.push({value: res[i].id, name:res[i].Employee})
        }
        inquirer.prompt([
            {
                name: "deleteEmployee",
                type: "list",
                message: "Which Employee Would You Like To Delete?",
                choices: employee
            }
        ]).then(function ({deleteEmployee}) {
            connection.query(`delete from employee where id = ?`, [deleteEmployee], function (err, res) {
                if (err) {
                    console.error("error connecting: " + err.stack);
                    return;
                }
                start();
            })
        })
    })
}

function viewDepartmentsBudget() {
    let department = [];
    connection.query(`select name, id from department`, function (err, res) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        for (i = 0; i < res.length; i++) {
            department.push({value: res[i].id, name:res[i].name})
        }
        inquirer.prompt([
            {
                name: "departmentBudget",
                type: "list",
                message: "Which Department Budget Would You Like To View?",
                choices: department
            }
        ]).then(function ({departmentBudget}) {
            connection.query(`select D.name as Department, sum(salary) as Budget from employee E inner join role R on R.id = E.role_id inner join department D on D.id = R.department_id where R.department_id = ?;`, [departmentBudget], function (err, res) {
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
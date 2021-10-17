const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

console.log(`Welcome to the Employee Management System!\n`);

function menuPrompt() {

    let rolesObjArr = [];
    let roleTitles = [];
    connection.query(`SELECT * FROM role ORDER BY id ASC`, (err, results, fields) => {
        if (err) {
            console.log({ error: err.message });
            return;
        }

        for (let i = 0; i < results.length; i++) {
            const role = results[i];
            rolesObjArr.push(role);

            roleTitles.push(role.title);
        }

    });

    let departmentsObjArr = [];
    let departmentNames = [];
    connection.query(`SELECT * FROM department ORDER BY id ASC`, (err, results, fields) => {
        if (err) {
            console.log({ error: err.message });
            return;
        }

        for (let i = 0; i < results.length; i++) {
            const department = results[i];
            departmentsObjArr.push(department);

            departmentNames.push(department.name);
        }
    });

    let employeesObjArr = [];
    let employeesNames = [];
    connection.query(`SELECT * FROM employee ORDER BY id ASC`, (err, results, fields) => {
        if (err) {
            console.log({ error: err.message });
            return;
        }

        for (let i = 0; i < results.length; i++) {
            const employee = results[i];
            employeesObjArr.push(employee);

            employeesNames.push(`${employee.first_name} ${employee.last_name}`);
        }
    });

    inquirer.prompt({

        type: 'list',
        message: 'What would you like to do?',
        name: 'nextStep',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']

    }).then((res) => {

        if (res.nextStep === 'View All Employees') {
            connection.query(`SELECT a.id as ID, a.first_name as First_Name, a.last_name as Last_Name, role.title as Role, role.salary as Salary, department.name as Department, CONCAT (b.first_name, ' ', b.last_name) as Manager FROM employee b RIGHT JOIN employee a ON b.id = a.manager_id INNER JOIN role ON a.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY a.id ASC`, (err, results, fields) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }

                console.table(results);
                return menuPrompt();
            });

        } else if (res.nextStep === 'Add Employee') {
            let newEmployee = {};

            employeesNames.unshift('None');

            inquirer.prompt([
                {
                    type: 'input',
                    message: "What is the employee's first name?",
                    name: 'first_name'
                },
                {
                    type: 'input',
                    message: "What is the employee's last name?",
                    name: 'last_name'
                },
                {
                    type: 'list',
                    message: "What is the employee's role?",
                    name: 'role',
                    choices: roleTitles
                },
                {
                    type: 'list',
                    message: "Who is the employee's manager?",
                    name: 'manager',
                    choices: employeesNames
                },
            ])
                .then((res) => {
                    newEmployee.first_name = res.first_name;
                    newEmployee.last_name = res.last_name;

                    for (let i = 0; i < roleTitles.length; i++) {
                        if (roleTitles[i] === res.role) {
                            newEmployee.role_id = i + 1;
                        }
                    }

                    if (res.manager != 'None') {
                        for (let i = 0; i < employeesNames.length; i++) {
                            if (employeesNames[i] === res.manager) {
                                newEmployee.manager_id = i;
                            }
                        }
                    } else {
                        newEmployee.manager_id = null;
                    }
                })
                .then(() => {
                    connection.query(
                        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`, [newEmployee.first_name, newEmployee.last_name, newEmployee.role_id, newEmployee.manager_id], (err, results, fields) => {
                        if (err) {
                            console.log({ error: err.message });
                            return;
                        }

                        console.log(`${newEmployee.first_name} ${newEmployee.last_name} has been added!\n-------------------------------------------------`);

                        return menuPrompt();
                    });
                })
        } else if (res.nextStep === 'Update Employee Role') {
            let currEmployee = {};
            inquirer.prompt([
                {
                    type: 'list',
                    message: "Which employee's role would you like to update?",
                    name: 'name',
                    choices: employeesNames
                },
                {
                    type: 'list',
                    message: "Which role would you like to assign this employee to?",
                    name: 'role',
                    choices: roleTitles
                },
            ])
                .then((res) => {
                    currEmployee.name = res.name;
                    currEmployee.roleName = res.role;

                    for (let i = 0; i < employeesNames.length; i++) {
                        if (employeesNames[i] === res.name) {
                            currEmployee.id = i + 1;
                        };
                    };

                    for (let i = 0; i < roleTitles.length; i++) {
                        if (roleTitles[i] === res.role) {
                            currEmployee.role_id = i + 1;
                        };

                    };
                })
                .then(() => {
                    connection.query(
                        `UPDATE employee SET role_id = ? WHERE id = ?`, [currEmployee.role_id, currEmployee.id], (err, results, fields) => {
                            if (err) {
                                console.log({ error: err.message });
                                return;
                            }

                            console.log(`${currEmployee.name}'s role has been updated to ${currEmployee.roleName}!\n-------------------------------------------------`);

                            return menuPrompt();
                        });
                })

        } else if (res.nextStep === 'View All Roles') {
            connection.query(`SELECT role.id as Role, role.title as Title, department.name as Department, role.salary as Salary FROM role INNER JOIN department ON role.department_id=department.id ORDER BY role.id ASC`, (err, results, fields) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }
                console.table(results);
                return menuPrompt();
            });

        } else if (res.nextStep === 'Add Role') {
            let newRole = {};

            inquirer.prompt([
                {
                    type: 'input',
                    message: "What is the role's title?",
                    name: 'title'
                },
                {
                    type: 'number',
                    message: "What is the role's salary?",
                    name: 'salary'
                },
                {
                    type: 'list',
                    message: "What department is the role in?",
                    name: 'department',
                    choices: departmentNames
                },
            ])
                .then((res) => {
                    newRole.title = res.title;
                    newRole.salary = res.salary;
                    newRole.department = res.department;

                    for (let i = 0; i < departmentNames.length; i++) {
                        if (departmentNames[i] === res.department) {
                            newRole.department_id = i + 1;
                        }
                    }
                })
                .then(() => {
                    connection.query(
                        `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`, [newRole.title, newRole.salary, newRole.department_id], (err, results, fields) => {
                        if (err) {
                            console.log({ error: err.message });
                            return;
                        }

                        console.log(`${newRole.title} has been added to the ${newRole.department} department!\n-------------------------------------------------`);

                        return menuPrompt();
                    });
                })

        } else if (res.nextStep === 'View All Departments') {
            connection.query(`SELECT department.id as ID, department.name as Name FROM department ORDER BY id ASC`, (err, results, fields) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }
                console.table(results);
                return menuPrompt();
            });

        } else if (res.nextStep === 'Add Department') {
            let newDept = {};

            inquirer.prompt([
                {
                    type: 'input',
                    message: "What is the department's name?",
                    name: 'name'
                },
            ])
                .then((res) => {
                    newDept.name = res.name;
                })
                .then(() => {
                    connection.query(
                        `INSERT INTO department (name)
                        VALUES (?)`, [newDept.name], (err, results, fields) => {
                        if (err) {
                            console.log({ error: err.message });
                            return;
                        }

                        console.log(`${newDept.name} has been added\n-------------------------------------------------`);

                        return menuPrompt();
                    });
                })

        } else {
            console.log('Thank you for using the Employee Management System!');
            return process.exit(0);
        }
    });
};

menuPrompt();
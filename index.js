const inquirer = require('inquirer');
const fs = require('fs');
const cTable = require('console.table');
require('dotenv').config();

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

console.log(`Welcome to the Employee Management System!`);

function menuPrompt() {

    let rolesArr = [];
    connection.query(`SELECT title FROM role`, (err, results, fields) => {
        if (err) {
            console.log({ error: err.message });
            return;
        }

        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            rolesArr.push(element.title);
        }
    });

    let departmentArr = [];
    connection.query(`SELECT name FROM department`, (err, results, fields) => {
        if (err) {
            console.log({ error: err.message });
            return;
        }

        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            departmentArr.push(element.title);
        }
    });

    inquirer.prompt({

        type: 'list',
        message: 'What would you like to do?',
        name: 'nextStep',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
        
    }).then((res) => {

        if (res.nextStep === 'View All Employees') {
            connection.query(`SELECT * FROM employee`, (err, results, fields) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }
                console.table(results);
                return menuPrompt();
            });

        } else if (res.nextStep === 'View All Roles') {
            connection.query(`SELECT * FROM role`, (err, results, fields) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }
                console.table(results);
                return menuPrompt();
            });

        } else if (res.nextStep === 'View All Departments') {
            connection.query(`SELECT * FROM department`, (err, results, fields) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }
                console.table(results);
                return menuPrompt();
            });

        } else if (res.nextStep === 'Add Employee') {
            let employeeInfo = [];
            inquirer.prompt([
                {
                    type: 'input',
                    message: "What is the employee's first name?",
                    name: 'first_name'
                },
                {
                    type: 'input',
                    message: "What is the employee's last name?",
                    name: 'first_name'
                },
                {
                    type: 'list',
                    message: "What is the employees role?",
                    name: 'role',
                    choices: rolesArr
                },])


            connection.query(`SELECT * FROM department`, (err, results, fields) => {
                if (err) {
                    console.log({ error: err.message });
                    return;
                }
                console.table(results);
                return menuPrompt();
            });

        } else {
            console.log('Thank you for using the Employee Management System!');
            return process.exit(0);
        }
    });
};

menuPrompt();
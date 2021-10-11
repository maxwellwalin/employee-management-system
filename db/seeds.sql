INSERT INTO department(name)
VALUES ('Operations'), ('Sales'), ('Installation'), ('Service');

INSERT INTO role(title, salary, department_id)
VALUES ('Installation Manager', 100000.00, 3),
('Service Manager', 100000.00, 4),
('Installation Technician', 50000.00, 3),
('Service Technician', 50000.00, 4),
('Salesman', 125000.00, 2),
('Director of Operations', 150000.00, 1),
('Purchasing Manager', 90000.00, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Alexander', 'Hamilton', 1, NULL),
('Mario', 'Brother', 2, NULL),
('Gary', 'Ability', 6, NULL),
('Liz', 'Rodrigo', 7, 3),
('Timothy', 'Lee', 5, NULL),
('Chaddwick', 'Boseman(RIP)', 3, 2),
('Andrew', 'Fernandez', 3, 1);   

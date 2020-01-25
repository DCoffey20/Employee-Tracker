use employee_tracker_db;

INSERT INTO department (name)
VALUES ("SALES"), ("ENGINEERING"), ("FINANCE"), ("LEGAL");

INSERT INTO role (title, salary, department_id)
VALUES ("LAWYER", "150000", 4), ("LEGAL TEAM LEAD", "300000", 4), ("ACCOUNTANT", "105000", 3), ("SOFTWARE ENGINEER", "125000", 2), ("JUNIOR DEVELOPER", "85000", 2), ("LEAD ENGINEER", "200000", 2), ("SALES MANAGER", "175000", 1), ("SALESPERSON", "100000", 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Joni", "Johnston", 5, 4), ("Alexia", "Mcleod", 8, 3), ("Loui", "Roman", 7, null), ("Neel", "Keenan", 4, 10), ("Rahim", "Cantu", 8, 3), ("Jadine", "Jefferson", 1, 8), ("Bo", "Patrick", 5, 4), ("Grayson", "Ponce", 2, null), ("Sara", "Harding", 3, null), ("Miller", "Gillespie", 6, null);

-- Joining department and role tables
-- select 
-- 	t1.id,
-- 	title,
-- 	salary,
--     name
-- from
-- 	role t1
-- inner join department t2
-- 	on t1.department_id = t2.id;
CREATE TABLE patient (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  gender varchar(2) NOT NULL,
  weight decimal(5,2) NOT NULL,
  height decimal(5,2) NOT NULL
);

INSERT INTO patient 
    (name, gender, weight, height) 
    VALUES ('Sigit Rendang', 'M', 50.5, 165.3);

INSERT INTO patient 
    (name, gender, weight, height) 
    VALUES ('Rizal Vitamin', 'M', 45.5, 161.8);

INSERT INTO patient 
    (name, gender, weight, height) 
    VALUES ('Neida Aleida', 'F', 50.2, 160.2);
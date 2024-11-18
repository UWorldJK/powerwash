CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    country VARCHAR(50)
);
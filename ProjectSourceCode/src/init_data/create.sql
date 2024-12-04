CREATE TABLE IF NOT EXISTS users(
        username VARCHAR(50) PRIMARY KEY,
        email VARCHAR(50) NOT NULL,
        password CHAR(60) NOT NULL,
        reset_token VARCHAR(255),
        reset_token_expires TIMESTAMP
);

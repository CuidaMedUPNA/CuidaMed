CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    birthdate DATE,
    profile_picture TEXT,
    gender VARCHAR(10)
);

CREATE TABLE medicine (
    id SERIAL PRIMARY KEY,
    pactive VARCHAR(200) NOT NULL,
    picture TEXT,
    trade_name VARCHAR(200) NOT NULL,
    dose VARCHAR(100),
    unit VARCHAR(50)
);

CREATE TABLE treatment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    user_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE intake (
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE,
    frequency VARCHAR(100) NOT NULL,
    medicine_id INT NOT NULL,
    user_id INT NOT NULL,
    dose_intake VARCHAR(100),
    hour TIME,
    FOREIGN KEY (medicine_id) REFERENCES medicine(id) ON DELETE CASCADE,
    FOREIGN KEY (treatment_id) REFERENCES treatment(id) ON DELETE CASCADE
);

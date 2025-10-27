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
    trade_name VARCHAR(200) NOT NULL,
    picture TEXT
);

CREATE TABLE treatment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    user_id INT NOT NULL,
    start_date DATE,
    end_date DATE,

    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE medicine_ingredient (
    id SERIAL PRIMARY KEY,
    medicine_id INT NOT NULL,
    ingredient_name VARCHAR(200) NOT NULL,
    concentration_amount NUMERIC(8, 2) NOT NULL,
    concentration_unit VARCHAR(50) NOT NULL,

    FOREIGN KEY (medicine_id) REFERENCES medicine(id) ON DELETE CASCADE
);

CREATE TABLE dosing_schedule (
    id SERIAL PRIMARY KEY,
    medicine_id INT NOT NULL,
    treatment_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    dose_amount NUMERIC(5, 2) NOT NULL,
    dose_unit VARCHAR(50) NOT NULL,
    
    FOREIGN KEY (medicine_id) REFERENCES medicine(id) ON DELETE CASCADE,
    FOREIGN KEY (treatment_id) REFERENCES treatment(id) ON DELETE CASCADE
);

CREATE TABLE dosing_time (
    id SERIAL PRIMARY KEY,
    dosing_schedule_id INT NOT NULL,
    scheduled_time TIME NOT NULL, 
    day_of_week INT, -- 1=Lunes, 7=Domingo. NULL para tomas diarias.
    
    FOREIGN KEY (dosing_schedule_id) REFERENCES dosing_schedule(id) ON DELETE CASCADE
);

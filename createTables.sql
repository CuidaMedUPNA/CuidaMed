
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    foto TEXT,
    sexo VARCHAR(10)
);

CREATE TABLE medicamentos (
    id SERIAL PRIMARY KEY,
    pactivo VARCHAR(200) NOT NULL,
    foto TEXT,
    nombre_comercial VARCHAR(200) NOT NULL,
    dosis VARCHAR(100)
);

CREATE TABLE tratamientos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE medicamentos_tratamientos (
    id_medicamento INT NOT NULL,
    id_tratamiento INT NOT NULL,
    PRIMARY KEY (id_medicamento, id_tratamiento),
    FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tratamiento) REFERENCES tratamientos(id) ON DELETE CASCADE
);

CREATE TABLE tomas (
    id SERIAL PRIMARY KEY,
    fecha_ini DATE NOT NULL,
    fecha_fin DATE,
    frecuencia VARCHAR(100) NOT NULL,
    id_medicamento INT NOT NULL,
    id_usuario INT NOT NULL,
    dosis_toma VARCHAR(100),
    unidad VARCHAR(50),
    hora TIME,
    FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

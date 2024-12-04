DROP DATABASE IF EXISTS apollo;

CREATE DATABASE apollo;

\c apollo

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Vehicle (
    vin VARCHAR(17) DEFAULT SUBSTRING(uuid_generate_v4()::TEXT FROM 1 FOR 17) PRIMARY KEY,
    manufacturer_name TEXT,
    description TEXT,
    horse_power NUMERIC,
    model_name TEXT,
    model_year NUMERIC,
    purchase_price DECIMAL,
    fuel_type TEXT
);


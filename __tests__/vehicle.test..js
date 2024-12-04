const request = require("supertest");
const app = require("../app");
const { Pool } = require("pg");
const env = require("../env.json");

const pool = new Pool(env);

beforeAll(async () => {
    // Clear the database and seed initial data
    await pool.query("DELETE FROM Vehicle");
});

afterAll(async () => {
    await pool.end();
});

describe("Vehicle Service API Tests", () => {
    const testVehicle = {
        manufacturer_name: "Ford",
        description: "Reliable and efficient",
        horse_power: 1000,
        model_name: "retro",
        model_year: 2020,
        purchase_price: 200000,
        fuel_type: "Gasoline",
    };

    let testVin;

    test("POST /vehicle - Create a new vehicle", async () => {
        const response = await request(app)
            .post("/vehicle")
            .send(testVehicle);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveLength(1);
        testVin = response.body[0].vin; // Store VIN for subsequent tests
        expect(testVin).toBeDefined();
    });

    test("GET /vehicle - Get all vehicles", async () => {
        const response = await request(app).get("/vehicle");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toMatchObject(testVehicle);
    });

    test("GET /vehicle/:id - Get a vehicle by VIN", async () => {
        const response = await request(app).get(`/vehicle/${testVin}`);
        expect(response.statusCode).toBe(200);
        expect(response.body[0]).toMatchObject(testVehicle);
    });

    test("PUT /vehicle/:id - Update an existing vehicle", async () => {
        const updatedVehicle = {
            manufacturer_name: "Honda",
            description: "Updated description",
            horse_power: 150,
            model_name: "Civic",
            model_year: 2021,
            purchase_price: 22000,
            fuel_type: "Gasoline",
        };

        const response = await request(app)
            .put(`/vehicle/${testVin}`)
            .send(updatedVehicle);
        expect(response.statusCode).toBe(200);
        expect(response.body[0]).toMatchObject(updatedVehicle);
    });

    test("DELETE /vehicle/:id - Delete a vehicle", async () => {
        const response = await request(app).delete(`/vehicle/${testVin}`);
        expect(response.statusCode).toBe(204);

        // Verify the vehicle is deleted
        const verifyResponse = await request(app).get(`/vehicle/${testVin}`);
        expect(verifyResponse.statusCode).toBe(404);
    });

    test("POST /vehicle - Validation errors", async () => {
        const invalidVehicle = {
            manufacturer_name: "Test",
            horse_power: "InvalidHorsePower", // Invalid type
            model_year: 1800, // Out of range
            purchase_price: -500, // Invalid value
            fuel_type: "Gasoline",
        };

        const response = await request(app).post("/vehicle").send(invalidVehicle);
        expect(response.statusCode).toBe(422);
        expect(response.body).toHaveProperty("error");
    });

    test("PUT /vehicle/:id - Missing fields", async () => {
        const response = await request(app).put(`/vehicle/${testVin}`).send({});
        expect(response.statusCode).toBe(422);
        expect(response.body).toHaveProperty("error");
    });
});

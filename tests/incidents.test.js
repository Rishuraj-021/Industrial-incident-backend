const os = require("os");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

const validIncident = {
    title: "Automated test incident",
    description: "Testing incident creation",
    type: "Equipment Failure",
    location: "Factory Test Area",
    severity: "High",
    reportedBy: "Automated Test"
};

beforeAll(async () => {
await mongoose.connect(
    "mongodb://127.0.0.1:27017/industrial_incidents_test",
    {
        serverSelectionTimeoutMS: 5000,
        runtimeAdapters: { os }
    }
);
        await mongoose.connection.dropDatabase();
}, 15000);

afterAll(async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.dropDatabase();
        }
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
}, 15000);

describe("Incidents API", () => {
    test("rejects incidents with missing required fields", async () => {
        const response = await request(app)
            .post("/api/incidents")
            .send({
                title: "Oil leakage near machine"
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test("rejects invalid severity", async () => {
        const response = await request(app)
            .post("/api/incidents")
            .send({
                ...validIncident,
                severity: "Urgent"
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("Severity must be");
    });

    test("creates a valid incident", async () => {
        const response = await request(app)
            .post("/api/incidents")
            .send(validIncident);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(validIncident.title);
        expect(response.body.data.severity).toBe("High");
    });
});


const request = require("supertest");
const mongoose = require("mongoose");
const os = require("os");
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
            .send({ title: "Oil leakage near machine" });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test("rejects invalid severity", async () => {
        const response = await request(app)
            .post("/api/incidents")
            .send({ ...validIncident, severity: "Urgent" });

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

    test("retrieves all incidents", async () => {
        await request(app)
            .post("/api/incidents")
            .send(validIncident);

        const response = await request(app)
            .get("/api/incidents");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    test("retrieves an incident by ID", async () => {
        const created = await request(app)
            .post("/api/incidents")
            .send(validIncident);

        expect(created.status).toBe(201);

        const incidentId = created.body.data._id;

        const response = await request(app)
            .get(`/api/incidents/${incidentId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data._id).toBe(incidentId);
    });

    test("filters incidents by severity", async () => {
        await request(app)
            .post("/api/incidents")
            .send(validIncident);

        const response = await request(app)
            .get("/api/incidents?severity=High");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(1);

        expect(
            response.body.data.every(
                incident => incident.severity === "High"
            )
        ).toBe(true);
    });

    test("updates an incident using PATCH", async () => {
        const created = await request(app)
            .post("/api/incidents")
            .send(validIncident);

        expect(created.status).toBe(201);

        const incidentId = created.body.data._id;

        const response = await request(app)
            .patch(`/api/incidents/${incidentId}`)
            .send({ title: "Updated automated test incident" });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(
            "Updated automated test incident"
        );
    });

    test("rejects an invalid incident ID", async () => {
        const response = await request(app)
            .get("/api/incidents/invalid-id");

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
});

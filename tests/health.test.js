
const request = require("supertest");
const app = require("../server");

describe("Health API", () => {
    test("GET /api/health returns a successful response", async () => {
        const response = await request(app).get("/api/health");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Backend is working correctly");
        expect(response.body.database).toBe("disconnected");
    });
});

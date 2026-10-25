
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use(express.json());

// Incident schema for MongoDB
const incidentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        severity: {
            type: String,
            required: true,
            enum: ["Low", "Medium", "High", "Critical"]
        },
        status: {
            type: String,
            enum: [
                "Reported",
                "Under Review",
                "Investigation",
                "Action Assigned",
                "Verification",
                "Closed",
                "Rejected",
                "Reopened",
                "Escalated"
            ],
            default: "Reported"
        },
        reportedBy: {
            type: String,
            required: true,
            trim: true
        },
        assignedTo: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
);

const Incident = mongoose.model("Incident", incidentSchema);

// Home route
app.get("/", (req, res) => {
    res.send("Industrial Incident Management Backend is Running!");
});

// Health-check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is working correctly",
        database:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"
    });
});

// Create an incident
app.post("/api/incidents", async (req, res, next) => {
    try {
        const {
            title,
            description,
            type,
            location,
            severity,
            reportedBy
        } = req.body;

        if (
            typeof title !== "string" || !title.trim() ||
            typeof description !== "string" || !description.trim() ||
            typeof type !== "string" || !type.trim() ||
            typeof location !== "string" || !location.trim() ||
            typeof reportedBy !== "string" || !reportedBy.trim() ||
            !severity
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required incident fields."
            });
        }

        if (!["Low", "Medium", "High", "Critical"].includes(severity)) {
            return res.status(400).json({
                success: false,
                message: "Severity must be Low, Medium, High, or Critical."
            });
        }

        const incident = await Incident.create({
            title,
            description,
            type,
            location,
            severity,
            reportedBy
        });

        res.status(201).json({
            success: true,
            message: "Incident reported successfully",
            data: incident
        });
    } catch (error) {
        next(error);
    }
});

// Get all incidents, with optional filters
app.get("/api/incidents", async (req, res, next) => {
    try {
        const filter = {};

        if (req.query.severity) {
            filter.severity = req.query.severity;
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.location) {
            filter.location = {
                $regex: String(req.query.location),
                $options: "i"
            };
        }

        const incidents = await Incident.find(filter).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: incidents.length,
            data: incidents
        });
    } catch (error) {
        next(error);
    }
});

// Get one incident by MongoDB ID
app.get("/api/incidents/:id", async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid incident ID."
            });
        }

        const incident = await Incident.findById(req.params.id);

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found."
            });
        }

        res.status(200).json({
            success: true,
            data: incident
        });
    } catch (error) {
        next(error);
    }
});

// Update incident details
app.patch("/api/incidents/:id", async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid incident ID."
            });
        }

        const allowedFields = [
            "title",
            "description",
            "type",
            "location",
            "severity"
        ];

        const updates = Object.keys(req.body);

        if (
            updates.length === 0 ||
            updates.some(field => !allowedFields.includes(field))
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide valid fields to update."
            });
        }

        if (
            req.body.severity !== undefined &&
            !["Low", "Medium", "High", "Critical"].includes(
                req.body.severity
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Severity must be Low, Medium, High, or Critical."
            });
        }

        const incident = await Incident.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            {
                new: true,
                runValidators: true
            }
        );

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Incident updated successfully",
            data: incident
        });
    } catch (error) {
        next(error);
    }
});

// Handle errors
app.use((err, req, res, next) => {
    console.error(err);

    if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// Connect to MongoDB before starting Express
async function startServer() {
    try {
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/industrial_incidents"
        );

        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
}

startServer();

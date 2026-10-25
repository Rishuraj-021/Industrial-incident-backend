# Cloud-Based Industrial Incident Management System



## 1. Project Overview



The Cloud-Based Industrial Incident Management System is a backend application designed to record and manage incidents in industrial environments.



It provides APIs to report incidents, retrieve incident records, update incident details, and filter incidents by severity, status, and location.



This project uses Node.js, Express.js, and MongoDB.



## 2. Technologies Used



\- **Node.js** — JavaScript runtime

\- **Express.js** — Backend web framework

\- **MongoDB** — Database for storing incidents

\- **Mongoose** — MongoDB object modeling library

\- **Postman** — API testing

\- **Git and GitHub** — Version control and code hosting



## 3. Features Implemented



\- Create and report a new incident

\- Retrieve all incidents

\- Retrieve a single incident by its database ID

\- Update incident details

\- Filter incidents by severity

\- Filter incidents by status

\- Search incidents by location

\- Validate required fields and severity values

\- Store incident records in MongoDB

\- Handle common API errors



## 4. Prerequisites



Install the following before running the project:



\- Node.js and npm

\- MongoDB Community Server

\- Git (optional, for version control)

\- Postman (for testing API requests)



## 5. Installation and Setup



### Step 1: Clone the repository



```bash

git clone https://github.com/Rishuraj-021/Industrial-incident-backend.git

cd Industrial-incident-backend

```



Alternatively, open the existing project folder on your computer.



### Step 2: Install dependencies



```bash

npm install

```



### Step 3: Start MongoDB



Ensure the MongoDB server is running locally on:



```text

mongodb://127.0.0.1:27017

```



On Windows, if MongoDB is not configured as a Windows service, start it using your installed MongoDB executable and data directory.



### Step 4: Start the backend



```bash

node server.js

```



The server should report that MongoDB connected successfully and that Express is running at:



```text

http://localhost:3000

```



## 6. API Endpoints



Base URL: `http://localhost:3000`



| Method | Endpoint | Purpose |

|---|---|---|

| GET | `/` | Check the home route |

| GET | `/api/health` | Check backend and database status |

| POST | `/api/incidents` | Create an incident |

| GET | `/api/incidents` | Retrieve all incidents |

| GET | `/api/incidents/:id` | Retrieve one incident |

| PATCH | `/api/incidents/:id` | Update incident details |



### Create an incident



**Request**



```http

POST /api/incidents

Content-Type: application/json

```



Example request body:



```json

{

&#x20; "title": "Oil leakage near machine",

&#x20; "description": "Oil observed near the production machine.",

&#x20; "type": "Equipment",

&#x20; "location": "Production Floor A",

&#x20; "severity": "High",

&#x20; "reportedBy": "USER-101"

}

```



A successful request returns HTTP `201 Created` and the saved incident.



### Retrieve incidents



```http

GET /api/incidents

```



### Retrieve one incident



Replace `INCIDENT_ID` with the MongoDB `_id` returned when the incident was created.



```http

GET /api/incidents/INCIDENT_ID

```



### Update an incident



```http

PATCH /api/incidents/INCIDENT_ID

Content-Type: application/json

```



Example request body:



```json

{

&#x20; "severity": "Critical",

&#x20; "location": "Production Floor B"

}

```



Only the supported incident detail fields can be updated through this endpoint.



## 7. Filtering Examples



Filter by severity:



```http

GET /api/incidents?severity=Critical

```



Filter by status:



```http

GET /api/incidents?status=Reported

```



Filter by location:



```http

GET /api/incidents?location=Production

```



Location filtering is case-insensitive and supports partial matches.



## 8. Incident Fields



| Field | Description |

|---|---|

| `title` | Short incident title |

| `description` | Details of the incident |

| `type` | Category of incident |

| `location` | Where the incident occurred |

| `severity` | Low, Medium, High, or Critical |

| `status` | Current incident workflow status |

| `reportedBy` | Identifier of the reporter |

| `assignedTo` | Assigned person, initially null |

| `createdAt` | Creation timestamp |

| `updatedAt` | Last update timestamp |



MongoDB generates a unique `_id` for each incident.



## 9. Database



The application connects to a local MongoDB database named:



```text

industrial_incidents

```



The `Incident` Mongoose model stores incident records in the database.



## 10. Current Scope and Future Improvements



The current backend provides basic incident CRUD operations and filtering.



Planned improvements include:



\- Automated API tests

\- Authentication and role-based authorization

\- Incident assignment and investigation workflows

\- Root-cause analysis records

\- Corrective actions and deadlines

\- Status transition and closure rules

\- Notifications

\- Frontend integration

\- Deployment to a hosted environment



Workflow features will be coordinated with the other project team members as development progresses.



## 11. Project Repository



GitHub: https://github.com/Rishuraj-021/Industrial-incident-backend





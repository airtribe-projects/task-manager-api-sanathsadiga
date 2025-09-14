# Task Manager API

A small RESTful Task Manager API built with **Express** and a JSON file as the data store.
This repository is a compact assignment / learning project demonstrating routing, controllers, request validation, basic in-memory (file-backed) persistence, and automated tests.

---

## Contents

* **Project overview**
* **Prerequisites**
* **Install & run**
* **Available scripts**
* **API endpoints**
* **Validation rules & status codes**
* **Data storage**
* **Testing**
* **Project structure**
* **Notes & suggestions**
* **Author & license**

---

# Project overview

This is a simple CRUD API for managing tasks. Each task has:

* `id` (number)
* `title` (string)
* `description` (string)
* `completed` (boolean)

The API stores tasks in a JSON file (`task.json`) and exposes endpoints to create, read, update, and delete tasks. The project includes automated tests using `tap` + `supertest`.

---

# Prerequisites

* Node.js **>= 18.0.0** (project `engines` specifies this)
* npm (comes with Node)
* No external database required — tasks are persisted in `task.json`.

---

# Install & run

1. Clone the repo and `cd` into it.
2. Install dependencies:

```bash
npm install
```

3. Start server (development mode with automatic restarts):

```bash
npm run dev
```

Server listens on port `3000` by default.

To run tests:

```bash
npm test
```

---

# Available npm scripts

* `npm run dev` — run `nodemon app.js` for development.
* `npm test` — runs `tap test/*.js --disable-coverage`. There is a `pretest` step which enforces Node >= 18.
* `pretest` — checks Node major version and exits if < 18.

---

# API endpoints

Base URL: `http://localhost:3000`

All endpoints use JSON request/response bodies (where applicable).

### GET `/tasks`

Return all tasks.

**Query parameters**

* `completed` (optional) — filter by completion status. Accepts `"true"` or `"false"` (string). If provided, the response includes only tasks with the matching `completed` boolean value.

**Responses**

* `200 OK` — array of tasks.

**Example**

```bash
curl http://localhost:3000/tasks
curl "http://localhost:3000/tasks?completed=true"
```

---

### POST `/tasks`

Create a new task.

**Request body (JSON)**

```json
{
  "title": "My task",
  "description": "Task details",
  "completed": false
}
```

**Validation**

* `title`: required, non-empty string
* `description`: required, non-empty string
* `completed`: required, boolean

**Responses**

* `201 Created` — returns created task object (includes `id`)
* `400 Bad Request` — validation failed

**Example**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Desc","completed":false}'
```

---

### GET `/tasks/:id`

Return a task by its numeric `id`.

**Responses**

* `200 OK` — task object
* `404 Not Found` — no task with the given id

**Example**

```bash
curl http://localhost:3000/tasks/1
```

---

### PUT `/tasks/:id`

Update an existing task by id.

**Request body (JSON)** same shape as POST.

**Validation**

* Same as POST: `title` (non-empty string), `description` (non-empty string), `completed` (boolean).

**Responses**

* `200 OK` — updated task
* `400 Bad Request` — validation failed
* `404 Not Found` — id not found

**Example**

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","description":"Updated desc","completed":true}'
```

---

### DELETE `/tasks/:id`

Delete a task by id.

**Responses**

* `200 OK` — deleted successfully (no body)
* `404 Not Found` — id not found

**Example**

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

---

# Validation rules & HTTP status codes (summary)

* `400 Bad Request` — when required fields are missing or have wrong types (e.g., `completed` is not boolean).
* `404 Not Found` — when an endpoint expects an existing `id` but the id does not exist.
* `201 Created` — successful resource creation.
* `200 OK` — successful retrieval, update, or delete.

Validation logic (applied on create/update):

* `title`: truthy, `typeof === 'string'`, trimmed non-empty
* `description`: truthy, `typeof === 'string'`, trimmed non-empty
* `completed`: required `boolean`

---

# Data storage

* File: `task.json`
* Format: JSON object `{ "tasks": [ ... ] }`
* The app reads and mutates this in-memory representation. (Note: changes are made to the in-memory object; if you need persistent persisted writes back to `task.json`, implement file write logic.)

Default `task.json` includes sample tasks (IDs 1..15 with various `completed` values).

---

# Testing

* Tests located in `test/*.js` use `tap` + `supertest`.
* Test coverage (what tests check):

  * Successful creation (`201`) and invalid creation (`400`)
  * GET `/tasks` returns an array with expected properties & types
  * GET `/tasks/:id` success and `404`
  * PUT `/tasks/:id` success, `404` for missing id, and `400` for invalid data
  * DELETE `/tasks/:id` success and `404` for missing id
* Tests include a teardown step that calls `process.exit(0)` at the end.

Run tests:

```bash
npm test
```

---

# Project structure

```
.
├─ app.js                 # Express app + server boot
├─ package.json
├─ task.json              # data file with tasks array
├─ Routes/
│  └─ task.routes.js      # route definitions
├─ controllers/
│  └─ task.controller.js  # controller functions (create/get/update/delete)
└─ test/
   └─ server.test.js                # tap + supertest tests
```

(Your repository may have slightly different casing — the filenames used by the code are shown above.)

---

# Notes, caveats & suggestions

* **Data persistence:** Current implementation modifies the in-memory `tasks` array loaded from `task.json`. If you stop the server, changes are lost unless you add explicit file writes (e.g., `fs.writeFileSync`) or use a database (MongoDB, SQLite, etc.). Consider adding persistence if you want changes to survive restarts.
* **ID generation:** IDs are created as `tasks.tasks.length + 1`. This can collide if tasks are deleted. Use a stronger ID strategy (UUIDs or track lastId) in production.
* **Error responses:** Currently endpoints often return an empty body with error status codes. Consider returning JSON error messages to make debugging easier (e.g., `{ "error": "Task not found" }`).
* **Concurrency:** Since the store is a JSON file and the app keeps it in memory, concurrent requests that mutate data can lead to race conditions. For multi-user usage, move to a proper DB.

---


# Author & License

* **Author:** Airtribe (as specified in `package.json`)
* **License:** ISC

---

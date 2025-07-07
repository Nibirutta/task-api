# **Nibirutta-Task Test API**

---

**Note:** This API is currently available **for test purposes only**.

To start using the API, simply access the following URL: `https://nibirutta-task-api.up.railway.app/`

The API currently offers a few main routes, divided into two categories: user access control and task management.

## User Routes

---

* **`/user/register`**
    * **Description:** Allows for the registration of new users.
    * **Required Information (in the request body, JSON format):**
        * `firstname` (mandatory)
        * `email` (mandatory)
        * `username` (mandatory)
        * `password` (mandatory)
        * `lastname` (optional)

* **`/user/login`**
    * **Description:** Used for user login. Logging in is necessary to access the task routes.
    * **Required Information (in the request body, JSON format):**
        * `username`
        * `password`

* **`/user/refresh`**
    * **Description:** Keeps the user logged in. Requires a token, which is generated after the initial login.

* **`/user/logout`**
    * **Description:** Allows the user to log out of the application, invalidating the session token.

* **`/user/reset`**
    * **Description:** Allows the user to request a password reset if they've forgotten it. A recovery email request will be generated and sent.

## Task Routes

---

**Note:** All task routes require authentication. You must be logged in to access these endpoints.

* **`/tasks`** (GET)
    * **Description:** Retrieves all tasks belonging to the authenticated user.
    * **Query Parameters (optional):**
        * `title` - Filter tasks by title (case-insensitive search)
        * `status` - Filter tasks by status
        * `priority` - Filter tasks by priority level
        * `from` - Filter tasks due from this date (YYYY-MM-DD format)
        * `to` - Filter tasks due to this date (YYYY-MM-DD format)
    * **Example:** `/tasks?status=pending&priority=high&from=2024-01-01&to=2024-12-31`

* **`/tasks`** (POST)
    * **Description:** Creates a new task for the authenticated user.
    * **Required Information (in the request body, JSON format):**
        * `title` (mandatory)
        * `dueDate` (mandatory)
        * `description` (optional)
        * `status` (optional)
        * `priority` (optional)

* **`/tasks/:id`** (PUT)
    * **Description:** Updates an existing task. Only the task owner can update their tasks.
    * **Parameters:**
        * `id` - The unique identifier of the task to update
    * **Optional Information (in the request body, JSON format):**
        * `title`
        * `description`
        * `status`
        * `priority`
        * `dueDate`

* **`/tasks/:id`** (DELETE)
    * **Description:** Deletes a specific task. Only the task owner can delete their tasks.
    * **Parameters:**
        * `id` - The unique identifier of the task to delete
    * **Response:** Returns a success message upon successful deletion.

---

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. After logging in, you'll receive an access token that must be included in the Authorization header for all task-related requests:

```
Authorization: Bearer <your-access-token>
```

The API also uses refresh tokens stored in HTTP-only cookies to maintain user sessions securely.

---

## Error Handling

The API returns appropriate HTTP status codes and error messages:

* **400** - Bad Request (missing required fields, validation errors)
* **401** - Unauthorized (not logged in or invalid token)
* **403** - Forbidden (access denied)
* **404** - Not Found (resource doesn't exist)
* **500** - Internal Server Error

Error responses include a `code` and `message` field for easier handling on the frontend.
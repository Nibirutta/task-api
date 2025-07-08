# **Nibirutta-Task Test API**

---

**Note:** This API is currently available **for test purposes only**.

To start using the API, simply access the following URL: `https://nibirutta-task-api.up.railway.app/`

The API currently offers a few main routes, divided into two categories: user access control and task management.

## User Routes

---

* **`/user/register`** (POST)
    * **Description:** Allows for the registration of new users.
    * **Required Information (in the request body, JSON format):**
        * `firstname` (mandatory)
        * `email` (mandatory)
        * `username` (mandatory)
        * `password` (mandatory)
        * `lastname` (optional)
    * **Note:** This route cannot be accessed if the user is already logged in.

* **`/user/login`** (POST)
    * **Description:** Used for user login. Logging in is necessary to access the task routes.
    * **Required Information (in the request body, JSON format):**
        * `username` (mandatory)
        * `password` (mandatory)
    * **Response:** Returns an access token upon successful login and sets a refresh token cookie.
    * **Note:** This route cannot be accessed if the user is already logged in.

* **`/user/refresh`** (GET)
    * **Description:** Keeps the user logged in by generating a new access token using the refresh token.
    * **Authentication:** Requires a valid refresh token stored in HTTP-only cookies.
    * **Response:** Returns a new access token and updates the refresh token cookie.

* **`/user/logout`** (GET)
    * **Description:** Allows the user to log out of the application, invalidating the session token.
    * **Effect:** Clears the refresh token cookie and removes the token from the database.

* **`/user/reset/request`** (POST)
    * **Description:** Allows the user to request a password reset if they've forgotten it.
    * **Required Information (in the request body, JSON format):**
        * `email` (mandatory)
    * **Effect:** Sends a recovery email with a reset link to the provided email address.
    * **Note:** This route cannot be accessed if the user is already logged in.

* **`/user/reset/:resetToken`** (POST)
    * **Description:** Resets the user's password using the token received via email.
    * **Parameters:**
        * `resetToken` - The token received in the reset email, must be a query parameter.
    * **Required Information (in the request body, JSON format):**
        * `newPassword` (mandatory)
    * **Effect:** Updates the user's password and invalidates all existing refresh tokens.
    
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
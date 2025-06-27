**Project Start**

- *Added the required dependencies for the project. I might add more later if needed*.
- *Started building the models to see what I'll need to do next.*
- *Added CORS to control and secure cross-origin server requests.*
- *Started the server to test if the connection to MongoDB was working correctly*.
- *Created the user registration route and it's working perfectly.*
- *User authentication is done, I used JWT tokens for security measures, including multi-platform support.*
- *The refresh token route is fully implemented, and I added some extra lines of code to ensure user security.*
- *Logout route is done. This command deletes the cookie from the browser and, if there was a user linked to it, removes the refresh token from the database as well.*
- *Added a middleware to verify the access token before accessing a protected route.*
- *The routes required to add and get the tasks are now complete, but I still need to analyze how I'll build the others.*
- **😷SICKDAY** *- Thankfully i was able to complete at least one new route, and was the route to manage tasks updates, it's working perfectly!*
- *Delete route is done. This route gets the task id from URL params, searchs for it, and deletes it if found.*
- *Modified the get route to accept queries, such as status condition or title.*
- *Made some changes to the Userschema and TaskSchema to accept email and priority, respectively, because I'll implement a method to allow users to reset their password if needed.*
- *Modified some validation errors to be easier to use in the front end, and also added a verification method to the user email. However, I also need to think about the security layers in my API; perhaps I'm doing some unnecessary things here.*
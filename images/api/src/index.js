/**
 * Application Entry Point
 * 
 * This file serves as the entry point for the application, where the server is started.
 * It imports the 'app' module, sets the listening port, and starts the server.
 * 
 * Entry Point Details:
 * - app: Imports the main application module.
 * - port: Specifies the port on which the server will listen.
 * 
 * Server Start Steps:
 * - The server starts listening on the specified port.
 * - If no errors occur during the server startup, a success message is logged to the console.
 * - If an error occurs, the error is logged to the console.
 * 
 */
const app = require('./app');
const port = 3000;

app.listen(port, (err)=> {
    if(!err){
        console.log("running on port " + port);
    }
    else {
        console.error(err)
    }
});
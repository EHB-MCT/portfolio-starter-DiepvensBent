# Dev V Portfolio

## Purpose

This project is an API written in node.js, intended to serve as a showcase of my programming skills.
It is an item manager which allows you to add an item, change, delete; search all or by id on two different locations 

## Quick Start

To run this project, follow these steps:

1. Copy the `.env.template` file and rename it to `.env`.
2. Open a terminal in the project directory and run the following command to build and start the project:

    ```bash
    docker-compose up -f docker-compose.prod.yml --build
    ```

This command will initialize the necessary containers and dependencies specified in the `docker-compose.yml` file.

To run the test environment, follow these steps:

1. Open a terminal in the project directory and run the following command to build and start the project:

    ```bash
    docker-compose -f docker-compose.test.yml up --build
    ```
2. Open a second terminal and run the following command to run all the tests:
    ```bash
    npm run watch-all
    ```

## Routes

### GET /
- This route retrieves a list of all items in the database.
- It returns a JSON array containing all items if successful.
  
### GET /:id
- This route retrieves an item by its ID from the database.
- It returns a JSON object representing the item if successful.
- If the item is not found or the ID is invalid, appropriate error messages are included in the JSON response.
- **Parameters:**
  - `id` (integer): Unique identifier for the item.
- **Responses:**
  - 200 OK: Successful retrieval of the item.
  - 404 Not Found: Item not found.
  - 400 Bad Request: Invalid ID.

### POST /saveItem
- This route creates a new item in the database.
- It expects a JSON body containing item information in the request body.
- If successful, it returns a JSON object representing the created item.
- If the item name is not formatted correctly or there was an error while creating the item,
  an error message will be included in the JSON response.
- **Parameters:**
  - `itemName` (string): Name of the item.
  - `location_uuid` (string): Location UUID.
- **Responses:**
  - 200 OK: Successful creation of the item.
  - 400 Bad Request: Item name not formatted correctly.

### PUT /changeItem/:id
- This route changes the name of an existing item in the database by its ID.
- It expects a JSON body with the updated item name.
- If successful, it returns a JSON object representing the updated item.
- If the ID is invalid, the item is not found, or the item name is not formatted correctly,
  appropriate error messages are included in the JSON response.
- **Parameters:**
  - `id` (integer): Unique identifier for the item.
  - `itemName` (string): Updated name of the item.
- **Responses:**
  - 200 OK: Successful update of the item.
  - 404 Not Found: Item not found.
  - 400 Bad Request: Invalid ID or item name not formatted correctly.

### DELETE /deleteItem/:id
- This route deletes an item from the database by its ID.
- If successful, it returns a JSON object with a message indicating the successful deletion.
- If the ID is invalid, or the item is not found, appropriate error messages are included in the JSON response.
- **Parameters:**
  - `id` (integer): Unique identifier for the item.
- **Responses:**
  - 200 OK: Successful deletion of the item.
  - 404 Not Found: Item not found.
  - 400 Bad Request: Invalid ID.

## Development

The project is currently in development. Feel free to explore the codebase, provide feedback, or open issues for any questions or improvements.

## Questions and Support

If you have any questions or need support, please open a ticket [Issues](https://github.com/EHB-MCT/portfolio-starter-DiepvensBent/issues). I appreciate your feedback and will address your inquiries as soon as possible.

## License

This project is licensed under the [MIT License](https://github.com/EHB-MCT/portfolio-starter-DiepvensBent/blob/main/LICENSE).
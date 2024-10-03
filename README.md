# HubX Backend Developer Case Study

## Project Overview
This project is a Node.js API built using Express, designed to demonstrate a robust setup for building RESTful APIs. It showcases best practices in route setup, error handling, and database interactions, making it an ideal starting point for scalable backend applications.
Features

- Express.js Framework: Utilizes Express for efficient routing and middleware support.
- RESTful API Design: Implements RESTful principles for intuitive API endpoints.
- Database Integration: Includes examples of database interactions (MongoDB).
- Error Handling: Implements a centralized error handling mechanism for improved debugging and .
- Docker Support: Containerized for easy setup and deployment.

## Prerequisites

Make sure you have the following installed on your machine:
- **[Docker](https://docs.docker.com/get-docker/)**: A platform to develop, ship, and run applications inside containers.
- **[Docker Compose](https://docs.docker.com/compose/install/)**: A tool for defining and running multi-container Docker applications.


## Installation

## Clone the repository :

``` 
  git clone https://github.com/Emmrylmz/hubx-node-demo.git
```
## Setup the Environment Variables
You can set up the required environment variables by:
- **Option 1**: Modify the `docker-compose.yml` file directly.
 ## ![image](https://github.com/user-attachments/assets/c84ae824-f156-4b8f-85f0-5d7dbdad087f)

- **Option 2**: Create a `.env` file with the following variables:
```bash
MONGO_URI=mongodb://mongodb:27017/mydatabase
DB_NAME=mydatabase
NODE_ENV=development
```

 

 ## Start docker engine 


![root@LAPTOP-JMBH7D9M_ _home_emir-yilmaz_hubx-node-demo 2024-10-02 15-17-13 (online-video-cutter com)](https://github.com/user-attachments/assets/9a800223-9b39-43ac-b2e2-fdb0c87eb95a)


 Once the environment is set up and Docker is running, you can build and start the containers by running the following command:

```bash
docker-compose up --build
```

![root@LAPTOP-JMBH7D9M_ _home_emir-yilmaz_hubx-node-demo 2024-10-02 15-17-13 (online-video-cutter com) (1)](https://github.com/user-attachments/assets/18e78548-fe8e-4df1-b2b2-a51fccc5da1c)

## You can find the Docker image on Docker Hub [here](https://hub.docker.com/repository/docker/emmryilmaz/hubx-node-demo/general).


## Contact

If you have any questions or need further assistance, feel free to reach out to me:

- **Email**: [emmryilmaz@gmail.com](mailto:emmryilmaz@gmail.com)

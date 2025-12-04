# Team-23-Volunteer-Management

#Problem Statement

NGOs and event organizers often face difficulties in managing large numbers of volunteers using manual tools like spreadsheets and messaging apps. These methods lead to confusion in task allocation, poor communication, and lack of proper tracking of volunteer participation. There is no streamlined way to match volunteers based on skills or availability, nor an efficient method to record attendance and contribution hours.

To overcome this, a Volunteer Management & Task Allocation System is required to digitize volunteer registration, skill mapping, task posting, and shift allocation. The system should allow volunteers to choose tasks based on interest, enable organizers to monitor participation in real-time, and maintain records for future certification and recognition.



#Tech Stack

Backend
    Node.js & Express.js – Server-side development and API creation

Database
    MongoDB – To store volunteer records, tasks, attendance, allocations

Frontend
    HTML, CSS, JavaScript – Core technologies for building UI
    React.js – For creating dynamic, responsive user interfaces
    Tailwind CSS – For faster and modern UI styling

Additional Tools
    Git & GitHub – Version control and collaboration
    Postman – API testing


#Folder Structure

Backend
![alt text](image.png)

Frontend



#API documentation 



#Project Setup Steps

Create Project Folder
Make a new directory for the project and navigate into it.

Backend Setup (Node.js + Express + MongoDB)
Initialize project using npm init -y.
Install required packages: express, mongoose, cors, dotenv, bcrypt, jsonwebtoken, nodemon.
Create files & folders: server.js, config, models, routes, controllers, .env.
Configure MongoDB connection using Mongoose.
Run the server using nodemon server.js.

Frontend Setup (React)

Use npx create-react-app frontend to generate client structure.
Install dependencies like axios and react-router-dom.
Start UI using npm start.

Connect Frontend & Backend
Use Axios/Fetch in React to call backend APIs.
Configure base API URL for organized communication.
Initialize Git Version Control
Run git init, commit initial files, and push to GitHub (optional).
Run the Complete Project.

Start backend: nodemon server.js.

Start frontend: npm start.

Application now runs locally (Frontend: 3000, Backend: 5000).
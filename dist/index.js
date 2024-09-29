import express from 'express';
import { Client } from 'pg';
const app = express();
const port = 3000;
// PostgreSQL client setup
const client = new Client({
    host: 'postgres', // this refers to the PostgreSQL service defined in docker-compose
    user: 'postgres',
    password: 'password',
    database: 'mydb',
});
client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Node.js and PostgreSQL!');
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=index.js.map
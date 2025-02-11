// imports here for express and pg
const express = require('express')
const app = express();
const pg = require('pg');
const path = require('path');

const client = new pg.Client('postgres://kseniia:kseniya3@localhost:5432/acme_ice_cream_db')

// static routes here (you only need these for deployment)
// app.use(express.static(path.join(__dirname, '..client/dist')))
app.use(express.json())

// app routes here
app.get('/api/flavors', async (req, res, next) => {
    try {
        const SQL = `
        SELECT * FROM flavors
        `;
        const response = await client.query(SQL);
        res.send(response.rows);

    } catch (ex) {
        next()
    }

});
app.get('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = `
        SELECT * FROM flavors WHERE id = $1
        `;
        console.log(req.params)
        const response = await client.query(SQL, [req.params.id]);
        res.send(response.rows);

    } catch (ex) {
        next()
    }

});
// Did on my own POST /api/flavors
app.post('/api/flavors', async (req, res, next) => {
    try {
        const SQL = `
INSERT INTO flavors(name, is_favorite) 
      VALUES($1, $2)
      RETURNING *`;
        console.log(req.params)
        const response = await client.query(SQL, [req.params.id]);
        res.send(response.rows);

    } catch (ex) {
        next()
    }

});

// Did on my own DELETE /api/flavors/:id
app.delete('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = `
        DELETE FROM flavors WHERE id = $1
        `;
        console.log(req.params)
        const response = await client.query(SQL, [req.params.id]);
        res.send(response.rows);

    } catch (ex) {
        next()
    }

});

// Did on my own PUT /api/flavors/:id
app.put('/api/flavors/:id', async(req, res, next) => {
    try{
        const SQL = `
        UPDATE flavors 
      SET name = $1, is_favorite = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
        `;
        console.log(req.params)
        const response = await client.query(SQL,[req.body.name,req.isfavorite,req.params.id]);
        res.send(response.rows);

    }catch(ex){ 
        next()
    }

});

// create your init function
const init = async () => {
    await client.connect();

    const SQL = `
DROP TABLE IF EXISTS flavors;
CREATE TABLE flavors(
id SERIAL PRIMARY KEY,
name VARCHAR(50),
is_favorite BOOLEAN DEFAULT false,
created_at TIMESTAMP DEFAULT now(),
updated_at TIMESTAMP DEFAULT now()
);
INSERT INTO flavors(name, is_favorite) VALUES('vanilla', true), ('chocolate', false), ('strawberry', true);
`
    await client.query(SQL)
    console.log('data seeded')

    app.listen(3000, () => console.log('listening on port 3000'));
}

// init function invocation
init(); 
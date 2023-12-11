const express = require('express');
const bodyParser = require('body-parser')
const Pool = require('pg').Pool;

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


const pool = new Pool({
  user: 'root',
  host: 'db',
  database: 'project',
  password: 'root',
  port: 5432,
})



app.get('/', (request, response) => {

  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/posts',  (request, response) => {
    pool.query('SELECT * FROM public.posts ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  })

app.get('/posts/:id', (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM public.posts WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  })

app.post('/posts/add', (request, response) => {
    const { id,name, email } = request.body
  
    pool.query('INSERT INTO public.posts (id,name, email) VALUES ($1, $2,$3)', [id,name, email], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Post added with ID: ${id}`)
    })
  })

app.put('/posts/:id', (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
  
    pool.query(
      'UPDATE public.posts SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Post modified with ID: ${id}`)
      }
    )
});

app.delete('/posts/:id', (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM public.posts WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Post deleted with ID: ${id}`)
    })
  })

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
const { request, response } = require('express');
const fs = require('fs');
const express = require('express');
const e = require('express');
const app = express();

// Post requests
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// 2 parameters: Request & Response sent to function handling 
app.get('/', (request, response) => {
    return response.send('Hello, world! My name is John Wick')    
})

app.get('/todos', (request, response) => {
    const showPending = request.query.showpending

    fs.readFile('./store/todos.json', 'utf-8', (error, data) => {
        if (error) {
            // Sending http 500 error message
            return response.status(500).send('Something went wrong.');
        }

        const todos = JSON.parse(data)

        if (showPending !== "1") {
            return response.json({todos: todos})
        }
        else {
            return response.json({todos: todos.filter(t => {return t.complete === false})})
        }


    })
})

app.put('/todos/:id/complete', (request, response) => {
    // Id from URL parameters
    const id = request.params.id;

    const findToDoById = (todos, id) => {
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id === parseInt(id)) {
                return i
            }
        }
        return -1
    }

    fs.readFile('./store/todos.json', 'utf-8', (error, data) => {
        if (error) {
            return response.status(500).send('Sorry, we are offline.')
        }

        let todos = JSON.parse(data)
        const todoIndex = findToDoById(todos, id);

        if(todoIndex === -1) {
            return response.status(404).send('Sorry, not found');
        }

        todos[todoIndex].complete = true;

        fs.writeFile('/store/todos.json', JSON.stringify(todos), () => {
            return response.json({'status': 'ok'})
        });
    })
})

app.post('/todo', (request, response) => {
    if (!request.body.name) {
        return response.status(400).send('Missing name of item.');
    }

    fs.readFile('./store/todos.json', 'utf-8', (error, data) => {
        if (error) {
            return response.status(500).send('Sorry, we are offline.')
        }

        // Mapping the max func over the individual ID to do list.
        const todos = JSON.parse(data);
        const maxId = Math.max.apply(Math, todos.map(t => {
            return t.id
        }))

        todos.push({
            id: maxId + 1,
            complete: false,
            name: request.body.name
        })

        fs.writeFile('/store/todos.json', JSON.stringify(todos), () => {
            return response.json({'status': 'ok'})
        });
    })
})

app.listen(3000, () => {
    console.log('Application running on http://localhost:3000');
})
const express = require('express');
const { uuid } = require('uuidv4');
const { validate } = require('uuid');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json())

const projects = [];

function logRequests(request, response, next){

    const{ method, url } = request;
    const logLabel = `[${method.toUpperCase()}] -> ${url}`;

    console.time(logLabel);
    
    next();

    console.timeEnd(logLabel);
}

function validateProjectId(req, res, next){

    const { id } = req.params;

    if (!validate(id))
        return res.status(400).json({ error: 'Invalid project ID.' });

    return next();
}

app.use(logRequests);

app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {

    var { title } = request.query;

    const results = title 
        ? projects.filter(project => project.title.includes(title)) 
        : projects;

    return response.json(results);
});

app.post('/projects', (request, response) => {

    var { title, owner } = request.body;

    var project = { id : uuid(), title, owner };

    projects.push(project);

    return response.json(project);
})

app.put('/projects/:id', (request, response) => {

    var {id} = request.params;
    var {title, owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0){
        return response.status(400).json({error : 'Project not found.'})
    }

    const project = {
        id,
        title,
        owner
    }

    projects[projectIndex] = project;

    return response.json(project);
})

app.delete('/projects/:id', (request, response) => {

    var {id} = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0){
        return response.status(400).json({error : 'Project not found.'})
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
})

app.listen(3333, () => {
    console.log("✌ Backend started!")
})
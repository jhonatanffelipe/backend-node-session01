const express = require('express');
const { uuid, isUuid } = require('uuidv4');


const app = express();

app.use(express.json());

function loadRequest(request, response, next) {
    const { method, url } = request;
    const logLabel = `[${method.toUpperCase()}] ${url}`;
    console.log(logLabel);
    return next();
}

function validateProjectID(request, response, next) {
    const { id } = request.params;
    if (!isUuid(id)) {
        /***Caso o código caia nessa condição a rota não será executada
            pois o return interrrompe o seguimento do código, mesmo que haja
            um next logo abaixo */
        return response.status(400).json({ error: 'Invalid project ID.' });
    }
    return next();
}

app.use('/project/:id', validateProjectID);

const projects = [];
app.get('/projects', loadRequest, (request, response) => {
    const { title } = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;
    return response.json(results);
});



app.post('/projects', (request, response) => {
    const { title, owner } = request.body;
    project = { id: uuid(), title, owner };
    projects.push(project);
    return response.json({ msg: project });
});


app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({
            msg: 'Project not faund'
        });
    }

    const project = {
        id,
        title,
        owner
    }

    projects[projectIndex] = project;
    return response.json({
        project
    })
});

app.delete('/projects/:id', validateProjectID, (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({
            msg: 'Project not faund'
        });
    }
    projects.splice(projectIndex, 1);
    return response.status(204).send();
});




app.listen(3333, () => {
    console.log('🚀️ Back-end started');

});//define a porta da aplicação
const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // listar repositorios
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  // Adiciona o repository no Array repositories
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryIdex = repositories.findIndex(repository => repository.id === id);

  if (findRepositoryIdex === -1) {
    return response.status(400).json({ error: 'Repository does not exist' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepositoryIdex].likes,
  }

  repositories[findRepositoryIdex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepositoryIdex = repositories.findIndex(repository => repository.id === id);

  if (findRepositoryIdex >= 0) {
    repositories.splice(findRepositoryIdex, 1);

  } else {
    return response.status(400).json({ error: 'Repository does not exist' });
  }

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepositoryIdex = repositories.findIndex(repository => repository.id === id);

  if (findRepositoryIdex === -1) {
    return response.status(400).json({ error: 'Repository does not exist' });
  }

  repositories[findRepositoryIdex].likes += 1;

  return response.json(repositories[findRepositoryIdex]);
});

module.exports = app;

const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;

  const index = repositories.findIndex((repository) => repository.id === id);

  const repository = repositories[index];

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;
  request.repositoryIndex = index;

  next();
}

app.get("/repositories", (request, response) => {
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
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { title, url, techs } = request.body;
  const { repository, repositoryIndex } = request;

  const bodyJSON = { title, url, techs };

  const newRepo = { ...repository, ...bodyJSON };

  repositories[repositoryIndex] = newRepo;

  return response.json(newRepo);
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post(
  "/repositories/:id/like",
  checkRepositoryExists,
  (request, response) => {
    const { repositoryIndex } = request;

    repositories[repositoryIndex].likes++;

    return response.status(200).send(repositories[repositoryIndex]);
  }
);

module.exports = app;

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const projectData = require('./data');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`

  type Query {    
    project(name: String): Project
    projects(category: String): [Project]
  }

  type Project
  {
    name: String!
    description: String!
    subdescription: String!
    category: String!
    urlwww: String!
    urlgithub: String!
    image: String!
  }
`);

const getProject = (argument) => {
  const name = argument.name;
  return projectData.filter((project) => {
    return project.name === name;
  })[0];
};

const getProjects = () => {
  return projectData.data;
};

// The root provides a resolver function for each API endpoint
const root = {
  project: getProject,
  projects: getProjects,
};

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

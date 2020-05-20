
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const projectData = require('./data');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`

  type Query {    
    singleProject(name: String): Project
    allProjects(category: String): [Project]
    allProjectsInCategory(category: String!): [Project]
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

const singleProject = (argument) => {
  const name = argument.name;
  return projectData.filter((project) => {
    return project.name === name;
  })[0];
};

const allProjects = () => {
  return projectData.data;
};

const allProjectsInCategory = (argument) => {
    const category = argument.category;
    return projectData.filter((project) => {
      return project.category === category;
    })[0];
  };


// The root provides a resolver function for each API endpoint
const root = {
    singleProject: singleProject,
    allProjects: allProjects,
    allProjectsInCategory: allProjectsInCategory
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

app.use(
  '/',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000);




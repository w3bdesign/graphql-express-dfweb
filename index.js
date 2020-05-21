var express = require('express');
var router = express.Router()
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var projectData = require('./data/data');

var birds = require('./birds')

// varruct a schema, using GraphQL schema language
var schema = buildSchema(`

  type Query {    
    singleProject(id: Int!): Project
    allProjects(category: String): [Project]
    allProjectsInCategory(category: String!): [Project]
  }

  type Project
  {
    id: Int!
    name: String!
    description: String!
    subdescription: String!
    category: String!
    urlwww: String!
    urlgithub: String!
    image: String!
  }
`);

var singleProject = (argument) => {
  var id = argument.id;
  return projectData.filter((project) => {
    return project.id === id;
  })[0];
};

var allProjects = () => {
  return projectData.data;
};

var allProjectsInCategory = (argument) => {
  var category = argument.category;
  return projectData.filter((project) => {
    return project.category === category;
  })[0];
};

// The root provides a resolver function for each API endpoint
var root = {
  singleProject: singleProject,
  allProjects: allProjects,
  allProjectsInCategory: allProjectsInCategory,
};

var app = express();

app.use('/birds', birds)


app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.get('/', function (req, res, next) {
  res.send('Nothing to see here');
  next();
});



app.listen(4000);

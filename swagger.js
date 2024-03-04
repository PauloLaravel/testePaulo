import swaggerAutogen from 'swagger-autogen';

const doc = {
 info: {
// name of your api
  title: 'Web Scraping Api',
  description: 'Description'
 },
 host: 'localhost:3000',
 tags: [                   
    {
      name: 'Products',             
      description: ''       
    },
  ],
};

const outputFile = './swagger-output.json';
// assuming your routes are located in app.js
const routes = ['./routes/foodRoute.js'];
swaggerAutogen(outputFile, routes, doc);
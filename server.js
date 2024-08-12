const fastify = require('fastify')({ logger: true });
const path = require('path');
const handlebars = require('handlebars');
const axios = require('axios');
const cheerio = require('cheerio');

// URL you want to access
const url = "http://38.242.239.33:3000/";

// Fastify setup for serving static files and views
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

fastify.register(require('@fastify/view'), {
  engine: {
    handlebars
  },
});

fastify.register(require('@fastify/formbody'));

// Example route
fastify.get('/', async (request, reply) => {
  return reply.view('/views/index.hbs', { title: 'Glitch Node.js MVP' });
});

// Function to fetch and parse the webpage
async function fetchPage() {
  try {
    // Fetch the webpage
    const response = await axios.get(url);

    // Parse the HTML content
    const $ = cheerio.load(response.data);

    // Print the title of the page
    console.log($('title').text());
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }
}

// Fetch the page every 5 seconds
setInterval(fetchPage, 6000);

// Start the server
fastify.listen(3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});

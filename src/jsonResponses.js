// hard coded JSON
const imgs = {};

// json response function
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });

  response.write(JSON.stringify(object));
  response.end();
};

// Head response for JSON
const respondJSONHead = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });

  response.end();
};

// Return the images to page as JSON
const getImgs = (request, response) => {
  const responseJSON = {
    imgs,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// Store image info. Parse user info
const handleImg = (request, response, body) => {
  const responseJSON = {
    message: 'Url, title, and color are all required.',
  };

  // console.dir(body);

  if (!body.title || !body.url || !body.color) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default code for successful creation
  let responseCode = 201;

  // if the image already exists switch to 204
  if (imgs[body.title]) {
    responseCode = 204;
  } else {
    imgs[body.title] = {};
  }

  // add or update fields
  imgs[body.title].title = body.title;
  imgs[body.title].url = body.url;
  imgs[body.title].color = body.color;

  // if image was added, send message
  if (responseCode === 201) {
    responseJSON.message = 'Image Added';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // respond with just meta if nothing is created
  return respondJSONHead(request, response, responseCode);
};

// Handle wrong url searches
const notFound = (request, response) => {
  const responseJSON = {
    message: `404: ${request.url} was not found`,
    id: 'noSuchPage',
  };

  return respondJSON(request, response, 404, responseJSON);
};

// Just the head of a 404
const notFoundHead = (request, response) => respondJSONHead(request, response, 404);

// exports
module.exports = {
  respondJSON,
  respondJSONHead,
  getImgs,
  handleImg,
  notFound,
  notFoundHead,
};

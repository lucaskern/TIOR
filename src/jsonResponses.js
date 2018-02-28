//hard coded JSON
const imgs = {};

// json response function
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });

  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONHead = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });

  response.end();
};

const getImgs = (request, response) => {
  const responseJSON = {
    imgs,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const handleImg = (request, response, body) => {
  const responseJSON = {
    message: 'Url, title, and color are all required.',
  };
    
 //console.dir(body);

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

  // if created, send message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    //console.log(responseJSON.message);
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // 204 does not have an object to deliver
  return respondJSONHead(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: '404: ' + request.url + " was not found",
    id: 'noSuchPage',
  };

  return respondJSON(request, response, 404, responseJSON);
};

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

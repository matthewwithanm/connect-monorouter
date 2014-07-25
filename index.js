var urllite = require('urllite');


var connectMiddleware = function(Router) {
  return function(req, res, next) {
    // Get the part of the URL we care about.
    // TODO: Allow this to be mounted at a different base and strip that from pathname
    var parsed = urllite(req.url);
    var url = parsed.pathname + parsed.search + parsed.hash;

    new Router().dispatch(url, {initialOnly: true}, function(err, rres) {
      if (err) {
        // The router doesn't want to handle it. That's okay, let something
        // else.
        if (err.name === 'Unhandled') return next();

        // Uh oh. A real error.
        return next(err);
      }

      res.statusCode = rres.status;
      res.setHeader('Content-Type', rres.contentType);
      res.end(rres.renderDocumentToString());
    });
  };
};

module.exports = connectMiddleware;

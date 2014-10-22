var connectMiddleware = function(Router) {
  return function(req, res, next) {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;

    // TODO: Allow this to be mounted at a different base and strip that from pathname
    new Router().dispatch(url, {cause: 'httprequest', initialOnly: true}, function(err, rres) {
      if (err) {
        // The router doesn't want to handle it. That's okay, let something
        // else.
        if (err.name === 'Unhandled') return next();

        // Uh oh. A real error.
        return next(err);
      }

      var rendered;

      try {
        rendered = rres.renderDocumentToString();
      } catch (err) {
        return next(err);
      }

      res.statusCode = rres.status;
      res.setHeader('Content-Type', rres.contentType);
      res.end(rendered);
    });
  };
};

module.exports = connectMiddleware;

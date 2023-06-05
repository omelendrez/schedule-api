const jwt = require('jsonwebtoken')

module.exports = {
  validateToken(req, res, next) {
    const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        result = jwt.verify(token, process.env.JWT_SECRET);
        req.decoded = result
        next();
      } catch (err) {
        if (err.message === 'jwt expired') {
          result = { code: 401, message: 'Token expirada', detail: 'La token necesaria para acceder a la base de datos ha expirado, por favor volver a loguearse.' }
        } else {
          result = { code: 401, message: 'Token requerida', detail: 'Una token es requerida para acceder a este recurso.' }
        }
        return res.status(401).send(result);
      }
    } else {
      result = {
        error: `Authentication error. Token required.`,
        status: 401
      };
      return res.status(401).send(result);
    }
  }
};

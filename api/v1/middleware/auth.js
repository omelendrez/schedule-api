const jwt = require('jsonwebtoken')

module.exports = {
  validateToken(req, res, next) {
    const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        result = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '1d' });
        req.decoded = result
        next();
      } catch (err) {
        return res.status(401).send({
          code: 401,
          message: 'Token expirada',
          detail: 'La token usada para acceder a la base de datos ha expirado. Por favor a loguearse.'
        });
      }
    } else {
      result = {
        code: 401,
        message: 'Token requerida',
        detail: 'Una token es requerida para acceder a este recurso.'
      }
    };
    return res.status(401).send(result);
  }
};

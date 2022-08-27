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
        return res.status(401).send(err);
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

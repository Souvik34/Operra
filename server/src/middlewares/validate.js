
export const validate = (schema) => (req, res, next) => {
    try {
      req.body = schema.parse(req.body); // parse throws if invalid
      next();
    } catch (err) {
      return res.status(400).json({ success: false, errors: err.errors });
    }
  };
  
module.exports.setJSONBody = (req, ctx, ee, next) => {
  req.json.total = 10 + Math.random() * 1000;
  return next();
}

const paginate = (req, res, next) => {
  // Always use server-side pagination with default limit 10
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const startIndex = (page - 1) * limit;

  req.pagination = {
    page,
    limit,
    skip: startIndex
  };
  
  next();
};

module.exports = { paginate };

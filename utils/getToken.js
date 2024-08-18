const getToken = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(200).json(null);
  return res.status(200).json(token);
};

module.exports = getToken;

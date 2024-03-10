require('dotenv').config();
const {sign , verify} = require('jsonwebtoken');

const createTokens = (user) => {
  const accessToken = sign(
    { username: user.name, id: user.id, role: user.role },
    process.env.JWT_SECRET,
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies['access-token'];

  if (!accessToken) {
    return res.status(400).json({ error: 'User is not authenticated' });
  }

  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET);
    if (validToken) {
      req.authenticated = true;
      return next();
    } else {
      return res.status(401).json({ error: 'User is not authorized' });
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const adminValidateToken = (req, res, next) => {
  const accessToken = req.cookies['access-token'];

  if (!accessToken) {
    return res.status(400).json({ error: 'User is not authenticated' });
  }

  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET);
    const { id, role } = validToken;

    if (role === 'admin') {
      req.authenticated = true;
      return next();
    } else {
      return res.status(401).json({ error: 'User is not authorized' });
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const userPresentToken = (req,res,next) => {
  const accessToken = req.cookies["access-token"]

  if(accessToken)
    return res.status(200).json({msg: 'User is logged'})
  else
    return next();
}

const userValidateToken = validateToken;


module.exports = {createTokens, adminValidateToken, userValidateToken, userPresentToken};
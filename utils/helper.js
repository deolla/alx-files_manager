// this file contains the utility functions for the files_manager project

const sha1 = require('sha1');

export const passwrd = (pwd) => sha1(pwd);
export const getAuthzHeader = (req) => {
  const header = req.headers.authorization;
  if (!header) {
    return null;
  }
  return header;
};

export const getToks = (authzHeader) => {
  const toks = authzHeader.substring(0, 6);
  if (toks !== 'Basic ') {
    return null;
  }
  return authzHeader.substring(6);
};

export const decodeToken = (token) => {
  const decodedToken = Buffer.from(token, 'base64').toString('utf8');
  if (!decodedToken.includes(':')) {
    return null;
  }
  return decodedToken;
};

export const getCredentials = (decodedToken) => {
  const [email, password] = decodedToken.split(':');
  if (!email || !password) {
    return null;
  }
  return { email, password };
};

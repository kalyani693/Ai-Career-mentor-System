import client from './client';

/**
 * User Login using OAuth2 form data
 * @param {string} username (5-8 chars)
 * @param {string} password (8 chars)
 */
export const loginUser = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await client.post('/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data; // { access_token, token_type }
};

/**
 * User Registration with optional PDF file upload
 * @param {Object} infoJson - Pydantic model structure
 * @param {File|null} file - Optional PDF resume file
 */
export const registerUser = async (infoJson, file = null) => {
  const formData = new FormData();
  formData.append('info', JSON.stringify(infoJson));
  if (file) {
    formData.append('file', file);
  }

  const response = await client.post('/registration', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data; // { Result: "..." }
};

/**
 * Admin Login using OAuth2 form data
 */
export const loginAdmin = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await client.post('/admin-pannel/adminLogin', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

/**
 * Admin Registration
 */
export const registerAdmin = async (adminData) => {
  const response = await client.post('/admin-pannel/adminRegistration', adminData);
  return response.data;
};

/**
 * Soft delete user account
 */
export const deleteUserAccount = async () => {
  const response = await client.delete('/delete_UserAccount');
  return response.data;
};

/**
 * Renew deleted user account
 */
export const renewUserAccount = async (username, password) => {
  const response = await client.patch('/renew_userAccount', {
    Username: username,
    Password: password,
  });
  return response.data;
};

/**
 * Soft delete admin account
 */
export const deleteAdminAccount = async () => {
  const response = await client.delete('/admin-pannel/delete_adminAccount');
  return response.data;
};

/**
 * Renew admin account
 */
export const renewAdminAccount = async (username, password) => {
  const response = await client.patch('/admin-pannel/renew_adminAccount', {
    Username: username,
    Password: password,
  });
  return response.data;
};

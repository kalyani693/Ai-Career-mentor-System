import client from './client';

/**
 * Fetch platform overview metrics for admin dashboard
 */
export const getAdminStats = async () => {
  const response = await client.get('/admin-pannel/stats');
  return response.data; // { "Total users": X, "Active Users": Y, "Exsisting Users": Z }
};

/**
 * Fetch all registered users in database
 */
export const getAllUsersData = async () => {
  const response = await client.get('/admin-pannel/all_users_data');
  return response.data; // Array of registered user objects
};

/**
 * user by Email
 * @param {string} email
 */
export const getUserByEmail = async (email) => {
  const response = await client.post('/admin-pannel/Getuser_by_email', {
    Email: email,
  });
  return response.data; // { user_info: {...} }
};

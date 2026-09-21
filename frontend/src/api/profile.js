import client from './client';

/**
 * Fetch authenticated user profile details
 */
export const getUserProfile = async () => {
  const response = await client.get('/getUserProfile');
  return response.data; // { response: { Full_Name, Username, Email, Highest_Class, Career_goal, University, CGPA } }
};

/**
 * Edit user profile field
 * @param {string} whatToEdit - Field name (Full_Name, Username, Highest_Class, Career_goal, University, CGPA)
 * @param {string|number} changedValue - New value
 */
export const editProfile = async (whatToEdit, changedValue) => {
  const response = await client.patch('/EditProfile', null, {
    params: {
      what_to_edit: whatToEdit,
      changed_value: changedValue,
    },
  });
  return response.data;
};

/**
 * Update user resume PDF file
 * @param {File} newResumeFile
 */
export const editResume = async (newResumeFile) => {
  const formData = new FormData();
  formData.append('newResume', newResumeFile);

  const response = await client.put('/EditResume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update user profile picture
 * @param {File} newPictureFile
 */
export const editProfilePic = async (newPictureFile) => {
  const formData = new FormData();
  formData.append('newPicture', newPictureFile);

  const response = await client.put('/EditprofilePic', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

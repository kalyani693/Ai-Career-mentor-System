import client from './client';

/**
 * Trigger AI Resume Analysis with optional updated resume upload
 * @param {File|null} file
 */
export const analyzeResume = async (file = null) => {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }

  const response = await client.post('/resume_analyzer', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data; // { response: JSON_string_or_object }
};

/**
 * Generate Career Roadmap based on user career goal & optional resume file
 * @param {File|null} file
 */
export const generateRoadmap = async (file = null) => {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }

  const response = await client.post('/Roadmap_Generator', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data; // { response: JSON_string_or_list }
};

/**
 * Get Top 10 frequently asked interview questions
 * @param {string} difficultyLevel - "Easy" | "Medium" | "Difficult"
 */
export const getPracticeQuestions = async (difficultyLevel) => {
  const response = await client.post('/Practice_questions', {
    difficulty_level: difficultyLevel,
  });
  return response.data; // { response: list_of_QA_objects_or_json }
};

/**
 * AI Mock Interview session API call (Frontend endpoint connection)
 * @param {Object} payload - Session ID or user message
 */
export const postMockInterview = async (payload = {}) => {
  const response = await client.post('/mock_interview', payload);
  return response.data;
};

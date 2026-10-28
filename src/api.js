/**
 * Centralized API client for backend communication
 * Single source of truth for all backend requests
 * 
 * URL: http://localhost:5000 (development)
 * Can be configured via environment variables
 * 
 * Authentication: JWT token from localStorage is automatically attached to all requests
 * via the Authorization header (Bearer token)
 */

// Base URL for backend API
// Uses Vite environment variable if available, otherwise defaults to localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get the JWT token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
function getAuthToken() {
  try {
    const token = localStorage.getItem('authToken');
    return token;
  } catch (e) {
    console.warn('Failed to retrieve auth token from localStorage:', e);
    return null;
  }
}

/**
 * Build request headers with authentication
 * Includes Authorization header if token is available
 * @param {Object} additionalHeaders - Additional headers to merge
 * @returns {Object} - Complete headers object with auth if available
 */
function buildHeaders(additionalHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Helper function to handle fetch responses
 * Extracts data from backend response format
 * @param {Response} response - Fetch response object
 * @returns {Promise} - Parsed JSON data
 */
async function handleResponse(response) {
  // Check if response is ok (status 200-299)
  if (!response.ok) {
    // Try to parse error message from response
    let errorMessage = `HTTP Error: ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.message || error.error || errorMessage;
    } catch {
      // Response is not JSON, use default error message
    }
    throw new Error(errorMessage);
  }

  // Parse JSON response
  try {
    const json = await response.json();
    // Backend wraps data in { data: [...], source: '...', timestamp: '...' }
    // Extract the actual data for frontend use
    return json.data !== undefined ? json.data : json;
  } catch (e) {
    throw new Error('Failed to parse server response');
  }
}

/**
 * Fetch all tasks from the backend
 * Requires authentication token in Authorization header
 * @returns {Promise<Array>} - Array of task objects from MongoDB
 * @throws {Error} - Network error, server error, or authentication error
 */
export async function getTasks() {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      headers: buildHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
}

/**
 * Fetch a single task by ID
 * Requires authentication token in Authorization header
 * @param {string} id - MongoDB task ID
 * @returns {Promise<Object>} - Task object
 * @throws {Error} - Task not found, authentication error, or server error
 */
export async function getTaskById(id) {
  if (!id) {
    throw new Error('Task ID is required');
  }
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      headers: buildHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch task: ${error.message}`);
  }
}

/**
 * Create a new task
 * Requires authentication token in Authorization header
 * @param {Object} taskData - Task object { title, description, priority, completed }
 * @returns {Promise<Object>} - Created task with MongoDB _id
 * @throws {Error} - Validation error, authentication error, or server error
 */
export async function createTask(taskData) {
  if (!taskData.title || !taskData.title.trim()) {
    throw new Error('Task title is required');
  }

  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(taskData),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
}

/**
 * Update an existing task (full update)
 * Requires authentication token in Authorization header
 * @param {string} id - MongoDB task ID
 * @param {Object} taskData - Updated task object
 * @returns {Promise<Object>} - Updated task from database
 * @throws {Error} - Task not found, authentication error, or server error
 */
export async function updateTask(id, taskData) {
  if (!id) {
    throw new Error('Task ID is required');
  }

  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(taskData),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
}

/**
 * Partially update a task
 * Requires authentication token in Authorization header
 * @param {string} id - MongoDB task ID
 * @param {Object} updates - Partial task updates (only provided fields)
 * @returns {Promise<Object>} - Updated task from database
 * @throws {Error} - Task not found, authentication error, or server error
 */
export async function patchTask(id, updates) {
  if (!id) {
    throw new Error('Task ID is required');
  }

  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: buildHeaders(),
      body: JSON.stringify(updates),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
}

/**
 * Delete a task by ID
 * Requires authentication token in Authorization header
 * @param {string} id - MongoDB task ID
 * @returns {Promise<Object>} - Response confirming deletion
 * @throws {Error} - Task not found, authentication error, or server error
 */
export async function deleteTask(id) {
  if (!id) {
    throw new Error('Task ID is required');
  }

  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
}

/**
 * Get the base URL for debugging purposes
 * @returns {string} - Current API base URL
 */
export function getBaseURL() {
  return BASE_URL;
}

// Export all functions as default too for flexibility
export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  getBaseURL,
};

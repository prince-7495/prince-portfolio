/**
 * Centralized API client for backend communication
 * Single source of truth for all backend requests
 * 
 * URL: http://localhost:5000 (development)
 * Can be configured via environment variables
 */

// Base URL for backend API
// Uses Vite environment variable if available, otherwise defaults to localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
 * @returns {Promise<Array>} - Array of task objects from MongoDB
 * @throws {Error} - Network error or server error
 */
export async function getTasks() {
  try {
    const response = await fetch(`${BASE_URL}/tasks`);
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
}

/**
 * Fetch a single task by ID
 * @param {string} id - MongoDB task ID
 * @returns {Promise<Object>} - Task object
 * @throws {Error} - Task not found or server error
 */
export async function getTaskById(id) {
  if (!id) {
    throw new Error('Task ID is required');
  }
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`);
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch task: ${error.message}`);
  }
}

/**
 * Create a new task
 * @param {Object} taskData - Task object { title, description, priority, completed }
 * @returns {Promise<Object>} - Created task with MongoDB _id
 * @throws {Error} - Validation error or server error
 */
export async function createTask(taskData) {
  if (!taskData.title || !taskData.title.trim()) {
    throw new Error('Task title is required');
  }

  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
}

/**
 * Update an existing task (full update)
 * @param {string} id - MongoDB task ID
 * @param {Object} taskData - Updated task object
 * @returns {Promise<Object>} - Updated task from database
 * @throws {Error} - Task not found or server error
 */
export async function updateTask(id, taskData) {
  if (!id) {
    throw new Error('Task ID is required');
  }

  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
}

/**
 * Partially update a task
 * @param {string} id - MongoDB task ID
 * @param {Object} updates - Partial task updates (only provided fields)
 * @returns {Promise<Object>} - Updated task from database
 * @throws {Error} - Task not found or server error
 */
export async function patchTask(id, updates) {
  if (!id) {
    throw new Error('Task ID is required');
  }

  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
}

/**
 * Delete a task by ID
 * @param {string} id - MongoDB task ID
 * @returns {Promise<Object>} - Response confirming deletion
 * @throws {Error} - Task not found or server error
 */
export async function deleteTask(id) {
  if (!id) {
    throw new Error('Task ID is required');
  }

  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
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

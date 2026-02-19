/**
 * PlaceMeDB (JMCTestDB) - API Client Layer
 * Handles communication with the Node.js Backend.
 */
class JMCTestDB {
    constructor() {
        // Determine the API URL based on the current environment
        // If we are opening the HTML files directly (file://), we must point to the local server
        if (window.location.protocol === 'file:') {
            this.API_URL = 'http://localhost:3000/api';
        } else {
            // Otherwise, we use a relative path which works for both localhost:3000 and production
            this.API_URL = '/api';
        }
    }

    /**
     * Register a new user
     */
    async addUser(user) {
        try {
            const response = await fetch(`${this.API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            return data;
        } catch (error) {
            console.error('[JMCTestDB] Register Error:', error);
            throw error;
        }
    }

    /**
     * Authenticate user
     */
    async authenticate(username, password, type) {
        try {
            const response = await fetch(`${this.API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.success) {
                // Determine type match if strict checking needed, but backend handles login simply
                if(type && data.user.type !== type) {
                    console.warn(`User type mismatch: Expected ${type}, got ${data.user.type}`);
                     // Optional: return null if type doesn't match
                }
                return data.user;
            }
            return null;
        } catch (error) {
            console.error('[JMCTestDB] Login Error:', error);
            return null;
        }
    }

    /**
     * Get all active tests
     */
    async getTests() {
        try {
            const response = await fetch(`${this.API_URL}/tests/available`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('[JMCTestDB] GetTests Error:', error);
            return [];
        }
    }

    /**
     * Submit Test Result
     */
    async submitTest(resultData) {
        try {
            const response = await fetch(`${this.API_URL}/tests/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resultData)
            });
            return await response.json();
        } catch (error) {
            console.error('[JMCTestDB] SubmitTest Error:', error);
            throw error;
        }
    }

    /**
     * Get Student Results
     */
    async getStudentResults(username) {
        try {
             const response = await fetch(`${this.API_URL}/results/student/${username}`);
             if(!response.ok) return [];
             return await response.json();
        } catch (error) {
             console.error('[JMCTestDB] GetResults Error:', error);
             return [];
        }
    }

    /**
     * Create a new test (Staff)
     */
    async createTest(testData) {
        try {
            const response = await fetch(`${this.API_URL}/staff/create-test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });
            return await response.json();
        } catch (error) {
            console.error('[JMCTestDB] CreateTest Error:', error);
            throw error;
        }
    }

    /**
     * Get all results (Staff)
     */
    async getAllResults() {
        try {
            const response = await fetch(`${this.API_URL}/results/all`);
            if(!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('[JMCTestDB] GetAllResults Error:', error);
            return [];
        }
    }

    /**
     * Get all registered students (Staff)
     */
    async getStudents() {
        try {
            const response = await fetch(`${this.API_URL}/staff/students`);
            if(!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('[JMCTestDB] GetStudents Error:', error);
            return [];
        }
    }

    /**
     * Delete a test (Staff)
     */
    async deleteTest(testId) {
        try {
            const response = await fetch(`${this.API_URL}/staff/tests/${testId}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('[JMCTestDB] DeleteTest Error:', error);
            throw error;
        }
    }
}

// Export global instance
window.DB = new JMCTestDB();

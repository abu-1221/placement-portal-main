/**
 * PlaceMeDB (JMCTestDB) - API Client Layer
 * Handles communication with the Node.js Backend.
 */
class JMCTestDB {
    constructor() {
        this.API_URL = 'http://localhost:3000/api';
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
}

// Export global instance
window.DB = new JMCTestDB();

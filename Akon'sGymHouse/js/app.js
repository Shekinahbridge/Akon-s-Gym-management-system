// Akon's GymHouse - Main JavaScript File
// API-based version (replaces localStorage with MySQL database)

const API_URL = '/gymhouse/api/api.php';

// ==================== API HELPER ====================
const API = {
    async get(action, params = {}) {
        const queryParams = new URLSearchParams({ action, ...params });
        const response = await fetch(`${API_URL}?${queryParams}`);
        return response.json();
    },

    async post(action, data = {}) {
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    }
};

// ==================== AUTHENTICATION ====================
const Auth = {
    currentUser: null,

    init() {
        const saved = sessionStorage.getItem('gymhouse_current_user');
        if (saved) {
            this.currentUser = JSON.parse(saved);
        }
    },

    async login(email, password) {
        const result = await API.post('login', { email, password });
        if (result.success) {
            this.currentUser = result.user;
            sessionStorage.setItem('gymhouse_current_user', JSON.stringify(result.user));
        }
        return result;
    },

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('gymhouse_current_user');
        window.location.href = '/gymhouse/pages/login.html';
    },

    getUser() {
        return this.currentUser;
    },

    isLoggedIn() {
        return this.currentUser !== null;
    },

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/gymhouse/pages/login.html';
            return false;
        }
        return true;
    },

    requireRole(role) {
        if (!this.requireAuth()) return false;
        if (this.currentUser.role !== role && this.currentUser.role !== 'admin') {
            window.location.href = '/gymhouse/index.html';
            return false;
        }
        return true;
    }
};

// ==================== DATA STORE (API VERSION) ====================
const DataStore = {
    // Users
    async getUsers(role = '') {
        const result = await API.get('getUsers', role ? { role } : {});
        return result.success ? result.users : [];
    },

    async getUserById(id) {
        const result = await API.get('getUser', { id });
        return result.success ? result.user : null;
    },

    async getUserByEmail(email) {
        const result = await API.get('getUserByEmail', { email });
        return result.success ? result.user : null;
    },

    async addUser(userData) {
        const result = await API.post('addUser', userData);
        return result.success ? result.user : null;
    },

    async updateUser(id, updates) {
        const result = await API.post('updateUser', { id, ...updates });
        return result.success;
    },

    async deleteUser(id) {
        const result = await API.post('deleteUser', { id });
        return result.success;
    },

    // Plans
    async getPlans() {
        const result = await API.get('getPlans');
        return result.success ? result.plans : [];
    },

    async getPlanById(id) {
        const result = await API.get('getPlan', { id });
        return result.success ? result.plan : null;
    },

    async savePlan(planData) {
        const result = await API.post('savePlan', planData);
        return result.success;
    },

    // Classes
    async getClasses() {
        const result = await API.get('getClasses');
        return result.success ? result.classes : [];
    },

    async getClassById(id) {
        const result = await API.get('getClass', { id });
        return result.success ? result.class : null;
    },

    async getClassesByTrainer(trainerId) {
        const result = await API.get('getClassesByTrainer', { trainerId });
        return result.success ? result.classes : [];
    },

    async saveClass(classData) {
        const result = await API.post('saveClass', classData);
        return result.success;
    },

    async deleteClass(id) {
        const result = await API.post('deleteClass', { id });
        return result.success;
    },

    // Payments
    async getPayments() {
        const result = await API.get('getPayments');
        return result.success ? result.payments : [];
    },

    async getPaymentsByUser(userId) {
        const result = await API.get('getPaymentsByUser', { userId });
        return result.success ? result.payments : [];
    },

    async addPayment(paymentData) {
        const result = await API.post('addPayment', paymentData);
        return result.success;
    },

    // Check-ins
    async getCheckins() {
        const result = await API.get('getCheckins');
        return result.success ? result.checkins : [];
    },

    async getCheckinsByUser(userId) {
        const result = await API.get('getCheckinsByUser', { userId });
        return result.success ? result.checkins : [];
    },

    async getTodayCheckin(userId) {
        const result = await API.get('getTodayCheckin', { userId });
        return result.success ? result.checkin : null;
    },

    async addCheckin(userId) {
        const result = await API.post('addCheckin', { userId });
        return result.success ? result.checkin : null;
    },

    // Bookings
    async getBookings() {
        const result = await API.get('getBookings');
        return result.success ? result.bookings : [];
    },

    async getBookingsByUser(userId) {
        const result = await API.get('getBookingsByUser', { userId });
        return result.success ? result.bookings : [];
    },

    async getBookingsByClass(classId) {
        const result = await API.get('getBookingsByClass', { classId });
        return result.success ? result.bookings : [];
    },

    async addBooking(bookingData) {
        const result = await API.post('addBooking', bookingData);
        return result.success;
    },

    async markAttendance(bookingId, attended) {
        const result = await API.post('markAttendance', { id: bookingId, attended });
        return result.success;
    },

    // Stats
    async getStats() {
        const result = await API.get('getStats');
        return result.success ? result.stats : {};
    }
};

// ==================== UI HELPERS ====================
const UI = {
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    formatCurrency(amount) {
        return 'KES ' + amount.toLocaleString();
    },

    toast(message, type = 'success') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    },

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    confirm(message) {
        return window.confirm(message);
    }
};

// ==================== M-PESA PAYMENT SIMULATION ====================
const MPesa = {
    async initiatePayment(phone, amount, description) {
        // Simulate API call to M-Pesa
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate successful payment 90% of the time
                if (Math.random() > 0.1) {
                    resolve({
                        success: true,
                        transactionId: 'MP' + Date.now(),
                        message: 'Payment successful'
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'Payment failed. Please try again.'
                    });
                }
            }, 2000);
        });
    }
};

// ==================== REPORTS ====================
const Reports = {
    generateMembersReport() {
        return DataStore.getUsers('member').then(members => {
            const data = members.map(m => ({
                Name: m.name,
                Email: m.email,
                Phone: m.phone,
                Plan: m.plan || 'None',
                Status: m.plan && new Date(m.plan_expiry) > new Date() ? 'Active' : 'Inactive',
                Joined: UI.formatDate(m.created_at)
            }));
            
            return {
                title: 'Members Report - Akon\'s GymHouse',
                generatedAt: new Date().toISOString(),
                totalMembers: members.length,
                data
            };
        });
    },

    generatePaymentsReport(from, to) {
        return DataStore.getPayments().then(payments => {
            let filtered = payments;
            if (from) {
                filtered = filtered.filter(p => new Date(p.created_at) >= new Date(from));
            }
            if (to) {
                filtered = filtered.filter(p => new Date(p.created_at) <= new Date(to + 'T23:59:59'));
            }
            
            const data = filtered.map(p => ({
                Date: UI.formatDate(p.created_at),
                Member: p.user_name,
                Plan: p.plan_name,
                Amount: p.amount,
                'Transaction ID': p.transaction_id
            }));
            
            return {
                title: 'Payments Report - Akon\'s GymHouse',
                generatedAt: new Date().toISOString(),
                totalAmount: filtered.reduce((s, p) => s + p.amount, 0),
                data
            };
        });
    },

    generateCheckinsReport(memberId = null) {
        return DataStore.getCheckins().then(checkins => {
            let filtered = checkins;
            if (memberId) {
                filtered = filtered.filter(c => c.user_id == memberId);
            }
            
            const data = filtered.map(c => ({
                Date: UI.formatDate(c.date),
                Time: c.time,
                Member: c.user_name,
                Day: new Date(c.date).toLocaleDateString('en-US', { weekday: 'long' })
            }));
            
            return {
                title: 'Check-ins Report - Akon\'s GymHouse',
                generatedAt: new Date().toISOString(),
                totalCheckins: filtered.length,
                data
            };
        });
    },

    downloadCSV(data, filename) {
        if (!data || data.length === 0) {
            UI.toast('No data to export', 'error');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(h => {
                const val = row[h] || '';
                return `"${String(val).replace(/"/g, '""')}"`;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.csv';
        a.click();
        URL.revokeObjectURL(url);
    },

    printReport(report) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>${report.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 2rem; }
                    h1 { color: #5A4A3A; }
                    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #F4EFE6; }
                    .meta { color: #666; margin-bottom: 1rem; }
                </style>
            </head>
            <body>
                <h1>${report.title}</h1>
                <div class="meta">
                    <p>Generated: ${new Date(report.generatedAt).toLocaleString()}</p>
                    ${report.totalMembers !== undefined ? `<p>Total Members: ${report.totalMembers}</p>` : ''}
                    ${report.totalAmount !== undefined ? `<p>Total Amount: KES ${report.totalAmount.toLocaleString()}</p>` : ''}
                    ${report.totalCheckins !== undefined ? `<p>Total Check-ins: ${report.totalCheckins}</p>` : ''}
                </div>
                <table>
                    <thead>
                        <tr>${Object.keys(report.data[0] || {}).map(h => `<th>${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${report.data.map(row => `<tr>${Object.values(row).map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
};

// Initialize Auth on page load
Auth.init();


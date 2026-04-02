// Akon's GymHouse - Main Application JavaScript

// Data Store
const DataStore = {
    // Initialize default data - ALWAYS call this before using any data
    init() {
        console.log('Initializing GymHouse DataStore...');
        
        // Check if we need to initialize (either no data or force reset)
        const existingUsers = localStorage.getItem('gymhouse_users');
        let users = [];
        
        try {
            users = existingUsers ? JSON.parse(existingUsers) : [];
        } catch (e) {
            users = [];
        }
        
        // If no users exist or array is empty, create defaults
        if (!users || users.length === 0) {
            console.log('Creating default users...');
            const defaultUsers = [
                {
                    id: 'admin1',
                    name: 'Admin User',
                    email: 'admin@akonsgym.com',
                    password: 'admin123',
                    role: 'admin',
                    phone: '+254712345678',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'trainer1',
                    name: 'Mike Akon',
                    email: 'mike@akonsgym.com',
                    password: 'trainer123',
                    role: 'trainer',
                    phone: '+254712345679',
                    specialty: 'Yoga & Mobility',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'trainer2',
                    name: 'John Kip',
                    email: 'john@akonsgym.com',
                    password: 'trainer123',
                    role: 'trainer',
                    phone: '+254712345680',
                    specialty: 'Strength & Conditioning',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'trainer3',
                    name: 'Lisa Wanjiku',
                    email: 'lisa@akonsgym.com',
                    password: 'trainer123',
                    role: 'trainer',
                    phone: '+254712345681',
                    specialty: 'HIIT & Core',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('gymhouse_users', JSON.stringify(defaultUsers));
            console.log('Default users created:', defaultUsers.length);
        } else {
            console.log('Users already exist:', users.length);
        }

        // Initialize plans if not exist
        let existingPlans = localStorage.getItem('gymhouse_plans');
        let plans = [];
        try {
            plans = existingPlans ? JSON.parse(existingPlans) : [];
        } catch (e) {
            plans = [];
        }
        
        if (!plans || plans.length === 0) {
            console.log('Creating default plans...');
            const defaultPlans = [
                {
                    id: 'basic',
                    name: 'Basic',
                    price: 2500,
                    duration: 'weekly',
                    features: ['Access to gym floor', 'Locker room access', 'Basic equipment', 'Shower facilities'],
                    description: 'Perfect for beginners who want to get started'
                },
                {
                    id: 'standard',
                    name: 'Standard',
                    price: 4000,
                    duration: 'weekly',
                    features: ['Everything in Basic', 'All group classes', 'Sauna access', 'Nutrition guide', 'Progress tracking'],
                    description: 'Most popular choice for regular gym-goers',
                    featured: true
                },
                {
                    id: 'premium',
                    name: 'Premium',
                    price: 6500,
                    duration: 'weekly',
                    features: ['Everything in Standard', '2 PT sessions/month', 'Personalized workout plan', 'Priority class booking', 'Recovery zone access'],
                    description: 'For those who want the complete experience'
                }
            ];
            localStorage.setItem('gymhouse_plans', JSON.stringify(defaultPlans));
            console.log('Default plans created:', defaultPlans.length);
        }

        // Initialize classes if not exist
        let existingClasses = localStorage.getItem('gymhouse_classes');
        let classes = [];
        try {
            classes = existingClasses ? JSON.parse(existingClasses) : [];
        } catch (e) {
            classes = [];
        }
        
        if (!classes || classes.length === 0) {
            console.log('Creating default classes...');
            const defaultClasses = [
                { id: 'c1', name: 'Sunrise Yoga', trainerId: 'trainer1', time: '06:00', days: ['Mon', 'Wed', 'Fri'], duration: 45, maxCapacity: 15 },
                { id: 'c2', name: 'HIIT & Strength', trainerId: 'trainer2', time: '07:30', days: ['Tue', 'Thu', 'Sat'], duration: 45, maxCapacity: 20 },
                { id: 'c3', name: 'Lower Body Burn', trainerId: 'trainer3', time: '09:00', days: ['Mon', 'Thu'], duration: 50, maxCapacity: 18 },
                { id: 'c4', name: 'Upper Body Sculpt', trainerId: 'trainer2', time: '17:30', days: ['Mon', 'Wed', 'Fri'], duration: 45, maxCapacity: 20 },
                { id: 'c5', name: 'Mobility & Core', trainerId: 'trainer1', time: '19:00', days: ['Tue', 'Thu'], duration: 40, maxCapacity: 15 },
                { id: 'c6', name: 'Weekend Warrior', trainerId: 'trainer3', time: '10:00', days: ['Sat'], duration: 60, maxCapacity: 25 }
            ];
            localStorage.setItem('gymhouse_classes', JSON.stringify(defaultClasses));
            console.log('Default classes created:', defaultClasses.length);
        }

        // Initialize empty arrays for other data if not exist
        if (!localStorage.getItem('gymhouse_payments')) {
            localStorage.setItem('gymhouse_payments', JSON.stringify([]));
        }
        if (!localStorage.getItem('gymhouse_checkins')) {
            localStorage.setItem('gymhouse_checkins', JSON.stringify([]));
        }
        if (!localStorage.getItem('gymhouse_class_bookings')) {
            localStorage.setItem('gymhouse_class_bookings', JSON.stringify([]));
        }
        
        console.log('DataStore initialization complete!');
    },

    // Users
    getUsers() {
        return JSON.parse(localStorage.getItem('gymhouse_users')) || [];
    },

    getUserById(id) {
        return this.getUsers().find(u => u.id === id);
    },

    getUserByEmail(email) {
        if (!email) return undefined;
        return this.getUsers().find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    },

    addUser(user) {
        const users = this.getUsers();
        user.id = 'user' + Date.now();
        user.createdAt = new Date().toISOString();
        users.push(user);
        localStorage.setItem('gymhouse_users', JSON.stringify(users));
        return user;
    },

    updateUser(id, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('gymhouse_users', JSON.stringify(users));
            return users[index];
        }
        return null;
    },

    deleteUser(id) {
        const users = this.getUsers();
        const filtered = users.filter(u => u.id !== id);
        localStorage.setItem('gymhouse_users', JSON.stringify(filtered));
    },

    // Plans
    getPlans() {
        return JSON.parse(localStorage.getItem('gymhouse_plans')) || [];
    },

    getPlanById(id) {
        return this.getPlans().find(p => p.id === id);
    },

    // Classes
    getClasses() {
        return JSON.parse(localStorage.getItem('gymhouse_classes')) || [];
    },

    getClassById(id) {
        return this.getClasses().find(c => c.id === id);
    },

    getClassesByTrainer(trainerId) {
        return this.getClasses().filter(c => c.trainerId === trainerId);
    },

    // Payments
    getPayments() {
        return JSON.parse(localStorage.getItem('gymhouse_payments')) || [];
    },

    getPaymentsByUser(userId) {
        return this.getPayments().filter(p => p.userId === userId);
    },

    addPayment(payment) {
        const payments = this.getPayments();
        payment.id = 'pay' + Date.now();
        payment.createdAt = new Date().toISOString();
        payments.push(payment);
        localStorage.setItem('gymhouse_payments', JSON.stringify(payments));
        return payment;
    },

    // Check-ins
    getCheckins() {
        return JSON.parse(localStorage.getItem('gymhouse_checkins')) || [];
    },

    getCheckinsByUser(userId) {
        return this.getCheckins().filter(c => c.userId === userId);
    },

    getTodayCheckin(userId) {
        const today = new Date().toDateString();
        return this.getCheckins().find(c => c.userId === userId && new Date(c.date).toDateString() === today);
    },

    addCheckin(userId) {
        const checkins = this.getCheckins();
        const checkin = {
            id: 'chk' + Date.now(),
            userId,
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString()
        };
        checkins.push(checkin);
        localStorage.setItem('gymhouse_checkins', JSON.stringify(checkins));
        return checkin;
    },

    // Class Bookings
    getBookings() {
        return JSON.parse(localStorage.getItem('gymhouse_class_bookings')) || [];
    },

    getBookingsByUser(userId) {
        return this.getBookings().filter(b => b.userId === userId);
    },

    getBookingsByClass(classId) {
        return this.getBookings().filter(b => b.classId === classId);
    },

    getUpcomingBookings(userId) {
        const today = new Date();
        return this.getBookingsByUser(userId).filter(b => new Date(b.date) >= today);
    },

    getPastBookings(userId) {
        const today = new Date();
        return this.getBookingsByUser(userId).filter(b => new Date(b.date) < today);
    },

    addBooking(booking) {
        const bookings = this.getBookings();
        booking.id = 'bk' + Date.now();
        booking.createdAt = new Date().toISOString();
        booking.status = 'booked';
        bookings.push(booking);
        localStorage.setItem('gymhouse_class_bookings', JSON.stringify(bookings));
        return booking;
    },

    cancelBooking(bookingId) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
            bookings[index].status = 'cancelled';
            localStorage.setItem('gymhouse_class_bookings', JSON.stringify(bookings));
            return true;
        }
        return false;
    },

    markAttendance(bookingId, attended) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
            bookings[index].status = attended ? 'attended' : 'missed';
            localStorage.setItem('gymhouse_class_bookings', JSON.stringify(bookings));
            return true;
        }
        return false;
    }
};

// Auth Manager
const Auth = {
    currentUser: null,

    init() {
        const saved = sessionStorage.getItem('gymhouse_current_user');
        if (saved) {
            this.currentUser = JSON.parse(saved);
        }
    },

    login(email, password) {
        console.log('Auth.login called with email:', email);
        const user = DataStore.getUserByEmail(email);
        console.log('Found user:', user ? user.email : 'not found');
        
        if (user && user.password === password) {
            this.currentUser = user;
            sessionStorage.setItem('gymhouse_current_user', JSON.stringify(user));
            console.log('Login successful for:', user.email);
            return { success: true, user };
        }
        
        if (user) {
            console.log('Password mismatch. Expected:', user.password, 'Got:', password);
        }
        return { success: false, error: 'Invalid email or password' };
    },

    register(userData) {
        const existing = DataStore.getUserByEmail(userData.email);
        if (existing) {
            return { success: false, error: 'Email already registered' };
        }
        const user = DataStore.addUser(userData);
        this.currentUser = user;
        sessionStorage.setItem('gymhouse_current_user', JSON.stringify(user));
        return { success: true, user };
    },

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('gymhouse_current_user');
        window.location.href = '../index.html';
    },

    isLoggedIn() {
        return this.currentUser !== null;
    },

    getUser() {
        return this.currentUser;
    },

    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    },

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '../pages/login.html';
            return false;
        }
        return true;
    },

    requireRole(role) {
        if (!this.requireAuth()) return false;
        if (!this.hasRole(role)) {
            window.location.href = '../index.html';
            return false;
        }
        return true;
    }
};

// M-Pesa Payment Simulation
const MPesa = {
    initiatePayment(phone, amount, description) {
        // Simulate STK push
        return new Promise((resolve) => {
            setTimeout(() => {
                // 90% success rate for simulation
                const success = Math.random() > 0.1;
                if (success) {
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

// UI Utilities
const UI = {
    toast(message, type = 'success') {
        const container = document.querySelector('.toast-container') || this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : '!';
        toast.innerHTML = `
            <span style="font-size: 1.25rem; font-weight: bold;">${icon}</span>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    },

    formatCurrency(amount) {
        return 'KES ' + amount.toLocaleString('en-KE');
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-KE', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    },

    formatTime(timeString) {
        return timeString;
    },

    showModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('active');
        }
    },

    hideModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
        }
    },

    generateId(prefix = 'id') {
        return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
    }
};

// Report Generator
const Reports = {
    generateMembersReport() {
        const members = DataStore.getUsers().filter(u => u.role === 'member');
        return {
            title: 'Members Report',
            generatedAt: new Date().toISOString(),
            totalMembers: members.length,
            data: members.map(m => ({
                name: m.name,
                email: m.email,
                phone: m.phone,
                plan: m.plan || 'None',
                joined: m.createdAt
            }))
        };
    },

    generatePaymentsReport(startDate, endDate) {
        let payments = DataStore.getPayments();
        if (startDate && endDate) {
            payments = payments.filter(p => {
                const date = new Date(p.createdAt);
                return date >= new Date(startDate) && date <= new Date(endDate);
            });
        }
        
        const total = payments.reduce((sum, p) => sum + p.amount, 0);
        
        return {
            title: 'Payments Report',
            generatedAt: new Date().toISOString(),
            period: { start: startDate, end: endDate },
            totalAmount: total,
            totalTransactions: payments.length,
            data: payments
        };
    },

    generateCheckinsReport(userId) {
        let checkins = DataStore.getCheckins();
        if (userId) {
            checkins = checkins.filter(c => c.userId === userId);
        }
        
        return {
            title: 'Check-ins Report',
            generatedAt: new Date().toISOString(),
            totalCheckins: checkins.length,
            data: checkins
        };
    },

    downloadCSV(data, filename) {
        const csv = this.convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    },

    convertToCSV(data) {
        if (!data || data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const rows = data.map(row => 
            headers.map(h => {
                const val = row[h];
                // Escape values with commas or quotes
                if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
                    return `"${val.replace(/"/g, '""')}"`;
                }
                return val;
            }).join(',')
        );
        
        return [headers.join(','), ...rows].join('\n');
    },

    printReport(reportData) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>${reportData.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 2rem; }
                    h1 { color: #B14E00; }
                    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #F4EFE6; }
                    .summary { margin: 1rem 0; padding: 1rem; background-color: #F4EFE6; border-radius: 8px; }
                </style>
            </head>
            <body>
                <h1>${reportData.title}</h1>
                <p>Generated: ${new Date(reportData.generatedAt).toLocaleString()}</p>
                <div class="summary">
                    ${Object.entries(reportData).filter(([k]) => !['title', 'generatedAt', 'data'].includes(k))
                        .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`).join('')}
                </div>
                ${reportData.data && reportData.data.length > 0 ? `
                    <table>
                        <thead>
                            <tr>${Object.keys(reportData.data[0]).map(k => `<th>${k}</th>`).join('')}</tr>
                        </thead>
                        <tbody>
                            ${reportData.data.map(row => `
                                <tr>${Object.values(row).map(v => `<td>${v}</td>`).join('')}</tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p>No data available</p>'}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
};

// Initialize immediately when script loads (not waiting for DOM)
(function initApp() {
    console.log('=== GymHouse App Starting ===');
    
    // Check localStorage availability
    try {
        localStorage.setItem('gh_test', '1');
        localStorage.removeItem('gh_test');
        console.log('localStorage is available');
    } catch (e) {
        console.error('localStorage is NOT available:', e);
    }
    
    DataStore.init();
    Auth.init();
    
    console.log('=== GymHouse App Initialized ===');
    console.log('Users in memory:', DataStore.getUsers().length);
    console.log('Users in localStorage:', localStorage.getItem('gymhouse_users') ? JSON.parse(localStorage.getItem('gymhouse_users')).length : 0);
})();

// Export for use in other scripts
window.DataStore = DataStore;
window.Auth = Auth;
window.MPesa = MPesa;
window.UI = UI;
window.Reports = Reports;

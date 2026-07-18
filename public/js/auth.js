/* ============================================
   KALPA AI — Authentication Module
   Registration, Login, Session Management
   ============================================ */

const KalpaAuth = {
    _prefix: 'kalpa_',

    _get(key) {
        try {
            const raw = localStorage.getItem(this._prefix + key);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    },

    _set(key, value) {
        localStorage.setItem(this._prefix + key, JSON.stringify(value));
    },

    /* Simple hash for demo — NOT cryptographic */
    _hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'h_' + Math.abs(hash).toString(36) + '_' + password.length;
    },

    /* ============================================
       REGISTRATION
       ============================================ */
    register(data) {
        const errors = this.validateRegistration(data);
        if (errors.length > 0) {
            return { success: false, errors };
        }

        const merchants = this._get('merchants') || [];

        /* Check duplicate email */
        if (merchants.find(m => m.email.toLowerCase() === data.email.toLowerCase())) {
            return { success: false, errors: [{ field: 'email', message: 'This email is already registered' }] };
        }

        const merchant = {
            id: 'merchant_' + Date.now().toString(36),
            name: data.name.trim(),
            businessName: data.businessName.trim(),
            email: data.email.trim().toLowerCase(),
            phone: data.phone.trim(),
            passwordHash: this._hashPassword(data.password),
            businessCategory: data.businessCategory,
            businessAddress: data.businessAddress.trim(),
            avatar: null,
            createdAt: new Date().toISOString(),
        };

        merchants.push(merchant);
        this._set('merchants', merchants);

        return { success: true, merchant };
    },

    validateRegistration(data) {
        const errors = [];

        if (!data.name || data.name.trim().length < 2) {
            errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
        }

        if (!data.businessName || data.businessName.trim().length < 2) {
            errors.push({ field: 'businessName', message: 'Business name is required' });
        }

        if (!data.email || !this._isValidEmail(data.email)) {
            errors.push({ field: 'email', message: 'Please enter a valid email address' });
        }

        if (!data.phone || !this._isValidPhone(data.phone)) {
            errors.push({ field: 'phone', message: 'Please enter a valid 10-digit phone number' });
        }

        if (!data.password || data.password.length < 6) {
            errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
        }

        if (data.password !== data.confirmPassword) {
            errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
        }

        if (!data.businessCategory) {
            errors.push({ field: 'businessCategory', message: 'Please select a business category' });
        }

        if (!data.businessAddress || data.businessAddress.trim().length < 5) {
            errors.push({ field: 'businessAddress', message: 'Please enter your business address' });
        }

        return errors;
    },

    _isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    _isValidPhone(phone) {
        const digits = phone.replace(/[\s\-\+\(\)]/g, '');
        return digits.length >= 10 && digits.length <= 13;
    },

    /* ============================================
       LOGIN
       ============================================ */
    login(email, password, rememberMe) {
        if (!email || !password) {
            return { success: false, error: 'Email and password are required' };
        }

        const merchants = this._get('merchants') || [];
        const merchant = merchants.find(m => m.email === email.trim().toLowerCase());

        if (!merchant) {
            return { success: false, error: 'No account found with this email' };
        }

        if (merchant.passwordHash !== this._hashPassword(password)) {
            return { success: false, error: 'Incorrect password' };
        }

        /* Create session */
        const session = {
            merchantId: merchant.id,
            email: merchant.email,
            name: merchant.name,
            businessName: merchant.businessName,
            loginAt: new Date().toISOString(),
            rememberMe: !!rememberMe,
        };

        this._set('session', session);

        return { success: true, merchant };
    },

    /* ============================================
       SESSION
       ============================================ */
    isAuthenticated() {
        return !!this._get('session');
    },

    getCurrentMerchant() {
        const session = this._get('session');
        if (!session) return null;

        const merchants = this._get('merchants') || [];
        return merchants.find(m => m.id === session.merchantId) || null;
    },

    getSession() {
        return this._get('session');
    },

    updateMerchant(updates) {
        const session = this._get('session');
        if (!session) return null;

        const merchants = this._get('merchants') || [];
        const idx = merchants.findIndex(m => m.id === session.merchantId);
        if (idx === -1) return null;

        merchants[idx] = { ...merchants[idx], ...updates };
        this._set('merchants', merchants);

        /* Update session name/email if changed */
        if (updates.name) session.name = updates.name;
        if (updates.email) session.email = updates.email;
        if (updates.businessName) session.businessName = updates.businessName;
        this._set('session', session);

        return merchants[idx];
    },

    /* ============================================
       LOGOUT
       ============================================ */
    logout() {
        localStorage.removeItem(this._prefix + 'session');
        window.location.href = 'login.html';
    },

    /* ============================================
       AUTH GUARDS
       ============================================ */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    requireGuest() {
        if (this.isAuthenticated()) {
            window.location.href = 'dashboard.html';
            return false;
        }
        return true;
    },

    /* ============================================
       PASSWORD STRENGTH
       ============================================ */
    getPasswordStrength(password) {
        if (!password) return { score: 0, label: '', color: '' };

        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const levels = [
            { score: 0, label: 'Too weak', color: '#DC2626' },
            { score: 1, label: 'Weak', color: '#DC2626' },
            { score: 2, label: 'Fair', color: '#D97706' },
            { score: 3, label: 'Good', color: '#D97706' },
            { score: 4, label: 'Strong', color: '#16A34A' },
            { score: 5, label: 'Very strong', color: '#16A34A' },
        ];

        return { score, ...levels[score] };
    },

    /* Business categories for the dropdown */
    getBusinessCategories() {
        return [
            'Clothing & Apparel',
            'Textiles & Fabrics',
            'Jewellery & Accessories',
            'Grocery & FMCG',
            'Electronics & Gadgets',
            'Home & Kitchen',
            'Beauty & Personal Care',
            'Books & Stationery',
            'Sports & Fitness',
            'Handicrafts & Art',
            'Food & Beverages',
            'Pharmacy & Health',
            'Hardware & Tools',
            'Automotive Parts',
            'Other',
        ];
    }
};

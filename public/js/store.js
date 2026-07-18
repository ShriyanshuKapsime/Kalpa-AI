/* ============================================
   KALPA AI — Data Store
   localStorage CRUD layer + mock data generation
   ============================================ */

const KalpaStore = {
    _prefix: 'kalpa_',

    /* ---- Low-level helpers ---- */
    _get(key) {
        try {
            const raw = localStorage.getItem(this._prefix + key);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    },

    _set(key, value) {
        localStorage.setItem(this._prefix + key, JSON.stringify(value));
    },

    _uuid() {
        return 'xxxx-xxxx-xxxx'.replace(/x/g, () =>
            ((Math.random() * 16) | 0).toString(16)
        );
    },

    _shortId() {
        return 'KLP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    },

    _randomDate(daysBack) {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
        d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        return d.toISOString();
    },

    _randomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    _randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    _randomPrice(min, max) {
        return Math.round((Math.random() * (max - min) + min) / 10) * 10;
    },

    /* ============================================
       STORE PROFILE
       ============================================ */
    getStoreProfile() {
        return this._get('store_profile') || null;
    },

    setStoreProfile(profile) {
        profile.updatedAt = new Date().toISOString();
        this._set('store_profile', profile);
    },

    isStoreSetup() {
        return !!this._get('store_profile');
    },

    /* ============================================
       PRODUCTS
       ============================================ */
    getProducts() {
        return this._get('products') || [];
    },

    getProduct(id) {
        return this.getProducts().find(p => p.id === id) || null;
    },

    addProduct(product) {
        const products = this.getProducts();
        product.id = product.id || this._uuid();
        product.sku = product.sku || this._shortId();
        product.createdAt = product.createdAt || new Date().toISOString();
        product.updatedAt = new Date().toISOString();
        product.status = product.status || 'active';
        products.push(product);
        this._set('products', products);
        return product;
    },

    updateProduct(id, updates) {
        const products = this.getProducts();
        const idx = products.findIndex(p => p.id === id);
        if (idx === -1) return null;
        products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() };
        this._set('products', products);
        return products[idx];
    },

    deleteProduct(id) {
        const products = this.getProducts().filter(p => p.id !== id);
        this._set('products', products);
    },

    /* ============================================
       ORDERS
       ============================================ */
    getOrders() {
        return this._get('orders') || [];
    },

    getOrder(id) {
        return this.getOrders().find(o => o.id === id) || null;
    },

    addOrder(order) {
        const orders = this.getOrders();
        order.id = order.id || this._uuid();
        order.orderId = order.orderId || 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        order.createdAt = order.createdAt || new Date().toISOString();
        orders.push(order);
        this._set('orders', orders);
        return order;
    },

    updateOrderStatus(id, status) {
        return this.updateOrder(id, { status });
    },

    updateOrder(id, updates) {
        const orders = this.getOrders();
        const idx = orders.findIndex(o => o.id === id);
        if (idx === -1) return null;
        orders[idx] = { ...orders[idx], ...updates };
        this._set('orders', orders);
        return orders[idx];
    },

    /* ============================================
       CUSTOMERS
       ============================================ */
    getCustomers() {
        return this._get('customers') || [];
    },

    getCustomer(id) {
        return this.getCustomers().find(c => c.id === id) || null;
    },

    addCustomer(customer) {
        const customers = this.getCustomers();
        customer.id = customer.id || this._uuid();
        customer.createdAt = customer.createdAt || new Date().toISOString();
        customers.push(customer);
        this._set('customers', customers);
        return customer;
    },

    /* ============================================
       NOTIFICATIONS
       ============================================ */
    getNotifications() {
        return this._get('notifications') || [];
    },

    addNotification(notification) {
        const notifications = this.getNotifications();
        notification.id = notification.id || this._uuid();
        notification.createdAt = notification.createdAt || new Date().toISOString();
        notification.read = false;
        notifications.unshift(notification);
        this._set('notifications', notifications);
        return notification;
    },

    markNotificationRead(id) {
        const notifications = this.getNotifications();
        const n = notifications.find(n => n.id === id);
        if (n) { n.read = true; this._set('notifications', notifications); }
    },

    markAllNotificationsRead() {
        const notifications = this.getNotifications().map(n => ({ ...n, read: true }));
        this._set('notifications', notifications);
    },

    getUnreadCount() {
        return this.getNotifications().filter(n => !n.read).length;
    },

    /* ============================================
       DASHBOARD STATS (computed)
       ============================================ */
    getStats() {
        const products = this.getProducts();
        const orders = this.getOrders();
        const customers = this.getCustomers();

        const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const totalOrders = orders.length;
        const totalProducts = products.length;
        const activeProducts = products.filter(p => p.status === 'active').length;
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        const inventoryValue = products.reduce((sum, p) => sum + (p.sellingPrice || 0) * (p.stock || 0), 0);
        const avgConfidence = products.length > 0
            ? products.reduce((sum, p) => sum + (p.confidence || 0.85), 0) / products.length
            : 0;
        const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

        return {
            totalRevenue,
            totalOrders,
            totalProducts,
            activeProducts,
            lowStock,
            outOfStock,
            inventoryValue,
            avgConfidence,
            totalCustomers: customers.length,
            categories,
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            processingOrders: orders.filter(o => o.status === 'processing').length,
            deliveredOrders: orders.filter(o => o.status === 'delivered').length,
        };
    },

    /* ============================================
       REVENUE DATA (for charts)
       ============================================ */
    getRevenueByDay(days = 7) {
        const orders = this.getOrders();
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const dayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(dateStr));
            result.push({
                label: dayLabel,
                revenue: dayOrders.reduce((s, o) => s + (o.amount || 0), 0),
                orders: dayOrders.length,
            });
        }
        return result;
    },

    getRevenueByMonth(months = 6) {
        const orders = this.getOrders();
        const result = [];
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const monthOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(monthStr));
            result.push({
                label,
                revenue: monthOrders.reduce((s, o) => s + (o.amount || 0), 0),
                orders: monthOrders.length,
            });
        }
        return result;
    },

    getSalesByCategory() {
        const orders = this.getOrders();
        const map = {};
        orders.forEach(o => {
            if (o.items) {
                o.items.forEach(item => {
                    const cat = item.category || 'Uncategorized';
                    map[cat] = (map[cat] || 0) + (item.price || 0) * (item.qty || 1);
                });
            }
        });
        return Object.entries(map)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value);
    },

    getTopProducts(limit = 5) {
        const orders = this.getOrders();
        const map = {};
        orders.forEach(o => {
            if (o.items) {
                o.items.forEach(item => {
                    const key = item.name || 'Unknown';
                    if (!map[key]) map[key] = { name: key, sold: 0, revenue: 0 };
                    map[key].sold += item.qty || 1;
                    map[key].revenue += (item.price || 0) * (item.qty || 1);
                });
            }
        });
        return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, limit);
    },

    /* ============================================
       MOCK DATA GENERATION
       ============================================ */
    isMockDataGenerated() {
        return !!this._get('mock_generated');
    },

    generateMockData() {
        if (this.isMockDataGenerated()) return;

        const productNames = [
            { name: 'Banarasi Silk Saree - Purple & Gold', category: 'Sarees', mrp: 4500, sell: 3200, specs: { 'Fabric': 'Pure Silk', 'Length': '6.3 meters', 'Blouse Piece': 'Included', 'Work': 'Zari Weave' } },
            { name: 'Cotton Chanderi Saree - Sky Blue', category: 'Sarees', mrp: 2800, sell: 1950, specs: { 'Fabric': 'Cotton Chanderi', 'Length': '6.3 meters', 'Blouse Piece': 'Included', 'Pattern': 'Striped' } },
            { name: 'Kanjivaram Silk Saree - Red & Green', category: 'Sarees', mrp: 8500, sell: 6800, specs: { 'Fabric': 'Pure Silk', 'Length': '6.3 meters', 'Work': 'Temple Border', 'Origin': 'Kanchipuram' } },
            { name: 'Georgette Party Wear Saree - Black', category: 'Sarees', mrp: 3200, sell: 2400, specs: { 'Fabric': 'Georgette', 'Length': '5.5 meters', 'Work': 'Sequin Embroidery', 'Occasion': 'Party' } },
            { name: 'Linen Saree - Mustard Yellow', category: 'Sarees', mrp: 2200, sell: 1650, specs: { 'Fabric': 'Pure Linen', 'Length': '6.3 meters', 'Blouse Piece': 'Included', 'Wash Care': 'Dry Clean' } },
            { name: 'Embroidered Anarkali Kurti - Maroon', category: 'Kurtis', mrp: 1800, sell: 1200, specs: { 'Fabric': 'Rayon', 'Length': 'Ankle Length', 'Sleeve': '3/4th Sleeve', 'Work': 'Chikankari' } },
            { name: 'Straight Fit Cotton Kurti - Teal', category: 'Kurtis', mrp: 950, sell: 650, specs: { 'Fabric': 'Cotton', 'Fit': 'Straight', 'Neck': 'Mandarin Collar', 'Pattern': 'Printed' } },
            { name: 'A-Line Kurti Set with Palazzo - Peach', category: 'Kurtis', mrp: 2400, sell: 1750, specs: { 'Fabric': 'Viscose', 'Set Includes': 'Kurti + Palazzo', 'Length': 'Below Knee', 'Work': 'Mirror Work' } },
            { name: 'Unstitched Salwar Material - Floral Print', category: 'Dress Materials', mrp: 1600, sell: 1100, specs: { 'Fabric': 'Cotton Blend', 'Top Length': '2.5 meters', 'Bottom Length': '2.5 meters', 'Dupatta': '2.25 meters' } },
            { name: 'Printed Dupatta - Phulkari Work', category: 'Accessories', mrp: 800, sell: 550, specs: { 'Fabric': 'Chiffon', 'Length': '2.5 meters', 'Work': 'Phulkari Embroidery', 'Color': 'Multi' } },
            { name: 'Silk Blend Lehenga Choli - Royal Blue', category: 'Lehengas', mrp: 12000, sell: 8500, specs: { 'Fabric': 'Silk Blend', 'Lehenga Length': 'Floor Length', 'Choli': 'Semi-stitched', 'Dupatta': 'Net with Border' } },
            { name: 'Brocade Blouse Piece - Golden', category: 'Accessories', mrp: 450, sell: 320, specs: { 'Fabric': 'Brocade', 'Length': '1 meter', 'Work': 'Woven', 'Pattern': 'Floral Motif' } },
            { name: 'Pashmina Woolen Shawl - Wine', category: 'Accessories', mrp: 3500, sell: 2600, specs: { 'Fabric': 'Pashmina Wool', 'Size': '100x200 cm', 'Work': 'Hand Embroidered', 'Season': 'Winter' } },
            { name: 'Silk Thread Bangles Set - Multicolor', category: 'Jewellery', mrp: 350, sell: 220, specs: { 'Material': 'Silk Thread', 'Set Of': '12 Bangles', 'Stone': 'Kundan', 'Occasion': 'Festive' } },
            { name: 'Oxidized Silver Jhumka Earrings', category: 'Jewellery', mrp: 600, sell: 420, specs: { 'Material': 'Oxidized Silver', 'Type': 'Jhumka', 'Weight': '15g', 'Closure': 'Push Back' } },
            { name: 'Cotton Palazzo Pants - Off White', category: 'Bottom Wear', mrp: 700, sell: 480, specs: { 'Fabric': 'Cotton', 'Fit': 'Wide Leg', 'Waist': 'Elasticated', 'Length': 'Full Length' } },
            { name: 'Chiffon Saree - Peach with Lace Border', category: 'Sarees', mrp: 1800, sell: 1250, specs: { 'Fabric': 'Chiffon', 'Length': '5.5 meters', 'Border': 'Lace', 'Blouse': 'Unstitched' } },
            { name: 'Tussar Silk Saree - Natural Brown', category: 'Sarees', mrp: 5200, sell: 3900, specs: { 'Fabric': 'Tussar Silk', 'Length': '6.3 meters', 'Origin': 'Bhagalpur', 'Work': 'Hand Block Print' } },
            { name: 'Block Printed Bedsheet - King Size', category: 'Home Textiles', mrp: 1800, sell: 1200, specs: { 'Fabric': 'Cotton', 'Size': 'King (108x108 inches)', 'Pillow Covers': '2 Included', 'Print': 'Jaipuri Block Print' } },
            { name: 'Embroidered Cushion Cover Set', category: 'Home Textiles', mrp: 950, sell: 680, specs: { 'Fabric': 'Cotton Canvas', 'Size': '16x16 inches', 'Set Of': '5', 'Closure': 'Zip' } },
            { name: 'Handwoven Table Runner - Ikat', category: 'Home Textiles', mrp: 1100, sell: 780, specs: { 'Fabric': 'Handloom Cotton', 'Size': '14x72 inches', 'Pattern': 'Ikat Weave', 'Wash Care': 'Machine Washable' } },
            { name: 'Kalamkari Printed Stole - Rust', category: 'Accessories', mrp: 650, sell: 450, specs: { 'Fabric': 'Cotton', 'Length': '2 meters', 'Print': 'Kalamkari Hand Painted', 'Width': '0.5 meters' } },
            { name: 'Men\'s Kurta Pajama Set - Cream', category: 'Men\'s Wear', mrp: 2200, sell: 1600, specs: { 'Fabric': 'Cotton Silk', 'Fit': 'Regular', 'Pattern': 'Solid', 'Occasion': 'Festive' } },
            { name: 'Kids\' Lehenga Choli - Pink', category: 'Kids Wear', mrp: 1400, sell: 950, specs: { 'Fabric': 'Net + Satin', 'Age Group': '5-8 Years', 'Set': 'Lehenga + Choli + Dupatta', 'Work': 'Sequin' } },
        ];

        const customerFirstNames = ['Priya', 'Rahul', 'Sneha', 'Amit', 'Neha', 'Vikram', 'Anita', 'Suresh', 'Kavita', 'Rohit', 'Meera', 'Arjun', 'Pooja', 'Deepak', 'Ritu', 'Manoj', 'Swati', 'Ajay', 'Divya', 'Sanjay', 'Lakshmi', 'Kiran', 'Rekha', 'Nitin', 'Asha', 'Gaurav', 'Sunita', 'Pankaj', 'Monika', 'Rajesh'];
        const customerLastNames = ['Sharma', 'Patel', 'Singh', 'Gupta', 'Verma', 'Reddy', 'Kumar', 'Joshi', 'Mehta', 'Agarwal', 'Nair', 'Iyer', 'Rao', 'Das', 'Bhat'];
        const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Jaipur', 'Lucknow', 'Kolkata', 'Chennai', 'Ahmedabad'];
        const paymentMethods = ['UPI', 'Cash on Delivery', 'Credit Card', 'Debit Card', 'Net Banking'];
        const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'delivered', 'delivered', 'cancelled'];

        /* Generate Products */
        const products = productNames.map((p, i) => {
            const discount = Math.round(((p.mrp - p.sell) / p.mrp) * 100);
            return {
                id: this._uuid(),
                sku: this._shortId(),
                name: p.name,
                category: p.category,
                mrp: p.mrp,
                sellingPrice: p.sell,
                discount: discount,
                description: `Premium quality ${p.category.toLowerCase()} product. Crafted with care using the finest ${p.specs.Fabric || p.specs.Material || 'materials'}. Perfect for any occasion.`,
                specifications: p.specs,
                stock: this._randomInt(0, 80),
                confidence: parseFloat((0.78 + Math.random() * 0.2).toFixed(2)),
                status: i < 22 ? 'active' : 'draft',
                reasoning: `Identity verified with ${this._randomInt(82, 98)}% visual confidence. MRP cross-referenced across ${this._randomInt(2, 4)} web sources.`,
                createdAt: this._randomDate(60),
                updatedAt: this._randomDate(15),
            };
        });
        /* Ensure some are low/out of stock */
        products[3].stock = 5;
        products[7].stock = 2;
        products[11].stock = 0;
        products[15].stock = 8;
        products[19].stock = 0;
        products[22].stock = 3;
        this._set('products', products);

        /* Generate Customers */
        const customers = [];
        for (let i = 0; i < 30; i++) {
            const first = this._randomFromArray(customerFirstNames);
            const last = this._randomFromArray(customerLastNames);
            const favCats = [...new Set(Array.from({ length: 2 }, () => this._randomFromArray(products).category))];
            customers.push({
                id: this._uuid(),
                name: `${first} ${last}`,
                email: `${first.toLowerCase()}.${last.toLowerCase()}@email.com`,
                phone: `+91 ${this._randomInt(70000, 99999)}${this._randomInt(10000, 99999)}`,
                city: this._randomFromArray(cities),
                totalOrders: 0,
                lifetimeValue: 0,
                favoriteCategory: favCats[0],
                aiScore: parseFloat((0.4 + Math.random() * 0.55).toFixed(2)),
                lastOrderDate: this._randomDate(30),
                createdAt: this._randomDate(90),
            });
        }
        this._set('customers', customers);

        /* Generate Orders */
        const orders = [];
        for (let i = 0; i < 40; i++) {
            const customer = this._randomFromArray(customers);
            const numItems = this._randomInt(1, 3);
            const items = [];
            for (let j = 0; j < numItems; j++) {
                const prod = this._randomFromArray(products);
                items.push({
                    productId: prod.id,
                    name: prod.name,
                    category: prod.category,
                    price: prod.sellingPrice,
                    qty: this._randomInt(1, 2),
                });
            }
            const amount = items.reduce((s, item) => s + item.price * item.qty, 0);
            const status = this._randomFromArray(orderStatuses);
            const createdAt = this._randomDate(45);
            const deliveryDate = new Date(createdAt);
            deliveryDate.setDate(deliveryDate.getDate() + this._randomInt(2, 7));

            orders.push({
                id: this._uuid(),
                orderId: 'ORD-' + String(1000 + i),
                customerId: customer.id,
                customerName: customer.name,
                customerEmail: customer.email,
                customerCity: customer.city,
                items,
                amount,
                status,
                paymentMethod: this._randomFromArray(paymentMethods),
                deliveryDate: deliveryDate.toISOString(),
                createdAt,
            });

            /* Update customer stats */
            customer.totalOrders++;
            customer.lifetimeValue += amount;
        }
        this._set('orders', orders);
        this._set('customers', customers);

        /* Generate Notifications */
        const notificationTemplates = [
            { type: 'order', title: 'New Order Received', desc: 'Order #ORD-1042 has been placed by Priya Sharma for ₹3,200', icon: 'order' },
            { type: 'order', title: 'Order Shipped', desc: 'Order #ORD-1038 has been shipped via BlueDart', icon: 'order' },
            { type: 'inventory', title: 'Low Stock Alert', desc: 'Embroidered Anarkali Kurti is running low (2 units left)', icon: 'inventory' },
            { type: 'inventory', title: 'Out of Stock', desc: 'Brocade Blouse Piece - Golden is now out of stock', icon: 'inventory' },
            { type: 'ai', title: 'AI Suggestion', desc: 'Consider restocking Cotton Sarees — demand increased 18% this week', icon: 'ai' },
            { type: 'ai', title: 'Bundle Opportunity', desc: 'Customers who buy Sarees often buy Blouse Pieces. Create a bundle?', icon: 'ai' },
            { type: 'ai', title: 'Trending Alert', desc: 'Kanjivaram Silk Sarees are trending in your area. Current stock: 45 units', icon: 'ai' },
            { type: 'success', title: 'Product Published', desc: 'Linen Saree - Mustard Yellow has been published to your catalog', icon: 'success' },
            { type: 'success', title: 'Campaign Ready', desc: 'Your weekend sale campaign is ready to launch with 8 featured products', icon: 'success' },
            { type: 'order', title: 'Order Delivered', desc: 'Order #ORD-1035 has been delivered successfully to Amit Gupta', icon: 'order' },
            { type: 'ai', title: 'Dead Stock Detected', desc: '3 products haven\'t sold in 30 days. Consider clearance pricing.', icon: 'ai' },
            { type: 'inventory', title: 'Restock Reminder', desc: 'Printed Dupatta - Phulkari Work stock below reorder point', icon: 'inventory' },
        ];

        const notifications = notificationTemplates.map((n, i) => ({
            id: this._uuid(),
            ...n,
            read: i > 4,
            createdAt: this._randomDate(7),
        }));
        notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        this._set('notifications', notifications);

        this._set('mock_generated', true);
    },

    /* ============================================
       RESET
       ============================================ */
    resetAll() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(this._prefix));
        keys.forEach(k => localStorage.removeItem(k));
    },

    resetMockData() {
        localStorage.removeItem(this._prefix + 'mock_generated');
        localStorage.removeItem(this._prefix + 'products');
        localStorage.removeItem(this._prefix + 'orders');
        localStorage.removeItem(this._prefix + 'customers');
        localStorage.removeItem(this._prefix + 'notifications');
        this.generateMockData();
    }
};

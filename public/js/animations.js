/* ============================================
   KALPA AI — Animations Module
   Toasts, Skeletons, Count-up, AI Pipeline
   ============================================ */

const KalpaAnimations = {

    /* ============================================
       TOAST NOTIFICATIONS
       ============================================ */
    _toastContainer: null,

    _ensureToastContainer() {
        if (!this._toastContainer) {
            this._toastContainer = document.createElement('div');
            this._toastContainer.className = 'toast-container';
            this._toastContainer.id = 'toast-container';
            document.body.appendChild(this._toastContainer);
        }
        return this._toastContainer;
    },

    _toastIcons: {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>',
    },

    showToast(title, message, type = 'info', duration = 4000) {
        const container = this._ensureToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${this._toastIcons[type] || this._toastIcons.info}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close" onclick="this.closest('.toast').remove()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        `;
        container.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => {
                toast.classList.add('removing');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    },

    /* ============================================
       SKELETON LOADERS
       ============================================ */
    showSkeleton(container, type = 'card', count = 1) {
        let html = '';
        for (let i = 0; i < count; i++) {
            switch (type) {
                case 'stat-card':
                    html += `
                        <div class="skeleton-card">
                            <div class="skeleton skeleton-icon"></div>
                            <div class="skeleton skeleton-text short"></div>
                            <div class="skeleton skeleton-text lg" style="width:40%"></div>
                        </div>`;
                    break;
                case 'table-row':
                    html += `
                        <div class="skeleton-table-row">
                            <div class="skeleton skeleton-avatar"></div>
                            <div class="skeleton skeleton-cell"></div>
                            <div class="skeleton skeleton-cell-sm"></div>
                            <div class="skeleton skeleton-cell-sm"></div>
                            <div class="skeleton skeleton-cell-sm"></div>
                        </div>`;
                    break;
                case 'card':
                default:
                    html += `
                        <div class="skeleton-card">
                            <div class="skeleton skeleton-heading"></div>
                            <div class="skeleton skeleton-text"></div>
                            <div class="skeleton skeleton-text medium"></div>
                            <div class="skeleton skeleton-text short"></div>
                        </div>`;
                    break;
            }
        }
        container.innerHTML = html;
    },

    hideSkeleton(container) {
        container.querySelectorAll('.skeleton-card, .skeleton-table-row').forEach(el => el.remove());
    },

    /* ============================================
       NUMBER COUNT-UP ANIMATION
       ============================================ */
    animateCounter(element, target, duration = 1200, prefix = '', suffix = '') {
        const startTime = performance.now();
        const startVal = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            /* Ease out cubic */
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(startVal + (target - startVal) * eased);

            element.textContent = prefix + currentVal.toLocaleString('en-IN') + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = prefix + target.toLocaleString('en-IN') + suffix;
            }
        }

        requestAnimationFrame(update);
    },

    /* ============================================
       AI PIPELINE ANIMATION
       ============================================ */
    _pipelineCheckIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    _pipelineSpinnerIcon: '<div class="spinner spinner-sm"></div>',
    _pipelineCircleIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/></svg>',
    _pipelineErrorIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',

    /**
     * Show AI pipeline animation
     * @param {HTMLElement} container - Container element
     * @param {Array} steps - Array of { title, description } objects
     * @returns {Object} Controller with advance() and error() methods
     */
    showAIPipeline(container, steps) {
        let currentStep = 0;

        const html = `
            <div class="ai-pipeline" id="ai-pipeline">
                ${steps.map((step, i) => `
                    <div class="ai-pipeline-step ${i === 0 ? 'active' : 'pending'}" data-step="${i}">
                        <div class="ai-pipeline-dot">
                            ${i === 0 ? this._pipelineSpinnerIcon : this._pipelineCircleIcon}
                        </div>
                        <div class="ai-pipeline-info">
                            <div class="ai-pipeline-title">${step.title}</div>
                            <div class="ai-pipeline-desc">${i === 0 ? step.description : 'Waiting...'}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = html;

        const controller = {
            advance: () => {
                const pipeline = container.querySelector('.ai-pipeline');
                if (!pipeline || currentStep >= steps.length) return;

                /* Complete current step */
                const current = pipeline.querySelector(`[data-step="${currentStep}"]`);
                if (current) {
                    current.classList.remove('active');
                    current.classList.add('completed');
                    current.querySelector('.ai-pipeline-dot').innerHTML = KalpaAnimations._pipelineCheckIcon;
                    current.querySelector('.ai-pipeline-desc').textContent = 'Complete';
                }

                currentStep++;

                /* Activate next step */
                if (currentStep < steps.length) {
                    const next = pipeline.querySelector(`[data-step="${currentStep}"]`);
                    if (next) {
                        next.classList.remove('pending');
                        next.classList.add('active');
                        next.querySelector('.ai-pipeline-dot').innerHTML = KalpaAnimations._pipelineSpinnerIcon;
                        next.querySelector('.ai-pipeline-desc').textContent = steps[currentStep].description;
                    }
                }
            },

            complete: () => {
                /* Complete all remaining steps */
                while (currentStep < steps.length) {
                    controller.advance();
                }
            },

            error: (stepIndex) => {
                const pipeline = container.querySelector('.ai-pipeline');
                if (!pipeline) return;
                const step = pipeline.querySelector(`[data-step="${stepIndex || currentStep}"]`);
                if (step) {
                    step.classList.remove('active', 'pending');
                    step.classList.add('error');
                    step.querySelector('.ai-pipeline-dot').innerHTML = KalpaAnimations._pipelineErrorIcon;
                    step.querySelector('.ai-pipeline-desc').textContent = 'Failed';
                }
            },

            getCurrentStep: () => currentStep,
        };

        return controller;
    },

    /* ============================================
       CONFETTI
       ============================================ */
    showConfetti(duration = 3000) {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const colors = ['#2563EB', '#16A34A', '#D97706', '#DC2626', '#7C3AED', '#0EA5E9'];
        const shapes = ['square', 'circle'];

        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = Math.random() * 1 + 's';
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            if (shapes[Math.floor(Math.random() * shapes.length)] === 'circle') {
                piece.style.borderRadius = '50%';
            }
            container.appendChild(piece);
        }

        setTimeout(() => container.remove(), duration);
    },

    /* ============================================
       PAGE LOADER
       ============================================ */
    showPageLoader(message = 'Loading...') {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="spinner spinner-lg"></div>
            <div class="page-loader-text">${message}</div>
        `;
        document.body.appendChild(loader);
    },

    hidePageLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    },

    /* ============================================
       BUTTON LOADING STATE
       ============================================ */
    setButtonLoading(button, loading, originalText) {
        if (loading) {
            button._originalText = button.innerHTML;
            button.disabled = true;
            button.innerHTML = `<div class="spinner spinner-sm spinner-white"></div> Processing...`;
        } else {
            button.disabled = false;
            button.innerHTML = originalText || button._originalText || 'Submit';
        }
    },

    /* ============================================
       SUCCESS CHECKMARK SVG
       ============================================ */
    getSuccessCheckmarkSVG() {
        return `
            <svg class="success-checkmark" viewBox="0 0 52 52">
                <circle class="circle" cx="26" cy="26" r="25"/>
                <path class="check" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
        `;
    },

    /* ============================================
       STAGGER ANIMATION HELPER
       ============================================ */
    staggerElements(container) {
        container.classList.add('stagger-children');
    },
};

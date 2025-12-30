export const UI = {
    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) overlay.classList.remove('hidden');
        else overlay.classList.add('hidden');
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');

        const bgClass = type === 'error' ? 'bg-red-600' : 'bg-gray-800';

        toast.className = `${bgClass} text-white px-6 py-4 rounded-xl shadow-2xl font-bold text-sm mb-3 slide-down flex items-center gap-3`;
        toast.innerHTML = `<span>${message}</span>`;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    updateStatus(isOnline) {
        const el = document.getElementById('status-indicator');
        if (isOnline) {
            el.innerHTML = '<span class="w-2 h-2 rounded-full bg-green-500"></span> Online';
            el.className = 'flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase';
        } else {
            el.innerHTML = '<span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Offline';
            el.className = 'flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase';
        }
    }
};
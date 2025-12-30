import { API } from './services/api.js';
import { Store } from './state/store.js';
import { UI } from './components/ui.js';
import { renderInventory } from './components/inventory.js';
import { renderAddForm } from './components/form.js';
import { renderDetails, renderModal } from './components/details.js';

class AppController {
    constructor() {
        this.appRoot = document.getElementById('app-root');
        this.init();
    }

    async init() {
        UI.showLoading(true);
        const data = await API.get('/products');
        UI.showLoading(false);

        if (data) {
            Store.setProducts(data);
            UI.updateStatus(true);
            this.router('inventory');
        } else {
            UI.updateStatus(false);
            UI.showToast('No se pudo conectar al servidor', 'error');
            this.router('inventory');
        }

        lucide.createIcons();
    }

    router(view) {
        Store.state.currentView = view;
        let html = '';

        switch (view) {
            case 'inventory':
                html = renderInventory();
                break;
            case 'add':
                html = renderAddForm();
                break;
            case 'details':
                html = renderDetails();
                break;
            default:
                html = renderInventory();
        }

        this.appRoot.innerHTML = html;
        lucide.createIcons();
        window.scrollTo(0, 0);
    }

    navigate(view) {
        this.router(view);
    }

    handleSearch(term) {
        Store.setFilter(term);
        this.router('inventory');
        const input = document.querySelector('input[type="text"]');
        if (input) {
            input.focus();
            input.value = term;
        }
    }

    selectProduct(id) {
        Store.selectProduct(id);
        this.router('details');
    }

    async handleCreate(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const payload = {
            code: formData.get('code'),
            name: formData.get('name'),
            category: formData.get('category'),
            unit: formData.get('unit'),
            stock: parseInt(formData.get('stock')),
            minStock: parseInt(formData.get('minStock'))
        };

        UI.showLoading(true);
        const result = await API.post('/products', payload);

        if (result) {
            const allProducts = await API.get('/products');
            Store.setProducts(allProducts);

            UI.showToast('Producto creado correctamente');
            this.router('inventory');
        }
        UI.showLoading(false);
    }

    openModal(type) {
        const modalHtml = renderModal(type, Store.state.selectedProduct?.name);
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        lucide.createIcons();
    }

    adjustQty(delta) {
        const input = document.getElementById('mov-qty');
        if (input) {
            let val = parseInt(input.value) || 0;
            input.value = Math.max(1, val + delta);
        }
    }

    async handleTransaction(event, type) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const qty = parseInt(formData.get('quantity'));
        const reason = formData.get('reason');
        const product = Store.state.selectedProduct;

        if (type === 'OUT' && product.stock < qty) {
            UI.showToast('Stock insuficiente', 'error');
            return;
        }

        UI.showLoading(true);
        const query = new URLSearchParams({ type, qty, reason }).toString();
        const result = await API.put(`/products/${product.id}/movement?${query}`);

        UI.showLoading(false);

        if (result) {
            document.getElementById('transaction-modal').remove();

            Store.updateProductInList(result);

            UI.showToast(`Transacción exitosa (${type})`);
            this.router('details');
        }
    }
}

window.App = new AppController();
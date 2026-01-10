import { API } from './services/api.js';
import { Store } from './state/store.js';
import { UI } from './components/ui.js';
import { renderInventory, generateProductCards } from './components/inventory.js';
import { renderAddForm } from './components/form.js';
import { renderDetails, renderModal, renderMovementsList } from './components/details.js';
import { renderGlobalMovements } from './components/movements.js';

class AppController {
    constructor() {
        this.appRoot = document.getElementById('app-root');
        this.searchTimeout = null;
        this.cachedPersonnel = [];
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

    async router(view) {
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
            case 'movements':
                this.appRoot.innerHTML = '<div class="min-h-screen flex items-center justify-center"><div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div></div>';
                const movementsData = await API.get('/reports/movements-data');
                html = renderGlobalMovements(movementsData);
                break;
            default:
                html = renderInventory();
        }

        if (view !== 'movements') {
            this.appRoot.innerHTML = html;
        } else {
            this.appRoot.innerHTML = html;
        }

        lucide.createIcons();
        window.scrollTo(0, 0);

        if (view === 'details' && Store.state.selectedProduct) {
            this.loadMovements(Store.state.selectedProduct.id);
        }

        if (view === 'inventory' && Store.state.filterTerm) {
            const input = document.getElementById('search-input');
            if (input) {
                input.value = Store.state.filterTerm;
                input.focus();
            }
        }
    }

    async loadMovements(productId) {
        const container = document.getElementById('movements-container');
        if (!container) return;

        container.innerHTML = '<div class="text-center py-4"><div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto"></div></div>';

        const movements = await API.get(`/products/${productId}/movements`);

        if (movements) {
            container.innerHTML = renderMovementsList(movements);
            lucide.createIcons();
        } else {
            container.innerHTML = '<p class="text-center text-gray-400 text-sm py-4">No se pudo cargar el historial.</p>';
        }
    }

    navigate(view) {
        this.router(view);
    }

    handleSearch(term) {
        Store.setFilter(term);
        const filteredItems = Store.getProducts();
        const listHtml = generateProductCards(filteredItems);
        const container = document.getElementById('product-list-container');
        if (container) {
            container.innerHTML = listHtml;
            lucide.createIcons();
        } else {
            this.router('inventory');
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

    async handlePersonnelSearch(input) {
        const query = input.value;
        const datalist = document.getElementById('personnel-suggestions');

        const selectedPerson = this.cachedPersonnel.find(p => p.name === query);
        if (selectedPerson) {
            const roleInput = document.getElementById('receiver-role');
            if (roleInput && !roleInput.value) {
                roleInput.value = selectedPerson.role;
                roleInput.classList.add('bg-blue-50', 'text-blue-700');
                setTimeout(() => roleInput.classList.remove('bg-blue-50', 'text-blue-700'), 1000);
            }
            return;
        }

        if (query.length < 2) return;

        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(async () => {
            const results = await API.get(`/personnel/search?query=${query}`);

            if (results) {
                this.cachedPersonnel = results;
                datalist.innerHTML = results.map(person =>
                    `<option value="${person.name}">${person.role}</option>`
                ).join('');
            }
        }, 300);
    }

    async handleTransaction(event, type) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const product = Store.state.selectedProduct;
        const qty = parseInt(formData.get('quantity'));

        if (type === 'OUT') {
            if (product.stock < qty) {
                UI.showToast('Stock insuficiente', 'error');
                return;
            }
            const role = formData.get('receiverRole');
            if (!role || role.trim() === '') {
                UI.showToast('El cargo es obligatorio para salidas', 'error');
                return;
            }
        }

        const payload = {
            type: type,
            quantity: qty,
            reason: formData.get('reason'),
            receiverName: formData.get('receiverName') || null,
            receiverRole: formData.get('receiverRole') || null
        };

        UI.showLoading(true);

        const result = await API.post(`/products/${product.id}/movement`, payload);

        UI.showLoading(false);

        if (result) {
            const modal = document.getElementById('transaction-modal');
            if (modal) modal.remove();

            Store.updateProductInList(result);
            UI.showToast(`Transacción exitosa (${type})`);

            this.router('details');
        }
    }

    async downloadExcel() {
        UI.showLoading(true);
        try {
            const productsData = await API.get('/reports/excel-data');
            const movementsData = await API.get('/reports/movements-data');

            if ((!productsData || productsData.length === 0) && (!movementsData || movementsData.length === 0)) {
                UI.showToast('No hay datos para exportar', 'error');
                UI.showLoading(false);
                return;
            }

            const workbook = XLSX.utils.book_new();

            if (productsData && productsData.length > 0) {
                const niceProducts = productsData.map(p => ({
                    "Código": p.codigoBarras,
                    "Producto": p.producto,
                    "Categoría": p.categoria,
                    "Unidad": p.unidad,
                    "Stock Actual": p.cantidadActual,
                    "Estado": p.estadoInventario,
                    "Última Actualización": p.fechaUltimoMovimiento
                }));
                const worksheet1 = XLSX.utils.json_to_sheet(niceProducts);

                const wscols1 = [{ wch: 10 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 20 }];
                worksheet1['!cols'] = wscols1;

                XLSX.utils.book_append_sheet(workbook, worksheet1, "Inventario Actual");
            }

            if (movementsData && movementsData.length > 0) {
                const niceMovements = movementsData.map(m => ({
                    "Fecha": m.fechaHora,
                    "Tipo": m.tipoMovimiento,
                    "Cód. Producto": m.codigoProducto,
                    "Producto": m.nombreProducto,
                    "Cantidad": m.cantidad,
                    "Motivo": m.motivo,
                    "Responsable": m.responsableNombre,
                    "Cargo": m.responsableCargo
                }));
                const worksheet2 = XLSX.utils.json_to_sheet(niceMovements);

                const wscols2 = [{ wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 25 }, { wch: 8 }, { wch: 25 }, { wch: 20 }, { wch: 20 }];
                worksheet2['!cols'] = wscols2;

                XLSX.utils.book_append_sheet(workbook, worksheet2, "Historial Movimientos");
            }

            const date = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(workbook, `Reporte_Kardex_${date}.xlsx`);

            UI.showToast('Reporte Excel generado correctamente');

        } catch (error) {
            console.error("Error generando Excel:", error);
            UI.showToast('Error al generar reporte', 'error');
        }
        UI.showLoading(false);
    }
}

window.App = new AppController();
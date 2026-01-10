import { Store } from '../state/store.js';

export function renderInventory() {
    const products = Store.getProducts();
    const productCards = generateProductCards(products);

    return `
        <div class="w-full space-y-6 slide-up">
            <!-- Header -->
            <header class="flex justify-between items-center py-2">
                <div class="flex items-center gap-3">
                    <img src="images/Logo_STKH.png" alt="Logo" class="h-10 w-auto object-contain">
                    <div>
                        <h1 class="text-xl font-black text-gray-900 leading-none tracking-tight">KARDEX</h1>
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gestión de Inventario</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="window.App.downloadExcel()" class="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors relative group border border-green-100">
                        <i data-lucide="file-spreadsheet" class="w-6 h-6"></i>
                        <span class="absolute -bottom-8 right-0 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Reporte Excel</span>
                    </button>
                    <!-- NUEVO BOTÓN: Ver Historial Completo -->
                    <button onclick="window.App.navigate('movements')" class="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors relative group border border-blue-100">
                        <i data-lucide="history" class="w-6 h-6"></i>
                         <span class="absolute -bottom-8 right-0 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Ver Movimientos</span>
                    </button>
                </div>
            </header>

            <!-- Buscador y Filtros -->
            <div class="sticky top-2 z-30">
                <div class="relative shadow-lg shadow-blue-100/50 rounded-2xl">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i data-lucide="search" class="h-5 w-5 text-gray-400"></i>
                    </div>
                    <input type="text" 
                           id="search-input"
                           class="block w-full pl-11 pr-4 py-4 bg-white border-0 ring-1 ring-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" 
                           placeholder="Buscar por código, nombre o categoría..." 
                           oninput="window.App.handleSearch(this.value)">
                </div>
            </div>

            <!-- Stats Rápidos -->
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <span class="text-[10px] font-bold text-gray-400 uppercase">Total Productos</span>
                    <p class="text-2xl font-black text-gray-800 mt-1">${products.length}</p>
                </div>
                <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <span class="text-[10px] font-bold text-gray-400 uppercase">Alertas Stock</span>
                    <p class="text-2xl font-black text-red-500 mt-1">${products.filter(p => p.status === 'LOW_STOCK').length}</p>
                </div>
            </div>

            <!-- Lista de Productos -->
            <div id="product-list-container" class="pb-24 space-y-3">
                ${productCards}
            </div>

            <!-- FAB: Agregar Producto -->
            <button onclick="window.App.navigate('add')" class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-500/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40">
                <i data-lucide="plus" class="w-8 h-8"></i>
            </button>
        </div>
    `;
}

export function generateProductCards(items) {
    if (items.length === 0) {
        return `
            <div class="text-center py-10 opacity-60">
                <i data-lucide="package-open" class="w-12 h-12 mx-auto mb-3 text-gray-300"></i>
                <p class="text-sm text-gray-500 font-medium">No se encontraron productos</p>
            </div>
        `;
    }

    return items.map(p => `
        <div onclick="window.App.selectProduct(${p.id})" class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm active:scale-[0.99] transition-transform cursor-pointer flex items-center gap-4 relative overflow-hidden group">
            <div class="absolute left-0 top-0 bottom-0 w-1 ${p.status === 'LOW_STOCK' ? 'bg-red-500' : 'bg-green-500'}"></div>
            
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-1">
                    <span class="text-[10px] font-bold text-gray-400 tracking-wider bg-gray-50 px-2 py-0.5 rounded">${p.code}</span>
                    ${p.status === 'LOW_STOCK' ? '<span class="flex h-2 w-2 rounded-full bg-red-500"></span>' : ''}
                </div>
                <h3 class="text-base font-bold text-gray-800 truncate leading-tight mb-1">${p.name}</h3>
                <p class="text-xs text-gray-500 truncate">${p.category}</p>
            </div>

            <div class="text-right pl-2 border-l border-gray-50">
                <span class="block text-2xl font-black ${p.status === 'LOW_STOCK' ? 'text-red-600' : 'text-gray-800'} tracking-tight">${p.stock}</span>
                <span class="text-[10px] font-bold text-gray-400 uppercase">${p.unit}</span>
            </div>
        </div>
    `).join('');
}
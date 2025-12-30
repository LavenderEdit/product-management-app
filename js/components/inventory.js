import { Store } from '../state/store.js';

export function renderInventory() {
    const items = Store.getProducts();
    const totalStock = items.reduce((sum, item) => sum + item.stock, 0);

    return `
        <div class="space-y-4 fade-in pb-20">
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-200">
                    <p class="text-blue-100 text-xs font-bold uppercase">Productos</p>
                    <p class="text-3xl font-bold tracking-tight">${items.length}</p>
                </div>
                <div class="bg-indigo-600 rounded-xl p-4 text-white shadow-lg shadow-indigo-200">
                    <p class="text-indigo-100 text-xs font-bold uppercase">Unidades</p>
                    <p class="text-3xl font-bold tracking-tight">${totalStock}</p>
                </div>
            </div>

            <!-- Buscador -->
            <div class="sticky top-0 bg-gray-50 pt-2 pb-2 z-10">
                <div class="relative">
                    <span class="absolute left-3 top-3.5 text-gray-400"><i data-lucide="search" class="w-5 h-5"></i></span>
                    <input type="text" 
                        value="${Store.state.filterTerm}"
                        placeholder="Buscar producto..." 
                        class="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        onkeyup="window.App.handleSearch(this.value)">
                </div>
            </div>

            <!-- Lista -->
            <div class="grid gap-3">
                ${items.length === 0 ? `
                    <div class="text-center py-12 opacity-50">
                        <i data-lucide="package-open" class="w-12 h-12 mx-auto mb-2 text-gray-400"></i>
                        <p>No hay resultados</p>
                    </div>
                ` : items.map(item => `
                    <div onclick="window.App.selectProduct(${item.id})" 
                         class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer group hover:border-blue-300">
                        <div class="absolute left-0 top-0 bottom-0 w-1.5 ${item.stock <= item.minStock ? 'bg-red-500' : 'bg-green-500'}"></div>
                        <div class="flex justify-between pl-3">
                            <div class="flex-1 pr-2">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono tracking-tight">${item.code}</span>
                                    <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wide bg-blue-50 px-1.5 py-0.5 rounded">${item.category || 'General'}</span>
                                </div>
                                <h3 class="font-bold text-gray-800 leading-snug group-hover:text-blue-700">${item.name}</h3>
                                <p class="text-xs text-gray-400 mt-1">Unidad: ${item.unit}</p>
                            </div>
                            <div class="text-right flex flex-col justify-center">
                                <span class="text-2xl font-black ${item.stock <= item.minStock ? 'text-red-600' : 'text-slate-800'}">${item.stock}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- FAB Button -->
            <button onclick="window.App.navigate('add')" class="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl shadow-blue-500/40 hover:bg-blue-700 active:scale-90 transition-all z-20">
                <i data-lucide="plus" class="w-7 h-7"></i>
            </button>
        </div>
    `;
}
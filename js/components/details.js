import { Store } from '../state/store.js';

export function renderDetails() {
    const p = Store.state.selectedProduct;
    if (!p) return '';

    return `
        <div class="space-y-6 slide-up pb-20">
            <!-- Header -->
            <div class="flex justify-between items-center">
                <button onclick="window.App.navigate('inventory')" class="flex items-center text-gray-600 font-bold gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i> Regresar
                </button>
                <div class="text-right">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">ID SISTEMA</span>
                    <p class="text-xs font-mono font-bold text-gray-600">#${p.id}</p>
                </div>
            </div>

            <!-- Card Principal -->
            <div class="bg-white rounded-2xl shadow-xl shadow-gray-100 overflow-hidden text-center p-8 border border-gray-100 relative">
                <div class="absolute top-4 right-4">
                     <span class="text-[10px] font-bold px-3 py-1.5 rounded-full ${p.status === 'LOW_STOCK' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-100 text-green-600'}">
                        ${p.status === 'LOW_STOCK' ? 'STOCK BAJO' : 'ESTABLE'}
                    </span>
                </div>
                
                <span class="font-mono text-xs bg-gray-100 px-3 py-1 rounded text-gray-500 tracking-wider">${p.code}</span>
                <h1 class="text-2xl font-bold mt-4 mb-2 leading-tight text-gray-800">${p.name}</h1>
                <p class="text-sm text-gray-400 uppercase tracking-wide font-bold mb-6">${p.category}</p>
                
                <div class="text-7xl font-black text-gray-800 tracking-tighter mb-2 transition-all" id="stock-display">${p.stock}</div>
                <p class="text-sm text-gray-400">Unidades Disponibles (${p.unit})</p>
            </div>

            <!-- Botones de Acción -->
            <div class="grid grid-cols-2 gap-4">
                <button onclick="window.App.openModal('IN')" class="group flex flex-col items-center p-6 bg-green-50 text-green-700 rounded-2xl border-2 border-green-100 hover:bg-green-100 active:scale-[0.98] transition-all cursor-pointer shadow-sm">
                    <div class="bg-green-500 text-white p-3 rounded-full mb-3 shadow-lg group-hover:scale-110 transition-transform"><i data-lucide="plus" class="w-8 h-8"></i></div>
                    <span class="font-black tracking-wide">ENTRADA</span>
                </button>
                <button onclick="window.App.openModal('OUT')" class="group flex flex-col items-center p-6 bg-red-50 text-red-700 rounded-2xl border-2 border-red-100 hover:bg-red-100 active:scale-[0.98] transition-all cursor-pointer shadow-sm">
                    <div class="bg-red-500 text-white p-3 rounded-full mb-3 shadow-lg group-hover:scale-110 transition-transform"><i data-lucide="minus" class="w-8 h-8"></i></div>
                    <span class="font-black tracking-wide">SALIDA</span>
                </button>
            </div>

            <!-- Info Footer -->
            <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <i data-lucide="info" class="w-5 h-5 text-blue-500 mt-0.5"></i>
                <div>
                    <h4 class="font-bold text-blue-800 text-sm">Información de Inventario</h4>
                    <p class="text-xs text-blue-600 mt-1">El stock mínimo es de <b>${p.minStock}</b>. Última actualización: ${p.lastUpdated ? new Date(p.lastUpdated).toLocaleDateString() : 'Hoy'}.</p>
                </div>
            </div>
        </div>
    `;
}

export function renderModal(type, productName) {
    const isEntry = type === 'IN';
    const color = isEntry ? 'green' : 'red';

    return `
        <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/60 backdrop-blur-sm fade-in" id="transaction-modal">
            <div class="bg-white w-full max-w-md p-6 rounded-t-3xl sm:rounded-2xl slide-up shadow-2xl relative">
                
                <button onclick="document.getElementById('transaction-modal').remove()" class="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <i data-lucide="x" class="w-5 h-5 text-gray-600"></i>
                </button>

                <h3 class="text-xl font-black text-gray-800 mb-6">${isEntry ? 'Registrar Entrada' : 'Registrar Salida'}</h3>
                
                <form onsubmit="window.App.handleTransaction(event, '${type}')" class="space-y-6">
                    <div>
                         <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Cantidad a ${isEntry ? 'ingresar' : 'retirar'}</label>
                        <div class="flex items-center gap-3">
                            <button type="button" onclick="window.App.adjustQty(-1)" class="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 font-bold text-xl transition-colors">-</button>
                            <input type="number" id="mov-qty" name="quantity" required min="1" value="1" class="flex-1 h-12 text-center text-2xl font-black bg-gray-50 rounded-xl border-2 border-transparent focus:border-${color}-500 outline-none transition-all">
                            <button type="button" onclick="window.App.adjustQty(1)" class="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 font-bold text-xl transition-colors">+</button>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Motivo</label>
                        <input type="text" name="reason" value="${isEntry ? 'Compra / Reposición' : 'Consumo Interno'}" class="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 font-medium focus:border-${color}-500 outline-none transition-all">
                    </div>

                    <button type="submit" class="w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-${color}-200 mt-2 bg-${color}-600 hover:bg-${color}-700 active:scale-[0.98] transition-all text-lg">
                        CONFIRMAR
                    </button>
                </form>
            </div>
        </div>
    `;
}
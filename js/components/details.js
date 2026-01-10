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

            <!-- NUEVA SECCIÓN: Historial de Movimientos -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 class="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <i data-lucide="history" class="w-4 h-4 text-gray-400"></i> Historial Reciente
                    </h3>
                </div>
                <!-- Aquí se inyectará la lista vía JavaScript -->
                <div id="movements-container">
                    <div class="p-6 text-center text-gray-400 text-xs">Cargando movimientos...</div>
                </div>
            </div>

        </div>
    `;
}

export function renderMovementsList(movements) {
    if (!movements || movements.length === 0) {
        return `
            <div class="text-center py-8 opacity-50">
                <i data-lucide="calendar-off" class="w-8 h-8 mx-auto mb-2 text-gray-300"></i>
                <p class="text-xs text-gray-400">Sin movimientos registrados</p>
            </div>
        `;
    }

    return movements.map(mov => {
        const isEntry = mov.type === 'IN';
        const colorClass = isEntry ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
        const icon = isEntry ? 'arrow-down-left' : 'arrow-up-right';
        const date = new Date(mov.date).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

        const personInfo = mov.receiverName
            ? `<div class="mt-1 text-[10px] text-gray-500 flex items-center gap-1">
                 <i data-lucide="user" class="w-3 h-3"></i> ${mov.receiverName} 
                 ${mov.receiverRole ? `<span class="bg-gray-100 px-1 rounded ml-1 text-gray-400 font-medium">${mov.receiverRole}</span>` : ''}
               </div>`
            : '';

        return `
            <div class="p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors flex gap-4 items-start">
                <div class="p-2 rounded-lg ${colorClass} shrink-0">
                    <i data-lucide="${icon}" class="w-5 h-5"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                        <p class="font-bold text-gray-700 text-sm truncate">${mov.reason || 'Sin motivo'}</p>
                        <span class="font-mono font-bold ${isEntry ? 'text-green-600' : 'text-red-600'} text-sm whitespace-nowrap">
                            ${isEntry ? '+' : '-'}${mov.quantity}
                        </span>
                    </div>
                    <p class="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wide">${date}</p>
                    ${personInfo}
                </div>
            </div>
        `;
    }).join('');
}

export function renderModal(type, productName) {
    const isEntry = type === 'IN';
    const color = isEntry ? 'green' : 'red';
    const actionText = isEntry ? 'ingresar' : 'retirar';

    const personTitle = isEntry ? 'Responsable de Entrega / Proveedor' : 'Responsable del Retiro';
    const personPlaceholder = isEntry ? 'Ej: Proveedor XYZ / Juan Bodega' : 'Ej: Juan Perez';
    const rolePlaceholder = isEntry ? 'Ej: Distribuidor / Almacenero' : 'Ej: Jefe de Logística';

    const requiredMark = !isEntry ? '<span class="text-red-500">*</span>' : '<span class="text-gray-400 font-normal text-[10px]">(Opcional)</span>';

    return `
        <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/60 backdrop-blur-sm fade-in" id="transaction-modal">
            <div class="bg-white w-full max-w-md p-6 rounded-t-3xl sm:rounded-2xl slide-up shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
                
                <button onclick="document.getElementById('transaction-modal').remove()" class="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <i data-lucide="x" class="w-5 h-5 text-gray-600"></i>
                </button>

                <h3 class="text-xl font-black text-gray-800 mb-1">${isEntry ? 'Registrar Entrada' : 'Registrar Salida'}</h3>
                <p class="text-sm text-gray-400 mb-6 font-medium">${productName}</p>
                
                <form onsubmit="window.App.handleTransaction(event, '${type}')" class="space-y-6">
                    
                    <!-- Cantidad -->
                    <div>
                         <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Cantidad a ${actionText}</label>
                        <div class="flex items-center gap-3">
                            <button type="button" onclick="window.App.adjustQty(-1)" class="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 font-bold text-xl transition-colors">-</button>
                            <input type="number" id="mov-qty" name="quantity" required min="1" value="1" class="flex-1 h-12 text-center text-2xl font-black bg-gray-50 rounded-xl border-2 border-transparent focus:border-${color}-500 outline-none transition-all">
                            <button type="button" onclick="window.App.adjustQty(1)" class="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 font-bold text-xl transition-colors">+</button>
                        </div>
                    </div>

                    <!-- Campos de Personal (AHORA VISIBLES PARA AMBOS) -->
                    <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide">${personTitle}</h4>
                        
                        <!-- Input con Autocompletado -->
                        <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1">Nombre</label>
                            <div class="relative">
                                <span class="absolute left-3 top-3 text-gray-400"><i data-lucide="user" class="w-4 h-4"></i></span>
                                <input type="text" 
                                    name="receiverName" 
                                    list="personnel-suggestions"
                                    oninput="window.App.handlePersonnelSearch(this)"
                                    autocomplete="off"
                                    class="w-full pl-9 p-2.5 rounded-lg border border-gray-200 text-sm font-semibold focus:border-${color}-500 outline-none transition-colors" 
                                    placeholder="${personPlaceholder}">
                                
                                <datalist id="personnel-suggestions"></datalist>
                            </div>
                        </div>

                        <!-- Input Cargo -->
                        <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1">Cargo / Puesto ${requiredMark}</label>
                            <div class="relative">
                                <span class="absolute left-3 top-3 text-gray-400"><i data-lucide="briefcase" class="w-4 h-4"></i></span>
                                <input type="text" 
                                    id="receiver-role"
                                    name="receiverRole" 
                                    class="w-full pl-9 p-2.5 rounded-lg border border-gray-200 text-sm font-semibold focus:border-${color}-500 outline-none transition-all duration-300" 
                                    placeholder="${rolePlaceholder}">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Motivo -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Motivo / Observación</label>
                        <input type="text" name="reason" value="${isEntry ? 'Compra / Reposición' : 'Consumo Interno'}" class="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 font-medium focus:border-${color}-500 outline-none transition-all">
                    </div>

                    <button type="submit" class="w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-${color}-200 mt-2 bg-${color}-600 hover:bg-${color}-700 active:scale-[0.98] transition-all text-lg">
                        CONFIRMAR ${isEntry ? 'ENTRADA' : 'SALIDA'}
                    </button>
                </form>
            </div>
        </div>
    `;
}
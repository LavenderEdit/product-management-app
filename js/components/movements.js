import { API } from '../services/api.js';

export function renderGlobalMovements(movementsData) {
    if (!movementsData || movementsData.length === 0) {
        return `
            ${renderHeader()}
            <div class="flex flex-col items-center justify-center h-[60vh] text-center p-6 opacity-50">
                <i data-lucide="clipboard-list" class="w-16 h-16 text-gray-300 mb-4"></i>
                <h3 class="text-lg font-bold text-gray-400">Sin movimientos</h3>
                <p class="text-sm text-gray-400">No se han registrado entradas ni salidas aún.</p>
            </div>
        `;
    }

    const listHtml = movementsData.map(mov => {
        const isEntry = mov.tipoMovimiento === 'ENTRADA';
        const colorClass = isEntry ? 'text-green-600 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100';
        const icon = isEntry ? 'arrow-down-left' : 'arrow-up-right';

        return `
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-start mb-3">
                <div class="p-2.5 rounded-lg ${colorClass} border shrink-0">
                    <i data-lucide="${icon}" class="w-5 h-5"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start mb-1">
                        <h4 class="font-bold text-gray-800 text-sm truncate pr-2">${mov.nombreProducto}</h4>
                        <span class="font-mono font-bold ${isEntry ? 'text-green-600' : 'text-red-600'} text-xs whitespace-nowrap px-2 py-0.5 rounded bg-gray-50">
                            ${isEntry ? '+' : '-'}${mov.cantidad}
                        </span>
                    </div>
                    
                    <p class="text-xs text-gray-500 mb-2 truncate">${mov.motivo}</p>
                    
                    <div class="flex justify-between items-end border-t border-gray-50 pt-2 mt-1">
                         <div class="flex flex-col">
                            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Responsable</span>
                            <span class="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                                ${mov.responsableNombre !== '-' ? mov.responsableNombre : '<span class="italic text-gray-300">N/A</span>'}
                            </span>
                        </div>
                        <span class="text-[10px] text-gray-400 font-medium">${mov.fechaHora}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return `
        ${renderHeader()}
        <div class="w-full slide-up pb-20">
            <div class="flex items-center justify-between mb-4 px-1">
                <h2 class="text-lg font-bold text-gray-800">Últimos Movimientos</h2>
                <span class="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100">${movementsData.length} registros</span>
            </div>
            <div class="space-y-1">
                ${listHtml}
            </div>
        </div>
    `;
}

function renderHeader() {
    return `
        <div class="flex justify-between items-center mb-6">
            <button onclick="window.App.navigate('inventory')" class="flex items-center text-gray-600 font-bold gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                <i data-lucide="arrow-left" class="w-5 h-5"></i> Volver
            </button>
            <div class="p-2 bg-gray-100 rounded-lg">
                <i data-lucide="history" class="w-6 h-6 text-gray-500"></i>
            </div>
        </div>
    `;
}
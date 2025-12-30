export function renderAddForm() {
    return `
        <div class="space-y-6 slide-up pb-20">
            <div class="flex items-center gap-3 border-b border-gray-200 pb-4">
                <button onclick="window.App.navigate('inventory')" class="p-2 -ml-2 hover:bg-gray-200 rounded-full transition-colors"><i data-lucide="arrow-left" class="w-6 h-6"></i></button>
                <h2 class="text-xl font-black text-gray-800">Nuevo Producto</h2>
            </div>

            <form onsubmit="window.App.handleCreate(event)" class="space-y-5">
                <!-- Código -->
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Código de Barras</label>
                    <div class="relative">
                        <span class="absolute left-3 top-3.5 text-gray-400"><i data-lucide="scan-barcode" class="w-5 h-5"></i></span>
                        <input name="code" required class="w-full pl-10 p-3 rounded-xl border border-gray-200 shadow-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Escanear o escribir...">
                    </div>
                </div>
                
                <!-- Nombre -->
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
                    <textarea name="name" required rows="2" class="w-full p-3 rounded-xl border border-gray-200 shadow-sm resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Nombre del producto..."></textarea>
                </div>

                <!-- Selectores -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría</label>
                        <select name="category" class="w-full p-3 rounded-xl border border-gray-200 shadow-sm bg-white focus:border-blue-500 outline-none">
                            <option value="General">General</option>
                            <option value="Oficina">Oficina</option>
                            <option value="Limpieza">Limpieza</option>
                            <option value="Tecnología">Tecnología</option>
                            <option value="Cocina">Cocina</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Unidad</label>
                        <select name="unit" class="w-full p-3 rounded-xl border border-gray-200 shadow-sm bg-white focus:border-blue-500 outline-none">
                            <option value="UND">UND</option>
                            <option value="CAJA">CAJA</option>
                            <option value="PAQ">PAQ</option>
                            <option value="KG">KG</option>
                            <option value="LT">LT</option>
                            <option value="BG">BG</option>
                        </select>
                    </div>
                </div>

                <!-- Numeros -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Inicial</label>
                        <input type="number" name="stock" value="0" min="0" class="w-full p-3 rounded-xl border border-gray-200 shadow-sm text-lg font-bold focus:border-blue-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Mínimo</label>
                        <input type="number" name="minStock" value="5" min="1" class="w-full p-3 rounded-xl border border-gray-200 shadow-sm focus:border-blue-500 outline-none">
                    </div>
                </div>

                <button type="submit" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 mt-4 hover:bg-blue-700 active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                    <i data-lucide="save" class="w-5 h-5"></i> Guardar Producto
                </button>
            </form>
        </div>
    `;
}
export const Store = {
    state: {
        products: [],
        currentView: 'inventory',
        selectedProduct: null,
        filterTerm: ''
    },

    getProducts() {
        if (!this.state.filterTerm) return this.state.products;

        const term = this.state.filterTerm.toLowerCase();
        return this.state.products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.code.toLowerCase().includes(term)
        );
    },

    setProducts(data) { this.state.products = data || []; },

    setFilter(term) { this.state.filterTerm = term; },

    selectProduct(id) {
        this.state.selectedProduct = this.state.products.find(p => p.id === id);
    },

    updateProductInList(updatedProduct) {
        const index = this.state.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
            this.state.products[index] = updatedProduct;
        }
        if (this.state.selectedProduct?.id === updatedProduct.id) {
            this.state.selectedProduct = updatedProduct;
        }
    }
};
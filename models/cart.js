module.exports = function Cart(oldCart) {
    this.models = oldCart.models || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item) {
        var storedModel = this.models[item.model];
        if (!storedModel) {
            storedModel = this.models[item.model] = {model: item.model, qty: 0, price: item.price};
        }
        storedModel.qty++;
        storedModel.price = storedModel.qty * item.price;
        this.totalQty++;
        this.totalPrice += item.price;
    };

    this.generateArray = function() {
        var arr = [];
        for (var id in this.models) {
            arr.push(this.models[id]);
        }
        return arr;
    };
};
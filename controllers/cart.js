const CartModel = require("../models/Cart");
const productModel = require("../models/product");

const addCartItem = async(req,res)=>{
    try{
        // find the Cart items of the Customer
        // if Not Found
        //     Create new Cart and add the items in it
        //if the Customer already has cart collection
        //     then iterate over the items
        //        if the item not added before in the product array in the cart collection add it
        //         if already added just change the quantity of this item

        let customerCart = await CartModel.findOne({customer:req.user._id});
        if(!req.body.quantity) req.body.quantity = 1
        // get the product to check number of in stock
        const product = await productModel.findById(req.body.product);

        if(!customerCart) {
            if(req.body.quantity > product.inStock) return res.status(400).send('Out of stock');
            customerCart =  new CartModel({products:[req.body],customer:req.user._id});
            await customerCart.save();
            return res.status(201).send(customerCart);
        }
        const index = customerCart.products.findIndex( productObj => productObj.product.toString() === req.body.product);
        if(index === -1){
            if(req.quantity > product.inStock) return res.status(400).send('Out of stock');
            customerCart.products.push({...req.body})
        }
        else {
            if(customerCart.products[index].quantity + req.body.quantity > product.inStock) return res.status(400).send('Out of stock');
            customerCart.products[index].quantity+= req.body.quantity;
        }


        await customerCart.save();
        res.send(customerCart);
    }catch (e){
        res.status(400).send("Error: " + e);
    }
}

const getAllCartItems = async (req,res)=> {
    try {
        const cart = await CartModel.findOne({customer: req.user._id});
        if (!cart) return res.status(404).send({});
        res.send(cart);
    } catch (e) {
        res.status(400).send('Error ' + e);
    }
}

const updateCart = async(req,res)=>{
    try{
        const customerCart = await CartModel.findOne({customer:req.user._id});
        customerCart.products = req.body;
        await customerCart.save();
        res.send(customerCart);
    }catch (e){
        res.status(400).send('Error' + e);
    }
}
module.exports = {
    getAllCartItems,
    updateCart,
    addCartItem
}

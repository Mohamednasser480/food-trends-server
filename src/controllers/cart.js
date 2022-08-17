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
        //        if already added just change the quantity of this item
        let customerCart = await CartModel.findOne({customer:req.user._id}).populate('products.product');
        // get the product to check number of in stock
        const product = await productModel.findById(req.body.product);
        if(!customerCart) {
            if(req.body.quantity > product.inStock)
                return res.status(400).send({error:'Out of stock', code:400,productName:product.productName});
            const price = req.body.quantity * product.price;
            customerCart =  new CartModel({products:[req.body],customer:req.user._id,cartPrice:price});
            await customerCart.save();
            customerCart.products[0].product = product; // populate product data, just one product in the cart collection
            return res.status(201).send(customerCart);
        }

        // if the product is already in the customer cart
        const productInCart = customerCart.products.find( cartItem=> cartItem.product._id.toString() === req.body.product);
        if(!productInCart){
            if(req.body.quantity > product.inStock)
                return res.status(400).send({error:'Out of stock', code:400,productName:product.productName});
            console.log()
            customerCart.products.push({product,quantity:req.body.quantity});
        }else{
            if(req.body.quantity + productInCart.quantity > product.inStock)
                return res.status(400).send({error:'Out of stock', code:400,productName:product.productName});

            productInCart.quantity += req.body.quantity;
        }
        customerCart.cartPrice += req.body.quantity * product.price;
        await customerCart.save();
        res.send(customerCart);
    }catch (e){
        res.status(400).send({error:e.message, code:400});
    }
}
const getAllCartItems = async (req,res)=> {
    try {
        const cart = await CartModel.findOne({customer: req.user._id}).populate('products.product');
        if (!cart) return res.status(404).send({error:'Products Not found',code:404});
        res.send(cart);
    } catch (e) {
        res.status(400).send({error:e.message,code:400});
    }
}
const updateCart = async(req,res)=>{
    try{
        const customerCart = await CartModel.findOne({customer:req.user._id}).populate('products.product');
        const toUpdate = customerCart.products.find( product => product.product._id.toString() === req.body.id);
        if(!toUpdate) return res.status(404).send({error:'products not found',code:404});
        if(toUpdate.product.inStock < req.body.quantity)
            return res.status(400).send({error:'out of Stock', productName:toUpdate.product.productName,code:400});
        customerCart.cartPrice += (req.body.quantity - toUpdate.quantity) * toUpdate.product.price;
        toUpdate.quantity = req.body.quantity;
        await customerCart.save();
        res.send(customerCart);
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
const deleteCartProduct = async (req,res)=>{
    try{
        const customerCart = await CartModel.findOne({customer:req.user._id}).populate('products.product');
        const toDeleteIndex = customerCart.products.findIndex( cartItem => cartItem.product._id.toString()===req.body.id);
        if(toDeleteIndex === -1) return res.status(404).send({error:'product Not found',code:404});

        const toDeleteProduct = customerCart.products[toDeleteIndex];
        customerCart.cartPrice -= toDeleteProduct.quantity * toDeleteProduct.product.price;
        customerCart.products.splice(toDeleteIndex,1);
        await customerCart.save();
        res.send(customerCart);
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
const putCartProducts = async(req,res)=>{
    try{
        let  customerCart = await CartModel.findOne({customer:req.user._id});
        if(!customerCart) customerCart = new CartModel({products:[],cartPrice:0,customer:req.user._id});

        let  productName = null;
        // iterate over each product to put and check the stock instances
        let price = 0;
        for(let productToPut of req.body.products){
            const product = await productModel.findById(productToPut.product);
            if(!productName && product.inStock < productToPut.quantity)
                productName = product.productName;
            price += product.price * productToPut.quantity;
        }
        if(productName) return res.status(400).send({message:'out of Stock', productName,code:400});
        customerCart.products = req.body.products;
        customerCart.cartPrice = price;
        await customerCart.save();
        res.send(customerCart);
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}

module.exports = {
    getAllCartItems,
    updateCart,
    addCartItem,
    deleteCartProduct,
    putCartProducts
}

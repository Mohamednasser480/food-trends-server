const dotenv = require("dotenv");
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const createPayment = async (orderData)=>{
    try{
        const config = {
            success_url: `${process.env.SUCCESS}?success=true`,
            cancel_url: `${process.env.CANCEL}?cancel=true`,
            payment_method_types : ['card'],
            mode:'payment',
            line_items:orderData.map( item=>{
                return {
                    price_data:{
                        currency:'EGP' ,
                        product_data:{name:item.product.productName, images:item.product.images},
                        unit_amount:item.product.price*100,

                    },
                    quantity: item.quantity
                }
            }),
        }
        const session = await stripe.checkout.sessions.create(config);
        return {url:session.url}
    }catch (e){
        return {error:e.message};
    }
}
module.exports = {createPayment}
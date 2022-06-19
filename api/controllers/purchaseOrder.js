const { response, request } = require("express");
const { ProductsModel, PurchaseOrder } = require("../models");
const createPayment = require('../MercadoPago/payment.js');

const addPurchaseOrder = async(req = request, res = response) =>{
  //req --> carrito que me llega del front [{idUser,idProducto,cantidad},{idUser,idProducto,cantidad}]
    console.log("PurachseOrder",req.user)
    try{
    //Creando la orden
    
    const newOrder = await PurchaseOrder.create({
        quantity: req.body.reduce((acumulador,orden)=>acumulador+=orden.quantity,0),//mandar la cantidad total de productos
        idUser: req.body[0].idUser
    })

    let foundProduct = [];

    for(let i = 0; i < req.body.length; i++){
     foundProduct = [...foundProduct, await ProductsModel.findOne({
        where:{
            id: req.body[i].idProduct
        }
    })];
    //Agregando a la tabla intermedia el producto
    await newOrder.addProducts(foundProduct);
  }

   //Join entre PurchaseOrder y ProductModel

   const join = await PurchaseOrder.findOne({
    where:{
      id: newOrder.id
    },
    include:{
      model: ProductsModel,
      attributes: ['id']
    }
   })

   ////////////////////
   //mercado pago pendiente
   //si se completo la transaccion -> cambia el stock
   //no se pago la transaccion -> no cambia el stock
   const cart = foundProduct.map((p,index)=>{
     return {
       id: p.id,
       title: p.name,
       description: p.detail,
       picture_url: p.img,
       unit_price: p.price,
       category_id: newOrder.id,
       quantity: req.body[index].quantity
     }
   })

   const urlPayment = await createPayment(cart, res);
 



    

    res.json({
    ok: true,
    idOrder: newOrder.id,
    idUser: newOrder.idUser,
    idProduct:join.dataValues.products.map((p)=>p.dataValues.id),
    quantity: newOrder.quantity,
    urlPayment, 
    idPurchaseOrder: newOrder.id,
  });

} catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
}

module.exports = {
    addPurchaseOrder
}
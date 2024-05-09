var express = require('express');
// var md5 = require('md5');
var bcrypt = require('bcrypt');
var router = express.Router();
const userSchema = require('../models/user.model');
const productSchema = require('../models/product.model');
const orderSchema = require('../models/order.model');
const jwt = require('jsonwebtoken');
const { AuthCheck } = require('../middleware/auth.middleware');
// const { ReturnToken } = require('../middleware/login.token')

// *-------------- เส้นทาง /api -------------------*

//  *--------------- เข้าสู่ระบบ -----------------------*
router.post('/v1/login', async function (req , res , next) {
    try {
        let {username , password} = req.body

        let checkUsername = await userSchema.findOne({username : username});
        let checkPassword = await bcrypt.compare(password,checkUsername.password);
        // let checkPassword_01 = await userSchema.findOne({password : checkPassword});

        if (!checkUsername || !checkPassword) {
            res.status(400).send({
                status : 400 ,
                message : "username or password is not correct !"
            })
        } 
        if (checkUsername.active == 0) {
            res.status(400).send({
                status : 400 ,
                message : "Your user is not approve. Please contact Admin."
            })
        }
        if (checkUsername.active == 1) {
            // *-------- Token -------------
            const token = jwt.sign(
                {
                    id : checkUsername._id ,
                    username : checkUsername.username , 
                    password: checkUsername.password , 
                    role : checkUsername.role , 
                    active : checkUsername.active
                } , 
                '1111' , 
                {expiresIn: '30m'}
            );
            // *-------- Token -------------
            res.status(200).send({
                status: 200 ,
                message: "login success !" , 
                data : checkUsername ,
                token : token 
            })
        }
        else {
            res.status(400).send({
                status : 400 ,
                message : "System Error !?"
            })
        }
    } catch (error) {
        res.status(400).send({
            status : 500 ,
            message : "login unsuccess !" , 
            detail : error.toString()
        });
    }
})
// *-------------------------------------------------*

//  *--------------- สมัครสมาชิก -----------------------*
router.post('/v1/register' , async function (req , res , next) {
    try {
        // Input
        let {username, password, firstname, surname, tel , role} = req.body
        let hashPassword = await bcrypt.hash(password, 10);

        // Insert
        let newUser = new userSchema({
            username : username, 
            password : hashPassword , 
            firstname : firstname, 
            surname : surname, 
            tel : tel , 
            role : role , // 0: Users     1: Admin
            active : 0 // 0: false      1: true
        });

        // Save to DB
        let save = await newUser.save()

        // Show Result
        res.status(200).send({
            status : 200 ,
            message : "register user success !" , 
            data : save 
        })

    } catch (error) {
        res.status(400).send({
            status : 400 ,
            message : "register user unsuccess !" , 
            detail : error.toString()
        });
    }
})
// *-------------------------------------------------*

//  *--------------- ตรวจสอบความเป็นสมาชิก -----------------------*
// TODO : เงื่อนไข role
router.put('/v1/approve/:id' , AuthCheck ,async function (req , res , next) {
    try {
        
        // if (ReturnToken == 0) {
        //     res.send({
        //         text : "Hi"
        //     })
        // }

        // console.log(ReturnToken);
        // let checkRole = await userSchema.fin({username : req.pa});


        // console.log(ReturnToken.toString());
        // res.AuthCheck(res.send());

        // console.log(ReturnToken);

        // let {active} = req.body

        // let updateStatus = await userSchema.findByIdAndUpdate(req.params.id , {active} , {new: true});

        // res.status(200).send({
        //     status : 200 ,
        //     message : "Update Approve success !" , 
        //     data : updateStatus
        // })
    } catch (error) {
        res.status(400).send({
            status : 400 ,
            message : "approve unsuccess !" , 
            detail : error.toString()
        });
    }
})
// *----------------------------------------------------------*

//  *--------------- แสดงรายการ Product ทั้งหมด -----------------------*
router.get('/v1/products' , AuthCheck , async function (req , res , next) {
    try {
        let product_list = await productSchema.find({})

        res.status(200).send({
            status : 200 ,
            message : "Show Product success !" , 
            data : product_list
        });

    } catch (error) {
        res.status(400).send({
            status : 400 ,
            message : "show product unsuccess !" , 
            detail : error.toString()
        });
    }
})
// *-----------------------------------------------------------------*

//  *--------------- แสดงรายการ Product ทีละรายการ --------------------*
router.get('/v1/products/:id' , AuthCheck ,  async function (req , res , next) {
    try {
        let product_list = await productSchema.findById(req.params.id)

        res.status(200).send({
            status : 200 ,
            message : "Show Product success !" , 
            data : product_list
        });

    } catch (error) {
        res.status(400).send({
            status : 400 ,
            message : "Show Product unsuccess !" , 
            detail : error.toString()
        });
    }
})
// *-----------------------------------------------------------------*

//  *--------------- เพิ่มรายการ Product  -----------------------*
router.post('/v1/products' , AuthCheck , async function (req , res , next) {
    try {
        let {productName , type , price , stock} = req.body

        let newProduct = await productSchema({
            productName : productName , 
            type : type , 
            price : price , 
            stock : stock
        });

        let saveProduct = await newProduct.save();

        res.status(200).send({
            status : 200 ,
            message : "Add Product success !" , 
            data : saveProduct
        });

    } catch (error) {
        res.status(400).send({
            status : 400 ,
            message : "Add Product unsuccess !" , 
            detail : error.toString()
        });
    }
})
// *----------------------------------------------------------*

//  *--------------- แก้ไขรายการ Product  -----------------------*
router.put('/v1/products/:id' , AuthCheck , async function (req , res , next) {
    try {
        let {productName , type, price, stock} = req.body

        let updateProduct = await productSchema.findByIdAndUpdate(req.params.id , {productName, type, price, stock} , {new: true});

        res.status(200).send({
            status : 200 ,
            message : "Update Product success !" , 
            data : updateProduct
        })

    } catch (error) {
        res.status(500).send({
            status : 500 ,
            message : "Update Product unsuccess !" , 
            detail : error.toString()
        });
    }
})
// *----------------------------------------------------------*

//  *--------------- ลบรายการ Product  -----------------------*
router.delete('/v1/products/:id' , AuthCheck , async function (req , res , next) {
    try {
        let deleteProduct = await productSchema.findByIdAndDelete(req.params.id);

        res.status(200).send({
            status : 200 ,
            message : "Delete Product success !" , 
            data : deleteProduct
        })

    } catch (error) {
        res.status(500).send({
            status : 500 ,
            message : "Delete Product unsuccess !" , 
            detail : error.toString()
        });
    }
})
// *----------------------------------------------------------*

//  *--------------- แสดงรายการ Order ทั้งหมด -----------------------*
// TODO : ติดการ JOIN Colletion
router.get('/v1/orders' , AuthCheck , async function (req , res , next) {
    try {
        let order_list = await orderSchema.find({})

        res.status(200).send({
            status : 200 ,
            message : "Select Orders success !" , 
            data : order_list
        });

    } catch (error) {
        res.status(500).send({
            status : 500 ,
            message : "Select Orders unsuccess !" , 
            detail : error.toString()
        });
    }
})
// *-----------------------------------------------------------------*


//  *--------------- แสดงรายการ Order ทั้งหมด ของ Products -----------------------*
// TODO : ติดการ JOIN Colletion && ดูข้อมูลไม่ได้
router.get('/v1/products/:id/orders' , async function (req , res , next) {
    try {
        let order_list = await orderSchema.findById(req.params.id)

        res.status(200).send({
            status : 200 ,
            message : "Select Orders success !" , 
            data : order_list
        });

    } catch (error) {
        res.status(500).send({
            status : 500 ,
            message : "Show Orders unsuccess !" , 
            detail : error.toString()
        });
    }
})
// *----------------------------------------------------------------------------*

//  *--------------- เพิ่ม Order ใน Products -----------------------*
// TODO : ติดเงื่อนไข
router.post('/v1/products/:id/orders' , AuthCheck , async function (req , res , next) {
    try {
        const token = req.headers.authorization.split("Bearer ")[1];
        await console.log(token);



        // let newOrders = await orderSchema({
        //     productID : req.params.id , 
        //     UserID : req.params.id , 
        //     amount : amount
        // });

        // // if (amount <= productSchema.find({amount})) {
        //     // await productSchema.findByIdAndUpdate(req.params.id , {amount} , {new: true});
        //     let saveOrders = await newOrders.save();

        //     res.status(200).send({
        //         status : 200 ,
        //         message : "Add Orders success !" , 
        //         data : saveOrders
        //     });
        // // }
        
    } catch (error) {
        res.status(500).send({
            status : 500 ,
            message : "Add Orders unsuccess !" , 
            detail : error.toString()
        });
    }
})
// *--------------------------------------------------------------*

// ?---------------Exports To Server-----------------?
module.exports = router;
// ?-------------------------------------------------?



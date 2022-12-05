const async = require("hbs/lib/async");
const db = require("../configure/config")
const bcrypt = require("bcrypt");
const req = require("express/lib/request");
// const { ObjectID } = require("bson");
let objectid = require('mongodb').ObjectId
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')("ACa453b6cff5f2778e76fdf0fa0e1f9e2c", "faeb0d9f30812da32cff7133c8b98987");
const Razorpay = require("razorpay");
const { resolve } = require("path");


var instance = new Razorpay({
    key_id: 'rzp_test_DVZJTcZnuOdAWp',
    key_secret: 'YmaQQlPVZGwtuIioqOdF5s7A',
});



module.exports = {
    userSign: (async (email, pass, name, rpassword) => {
        return new Promise(async (resolve, reject) => {

            let response = {}
            if (email == "" || pass == "" || name == "" || rpassword == "" || pass !== rpassword) {
                // res.redirect("/signup")
                response.status = false
                resolve(response);
            } else {
                var user = await db.get().collection("usersdetails").findOne({ email })


                if (user) {
                    // return res.redirect("/signup")
                    response.user = false
                    resolve(response);
                } else {
                    let userData = {}

                    userData.email = email;
                    userData.pass = pass;
                    userData.name = name;

                    userData.pass = await bcrypt.hash(pass, 10);
                    userData.block = false;
                    userData.dp = false;
                    db.get().collection("usersdetails").insertOne(userData).then((x) => {
                        // res.redirect("/")
                        response.status = true
                        resolve(response);

                    })

                }
            }
        })
    }),
    userLog: (loginid) => {

        return new Promise(async (resolve, reject) => {
            const { email, pass } = loginid

            let user = await db.get().collection("usersdetails").findOne({ email: email })

            response = {}


            if (!user) {

                response.falseuser = true
                resolve(response)
            }
            else {
                await bcrypt.compare(pass, user.pass).then((status) => {
                    if (status) {
                        response.block = user.block;
                        response.isuser = true
                        response.state = true
                        resolve(response)
                    } else {
                        response.isuser = true
                        response.state = false
                        resolve(response)
                    }
                })
            }
        })
    },


    hotelview: ((limit) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("hotels").find().skip((limit - 1) * 10).limit(10).toArray().then((hotels) => {
                resolve(hotels)
            })
        })
    }),

    findcounthotel: (() => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("hotels").count().then((count) => {
                let pagecount = Math.ceil(count / 10);
                resolve(pagecount)
            })
        })
    }),

    gotohotel: ((hotelbody) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("hotels").findOne({ _id: objectid(hotelbody) }).then((hotel) => {
                resolve(hotel)
            })
        })
    }),

    getcoments: ((hotelid) => {
        return new Promise((resolve, reject) => {
            db.get().collection("coments").find({ hotelid: hotelid }).toArray().then((coment) => {

                resolve(coment)
            }).catch((err) => {
                console.log(err);
            })
        })
    }),




    takehotels: (() => {
        return new Promise((resolve, reject) => {
            db.get().collection("hotels").find().toArray().then((hotel) => {
                resolve(hotel)
            })
        })
    }),


    takebaner: (() => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("baners").find().toArray().then((baner) => {
                resolve(baner)
            })
        })
    }),

    profiefind: ((uniqueid) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("usersdetails").findOne({ email: uniqueid }).then((userid) => {
                resolve(userid)
            })
        })
    }),

    adddp: ((dpimage, userid) => {

        return new Promise(async (ressolve, reject) => {
            await db.get().collection("usersdetails").updateOne({ email: userid }, {
                $set: {
                    dpimage: dpimage.filename,
                    dp: true
                }
            }, { upsert: true }).then(() => {
                resolve();
            })
        })
    }),


    deletedp: ((userid) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("usersdetails").updateOne({ email: userid }, {
                $set: {
                    dp: false
                }
            })
        })
    }),

    takdpcon: ((userid) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("usersdetails").findOne({ email: userid }).then((dpstate) => {
                resolve(dpstate)
            })
        })
    }),


    addcoment: ((comentbody, user, hotelid) => {
        const { starrating, coment } = comentbody;
        let coments = {};
        coments.starrating = starrating;
        coments.coment = coment;
        coments.user = user;
        coments.hotelid = hotelid
        return new Promise((resolve, reject) => {
            db.get().collection('coments').insertOne(coments).then((ok) => {
                resolve(ok)
            })
        })
    }),

    addfav: ((hotelid, userid) => {
        return new Promise(async (resolve, reject) => {

            await db.get().collection("favorites").findOne({ _id: objectid(hotelid) }).then(async (ishotel) => {
                if (ishotel) {
                    resolve(ishotel)
                } else {
                    await db.get().collection("hotels").findOne({ _id: objectid(hotelid) }).then(async (hot) => {
                        hot.userid = userid;
                        let fav = {};
                        fav.hotelid = hotelid;
                        fav.userid = userid;

                        await db.get().collection("favorites").insertOne(hot)
                        await db.get().collection("fav").insertOne(fav)
                    }).then((result) => {
                        resolve(result)
                    })
                }
            })


        })
    }),



    takefave: ((userid) => {
        return new Promise(async (resolve, reject) => {

            await db.get().collection("favorites").find({ userid: userid }).toArray().then((favhot) => {
                resolve(favhot)
            })
        })
    }),

    favtake: ((userid) => {
        return new Promise((resolve, reject) => {
            db.get().collection("fav").find({ userid: userid }).toArray().then((fav) => {
                resolve(fav)
            })
        })
    }),



    setpaymentnow: (async (userid, hotelid, fromdate, todate, datediff, adult, gst, totalprice) => {



        demopayment = {};

        demopayment.userid = userid;
        demopayment.hotelid = hotelid;
        demopayment.fromdate = fromdate;
        demopayment.todate = todate;
        demopayment.datediff = datediff;
        demopayment.adult = adult;
        demopayment.gst = gst;
        demopayment.totalprice = totalprice;
        demopayment.payment = 'pending';

        return new Promise(async (resolve, reject) => {
            await db.get().collection("usersdetails").findOne({ email: userid }).then(async (user) => {
                demopayment.user = user;
                await db.get().collection("hotels").findOne({ _id: objectid(hotelid) }).then((hotel) => {
                    demopayment.hotel = hotel;


                    db.get().collection("demopayment").insertOne(demopayment).then((response) => {
                        resolve(response)
                    })
                })
            })
        })

    }),

    generateorder: ((orderid, price) => {
        return new Promise((resolve, reject) => {

            var options = {
                amount: price * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "" + orderid
            };
            instance.orders.create(options, function (err, order) {
                console.log("kkdgjdfkj" + order);
                resolve(order)
            });

        })
    }),


    verifywithcrypto: ((details) => {
        return new Promise((resolve, reject) => {

            let body = details['payment[razorpay_order_id]'] + "|" + details['payment[razorpay_payment_id]'];
            const crypto = require('crypto');
            var expectedSignature = crypto.createHmac('sha256', 'YmaQQlPVZGwtuIioqOdF5s7A')
                .update(body.toString())
                .digest('hex')
            if (expectedSignature === details['payment[razorpay_signature]']) {
                resolve()
            } else {
                reject()
            }

        })
    }),

    confirmorder: ((orderid) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("demopayment").updateOne({ _id: objectid(orderid) },
                {
                    $set: { payment: "booked" }
                }).then(() => {
                    resolve()
                })
        })
    }),


    userbooking: ((userid) => {
        return new Promise(async (resolve, reject) => {

            await db.get().collection("demopayment").find({ payment: "booked" }).toArray().then((booking) => {

                var book = []

                for (let i = 0; i < booking.length; i++) {
                    if (new Date() < new Date(new Date(booking[i].todate))) {
                        if (booking[i].user.email == userid) {
                            book.push(booking[i]);

                        }
                    } else {
                        console.log(new Date() + ">" + new Date(new Date(booking[i].todate)));

                    }
                    if (new Date() < new Date(new Date(booking[i].todate))) {
                        console.log(new Date() + "<" + new Date(new Date(booking[i].todate)));
                    } else {

                        console.log(new Date() + ">" + new Date(new Date(booking[i].todate)));
                    }

                }


                resolve(book);
            })
        })
    }),


    download: ((paymentid) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("demopayment").findOne({ _id: paymentid }).then((payment) => {
                resolve(payment);
            })
        })
    }),

    takepaymentforrent: ((userid) => {
        return new Promise(async (resolve, reject) => {
            let paymentresult = await db.get().collection("demopayment").find({ payment: "booked", 'user.email': userid }).toArray();
            resolve(paymentresult);
        })
    }),

    takerental: (() => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("renalitems").find().toArray().then((rentals) => {
                resolve(rentals)
            })
        })
    }),

    rentslcategory: (() => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("places").find().toArray().then((rentals) => {
                resolve(rentals)
            })
        })

    }),


    rentcatogarysearch: ((category) => {

        let cate = category.rentcategory.toLowerCase();
        return new Promise(async (resolve, reject) => {
            let rental = await db.get().collection("renalitems").find({ category: cate }).toArray();
            console.log(rental);
            resolve(rental);
        })
    }),

    makerentrecipt: ((rentbody, userid) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("usersdetails").findOne({ email: userid }).then(async (user) => {

                rentbody.user = user;
                rentbody.payment = "pending"
                await db.get().collection("rentmoney").insertOne(rentbody).then((receipt) => {
                    resolve(receipt)
                })
            })
        })
    }),

    generateorderrent: ((receiptid, rent) => {
        return new Promise((resolve, reject) => {

            var options = {
                amount: rent * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "" + receiptid
            };
            instance.orders.create(options, function (err, order) {
                console.log("kkdgjdfkj" + order);
                resolve(order)
            });

        })
    }),

    confirmorderrent: ((orderid) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("rentmoney").updateOne({ _id: objectid(orderid) },
                {
                    $set: { payment: "booked" }
                }).then(() => {
                    resolve()
                })
        })
    }),

    takerentalitmsimg: (() => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("renalitems").find().toArray().then((rental) => {
                resolve(rental)
            })
        })
    }),
    takehotelplace: (() => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("places").find().toArray().then((place) => {
                resolve(place)
            })
        })
    }),

    hotelplaceview: ((places) => {
        let { place } = places;
        return new Promise(async (resolve, reject) => {
            await db.get().collection("hotels").find({ place: place }).toArray().then((hotel) => {
                resolve(hotel);
            })
        })
    }),


    takehistory: ((userid) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection("demopayment").find({ payment: "booked" }).toArray().then((booking) => {
                var book = []
                for (let i = 0; i < booking.length; i++) {
                    if (new Date() > new Date(new Date(booking[i].todate))) {
                        if (booking[i].user.email == userid) {
                            book.push(booking[i]);
                        }
                    } else {
                        console.log(new Date() + "<" + new Date(new Date(booking[i].todate)));

                    }
                }
                resolve(book);
            })
        })
    }),

    takerenteditems : ((userid)=>{
        console.log(userid);
        return new Promise(async(resolve, reject) => {
           let rent = await db.get().collection("rentmoney").find({'user.email':userid, payment:"booked"}).toArray();
            resolve(rent);
        })
    })

}
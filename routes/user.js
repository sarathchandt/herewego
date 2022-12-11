const express = require("express");
const req = require("express/lib/request");
let router = express.Router();
let nodemailer = require("../control/nodemailer")
let usersntrl = require("../control/usercontrol")
let swal = require("sweetalert");
const session = require("express-session");
const async = require("hbs/lib/async");
const admincontrol = require("../control/admincontrol");
const { response } = require("express");
const { Db } = require("mongodb");



router.get("/", ((req, res) => {

    if (req.session.login) {
        res.redirect("/user")
    } else {
      const  response = {}
        response.block = false
        res.render("login", { response })
    }
}))

router.get("/signup", (req, res) => {
   const  response = {}
    response.pas = false

    res.render("usesignup", { response })

})

router.post("/signup", nodemailer.sendit);
router.get("/reotp/:name/:email/:pass/:rpassword", (req, res) => {
    nodemailer.resendit(req.params.email);
    let userdet = {}
    userdet.name = req.params.name;
    userdet.email = req.params.email;
    userdet.pass = req.params.pass;
    userdet.rpassword = req.params.rpassword;
    res.render("otp", { userdet })
})


router.post("/signupwithotp/:name/:email/:pass/:rpassword", (req, res) => {
    nodemailer.verifyotp(req.body).then((response) => {
        if (response.status) {
            usersntrl.userSign(req.params.email,
                req.params.pass,
                req.params.name,
                req.params.rpassword).then((response) => {
                    if (response.status) {
                        res.redirect("/")
                    } else {

                        res.render("usesignup", { response })
                    }
                })
        } else {
            response.isotp = false
            res.render("usesignup", { response });
        }
    })
})



router.post("/login", ((req, res) => {
    req.session.userId = req.body.email
    if (req.session.login) {
        res.redirect("/user")
    } else {
        usersntrl.userLog(req.body).then((response) => {
            if (response.falseuser) {
                res.render("login", { response })
            } else {

                if (response.block) {
                    res.render("login", { response })
                } else {
                    if (response.state) {
                        req.session.login = true
                        res.redirect("/user")
                    } else {
                        req.session.loginerr = true

                        res.render("login", { response })
                    }
                }
            }
        })
    }
}))

router.get("/user", (req, res) => {

    if (req.session.login) {
        usersntrl.takehotels().then((hotell) => {

            usersntrl.takebaner().then((baner) => {
                let hotel = []
                for (let x = 0; x < 3; x++) {
                    hotel.push(hotell[x])
                }
                usersntrl.favtake(req.session.userId).then((fav) => {
                    console.log(fav);
                    let lenght = fav.length;
                    for (let x = 0; x < lenght; x++) {
                        for (let y = 0; y < 3; y++) {
                            if (fav[x].hotelid == hotel[y]._id) {
                                hotel[y].isfav = true
                            }
                        }
                    }

                    // for (let x = 0; x < 3; x++) {
                    //     // if(!hotel[x].isfav){
                    //     //     hotel[x].isfav=false
                    //     // }
                    // }

                    usersntrl.takerentalitmsimg().then((rental) => {
                        let rentals = [];
                        if (rental.length > 8) {
                            for (let i = 0; i < 8; i++) {
                                rentals.push(rental[i]);
                            }
                        } else {
                            for (let i = 0; i < rental.length; i++) {
                                rentals.push(rental[i]);
                            }
                        }

                        res.render("user", { hotel, baner, fav, rentals })
                    })


                })



            })
        })


    } else {
        res.redirect("/")
    }

})

router.get("/otp", async (req, res) => {
    if (req.session.login) {
        await nodemailer.sendit()
        res.render("otp")


    } else {
        res.redirect("/")
    }
})

router.get("/viewhotels", (req, res) => {

    if (req.session.login) {
        usersntrl.hotelview(1).then((hotel) => {
            usersntrl.findcounthotel().then((pagecount) => {
                usersntrl.takehotelplace().then((place) => {
                    let page = 1;
                    res.render("viewhotel", { hotel, pagecount, page, place })

                })

            })
        })
    } else { res.redirect("/") }

}),

    router.post("/hotelplacesearch", (req, res) => {

        usersntrl.hotelplaceview(req.body).then((hotel) => {
            usersntrl.findcounthotel().then((pagecount) => {
                usersntrl.takehotelplace().then((place) => {
                    let page = 1;
                    res.render("viewhotel", { hotel, pagecount, page, place })
                })
            })
        })
    })



router.get("/paginationview/:pagenum", (req, res) => {
    if (req.session.login) {
        let pagenum = req.params.pagenum;
        let page = Number(pagenum)

        usersntrl.hotelview(page).then((hotel) => {
            usersntrl.findcounthotel().then((pagecount) => {
                usersntrl.takehotelplace().then((place) => {

                    res.render("viewhotel", { hotel, pagecount, page, place });
                })
            })
        })
    } else {
        res.redirect("/")
    }


})



router.post("/gotohotel/:id", (req, res) => {

    usersntrl.gotohotel(req.params.id).then((hotel) => {
        usersntrl.getcoments(req.params.id).then((coment) => {
            let states = {}
            let length = coment.length;
            let myarr = [];
            let sum = 0

            for (let x = 0; x < length; x++) {
                let num = (coment[x].starrating);
                myarr.push(Number(num));
            }
            myarr.forEach(x => {
                sum = sum + x
            })
            let avg = sum / length;
            states.length = length;
            states.rate = avg;
            res.render("gotohotel", { hotel, coment, states })
        })

    })
})


// router.get("/tohotel/:id",(req,res)=>{
//     if(req.session.login){

//     usersntrl.gotohotel(req.params.id).then((hotel)=>{
//         res.render("gotohotel",{hotel})
//     }) }
//     else{
//         res.redirect("/")
//     }
// })


router.get("/profile", (req, res) => {
    if (req.session.login) {
        usersntrl.profiefind(req.session.userId).then((userid) => {
            usersntrl.takehistory(req.session.userId).then((history) => {
                res.render("userprofile", { userid, history })
            })

        })

    } else {
        res.redirect("/")
    }
})

router.get("/changedp", (req, res) => {
    if (req.session.login) {
        usersntrl.takdpcon(req.session.userId).then((dpstate) => {

            res.render("changedp", { dpstate })
        })

    }
})

router.post("/adddp", (req, res) => {
    usersntrl.adddp(req.file, req.session.userId);
    res.redirect("/profile")


})

router.get("/deletedp", (req, res) => {
    usersntrl.deletedp(req.session.userId);
    res.redirect("/profile")
})

router.post("/paymenthere/:id", (req, res) => {


    if (req.session.userId) {  

        let temp = req.body;
        const { fromdate, todate, adult } = temp
        console.log("dul" + adult);


        let p = new Date(fromdate)
        let q = new Date(todate)
        const diffTime = Math.abs(p - q);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));





        usersntrl.gotohotel(req.params.id).then(async (hotel) => {
            hotel.diffdate = diffDays;
            if (hotel.price < 1000) {
                hotel.gst = 0
            } else if (hotel.price > 1000 && hotel.pricce <= 2500) {
                hotel.gst = 12
            } else if (hotel.price > 2500 && hotel.pricce <= 5000) {
                hotel.gst = 18
            } else {
                hotel.gst = 28
            }

            usersntrl.findoffer(req.session.userId,req.params.id).then(async(off)=>{
                if(off){
                    let per = Number(off.coupondetails.per)/100
                    hotel.totalprice = await( (hotel.price * diffDays) + ((hotel.gst / 100) * hotel.price) + (hotel.adult * adult))*per
                    hotel.preprice = await(hotel.price * diffDays) + ((hotel.gst / 100) * hotel.price) + (hotel.adult * adult);
                  }else{
                    hotel.totalprice = await(hotel.price * diffDays) + ((hotel.gst / 100) * hotel.price) + (hotel.adult * adult);
                  }
                    
        
                    res.render("topayment", { hotel, temp, p, q })

            })
          
        
        })

    } else {
        res.redirect("/")
    }
})


router.post("/coment/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/")
    } else {
        usersntrl.addcoment(req.body, req.session.userId, req.params.id);
        res.redirect("/");
    }

})

router.get("/favorite/:id", (req, res) => {
    if (req.session.userId) {
        usersntrl.addfav(req.params.id, req.session.userId).then((result) => {
            res.redirect("/");
        })
    } else {
        res.redirect("/");
    }
})

router.get("/favorite", (req, res) => {
    if (req.session.userId) {
        usersntrl.takefave(req.session.userId).then((favhot) => {
            res.render("favorites", { favhot })
        })

    } else {
        res.redirect("/")
    }
})
// rental items

router.post("/makerentpay", (req, res) => {

    usersntrl.makerentrecipt(req.body, req.session.userId).then((recipt) => {
        usersntrl.generateorderrent(recipt.insertedId, req.body.rent).then((rentrecipt) => {
            res.json(rentrecipt)
        })
    })


})

router.post("/verifyrentpayment", (req, res) => {
    usersntrl.verifywithcrypto(req.body).then(() => {
        usersntrl.confirmorderrent(req.body['order[receipt]']).then(() => {
            res.json({ status: true });
        })
    }).catch(() => {
        res.json({ status: false })
    })

})
// end of rental

router.get("/makepaynow/:id/:fromdate/:todate/:days/:adult/:gst/:totalprice", (req, res) => {




    usersntrl.setpaymentnow(req.session.userId,
        req.params.id,
        req.params.fromdate,
        req.params.todate,
        req.params.days,
        req.params.adult,
        req.params.gst,
   
        req.params.totalprice).then((response) => {
            console.log( req.params.totalprice);
            usersntrl.generateorder(response.insertedId, req.params.totalprice).then((response) => {
               
                res.json(response)
            })

        })

})

router.post("/verifypayment", (req, res) => {
    console.log(req.body);

    usersntrl.verifywithcrypto(req.body).then(() => {
        usersntrl.confirmorder(req.body['order[receipt]']).then(() => {
            res.json({ status: true });
        })
    }).catch(() => {
        res.json({ status: false })
    })


})


router.get("/ueserbooking", (req, res) => {
    if (req.session.login) {
        usersntrl.userbooking(req.session.userId).then((booking) => {
            res.render("userbooking", { booking });
        })

    } else {
        res.redirect("/");
    }
})






router.get("/successorder", (req, res) => {
    if (req.session.login) {
        res.render("success")

    } else {
        res.redirect("/")
    }
})

router.get("/rentaluser", (req, res) => {
    if (req.session.login) {
        usersntrl.takepaymentforrent(req.session.userId).then((paymenthotel) => {
            usersntrl.takerental().then((rentals) => {
                usersntrl.rentslcategory().then((category) => {

                    res.render("rentaluser", { paymenthotel, rentals, category })
                })

            })

        })
    } else {
        res.redirect("/");
    }
})

router.post("/rentcatogarysearch", (req, res) => {

    usersntrl.takepaymentforrent(req.session.userId).then((paymenthotel) => {
        usersntrl.rentcatogarysearch(req.body).then((rentals) => {
            usersntrl.rentslcategory().then((category) => {
                res.render("rentaluser", { paymenthotel, rentals, category })
            })
        })
    })
})

router.get("/activate/:id", (req, res) => {
    if (req.session.login) {
        usersntrl.activate(req.params.id).then(() => {
            res.redirect("/viewrental")
        })
    } else {
        res.redirect("/")
    }
})

router.post("/checkcoupon/:id",(req,res)=>{
    if(req.session.login){
   console.log(req.params.id)
    usersntrl.checkcoupon(req.body, req.params.id, req.session.userId).then((response)=>{
        res.json(response)
    })
}else{
    res.redirect("/")
}
})


router.get("/logout", ((req, res, next) => {
    // req.session.destroy();
    req.session.login = false
    req.session.userId = false
    res.redirect("/")
}))
router.get("/viewrental", (req, res) => {
    if (req.session.login) {
        usersntrl.takerenteditems(req.session.userId).then((rent) => {

            let name = rent[0]?.user?.name;
            res.render("viewrent", { rent, name })
        })
    }
})



module.exports = router; 
const { render } = require("ejs");
const express = require("express");
let router = express.Router();
let admincontrol = require("../control/admincontrol");

router.get("/", (req, res) => {
    if (req.session.adlogin) {
        admincontrol.usershow().then((user) => {
            console.log(user);
            res.render("admin/adminlanding", { user })
        })
    } else {
        res.render("admin/adminlogin")
    }
})

router.post("/adlogin", (req, res) => {
    admincontrol.adminlogin(req.body).then((response) => {
        if (response.status) {
            req.session.adlogin = true;
            admincontrol.usershow().then((user) => {
                console.log(user);
                res.render("admin/adminlanding", { user })
            })


        } else {
            req.session.aderr = true;
            res.redirect("/admin")
        }
    })
})

router.post("/block/:id", (req, res) => {
    admincontrol.blockuser(req.params.id);
    res.redirect("/admin")
})

router.post("/unblock/:id", (req, res) => {
    admincontrol.unblockhim(req.params.id);
    res.redirect("/admin");
})

router.post("/remove/:id", (req, res) => {
    admincontrol.removehim(req.params.id).then((resolve) => {
        res.redirect("/admin");
    })

})

router.get("/addhotel", (req, res) => {
    if (req.session.adlogin) {
        admincontrol.addplace().then((place) => {
            let length = place.length;
            console.log("length is:" + length);
            res.render("admin/addhotel", { place, length });
        })
    }
    else {
        res.redirect("/admin")
    }
}),

    router.post('/uploadhotel', (req, res) => {
        admincontrol.uploadhotel(req.body, req.file).then((resp) => {
            res.redirect("/admin/addhotel");
        })
    }),

    router.post("/addplace", (req, res) => {
        console.log(req.body);
        let { place } = req.body;
        admincontrol.addPlace(place).then((responses) => {

            if (responses.isplace) {

                res.redirect("/admin/addhotel")
            } else {
                res.redirect("/admin/addhotel")
            }
        })
        // console.log(req.body);


    }),

    router.post("/removeplace/:id", (req, res) => {
        admincontrol.removeplace(req.params.id);
        res.redirect("/admin/addhotel")
    })

router.get("/viewhotel", (req, res) => {
    if (req.session.adlogin) {
        admincontrol.gethotels().then((hotel) => {

            res.render("admin/adviewhotel", { hotel })
        })
    }
    else {
        res.redirect("/admin")
    }

}),

    router.get("/deletehotel/:id", (req, res) => {
        if (req.session.adlogin) {
            admincontrol.deltehotels(req.params.id);
            res.redirect("/admin/viewhotel")
        }
        else {
            res.redirect("/admin")
        }
    }),

    router.get("/edithotel/:id", (req, res) => {
        if (req.session.adlogin) {
            admincontrol.editshow(req.params.id).then((edit) => {
                admincontrol.fetchplace().then((place) => {
                    res.render("admin/edithotel", { edit, place })
                })
            })
        }
        else {
            res.redirect("/admin")
        }

    }),


    router.post("/updatehotel/:id", (req, res) => {

        admincontrol.updatehotel(req.params.id, req.body, req.file).then((newhotel) => {
            res.redirect("/admin/viewhotel")

        })
    }),

    router.get("/putbaner", (req, res) => {
        if (req.session.adlogin) {
            admincontrol.getbanner().then((baner) => {
                res.render("admin/adminbaner", { baner })
            })
        }
        else {
            res.redirect("/admin")
        }

    })

router.post("/addbaner", (req, res) => {
    admincontrol.addbaner(req.file);

    res.redirect("/admin/putbaner")

})




router.get("/adlogout", (req, res) => {

    req.session.adlogin = false
    // req.session.destroy();
    res.redirect("/admin");
})

router.post("/search", (req, res) => {
    const { search } = req.body
    const searchsm = search.toLowerCase();
    if (searchsm == "users") {
        res.redirect("/admin")
    }
    else if (searchsm == "hotels") {
        res.redirect('/admin/addhotel')
    }
    else if (searchsm == "view hotel") {
        res.redirect("/admin/viewhotel")
    }
    else if (searchsm == "baners") {
        res.redirect("/admin/putbaner")
    } else {
        res.redirect("/admin")
    }

})

router.get("/rental", (req, res) => {
    if (req.session.adlogin) {
        admincontrol.findcaterent().then((rent) => {
            res.render("admin/rental", { rent })
        })
    } else {
        res.redirect("/admin")
    }
})

router.post("/rentitems", (req, res) => {
    admincontrol.addrental(req.body, req.file).then((respo) => {
        console.log(respo);
        res.redirect("/admin/rental")
    })
})


router.post("/addrentcate", (req, res) => {
    admincontrol.addcaterent(req.body).then(() => {

        res.redirect("/admin/rental")


    })
})

router.get("/deletecate/:id", (req, res) => {
    if (req.session.login) {
        admincontrol.deletecate(req.params.id).then((result) => {
            res.redirect("/admin/rental")
        })
    }

})

router.get("/viewrental", (req, res) => {
    admincontrol.viewrental().then((rentalitems) => {
        res.render("admin/viewrental", { rentalitems });
    })
})

router.get("/removerental/:id", (req, res) => {
    if (req.session.adlogin) {
        admincontrol.removerent(req.params.id).then((response) => {
            res.redirect("/admin/viewrental");
        })
    } else {
        res.redirect("/admin");
    }
})


router.get("/editrental/:id", (req, res) => {
    if (req.session.adlogin) {
        admincontrol.takerent(req.params.id).then((rentaldetails) => {
            res.render("admin/editrent", { rentaldetails })

        })
    } else {
        res.redirect("/admin");
    }
}),

    router.post("/rentitemsupdate/:id", (req, res) => {
        admincontrol.updaterental(req.params.id, req.body, req.file).then((response) => {
            res.redirect("/admin/viewrental")
        })
    }),


    router.get("/booking", (req, res) => {
        if (req.session.adlogin) {

            admincontrol.takeorders().then((order) => {


                res.render("admin/showboocksadmin", { order })
            })


        } else {
            res.redirect("/admin");
        }
    })

router.get("/removebaner/:id", (req, res) => {
    if (req.session.adlogin) {
        admincontrol.removebaner(req.params.id).then((respo) => {
            res.redirect("/admin/putbaner")
        })
    }
    else {
        res.redirect("/admin")
    }
}),
    router.get("/report", (req, res) => {
        if (req.session.adlogin) {
            admincontrol.takesuceessorder().then((orders) => {
                let bookingcount = orders.hotels.length;
                let activitycount = orders.activity.length;
                var totalbookingPrice = 0;
                var totalactivityPrice = 0
                for (let i = 0; i < bookingcount; i++) {
                    totalbookingPrice = Number(orders.hotels[i].totalprice) + totalbookingPrice;
                }
                for (let i = 0; i < activitycount; i++) {
                    totalactivityPrice = Number(orders.activity[i].rent) + totalactivityPrice;
                }


                let months = [];
                let thismonth = new Date();
                let month = thismonth.getMonth();
                console.log(month + 1);
                for (let i = 0; i < orders.result.length; i++) {
                    let comingmonth = new Date(orders.result[i].date);
                    let matchingmonth = comingmonth.getMonth();
                    let year = comingmonth.getFullYear();
                    let day = comingmonth.getDate()
                    if (month == matchingmonth) {
                        orders.result[i].year = year;
                        orders.result[i].day = day;
                        orders.result[i].month = matchingmonth + 1;
                        months.push(orders.result[i]);
                    }
                }

                let actmonth = [];
                for (let i = 0; i < orders.activity.length; i++) {
                    let comingmonth = new Date(orders.activity[i].date);
                    let matchingmonth = comingmonth.getMonth();
                    let year = comingmonth.getFullYear();
                    let day = comingmonth.getDate()
                    if (month == matchingmonth) {
                        orders.activity[i].year = year;
                        orders.activity[i].day = day;
                        orders.activity[i].month = matchingmonth + 1;
                        actmonth.push(orders.activity[i]);
                    }
                }

                console.log(months);
                res.render("admin/dashbord", {
                    bookingcount,
                    activitycount,
                    totalbookingPrice,
                    totalactivityPrice,
                    months,
                    actmonth
                });
            })

        } else {
            res.redirect("/admin")
        }
    })

router.get("/coupon", (req, res) => {
    if (req.session.adlogin) {
        admincontrol.tackecoupon().then((coupon) => {
            res.render("admin/coupon", { coupon });
        })
    } else {
        res.redirect("/admin")
    }

})

router.post("/addcoupon", (req, res) => {
    admincontrol.addcoupon(req.body).then(() => {
        res.redirect("/admin/coupon");
    })
})

router.get("/removecoupon/:id", (req, res) => {
    if (req.session.adlogin) {
        admincontrol.deletecoupon(req.params.id).then(() => {
            res.redirect("/admin/coupon")
        })
    } else {
        res.redirect("/admin")
    }
})



module.exports = router;
const async = require("hbs/lib/async");
const db = require("../configure/config")
const bcrypt = require("bcrypt");
const req = require("express/lib/request");
const { promise } = require("bcrypt/promises");
let objectid = require('mongodb').ObjectId

module.exports = {
    adminlogin: ((admindetails) => {

        return new Promise((resolve, reject) => {
            let response = {};
            let { adminid, password } = admindetails;
            let realPassword = "hereWEgo@999";
            let realId = "hwg13"
            if (adminid == realId && realPassword == password) {
                response.status = true
                resolve(response)
            } else {
                response.status = false;
                resolve(response)
            }

        })


    }),
    usershow: (() => {
        return new Promise(async(resolve, reject) => {
            let user = await db.get().collection("usersdetails").find().toArray();
            resolve(user)
        })

    }),


    blockuser:((userid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection("usersdetails").updateOne({_id:objectid(userid)},{$set:
            {block:true}},{upsert:true})
        })
    }),
    unblockhim:((userid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection("usersdetails").updateOne({_id:objectid(userid)},{$set:
            {block:false}},{upsert:true})
        })  
    }),

    

    removehim :((userid)=>{
        return new Promise(async(resolve,reject)=>{
         await   db.get().collection("usersdetails").deleteOne({_id:objectid(userid)}).then((response)=>{
            resolve(response)
         })
        })
    }),

    uploadhotel :((hotelbody,hotelfile)=>{
        let resp={}

        if(!hotelfile){
            return new Promise((resolve,reject)=>{
                resp.status=true
                resolve(resp)
            }) 
        }
        else{
           
        hotelbody.imageUrl=hotelfile.filename;
        return new Promise ((resolve,reject)=>{
            db.get().collection("hotels").insertOne(hotelbody).then((x)=>{
                resp.status=false
                resolve(resp)
            })
        })
    }
    }),
    
    addPlace : ((place)=>{
        console.log("place:"+place);
        let venue= place.toLowerCase();
     
        
     
      let responses={} 
        return new Promise(async(resolve,reject)=>{
            var there=await db.get().collection("places").findOne({venue});
            
            if(there){
                responses.isplace=true
                resolve(responses)
            }else{
                responses.isplace==false;
                db.get().collection("places").insertOne({venue});
                resolve(responses)
            }

            

        })
       
    
        
    }),

    addplace : (()=>{
        return new Promise(async(resolve, reject)=>{
         await db.get().collection("places").find().toArray().then((place)=>{
            resolve(place)
            
         })
           
        })
    }),

    removeplace : ((place)=>{
        db.get().collection("places").deleteOne({_id:objectid(place)});
    }),

    gethotels :(()=>{
        return new Promise(async(resolve, reject)=>{
await db.get().collection("hotels").find().toArray().then((hotel)=>{
    resolve(hotel)
    
})
        })
    }),

    deltehotels : ((hotelid)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection("hotels").deleteOne({_id:objectid(hotelid)})
        })
    }),

    editshow : ((hotelid)=>{
        return new Promise(async(resolve, reject)=>{
               let first= await db.get().collection("hotels").findOne({_id:objectid(hotelid)}).then((edit)=>{
                resolve(edit);
               })
               })
        }) ,


        fetchplace : (()=>{
            return new Promise(async(resolve, reject)=>{
           await  db.get().collection("places").find().toArray().then((place)=>{
                    resolve(place)
                })
            })
        }),

        updatehotel : ((hotelid, hotelbody, hotelfile)=>{

          
            const {name, place,description,price,star,imageUrl} = hotelbody
            return new Promise((resolve, reject)=>{
                db.get().collection("hotels").updateOne({_id:objectid(hotelid)}, {$set:
                {
                    name:name,
                    place:place,
                    description:description,
                    price:price,
                    star:star,
                    imageUrl:hotelfile.filename

                }}).then((newhotel)=>{
                    resolve(newhotel)
                })
            })
        }),

        addbaner : (banerfile)=>{
            const {filename}=banerfile
            
            return new Promise((resolve, reject)=>{
                db.get().collection("baners").insertOne({imageUrl:filename})
            })
        },


        getbanner : (()=>{
            return new Promise ((resolve, reject)=>{
                db.get().collection("baners").find().toArray().then((baner)=>{
                    resolve(baner)
                })
            })
        }),

        removebaner :((banerid)=>{
            return new Promise ((resolve, reject)=>{
                db.get().collection("baners").deleteOne({_id:objectid(banerid)}).then((resp)=>{
                    resolve(resp)
                })
             })
        }),

        addrental : ((rentbody, rentimg)=>{
            return new Promise  ((resolve, response)=>{
                rentbody.imageUrl=rentimg.filename;
                db.get().collection("renalitems").insertOne(rentbody).then((respo)=>{
                    resolve(respo)
                })


            })
        }),

        viewrental :(()=>{
            return new Promise(async(resolve,reject)=>{
                await db.get().collection("renalitems").find().toArray().then((arr)=>{
                    resolve(arr)
                })
            })
        }),

        removerent : ((rentid)=>{
            return new Promise((resolve, reject)=>{
                db.get().collection("renalitems").deleteOne({_id:objectid(rentid)}).then((response)=>{
                    resolve(response);
                })
            })
        }),

        takerent :((rentid)=>{
            return new Promise(async(resolve,reject)=>{
                await db.get().collection("renalitems").findOne({_id:objectid(rentid)}).then((response)=>{
                    resolve(response)
                })
            })
        }),

        updaterental : ((rentid, rentbody, rentfile)=>{
            return new Promise((resolve, reject)=>{
                db.get().collection("renalitems").updateOne({_id:objectid(rentid)},{$set:{
                    name:rentbody.name,
                    rent:rentbody.rent,
                    imageUrl: rentfile.filename
                }},{upsert:true} ).then((respond)=>{
                    resolve(respond)
                })
            })
          
        }),

        takeorders :(()=>{
            return new Promise(async(resolve, reject)=>{
                await db.get().collection("demopayment").find({payment:"booked"}).toArray().then((order)=>{
                    resolve(order)
                })
            })
        }),

        addcaterent: ((cate)=>{
            return new Promise((resolve, reject) => {
                db.get().collection("rentcatogory").insertOne(cate).then((cate)=>{
                    resolve()
                })
            })
        }),

        findcaterent : (()=>{
            return new Promise(async(resolve, reject) => {
                await db.get().collection("places").find().toArray().then((rent)=>{
                    resolve(rent)
                })
            })
        }),

        deletecate : ((rentid)=>{
            return new Promise(async(resolve,reject)=>{
             await   db.get().collection("rentcatogory").deleteOne({_id:objectid(rentid)}).then((result)=>{
                    resolve(result)
                })
            })
        }),

        takesuceessorder : (()=>{
            return new Promise(async(resolve, reject) => {
                let orders={};
                await db.get().collection("demopayment").find({payment:"booked"}).toArray().then(async(hotels)=>{
                    orders.hotels=hotels;
                    db.get().collection("rentmoney").find({payment:"booked"}).toArray().then(async(activity)=>{
                        orders.activity=activity;   
                   let paymenthotelresult =   await  db.get().collection("demopayment").aggregate(
                            [
                              { $sort : { date : 1 } },{$match:{ payment:"booked"}}
                            ]
                         ).toArray();
                         orders.result=paymenthotelresult;
                
                        resolve(orders)
                    })
                })
            })
        }),

        tackecoupon : (()=>{
            return new Promise(async(resolve, reject) => {
                await db.get().collection("coupon").find().toArray().then((coupon)=>{
                    resolve(coupon)
                })
            })
        }),

        addcoupon : ((couponid)=>{
            return new Promise((resolve, reject) => {
                db.get().collection("coupon").insertOne(couponid).then(()=>{
                    resolve()
                })
            })
        }),

        deletecoupon : ((couponid)=>{
            return new Promise((resolve, reject) => {
                db.get().collection("coupon").deleteOne({_id:objectid(couponid)}).then(()=>{
                    resolve()
                })
            })
        }) 
}
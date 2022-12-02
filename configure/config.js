let mongoClient=require("mongodb").MongoClient;
let state ={
    db:null
}
module.exports.connect=(done)=>{
    const url="mongodb://localhost:27017";
    const db="herewego"

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(db);
    })
    done();

}
module.exports.get=()=>{
    return state.db
}
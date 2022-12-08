let mongoClient=require("mongodb").MongoClient;
let state ={
    db:null
}
module.exports.connect=(done)=>{
    const url="mongodb+srv://herewego:ZsGdRuatWkgvGnPF@cluster0.y8yvwno.mongodb.net/herewego?retryWrites=true&w=majority";
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
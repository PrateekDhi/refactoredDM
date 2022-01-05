module.exports = (req, res, next) => {
    if (Object.keys(req.body).length === 0) return next();
    
    for (const item in req.body) {
        console.log(item);
        if(typeof(req.body[item]) === 'string'){
            try{
                req.body[item] = JSON.parse(req.body[item])
            }catch (err){} //Do nothing
        }
    }
    return next();
}
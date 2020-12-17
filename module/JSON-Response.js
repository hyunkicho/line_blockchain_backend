const pathUtil = dicontainer.get("pathUtil");
const DB = require('./sql');
const Err = dicontainer.get("Err");
const module_path = pathUtil.basename(__filename)

let JSONResponse = {};

JSONResponse.successTrue = function (data, token) { //1 
    return {
        success: true,
        message: null,
        errors: null,
        data: data,
        refresh_token: (token) ? token : null
    };
};

JSONResponse.successFalse = function (data) { //2
    return {
        success: false,
        message: data.message,
        errors: data.id,
        data: null,
        refresh_token: null
    };
};

JSONResponse.isLoggedin = async function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }else{
        // res.status(403).send("로그인 필요");
        // res.redirect('/login')
        let or = req.originalUrl;
        or = encodeURIComponent(or);
        res.redirect('/loginerror?rp=' + or);
    }
};

JSONResponse.isNotloggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/')
    }
}

module.exports = JSONResponse;
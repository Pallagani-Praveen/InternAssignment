const jwt = require('jsonwebtoken');
const config = require('config');


 function authMiddleware(req,res,next) {
     try {
        const email = req.headers['authorization'];
        const cookie = req.cookies['token'];
        const decoded = jwt.verify(cookie,config.get('secretKey'));
        if(email===decoded['email']) {
            req.email = email;
            next();
        } else {
            return res.json({'msg':'Invalid Token',"isAuthenticated":false})
        }
     }
     catch(err) {
        return res.json({'msg':'Token Not Found',"isAuthenticated":false})
     }
    
}

exports.authMiddleware = authMiddleware; 


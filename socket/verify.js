module.exports = (socket, next) => {
    if (socket.handshake.headers['authorization'] && socket.handshake.headers['authorization'].split(" ")[0] === 'Bearer') {
        verifyToken(socket.handshake.headers['authorization'].split(" ")[0] === 'Bearer')
        .then(userId => {
            socket.handshake.userId = userId
            return next();
        })
        .catch(err => next(err));
    }else{
        //TODO: Create a new custom application errors for both
        if(!socket.handshake.headers['authorization']) next(new Error('No authorization header'));
        else next(new Error('Malformed authorization header'));
    }
}

//TODO:
const verifyToken = token => {
    
}
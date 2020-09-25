
module.exports = function (route, user) {
    if (route == '/profile' && user.is_admin == false){
        return { msg: 'user is not admin' , status: 403};
    }
    return { msg: '' , status: 200};
};
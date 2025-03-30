function validateNewUser(newUser) {
    if (!newUser.username || !newUser.email) {
        return 'Username and Email is required to create new user';
    } else if (!newUser.email.includes('@') || !newUser.email.includes('.')) {
        return "Invalid Email Provided, It should include '@' or '.'";
    }
    return null;    
}

module.exports = { validateNewUser }
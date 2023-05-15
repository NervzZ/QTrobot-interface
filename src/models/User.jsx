class User {
    constructor(
        uid,
        firstname = "",
        lastname  = "",
        email = "",
        isDev = false,
        classes = []) {

        this.uid = uid
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
        this.isDev = isDev
        this.classes = classes
    }
}

export default User;

import {ref, set, get, child} from 'firebase/database';
import {createUserWithEmailAndPassword, updateEmail, updatePassword} from 'firebase/auth';
import {auth, db} from 'SRC/firebaseConfig'
import User from 'SRC/models/User'

class UserViewModel {

    createUser(firstname, lastname, email, password, isDev) {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = new User(userCredential.user.uid, firstname, lastname, email, isDev)
                return set(ref(db, 'Users/' + user.uid), {user})
            })
    }

    updateUser(uid, firstname, lastname, isDev) {
        return get(child(ref(db), 'Users/' + uid))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const dbuser = snapshot.val().user
                    const user = new User(uid, firstname, lastname, dbuser.email, isDev)
                    return set(ref(db, 'Users/' + uid), {user})
                } else {
                    return new Promise((resolve, reject) => {
                        reject(new Error('Could not find that user in the database.'))
                    })
                }
            })
    }
}

export default UserViewModel;

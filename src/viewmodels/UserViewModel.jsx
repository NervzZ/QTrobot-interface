import {ref, set, get, child} from 'firebase/database';
import {createUserWithEmailAndPassword, updateEmail, updatePassword} from 'firebase/auth';
import {auth, secondaryAuth, db} from 'SRC/firebaseConfig'
import User from 'SRC/models/User'

class UserViewModel {

    createUser(firstname, lastname, email, password, isDev, classes) {
        return createUserWithEmailAndPassword(secondaryAuth, email, password)
            .then((userCredential) => {
                const classesSet = isDev ? [] : Array.from(classes)
                const user = new User(userCredential.user.uid, firstname, lastname, email, isDev, classesSet)
                console.log(typeof user.isDev)
                return set(ref(db, 'Users/' + user.uid), {...user})
            })
            .then(() => {
                secondaryAuth.signOut()
            })
    }

    updateUser(uid, firstname, lastname, isDev, classes) {
        console.log(classes)
        return get(child(ref(db), 'Users/' + uid))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const dbuser = snapshot.val()
                    const classesSet = isDev ? [] : Array.from(classes)
                    const user = new User(uid, firstname, lastname, dbuser.email, isDev, classesSet)
                    console.log(typeof user.isDev)
                    return set(ref(db, 'Users/' + uid), {...user})
                } else {
                    return new Promise((resolve, reject) => {
                        reject(new Error('Could not find that user in the database.'))
                    })
                }
            })
    }

    getUser(uid) {
        return get(child(ref(db), 'Users/' + uid))
    }
}

export default UserViewModel;

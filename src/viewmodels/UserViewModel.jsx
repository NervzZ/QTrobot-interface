import {ref, set} from 'firebase/database';
import {createUserWithEmailAndPassword} from 'firebase/auth';
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
}

export default UserViewModel;

import {child, get, push, ref, set, update} from 'firebase/database';
import {db} from 'SRC/firebaseConfig'
import Child from "SRC/models/Child.jsx";

class ChildViewModel {

    createChild(firstname, lastname, age, schoolClass,) {
        return push(child(ref(db), 'Children/'))
            .then((val) => {
                const child = new Child(val.key, firstname, lastname, parseInt(age), schoolClass)
                return set(ref(db, 'Children/' + val.key), {...child})
            })
    }

    updateChild(cid, firstname, lastname, age, schoolClass) {
        return get(child(ref(db), 'Children/' + cid))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const child = new child(cid, lastname, firstname, parseInt(age), schoolClass)
                    return set(ref(db, 'Children/' + cid), {...child})
                } else {
                    return new Promise((resolve, reject) => {
                        reject(new Error('Could not find that child in the database.'))
                    })
                }
            })
    }

    deleteChildren(ids) {
        const updates = {};

        ids.forEach((id) => {
            updates['Children/' + id] = null;
        })

        return update(ref(db), updates)
    }
}

export default ChildViewModel

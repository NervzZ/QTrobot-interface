import {child, get, push, ref, set, update} from 'firebase/database';
import {db} from 'SRC/firebaseConfig'
import Class from 'SRC/models/Class'

class ClassViewModel {

    createClass(name) {
        return push(child(ref(db), 'Classes/'))
            .then((val) => {
                const schoolClass = new Class(val.key, name)
                return set(ref(db, 'Classes/' + val.key), {...schoolClass})
            })
    }

    updateClass(cid, name) {
        return get(child(ref(db), 'Classes/' + cid))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const schoolClass = new Class(cid, name)
                    return set(ref(db, 'Classes/' + cid), {...schoolClass})
                } else {
                    return new Promise((resolve, reject) => {
                        reject(new Error('Could not find that class in the database.'))
                    })
                }
            })
    }

    deleteClasses(ids) {
        const updates = {};

        ids.forEach((id) => {
            updates['Classes/' + id] = null;
        })

        return update(ref(db), updates)
    }
}

export default ClassViewModel;

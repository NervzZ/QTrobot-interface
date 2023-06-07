import * as React from "react";
import {useEffect, useState} from "react";
import UserViewModel from "SRC/viewmodels/UserViewModel.jsx";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    InputLabel, MenuItem,
    Radio,
    RadioGroup, Select,
    TextField
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import {onValue, ref} from "firebase/database";
import {db} from "SRC/firebaseConfig.js";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
}

export default function CreateUserForm({handleClose, open}) {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isDev, setIsDev] = useState(false)
    const [classes, setClasses] = useState({})
    const [selectedClass, setSelectedClass] = useState('')
    const [thisClasses, setThisClasses] = useState(new Set())

    const userViewModel = new UserViewModel()

    useEffect(() => {
        onValue(ref(db, 'Classes/'), (snapshot) => {
            const classes = {}
            snapshot.forEach(c => {
                const schoolClass = c.val()
                classes[schoolClass.cid] = schoolClass.name
            })
            setClasses(classes)
        })
    }, [])

    const handleFirstNameChange = (event) => {
        setFirstname(event.target.value)
    }

    const handleLastNameChange = (event) => {
        setLastname(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handleIsDevChange = (event) => {
        setIsDev(event.target.value === 'true')
    }

    const handleSelectedClassChange = (event) => {
        const set = new Set(thisClasses)
        const val = event.target.value
        if (set.has(val)) {
            set.delete(val)
        } else {
            set.add(val)
        }
        setThisClasses(set)
    }

    const handleSubmit = () => {
        userViewModel.createUser(
            firstname,
            lastname,
            email,
            password,
            isDev,
            thisClasses
        ).then(() => {
            setFirstname('')
            setLastname('')
            setEmail('')
            setPassword('')
            setIsDev(false)
            handleClose()
        })
            .catch((error) => {
                alert(error.message)
            })
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>New User</DialogTitle>
            <DialogContent>
                <div style={{maxWidth: '463px'}}>
                    <TextField
                        margin="normal"
                        sx={{marginRight: '10px'}}
                        required
                        id="firstname"
                        label="firstname"
                        name="firstname"
                        onChange={handleFirstNameChange}
                        autoFocus
                        value={firstname}
                    />
                    <TextField
                        margin="normal"
                        required
                        id="lastname"
                        label="lastname"
                        name="lastname"
                        onChange={handleLastNameChange}
                        value={lastname}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        onChange={handleEmailChange}
                        value={email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={handlePasswordChange}
                        value={password}
                    />
                    <RadioGroup value={String(isDev)} onChange={handleIsDevChange}>
                        <FormControlLabel
                            value="true"
                            control={<Radio/>}
                            label="Developer"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio/>}
                            label="Professor"
                        />
                    </RadioGroup>
                    {!isDev &&
                        <>
                            <InputLabel>Selected Classes :</InputLabel>
                            <div>
                                {Array.from(thisClasses).map((c) => (
                                    <>{classes[c]}, </>
                                ))}
                            </div>
                            <FormControl sx={{mt: 2, minWidth: 160}}>
                                <InputLabel>Select classes</InputLabel>
                                <Select
                                    value={selectedClass}
                                    label="Select classes"
                                    autoWidth
                                    onChange={handleSelectedClassChange}
                                    MenuProps={MenuProps}
                                >
                                    {Object.entries(classes).map(([cid, name]) => (
                                        <MenuItem
                                            key={cid}
                                            value={cid}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    }
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button color="primary" onClick={handleSubmit}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
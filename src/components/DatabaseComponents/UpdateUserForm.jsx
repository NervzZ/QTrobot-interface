import * as React from "react";
import {useEffect, useState} from "react";
import UserViewModel from "SRC/viewmodels/UserViewModel.jsx";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
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

export default function UpdateUserForm({handleClose, open, row}) {
    const [firstname, setFirstname] = useState(row.Firstname)
    const [lastname, setLastname] = useState(row.Lastname)
    const [isDev, setIsDev] = useState(false)
    const [classes, setClasses] = useState({})
    const [selectedClass, setSelectedClass] = useState('')
    const [thisClasses, setThisClasses] = useState(new Set())

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

    useEffect(() => {
        setFirstname(row.Firstname)
        setLastname(row.Lastname)
        setIsDev(row.Privilege)
        const set = new Set(row.Classes)
        setThisClasses(set)
    }, [row])

    const userViewModel = new UserViewModel()

    const handleFirstNameChange = (event) => {
        setFirstname(event.target.value)
    }

    const handleLastNameChange = (event) => {
        setLastname(event.target.value)
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
        userViewModel.updateUser(row.UID, firstname, lastname, isDev, thisClasses)
            .then(() => {
                setFirstname('')
                setLastname('')
                setIsDev(false)
                handleClose()
            })
            .catch((error) => {
                alert(error)
            })
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update User</DialogTitle>
            <DialogContent>
                <div style={{maxWidth: '463px'}}>
                    <TextField
                        margin="normal"
                        sx={{marginRight: '10px'}}
                        required
                        id="firstname"
                        label="Firstname"
                        name="firstname"
                        onChange={handleFirstNameChange}
                        autoFocus
                        value={firstname}
                    />
                    <TextField
                        margin="normal"
                        required
                        id="lastname"
                        label="Lastname"
                        name="lastname"
                        onChange={handleLastNameChange}
                        value={lastname}
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
                <Button color="primary" onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}
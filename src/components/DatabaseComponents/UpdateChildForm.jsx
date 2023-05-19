import {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import ChildViewModel from "SRC/viewmodels/ChildViewModel.jsx";

export default function UpdateChildForm({handleClose, open, row}) {
    const [firstname, setFirstname] = useState(row.Firstname)
    const [lastname, setLastname] = useState(row.Lastname)
    const [age, setAge] = useState(row.Age)
    const [schoolClass, setSchoolClass] = useState(row.Class)

    useEffect(() => {
        setFirstname(row.Firstname)
        setLastname(row.Lastname)
        setAge(row.Age)
        setSchoolClass(row.Class)
    }, [row])

    const childViewModel = new ChildViewModel()

    const handleFirstnameChange = (event) => {
        setFirstname(event.target.value)
    }

    const handleLastnameChange = (event) => {
        setLastname(event.target.value)
    }

    const handleAgeChange = (event) => {
        const value = event.target.value
        if (/^[1-9][0-9]*$/.test(value) || value.length === 0) {
            setAge(value)
        }
    }

    const handleSchoolClassChange = (event) => {
        setSchoolClass(event.target.value)
    }

    const handleSubmit = () => {
        childViewModel.updateChild(
            row.cid,
            firstname,
            lastname,
            age,
            schoolClass)
            .then(() => {
                setName('')
                handleClose()
            })
            .catch((error) => {
                alert(error)
            })
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update child</DialogTitle>
            <DialogContent>
                <TextField
                    margin="normal"
                    sx={{marginRight: '10px'}}
                    required
                    id="firstname"
                    label="Firstname"
                    name="firstname"
                    onChange={handleFirstnameChange}
                    autoFocus
                    value={firstname}
                />
                <TextField
                    margin="normal"
                    sx={{marginRight: '10px'}}
                    required
                    id="lastname"
                    label="Lastname"
                    name="lastname"
                    onChange={handleLastnameChange}
                    value={lastname}
                />
                <TextField
                    margin="normal"
                    sx={{marginRight: '10px'}}
                    required
                    id="age"
                    label="Age"
                    name="age"
                    onChange={handleAgeChange}
                    value={age}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button color="primary" onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}
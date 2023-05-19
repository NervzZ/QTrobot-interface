import {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import ChildViewModel from "SRC/viewmodels/ChildViewModel.jsx";

export default function CreateChildForm({handleClose, open}) {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [age, setAge] = useState('')
    const [schoolClass, setSchoolClass] = useState('')

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
        childViewModel.createChild(
            firstname,
            lastname,
            age,
            schoolClass)
            .then(() => {
                setFirstname('')
                setLastname('')
                setAge('')
                setSchoolClass('')
                handleClose()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>New Child</DialogTitle>
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
                <Button color="primary" onClick={handleSubmit}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
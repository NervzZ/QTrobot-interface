import * as React from "react";
import {useEffect, useState} from "react";
import UserViewModel from "SRC/viewmodels/UserViewModel.jsx";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Radio, RadioGroup, TextField} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function UpdateUserForm({handleClose, open, row}) {
    const [firstname, setFirstname] = useState(row.Firstname)
    const [lastname, setLastname] = useState(row.Lastname)
    const [isDev, setIsDev] = useState(false)

    useEffect(() => {
        setFirstname(row.Firstname)
        setLastname(row.Lastname)
        setIsDev(row.Privilege)
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

    const handleSubmit = () => {
        userViewModel.updateUser(row.UID, firstname, lastname, isDev)
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
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button color="primary" onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}
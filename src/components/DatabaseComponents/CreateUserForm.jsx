import * as React from "react";
import {useState} from "react";
import UserViewModel from "SRC/viewmodels/UserViewModel.jsx";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Radio, RadioGroup, TextField} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function CreateUserForm({handleClose, open}) {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isDev, setIsDev] = useState(false)

    const userViewModel = new UserViewModel()

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

    const handleSubmit = () => {
        userViewModel.createUser(
            firstname,
            lastname,
            email,
            password,
            isDev
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
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button color="primary" onClick={handleSubmit}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
import {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import ClassViewModel from "SRC/viewmodels/ClassViewModel.jsx";

export default function CreateUserForm({handleClose, open}) {
    const [name, setName] = useState('')

    const classViewModel = new ClassViewModel()

    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleSubmit = () => {
        classViewModel.createClass(name)
            .then(() => {
                setName('')
                handleClose()
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>New Class</DialogTitle>
            <DialogContent>
                <div style={{maxWidth: '463px'}}>
                    <TextField
                        margin="normal"
                        sx={{marginRight: '10px'}}
                        required
                        id="name"
                        label="Class name"
                        name="name"
                        onChange={handleNameChange}
                        autoFocus
                        value={name}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button color="primary" onClick={handleSubmit}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
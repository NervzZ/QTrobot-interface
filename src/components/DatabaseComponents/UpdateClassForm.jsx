import {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import ClassViewModel from "SRC/viewmodels/ClassViewModel.jsx";

export default function UpdateClassForm({handleClose, open, row}) {
    const [name, setName] = useState(row.Name)

    useEffect(() => {
        setName(row.Name)
    }, [row])

    const classViewModel = new ClassViewModel()

    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleSubmit = () => {
        classViewModel.updateClass(row.cid, name)
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
            <DialogTitle>Update Class</DialogTitle>
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
                <Button color="primary" onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}
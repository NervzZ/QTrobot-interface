import * as React from "react";
import {useState} from "react";
import Toolbar from "@mui/material/Toolbar";
import CreateUserForm from "SRC/components/DatabaseComponents/CreateUserForm.jsx";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {Button, TextField} from "@mui/material";
import {Add} from "@mui/icons-material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";


export default function UserTableToolBar() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1}
            }}
        >
            {/* This div is just the diablog (popup) that shows the form when we press the + button */}
            <CreateUserForm open={open} handleClose={handleClose}/>
            <Table>
                <TableBody>
                    <TableRow sx={{width: '100%'}}>
                        <TableCell sx={{width: '100%', borderBottom: 'none', padding: 0}}>
                            <TextField
                                size='small'
                                margin="normal"
                                label="Search"
                                name="Search"
                            />
                        </TableCell>
                        <TableCell align='right' sx={{borderBottom: 'none'}}>
                            <Button variant='contained' endIcon={<Add/>} onClick={handleOpen}>
                                New
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Toolbar>
    );
}
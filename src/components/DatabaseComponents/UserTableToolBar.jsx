import {useState} from "react";
import Toolbar from "@mui/material/Toolbar";
import {alpha} from "@mui/material/styles";
import CreateUserForm from "SRC/components/DatabaseComponents/CreateUserForm.jsx";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {Button, TextField} from "@mui/material";
import {Add} from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete.js";
import * as React from "react";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";

UserTableToolBar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function UserTableToolBar(props) {
    const {numSelected} = props;
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
                pr: {xs: 1, sm: 1},
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {/* This div is just the diablog (popup) that shows the form when we press the + button */}
            <CreateUserForm open={open} handleClose={handleClose}/>

            {numSelected > 0 ? (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
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
            )}

            {numSelected > 0 &&
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            }
        </Toolbar>
    );
}
import {useState} from "react";
import Toolbar from "@mui/material/Toolbar";
import {alpha} from "@mui/material/styles";
import CreateClassForm from "SRC/components/DatabaseComponents/CreateClassForm";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {Button, TextField} from "@mui/material";
import {Add} from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete.js";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import ClassViewModel from "SRC/viewmodels/ClassViewModel.jsx";

ClassTableToolBar.propTypes = {
    selected: PropTypes.array.isRequired,
    setSelected: PropTypes.func.isRequired
};

export default function ClassTableToolBar(props) {
    const {selected, setSelected} = props;

    const [open, setOpen] = useState(false);
    const classViewModel = new ClassViewModel()

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const deleteHandler = () => {
        classViewModel.deleteClasses(selected)
            .then(() => {
                setSelected([])
            })
            .catch((error) => {
                alert(error)
            })
    }

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(selected.length > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {/* This div is just the diablog (popup) that shows the form when we press the + button */}
            <CreateClassForm open={open} handleClose={handleClose}/>

            {selected.length > 0 ? (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {selected.length} selected
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

            {selected.length > 0 &&
                <Tooltip title="Delete">
                    <IconButton onClick={deleteHandler}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            }
        </Toolbar>
    );
}
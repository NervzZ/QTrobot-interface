import * as React from 'react';
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {alpha, createTheme, ThemeProvider} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import {visuallyHidden} from '@mui/utils';
import {Add, EditOutlined} from "@mui/icons-material";
import {Button, Chip, Tab, Tabs, TextField} from "@mui/material";
import {colors} from "SRC/theme/theme.jsx";
import {onValue, ref} from "firebase/database";
import {db} from "SRC/firebaseConfig.js";
import UpdateUserForm from 'SRC/components/DatabaseComponents/UpdateUserForm'
import CreateUserForm from 'SRC/components/DatabaseComponents/CreateUserForm'
import DBTabs from "SRC/components/DatabaseComponents/DBTabs.jsx";
import UserTableToolBar from "SRC/components/DatabaseComponents/UserTableToolBar.jsx";

function createUserData(UID, Firstname, Lastname, Email, Privilege) {
    return {
        UID,
        Firstname,
        Lastname,
        Email,
        Privilege
    };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'Firstname',
        disablePadding: false,
        label: 'Firstname',
    },
    {
        id: 'Lastname',
        disablePadding: false,
        label: 'Lastname',
    },
    {
        id: 'Email',
        disablePadding: false,
        label: 'Email',
    },
    {
        id: 'Privilege',
        disablePadding: false,
        label: 'Privilege',
    }
];

function EnhancedTableHead(props) {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell>{/* empty */}</TableCell>
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default function Database() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('Firstname');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [updateOpen, setUpdateOpen] = useState(false)
    const [editRow, setEditRow] = useState(createUserData('', '', '', '', ''))
    const [tab, setTab] = useState(0);

    const handleUpdateOpen = () => {
        setUpdateOpen(true)
    }

    const handleUpdateClose = () => {
        setUpdateOpen(false)
    }

    const handleEdit = (row) => {
        setEditRow(createUserData(row.UID, row.Firstname, row.Lastname, row.Email, row.Privilege))
        handleUpdateOpen()
    }

    // all the rows containing the fetched data
    const [rows, setRows] = useState([]);

    // realtime update of the table content through onValue
    useEffect(() => {
        onValue(ref(db, 'Users/'), (snapshot) => {
            const users = []
            snapshot.forEach(e => {
                const user = e.val().user
                users.push(createUserData(user.uid, user.firstname, user.lastname, user.email, user.isDev))
            })
            setRows(users)
        })
    }, [])


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    //row select handler
    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected)
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, rows],
    );

    //clears selection if we click the edit button
    useEffect(() => {
        setSelected([])
    }, [editRow])

    const chipTheme = createTheme({
        palette: {
            primary: {
                main: colors.orange,
            },
            secondary: {
                main: colors.grey
            }
        },
    });

    return (
        <div className="App" style={{
            maxWidth: '900px',
            margin: '50px auto',
        }}>
            <DBTabs state={tab} setState={setTab}/>
            {/*update dialog*/}
            <UpdateUserForm handleClose={handleUpdateClose} open={updateOpen} row={editRow}/>
            <Box sx={{width: '100%'}}>
                <Paper sx={{width: '100%', mb: 2}}>
                    {tab === 0 &&
                        <UserTableToolBar numSelected={selected.length}/>
                    }
                    <TableContainer>
                        <Table
                            sx={{minWidth: 750}}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row.UID);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.UID)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.UID}
                                            selected={isItemSelected}
                                            sx={{cursor: 'pointer'}}
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                            >
                                                {row.Firstname}
                                            </TableCell>
                                            <TableCell>{row.Lastname}</TableCell>
                                            <TableCell>{row.Email}</TableCell>
                                            <TableCell>
                                                <ThemeProvider theme={chipTheme}>
                                                    <Chip
                                                        label={row.Privilege ? 'Dev' : 'Prof'}
                                                        color={row.Privilege ? 'primary' : 'secondary'}/>
                                                </ThemeProvider>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => {
                                                    handleEdit(row)
                                                    setSelected([]);
                                                }}>
                                                    <EditOutlined/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense}/>}
                    label="Dense padding"
                />
            </Box>
        </div>
    )
}
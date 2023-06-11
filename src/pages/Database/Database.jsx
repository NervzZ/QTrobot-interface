import {useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {visuallyHidden} from '@mui/utils';
import {EditOutlined} from "@mui/icons-material";
import {Chip} from "@mui/material";
import {colors} from "SRC/theme/theme.jsx";
import {onValue, ref} from "firebase/database";
import {db} from "SRC/firebaseConfig.js";
import UpdateUserForm from 'SRC/components/DatabaseComponents/UpdateUserForm'
import DBTabs from "SRC/components/DatabaseComponents/DBTabs.jsx";
import UserTableToolBar from "SRC/components/DatabaseComponents/UserTableToolBar.jsx";
import ClassTableToolBar from "SRC/components/DatabaseComponents/ClassTableToolBar.jsx";
import ChildTableToolBar from "SRC/components/DatabaseComponents/ChildTableToolBar.jsx"
import UpdateClassForm from "SRC/components/DatabaseComponents/UpdateClassForm.jsx";
import UpdateChildForm from "SRC/components/DatabaseComponents/UpdateChildForm.jsx";

function createUserData(UID, Firstname, Lastname, Email, Privilege, Classes) {
    return {
        UID,
        Firstname,
        Lastname,
        Email,
        Privilege,
        Classes
    };
}

function createClassData(cid, Name) {
    return {
        cid,
        Name
    };
}

function createChildData(cid, Firstname, Lastname, Age, Class) {
    return {
        cid,
        Firstname,
        Lastname,
        Age,
        Class
    }
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

const UserHeadCells = [
    {
        id: 'Firstname',
        numeric: false,
        disablePadding: false,
        label: 'Firstname',
    },
    {
        id: 'Lastname',
        numeric: false,
        disablePadding: false,
        label: 'Lastname',
    },
    {
        id: 'Email',
        numeric: false,
        disablePadding: false,
        label: 'Email',
    },
    {
        id: 'Privilege',
        numeric: false,
        disablePadding: false,
        label: 'Privilege',
    },
    {
        id: 'Classes',
        numeric: false,
        disablePadding: false,
        label: 'Classes'
    }
]

const ChildHeadCells = [
    {
        id: 'Firstname',
        numeric: false,
        disablePadding: false,
        label: 'Firstname',
    },
    {
        id: 'Lastname',
        numeric: false,
        disablePadding: false,
        label: 'Lastname',
    },
    {
        id: 'Age',
        numeric: true,
        disablePadding: false,
        label: 'Age',
    },
    {
        id: 'Class',
        numeric: false,
        disablePadding: false,
        label: 'Class',
    }
];

const ClassHeadCells = [
    {
        id: 'Name',
        numeric: false,
        disablePadding: false,
        label: 'Name',
    }
]

function EnhancedTableHead(props) {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, tab} =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    var cells = UserHeadCells

    switch (tab) {
        case 0:
            cells = UserHeadCells
            break
        case 1:
            cells = ChildHeadCells
            break;
        case 2:
            cells = ClassHeadCells
            break;
    }

    return (
        <TableHead>
            <TableRow>
                {cells.map((headCell) => (
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
                {/*blank to have a column for the edit button*/}
                <TableCell/>
            </TableRow>
        </TableHead>
    );
}

function RenderUpdateDialog(props) {
    const {tab, open, handleClose, row} = props;

    switch (tab) {
        case 0:
            return <UpdateUserForm handleClose={handleClose} open={open} row={row}/>
        case 1:
            return <UpdateChildForm handleClose={handleClose} open={open} row={row}/>
        case 2:
            return <UpdateClassForm handleClose={handleClose} open={open} row={row}/>
        default:
            return <></>
    }
}

RenderUpdateDialog.proTypes = {
    tab: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    row: PropTypes.object.isRequired
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    tab: PropTypes.number.isRequired
};

export default function Database() {
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('')
    const [selected, setSelected] = useState([])
    const [page, setPage] = useState(0)
    const [dense, setDense] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [updateOpen, setUpdateOpen] = useState(false)
    const [editRow, setEditRow] =
        useState(createUserData('', '', '', '', '', new Set()))
    const [tab, setTab] = useState(0)
    // all the rows containing the fetched data
    const [rows, setRows] = useState([])
    const [classes, setClasses] = useState({})

    useEffect(() => {
        onValue(ref(db, 'Classes/'), (snapshot) => {
            const classes = {}
            snapshot.forEach(c => {
                const schoolClass = c.val()
                classes[schoolClass.cid] = schoolClass.name
            })
            setClasses(classes)
        })
    }, [])

    const handleUpdateOpen = () => {
        setUpdateOpen(true)
    }

    const handleUpdateClose = () => {
        setUpdateOpen(false)
    }

    const handleEdit = (row) => {
        setEditRow(row)
        handleUpdateOpen()
    }

    useEffect(() => {
        switch (tab) {
            case 0:
                setOrderBy('Firstname')
                break
            case 1:
                setOrderBy('Firstname')
                break
            case 2:
                setOrderBy('Name')
                break
        }
    }, [tab])

    // realtime update of the table content through firebase "onValue" event subscription and chosen tab
    useEffect(() => {
        switch (tab) {
            case 0:
                onValue(ref(db, 'Users/'), (snapshot) => {
                    const users = []
                    snapshot.forEach(usr => {
                        const user = usr.val()
                        users.push(
                            createUserData(user.uid, user.firstname, user.lastname, user.email, user.isDev, user.classes))
                    })
                    setRows(users)
                })
                break
            case 1:
                onValue(ref(db, 'Children/'), (snapshot) => {
                    const children = []
                    snapshot.forEach(childSnapshot => {
                        const child = childSnapshot.val()
                        children.push(createChildData(
                            child.cid, child.firstname, child.lastname, child.age, child.schoolClass))
                    })
                    setRows(children)
                })
                break
            case 2:
                onValue(ref(db, 'Classes/'), (snapshot) => {
                    const classes = []
                    snapshot.forEach(c => {
                        const schoolClass = c.val()
                        classes.push(createClassData(schoolClass.cid, schoolClass.name))
                    })
                    setRows(classes)
                })
                break
            default:
                break
        }
        //clears selection, page selection
        setPage(0)
        setSelected([])
    }, [tab, editRow])


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
        console.log(property)
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
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0)
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, rows],
    );

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
            <DBTabs state={tab} setState={setTab} setPage={setPage}/>
            <RenderUpdateDialog tab={tab} handleClose={handleUpdateClose} open={updateOpen} row={editRow}/>
            <Box sx={{width: '100%'}}>
                <Paper sx={{width: '100%', mb: 2}}>
                    {(() => {
                        switch (tab) {
                            case 0:
                                return <UserTableToolBar/>
                            case 1:
                                return <ChildTableToolBar selected={selected} setSelected={setSelected}/>
                            case 2:
                                return <ClassTableToolBar selected={selected} setSelected={setSelected}/>
                            default:
                                return <DefaultComponent/>
                        }
                    })()}
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
                                tab={tab}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    let isItemSelected = false
                                    const labelId = `enhanced-table-checkbox-${index}`

                                    switch (tab) {
                                        case 0:
                                            //Users table
                                            isItemSelected = isSelected(row.UID)
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
                                                    <TableCell>
                                                        {Array.from(row.Classes || []).map((c) => (
                                                            <>{classes[c]}, </>
                                                        ))}
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
                                            )
                                        case 1:
                                            //Children table
                                            isItemSelected = isSelected(row.cid)
                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.cid)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.cid}
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
                                                    <TableCell align="right">{row.Age}</TableCell>
                                                    <TableCell>{classes[row.Class]}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => {
                                                            handleEdit(row)
                                                            setSelected([]);
                                                        }}>
                                                            <EditOutlined/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                            break
                                        case 2:
                                            //Classes table
                                            isItemSelected = isSelected(row.cid)
                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.cid)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.cid}
                                                    selected={isItemSelected}
                                                    sx={{cursor: 'pointer'}}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                    >
                                                        {row.Name}
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
                                            )
                                        default:
                                            break
                                    }
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
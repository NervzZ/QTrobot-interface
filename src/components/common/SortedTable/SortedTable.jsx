import React from 'react';
import PropTypes from 'prop-types';
import {alpha} from '@mui/material/styles';
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
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {visuallyHidden} from '@mui/utils';

function createData(firstName, lastName, age, context, opt) {
    return {
        firstName,
        lastName,
        age,
        context,
        opt,
    };
}

const rows = [
    createData('Jimmy', 'Poppin', 12, 'Stretching', 'optional-arg-1'),
    createData('Harry', 'Potter', 7, 'Meditation', 'optional-arg-4'),
    createData('Martin', 'Smith', 8, 'Writing', 'optional-arg-2'),
    createData('Tom', 'Glasgow', 13, 'Stretching', 'optional-arg-7'),
    createData('Jerry', 'Oneil', 12, 'Counting', 'optional-arg-2'),
    createData('Mohamed', 'Ali', 6, 'Stretching', 'optional-arg-1'),
    createData('Michael', 'Jordan', 6, 'Meditation', 'optional-arg-1'),
    createData('Sandy', 'Granger', 7, 'Counting', 'optional-arg-3'),
    createData('Ernest', 'Kunzler', 9, 'Counting', 'optional-arg-4'),
    createData('Carl', 'Traut', 11, 'Meditation', 'optional-arg-4'),
    createData('Jade', 'Klein', 10, 'Stretching', 'optional-arg-5'),
    createData('Zoe', 'Stutler', 5, 'Meditation', 'optional-arg-1'),
    createData('Chloe', 'Hank', 12, 'Writing', 'optional-arg-6'),
    createData('Marc', 'Portman', 7, 'Writing', 'optional-arg-2'),
];

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
        id: 'firstName',
        numeric: false,
        disablePadding: false,
        label: 'First Name',
    },
    {
        id: 'lastName',
        numeric: false,
        disablePadding: false,
        label: 'lastName',
    },
    {
        id: 'age',
        numeric: true,
        disablePadding: false,
        label: 'Age',
    },
    {
        id: 'context',
        numeric: false,
        disablePadding: false,
        label: 'Context',
    },
    {
        id: 'opt',
        numeric: false,
        disablePadding: false,
        label: 'Optional argument (placeholder)',
    },
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

const EnhancedTableToolbar = ({numSelected}) =>
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
        <Typography
            sx={{flex: '1 1 100%'}}
            variant="h6"
            id="tableTitle"
            component="div"
        >
            Kids Data
        </Typography>

        <Tooltip title="Filter list">
            <IconButton>
                <FilterListIcon/>
            </IconButton>
        </Tooltip>
    </Toolbar>

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const EnhancedTable = ({onRowSelect}) => {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('lastName');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.firstName);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    /* TODO - DELETE THIS LATER
    const handleClick = (event, firstName) => {
        const selectedIndex = selected.indexOf(firstName);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, firstName);
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

        setSelected(newSelected);
    };
     */

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

    const isSelected = (firstName) => selected.indexOf(firstName) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{width: '100%'}}>
            <Paper sx={{width: '100%', mb: 2}}>
                <EnhancedTableToolbar numSelected={selected.length}/>
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
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.firstName);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={() => {
                                                onRowSelect(
                                                    `ros_command -${row.opt} ${row.firstName} ${row.lastName} -c ${row.context} -a ${row.age}`)
                                            }}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.firstName}
                                            selected={isItemSelected}
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                            >
                                                {row.firstName}
                                            </TableCell>
                                            <TableCell align="left">{row.lastName}</TableCell>
                                            <TableCell align="right">{row.age}</TableCell>
                                            <TableCell align="left">{row.context}</TableCell>
                                            <TableCell align="left">{row.opt}</TableCell>
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
    );
}

export default EnhancedTable

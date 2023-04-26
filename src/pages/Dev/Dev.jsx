import { useState, useEffect, useMemo } from 'react'
import 'SRC/App.css'

import Table from 'SRC/components/common/SortedTable/SortedTable.jsx'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CopyIcon from '@mui/icons-material/ContentCopy'

import { ThemeProvider, createTheme } from '@mui/material/styles'

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    }
})

const Dev = () => {
    const [commandFieldValue, setCommandFieldValue] = useState('');

    const handleCopyClick = (string) => {
        navigator.clipboard.writeText(string).then(
            () => {
                //TODO animation on write success
            },
            () => {
                //write failed
            }
        )
    }

    const handleChange = (event) => {
        setCommandFieldValue(event.target.value)
    }

    const handleRowSelect = (string) => {
        setCommandFieldValue(string)
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="App">
                <Table
                    onRowSelect={handleRowSelect}
                />
                <Box
                    sx={{
                        display: 'flex'
                    }}
                >
                    <TextField
                        id="outlined-basic"
                        label="Generated command"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={commandFieldValue}
                    />
                    <IconButton
                        type="button"
                        sx={{ p: '10px' }}
                        aria-label="Copy"
                        onClick={() => handleCopyClick(commandFieldValue)}
                    >
                        <CopyIcon/>
                    </IconButton>
                </Box>
            </div>
        </ThemeProvider>
    )
}

export default Dev

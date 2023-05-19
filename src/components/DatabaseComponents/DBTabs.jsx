import Box from "@mui/material/Box";
import {Tab, Tabs} from "@mui/material";

export default function DBTabs({state, setState, setPage}) {

    const handleChange = (event, newValue) => {
        setState(newValue)
        setPage(0)
    }

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={state} onChange={handleChange}>
                    <Tab label="Users"/>
                    <Tab label="Children data"/>
                    <Tab label="Classes"/>
                </Tabs>
            </Box>
        </Box>
    )
}
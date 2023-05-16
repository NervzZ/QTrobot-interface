import Box from "@mui/material/Box";
import {Tab, Tabs} from "@mui/material";
import * as React from "react";
import {useEffect} from "react";

export default function DBTabs({state, setState}) {

    const handleChange = (event, newValue) => {
        setState(newValue)
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
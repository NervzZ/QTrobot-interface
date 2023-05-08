import * as React from 'react';
import 'SRC/App.css'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import strings from 'SRC/strings/strings.json';
import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import {Home, PersonAdd, Visibility} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {auth} from "SRC/firebaseConfig"
import {signOut} from "firebase/auth";


const Header = () => {
    return (
        <>
            <TopBar id="my-id"/>
            <NavBar/>
        </>
    )
}

function TopBar() {

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Signed out successfully")
        }).catch((error) => {
            alert(error.message)
        });
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" enableColorOnDark="true">
                <Toolbar variant="dense">
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography align="left" variant="h6" component="div" sx={{flexGrow: 1}}>
                        {strings.appVersion}
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

function NavBar() {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate()

    const handleChange = (event, newValue) => {
        setValue(newValue);
        switch (newValue) {
            case 0: //home button (dev)
                navigate('/')
                break;
            case 1: //database button
                navigate('/Database')
                break;
            case 2: //visualisation button
                navigate('/Visualisation')
                break;
            default:
                break;
        }
    };

    return (
        <BottomNavigation value={value} onChange={handleChange}>
            <BottomNavigationAction label="Dev" showLabel="true" icon={<Home/>}/>
            <BottomNavigationAction label="Database" showLabel="true" icon={<PersonAdd/>}/>
            <BottomNavigationAction label="Notifications" showLabel="true" icon={<Visibility/>}/>
        </BottomNavigation>
    );
}

export default Header
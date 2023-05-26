import * as React from 'react';
import {useEffect, useState} from 'react';
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
import {DeveloperBoard, Home, PersonAdd, Visibility} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {auth} from "SRC/firebaseConfig"
import {onAuthStateChanged, signOut} from "firebase/auth";
import UserViewModel from "SRC/viewmodels/UserViewModel.jsx";


const Header = () => {

    const [userId, setUserId] = useState("");
    const [isDev, setIsDev] = useState(false);

    const userViewModel = new UserViewModel()

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid)
            } else {
                console.log("user not logged")
            }
        });
    }, [])

    useEffect(() => {
        userViewModel.getUser(userId)
            .then((usr) => {
                setIsDev(usr.val().isDev)
                console.log(usr.val().isDev)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [userId])


    return (
        <>
            <TopBar id="my-id"/>
            {isDev && (
                <NavBar/>
            )}
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
            <AppBar position="static" enableColorOnDark={true}>
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

    useEffect(() => {
        switch (location.pathname) {
            case '/Dev':
                setValue(1)
                break;
            case '/Database':
                setValue(2)
                break;
            case '/Visualisation':
                setValue(3)
                break;
            default:
                setValue(0)
                break;
        }
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
        switch (newValue) {
            case 0: //home button (dev)
                navigate('/')
                break;
            case 1: //database button
                navigate('/Dev')
                break;
            case 2: //visualisation button
                navigate('/Database')
                break;
            case 3:
                navigate('/Visualisation')
                break;
            default:
                break;
        }
    };

    return (
        <BottomNavigation value={value} onChange={handleChange}>
            <BottomNavigationAction label={strings.homePageName} showLabel={true} icon={<Home/>}/>
            <BottomNavigationAction label={strings.devPageName} showLabel={true} icon={<DeveloperBoard/>}/>
            <BottomNavigationAction label={strings.databasePageName} showLabel={true} icon={<PersonAdd/>}/>
            <BottomNavigationAction label={strings.visualisationPageName} showLabel={true} icon={<Visibility/>}/>
        </BottomNavigation>
    );
}

export default Header
import React, {useEffect, useState} from 'react'
import {Route, Routes} from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Dev from './pages/Dev/Dev'
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Database from "SRC/pages/Database/Database.jsx";
import Visualisation from "SRC/pages/Visualisation/Visualisation.jsx";
import {auth} from 'SRC/firebaseConfig'
import {onAuthStateChanged} from "firebase/auth";
import Authentication from "SRC/pages/Authentication/Authentication.jsx";
import Loading from "SRC/components/common/Loading/Loading.jsx";
import HomePage from "SRC/pages/HomePage/HomePage.jsx";
import UserViewModel from "SRC/viewmodels/UserViewModel.jsx";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    }
})

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setIsLoading(false);
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });
    }, [])


    if (isLoading) {
        return (
            <ThemeProvider theme={darkTheme}>
                <Loading/>
            </ThemeProvider>
        )
    }

    return (
        <ThemeProvider theme={darkTheme}>
            {isLoggedIn ? (
                <AppBody/>
            ) : (
                <Authentication/>
            )}
        </ThemeProvider>
    )
}

function AppBody() {
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
        <div>
            <Header/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                {isDev && (
                    <>
                        <Route path="/Visualisation" element={<Visualisation/>}/>
                        <Route path="/Database" element={<Database/>}/>
                        <Route path="/dev" element={<Dev/>}/>
                    </>
                )}
            </Routes>
            <Footer/>
        </div>
    )
}


export default App
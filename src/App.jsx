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
    return (
        <div>
            <Header/>
            <Routes>
                <Route path="/" element={<Dev/>}/>
                <Route path="/Database" element={<Database/>}/>
                <Route path="/Visualisation" element={<Visualisation/>}/>
            </Routes>
            <Footer/>
        </div>
    )
}


export default App
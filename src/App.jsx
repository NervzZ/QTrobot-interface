import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Dev from './pages/Dev/Dev'
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Database from "SRC/pages/Database/Database.jsx";
import Visualisation from "SRC/pages/Visualisation/Visualisation.jsx";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    }
})

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <div>
                <Header/>
                <Routes>
                    <Route path="/" element={<Dev/>}/>
                    <Route path="/Database" element={<Database/>}/>
                    <Route path="/Visualisation" element={<Visualisation/>}/>
                </Routes>
                <Footer/>
            </div>
        </ThemeProvider>
    )
}

export default App
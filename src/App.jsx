import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Dev from './pages/Dev/Dev'

function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Dev />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App
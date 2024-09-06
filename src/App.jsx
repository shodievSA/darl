import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/registration' element={<Registration />} />
            </Routes>
        </Router>
    )
}

export default App

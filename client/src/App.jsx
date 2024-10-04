import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavigationContext } from './context/NavigationContext.jsx';
import Registration from './pages/Registration/Registration.jsx';
import Home from './pages/Home/Home.jsx';
import Repository from './pages/Repository/Repository.jsx';
import Layout from './components/Layout/Layout.jsx';
import Contact from './pages/Contact/Contact.jsx';
import History from './pages/History/History.jsx';
import Logout from './pages/Logout/Logout.jsx';
import Pricing from './pages/Pricing/Pricing.jsx';
import Description from './pages/Description/Description.jsx';

function App() {
    return (
        <Router>
            <NavigationContext>
                <Routes>
                    <Route path='/registration' element={<Registration />} />
                    <Route path='/' element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path='pricing' element={<Pricing />} />
                        <Route path='history' element={<History />} />
                        <Route path='contact' element={<Contact />} />
                        <Route path='logout' element={<Logout />} />
                    </Route>
                    <Route path='/:repositoryName' element={<Repository />} />
                    <Route path='/history/:descriptionName' element={<Description />} />
                </Routes>
            </NavigationContext>
        </Router>
    );
}

export default App;

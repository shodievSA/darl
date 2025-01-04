import { 
    BrowserRouter as Router, 
    Routes, 
    Route, 
    Navigate } from 'react-router-dom';
import { NavigationContext } from './context/NavigationContext.jsx';
import Registration from './pages/Registration/Registration.jsx';
import Repositories from './pages/Repositories/Repositories.jsx';
import Repository from './pages/Repository/Repository.jsx';
import Layout from './components/Layout/Layout.jsx';
import Contact from './pages/Contact/Contact.jsx';
import History from './pages/History/History.jsx';
import Pricing from './pages/Pricing/Pricing.jsx';
import HistoryItem from './pages/History Item/HistoryItem.jsx';

function App() {

    return (
        <Router>
            <NavigationContext>
                <Routes>
                    <Route path='/registration' element={<Registration />} />
                    <Route path='/' element={<Layout />}>
                        <Route index element={<Navigate replace={true} to="repositories" />} />
                        <Route path='repositories' element={<Repositories />} />
                        <Route path='repositories/:repositoryName' element={<Repository />} />
                        <Route path='pricing' element={<Pricing />} />
                        <Route path='history' element={<History />} />
                        <Route path='history/:repositoryName' element={<HistoryItem />} />
                        <Route path='contact' element={<Contact />} />
                    </Route>
                </Routes>
            </NavigationContext>
        </Router>
    );
    
}

export default App;

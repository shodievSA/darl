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
import Logout from './pages/Logout/Logout.jsx';
import Pricing from './pages/Pricing/Pricing.jsx';
import LogoGeneration from './pages/Logo Generation/LogoGeneration.jsx';
import DescriptionGeneration from './pages/Description Generation/DescriptionGeneration.jsx';
import ReadmeGeneration from './pages/Readme Generation/ReadmeGeneration.jsx';
import ArticleGeneration from './pages/Article Generation/ArticleGeneration.jsx';
import DescriptionsHistory from './pages/Descriptions History/DescriptionsHistory.jsx';
import GeneratedDescription from './pages/Generated Description/GeneratedDescription.jsx';
import ArticlesHistory from './pages/Articles History/ArticlesHistory.jsx';
import GeneratedArticle from './pages/Generated Article/GeneratedArticle.jsx';
import ReadmesHistory from './pages/Readmes History/ReadmesHistory.jsx';
import GeneratedReadme from './pages/Generated Readme/GeneratedReadme.jsx';
import LogosHistory from './pages/Logos History/LogosHistory.jsx';
import GeneratedLogo from './pages/Generated Logo/GeneratedLogo.jsx';

function App() {

    return (
        <Router>
            <NavigationContext>
                <Routes>
                    <Route path='/registration' element={<Registration />} />
                    <Route path='/' element={<Layout />}>
                        <Route index element={<Navigate replace to="repositories" />} />
                        <Route path='repositories' element={<Repositories />} />
                        <Route path='repositories/:repositoryName' element={<Repository />} />
                        <Route path='pricing' element={<Pricing />} />
                        <Route path='history' element={<History />} />
                        <Route path='history/descriptions' element={<DescriptionsHistory />} />
                        <Route path='history/articles' element={<ArticlesHistory />} />
                        <Route path='history/readmes' element={<ReadmesHistory />} />
                        <Route path='history/logos' element={<LogosHistory />} />
                        <Route path='contact' element={<Contact />} />
                        <Route path='logout' element={<Logout />} />
                    </Route>
                    <Route path='/:repositoryName/project-description' element={<DescriptionGeneration />} />
                    <Route path='/:repositoryName/readme-generation' element={<ReadmeGeneration />} />
                    <Route path='/:repositoryName/logo-generation' element={<LogoGeneration />} />
                    <Route 
                    path='/history/descriptions/:repositoryName' 
                    element={<GeneratedDescription />} 
                    />
                    <Route 
                    path='/history/articles/:repositoryName' 
                    element={<GeneratedArticle />} 
                    />
                    <Route 
                    path='/history/readmes/:repositoryName' 
                    element={<GeneratedReadme />} 
                    />
                    <Route 
                    path='/history/logos/:repositoryName' 
                    element={<GeneratedLogo />} 
                    />
                    <Route path='/:repositoryName/article-generation' element={<ArticleGeneration />} />
                </Routes>
            </NavigationContext>
        </Router>
    );
    
}

export default App;

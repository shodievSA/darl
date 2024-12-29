import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { faNewspaper } from "@fortawesome/free-solid-svg-icons"
import { faReadme } from "@fortawesome/free-brands-svg-icons"
import { faShapes } from "@fortawesome/free-solid-svg-icons"
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { faLightbulb } from "@fortawesome/free-solid-svg-icons"
import { useNavigationContext } from "../../context/NavigationContext"
import TextArea from "../../components/Text Area/TextArea"
import LoadingGenerationButton from "../../components/LoadingGenerationButton/LoadingGenerationButton"
import generateDescription from "../../utils/generateDescription"
import generateArticle from "../../utils/generateArticle"
import generateReadme from "../../utils/generateReadme"
import generateLogo from "../../utils/generateLogo"
import getUserBalance from "../../utils/getUserBalance"
import getUserFreeTrials from "../../utils/getUserFreeTrials"
import generateName from "../../utils/generateName"
import styles from "./Repository.module.css"

function Repository() {

    const location = useLocation();
    const navigate = useNavigate();

    const { currentNavigation } = useNavigationContext();
    const { repositoryName, repositoryOwner } = location.state;

    const dropdownMenu = useRef(null);
    const modalWindowRef = useRef(null);
    const errorModalWindowRef = useRef(null);

    const [result, setResult] = useState('');
    const [generationOption, setGenerationOption] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [freeTrialsLeft, setFreeTrialsLeft] = useState(null);
    const [balance, setBalance] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    async function handleGeneration(service) {

        if (service == 'description') {

            if (freeTrialsLeft > 0 || balance >= 0.2) {

                setIsGenerating(true);

                try {

                    await generateDescription({
                        repositoryName,
                        repositoryOwner,
                        setDescription: setResult
                    });

                } catch (err) {

                    console.log(err);

                    setIsGenerating(false);
                    setErrorMessage(err.message);
                    errorModalWindowRef.current.showModal();

                }

            } else {

                modalWindowRef.current.showModal();

            }

        } else if (service == 'article') {

            if (freeTrialsLeft > 0 || balance >= 0.4) {

                setIsGenerating(true);

                try {
                    
                    await generateArticle({
                        repositoryName,
                        repositoryOwner,
                        setArticle: setResult
                    });

                } catch (err) { 

                    console.log(err);

                    setIsGenerating(false);
                    setErrorMessage(err.message);
                    errorModalWindowRef.current.showModal();

                }

            } else {

                modalWindowRef.current.showModal();

            }

        } else if (service == 'readme') {

            if (freeTrialsLeft > 0 || balance >= 0.4) {

                setIsGenerating(true);

                try {
                    
                    await generateReadme({
                        repositoryName,
                        repositoryOwner,
                        setReadme: setResult
                    });

                } catch (err) {
                    
                    console.log(err);

                    setIsGenerating(false);
                    setErrorMessage(err.message);
                    errorModalWindowRef.current.showModal();

                }

            } else {

                modalWindowRef.current.showModal();

            }

        } else if (service == 'logo') {

            if (freeTrialsLeft > 0 || balance >= 0.4) {

                setIsGenerating(true);

                try {

                    await generateLogo({
                        repositoryName,
                        repositoryOwner,
                        setLogoURL: setResult
                    });

                    setIsGenerating(false);
        
                } catch (err) {

                    console.log(err);

                    setIsGenerating(false);
                    setErrorMessage(err.message);
                    errorModalWindowRef.current.showModal();

                }

            } else {

                modalWindowRef.current.showModal();

            }

        } else if (service == 'name') {

            if (freeTrialsLeft > 0 || balance >= 0.2) {

                setIsGenerating(true);

                try {

                    await generateName({
                        repositoryName,
                        repositoryOwner,
                        setName: setResult
                    });

                } catch (err) {

                    console.log(err);

                    setIsGenerating(false);
                    setErrorMessage(err.message);
                    errorModalWindowRef.current.showModal();

                }

            } else {

                modalWindowRef.current.showModal();

            }

        }

    }

    useEffect(() => {
    
        getUserFreeTrials(setFreeTrialsLeft);
        getUserBalance(setBalance);
    
    }, []);

    useEffect(() => {

        function handleEvent() {

            if (
                dropdownMenu.current
                &&
                dropdownMenu.current.hasAttribute('open')
            ) {
                dropdownMenu.current.removeAttribute('open');
            }

        }

        document.body.addEventListener('click', handleEvent);

        return () => {
            document.body.removeEventListener('click', handleEvent);
        }

    }, []);

    return ( 
        <>                       
        <div className={styles['page-container']}>
            <div className={styles['header']}>
                {
                    (currentNavigation == "desktop"
                    ||
                    currentNavigation == "laptop") && (
                        <div onClick={() => navigate(-1)}>
                            <FontAwesomeIcon 
                            icon={faChevronLeft} 
                            className={styles['go-back-icon']}
                            />
                        </div>  
                    )
                }
                {
                    (currentNavigation == "desktop") && (
                        <div>
                            <FontAwesomeIcon 
                            icon={faGithub}
                            className={styles['github-icon']}
                            />
                            <h1 className={styles['repository-name']}>
                                {repositoryName}
                            </h1>
                        </div>
                    )
                }
                {
                    currentNavigation == "mobile" && (
                        <div>
                            <FontAwesomeIcon 
                            icon={faGithub}
                            className={styles['github-icon']}
                            />
                            <h1 className={styles['repository-name']}>
                                {repositoryName}
                            </h1>
                        </div>
                    )
                }                     
            </div>
            <div className={styles['main']}>
                {
                    result == '' ? (
                        isGenerating ? (
                            <div className="flex flex-col items-center gap-y-4">
                                <LoadingGenerationButton />
                                <h1 className="text-center w-72">
                                    Your {generationOption} is being generated. Please stay on this page.
                                </h1>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <details className="dropdown" ref={dropdownMenu}>
                                    <summary className={styles['summary']}>
                                        <FontAwesomeIcon icon={faPlus} />
                                        Compose
                                    </summary>
                                    <ul 
                                    tabIndex={0} 
                                    style={{ backgroundColor: 'rgb(12.5, 12.5, 12.5)', border: '1px solid rgb(40, 40, 40)' }}
                                    className="text-base dropdown-content menu rounded-box z-[1] w-48 p-2 shadow rounded-md"
                                    >
                                        <li onClick={() => {
                                            setGenerationOption('description');
                                            handleGeneration('description');
                                        }}>
                                            <a className="flex gap-x-4 rounded-md">
                                                <FontAwesomeIcon icon={faAlignLeft} />
                                                Description
                                            </a>
                                        </li>
                                        <li onClick={() => {
                                            setGenerationOption('article');
                                            handleGeneration('article');
                                        }}>
                                            <a className="flex gap-x-4 rounded-md">
                                                <FontAwesomeIcon icon={faNewspaper} />
                                                Article 
                                            </a>
                                        </li>
                                        <li onClick={() => {
                                            setGenerationOption('readme');
                                            handleGeneration('readme');
                                        }}>
                                            <a className="flex gap-x-4 rounded-md">
                                                <FontAwesomeIcon icon={faReadme} />
                                                Readme 
                                            </a>
                                        </li>
                                        <li onClick={() => {
                                            setGenerationOption('logo');
                                            handleGeneration('logo');
                                        }}>
                                            <a className="flex gap-x-4 rounded-md">
                                                <FontAwesomeIcon icon={faShapes} />
                                                Logo 
                                            </a>
                                        </li>
                                        <li onClick={() => {
                                            setGenerationOption('name');
                                            handleGeneration('name');
                                        }}>
                                            <a className="flex gap-x-4 rounded-md">
                                                <FontAwesomeIcon icon={faLightbulb} />
                                                Name 
                                            </a>
                                        </li>
                                    </ul>
                                </details>
                                {
                                    freeTrialsLeft > 0 && (
                                        freeTrialsLeft == 1 ? (
                                            <h1>You have {freeTrialsLeft} free trial left</h1>
                                        ) : (
                                            <h1>You have {freeTrialsLeft} free trials left</h1>
                                        )
                                    )
                                }
                            </div>
                        )
                    ) : ( 
                        generationOption == 'logo' ? (
                            <div className={styles['view-logo-button-container']}>
                                <button 
                                className={styles['view-logo-button']}
                                onClick={() => window.open(result, '_blank')}
                                >
                                    View Logo
                                </button>
                            </div>
                        ) : (
                            <TextArea 
                            value={result} 
                            copy={generationOption} 
                            />   
                        )                    
                    )
                }
            </div>
        </div>
        <dialog 
        className={styles['modal-window']} 
        ref={modalWindowRef}
        >
            <div className={styles['popup-message']}>
                <form method="dialog">
                    <button className={styles['x-button']}>✕</button>
                </form>
                <h3>
                    {
                        generationOption == 'description' && (
                            balance > 0 && balance < 0.2 ? (
                                "Balance too low"
                            ) : (
                                "Empty Balance"
                            )
                        )
                    }
                    {
                        generationOption == 'article' && (
                            balance > 0 && balance < 0.4 ? (
                                "Balance too low"
                            ) : (
                                "Empty Balance"
                            )
                        )
                    }
                    {
                        generationOption == 'readme' && (
                            balance > 0 && balance < 0.4 ? (
                                "Balance too low"
                            ) : (
                                "Empty Balance"
                            )
                        )
                    }
                    {
                        generationOption == 'logo' && (
                            balance > 0 && balance < 0.4 ? (
                                "Balance too low"
                            ) : (
                                "Empty Balance"
                            )
                        )
                    }
                    {
                        generationOption == 'name' && (
                            balance > 0 && balance < 0.2 ? (
                                "Balance too low"
                            ) : (
                                "Empty Balance"
                            )
                        )
                    }
                </h3>
                <p className={styles['warning']}>
                    Oops! Looks like you need to top up your balance.
                    Current balance: <b>${balance}</b>
                </p>
                <button 
                className={styles['add-funds-button']}
                onClick={() => navigate("/pricing")}
                >
                    Add Funds
                </button>
            </div>
        </dialog>
        <dialog className={styles['error-modal-window']} ref={errorModalWindowRef}>
            <div className={styles['error-box']}>
                <h3 className="font-bold text-lg">Unexpected Error</h3>
                <p className="py-4">
                    { errorMessage }
                </p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className={styles['cancel-button']}>Close</button>
                    </form>
                </div>
            </div>
        </dialog>
        </> 
    )
}

export default Repository;
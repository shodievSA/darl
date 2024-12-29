import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import GenerationButton from "../../components/GenerationButton/GenerationButton";
import LoadingGenerationButton from "../../components/LoadingGenerationButton/LoadingGenerationButton";
import styles from "./LogoGeneration.module.css";
const serverIP = import.meta.env.VITE_SERVER_IP;

function LogoGeneration() {

    const location = useLocation();
    const navigate = useNavigate();

    const { repositoryName, repositoryOwner } = location.state;

    const modalWindowRef = useRef(null);

    const [logoURL, setLogoURL] = useState(null);
    const [
        isGenerateLogoButtonClicked,
        setIsGenerateLogoButtonClicked
    ] = useState(false);
    const [freeTrialsLeft, setFreeTrialsLeft] = useState(null);
    const [userBalance, setUserBalance] = useState(null);

    function handleLogoDownload() {

        const link = document.createElement('a');
        link.href = logoURL;
        link.download = 'downloaded-image.png';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }

    async function generateLogo() {

        if (freeTrialsLeft > 0 || userBalance >= 0.4) {

            setIsGenerateLogoButtonClicked(true);

            let res = await fetch(`${serverIP}/api/v1/generate-logo/${repositoryName}/${repositoryOwner}`);

            let data = await res.json();
            let imageURL = data.url;

            setLogoURL(imageURL);

            if (freeTrialsLeft > 0) {

                const res = await fetch(`${serverIP}/api/v1/reduce-user-free-trials`, {
                    method: "PATCH"
                });

                const data = await res.json();

                console.log(data.message);

            } else {

                const res = await fetch(`${serverIP}/api/v1/reduce-user-balance`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        reduceBy: 0.4
                    })
                });

                const data = await res.json();

                console.log(data.message);

            }

        } else {
            modalWindowRef.current.showModal();
        }
        
    }

    useEffect(() => {

        async function getFreeTrialsLeft() {

            const res = await fetch(`${serverIP}/api/v1/user-free-trials`);
            const data = await res.json();

            setFreeTrialsLeft(data.freeTrialsLeft);

        }

        async function getUserBalance() {

            const res = await fetch(`${serverIP}/api/v1/user-balance`);
            const data = await res.json();

            setUserBalance(data.balance);

        }

        getFreeTrialsLeft();
        getUserBalance();

    }, []);

    return (
        <>
        <div className={styles['page-container']}>
            {
                logoURL == null ? (
                    <>
                        <div className={styles['header']}>
                            <div>
                                <FontAwesomeIcon
                                icon={faChevronLeft}
                                className={styles['go-back-icon']}
                                onClick={() => navigate(-1)}
                                />
                            </div>
                            <div>
                                <h1 className={styles['service-name']}>Logo Generation</h1>
                            </div>
                        </div>
                        <div className={styles['main']}>
                            {
                                isGenerateLogoButtonClicked ? (
                                    <LoadingGenerationButton />
                                ) : (
                                    freeTrialsLeft > 0 ? (
                                        <div className="flex flex-col">
                                            <GenerationButton 
                                            text={"Generate Logo"}
                                            onClick={generateLogo}
                                            />
                                            <h1 className="text-center mt-5 text-lg">
                                                You have {freeTrialsLeft} free trials left
                                            </h1>
                                        </div>
                                    ) : (
                                        <GenerationButton 
                                        text={"Generate Logo"}
                                        onClick={generateLogo}
                                        />
                                    )
                                )
                            }        
                        </div>
                    </>
                ) : (
                    <div className={styles['download-button-container']}>
                        <button 
                        onClick={handleLogoDownload}
                        data-theme="dark"
                        className={styles['download-logo-button']}>
                            Download Logo
                        </button>
                    </div>
                )
            }
        </div>
        <dialog 
        className={styles['modal-window']} 
        ref={modalWindowRef}
        >
            <div className={styles['popup-message']}>
                <form method="dialog">
                    <button className={styles['cancel-button']}>✕</button>
                </form>
                <h3>
                    {
                        userBalance > 0 && userBalance < 0.2 ? (
                            "Balance too low"
                        ) : (
                            "Empty Balance"
                        )
                    }
                </h3>
                <p className={styles['warning']}>
                    Oops! Looks like you need to top up your balance.
                    Current balance: <b>${userBalance}</b>
                </p>
                <button 
                className={styles['add-funds-button']}
                onClick={() => navigate("/pricing")}
                >
                    Add Funds
                </button>
            </div>
        </dialog>
        </>
    );
}

export default LogoGeneration
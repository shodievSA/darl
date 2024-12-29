import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GenerationButton from "../../components/GenerationButton/GenerationButton";
import LoadingGenerationButton from "../../components/LoadingGenerationButton/LoadingGenerationButton";
import TextArea from "../../components/Text Area/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./ArticleGeneration.module.css";
const serverIP = import.meta.env.VITE_SERVER_IP;

function ArticleGeneration() {

    const navigate = useNavigate();
    const location = useLocation();

    const { repositoryName, repositoryOwner } = location.state;

    const modalWindowRef = useRef(null);

    const [
        isGenerateArticleButtonClicked,
        setIsGenerateArticleButtonClicked
    ] = useState(false);
    const [article, setArticle] = useState("");
    const [freeTrialsLeft, setFreeTrialsLeft] = useState(null);
    const [userBalance, setUserBalance] = useState(null);

    async function generateArticle() {

        if (freeTrialsLeft > 0 || userBalance >= 0.2) {

            setIsGenerateArticleButtonClicked(true);

            const res = await fetch(
                `${serverIP}/api/v1/article-generation/${repositoryName}/${repositoryOwner}`
            );
            
            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            let done = false;

            while (!done) {

                const { value, done: streamDone } = await reader.read();
                done = streamDone;

                const text = decoder.decode(value || new Uint8Array(), { stream: !done });

                setArticle((oldChunk) => oldChunk + text);

            }

            if (done == true) {

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
                            reduceBy: 0.2
                        })
                    });

                    const data = await res.json();

                    console.log(data.message);

                }

            }

        } else {
            modalWindowRef.current.showModal();
        }

    }

    useEffect(() => {

        async function getFreeTrialsLeft() {

            let res = await fetch(`${serverIP}/api/v1/user-free-trials`);
            let data = await res.json();

            setFreeTrialsLeft(data.freeTrialsLeft);

        }

        async function getUserBalance() {

            let res = await fetch(`${serverIP}/api/v1/user-balance`);
            let data = await res.json();

            setUserBalance(data.balance);

        }

        getFreeTrialsLeft();
        getUserBalance();

    }, []);

    return (
        <>
        <div className={styles['page-container']}>
            <div className={styles['header']}>
                <div>
                    <FontAwesomeIcon 
                    icon={faChevronLeft}
                    className={styles['go-back-icon']}
                    onClick={() => navigate(-1)}
                    />
                </div>
                <div>
                    <h1 className={styles['service-name']}>
                        Article Generation
                    </h1>
                </div>
            </div>
            <div className={styles['main']}>
                {
                    article.length > 0 ? (
                        <TextArea value={article} copy={"Article"} />
                    ) : (
                        isGenerateArticleButtonClicked ? (
                            <LoadingGenerationButton />
                        ) : (
                            freeTrialsLeft > 0 ? (
                                <div className="flex flex-col">
                                    <GenerationButton 
                                    text={'Generate Article'}
                                    onClick={generateArticle}
                                    />
                                    <h1 className="text-center mt-5 text-lg">
                                        You have {freeTrialsLeft} free trials left
                                    </h1>
                                </div>
                            ) : (
                                <GenerationButton 
                                text={'Generate Article'}
                                onClick={generateArticle}
                                />
                            )
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

export default ArticleGeneration;
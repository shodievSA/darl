const serverIP = import.meta.env.VITE_SERVER_IP;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../context/NavigationContext";
import GeneratedDeskriptionSkeleton from "../../components/Generated Description Skeleton/GeneratedDeskriptionSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./ReadmesHistory.module.css";

function ReadmesHistory() {

    const { currentNavigation } = useNavigationContext();

    const navigate = useNavigate();

    const [loadingReadmes, setLoadingReadmes] = useState(true);
    const [readmes, setReadmes] = useState([]);

    const skeletonCount = 9;

    function handleRedirection(repoName, readme) {
        navigate(`/history/readmes/${repoName}`, {
            state: { readme: readme }
        });
    }

    useEffect(() => {

        async function fetchGeneratedReadmes() {

            let res = await fetch(`${serverIP}/api/v1/generated-readmes`);
            let data = await res.json();
            
            setReadmes(data.data);
            setLoadingReadmes(false);

        }

        fetchGeneratedReadmes();

    }, []);

    return (
        <div className={styles['page-container']}>
            <div className={styles['header']}>
                {
                    (currentNavigation === "desktop" || currentNavigation === "laptop") && (
                        <>
                        <div onClick={() => navigate(-1)}>
                            <FontAwesomeIcon 
                            icon={faChevronLeft} 
                            className={styles['go-back-icon']}
                            />
                        </div> 
                        <div>
                            <h1>Generated READMEs</h1>
                        </div> 
                        </>
                    )
                }
                {
                    currentNavigation === "mobile" && (
                        <h1>Generated READMEs</h1>
                    )
                }
            </div>
            <div className={styles['main']}>
                {
                    loadingReadmes ? (

                        <div className={styles['generated-readmes']}>
                            {
                                Array.from({ length: skeletonCount }).map((_, index) => (
                                    <GeneratedDeskriptionSkeleton key={index} />
                                ))
                            }
                        </div>

                    ) : (
                        
                        readmes.length > 0 ? (

                            <div className={styles['generated-readmes']}>
                                {
                                    readmes.map((readme, index) => (
                                        <div 
                                        key={index} 
                                        className={styles['generated-readme']}
                                        onClick={() => handleRedirection(
                                            readme.repoName,
                                            readme.readme
                                        )}
                                        >
                                            <div>
                                                <h1>
                                                    <b>Repository:</b> {readme.repoName}
                                                </h1>
                                            </div>
                                            <div>
                                                <h1>
                                                    <b>Generation date:</b> {readme.generatedOn}
                                                </h1>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                        ) : (
                            <div className={styles['empty-list']}>
                                <h1>You haven't generated any Readmes yet</h1>
                            </div>
                        )

                    )
                }
            </div>
        </div>
    );

}

export default ReadmesHistory;
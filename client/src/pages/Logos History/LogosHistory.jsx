const serverIP = import.meta.env.VITE_SERVER_IP;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../context/NavigationContext";
import GeneratedDeskriptionSkeleton from "../../components/Generated Description Skeleton/GeneratedDeskriptionSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./LogosHistory.module.css";

function LogosHistory() {

    const { currentNavigation } = useNavigationContext();

    const navigate = useNavigate();

    const [loadingLogos, setLoadingLogos] = useState(true);
    const [logos, setLogos] = useState([]);

    const skeletonCount = 9;

    function handleRedirection(repoName, logo) {
        navigate(`/history/logos/${repoName}`, {
            state: { logo: logo }
        });
    }

    useEffect(() => {

        async function fetchGeneratedLogos() {

            let res = await fetch(`http://${serverIP}:3000/api/v1/generated-logos`);
            let data = await res.json();
            
            setLogos(data.data);
            setLoadingLogos(false);

        }

        fetchGeneratedLogos();

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
                            <h1>Generated Logos</h1>
                        </div> 
                        </>
                    )
                }
                {
                    currentNavigation === "mobile" && (
                        <h1>Generated Logos</h1>
                    )
                }
            </div>
            <div className={styles['main']}>
                {
                    loadingLogos ? (

                        <div className={styles['generated-logos']}>
                            {
                                Array.from({ length: skeletonCount }).map((_, index) => (
                                    <GeneratedDeskriptionSkeleton key={index} />
                                ))
                            }
                        </div>

                    ) : (
                        
                        logos.length > 0 ? (

                            <div className={styles['generated-logos']}>
                                {
                                    logos.map((logo, index) => (
                                        <div 
                                        key={index} 
                                        className={styles['generated-logo']}
                                        onClick={() => handleRedirection(
                                            logo.repoName,
                                            logo.logo
                                        )}
                                        >
                                            <div>
                                                <h1>
                                                    <b>Repository:</b> {logo.repoName}
                                                </h1>
                                            </div>
                                            <div>
                                                <h1>
                                                    <b>Generation date:</b> {logo.generatedOn}
                                                </h1>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                        ) : (
                            <div className={styles['empty-list']}>
                                <h1>You haven't generated any logos yet</h1>
                            </div>
                        )

                    )
                }
            </div>
        </div>
    );

}

export default LogosHistory;
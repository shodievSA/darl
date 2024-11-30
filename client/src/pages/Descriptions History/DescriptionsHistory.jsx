const serverIP = import.meta.env.VITE_SERVER_IP;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../context/NavigationContext";
import GeneratedDeskriptionSkeleton from "../../components/Generated Description Skeleton/GeneratedDeskriptionSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./DescriptionsHistory.module.css";

function DescriptionsHistory() {

    const { currentNavigation } = useNavigationContext();

    const navigate = useNavigate();

    const [loadingDescriptions, setLoadingDescriptions] = useState(true);
    const [descriptions, setDescriptions] = useState([]);

    const skeletonCount = 9;

    function handleRedirection(repoName, description) {
        navigate(`/history/descriptions/${repoName}`, {
            state: { description: description }
        });
    }

    useEffect(() => {

        async function fetchGeneratedDescriptions() {

            let res = await fetch(`${serverIP}/api/v1/generated-descriptions`);
            let data = await res.json();
            
            setDescriptions(data.data);
            setLoadingDescriptions(false);

        }

        fetchGeneratedDescriptions();

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
                            <h1>Generated Descriptions</h1>
                        </div> 
                        </>
                    )
                }
                {
                    currentNavigation === "mobile" && (
                        <h1>Generated Descriptions</h1>
                    )
                }
            </div>
            <div className={styles['main']}>
                {
                    loadingDescriptions ? (

                        <div className={styles['generated-descriptions']}>
                            {
                                Array.from({ length: skeletonCount }).map((_, index) => (
                                    <GeneratedDeskriptionSkeleton key={index} />
                                ))
                            }
                        </div>

                    ) : (
                        
                        descriptions.length > 0 ? (

                            <div className={styles['generated-descriptions']}>
                                {
                                    descriptions.map((description, index) => (
                                        <div 
                                        key={index} 
                                        className={styles['generated-description']}
                                        onClick={() => handleRedirection(
                                            description.repoName,
                                            description.description
                                        )}
                                        >
                                            <div>
                                                <h1><b>Repository:</b> {description.repoName}</h1>
                                            </div>
                                            <div>
                                                <h1><b>Generation date:</b> {description.generatedOn}</h1>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                        ) : (
                            <div className={styles['empty-list']}>
                                <h1>You haven't generated any descriptions yet</h1>
                            </div>
                        )

                    )
                }
            </div>
        </div>
    );

}

export default DescriptionsHistory;
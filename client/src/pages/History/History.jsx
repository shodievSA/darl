import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchUserGeneratedDescriptions from "../../utils/fetchUserGeneratedDescriptions";
import SkeletRepo from "../../components/Skelet Repo/SkeletRepo";
import styles from "./History.module.css"

function History() {

    const [descriptions, setDescriptions] = useState([]);
    const [areDescriptionsFetched, setAreDescriptionsFetched] = useState(false);
    const navigate = useNavigate();

    const skeletonCount = 5;

    const handleRedirection = (description) => {

        navigate(`/history/${description.repoName}`, {
            state: { 
                    description: description.description,
                    repositoryName: description.repoName
            }
        });

    }

    useEffect(() => {

        async function fetchData() {
            let data = await fetchUserGeneratedDescriptions();
            setDescriptions(data);
            setAreDescriptionsFetched(true);
        }
        fetchData();

    }, []);

    return (
        <div className={styles['page-container']}>
            {
                areDescriptionsFetched ? (
                    descriptions.length > 0 ? (
                        <div className={styles['descriptions']}>
                        {
                            descriptions.map((description) => {
                                return (
                                    <>
                                    <div 
                                    className={styles['description']}
                                    onClick={() => handleRedirection(description)}
                                    >
                                        <div className={styles['repository-name']}>
                                            <b>Repository name:</b> {description.repoName}
                                        </div>
                                        <div className={styles['generation-date']}>
                                            <b>{description['generatedOn']}</b>
                                        </div>
                                    </div>
                                    </>
                                )
                            })
                        }
                        </div>
                    ) : (
                        <div className={styles['heading-container']}>
                            <h1>Your history is currently empty</h1>
                        </div>
                    )
                ) : (
                    <div className={styles['descriptions']}>
                        {
                            Array.from({ length: skeletonCount }).map((_, index) => (
                                <SkeletRepo key={index} />
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default History
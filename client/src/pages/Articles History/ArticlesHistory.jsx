const serverIP = import.meta.env.VITE_SERVER_IP;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../context/NavigationContext";
import GeneratedDeskriptionSkeleton from "../../components/Generated Description Skeleton/GeneratedDeskriptionSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./ArticlesHistory.module.css";

function ArticlesHistory() {

    const { currentNavigation } = useNavigationContext();

    const navigate = useNavigate();

    const [loadingArticles, setLoadingArticles] = useState(true);
    const [articles, setArticles] = useState([]);

    const skeletonCount = 9;

    function handleRedirection(repoName, article) {
        navigate(`/history/articles/${repoName}`, {
            state: { article: article }
        });
    }

    useEffect(() => {

        async function fetchGeneratedArticles() {

            let res = await fetch(`http://${serverIP}:3000/api/v1/generated-articles`);
            let data = await res.json();
            
            setArticles(data.data);
            setLoadingArticles(false);

        }

        fetchGeneratedArticles();

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
                            <h1>Generated Articles</h1>
                        </div> 
                        </>
                    )
                }
                {
                    currentNavigation === "mobile" && (
                        <h1>Generated Articles</h1>
                    )
                }
            </div>
            <div className={styles['main']}>
                {
                    loadingArticles ? (

                        <div className={styles['generated-articles']}>
                            {
                                Array.from({ length: skeletonCount }).map((_, index) => (
                                    <GeneratedDeskriptionSkeleton key={index} />
                                ))
                            }
                        </div>

                    ) : (
                        
                        articles.length > 0 ? (

                            <div className={styles['generated-articles']}>
                                {
                                    articles.map((article, index) => (
                                        <div 
                                        key={index} 
                                        className={styles['generated-article']}
                                        onClick={() => handleRedirection(
                                            article.repoName,
                                            article.article
                                        )}
                                        >
                                            <div>
                                                <h1><b>Repository:</b> {article.repoName}</h1>
                                            </div>
                                            <div>
                                                <h1><b>Generation date:</b> {article.generatedOn}</h1>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                        ) : (
                            <div className={styles['empty-list']}>
                                <h1>You haven't generated any articles yet</h1>
                            </div>
                        )

                    )
                }
            </div>
        </div>
    );

}

export default ArticlesHistory;
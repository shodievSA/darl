import { useEffect, useState, useRef } from "react";
import { useNavigationContext } from "../../context/NavigationContext";
import fetchUserRepos from "../../utils/fetchUserRepos";
import RepositoryCard from "../../components/Repository Card/RepositoryCard";
import SkeletRepo from "../../components/Skelet Repo/SkeletRepo";
import styles from "./Repositories.module.css"

function Repositories() {

    const { currentNavigation } = useNavigationContext();

    const [repos, setRepos] = useState([]);
    const [loadingRepos, setLoadingRepos] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const dialogWindowRef = useRef(null);
    const skeletonCount = 9;

    useEffect(() => {

        async function fetchData() {

            let res = await fetchUserRepos();

            if (res.status == "error")
            {
                setErrorMessage(res.data);
                dialogWindowRef.current.showModal();
            } 
            else if (res.status == "success")
            {
                setRepos(res.data);
            }
            
            setLoadingRepos(false);
        }
        fetchData();

    }, []);

    return (
        <div className={styles['page-container']}>
            <dialog 
            id="my_modal_5" 
            className="modal modal-bottom sm:modal-middle"
            ref={dialogWindowRef}
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg"></h3>
                    <p className="py-4">
                        {errorMessage}
                    </p>
                    <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                    </div>
                </div>
            </dialog>
            {
                currentNavigation === 'desktop' &&
                <div className={styles['header']}>
                    <h1>Repositories</h1>
                </div>
            }
            <div className={styles['main']}>
                <div className={styles['user-repositories']}>
                {
                    loadingRepos ? (
                        Array.from({ length: skeletonCount }).map((_, index) => (
                            <SkeletRepo key={index} />
                        ))
                    ) : (
                        repos.length > 0 ? (
                            repos.map((repo) => {
                                return (
                                    <RepositoryCard
                                    key={`${repo.id}`}
                                    name={repo.name}
                                    owner={repo.owner.login}
                                    />
                                )
                            })
                        ) : (
                            <h1>Looks like you don't have any repositories</h1>
                        )
                    )
                }
                </div>
            </div>
        </div>
    );

}

export default Repositories;
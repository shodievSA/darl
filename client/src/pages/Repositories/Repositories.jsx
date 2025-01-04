import { useEffect, useState, useRef } from "react";
import fetchUserRepos from "../../utils/fetchUserRepos";
import RepositoryCard from "../../components/Repository Card/RepositoryCard";
import SkeletRepo from "../../components/Skelet Repo/SkeletRepo";
import styles from "./Repositories.module.css"

function Repositories() {

    const [repos, setRepos] = useState([]);
    const [loadingRepos, setLoadingRepos] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchResults, setSearchResults] = useState(null);

    const dialogWindowRef = useRef(null);

    useEffect(() => {

        async function fetchData() {

            let res = await fetchUserRepos();

            if (res.status == "error") {
                setErrorMessage(res.data);
                dialogWindowRef.current.showModal();
            } else if (res.status == "success") {
                setRepos(res.data);
            }
            
            setLoadingRepos(false);
            
        }

        fetchData();

    }, []);

    return (
        <div className={styles['page-container']}>
            <dialog  
            className="modal modal-bottom sm:modal-middle"
            ref={dialogWindowRef}
            >
                <div 
                className="modal-box" 
                style={{ backgroundColor: "rgb(12.5, 12.5, 12.5)"}}
                >
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
            <div className={styles['main']}>
                <div className={styles['search-container']}>
                    <label className="input input-bordered flex items-center gap-2">
                        <input 
                        type="text" 
                        className="grow" 
                        placeholder="Search by repository name" 
                        onChange={(e) => {
                            setSearchResults(repos.filter((repo) => {
                                return repo.name.includes(e.target.value)
                            }))
                        }}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd" />
                        </svg>
                    </label>
                </div>
                {
                    loadingRepos ? (
                        <div className={styles['user-repositories']}>
                            {
                                Array.from({ length: 9 }).map((_, index) => (
                                    <SkeletRepo key={index} />
                                ))
                            }
                        </div>
                    ) : (
                        repos.length > 0 ? (
                            searchResults ? (
                                searchResults.length > 0 ? (
                                    <div className={styles['user-repositories']}>
                                        {
                                            searchResults.map((repo) => {
                                                return (
                                                    <RepositoryCard
                                                    key={`${repo.id}`}
                                                    name={repo.name}
                                                    owner={repo.owner.login}
                                                    updated_at={repo.updated_at}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                ) : (
                                    <div className={styles["no-results-container"]}>
                                        <h1>No results found</h1>
                                    </div>
                                )
                            ) : (
                                <div className={styles['user-repositories']}>
                                {
                                    repos.map((repo) => {
                                        return (
                                            <RepositoryCard
                                            key={`${repo.id}`}
                                            name={repo.name}
                                            owner={repo.owner.login}
                                            updated_at={repo.updated_at}
                                            />
                                        )
                                    })
                                }
                                </div>
                            )
                        ) : (
                            <div className={styles["no-repos-container"]}>
                                <h1>Looks like you don't have any repositories</h1>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );

}

export default Repositories;
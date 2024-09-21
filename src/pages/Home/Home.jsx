import RepositoryCard from "../../components/Repository Card/RepositoryCard";
import styles from "./Home.module.css"

function Home() {
    const userRepos = new Array(6).fill(0);
    return (
        <div className={styles['page-container']}>
            <div className={styles['user-repositories']}>
            {
                userRepos.map((repo) => {
                    return (
                        <RepositoryCard />
                    )
                })
            }
            </div>
        </div>
    )
}

export default Home
import { useNavigate } from "react-router-dom";
import styles from "./History.module.css"

function History() {

    const descriptions = new Array(6).fill(0);
    const navigate = useNavigate();
    const handleRedirection = () => {
        navigate("/history/canvas-deadline-notifier", {
            state: { 
                    description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32.",
                    repositoryName: "canvas-deadline-notifier"
            }
        })
    }

    return (
        <div className={styles['page-container']}>
            <div className={styles['descriptions']}>
                {
                    descriptions.map((description) => {
                        return (
                            <>
                            <div 
                            className={styles['description']}
                            onClick={handleRedirection}
                            >
                                <div className={styles['repository-name']}>
                                    <b>Repository name:</b> canvas-deadline-notifier
                                </div>
                                <div className={styles['generation-date']}>
                                    <b>Generated on:</b> Aug. 1st
                                </div>
                            </div>
                            </>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default History
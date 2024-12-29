import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getUserHistory from "../../utils/getUserHistory";
import getLogoURL from "../../utils/getLogoURL";
import styles from "./History.module.css";

function History() {

    const navigate = useNavigate();

    const [userHistory, setUserHistory] = useState(null);
    
    async function handleRedirection(item) {

        if (item.type == 'logo') {

            const logoURL = await getLogoURL(item.value);
            window.open(logoURL, '_blank');

        } else {

            navigate(`/history/${item.repoName}`, {
                state: { item }
            });
            
        }

    }

    useEffect(() => {
        getUserHistory(setUserHistory);
    }, []);

    return (
        <div className={styles['page-container']}>
            {
                (userHistory !== null && userHistory.length > 0) ? (
                    <div className={styles['main']}>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead className={styles['table-head']}>
                                    <tr>
                                        <th>Repository</th>
                                        <th>Date</th>
                                        <th>Price</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody className={styles['table-body']}>
                                {  
                                    userHistory.map((item, index) => {
                                        return (
                                            <tr 
                                            key={index} className="hover"
                                            onClick={() => handleRedirection(item)}>
                                                <td className="px-16 py-8">{item.repoName}</td>
                                                <td className="px-16 py-8">{item.date}</td>
                                                <td className="px-16 py-8">
                                                    {
                                                        item.price == 'free trial' ? (
                                                            item.price
                                                        ) : (
                                                            `$${item.price}`
                                                        )
                                                    }
                                                </td>
                                                <td className="px-16 py-8">{item.type}</td>
                                            </tr>
                                        );
                                    })         
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    (userHistory !== null && userHistory.length == 0) && (
                        <div className={styles['empty-history']}>
                            <h1>Looks like your history is empty</h1>
                        </div>
                    )
                )
            }
        </div>
    );
    
}

export default History;
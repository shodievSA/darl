import { useState, useEffect } from "react";
import getUserBalance from "../../utils/getUserBalance";
import styles from "./Pricing.module.css";

function Pricing() {

    const [userBalance, setUserBalance] = useState(null);

    useEffect(() => {

        getUserBalance(setUserBalance);

    }, []);

    return (
        <div className={styles["page-container"]}>
            <div className={styles['main']}>
                <h1 className="text-4xl font-medium">
                    Pay for only what you use. Nothing more.
                </h1>
                <div>
                    <div className={styles['user-balance']}>
                        Balance: ${userBalance}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pricing
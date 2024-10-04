import Card from "../../components/Card/Card";
import styles from "./Pricing.module.css"

function Pricing() {
    return (
        <div className={styles["page-container"]}>
            <div className={styles["pricing-plans"]}>
                <Card />
                <Card />
                <Card />
            </div>
        </div>
    );
}

export default Pricing
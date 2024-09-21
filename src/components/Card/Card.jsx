import styles from "./Card.module.css"

function Card() {
    return (
        <div 
        className={styles['tariff-plan']
        }>
            <figure>
                <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" 
                />
            </figure>
            <div className={styles['tariff-plan-body']}>
                <h2 className={styles['tariff-plan-title']}>$10</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div className={styles['tariff-plan-actions']}>
                    <button 
                    data-theme="halloween" 
                    className={styles['buy-tariff-plan-button']}
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card
function formatDate() {

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0'); 
    const minutes = String(today.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}, ${hours}:${minutes}`;

}

module.exports = formatDate;
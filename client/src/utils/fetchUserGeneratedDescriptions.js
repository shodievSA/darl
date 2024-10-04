async function fetchUserGeneratedDescriptions() {
    let res = await fetch("http://localhost:3000/api/v1/generated-descriptions");
    let data = await res.json();

    return data;
}

export default fetchUserGeneratedDescriptions;
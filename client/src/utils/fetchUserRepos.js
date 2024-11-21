const serverIP = import.meta.env.VITE_SERVER_IP

async function fetchUserRepos() {

    try 
    {
        let res = await fetch(`http://${serverIP}:3000/api/v1/user-repos`);

        if (res.status == 200)
        {
            let data = await res.json();
            return { status: "success", data: data };
        } 
        else 
        {
            let errorMessage = await res.text();
            return { status: "error", data: errorMessage };
        } 
    } 
    catch(err) 
    {
        console.log(err);
    }

}

export default fetchUserRepos;
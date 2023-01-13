import Table from "../../components/table/Table";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminUi = ()=> {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);

    const getUsers = async ()=>{
        try{
            const response = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
            console.log(response);
            setUsers(response.data);
            setLoading(false);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getUsers();
    },[])

    if(loading){
        return <div>Loading...</div>
    }
    return(
        <div>
            <Table data={users}/>
        </div>
    )
}

export default AdminUi;
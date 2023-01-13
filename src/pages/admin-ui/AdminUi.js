import Table from "../../components/table/Table";
import axios from "axios";
import { useEffect, useState } from "react";


const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <a href="#">Edit</a>
          <a href="#">Delete</a>
        </span>
      ),
    },
  ];

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
            <Table columns={columns} data={users}/>
        </div>
    )
}

export default AdminUi;
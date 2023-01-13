import Table from "../../components/table/Table";
import axios from "axios";
import { useEffect, useState } from "react";



const AdminUi = ()=> {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);
    const [editingIndex, setEditingIndex] = useState(-1);

    
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
    render: (text, index) => (
      <td>
        <button onClick={()=>{setEditingIndex(index)}}>Edit</button>
        <a href="#">Delete</a>
      </td>
    ),
  },
];

    const getUsers = async ()=>{
        try{
            const response = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
            setUsers(response.data);
            setLoading(false);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getUsers();
    },[])

    function handleChange(event, key, index) {
      const updatedData = [...users];
      updatedData[index] = { ...updatedData[index], [key]: event.target.value };
      setUsers(updatedData);
    }
  
    if(loading){
        return <div>Loading...</div>
    }
    return(
        <div>
            <Table columns={columns} data={users} editingIndex={editingIndex} handleChange={handleChange}/>
        </div>
    )
}

export default AdminUi;
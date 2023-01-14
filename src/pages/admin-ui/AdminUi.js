import Table from "../../components/table/Table";
import axios from "axios";
import { useEffect, useState } from "react";



const AdminUi = ()=> {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [currentUsers, setCurrentUsers] = useState();

    const deleteUser = (index)=> {
      setLoading(true)
      let temp = users;
      temp.splice(index,1)
      setUsers([...temp]);
      setLoading(false)
    }

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
        render: (text, index) => {
          if(editingIndex===-1){
            return <td>
              <button onClick={()=>{
                  setCurrentUsers(users)
                  setEditingIndex(index)
                }}>Edit</button>
              <button onClick={()=>deleteUser(index)}>Delete</button>
            </td>
          }
          else{
            if(index===editingIndex){
              return <td>
              <button onClick={()=>{setEditingIndex(-1)}}>Save</button>
              <button onClick={()=>{
                setUsers(currentUsers)
                setEditingIndex(-1)
              }} >Cancel</button>
              </td>
            }else{
              return <td>
              <button disabled  onClick={()=>{setEditingIndex(index)}}>Edit</button>
              <button disabled>Delete</button>
            </td>
            }
          }
        },
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
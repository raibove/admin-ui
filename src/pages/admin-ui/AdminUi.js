import Table from "../../components/table/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "../../components/pagination/Pagination";



const AdminUi = ()=> {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [currentUser, setCurrentUser] = useState();
    const [pageData, setPageData] = useState()
    const usersPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    
    function handlePageChange(newPage) {
      setCurrentPage(newPage)
    }

    
    useEffect(() => {
      if(users!==undefined){
        const indexOfLastItem = currentPage * usersPerPage;
        const indexOfFirstItem = indexOfLastItem - usersPerPage;
        console.log(currentPage)
        setPageData(users.slice(indexOfFirstItem, indexOfLastItem));
        setLoading(false)
      }
    }, [users, currentPage]);

    const deleteUser = (index)=> {
      setLoading(true)
      let temp = users;
      temp.splice(index,1)
      setUsers([...temp]);
      setLoading(false)
    }

    const columns = [
      {
        title:'[]',
        key:'checkbox',
        render: ()=> {
          return <input type="checkbox" />
        }
      },
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
                  setCurrentUser(users)
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
                setUsers(currentUser)
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
            // setLoading(false);
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
            <Table columns={columns} data={pageData} editingIndex={editingIndex} handleChange={handleChange}/>
            <div>
              <Pagination data={users} itemsPerPage={usersPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>
            </div>
        </div>
    )
}

export default AdminUi;
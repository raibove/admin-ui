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
    const [currentPage, setCurrentPage] = useState(1);
    const [noData, setNoData] = useState(false);
    const [deleteSelected, setDeleteSelected] = useState([]);
    const usersPerPage = 10;

    
    function handlePageChange(newPage) {
      setCurrentPage(newPage)
    }
    
    useEffect(() => {
      if(users!==undefined){
        const indexOfLastItem = currentPage * usersPerPage;
        const indexOfFirstItem = indexOfLastItem - usersPerPage;
        let currentPageData = users.slice(indexOfFirstItem, indexOfLastItem);
        if(currentPageData.length===0){
          if(currentPage===1)
            setNoData(true);
          else{
            setCurrentPage(currentPage-1);
          }
        }
        setPageData(users.slice(indexOfFirstItem, indexOfLastItem));
        setLoading(false);
      }
    }, [users, currentPage]);

    const deleteUser = (index)=> {
      setLoading(true)
      let temp = users;
      temp.splice(index,1)
      setUsers([...temp]);
      setLoading(false)
    }

    
   const handleCheckboxChange = (event, item) => {
      if (deleteSelected.includes(item)) {
        setDeleteSelected(deleteSelected.filter(i => i !== item));
      } else {
        setDeleteSelected([...deleteSelected, item]);
      }
    }

    const columns = [
      {
        title:'[]',
        key:'checkbox',
        render: (text)=> {
          return <input type="checkbox" checked={deleteSelected.includes(text)} onChange={(event)=>handleCheckboxChange(event, text)}/>
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
  
    function handleDeleteSelected(){
      let tempUsers = users
      tempUsers = tempUsers.filter((element, index) => !deleteSelected.includes(element));
      setUsers([...tempUsers])
      setDeleteSelected([])
    }

    if(loading){
        return <div>Loading...</div>
    }

    if(noData){
      return <div>No Data To Display...</div>
    }

    return(
        <div>
            <Table columns={columns} data={pageData} editingIndex={editingIndex} handleChange={handleChange}/>
            <div>
              <button onClick={handleDeleteSelected}>Delete Selected</button>
              <Pagination data={users} itemsPerPage={usersPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>
            </div>
        </div>
    )
}

export default AdminUi;
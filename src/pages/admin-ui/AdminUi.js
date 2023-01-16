import Table from "../../components/table/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "../../components/pagination/Pagination";



const AdminUi = ()=> {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [currentUser, setCurrentUser] = useState();
    const [currentPageData, setCurrentPageData] = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPage, setSelectedPage] = useState([])
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
        let tempPageData = users.slice(indexOfFirstItem, indexOfLastItem);
        if(tempPageData.length===0){
          if(currentPage===1)
            setNoData(true);
          else{
            setCurrentPage(currentPage-1);
          }
        }
        setCurrentPageData(users.slice(indexOfFirstItem, indexOfLastItem));
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
        setSelectedPage(selectedPage.filter(page=> page!==currentPage))
        setDeleteSelected(deleteSelected.filter(i => i !== item));
      } else {

        let tempDeleteSelected = deleteSelected
        tempDeleteSelected.push(item)
        setDeleteSelected([...tempDeleteSelected]);

        if(currentPageData.every(element => tempDeleteSelected.includes(element)))
        {
          setSelectedPage([...selectedPage, currentPage])
        }
      }
    }

    const handleSelectAll = ()=>{
      // add elements from current page that don't exist in delete selected
      if(selectedPage.includes(currentPage)){
        setSelectedPage(selectedPage.filter(page=> page!==currentPage))
        setDeleteSelected(deleteSelected.filter(item => !currentPageData.includes(item)));
      }else{
        setSelectedPage([...selectedPage, currentPage])
        setDeleteSelected([...deleteSelected, ...currentPageData])
      }
      // on unchecking the checkbox, elements from that page should be deleted
    }

    const columns = [
      {
        title:<input type="checkbox" checked={selectedPage.includes(currentPage)} onChange={handleSelectAll}/>,
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
            <Table columns={columns} data={currentPageData} editingIndex={editingIndex} handleChange={handleChange}/>
            <div>
              <button onClick={handleDeleteSelected}>Delete Selected</button>
              <Pagination data={users} itemsPerPage={usersPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>
            </div>
        </div>
    )
}

export default AdminUi;
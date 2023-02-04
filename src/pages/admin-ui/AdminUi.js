import Table from "../../components/table/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "../../components/pagination/Pagination";
import "./AdminUi.css"
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

const AdminUi = ()=> {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [currentUser, setCurrentUser] = useState();
    const [currentPageData, setCurrentPageData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [noData, setNoData] = useState(false);
    const [deleteSelected, setDeleteSelected] = useState([]);
    const [filterData, setFilterData] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [paginationData, setPaginationData] = useState();
    const usersPerPage = 10;

    
    function handlePageChange(newPage) {
      setCurrentPage(newPage)
    }
    
    useEffect(() => {
      if(filterData!==null){
        setPaginationData(filterData)
        const indexOfLastItem = currentPage * usersPerPage;
        const indexOfFirstItem = indexOfLastItem - usersPerPage;
        let tempPageData = filterData.slice(indexOfFirstItem, indexOfLastItem);
        if(tempPageData.length===0){
          if(currentPage===1)
            setNoData(true);
          else{
            setCurrentPage(currentPage-1);
          }
        }
   
        setCurrentPageData(tempPageData);
        setLoading(false);
      }
      else if(users!==undefined){
        setPaginationData(users)
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
   
        setCurrentPageData(tempPageData);

        setLoading(false);
      }
    }, [users, currentPage, filterData]);

    const deleteUser = (id)=> {
      setLoading(true)
     
      setUsers(users.filter(item=> item.id !== id));
      if(filterData!== null){
        setFilterData(filterData.filter(item=> item.id !== id));
      }

      setLoading(false)
    }

    
   const handleCheckboxChange = (event, item) => {
      if (deleteSelected.includes(item)) {
        setDeleteSelected(deleteSelected.filter(i => i !== item));
      } else {

        let tempDeleteSelected = deleteSelected
        tempDeleteSelected.push(item)
        setDeleteSelected([...tempDeleteSelected]);
      }
    }

    const handleSelectAll = (e)=>{
      if(e.target.checked){
        setDeleteSelected([...deleteSelected, ...currentPageData])
      }else{
        setDeleteSelected(deleteSelected.filter(item => !currentPageData.includes(item)));
      }
    }

    const columns = [
      {
        title:<input type="checkbox" checked={currentPageData.every(element => deleteSelected.includes(element))} onChange={handleSelectAll}/>,
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
                <AiFillEdit
                  className="user-edit" 
                  onClick={()=>{
                    setCurrentUser(users)
                    setEditingIndex(index)}
                  } 
                />
                &nbsp;
                &nbsp;
              <AiFillDelete className="user-delete" onClick={()=>deleteUser(text.id)} />
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
            setPaginationData(response.data);
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

      if(filterData!==null){
        let tempFilterData = filterData
        tempFilterData = tempFilterData.filter((element, index)=> !deleteSelected.includes(element));
        setFilterData([...tempFilterData])
      }

      setDeleteSelected([])

    }

    const handleSearch = (e)=>{
      if(e.target.value.length===0)
        setFilterData(null)
      else{
        setFilterData(
          users.filter(item => {
            return (
              item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.role.toLowerCase().includes(e.target.value.toLowerCase())
            );
          })
        );
      }
      setSearchQuery(e.target.value)
    }

    if(loading){
        return <div>Loading...</div>
    }

    return(
        <div className="admin-ui">
            <input placeholder="search by name, email or role" value={searchQuery} onChange={handleSearch} className="search-input"/>
            <Table columns={columns} data={currentPageData} editingIndex={editingIndex} handleChange={handleChange} deleteSelected={deleteSelected}/>
            {!noData &&
              <div className="table-footer">
                <button onClick={handleDeleteSelected} className="delete-selected">Delete Selected</button>
                <Pagination data={paginationData} itemsPerPage={usersPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>
              </div>
            }
        </div>
    )
}

export default AdminUi;
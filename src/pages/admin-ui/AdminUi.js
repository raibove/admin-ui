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
   
        setCurrentPageData( filterData.slice(indexOfFirstItem, indexOfLastItem));
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
   
        setCurrentPageData( users.slice(indexOfFirstItem, indexOfLastItem));
        setLoading(false);
      }
    }, [users, currentPage, filterData]);

    const deleteUser = (id)=> {
      setLoading(true)
     
      setUsers(users.filter(item=> item.id !== id));
      if(filterData!== null){
        setFilterData(filterData.filter(item=> item.id !== id));
      }
      setSelectedPage(selectedPage.filter(item=>item!==currentPage))
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
              <button onClick={()=>deleteUser(text.id)}>Delete</button>
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

      if(filterData!==null){
        let tempFilterData = filterData
        tempFilterData = tempFilterData.filter((element, index)=> !deleteSelected.includes(element));
        setFilterData([...tempFilterData])
      }

      setDeleteSelected([])
      setSelectedPage(selectedPage.filter(item=>item!==currentPage))

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

    if(noData){
      return <div>No Data To Display...</div>
    }

    return(
        <div>
          <input placeholder="search by name, email or role" value={searchQuery} onChange={handleSearch} />
            <Table columns={columns} data={currentPageData} editingIndex={editingIndex} handleChange={handleChange}/>
            <div>
              <button onClick={handleDeleteSelected}>Delete Selected</button>
              <Pagination data={paginationData} itemsPerPage={usersPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>
            </div>
        </div>
    )
}

export default AdminUi;
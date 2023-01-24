import { useEffect, useState } from "react";
import "./Pagination.css";
import { GrFormNext } from "react-icons/gr";

const Pagination = ({data, itemsPerPage, onPageChange, currentPage})=>{
    const [totalPages, setTotalPages] = useState(Math.ceil(data.length / itemsPerPage));
    
    useEffect(()=>{
        setTotalPages(Math.ceil(data.length / itemsPerPage))
    },[data])
    const handleClick = (direction) => {
        if (direction === 'prev' && currentPage > 1) {
            onPageChange(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
      };

      const handlePageClick = (page) => {
        onPageChange(page);
      };
    
    return(
        <div className="pagination-container">
            <button onClick={() => handleClick('prev')} disabled={currentPage === 1}>
                Prev
            </button>
            <div className="page-number-container">
            {
                Array.from(Array(totalPages).keys()).map(page => (
                <button key={page} onClick={() => handlePageClick(page + 1)} className={currentPage===page+1? `page-number selected-page-number`: "page-number"}>{page + 1}</button>
                ))
            }
            </div>
            <GrFormNext onClick={() => handleClick('next')} className="next-page" style={{pointer: currentPage === totalPages && 'none'}} />
               
        </div>
    )
}

export default Pagination;
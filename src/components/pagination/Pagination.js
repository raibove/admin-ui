import { useEffect, useState } from "react";

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
    
    return(
        <div>
            <button onClick={() => handleClick('prev')} disabled={currentPage === 1}>
                Prev
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button onClick={() => handleClick('next')} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    )
}

export default Pagination;
import { useEffect, useState } from "react";
import "./Pagination.css";
import { GrFormNext, GrFormPrevious, GrChapterNext, GrChapterPrevious } from "react-icons/gr";

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
    
      const goToLastPage = ()=>{
        onPageChange(totalPages);
      }

      const goToFirstPage = ()=>{
        onPageChange(1);
      }
    return(
        <div className="pagination-container">
            <GrChapterPrevious className={currentPage==1? "hide-next-page" :"next-page"} onClick={goToFirstPage}/>
            <GrFormPrevious className={currentPage==1? "hide-next-page" :"next-page"} onClick={()=> handleClick('prev')}/>
            <div className="page-number-container">
            {
                Array.from(Array(totalPages).keys()).map(page => (
                <button key={page} onClick={() => handlePageClick(page + 1)} className={currentPage===page+1? `page-number selected-page-number`: "page-number"}>{page + 1}</button>
                ))
            }
            </div>
            <GrFormNext onClick={() => handleClick('next')} className={currentPage==totalPages? "hide-next-page" : "next-page"}/> 
            <GrChapterNext onClick={goToLastPage} className={currentPage==totalPages? "hide-next-page" : "next-page"}/>
        </div>
    )
}

export default Pagination;
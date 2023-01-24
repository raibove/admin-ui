import "./Table.css"

const Table = ({columns, data, editingIndex, handleChange})=>{
    return(
        <div>
            <table className="table">
                <thead>
                    <tr>
                    {columns.map(column => (
                        <th key={column.key}>{column.title}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length===0 &&
                        <div>No data to display</div>
                    }
                    {data.map((row, index) => (
                    <tr key={row.key} className="table-row">
                        {columns.map(column => {
                            if (index === editingIndex && column.dataIndex) {
                                return <td>
                                    <input
                                        type="text"
                                        value={row[column.dataIndex]}
                                        onChange={event => handleChange(event, column.dataIndex, index)}
                                    />
                                    </td>
                            }
                            else if (column.dataIndex)
                                return <td>{row[column.dataIndex]}</td>
                            else if (column.render)
                                return column.render(row, index)
                        })}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table;
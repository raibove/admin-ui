const Table = ({columns, data, editingIndex, handleChange})=>{
    return(
        <div>
            <table>
                <thead>
                    <tr>
                    {columns.map(column => (
                        <th key={column.key}>{column.title}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                    <tr key={row.key}>
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
                                return <td key={column.key}>{row[column.dataIndex]}</td>
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
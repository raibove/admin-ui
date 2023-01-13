const Table = ({columns, data})=>{
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
                    {data.map(row => (
                    <tr key={row.key}>
                        {columns.map(column => {
                            if (column.dataIndex)
                                return <td key={column.key}>{row[column.dataIndex]}</td>
                            else if (column.render)
                                return column.render(row)
                        })}
                    </tr>
                    ))}
                </tbody>
                </table>
        </div>
    )
}

export default Table;
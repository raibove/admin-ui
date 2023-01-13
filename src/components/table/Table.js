const Table = ({data})=>{
    return(
        <div>
             <table>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(user => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                        <button>Edit</button>
                        <button>Delete</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
        </div>
    )
}

export default Table;
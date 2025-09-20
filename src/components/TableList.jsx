export default function TableList({ clients, onEdit, onDelete, onToggleStatus }) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="bg-base-200 text-base font-semibold">
            <th className="text-center">#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Job</th>
            <th>Rate ($)</th>
            <th className="text-center">Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500">
                No clients found
              </td>
            </tr>
          ) : (
            clients.map((client, index) => (
              <tr
                key={client.id}
                className="hover:bg-base-300 transition-colors duration-200"
              >
                <td className="text-center">{index + 1}</td>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.job}</td>
                <td>{client.rate}</td>
                <td className="text-center">
                  <button
                    onClick={() => onToggleStatus(client)}
                    className={`btn btn-sm rounded-full px-4 ${
                      client.isactive ? "btn-success" : "btn-error"
                    }`}
                  >
                    {client.isactive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => onEdit(client)}
                      className="btn btn-secondary btn-sm hover:scale-105 transition-transform"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => onDelete(client.id)}
                      className="btn btn-accent btn-sm hover:scale-105 transition-transform"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function Results({ votes }: { votes: [] }) {
  const nominees = [
    'Imran Khan',
    'Nawaz Sharif',
    'Asif Zardari',
  ]
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-center text-xl font-bold">Admin: All Votes</h1>

      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Vote</th>
          </tr>
        </thead>
        <tbody>
          {nominees.map((vote: any, index: number) => (
            <tr key={index}>
              <td className="border px-4 py-2">{vote}</td>
              <td className="border px-4 py-2">{votes[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

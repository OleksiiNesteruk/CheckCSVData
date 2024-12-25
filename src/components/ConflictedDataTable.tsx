import { CSVRow } from "../types";

type ConflictedDataTableProps = {
  conflictedCharacters: CSVRow[];
};

const ConflictedDataTable: React.FC<ConflictedDataTableProps> = ({
  conflictedCharacters,
}) => {
  return (
    <>
      <p className="notification is-danger">
        Conflicting Names and Professions:
      </p>
      <table className="table is-bordered is-striped is-fullwidth">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Professions</th>
          </tr>
        </thead>
        <tbody>
          {conflictedCharacters.map((character, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{character.name}</td>
              <td>{character.profession}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ConflictedDataTable;

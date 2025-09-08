import React from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Default column filter input
const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <input
      value={filterValue || ""}
      onChange={e => setFilter(e.target.value || undefined)}
      placeholder="Search..."
      style={{ width: "100%" }}
    />
  );
};

const ReportTable = ({ columns, data, onApprove, onReject }) => {
  const defaultColumn = {
    Filter: DefaultColumnFilter
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex }
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useFilters, // Filtering
    useSortBy,
    usePagination
  );

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "Report.xlsx");
  };

  return (
    <div>
      <button onClick={exportToExcel}>Export XLSX</button>
      <table {...getTableProps()} border="1" cellPadding="5" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          ))}
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th key={column.id}>
                  {column.canFilter ? column.render("Filter") : null}
                </th>
              ))}
              <th></th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
                <td>
                  <button onClick={() => onApprove(row.original)}>Approve</button>
                  <button onClick={() => onReject(row.original)}>Reject</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{"<<"}</button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
        <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>{">>"}</button>
      </div>
    </div>
  );
};

export default ReportTable;

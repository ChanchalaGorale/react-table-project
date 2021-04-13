import {
  useTable,
  useSortBy,
  usePagination,
  useColumnOrder,
} from "react-table";
import React from "react";

function shuffle(arr) {
  arr = [...arr];
  const shuffled = [];
  while (arr.length) {
    const rand = Math.floor(Math.random() * arr.length);
    shuffled.push(arr.splice(rand, 1)[0]);
  }
  return shuffled;
}
function Table({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    visibleColumns,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    setColumnOrder,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    useSortBy,
    useColumnOrder,
    usePagination
  );

  const originalOrder = () => {
    setColumnOrder([
      "name",
      "ticker",
      "asset_class",
      "avg_price",
      "market_price",
      "latest_chg_pct",
      "market_value_ccy",
    ]);
  };

  const changeOrder = () => {
    setColumnOrder([
      "name",
      "ticker",
      "avg_price",
      "market_price",
      "latest_chg_pct",
      "asset_class",
      "market_value_ccy",
    ]);
  };
  const randomizeColumns = () => {
    setColumnOrder(shuffle(visibleColumns.map((d) => d.id)));
  };

  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={originalOrder}>
        Original Column order
      </button>
      <button type="button" className="btn btn-primary" onClick={changeOrder}>
        Important Column order
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => randomizeColumns({})}
      >
        Random Columns
      </button>
      <table {...getTableProps()} className="table table-bordered">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  scope="col"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            {loading ? (
              <td colSpan="10000">Loading...</td>
            ) : (
              <td colSpan="10000" className="text-center">
                Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                results
              </td>
            )}
          </tr>
        </tbody>
      </table>

      <div className="pagination">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>{" "}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </button>{" "}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>{" "}
        <div style={{ display: "none" }}>
          <span>
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

function Holdingtable() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name of the holding",
        accessor: "name",
      },
      {
        Header: "Ticker",
        accessor: "ticker",
      },
      {
        Header: "The asset class it belongs to",
        accessor: "asset_class",
      },
      {
        Header: "Average price",
        accessor: "avg_price",
      },
      {
        Header: "Market Price",
        accessor: "market_price",
      },
      {
        Header: "Latest change percentage",
        accessor: "latest_chg_pct",
      },
      {
        Header: "Market Value in Base CCY",
        accessor: "market_value_ccy",
      },
    ],
    []
  );

  const [data, setData] = React.useState([]);
  const [holdData, setHolddata] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  

  React.useEffect(() => {
    setLoading(true);
    async function gettransdata() {
      const response = await fetch(
        "https://canopy-frontend-task.vercel.app/api/holdings"
      );
      const data = await response.json();
      const holding = data.payload;
      setHolddata(holding);
    }
    gettransdata();

    console.log(holdData);
    setLoading(false);
  }, [holdData]);

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;

    setLoading(true);

    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;
        setData(holdData.slice(startRow, endRow));

        setPageCount(Math.ceil(holdData.length / pageSize));

        setLoading(false);
      }
    }, 1000);
  }, []);
  
  return (
   
        <Table
          columns={columns}
          data={data}
          fetchData={fetchData}
          loading={loading}
          pageCount={pageCount}
        />
  );
}

export default Holdingtable;

import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  align?: "left" | "right" | "center";
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  striped?: boolean;
  emptyMessage?: string;
  loading?: boolean;
}

export function Table<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  striped = false,
  emptyMessage = "No data available",
  loading = false,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 bg-neutral-0 dark:bg-neutral-800">
        <thead className="bg-neutral-50 dark:bg-neutral-800/50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 ${
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700 bg-neutral-0 dark:bg-neutral-800">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-neutral-500">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-neutral-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={item.id}
                onClick={() => onRowClick && onRowClick(item)}
                className={`
                  transition-colors duration-150
                  ${onRowClick ? "cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50" : ""}
                  ${striped && rowIndex % 2 === 1 ? "bg-neutral-50 dark:bg-neutral-800/50" : ""}
                  bg-neutral-0 dark:bg-neutral-800
                `}
              >
                {columns.map((col, colIndex) => {
                  const content = typeof col.accessor === "function" 
                    ? col.accessor(item)
                    : (item[col.accessor] as React.ReactNode);

                  return (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-neutral-800 dark:text-neutral-200 ${
                        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                      }`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

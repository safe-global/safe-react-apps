import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Loader from '../loader/Loader'

export interface RowType {
  id: string
  [key: string]: React.ReactNode
}

type DataTableProps = {
  rows: RowType[]
  columns: string[]
  ariaLabel: string
  isTableLoading?: boolean
  loadingText?: string
}

const DataTable = ({ rows, columns, ariaLabel, isTableLoading, loadingText }: DataTableProps) => {
  const hasRows = rows.length > 0

  return (
    <TableContainer component={Paper}>
      <Loader isLoading={isTableLoading} loadingText={loadingText} minHeight={200}>
        <Table aria-label={ariaLabel}>
          <caption>{ariaLabel}</caption>

          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column} align="center">
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {!hasRows && (
              <TableRow>
                <TableCell align="center" colSpan={columns.length}>
                  No data to dispay
                </TableCell>
              </TableRow>
            )}
            {rows.map(row => (
              <TableRow key={row.id}>
                {columns.map(column => (
                  <TableCell key={`${row.id}-${column}`} align="center">
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Loader>
    </TableContainer>
  )
}

export default DataTable

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'
import { Grid as agGrid } from 'ag-grid-community'

import codsJson from './assets/cods-table.json'

const fields = Object.keys(codsJson[0]).sort()

const columnDefs = fields.map(field => {
  if (field === 'Country') {
    return {
      field: 'Cause of death',
      children: [
        {
          headerName: field,
          field: field + '.Country',
          pinned: 'left',
          filter: true,
          filterParams: {
            buttons: ['clear'],
            alwaysShowBothConditions: true,
            defaultJoinOperator: 'OR',
          },
          width: 140,
          wrapText: true,
          cellStyle: ({ value }) => {
            if (value.length >= 17) return { 'line-height': 'unset' }
          },
        },
        {
          headerName: 'Total #',
          field: field + '.Total',
          pinned: 'left',
          width: 100,
        }
      ]
    }
  }
  return {
    field: field,
    wrapText: true,
    headerTooltip: field,
    children: [
      {
        headerName: '#',
        field: field + '.num',
        maxWidth: 60,
      },
      {
        headerName: '%',
        field: field + '.per',
        maxWidth: 60,
        comparator: (a, b) => a - b,
      }
    ]
  }
})

const gridOptions = {
  columnDefs: columnDefs,
  animateRows: true,
  debounceVerticalScrollbar: true,
  defaultColDef: {
    sortingOrder: ['desc', 'asc', null],
    autoHeight: true,
    minWidth: 90,
    sortable: true,
    // enableValue: true,
    // resizable: true,
    // floatingFilter: true, // makes a new row, not cool
  },
  rowData: null,
  getRowStyle: function (params) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' }
    }
  },
  getColStyle: function (params) {
    if (params.node.colPinned) {
      return { 'font-weight': 'bold' }
    }
  },
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  const gridDiv = document.querySelector('#myGrid')
  const grid = new agGrid(gridDiv, gridOptions)
  gridOptions.api.setRowData(codsJson)
})

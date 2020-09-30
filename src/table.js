import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'
import { Grid as agGrid } from 'ag-grid-community'

import codsJson from './assets/cods-table.json'
console.log('codsJson:', codsJson[0])

const fields = Object.keys(codsJson[0])
console.log('fields:', fields)

const columnDefs = fields.map(field => {
  if (field === 'Country') {
    return {
      field: 'Cause of death',
      children: [
        {
          headerName: field,
          headerTooltip: field,
          field: field + '.Country',
          pinned: 'left',
          filter: true,
          width: 120,
          wrapText: true,
          cellStyle: {'line-height': 'unset'}
        },
        {
          headerName: 'Total #',
          field: field + '.Total',
          pinned: 'left',
          width: 80,
        }
      ]
    }
  }
  return {
    field: field,
    wrapText: true,
    children: [
      {
        headerName: '#',
        field: field + '.num'
      },
      {
        headerName: '%',
        field: field + '.per'
      }
    ]
  }
})

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    autoHeight: true,
    autoWidth: true,
    // flex: 1,
    // maxWidth: 90,
    minWidth: 90,
    sortable: true,
    resizable: true,
  },
  rowData: null,
  getRowStyle: function (params) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
  },
  getColStyle: function (params) {
    if (params.node.colPinned) {
      return { 'font-weight': 'bold' };
    }
  },
  onFilterChanged: function (e) {
    console.log('onFilterChanged', e);
    console.log('gridApi.getFilterModel() =>', e.api.getFilterModel());
  },
  onFilterModified: function (e) {
    console.log('onFilterModified', e);
    console.log('filterInstance.getModel() =>', e.filterInstance.getModel());
    console.log(
      'filterInstance.getModelFromUi() =>',
      e.filterInstance.getModelFromUi()
    );
  },
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  const grid = new agGrid(gridDiv, gridOptions);
  console.log('grid:', grid)

  gridOptions.api.setRowData(codsJson);

});

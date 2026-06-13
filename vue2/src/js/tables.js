class TablesOBJ { // Azúcar sintáctica
  constructor () {
    this.search = ''
    this.headers = []
    this.items = []
    this.columns_style = []
    this.header = false
  }

  async setTable (table) {
    this.headers = (table.headers) ? table.headers : []
    this.items = (table.items) ? table.items : []
    this.columns_style = (table.class) ? table.class : []
    this.header = (table.header) ? table.header : false
  }
}

export default TablesOBJ

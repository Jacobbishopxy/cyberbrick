/**
 * Created by Jacob Xie on 8/12/2020.
 */

import app from "./app";


const port = app.get("port")
const server = app.listen(port, () => {
  console.log(`App listening on port ${ port }`)
})

export default server

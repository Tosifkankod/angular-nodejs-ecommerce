import 'dotenv/config'
import app from "./app";
import {AppDataSource} from './utils/data-source'

 


AppDataSource.initialize().then(() => {
  app.listen(4000, () => {
    console.log("server started & database connected");
  });
}).catch((err) => {  
    console.log(err);
})



import pg from 'pg'
import * as dotenv from 'dotenv'
dotenv.config()

const conString = process.env.DB_KEY
export const client = new pg.Client(conString)



// client.connect(function(err) {
//   if(err) {
//     return console.error('could not connect to postgres', err);
//   }
//     // client.end();
  
// });



export function addNewUser(userID,userName){
    const text = `
    INSERT INTO users
    VALUES(${userID},'${userName}');
        `
    
  client.query(text,()=>console.log('added new user'))
}


export async function increaseUserDownloads(type,userid,numberOfImages){
  const text = `
  UPDATE users
  SET ${type}_total_saved = ${type}_total_saved + ${numberOfImages} 
  WHERE userid = ${userid}

  `
 client.query(text)
}








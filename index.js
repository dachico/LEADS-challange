import fs from 'fs/promises';
import log from '@ajar/marker';
import nodemon from 'nodemon';
import path from 'path';

const DIR_PATH = './LEADS';
const result = './promiseResults.json';
const users = [];
fs.readdir(DIR_PATH)
.then((files_names) => {
    console.time('myProcces');
    const pending = files_names.map((file_name) => {
        return fs.readFile(`${DIR_PATH}/${file_name}`)
                .catch(log.error)
    })
    Promise.all(pending)
            .then(content_array => {
                const content = content_array.join('\r\n');

                const lines = content.split('\r\n');

                for(let line of lines) {
                    let [fb_id, full_name, email] = line.split(',');

                    full_name = full_name.slice(1, -1);

                    const ifNewUser = !users.some((user) => user.fb_id === fb_id);

                    if (ifNewUser) {
                        const user = {fb_id, full_name, email};
                        users.push(user);
                    };

                }

                return fs.writeFile(result, JSON.stringify(users, null, 2), 'utf-8');
            })
            .then(() => {
                console.log(`Number of users: ${users.length}`);
                console.timeEnd('myProcces');
            })
}).catch(log.error)



// console.time('myProcess') ;
// (async ()=>{
//     const leads = './LEADS';
//     const result = './results.json'
//     const users = [];
//     // 1. read the directory

//     const fileNames = await fs.readdir(leads);
//     // 2. loop over file names array

//     for (const fileName of fileNames) {
//         // 3. content them to global variable

//         const filePath = path.join(leads, fileName);
//         // 4. concat to global variable

//         const fileContent = await fs.readFile(filePath, 'utf-8');
//         // 5. split content into lines

//         const lines = fileContent.split('\r\n');

//         // console.log(fileContent);
//         // 6. loop over each line

//         for (const line of lines) {
//             // split them using a comma

//             const lineArray = line.split(',');
//             // 7.5 check if this is a new fresh user 

//             const ifNewUser = !users.some(user => user.facebook_id === lineArray[0]);


//             if (ifNewUser) {
//                 // 8 need to remove the "" + // 9 build a user object

//             const user = {
//                 facebook_id: lineArray[0],
//                 full_name: lineArray[1].slice(1, -1),
//                 email: lineArray[2],
//             };
//             // 10 push user object to global users array

//             users.push(user);
//             }
//         }
//     }
//     // 11 write the users array into a json file

//     await fs.writeFile(result, JSON.stringify(users,null,2), 'utf-8');
//     // 12 print the number of user 

//     console.log(`Number of users: ${users.length}`);
//     // 13 print the benchmark time

//     console.timeEnd('myProcess');
    
// })().catch(log.error);
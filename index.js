console.log(`ok, so.. everything looks fine?!`);
//


const readline = require("readline");
const fs = require("fs");


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});



getFolder();

function getFolder() {
    // let mp4Files = [];
    // let mp3Files = [];
    // let pngFiles = [];
    let folders = [];

    let files = {
        mp4: [],
        mp3: [],
        png: [],
    }

    rl.question(`enter folder path: `, (answer) => {
        console.log(answer);

        let path = answer;

        fs.readdir(path, {withFileTypes: true}, (error,items) => {
            if (error) {
                console.log(`error`);

                getFolder();
                return;
            }

            for (const item of items){

                if (item.isFile()) {
                    const fileType = item.name.split(`.`).at(-1).toLowerCase();

                    if(!files[fileType]){
                        files[fileType] = [];
                    }
                    
                    files[fileType].push(item.name);
                }

                else if (item.isDirectory()){
                    folders.push(item.name);
                }
            }
            console.log(`folders:`, folders);
            console.log(files);
            rl.close();
        });

    });

}
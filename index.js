console.log(`ok, so.. everything looks fine?!`);
//


const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const categories = {

    mp4: "Videos",
    mkv: "Videos",
    avi: "Videos",
    mov: "Videos",
    webm: "Videos",
    flv: "Videos",
    wmv: "Videos",
    m4v: "Videos",
    mpg: "Videos",
    mpeg: "Videos",
    ts: "Videos",

    mp3: "Music",
    wav: "Music",
    flac: "Music",
    aac: "Music",
    ogg: "Music",
    oga: "Music",
    opus: "Music",
    m4a: "Music",
    wma: "Music",
    amr: "Music",
    aiff: "Music",
    aif: "Music",

    jpg: "Images",
    jpeg: "Images",
    png: "Images",
    gif: "Images",
    webp: "Images",
    bmp: "Images",
    tiff: "Images",
    tif: "Images",
    svg: "Images",
    ico: "Images",
    heic: "Images",
    heif: "Images",
    avif: "Images",
    raw: "Images",
    cr2: "Images",
    cr3: "Images",
    nef: "Images",
    arw: "Images",
    dng: "Images",
    psd: "Images",

    pdf: "Documents",
    doc: "Documents",
    docx: "Documents",
    odt: "Documents",
    rtf: "Documents",
    txt: "Documents",
    md: "Documents",
    tex: "Documents",

    zip: "Compressed",
    rar: "Compressed",
    tar: "Compressed",
    gz: "Compressed",
    "7z": "Compressed",
    bz2: "Compressed",
    xz: "Compressed",
    zst: "Compressed",
    tgz: "Compressed",
    tbz: "Compressed",

    iso: "Compressed",
    img: "Compressed",
    bin: "Compressed",
    cue: "Compressed",
    dmg: "Compressed",

    exe: "Programs",
    msi: "Programs",
    apk: "Programs",
    appimage: "Programs",
    deb: "Programs",
    rpm: "Programs",
    sh: "Programs",

    srt: "Subtitles",
    ass: "Subtitles",
    ssa: "Subtitles",
    sub: "Subtitles",
    vtt: "Subtitles",

    bak: "Backups",
    old: "Backups",

    tmp: "Temporary",

    torrent: "Torrents",

};


sortFolder();


function sortFolder() {

    let files = {}

    rl.question(`enter folder path to sort: `, (answer) => {
        console.log(answer);

        let folderPath = answer;

        rl.question(`you sure about here y/n? `, (confirm) => {
            if (confirm.toLowerCase() !== "y"){
                console.log("cancelled");
                rl.close();
                return;
            }

            
            fs.readdir(folderPath, {withFileTypes: true}, (error,items) => {
                if (error) {
                    console.log(error);

                    sortFolder();
                    return;
                }

                for (const item of items){

                    if (item.name.startsWith(`.`)) {
                        continue;
                    }

                    if (item.isFile()) {
                        const fileType = item.name.split(`.`).at(-1).toLowerCase();
                        let category = categories[fileType];
                        let subFolder = null;
                    
                        if (category){
                            if (item.name.startsWith(`[@AnimeGateOfficial]`) && category === "Videos"){
                                subFolder = "Anime";
                            }

                            if (!files[category]){
                                files[category] = [];
                            }

                            files[category].push({name: item.name, subFolder: subFolder});
                        }
                        else {
                            if (!files.Others){
                                files.Others = [];
                            }
                            files.Others.push({name: item.name, subFolder: subFolder});
                        }
                    }
                }

                let createdFolders = 0;
                let movedFiles = 0;
                let totalFiles = 0;
                let failedFiles = [];
                let logs = [];
                const categoriesToCreate = Object.keys(files);

                const date = new Date();
                logs.push(`Sort : ${date}`);
                logs.push(" ");

                for(const category of categoriesToCreate){
                    totalFiles+= files[category].length;
                }

                if (categoriesToCreate.length === 0){
                    console.log("nothing to sort!");
                    rl.close();
                    return;
                }

                for (const category of Object.keys(files)){
                    
                    const categoryPath = path.join(folderPath, category);

                    fs.mkdir(categoryPath, {recursive: true}, (error) => {
                        if (error){
                            console.log(error);
                            return;
                        }
                        createdFolders++;
                        console.log(`created: ${categoryPath}`);

                        if (createdFolders === categoriesToCreate.length) {
                            console.log(`all folders are ready!`);

                            for (const category of categoriesToCreate){

                                for (const file of files[category]){

                                    const source = path.join(folderPath, file.name);
                                    moveFile(source, folderPath, category, file.name, file.subFolder, failedFiles, logs,
                                        () => {
                                        movedFiles++;
                                        if (movedFiles === totalFiles){
                                            console.log(`sorting finished!`);
                                            console.log(`Moved: ${movedFiles}/${totalFiles} files`);
                                            console.log(`Failed: ${failedFiles.length}/${totalFiles} files`);

                                            if (failedFiles.length > 0){
                                                for (const file of failedFiles){
                                                    console.log(`Failed: ${file}`);
                                                }
                                            }

                                            logs.push(" ");
                                            logs.push(`Moved: ${movedFiles}/${totalFiles} files`);
                                            logs.push(`Failed: ${failedFiles.length}/${totalFiles} files`);
                                                                           
                                            fs.mkdirSync(path.join(folderPath,"Logs"), { recursive: true });
                                            fs.writeFileSync(path.join(folderPath,"Logs", "latest_log.txt"), logs.join("\n"));
                                            
                                            rl.close();
                                        }
                                    });

                                }
                            }
                        }
                    });                  
                }
            });
        });
    })
}


function moveFile(source, folderPath, category, file, subFolder, failedFiles, logs, callback){
   const extension = path.extname(file);
   const name = path.basename(file, extension);

   let counter = 0;

    let destinationFolder;

    if (subFolder){
       destinationFolder = path.join(folderPath, category, subFolder);
    }
    else {
        destinationFolder = path.join(folderPath, category);
    }


   function checkName() {
    let newName;

    if (counter === 0){
        newName = `${name}${extension}`;
    }
    else{
        newName = `${name}(${counter})${extension}`;
    }

    const newPath = path.join(destinationFolder, newName);

    fs.access(newPath, (error) => {
        if (!error) {
            counter++;
            checkName();
            return;
        }

        fs.rename(source, newPath, (error) => {
            if(error) {
                console.log(error);
                failedFiles.push(file);
                logs.push(`Failed: ${file}`);
                callback();
                return;
            }

            console.log(`moved: ${newName}`);
            logs.push(`Moved: ${file} -> ${category}/${newName}`);
            callback();
        });
    });

   }

   fs.mkdir(destinationFolder, {recursive: true}, (error) => {
    if (error){
        console.log(error);
        return;
    }

    checkName();
    
   });
}
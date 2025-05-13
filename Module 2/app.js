const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Store all filenames to filenames.txt to check duplicate
const allFilename = path.join(__dirname, 'filenames.txt');

// Store existing filenames into an existingFilenames array
let existingFilenames = [];
if (fs.existsSync(allFilename)) {
    const data = fs.readFileSync(allFilename, 'utf-8');
    existingFilenames = data.split('\n').filter(name => name.trim() !== '');
}

// Create object for readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Create askFilename funtion to accept file name and check duplicate or create a new file
function askFilename() {
    rl.question('Enter a filename (without extension): ', (inputName) => {
        if (inputName.trim() !== "")
        {
            const filename = inputName.trim() + '.txt';

            // Check if file already exits
            if (existingFilenames.includes(filename)) {
                console.log(`${filename} - File already exists. Please use a another filename.`);
                askFilename(); // Ask again
            } else {
                // Create a new file and write "You are awesome" to the new file
                fs.writeFileSync(path.join(__dirname, filename), 'You are awesome');

                // Add filename to record and save to filenames.txt
                fs.appendFileSync(allFilename, filename + '\n');
                console.log(`File ${filename} created successfully!`);
                rl.close();
            }
        }
        else {
            console.log(`Filename can't be blank.`);
            askFilename(); // Ask again
        }
    });
}

askFilename();
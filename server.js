import express from 'express'
import {exec} from 'child_process'
import cors from 'cors'
import fs from "fs";
const app = express();



app.use(express.json())
app.use(cors())

app.post('/run-command', (req, res) => {
    const command = req.body.command;
    const commandPrefix = command.split(' ')[0]
    const date = new Date();
    // YYYY.MM.DD_HH:MM:SS
    const formattedDate = `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const fileName = `result-${formattedDate}.txt`;

    if (commandPrefix !== 'rosrun' && commandPrefix !== 'roslaunch') {
        return res.status(400).json({ error: 'Invalid command.' })
    }

    /**
     * TODO - for testing purposes we are using an echo and output the result to a file.
     * The final implementation for the end product will simply use the command constant defined above which will be
     * either a rosrun or roslaunch command.
     */
    exec(`echo "your command is : ${command} and it was executed on the : ${formattedDate}" > out/${fileName}`, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: `error: ${error.message}` })
            return
        }
        if (stderr) {
            res.status(500).json({ error: `stderr: ${stderr}` })
            return
        }
        fs.readFile(`out/${fileName}`, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.toString() })
            }
            res.status(200).json({ data: data, file: fileName })
        })
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
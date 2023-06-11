import express from 'express'
import {exec} from 'child_process'
import cors from 'cors'
const app = express();

app.use(express.json())
app.use(cors())

app.post('/run-command', (req, res) => {
    const command = req.body.command;
    const commandPrefix = command.split(' ')[0]

    if (commandPrefix !== 'rosrun' && commandPrefix !== 'roslaunch') {
        return res.status(400).json({ error: 'Invalid command.' })
    }

    /**
     * TODO - for testing purposes we are using "ls" as the command to execute as it's an available command on Ubuntu.
     * The final implementation for the end product will simply use the command constant defined above which will be
     * either a ros
     */
    exec(`echo "your command is : ${command}, the run date is : DATE" > out/result.DATE.txt`, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: `error: ${error.message}` })
            return
        }
        if (stderr) {
            res.status(500).json({ error: `stderr: ${stderr}` })
            return
        }
        res.status(200).json({ response: stdout })
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
import express from 'express'
import {exec} from 'child_process'
import cors from 'cors'
const app = express();

app.use(express.json())
app.use(cors())

app.post('/run-command', (req, res) => {
    const command = req.body.command;
    const commandPrefix = command.split(' ')[0];

    if (commandPrefix !== 'rosrun' && commandPrefix !== 'roslaunch') {
        return res.status(400).json({error: 'Invalid command.'});
    }

    exec('ls', (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: `error: ${error.message}` });
            return;
        }
        if (stderr) {
            res.status(500).json({ error: `stderr: ${stderr}` });
            return;
        }
        res.status(200).json({ response: stdout });
    });
})

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
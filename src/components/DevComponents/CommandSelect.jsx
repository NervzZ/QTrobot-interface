import {FormControl, FormLabel, Radio, RadioGroup} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function CommandSelect({commandState, onCommandChange}) {

    const handleChange = (event) => {
        onCommandChange(event.target.value)
    }

    return (
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Command type</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="rosrun"
                name="radio-buttons-group"
                value={commandState}
                onChange={handleChange}
            >
                <FormControlLabel value="rosrun" control={<Radio/>} label="rosrun"/>
                <FormControlLabel value="roslaunch" control={<Radio/>} label="roslaunch"/>
            </RadioGroup>
        </FormControl>
    )
}
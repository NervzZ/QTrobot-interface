import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

export default function ContextSelect({value, onChange}) {

    const handleChange = (event) => {
        onChange(event.target.value)
    }

    return (
        <FormControl sx={{mb: 2, minWidth: 80}}>
            <InputLabel id="demo-simple-select-autowidth-label">Context</InputLabel>
            <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={value}
                onChange={handleChange}
                autoWidth
                label="Context"
            >
                <MenuItem value={'writing'}>Writing</MenuItem>
                <MenuItem value={'stretching'}>Stretching</MenuItem>
                <MenuItem value={'meditation'}>Meditation</MenuItem>
                <MenuItem value={'counting'}>Counting</MenuItem>
            </Select>
        </FormControl>
    )
}
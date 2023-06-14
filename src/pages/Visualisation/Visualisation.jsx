import 'SRC/App.css'
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material"
import {useEffect, useState} from "react"
import {Download, Image} from "@mui/icons-material"
import Button from "@mui/material/Button"
import {getDownloadURL, listAll, ref} from "firebase/storage"
import {storage} from "SRC/firebaseConfig.js"
import Box from "@mui/material/Box";
import placeholderGraphImg from 'SRC/assets/img/graphs_placeholder.png'


const Visualisation = () => {

    const [file, setFile] = useState('')
    const [format, setFormat] = useState('.pdf')
    const [fileRefs, setFileRefs] = useState({})
    const [refresh, setRefresh] = useState(true)

    useEffect(() => {
        const listAllRef = ref(storage, 'commandOutputs');
        listAll(listAllRef)
            .then((res) => {
                const promises = res.items.map((item) =>
                    getDownloadURL(ref(storage, item.fullPath)).then((url) => {
                        return {[item.name]: url};
                    })
                );
                return Promise.all(promises);
            })
            .then((urlObjs) => {
                const urls = Object.assign({}, ...urlObjs);
                setFileRefs(urls);
            });
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.value)
    }

    const handleFormatChange = (event) => {
        setFormat(event.target.value)
    }

    const handleDownload = () => {
        if (file !== '') {
            //required to mimick a link click to start the download
            const link = document.createElement('a');
            link.href = file;
            document.body.appendChild(link); // Required for Firefox
            link.click();
            document.body.removeChild(link);
        }
    }

    return (
        <div className="App" style={{
            maxWidth: '950px',
            margin: '50px auto',
        }}>
            <div style={{width: '100%', textAlign:'left'}}>
                <FormControl sx={{m: 1, minWidth: 350}}>
                    <InputLabel id="demo-simple-select-helper-label">Online files</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={file}
                        label="Online files"
                        onChange={handleFileChange}
                    >
                        {Object.entries(fileRefs).map(([file, url]) => (
                            <MenuItem key={file} value={url}>{file}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{m: 1, minWidth: 100}}>
                    <InputLabel id="demo-simple-select-helper-label">format</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={format}
                        label="Format"
                        onChange={handleFormatChange}
                    >
                        <MenuItem value={'.pdf'}>.pdf</MenuItem>
                        <MenuItem value={'.csv'}>.csv</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    sx={{mt: 2, ml: 2}}
                    variant="outlined"
                    startIcon={<Download/>}
                    onClick={handleDownload}
                >
                    Download
                </Button>
            </div>
            <h1>Visualisation 1</h1>
            <Box>
                <img style={{maxWidth: '100%'}} src={placeholderGraphImg} alt="placeholder-graphs" />
            </Box>
        </div>
    )
}

export default Visualisation
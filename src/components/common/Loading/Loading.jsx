import {CircularProgress} from "@mui/material";
import styles from './Loading.module.css'

function Loading() {
    return (
        <div className={styles.loading}>
            <CircularProgress size={150}/>
        </div>
    )
}

export default Loading
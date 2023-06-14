import 'SRC/App.css'
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import {ButtonBase, styled} from "@mui/material"
import {useNavigate} from "react-router-dom"
import qtimg from 'SRC/assets/img/QTrobot.png'
import childrenimg from 'SRC/assets/img/children.png'
import tabletWritingImg from 'SRC/assets/img/tablet_writing.jpg'


const HomePage = () => {
    const images = [
        {
            url: qtimg,
            title: 'Story Telling',
            width: '33.33%',
            path: '/'
        },
        {
            url: childrenimg,
            title: 'Children Data',
            width: '33.33%',
            path: '/'
        },
        {
            url: tabletWritingImg,
            title: 'Other activities',
            width: '33.33%',
            path: '/'
        },
    ];

    const ImageButton = styled(ButtonBase)(({theme}) => ({
        position: 'relative',
        height: 200,
        [theme.breakpoints.down('sm')]: {
            width: '100% !important', // Overrides inline-style
            height: 100,
        },
        '&:hover, &.Mui-focusVisible': {
            zIndex: 1,
            '& .MuiImageBackdrop-root': {
                opacity: 0.15,
            },
            '& .MuiImageMarked-root': {
                opacity: 0,
            },
            '& .MuiTypography-root': {
                border: '4px solid currentColor',
            },
        },
    }));

    const ImageSrc = styled('span')({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    });

    const Image = styled('span')(({theme}) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    }));

    const ImageBackdrop = styled('span')(({theme}) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    }));

    const ImageMarked = styled('span')(({theme}) => ({
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    }));

    const navigate = useNavigate()

    return (
        <div className="App" style={{
            maxWidth: '900px',
            margin: '100px auto',
        }}>
            <Box sx={{display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%'}}>
                {images.map((image) => (
                    <ImageButton
                        focusRipple
                        key={image.title}
                        style={{
                            width: image.width,
                        }}
                        onClick={() => navigate(image.path)}
                    >
                        <ImageSrc style={{backgroundImage: `url(${image.url})`}}/>
                        <ImageBackdrop className="MuiImageBackdrop-root"/>
                        <Image>
                            <Typography
                                component="span"
                                variant="subtitle1"
                                color="inherit"
                                sx={{
                                    position: 'relative',
                                    p: 4,
                                    pt: 2,
                                    pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                                }}
                            >
                                {image.title}
                                <ImageMarked className="MuiImageMarked-root"/>
                            </Typography>
                        </Image>
                    </ImageButton>
                ))}
            </Box>
        </div>
    );
}

export default HomePage
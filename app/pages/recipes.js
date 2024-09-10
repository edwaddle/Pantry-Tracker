import {useState, useEffect } from 'react';
import {Box, Stack, Typography, Button, Modal, TextField}  from '@mui/material';
import {firestore} from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
const style = {
    position: 'sticky',
    top: '50%',
    left: '50%',  
    width: 400,
    bgcolor: 'white',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    gap:1,
    p: 4, //padding
    boxShadow: 24
}
export default function Recipes() {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    //open recipe list
    //add recipe
    const addRecipe = async (name, array) => {
        
    }
    useEffect(() => {
        updateInventory();
    }, [])

    const updateInventory = async () => {
        const snapshot = query (collection(firestore, 'Recipes'));
        const docs = await getDocs(snapshot);
        const inventoryList = [];
        docs.forEach((doc) => {
            inventory.push({name: doc.id, ...doc.data()})

        })
        setInventory(inventoryList);

    }
    //get possible recipes
    //used to open and close recipe menu later
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    
    return (
        <Box
        width = "100vw"
        height="100vh"
        display={'flex'}
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={2}
        position={"absolute"}>
            <Modal
            open={open}
            onClose = {handleClose}>
                <Box sx = {style}>
                    <Typography varaint="h6" component="h3" sx={{color: "#1565c0"}}>
                        Recipe List
                    </Typography>
                    <Stack width="100%" direction ={'row'} spacing={2}>
                        some recipe
                        <Button
                        variant="contained"
                        onClick={() => {
                            handleClose()
                        }}>
                            close
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <Box
            sx={{transform: 'translateX(40vw) translateY(40vh)'}}>
                <Button
                varaint="contained"
                sx={{position:"absolute"}}
                onClick={()=> {
                    handleOpen()
                }}
                >
                    something
                </Button>
            </Box>
            
            
        </Box>
        
    );
}
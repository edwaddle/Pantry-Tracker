import React from 'react';
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
    //add recipe
    useEffect(() => {
        updateInventory();
    }, [])

    const updateInventory = async () => {
        const snapshot = query (collection(firestore, 'Recipes'));
        const docs = await getDocs(snapshot);
        const inventoryList = [];
        docs.forEach((doc) => {
            /*
            const arrayResult = Object.keys(doc.data).map(data => {
                return {id: data,...data.data()} 
            });
            */
            inventoryList.push({type: doc.id, ...doc.data()})
        })
        setInventory(inventoryList);

    }

    const getFood = (Food2) => {
        /*
        let returnString = "";
        for (let i = 0; i < Object.keys(Food2).length; i++){
            returnString += (Object.keys(Food2)[i] + ": " + Object.values(Food2)[i] + "<br />")
        }
        return returnString;
        */
        return Object.keys(Food2).map((key, index) => (
            <React.Fragment key={index}>
                {key}: {Food2[key] + ""}<br />
            </React.Fragment>
        ));

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
                    <Stack width="100%" direction ={'column'} spacing={2}>
                        {inventory.map(({type, Food2}) => (
                            <Box
                            key={type}
                            width="100%"
                            minHeight="150px"
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            bgcolor={'#f0f0f0'}
                            paddingX={5}>
                                <Typography varaint={'h3'} color ={'#333'} textAlign={'center'}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Typography>
                                <Typography variant={'h6'} color={'#333'} textAlign={'center'} fontSize={10}>
                                    {
                                        getFood(Food2)
                                        
                                    }
                                </Typography>
                            </Box>
                        ))}
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
                onClick={async ()=> {
                    handleOpen()
                }}
                >
                    something
                    
                </Button>
            </Box>
            
            
        </Box>
        
    );
}
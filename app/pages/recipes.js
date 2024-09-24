import React from 'react';
import {useState, useEffect } from 'react';
import {Box, Stack, Typography, Button, Modal, TextField, Drawer}  from '@mui/material';
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
export default function Recipes({ingredientList}) {
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
            inventoryList.push({type: doc.id, ...doc.data()})
        })
        setInventory(inventoryList);

    }

    const hasIngredient = (ingredients) => {
        const realIngredientList = ingredientList.map(({ name }) => name);
      
        for (const ingredient of ingredients) {
          if (!realIngredientList.includes(ingredient)) {
            return false; // Return false if an ingredient is not found
          }
        }
      
        return true; // Return true if all ingredients are found
    };

    const getFood = (Food2) => {
        
        return Object.keys(Food2).map((key, index) => (
            <Box>
                <Box 
                key={index}
                width="40"
                padding={1}
                bgcolor={"#bcaaa4"}
                marginTop={4}
                marginLeft={4}
                marginRight={4}
                boxSizing={"border-box"}
                >
                    {console.log(hasIngredient(Food2[key]) + Food2[key]) }
                    <Typography
                    display={"flex"}
                    justifyContent={"center"}
                    sx={{
                        color: hasIngredient(Food2[key]) === true ? "black" : "white",
                    }}
                    >{key}</Typography>
                    <Typography
                    textAlign={"left"}>{Food2[key] + ""}</Typography>
                    {/*{key}: {Food2[key] + ""}<br /> */}
                </Box>
            </Box>
        ));

    }
    //get possible recipes
    //used to open and close recipe menu later
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    
    return (

        <>
            {/*}
            <Modal
            open={open}
            onClose = {handleClose}>
                
            </Modal>
            {*/}
            <Drawer open={open} onClose={handleClose} anchor={"right"}>
            <Box >
                    <Typography varaint="h6" component="h3" sx={{color: "#1565c0"}}>
                        Recipe List
                    </Typography>
                    <Stack width="100%" direction ={'column'} spacing={2}>
                        {inventory.map(({type, Food2}) => (
                            <Box
                            key={type}
                            sx={{width:'minContent'}}
                            minHeight="250px"
                            height = "auto"
                            bgcolor="#d7ccc8">
                                <Typography varaint={'h3'} color ={'#333'} textAlign={'center'}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Typography>
                                <Typography variant={'h4'} color={'#333'} textAlign={'center'} fontSize={20} multiline>
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
            </Drawer>
            <Box
            height={"40px"}
             bgcolor={"#CCD5AE"}
             borderRadius={"16px"}
             display={"flex"}
            justifyContent={"center"}>
                
            {/*sx={/{transform: 'translateX(40vw) translateY(40vh)'}}> */}
                <Button
                varaint="contained"
                sx={{position:"absolute"}}
                onClick={async ()=> {
                    handleOpen()
                }}
                >
                    <Typography>Recipe List</Typography>
                    
                </Button>
            </Box>
            
            
        </>
        
    );
}
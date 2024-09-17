'use client'

import {useState, useEffect } from 'react';
import {Box, Stack, Typography, Button, Modal, TextField}  from '@mui/material';
import {firestore} from '@/firebase';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import Recipes from './pages/recipes';
const style = {
  position: 'sticky',
  top: '50%',
  left: '50%',  
  width: 400,
  bgcolor: '#FEFAE0',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  gap:1,
  p: 4, //padding
  boxShadow: 24,
}

const buttonStyle = {
  
}

const headerStyle = {
  width: '70vw',
  display: 'flex',
  justifyContent: 'space-between',
  bgcolor: "white",
  p: 4, //padding
  position: "fixed",
  top: "24px",
  borderRadius: "16px",
  bgcolor: "#FAEDCD"
}



export default function Home() {
  const[inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCalorie, setOpenCalorie] = useState(false);
  const [itemName, setItemName] = useState('');
  const [calorieCount, setCalorieCount] = useState();

  const [currItem, setCurrItem] = useState("");
  const theme = createTheme({
    palette: {
      primary: {
        main: '#CCD5AE',
        dark: '#E9EDC9',},
      secondary: {main: '#FAEDCD'},
      text: {
        main: '#7c7575',
        dark: '#968f8f'
      },

    },
    components: {
      MuiButton: {
        defaultProps: {
          disableRipple: true,
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            padding: "8px",
            borderRadius: "12px",
            /*
            backgroundColor: "#CCD5AE",
            color: "#7c7575",
            '&:hover': {
            backgroundColor: "#E9EDC9", // Ensures background color remains the same on hover`
            color: "#7c7575",   // Ensures text color remains the same on hover
            */
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "#7c7575",
          }
          
        }
      }
    },
      
  });
  const getInventory = () => {
    const tempList = [];
    
    inventory.map((name) => {
      console.log(name)
      tempList.push(name);
    });
    
    return tempList;
  }
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({name: doc.id, ...doc.data() })
      //console.log(doc.id + " " + doc.data())
    })
    console.log(inventoryList);
    setInventory(inventoryList);
  }

  useEffect(() => {
    updateInventory();
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef) //get snapshot of the doc ref
    if (docSnap.exists()){
      const {calorie, quantity} = docSnap.data();
      await setDoc(docRef, { quantity: quantity +1, calorie: calorie});
    }
    else{
      await setDoc(docRef, {quantity: 1, calorie: ""})
    }
    await updateInventory()
  }

  const addCalories = async( calorieCount) => {
    console.log(currItem)
    const docRef = doc(collection(firestore, 'inventory'), currItem)
    const docSnap = await getDoc(docRef)
    const {quantity} = docSnap.data();
    await setDoc(docRef, {calorie: calorieCount, quantity: quantity})
    console.log(docSnap.data())
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()){
      const {quantity} = docSnap.data();
      if (quantity === 1 || !quantity){ //!quantity checks if it's null
        await deleteDoc(docRef);
      }
      else{
        await setDoc(docRef, {quantity: quantity-1})
      }
    }
    await updateInventory();


  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleOpenCalorie = async (name) => { setCurrItem(name); setOpenCalorie(true); }
  const handleCloseCalorie = () => setOpenCalorie(false)
  return (
    <ThemeProvider theme={theme}>
      <Box
      width ="100vw"
      minHeight = "100vh"
      display={'flex'}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={'center'}
      gap={2}
      bgcolor={'#FEFAE0'}
      >
        <Box
        sx={headerStyle}>
          <Box>Your Pantry Tracker</Box>
          <Box> the searchbar</Box>
            
        </Box>
        
        <Recipes ingredientList={getInventory()}/>

        <Modal //add new item popup
          open={open}
          onClose={handleClose}
          aria-laballedby="modal-mmodal-title"
          aria-describedby="modal-modal-description">
            <Box
            sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h3" > {/*variants changes the font size*/}
                Add Item
              </Typography>
              <Stack width="100%" direction={'row'} spacing={2}>
                <TextField 
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{color:"#7c7575"}}
                />
                <Button
                variant="contained"
                onClick={()=> {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}>
                  Add
                </Button>
              </Stack>
            </Box>
            

        </Modal>
        <Modal  // add new calroie pop up
        open={openCalorie}
        onClose={handleCloseCalorie}
        aria-laballedby="modal-mmodal-title"
        aria-describedby="modal-modal-description">
          <Box
          sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h3"> {/*variants changes the font size*/}
              Add Calorie
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField 
              id="outlined-basic"
              label="Calorie"
              variant="outlined"
              fullWidth
              value={calorieCount}
              onChange={(e) => setCalorieCount(e.target.value)}
              />
              <Button
              variant="contained"
            
              onClick={()=> {
                addCalories(calorieCount)
                setCalorieCount() //sets it as nothing in the beginning
                handleCloseCalorie()
              }}>
                Add
              </Button>
            </Stack>
          </Box>
          

        </Modal>
        <Button variant="contained" 
        onClick={handleOpen}
        sx={{position:'fixed',
          left: "24px",
          bottom:"24px"
        }}
        >
          Add New Item
        </Button>
        <Box border={'1px solid #black'}>
          <Box
            width="800px"
            height="100px"
            sx={{ bgcolor: 'secondary.main' }}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            >
              <Typography variant={'h2'} color={'#3A3B3C'} textAlign={'center'}>
                Inventory Items
              </Typography>
            </Box>
            <Stack width="1000px" height="300px" spacing={2} overflow={'auto'}>
              {inventory.map(({name, quantity, calorie}) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="150px"
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  bgcolor={'#f0f0f0'}
                  paddingX={5}
                >
                  <Typography variant={'h3'} color={'#3A3B3C'} textAlign={'center'}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant={'h4'} color={'#3A3B3C'} textAlign={'center'}>
                    Quantity: {quantity}
                  </Typography>
                  <Typography variant={'h4'} color={'#3A3B3C'} textAlign={'center'}>
                    Calories: {calorie} 
                  </Typography>
                  <Button variant="contained" 
                
                  onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                  <Button variant="contained" 
                 
                  onClick={() => handleOpenCalorie(name) }>Add Calories</Button>
                </Box>
              ))}
            </Stack>
        </Box>
        
      </Box>
      </ThemeProvider>
  );
}

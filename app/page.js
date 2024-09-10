'use client'

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
import Recipes from './pages/recipes';
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
  boxShadow: 24,


  /*
  position:'absolute',
  top: '50%', 
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  */
}



export default function Home() {
  const[inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCalorie, setOpenCalorie] = useState(false);
  const [itemName, setItemName] = useState('');
  const [calorieCount, setCalorieCount] = useState();

  const [currItem, setCurrItem] = useState("");


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
      <Box
      width ="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={"center"}
      flexDirection={"column"}
      alginItems={'center'}
      gap={2}>
        <Modal
        open={open}
        onClose={handleClose}
        aria-laballedby="modal-mmodal-title"
        aria-describedby="modal-modal-description">
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h3" sx={{color: "#1565c0"}}> {/*variants changes the font size*/}
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
          {/* calorie menu opener*/}
        <Modal
        open={openCalorie}
        onClose={handleCloseCalorie}
        aria-laballedby="modal-mmodal-title"
        aria-describedby="modal-modal-description">
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h3" sx={{color: "#1565c0"}}> {/*variants changes the font size*/}
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


        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
        <Recipes/>
        <Box border={'1px solid #333'}>
          <Box
            width="800px"
            height="100px"
            bgcolor={"#ADD8E6"}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            >
              <Typography variant={'h2'} color ={'#333'} textAlign={'center'}>
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
                  <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
                    Quantity: {quantity}
                  </Typography>
                  <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
                    Calories: {calorie} 
                  </Typography>
                  <Button variant="contained" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                  <Button variant="contained" onClick={() => handleOpenCalorie(name) }>Add Calories</Button>
                </Box>
              ))}
            </Stack>
        </Box>
        
      </Box>
  );
}

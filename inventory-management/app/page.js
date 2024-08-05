'use client';
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, getDocs, query, setDoc, getDoc, deleteDoc, doc } from "firebase/firestore";
import WelcomePage from "./WelcomePage";
import { doSignOut } from "../auth"

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleContinue = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await doSignOut();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <WelcomePage onContinue={handleContinue} />;
  }

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top="50%" left="50%" sx={{ transform: 'translate(-50%, -50%)' }} width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3}>
          <Typography variant="h6">Add new items!</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <Button variant="outlined" onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Stack direction={"row"} spacing={10}>
      <Button variant="contained" onClick={handleOpen}>Add new Item!</Button>
      <Button variant="contained" onClick={handleLogout}>Logout</Button>
      </Stack>
      <Box border="1px solid #333">
        <Box width="700px" height="100px" bgcolor="#FFADAD" display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h2" color="#333">Inventory Management</Typography>
        </Box>
        <Stack width="700px" height="300px" spacing={3} sx={{ overflow: 'auto' }}>
          {inventory.map(({ name, quantity }) => (
            <Box key={name} width="100%" minHeight="150px" display="flex" alignItems="center" justifyContent="space-between" bgcolor="#f0f0f0" p={5}>
              <Typography variant="h4" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h4" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => addItem(name)}>Add Item</Button>
                <Button variant="contained" onClick={() => removeItem(name)}>Remove Item</Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

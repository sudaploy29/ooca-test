'use client'
import { useState } from 'react'
import axios from 'axios'
import {
  Button,
  FormControl,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  Container,
  Checkbox,
  Box,
  Radio,
  Switch,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Swal from 'sweetalert2'
import RestoreIcon from '@mui/icons-material/Restore'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const GradientContainer = styled(Container)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'black',
  // background: 'linear-gradient(0deg, rgba(179,18,18,1) 0%, rgba(31,199,215,1) 46%, rgba(133,134,212,1) 100%)',
  padding: theme.spacing(4),
}))

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  height: '170px', // กำหนดความสูงของการ์ด
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}))

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  height: '100%', // ทำให้ CardContent ใช้พื้นที่เต็มที่ของการ์ด
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}))

const itemOptions = [
  { id: 1, name: 'Red set', price: 50, color: '#ff4c4c', discount: '' },
  {
    id: 2,
    name: 'Green set',
    price: 40,
    color: '#4caf50',
    discount: 'Get 2 for 5% discount.',
  },
  { id: 3, name: 'Blue set', price: 30, color: '#2196f3', discount: '' },
  { id: 4, name: 'Yellow set', price: 50, color: '#ffeb3b', discount: '' },
  {
    id: 5,
    name: 'Pink set',
    price: 80,
    color: '#e91e63',
    discount: 'Get 2 for 5% discount.',
  },
  { id: 6, name: 'Purple set', price: 90, color: '#9c27b0', discount: '' },
  {
    id: 7,
    name: 'Orange set',
    price: 120,
    color: '#ff9800',
    discount: 'Get 2 for 5% discount.',
  },
]

const Home = () => {
  const [orderedItems, setOrderedItems] = useState<
    { id: number; total: number }[]
  >([])
  const [hasMemberCard, setHasMemberCard] = useState(false)

  const updateItemQuantity = (id: number, delta: number) => {
    setOrderedItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === id)
      if (existingItem) {
        const newTotal = existingItem.total + delta
        if (newTotal <= 0) {
          return prevItems.filter((item) => item.id !== id)
        }
        return prevItems.map((item) =>
          item.id === id ? { ...item, total: newTotal } : item,
        )
      } else if (delta > 0) {
        return [...prevItems, { id, total: delta }]
      }
      return prevItems
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/calculate', {
        items: orderedItems,
        hasMemberCard,
      })
      Swal.fire({
        title: 'Total Price',
        text: `${response.data.totalPrice} THB`,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          container: 'my-swal-container',  
        },
      })
    } catch (error) {
      console.error('Error calculating price:', error)
      Swal.fire({
        title: `Something's wrong!`,
        text: `Error : ${error}`,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'my-swal-container', 
        },
      })
    }
  }

   const handleReset = () => {
    setOrderedItems([])  
    setHasMemberCard(false)  
  }

  return (
    <GradientContainer>
      <Typography
        style={{ fontWeight: 'bold', fontSize: '50px' }}
        variant='h4'
        component='h1'
        gutterBottom
      >
        Food Store Calculator
        {/* <br />
        {JSON.stringify(orderedItems)}<br />
        {JSON.stringify(hasMemberCard)} */}
      </Typography>
      <Grid container spacing={3} justifyContent='center'>
        {itemOptions.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <StyledCard>
              <CardContentStyled>
                <Grid
                  container
                  direction='column'
                  alignContent={'center'}
                  alignItems={'center'}
                  spacing={2}
                >
                  <Grid item>
                    <Typography
                      variant='h6'
                      style={{
                        color: item.color,
                        fontWeight: 'bold',
                        fontSize: '22px',
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      Price: {item.price} THB
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <Grid container alignItems='center' spacing={1}>
                        <Grid item>
                          <IconButton
                            onClick={() => updateItemQuantity(item.id, -1)}
                            color='error'
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <Typography variant='h5' component='h2'>
                            {orderedItems.find((o) => o.id === item.id)
                              ?.total || 0}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <IconButton
                            onClick={() => updateItemQuantity(item.id, 1)}
                            color='primary'
                          >
                            <AddIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <Typography color={'red'}>** {item.discount}</Typography>
                  </Grid>
                </Grid>
              </CardContentStyled>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          position: 'absolute',
          bottom: (theme) => theme.spacing(4),
          right: (theme) => theme.spacing(4),
          display: 'flex',
          alignItems: 'center',
          gap: (theme) => theme.spacing(2),
        }}
      >
        <FormControl>
          <Grid container alignItems='center' spacing={1}>
            <Grid item>
              <Checkbox
                checked={hasMemberCard}
                onChange={() => setHasMemberCard(!hasMemberCard)}
                color='default'
                size='large'
                style={{ color: '#ffffff' }}
              />
            </Grid>
            <Grid item>
              <Typography
                style={{ fontWeight: 'bold', fontSize: '16px' }}
                variant='body1'
                component='span'
              >
                Member Card
              </Typography>
            </Grid>
          </Grid>
        </FormControl>
        <Button
          onClick={handleSubmit}
          style={{ fontWeight: 'bold', fontSize: '16px' }}
          size='small'
          variant='outlined'
          endIcon={<ShoppingCartIcon />}
          disabled={orderedItems.length==0}
        >
          Calculate Price
        </Button>
     <Button variant='outlined' startIcon={<RestoreIcon />} onClick={handleReset} color="error">
          Reset
        </Button>
      </Box>
    </GradientContainer>
  )
}

export default Home

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
} from '@mui/material'
import { styled } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Swal from 'sweetalert2'
import RestoreIcon from '@mui/icons-material/Restore'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const GradientContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'black',
  padding: theme.spacing(4),
  paddingBottom: `calc(56px + ${theme.spacing(4)}px)`, // Adjust paddingBottom to accommodate button height
}))

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  height: '160px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}))

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  height: '100%',
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
      const response = await axios.post(
        'https://ooca-test-server.onrender.com/calculate',
        {
          items: orderedItems,
          hasMemberCard,
        },
      )
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
      </Typography>
      <Grid container spacing={3} justifyContent='center'>
        {itemOptions.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id} style={{backgroundColor:item.color}}>
            <StyledCard style={{backgroundColor:item.color}}>
              <CardContentStyled >
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
                    {item.discount && (
                      <Typography color={'red'}>** {item.discount}</Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContentStyled>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 2,
          backgroundColor: 'black',
          zIndex: 1000, // Ensures it stays on top of other content
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-end' }, // Aligns to right on md and larger
          gap: (theme) => theme.spacing(2),
        }}
      >
        {/* Group the checkbox and label in a flex container */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1, // Space between checkbox and label
          }}
        >
          <Checkbox
            checked={hasMemberCard}
            onChange={() => setHasMemberCard(!hasMemberCard)}
            color='default'
            size='large'
            style={{ color: '#ffffff' }}
          />
          <Typography
            style={{
              fontWeight: 'bold',
              fontSize: '16px',
              color:'white'
            }}
            variant='body1'
            component='span'
          >
            Member Card
          </Typography>
        </Box>

        <Button
          sx={{
            width: { xs: '100%', md: 'auto' },
            ml: { md: 2 },
          }}
          size='small'
          variant='outlined'
          startIcon={<RestoreIcon />}
          onClick={handleReset}
          color='error'
        >
          Reset
        </Button>

        <Button
          onClick={handleSubmit}
          sx={{
            width: { xs: '100%', md: 'auto' }, // Full width on small screens, auto on medium and above
            ml: { md: 2 }, // Add margin-left on medium screens and above
          }}
          style={{ fontWeight: 'bold', fontSize: '16px' }}
          size='small'
          variant='outlined'
          endIcon={<ShoppingCartIcon />}
          disabled={orderedItems.length === 0}
        >
          Calculate Price
        </Button>
      </Box>
    </GradientContainer>
  )
}

export default Home

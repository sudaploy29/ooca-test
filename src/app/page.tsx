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
  Backdrop,
  CircularProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Swal from 'sweetalert2'
import RestoreIcon from '@mui/icons-material/Restore'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { CardProps } from '@mui/material/Card'

interface StyledCardProps extends CardProps {
  bgColor?: string
}

const GradientContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'black',
  padding: theme.spacing(4),
  paddingBottom: `calc(56px + ${theme.spacing(4)}px)`,
}))

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<StyledCardProps>(({ theme, bgColor }) => ({
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  height: '120px',
  width: '290px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: bgColor || 'inherit',
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
  { id: 4, name: 'Yellow set', price: 50, color: '#d9d602', discount: '' },
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
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
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
    } finally {
      setLoading(false)
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
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          paddingBottom: '16px', // Add padding to prevent overlap
        }}
      >
        <Grid container spacing={2} justifyContent='center'>
          {itemOptions.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <StyledCard
                bgColor={item.color}
                sx={{
                  width: { xs: '100%', sm: '90%', md: '290px' },
                  height: { xs: 'auto', md: '120px' },
                }}
              >
                <CardContentStyled>
                  <Grid
                    container
                    direction='column'
                    alignContent='center'
                    alignItems='center'
                    spacing={2}
                  >
                    <Grid item>
                      <Typography
                        variant='h6'
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '24px',
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant='body2'
                        style={{
                          color: 'black',
                          fontWeight: 'bold',
                          fontSize: '12px',
                        }}
                      >
                        Price: {item.price} THB{' '}
                        {item.discount && `( ${item.discount} )`}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <FormControl fullWidth>
                        <Grid container alignItems='center' spacing={1}>
                          <Grid item>
                            <IconButton
                              onClick={() => updateItemQuantity(item.id, -1)}
                              style={{ color: 'white' }}
                            >
                              <RemoveIcon style={{ fontSize: '12px' }} />
                            </IconButton>
                          </Grid>
                          <Grid item>
                            <Typography
                              style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '18px',
                              }}
                            >
                              {orderedItems.find((o) => o.id === item.id)
                                ?.total || 0}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <IconButton
                              onClick={() => updateItemQuantity(item.id, 1)}
                              style={{ color: 'white' }}
                            >
                              <AddIcon style={{ fontSize: '12px' }} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContentStyled>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box
        sx={{
          bottom: 0,
          left: 0,
          right: 0,
          padding: 2,
          backgroundColor: 'black',
          zIndex: 1000,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-end' },
          gap: (theme) => theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
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
              fontSize: '14px',
              color: 'white',
            }}
            variant='body1'
            component='span'
          >
            Member Card ( 10% discount )
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
            width: { xs: '100%', md: 'auto' },
            ml: { md: 2 },
            color: loading || orderedItems.length === 0 ? 'grey.500' : 'white',
            borderColor:
              loading || orderedItems.length === 0 ? 'grey.500' : 'white',
            backgroundColor: (theme) =>
              loading || orderedItems.length === 0
                ? theme.palette.grey[800]
                : theme.palette.primary.main,
            '&:hover': {
              backgroundColor: (theme) =>
                loading || orderedItems.length === 0
                  ? theme.palette.grey[800]
                  : theme.palette.primary.dark,
              borderColor: 'white',
            },
          }}
          size='small'
          variant='outlined'
          endIcon={<ShoppingCartIcon />}
          disabled={loading || orderedItems.length === 0}
        >
          Calculate Price
        </Button>

        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={loading}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Box>
    </GradientContainer>
  )
}

export default Home

'use client'

import { Box, Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { styled, keyframes } from '@mui/system'
import { Analytics } from "@vercel/analytics/react"
import RobotIcon from '@mui/icons-material/SmartToy'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E90FF', // Futuristic blue
    },
    secondary: {
      main: '#FF4500', // Vibrant orange for contrast
    },
    background: {
      default: '#000000', // Black background
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          background: 'linear-gradient(45deg, #1E90FF 30%, #FF4500 90%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#1E1E1E',
            color: '#FFFFFF',
            '&.Mui-focused fieldset': {
              borderColor: '#1E90FF',
            },
            '&:hover fieldset': {
              borderColor: '#FF4500',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#FFFFFF',
          },
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto Mono, monospace', // A more techy font
  },
})

// Animation keyframes
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`

const AnimatedRobot = styled(RobotIcon)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '48px',
  color: theme.palette.primary.main,
  animation: `${fadeIn} 3s ease-out forwards`,
}))

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello there! How can I help you today?',
    },
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    if (!message.trim()) return // Do not send empty messages

    // Add user's message to the chat
    setMessages([...messages, { role: 'user', content: message }])
    setMessage('') // Clear the input field

    try {
      // Send message to your backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: message }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      // Get the response data
      const data = await response.json()

      // Add assistant's response to the chat
      setMessages([...messages, { role: 'user', content: message }, { role: 'assistant', content: data.text }])
    } catch (error) {
      console.error('Error:', error)
      // Optionally show an error message in the chat
      setMessages([...messages, { role: 'user', content: message }, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevent new line from being added
      sendMessage()
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        bgcolor="background.default"
        p={2}
        position="relative" // Ensure the box is relative for the absolute-positioned robot
      >
        {<AnimatedRobot />}
        <Stack
          direction={'column'}
          flex={1}
          border="1px solid #1E90FF"
          borderRadius="16px"
          p={2}
          spacing={3}
          bgcolor="#1A1A1A"
          overflow="hidden"
        >
          <Stack
            direction={'column'}
            spacing={2}
            flexGrow={1}
            overflow="auto"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant'
                      ? 'primary.main'
                      : 'secondary.main'
                  }
                  color="white"
                  borderRadius={16}
                  p={3}
                  maxWidth="80%"
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="outlined"
              multiline // Allows the text field to accept multiple lines, if needed
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Analytics/>
    </ThemeProvider>
  )
}

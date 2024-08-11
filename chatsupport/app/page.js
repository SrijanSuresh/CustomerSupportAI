'use client'

import { Box, Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

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

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello there! How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    if (!message.trim()) return; // Do not send empty messages

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
        p={2} // Padding for the Box to create some space around the edges
      >
        <Stack
          direction={'column'}
          flex={1} // Allow the stack to grow and fill the available space
          border="1px solid #1E90FF"
          borderRadius="16px"
          p={2}
          spacing={3}
          bgcolor="#1A1A1A"
          overflow="hidden" // Ensure the content doesn't overflow
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
              variant="outlined"
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

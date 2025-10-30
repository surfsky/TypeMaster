import { Container } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Container
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        animation: 'fadeIn 0.5s ease-in-out',
        padding: 0,
      }}>
      <Outlet />
    </Container>
  )
}

export default App

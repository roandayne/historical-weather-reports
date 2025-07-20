import { Box } from "@mui/material"
import GenerateReports from "../components/GenerateReports"

const Dashboard = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    }}>
      <GenerateReports />
    </Box>
  )
}

export default Dashboard
import { Box } from "@mui/material"
import GenerateReports from "../components/GenerateReports"

const Dashboard = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '30px 0',
    }}>
      <GenerateReports />
    </Box>
  )
}

export default Dashboard
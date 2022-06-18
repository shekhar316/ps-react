import { Box } from "@chakra-ui/react";
import { Line } from 'react-chartjs-2';

const data = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        data: [15, 20, 8, 15, 10, 22, 10],
        backgroundColor: "rgba(21, 15, 40, 1)",
        fill: true,
        borderWidth: 0.67,
        borderColor: "rgba(133, 92, 248, 1)",
        pointBorderColor:"#FFFFFF",
        pointBorderWidth: 0,
        pointRadius:0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
          display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        display: false
      },
      x: {
        beginAtZero: true,
        display: false
      }
    }
  };

const LineChart = () => {
    return (
        <Box w="100%" className="chart" mt="15%">
            <Line height={["200","100"]} data={data} options={options}/>
        </Box>
    );
}
 
export default LineChart;
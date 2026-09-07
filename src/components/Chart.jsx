import {
Bar
}
from "react-chartjs-2";


import {

Chart as ChartJS,

CategoryScale,

LinearScale,

BarElement,

Tooltip,

Legend

}

from "chart.js";


import {
useFinance
}
from "../context/FinanceContext";



ChartJS.register(

CategoryScale,

LinearScale,

BarElement,

Tooltip,

Legend

);



function Chart({ startDate, endDate }){


const {

transactions

}=useFinance();



const expenses = transactions.filter((item) => item.type === "expense")
	.filter((item) => !startDate || item.date >= startDate)
	.filter((item) => !endDate || item.date <= endDate);



const data={


labels:expenses.map(

item=>item.category

),


datasets:[

{

label:"Expenses",

data:expenses.map(

item=>item.amount

)

}

]

};



return (

<div className="chart">

<Bar data={data}/>

</div>

)

}


export default Chart;
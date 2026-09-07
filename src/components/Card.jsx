import {
motion
}
from "framer-motion";


function Card({
title,
amount,
formatCurrency
}){


return(

<motion.div

initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}

className="
bg-white/[0.03]
border
border-white/5
hover:border-indigo-500/30
rounded-2xl
p-6
transition
"


>


<p className="
text-neutral-400
">

{title}

</p>



<h2

className="
text-3xl
font-bold
mt-3
text-white
"

>

{formatCurrency ? formatCurrency(amount) : Number(amount).toLocaleString()}

</h2>


</motion.div>

)

}


export default Card;
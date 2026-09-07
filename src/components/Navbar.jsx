import {
useTheme
}
from "../context/ThemeContext";
import {
	Moon,
	Sun
} from "lucide-react";


function Navbar(){


const {
dark,
toggleTheme
}=useTheme();



return(

<div className="
p-6
bg-white
dark:bg-black
text-black
dark:text-white
border-b
border-slate-200
dark:border-white/10
flex
items-center
justify-between
">


<h1 className="text-2xl font-semibold">

Overview

</h1>


<button

onClick={toggleTheme}

className="
bg-slate-100
dark:bg-white/10
text-slate-700
dark:text-white
p-3
rounded-xl
hover:bg-slate-200
dark:hover:bg-white/20
"

>

{dark ? <Sun size={19} /> : <Moon size={19} />}

</button>


</div>

)

}


export default Navbar;
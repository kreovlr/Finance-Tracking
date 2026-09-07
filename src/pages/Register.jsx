import {
Link,
useNavigate
}
from "react-router-dom";
import { useEffect, useState } from "react";


import {
motion
}
from "framer-motion";
import { useAuth } from "../context/AuthContext";



function Register(){


const navigate = useNavigate();
const { user, register } = useAuth();
const [form, setForm] = useState({ name: "", email: "", password: "" });
const [error, setError] = useState("");

useEffect(() => {
	if (user) navigate("/dashboard", { replace: true });
}, [user, navigate]);



async function handleRegister(e){

e.preventDefault();
const validationError = await register(form.name, form.email, form.password);
setError(validationError || "");
if (!validationError) navigate("/dashboard", { replace: true });

}



return (

<div

className="
auth-shell
min-h-screen
w-screen
bg-[#0a0a0a]
flex
items-center
justify-center
text-white
overflow-hidden
"

>


<motion.div

initial={{
opacity:0,
scale:.9
}}

animate={{
opacity:1,
scale:1
}}

className="
auth-panel
w-full
max-w-md
bg-white/5
backdrop-blur-xl
border
border-white/10
rounded-3xl
p-8
"

>


<h1

className="
text-4xl
font-bold
text-center
bg-gradient-to-r
from-purple-200
to-purple-400
bg-clip-text
text-transparent
"

>

Create Account

</h1>



<form

onSubmit={handleRegister}

className="
space-y-5
mt-8
"

>

{error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}


<input

placeholder="Full Name"
value={form.name}
onChange={(e) => setForm({ ...form, name: e.target.value })}

className="
auth-input
w-full
bg-black/40
border
border-white/10
rounded-xl
p-4
"

/>



<input

placeholder="Email"
value={form.email}
onChange={(e) => setForm({ ...form, email: e.target.value })}

type="email"

className="
auth-input
w-full
bg-black/40
border
border-white/10
rounded-xl
p-4
"

/>



<input

placeholder="Password"
value={form.password}
onChange={(e) => setForm({ ...form, password: e.target.value })}

type="password"

className="
auth-input
w-full
bg-black/40
border
border-white/10
rounded-xl
p-4
"

/>



<button

className="
rose-button
w-full
bg-indigo-600
hover:bg-indigo-500
py-4
rounded-xl
font-semibold
"

>

Create Account

</button>



</form>



<p

className="
text-center
text-neutral-400
mt-6
"

>

Already have account?


<Link

to="/login"

className="
text-indigo-400
ml-2
"

>

Login

</Link>


</p>



</motion.div>


</div>

)

}


export default Register;
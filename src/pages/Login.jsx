import {
Link,
useNavigate,
useLocation
}
from "react-router-dom";
import { useEffect, useState } from "react";


import {
motion
}
from "framer-motion";
import {
	ArrowRight,
	Moon,
	Sun,
	WalletCards
} from "lucide-react";
import {
	useTheme
} from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";



function Login(){


const navigate = useNavigate();
const location = useLocation();
const { dark, toggleTheme } = useTheme();
const { user, login, resetPassword } = useAuth();
const [form, setForm] = useState({ email: "", password: "" });
const [error, setError] = useState("");
const [resetSent, setResetSent] = useState(false);
const [hasLoggedInBefore, setHasLoggedInBefore] = useState(() => localStorage.getItem("finance-tracking-has-logged-in") === "true");

useEffect(() => {
	if (user) navigate("/dashboard", { replace: true });
}, [user, navigate]);



async function handleLogin(e){

e.preventDefault();
const validationError = await login(form.email, form.password);
setError(validationError || "");
if (!validationError) {
	localStorage.setItem("finance-tracking-has-logged-in", "true");
	setHasLoggedInBefore(true);
	navigate(location.state?.from || "/dashboard", { replace: true });
}

}

async function handleReset() {
	if (!form.email) {
		setError("Enter your email first and we will send reset instructions.");
		return;
	}
	const resetError = await resetPassword(form.email);
	setError(resetError || "");
	setResetSent(!resetError);
}



return (

<div
className="
auth-shell
min-h-screen
w-screen
bg-slate-50
dark:bg-[#0a0a0a]
flex
items-center
justify-center
text-slate-900
dark:text-white
px-6
py-10
overflow-hidden
"
>

<button
	type="button"
	onClick={toggleTheme}
	aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
	className="
	absolute
	right-6
	top-6
	flex
	h-11
	w-11
	items-center
	justify-center
	rounded-full
	border
	border-slate-200
	bg-white
	text-slate-600
	shadow-sm
	transition
	hover:border-indigo-300
	hover:text-indigo-600
	dark:border-white/10
	dark:bg-white/5
	dark:text-slate-300
	dark:hover:border-indigo-400
	dark:hover:text-indigo-300
	"
>
	{dark ? <Sun size={19} /> : <Moon size={19} />}
</button>


<motion.div

initial={{
opacity:0,
y:30
}}

animate={{
opacity:1,
y:0
}}

className="
auth-panel
w-full
max-w-md
bg-white
backdrop-blur-xl
border
border-slate-200
rounded-2xl
p-8
shadow-xl
shadow-slate-200/60
dark:bg-white/5
dark:border-white/10
dark:shadow-black/30
"

>

<div className="brand-lockup" aria-label="Finance Tracking logo">
	<div className="brand-mark"><WalletCards size={27} strokeWidth={2.2} /></div>
	<span className="brand-kicker">Finance Tracking</span>
</div>


<h1

className="
text-5xl
font-bold
text-center
bg-gradient-to-r
from-purple-200
to-purple-400
bg-clip-text
text-transparent
"

>

{hasLoggedInBefore ? "Welcome back" : "Get started with Finance Tracking"}

</h1>



<p

className="
text-center
text-neutral-400
mt-3
mb-8
"

>

Manage your finances smarter

</p>




<form

onSubmit={handleLogin}

className="
space-y-5
"

>

{error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}
{resetSent && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Reset instructions sent. Check your inbox.</p>}


<input

type="email"

placeholder="Email"
value={form.email}
onChange={(e) => setForm({ ...form, email: e.target.value })}

className="
auth-input
w-full
bg-slate-50
border
border-slate-200
rounded-xl
p-3.5
text-slate-900
outline-none
focus:border-indigo-500
focus:ring-2
focus:ring-indigo-500/20
dark:bg-black/40
dark:border-white/10
dark:text-white
"

/>



<input

type="password"

placeholder="Password"
value={form.password}
onChange={(e) => setForm({ ...form, password: e.target.value })}

className="
auth-input
w-full
bg-slate-50
border
border-slate-200
rounded-xl
p-3.5
text-slate-900
outline-none
focus:border-indigo-500
focus:ring-2
focus:ring-indigo-500/20
dark:bg-black/40
dark:border-white/10
dark:text-white
"

/>




<button

className="
rose-button
w-full
bg-indigo-600
hover:bg-indigo-500
py-3.5
rounded-xl
font-semibold
transition
flex
items-center
justify-center
gap-2
"

>

Sign In

<ArrowRight size={18} />

</button>


</form>

<button
	type="button"
	onClick={handleReset}
	className="mt-4 w-full text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-300"
>
	Forgot password?
</button>



<p

className="
text-center
text-neutral-400
mt-6
"

>


Don't have an account?


<Link

to="/register"

className="
text-indigo-400
ml-2
hover:text-indigo-300
"

>

Register

</Link>


</p>



</motion.div>



</div>

)

}


export default Login;
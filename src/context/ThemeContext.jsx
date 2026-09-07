/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";


const ThemeContext = createContext();



export function ThemeProvider({children}){


const [dark, setDark] = useState(() => {
  const savedTheme = window.localStorage.getItem("fintrack-theme");
  return savedTheme ? savedTheme === "dark" : true;
});


useEffect(() => {
  document.documentElement.classList.toggle("dark", dark);
  window.localStorage.setItem("fintrack-theme", dark ? "dark" : "light");
}, [dark]);


function toggleTheme(){
  setDark((currentTheme) => !currentTheme);
}



return(

<ThemeContext.Provider

value={{
dark,
toggleTheme
}}

>

{children}

</ThemeContext.Provider>

)


}



export function useTheme(){

return useContext(ThemeContext);

}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import react from "react";
import Header from "../components/Header";
import Footer from "../components/Footer"

const Login=()=>{
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [isLoggedIn, setIsLoggedIn]=useState(false);
    const navigate=useNavigate();
    
    //useeffect hook bas starting mei dekhega ki does localstorage containks token or not
    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(token) setIsLoggedIn(true);
    }, []); //When the dependency array is empty, it tells React to run the effect only once, after the initial render of the component.
    //When the dependency array in a useEffect hook contains one or more values, React will execute the effect function not only after the initial render but also whenever any of the values in the dependency array change.

    const handle = async(e) =>{
        e.preventDefault();
        try{
            const response=await fetch(`http://localhost:5000/api/auth/login`, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    email: email,
                    password:password,
                })
            });

            if (!response.ok) {
                // Handle HTTP errors
                console.log("http error");
            }
            else{
                const data = await response.json();
                if(data.token){
                    localStorage.setItem('token', data.token);
                    setIsLoggedIn(true);
                    navigate("/");
                }
                else{
                    //backend se jo data aa raha hai after login successful, usme token nahi hai
                    console.log("no token found in response");
                    
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const handleLogout=()=>{
        localStorage.removeItem('token');
        navigate("/");
    }

    return(
        <div>
            <Header />
            <div className="login-container">
                <h1 className="login-title">{isLoggedIn? <h6>Logging out already? Don't worry, we'll keep the snacks warm for your return! 🍪</h6> : "Login"}</h1>
                {
                    isLoggedIn? (<button onClick={handleLogout} className="logout-button">Logout</button>)
                    : (
                        <form onSubmit={handle} className="login-form">
                            <input
                                type="email"
                                placeholder="Email id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                            />
                            <button type="submit" className="login-button">Login</button>
                        </form>
                    )
                }
            </div>
            <Footer />
        </div>
    )
}

export default Login;
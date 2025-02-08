import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement> )=> {
        e.preventDefault();

        if(password!==confirmPassword){
            setError("Password & confirm password are different")
        }

        try {
            const res = await fetch('/api/auth/register',{ 
                method: "POST",
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({name, email, password}),
            });    

            const data = res.json();
            if(!res.ok){
                setError("Refistration Failed");
            }

            router.push('/login');
        } 
        catch (error) {
            
        }
    }

  return (

    <div>page</div>
  )
}

export default Register
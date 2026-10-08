
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import{useFormStatus} from 'react-dom'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import {useMutation} from '@tanstack/react-query'
import axios from "axios";
import api from '../../lib/api/apiClient'
import { extractErrorMesage } from '../../util/errUtiuls'


const RegisterForm = () => {
    const navigate= useNavigate()
    
const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
})

const [error, setError] = useState(null)

const handleChange = (e) => {
    const { name, value } = e.target

    setFormValues({
        ...formValues,
        [name]: value
    })
}

const registerMutation = useMutation({
    mutationFn: async (userData) => {
        const response = await api.post(
            "/auth/register",
            userData
        )

        return response.data
    },

    onSuccess: (data) => {
        console.log("data", data)
        navigate("/login")
    },

    onError: (err) => {
    console.error("REGISTER ERROR:", error)
              setError(extractErrorMesage(err))

   }
})

const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    if (
        !formValues.name ||
        !formValues.email ||
        !formValues.password ||
        !formValues.confirmPassword
    ) {
        setError("All fields are required")
        return
    }

    if (formValues.password !== formValues.confirmPassword) {
        setError("Passwords do not match")
        return
    }

    registerMutation.mutate({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password
    })
}
 




  return (
   <Card className="w-full boder-boder">
    <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl text-center"> Create an account</CardTitle>
        <CardDescription className={'text-center'}> inter your details to register</CardDescription>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 ">
                     {
                            error && (
                                <div className='p-3 bg-destructive/10 text-destructive text-sm rounded-md'>
                                    {error}
                                </div>
                            )
                        }
                <div className='space-y-2'>
                    <div className='text-sm font-medium text-left'>
                        full name
                    </div>
                    < Input name="name" placeholder="hamuda osman" required value={formValues.name} onChange={handleChange}/>
                    </div>

                        <div className='space-y-2'>
                    <div className='text-sm font-medium text-left'>
                        email
                    </div>
                    < Input name="email" placeholder="osman@gmail.com" required value={formValues.email} onChange={handleChange}/>
                    </div>

                        <div className='space-y-2'>
                    <div className='text-sm font-medium text-left'>
                        password
                    </div>
                    < Input name="password" type="password" placeholder="****" required value={formValues.password} onChange={handleChange}/>
                    </div>
                        <div className='space-y-2'>
                    <div className='text-sm font-medium text-left'>
                        confirm password
                    </div>
                    < Input name="confirmPassword"  type='password'placeholder="****" required value={formValues.confirmPassword} onChange={handleChange}/>
                    </div>
               
                     <div className='py-4 '>
                        {/* soo aqri mutation */}
                       <Button  type="submit" className={'w-full cursor-pointer'}>
            {registerMutation.isPending? ( <span className='flex items-center gap-2'> <LoaderCircle /> Creating account...</span>): ("Create account")}
        </Button>
            </div>
            </CardContent>
           
            <CardFooter className="flex justify-center pt-0">
                <div className='text-center text-sm'>
                    allready have a account ? <a   onClick={() => navigate('/login')}className='text-primary hover:underline cursor-pointer'> sing in </a>
                </div>
            </CardFooter>
        </form>
    </CardHeader>

   </Card>
  )
}

export default RegisterForm
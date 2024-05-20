import { useState } from "react"
import { BottomWarning } from "./BottomWarning"
import { Button } from "./Button"
import Heading from "./Heading"
import { InputBox } from "./InputBox"
import SubHeading from "./SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"
function Signup() {
  const [firstname, setFirstName] = useState("")
  const [lastname, setLastname] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigation = useNavigate()
  async function handleSignupClick(){
    const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
      username,
      firstname,
      lastname,
      password
    })
    localStorage.setItem("token",response.data.token)
    navigation("/dashboard")
  }
  return <div className="bg-slate-300 h-screen flex justify-center">
  <div className="flex flex-col justify-center">
    <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
      <Heading label={"Sign up"} />
      <SubHeading label={"Enter your infromation to create an account"} />
      <InputBox onChange={e=>setFirstName(e.target.value)} placeholder="John" label={"First Name"} />
      <InputBox onChange={e=>setLastname(e.target.value)} placeholder="Doe" label={"Last Name"} />
      <InputBox onChange={e=>setUsername(e.target.value)} placeholder="harkirat@gmail.com" label={"Email"} />
      <InputBox onChange={e=>setPassword(e.target.value)} placeholder="123456" label={"Password"} />
      <div className="pt-4">
        <Button onClick={handleSignupClick} label={"Sign up"} />
      </div>
      <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
    </div>
  </div>
</div>
}

export default Signup
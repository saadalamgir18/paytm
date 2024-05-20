import Appbar from "./Appbar"
import Balance from "./Balance"
import Users from "./User"

function Dashboard() {
  return (
    <div>
      < Appbar/>
      <div className="m-8">
        <Balance value={"10,000"} />
        <Users />
      </div>
    </div>
  )
}

export default Dashboard
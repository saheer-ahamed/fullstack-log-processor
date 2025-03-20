import { signOut } from '../../utils/serverActions/auth'
import { redirect } from 'next/navigation'

const Logout = async () => {
    await signOut()
  redirect('/login')
}

export default Logout

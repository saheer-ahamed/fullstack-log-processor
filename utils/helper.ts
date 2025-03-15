import { toast } from 'react-hot-toast'

interface ToastMessageProps {
  message: string
  type: 'success' | 'error'
}

export const toastMessage = ({ message, type }: ToastMessageProps) => {
  return toast[type](message, { removeDelay: 2000 })
}
import Header from '@/components/header'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default Layout

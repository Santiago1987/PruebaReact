import { useUser } from '../hooks/useUsers'

export const Result = () => {
  const { users } = useUser() // este estado es global para App

  return (<h3>Resultados {users.length}</h3>)
}

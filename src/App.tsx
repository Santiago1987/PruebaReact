import { useState, useMemo } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import { UserList } from './components/UsersList'
import { useUser } from './hooks/useUsers'
import { Result } from './components/Results'

function App () {
  const { isError, isLoading, refetch, fetchNextPage, users, hasNextPage } = useUser()

  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  // const origianlUsers = useRef<User[]>([])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleDelete = (email: string) => {
    // const filteredUsers = users.filter(user => user.email !== email)
    // setUsers(filteredUsers)
  }

  const handleReset = async () => {
    await refetch()
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  const filterUser = useMemo(() => {
    return (
      typeof filterCountry === 'string' && filterCountry.length > 0
        ? users.filter(user => {
          return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
        })
        : users
    )
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filterUser

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last
    }

    return filterUser.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filterUser, sorting])

  return <>
  <div className='App'>
  <h1>Prueba tecnica</h1>
    <Result />
  <header>
    <button onClick={toggleColors}>Colorear filas</button>
    <button onClick={toggleSortByCountry}>{sorting === SortBy.COUNTRY ? 'Ordenar por pais' : 'No ordenar por pais'}</button>
    <button onClick={() => { void handleReset }}>Restablecer usuarios</button>
    <input placeholder='filtrar por pais' onChange={(e) => { setFilterCountry(e.target.value) }}/>
  </header>
  <main>
    {users.length > 0 && <UserList showColors={showColors} users={sortedUsers} deleteUser={handleDelete}
     changeSorting={handleChangeSort}
     />}
    {isLoading && <p>Cargando</p>}
    {!isLoading && isError && <p>Ha ocurrido un error</p>}
    {!isLoading && !isError && hasNextPage === true && <button onClick={() => { void fetchNextPage() }}>Cargar mas</button>}
    {hasNextPage === false && <p>No hay mas resultados</p>}
  </main>
  </div>

  </>
}

export default App

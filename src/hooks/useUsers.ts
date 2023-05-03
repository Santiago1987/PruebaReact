import { fetchUsers } from '../servises/fetchData'
import { useInfiniteQuery } from '@tanstack/react-query'
import { type User } from '../types'

export const useUser = () => {
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery<{ nextCursor?: number, users: User[] }>(
    ['users'], // key porque los datos se cachean y pueden ser recuperados usando esto
    fetchUsers,
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false // para que no vuelva a hacer un fetch en el focus de la pagina
    }
  )

  return ({
    refetch,
    fetchNextPage,
    isError,
    isLoading,
    users: data?.pages?.flatMap(page => page.users) ?? [],
    hasNextPage
  })
}

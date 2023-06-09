export const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }) => {
  return await fetch(`https://randomuser.me/api?results=10&seed=sra&page=${pageParam}`)
    .then(async res => {
      if (!res.ok) throw new Error('Error en la peticion')
      return await res.json()
    })
    .then(res => ({
      users: res.results,
      nextCursor: (Number(res.info.page) + 1) > 4 ? undefined : Number(res.info.page) + 1
    }))
}

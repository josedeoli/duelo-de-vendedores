import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useDuelo(dueloId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('duelos')
      .select('*')
      .eq('duelo_id', dueloId)
      .limit(1)
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else if (data && data.length > 0) setData(data[0])
        else setError('Linha não encontrada. Insira os dados no Supabase.')
        setLoading(false)
      })

    const channel = supabase
      .channel(`duelo-${dueloId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'duelos', filter: `duelo_id=eq.${dueloId}` },
        payload => setData(payload.new)
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [dueloId])

  return { data, loading, error }
}

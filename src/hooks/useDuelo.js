import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useDuelo(dueloId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('duelos')
      .select('*')
      .eq('duelo_id', dueloId)
      .single()
      .then(({ data }) => {
        if (data) setData(data)
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

  return { data, loading }
}

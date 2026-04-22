import { useEffect, useState } from 'react'

export const reload = <TValue>(value: TValue, delay = 350) => {
    const [reloadValue, setReloadValue] = useState(value)

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setReloadValue(value)
        }, delay)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [delay, value])

    return reloadValue
}

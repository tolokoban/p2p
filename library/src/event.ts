export class GenericEvent<T> {
    private readonly listeners = new Set<Listener<T>>()

    addListener(listener: Listener<T>) {
        this.listeners.add(listener)
    }

    removeListener(listener: Listener<T>) {
        this.listeners.delete(listener)
    }

    dispatch(value: T) {
        for (const listener of this.listeners) listener(value)
    }
}

type Listener<T> = (value: T) => void

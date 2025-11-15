export interface Condition {
    field: string
    operator: string
    value: any
}

// shape of rule
export interface Shape {
    id: string
    name: string
    conditions: Condition[]
    action: {
        type: string
        value: any
    }
    priority: number
}
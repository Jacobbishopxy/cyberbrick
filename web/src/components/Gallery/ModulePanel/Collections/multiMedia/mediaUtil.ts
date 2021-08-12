
export function MongoContentValidation(data?: Record<string, any>) {
    //to query a mongodb, we need mongo objectID and collection name
    if (data?.id && data?.collection) return true
    return false
}
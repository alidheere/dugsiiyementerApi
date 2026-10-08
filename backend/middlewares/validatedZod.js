
export const validate= (schema)=>(req, res,next)=>{
    const reselt= schema.safeParse(req.body)
    console.log('reselt', reselt)
    if(!reselt.success){
        const formatted= reselt.error.format()
        console.log('formatted', formatted)
        return res.status(400).json({
            success: false,
            message: "validation failed",
           errors: Object.keys(formatted).map(field => ({
        field,
        message: formatted[field]?._errors?.[0] || 'Invalid input'
      }))
        })
    }
    next()
}
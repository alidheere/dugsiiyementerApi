let posts=[
    {id:1, title:'First Post', content:'This is the first post'},
    {id:2, title:'Second Post', content:'This is the second post'},
    {id:3, title:'Third Post', content:'This is the third post'}
];


exports.getPosts=(req, res)=>{

    res.json(posts)
}

exports.getPost=(req, res)=>{
    const post= posts.find(p=> p.id== req.params.id);
    if(!post) return res.status(404).send({message:'post not found'});
    res.json(post)
}

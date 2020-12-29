
module.exports = function(io,Users){
    
    const users = new Users();

    io.on('connect', (socket) => {

       
        
        socket.on('join', (params, callback) => {
            console.log('User connected',params.room)
            socket.join(params.room);
            
            users.AddUserData(socket.id, params.name, params.room);
            console.log(users)
            
            io.to(params.room).emit('usersList', users.GetUsersList(params.room));
            
            callback();
        });
        
        socket.on('createMessage', (message,callback) => {
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.sender,
                image: message.userPic
            });

            callback()
        });
        
        socket.on('disconnect', () => {
            var user = users.RemoveUser(socket.id);
            
            if(user){
                io.to(user.room).emit('usersList', users.GetUsersList(user.room));
            }
        })
    });
}













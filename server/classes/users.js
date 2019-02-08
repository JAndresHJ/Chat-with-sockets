
class Users {

    constructor(){
        this.users = [];
    }

    addUser(id, name, room){
        let user = {id , name, room};
        this.users.push(user);
        return this.users;
    }

    getUser(id){
        let user = this.users.filter( user => user.id === id )[0]; //returns the first element that match the id
        return user;
    }

    getUsers(){
        return this.users;
    }

    getUsersByRoom(room){
        let usersInRoom = this.users.filter( user =>  user.room === room );
        return usersInRoom;
    }    

    deleteUser(id){
        let deletedUser = this.getUser(id);
        this.users = this.users.filter( user => user.id != id );
        return deletedUser // the deleted person is returned just for reference
    }

}

module.exports = {
    Users
}

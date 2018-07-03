//addUser(id, name, room)

//removeUser(id)

//getUser(id)

//getUserList(room)

class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
      var room = room.toLowerCase();
      console.log(room);
      var user = {id, name, room};
      this.users.push(user);
      return user;
  }

  getUser (id) {
   return this.users.filter((user) => user.id === id)[0];
  }

  removeUser (id) {
    var user = this.getUser(id);
    
    if (user) {
        this.users = this.users.filter((user) => user.id !== id);
    }
    
    return user;
  }

  getUserList (room) {
   var users = this.users.filter((user) => user.room === room);   
   var namesArray = users.map((user) => user.name);

   return namesArray;
  }

  checkIfUserExists (name) {
   var users = this.users;
   var filteredUsers = users.filter((user) => user.name === name);
   return filteredUsers.length;
  }

}

module.exports = {Users};

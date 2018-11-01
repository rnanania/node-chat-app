const expect = require('expect');
const { Users } = require('./users');


describe('Users', () => {
    var users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,
            name: 'Rohit',
            room: 'NodeJS'

        },{
            id: 2,
            name: 'Vishal',
            room: 'NodeJS'

        },{
            id: 3,
            name: 'Luris',
            room: 'React'

        }]
    });

    it('should add new user.', ()=> {
        var users = new Users();
        var user = {
            id: 123,
            name: 'Dave',
            room: 'The flash Guy'
        };
        var resUsers = users.addUser(user.id, user.name,user.room);
        expect(resUsers).toBeDefined();
        expect(users.users).toEqual([resUsers]);
        expect(1).toBe(1);
    });

    it('should remove user.', ()=> {
        var user = users.removeUser(1);
        expect(user).toBeDefined();
        expect(user.name).toEqual('Rohit');
        expect(user.id).toEqual(1);
        expect(users.users.length).toEqual(2);
    });
    
    it('should not remove user.', ()=> {
        var user = users.removeUser('NodeJS');
        expect(user).toBeUndefined();
        expect(users.users.length).toEqual(3);
    });
    
    it('should find user.', ()=> {
        var user = users.getUser(1);
        expect(user).toBeDefined();
        expect(user.name).toEqual('Rohit');
        expect(user.id).toEqual(1);
    });
    
    it('should not find user.', ()=> {
        var user = users.getUser('NodeJS');
        expect(user).toBeUndefined();
    });     

    it('should return name for NodeJS room.', ()=> {
        var userList = users.getUserList('NodeJS');
        expect(userList).toBeDefined();
        expect(userList).toEqual(['Rohit','Vishal']);
    });
});

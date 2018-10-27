var expect = require('expect');
var { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', ()=> {
        var from = 'Rohit';
        var text = 'Some Message';
        var message = generateMessage(from, text);
        expect(message).toBeDefined();
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from, text});
    });
});


describe('generateLocationMessage', () => {
    it('should generate correct location message object', ()=> {
        var from = 'Rohit';
        var message = generateLocationMessage(from, 1, 1);
        expect(message).toBeDefined();
        expect(typeof message.url).toBe('string');
        expect(message.url).toBe('https://www.google.com/maps?q=1,1');
    });
});
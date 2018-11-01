const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', ()=> {
        expect(isRealString(98)).toBeFalsy();
        expect(isRealString(null)).toBeFalsy();
    });

    it('should reject string with only spaces', ()=> {
        expect(isRealString("    ")).toBeFalsy();
    });

    it('should allow valida string', ()=> {
        expect(isRealString("Rohit")).toBeTruthy();
    });

});
/**
 * Unit Test: checkItemName Function
 * 
 * This unit test suite covers the testing of the checkItemName function.
 * It validates the behavior of the function for different input scenarios.
 * 
 * Example Usage:
 * - Run the test suite using a testing framework (e.g., Jest).
 * - Each test case checks the expected behavior of the checkItemName function.
 */

const {checkItemName} = require("../../helpers/endpointHelpers");

// Test Suite
describe('Unit Test: checkItemName Function', () => {
    
    // Test Cases
    test('should return false for an empty string', () => {
        expect(checkItemName("")).toBe(false);
    });

    test('should return false for null value', () => {
        expect(checkItemName(null)).toBe(false);
    });

    test('should return false for a short name (length <= 1)', () => {
        expect(checkItemName("i")).toBe(false);
    });

    test('should return true for a valid name which is 2 characters long', () => {
        expect(checkItemName("CD")).toBe(true); 
    });

    test('should return false for non-string input', () => {
        expect(checkItemName(1)).toBe(false);
    });

    test('should return false for a long name (length > 24)', () => {
        expect(checkItemName("aznsfdijsbqifbdijsqbsihdbfihjsbdhfbyohqvspiudbipfabidvbaouhbvfdoibaihvbdhabhousvfdusvauvdfyhabofuyeazvofuasbvouhdfbvhoua")).toBe(false);
    });

    test('should return false for boolean input', () => {
        expect(checkItemName(false)).toBe(false);
    });

    test('should return false for undefined input', () => {
        expect(checkItemName(undefined)).toBe(false);
    });

    test('should return true for a valid name with proper formatting', () => {
        expect(checkItemName("Closet")).toBe(true);
    });

    test('should return true for a valid name with spaces', () => {
        expect(checkItemName("Underwater Camera")).toBe(true);
    });
    
    test('should return false for a name with trailing space', () => {
        expect(checkItemName("Stick ")).toBe(false);
    });
    
    test('should return false for a name with leading space', () => {
        expect(checkItemName("  Book")).toBe(false);
    });
    
    test('should return true for a valid name with hyphens and proper formatting', () => {
        expect(checkItemName("T-Shirt")).toBe(true);
    });
    
    test('should return false for a name with special characters', () => {
        expect(checkItemName("&")).toBe(false);
    });
    
    test('should return false for a name with special characters in combination with letters', () => {
        expect(checkItemName("Cable&AnotherCable")).toBe(false);
    });
    
    test('should return false for a name ending with colon', () => {
        expect(checkItemName("bottle:")).toBe(false);
    });
    
    test('should return false for a numeric name', () => {
        expect(checkItemName("123")).toBe(false);
    });
    
    test('should return false for a numeric name with alphabetic characters', () => {
        expect(checkItemName("3couch")).toBe(false);
    });

});
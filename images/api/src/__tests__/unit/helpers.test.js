const {checkItemName} = require("../../helpers/endpointHelpers");

test("Check Item Name",() => {
    expect(checkItemName("")).toBe(false);
    expect(checkItemName(null)).toBe(false);
    expect(checkItemName("i")).toBe(false);
    expect(checkItemName("CD")).toBe(true);
    expect(checkItemName(1)).toBe(false);
    expect(checkItemName("aznsfdijsbqifbdijsqbsihdbfihjsbdhfbyohqvspiudbipfabidvbaouhbvfdoibaihvbdhabhousvfdusvauvdfyhabofuyeazvofuasbvouhdfbvhoua")).toBe(false);
    expect(checkItemName(false)).toBe(false);
    expect(checkItemName(undefined)).toBe(false);
    expect(checkItemName("Closet")).toBe(true);
    expect(checkItemName("Underwater Camera")).toBe(true);
    expect(checkItemName("Stick ")).toBe(false);
    expect(checkItemName("Table  ")).toBe(false);
    expect(checkItemName("  Book")).toBe(false);
    expect(checkItemName("T-Shirt")).toBe(true);
    expect(checkItemName("Screen ")).toBe(false);
    expect(checkItemName("&")).toBe(false);
    expect(checkItemName("Cable&AnotherCable")).toBe(false);
    expect(checkItemName("bottle:")).toBe(false);
    expect(checkItemName("123")).toBe(false);
    expect(checkItemName("3couch")).toBe(false);
})
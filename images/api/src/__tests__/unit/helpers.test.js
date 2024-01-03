const {checkItemName} = require("../../helpers/endpointHelpers");

test("Check Item Name",() => {
    expect(checkItemName("")).toBe(false);
    expect(checkItemName(null)).toBe(false);
    expect(checkItemName("i")).toBe(false);
    expect(checkItemName(1)).toBe(false);
    expect(checkItemName("aznsfdijsbqifbdijsqbsihdbfihjsbdhfbyohqvspiudbipfabidvbaouhbvfdoibaihvbdhabhousvfdusvauvdfyhabofuyeazvofuasbvouhdfbvhoua")).toBe(false);
    expect(checkItemName(false)).toBe(false);
    expect(checkItemName(undefined)).toBe(false);
    expect(checkItemName("Henk")).toBe(true);
    expect(checkItemName("Anne Marie")).toBe(true);
    expect(checkItemName("Anne ")).toBe(false);
    expect(checkItemName("Anne  ")).toBe(false);
    expect(checkItemName("  Anne")).toBe(false);
    expect(checkItemName("Anne-Marie")).toBe(true);
    expect(checkItemName("Anne-Marie ")).toBe(false);
    expect(checkItemName("&")).toBe(false);
    expect(checkItemName("Anne&Marie")).toBe(false);
    expect(checkItemName("Henk:")).toBe(false);
    expect(checkItemName("123")).toBe(false);
    expect(checkItemName("Henk3")).toBe(false);

})
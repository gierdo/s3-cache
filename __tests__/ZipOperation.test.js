const utils = require('../utils.js')

jest.setTimeout(10000)

test('test utils', async () => {
  const input = "foo\nbar\nbaz"

  const output = utils.splitStringToArray(input)

  expect(output).toEqual(['foo', 'bar', 'baz'])

})

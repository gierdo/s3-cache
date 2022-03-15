const ZipOperation = require('../ZipOperation.js');
const utils = require('../utils.js')

jest.setTimeout(10000)

test('test utils', async () => {
  const input = "foo\nbar\nbaz"

  const output = utils.splitStringToArray(input)

  expect(output).toEqual(['foo', 'bar', 'baz'])

})


test('test multipart zip', async () => {
  const input = "testfiles/foo\ntestfiles/foo2\ntestfiles/foo3"

  const sources = utils.splitStringToArray(input);

  const zipOperation = new ZipOperation();

  const output = await zipOperation.zipFile("testarchive", sources)


  console.log(output)
})

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

  const sources = utils.resolveFilePaths(utils.splitStringToArray(input));

  const zipOperation = new ZipOperation();

  await zipOperation.zipFile("testfiles/testarchive.tar", sources)

  await zipOperation.unzipFile("testfiles/testarchive.tar", "/")
})

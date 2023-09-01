import getDeepAttributeInObject from './getDeepAttributeInObject';

describe('getDeepAttributeInObject', () => {

  const obj = {
    foo: {
      bar: 'someValue'
    }
  }

  it('Show return object attribute if receive valid key', async () => {
    expect(getDeepAttributeInObject(obj, 'foo')).toStrictEqual(obj.foo);
  });

  it('Show return undefined if attribute does not exist', async () => {
    expect(getDeepAttributeInObject(obj, 'xyz')).toStrictEqual(undefined);
  });


  it('Show return deep attribute if key contains .', async () => {
    expect(getDeepAttributeInObject({
      foo: {
        bar: 'someValue'
      }
    }, 'foo.bar')).toStrictEqual('someValue');
  });

});


export default function getDeepAttributeInObject(obj: Record<string, any>, key:string): any {
  if ( !key.includes('.')) return obj[key]

  return key.split('.').reduce((acc, k) => acc ? acc[k] : undefined, obj);
}